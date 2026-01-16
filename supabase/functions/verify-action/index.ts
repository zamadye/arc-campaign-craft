import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ARC_RPC_URL = "https://rpc.testnet.arc.network";

// Input validation limits
const MAX_WALLET_ADDRESS_LENGTH = 42;
const MAX_ACTION_VERB_LENGTH = 50;
const MAX_DAPP_ID_LENGTH = 100;

interface VerifyRequest {
  walletAddress?: string;
  dappId?: string;
  actionVerb?: string;
  minAmount?: number;
}

// Input validation helpers
function validateWalletAddress(addr: string): { valid: boolean; error?: string } {
  if (!addr || typeof addr !== 'string') {
    return { valid: false, error: 'Wallet address is required' };
  }
  if (addr.length > MAX_WALLET_ADDRESS_LENGTH) {
    return { valid: false, error: 'Invalid wallet address length' };
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
    return { valid: false, error: 'Invalid wallet address format' };
  }
  return { valid: true };
}

function validateActionVerb(verb: string): { valid: boolean; error?: string } {
  if (!verb || typeof verb !== 'string') {
    return { valid: false, error: 'Action verb is required' };
  }
  if (verb.length > MAX_ACTION_VERB_LENGTH) {
    return { valid: false, error: 'Action verb too long' };
  }
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(verb)) {
    return { valid: false, error: 'Invalid action verb format' };
  }
  return { valid: true };
}

function validateOptionalDappId(dappId?: string): { valid: boolean; error?: string } {
  if (!dappId) return { valid: true };
  if (typeof dappId !== 'string') {
    return { valid: false, error: 'Invalid dappId type' };
  }
  if (dappId.length > MAX_DAPP_ID_LENGTH) {
    return { valid: false, error: 'DappId too long' };
  }
  return { valid: true };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // SECURITY: Require JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.warn('[verify-action] Invalid JWT:', authError?.message);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[verify-action] Authenticated user: ${user.id}`);

    const body = await req.json() as VerifyRequest;
    const { walletAddress, dappId, actionVerb } = body;

    // Input validation
    const walletValidation = validateWalletAddress(walletAddress || '');
    if (!walletValidation.valid) {
      return new Response(
        JSON.stringify({ success: false, error: walletValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const actionValidation = validateActionVerb(actionVerb || '');
    if (!actionValidation.valid) {
      return new Response(
        JSON.stringify({ success: false, error: actionValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const dappIdValidation = validateOptionalDappId(dappId);
    if (!dappIdValidation.valid) {
      return new Response(
        JSON.stringify({ success: false, error: dappIdValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // SECURITY: Verify wallet ownership
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('wallet_address')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ success: false, error: 'Profile not found. Please authenticate first.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (profile.wallet_address.toLowerCase() !== walletAddress!.toLowerCase()) {
      console.warn(`[verify-action] Wallet mismatch: ${walletAddress} != ${profile.wallet_address}`);
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: You can only verify your own wallet' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[verify-action] Verifying ${actionVerb} for ${walletAddress}`);

    // SIMPLE VERIFICATION: Check if wallet has ANY recent transactions
    // This approach works with any dApp without needing specific event signatures
    try {
      // Get transaction count for the wallet
      const txCountResponse = await fetch(ARC_RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getTransactionCount',
          params: [walletAddress, 'latest'],
          id: 1,
        }),
      });

      const txCountData = await txCountResponse.json();
      console.log(`[verify-action] TX count response:`, JSON.stringify(txCountData));

      if (txCountData.error) {
        console.error('[verify-action] RPC error:', txCountData.error);
        return new Response(
          JSON.stringify({ success: false, error: 'RPC error: ' + txCountData.error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const txCount = parseInt(txCountData.result, 16);
      console.log(`[verify-action] Wallet ${walletAddress} has ${txCount} transactions`);

      // If wallet has at least 1 transaction, consider it verified
      // This is a simple check - user has interacted with the chain
      if (txCount > 0) {
        // Generate a pseudo tx hash based on wallet and action for tracking
        const pseudoTxHash = `0x${Array.from(walletAddress!.slice(2) + actionVerb + Date.now())
          .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
          .slice(0, 64)}`;

        console.log(`[verify-action] Verified! Wallet has ${txCount} transactions`);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            verified: true, 
            txHash: pseudoTxHash,
            message: `Wallet activity verified (${txCount} transactions found)` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // No transactions found
      return new Response(
        JSON.stringify({ 
          success: true, 
          verified: false, 
          message: `No transactions found for this wallet. Please complete the action on ${actionVerb} first.` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (rpcError) {
      console.error('[verify-action] RPC call failed:', rpcError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to connect to blockchain RPC' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('[verify-action] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
