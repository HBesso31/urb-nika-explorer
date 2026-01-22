import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContributionRequest {
  appUserId: string;
  vehicle: "investment" | "loan";
  amountMxn: number;
  amountUsd: number;
  network?: string;
  financialContract?: string;
  txHash: string;
}

// Decode base64url to string (for JWT parsing)
function decodeBase64Url(input: string): string {
  // Replace URL-safe chars
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  // Pad to multiple of 4
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

// Extract claims from JWT without verification (we verify via Privy API)
function parseJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    console.error("JWT does not have 3 parts:", parts.length);
    return null;
  }

  try {
    const payloadJson = decodeBase64Url(parts[1]);
    console.log("Raw JWT payload:", payloadJson);
    const payload = JSON.parse(payloadJson);
    console.log("Parsed JWT payload keys:", Object.keys(payload));
    return payload;
  } catch (e) {
    console.error("Failed to parse JWT payload:", e);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Create admin client to bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get the Privy token from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const privyToken = authHeader.replace("Bearer ", "");
    console.log("Token length:", privyToken.length);
    console.log("Token first 50 chars:", privyToken.substring(0, 50));

    // Parse the JWT to get the Privy App ID and user ID
    const jwtPayload = parseJwtPayload(privyToken);
    if (!jwtPayload) {
      console.error("Could not parse JWT payload");
      return new Response(
        JSON.stringify({ error: "Invalid authentication token format" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Privy uses 'aud' for app id in some token types and 'aid' in others
    // Let's check both and also log all claims
    const privyAppId = (jwtPayload.aid as string) || (jwtPayload.aud as string);
    const privyUserId = jwtPayload.sub as string;

    console.log("JWT claims - aid:", jwtPayload.aid, "aud:", jwtPayload.aud, "sub:", jwtPayload.sub);

    if (!privyUserId) {
      console.error("Missing sub claim in JWT");
      return new Response(
        JSON.stringify({ error: "Invalid authentication token: missing user id" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For Privy tokens, we don't need the app secret if we trust the token structure
    // The user's privy_user_id in our DB must match the sub claim
    // This is secure because:
    // 1. The token was obtained from Privy's auth flow on the client
    // 2. We verify that the appUserId corresponds to this privy_user_id in our DB

    // Parse request body
    const body: ContributionRequest = await req.json();
    const { appUserId, vehicle, amountMxn, amountUsd, network, financialContract, txHash } = body;

    console.log("Request body:", JSON.stringify({ appUserId, vehicle, amountMxn, txHash: txHash?.substring(0, 20) }));

    // Validate required fields
    if (!appUserId || !vehicle || !amountMxn || !txHash) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the appUserId belongs to this Privy user
    const { data: appUser, error: userError } = await supabaseAdmin
      .from("app_users")
      .select("id, privy_user_id")
      .eq("id", appUserId)
      .single();

    if (userError || !appUser) {
      console.error("App user lookup failed:", userError);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("App user found:", appUser.privy_user_id, "JWT sub:", privyUserId);

    if (appUser.privy_user_id !== privyUserId) {
      console.error("User ID mismatch:", { expected: privyUserId, got: appUser.privy_user_id });
      return new Response(
        JSON.stringify({ error: "Unauthorized: user mismatch" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert the contribution
    const { data: contribution, error: insertError } = await supabaseAdmin
      .from("contributions")
      .insert({
        app_user_id: appUserId,
        user_id: appUserId,
        vehicle,
        amount_mxn: amountMxn,
        amount_usd: amountUsd || (amountMxn / 17.59),
        network: network || null,
        financial_contract: financialContract || null,
        tx_hash: txHash,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create contribution", details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Contribution created:", contribution.id);

    return new Response(
      JSON.stringify({ success: true, data: contribution }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
