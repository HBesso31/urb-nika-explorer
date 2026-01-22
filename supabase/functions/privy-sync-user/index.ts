import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SyncUserRequest {
  privy_user_id: string;
  email?: string | null;
  wallet_address?: string | null;
  auth_method: 'wallet' | 'email';
}

// Admin whitelists from environment
const ADMIN_WHITELIST_EMAILS = (Deno.env.get('ADMIN_WHITELIST_EMAILS') || 'humberto.besso@gmail.com')
  .split(',')
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean);

const ADMIN_WHITELIST_WALLETS = (Deno.env.get('ADMIN_WHITELIST_WALLETS') || '')
  .split(',')
  .map((w: string) => w.trim().toLowerCase())
  .filter(Boolean);

function isAdminWhitelisted(email: string | null, wallet: string | null): boolean {
  if (email && ADMIN_WHITELIST_EMAILS.includes(email.toLowerCase())) return true;
  if (wallet && ADMIN_WHITELIST_WALLETS.includes(wallet.toLowerCase())) return true;
  return false;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Use service role to bypass RLS for upsert
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: SyncUserRequest = await req.json();
    const { privy_user_id, email, wallet_address, auth_method } = body;

    if (!privy_user_id) {
      return new Response(
        JSON.stringify({ error: 'privy_user_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upsert app_users record
    const { data: user, error: upsertError } = await supabase
      .from('app_users')
      .upsert(
        {
          privy_user_id,
          email: email || null,
          wallet_address: wallet_address || null,
          auth_method,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'privy_user_id',
        }
      )
      .select()
      .single();

    if (upsertError) {
      console.error('Upsert error:', upsertError);
      return new Response(
        JSON.stringify({ error: 'Failed to sync user', details: upsertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin (via whitelist)
    const isAdmin = isAdminWhitelisted(email || null, wallet_address || null);

    // TODO: Optionally sync role to user_roles table for existing RLS policies
    // For now, admin check is done via whitelist in the client and edge functions

    return new Response(
      JSON.stringify({ 
        user, 
        is_admin: isAdmin,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in privy-sync-user:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
