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

    // Verify Privy token
    const privyAppId = Deno.env.get("VITE_PRIVY_APP_ID") || "cm9w0ngtc00hwgx7i25w31lp7";
    const privyAppSecret = Deno.env.get("PRIVY_APP_SECRET");

    if (!privyAppSecret) {
      console.error("PRIVY_APP_SECRET not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify token with Privy
    const verifyResponse = await fetch("https://auth.privy.io/api/v1/token/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "privy-app-id": privyAppId,
        Authorization: `Basic ${btoa(`${privyAppId}:${privyAppSecret}`)}`,
      },
      body: JSON.stringify({ token: privyToken }),
    });

    if (!verifyResponse.ok) {
      console.error("Privy token verification failed:", await verifyResponse.text());
      return new Response(
        JSON.stringify({ error: "Invalid authentication token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const verifyData = await verifyResponse.json();
    const privyUserId = verifyData.user_id;

    if (!privyUserId) {
      return new Response(
        JSON.stringify({ error: "Could not extract user ID from token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body: ContributionRequest = await req.json();
    const { appUserId, vehicle, amountMxn, amountUsd, network, financialContract, txHash } = body;

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
        amount_usd: amountUsd,
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
