import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generic error helper - logs details server-side, returns safe message to client
function safeError(status: number, publicMsg: string, internalDetails?: unknown): Response {
  if (internalDetails) console.error('[verify-action] Internal:', internalDetails);
  return new Response(JSON.stringify({ success: false, error: publicMsg }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

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
      return safeError(401, 'Authentication required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return safeError(401, 'Invalid authentication', authError);
    }

    console.log('[verify-action] Authenticated user successfully');

    console.log('[verify-action] Processing verification request');

    const body = await req.json() as VerifyRequest;
    const { walletAddress, dappId, actionVerb } = body;

    // Input validation
    const walletValidation = validateWalletAddress(walletAddress || '');
    if (!walletValidation.valid) {
      return safeError(400, 'Invalid wallet address');
    }

    const actionValidation = validateActionVerb(actionVerb || '');
    if (!actionValidation.valid) {
      return safeError(400, 'Invalid action');
    }

    const dappIdValidation = validateOptionalDappId(dappId);
    if (!dappIdValidation.valid) {
      return safeError(400, 'Invalid dApp identifier');
    }


    // SECURITY: Verify wallet ownership
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('wallet_address')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return safeError(403, 'Profile not found', profileError);
    }

    if (profile.wallet_address.toLowerCase() !== walletAddress!.toLowerCase()) {
      return safeError(403, 'Unauthorized');
    }

    console.log('[verify-action] Starting blockchain verification');

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
        console.log('[verify-action] RPC response received');

        if (txCountData.error) {
          return safeError(500, 'Blockchain verification failed', txCountData.error);
        }

        const txCount = parseInt(txCountData.result, 16);
        console.log('[verify-action] Transaction check complete');

      // If wallet has at least 1 transaction, consider it verified
      // This is a simple check - user has interacted with the chain
      if (txCount > 0) {
        // Generate a pseudo tx hash based on wallet and action for tracking
          const pseudoTxHash = `0x${Array.from(walletAddress!.slice(2) + actionVerb + Date.now())
            .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('')
            .slice(0, 64)}`;

          console.log('[verify-action] Verification successful');
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              verified: true, 
              txHash: pseudoTxHash,
              message: 'Wallet activity verified' 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      // No transactions found
        return new Response(
          JSON.stringify({ 
            success: true, 
            verified: false, 
            message: 'No transactions found. Please complete the required action first.' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } catch (rpcError) {
        return safeError(500, 'Blockchain verification failed', rpcError);
      }

  } catch (error) {
    return safeError(500, 'Internal error', error);
  }
});
