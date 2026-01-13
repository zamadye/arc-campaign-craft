import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive Arc Network knowledge base from official documentation
const ARC_KNOWLEDGE_BASE = {
  network: {
    name: "Arc Network",
    type: "Purpose-built EVM-compatible Layer-1 blockchain",
    tagline: "The Economic OS for the internet",
    description: "Arc is advancing the frontier of stablecoin finance and tokenization with USDC as native gas, deterministic settlement finality, opt-in privacy, and stable transaction fee architecture",
    consensus: "Malachite - bespoke consensus layer providing deterministic finality",
    testnet: {
      name: "Arc Public Testnet",
      chainId: "5042002 (0x4cef52)",
      rpc: "https://rpc.testnet.arc.network",
      explorer: "https://testnet.arcscan.app",
      status: "Live - deploy, test, and build on Arc"
    }
  },
  coreFeatures: {
    "usdc-gas": {
      name: "USDC as Native Gas",
      description: "Arc uses USDC as the native gas token, eliminating gas price volatility and enabling predictable transaction costs. Users pay fees in a stable asset they already hold.",
      benefits: ["Predictable costs for businesses", "No volatile native token required", "Better UX for mainstream adoption", "Simplified treasury management"],
      uniqueValue: "First L1 blockchain with stablecoin-native gas architecture"
    },
    "deterministic-finality": {
      name: "Deterministic Finality",
      description: "Transactions achieve true finality in sub-second timeframes - no probabilistic confirmation waiting. When a transaction is confirmed, it's final forever.",
      benefits: ["Real-time settlement for payments", "Instant on-chain confirmations", "No reorg risk", "Enterprise-grade reliability"],
      uniqueValue: "Malachite consensus ensures absolute transaction finality"
    },
    "malachite": {
      name: "Malachite Consensus",
      description: "Arc's bespoke consensus layer built for financial infrastructure. Combines BFT-style finality with high throughput for stablecoin-native workloads.",
      benefits: ["High TPS capacity", "Byzantine fault tolerance", "Energy efficient", "Optimized for value transfer"],
      uniqueValue: "Custom-built for stablecoin finance use cases"
    },
    "evm-compatible": {
      name: "Full EVM Compatibility",
      description: "Deploy existing Solidity contracts without modification. Arc supports the complete EVM toolchain including Hardhat, Foundry, and all standard development tools.",
      benefits: ["Easy migration from Ethereum", "Existing tooling works", "Large developer talent pool", "Battle-tested smart contract patterns"],
      uniqueValue: "Enterprise blockchain with full Ethereum compatibility"
    },
    "stable-fees": {
      name: "Stable Fee Architecture",
      description: "Transaction fees are denominated in USDC with predictable pricing, enabling businesses to accurately forecast on-chain costs.",
      benefits: ["Budget certainty", "No fee spikes", "Transparent pricing", "Business-friendly economics"],
      uniqueValue: "First L1 with truly stable and predictable gas costs"
    }
  },
  ecosystem: {
    categories: {
      trading: ["Curve", "Dromos Labs", "Auros", "B2C2", "Cumberland"],
      infrastructure: ["Alchemy", "Blockdaemon", "Chainlink", "dRPC", "Blockscout"],
      wallets: ["Fireblocks", "BitGo", "Crossmint", "Dynamic", "Exodus", "Bron"],
      payments: ["Bridge", "Copperx", "Corpay", "dLocal", "EBANX"],
      defi: ["Centrifuge", "Morpho"],
      banks: ["Deutsche Bank", "Commerzbank", "BTG Pactual", "Bank Frick", "Emirates NBD", "First Abu Dhabi Bank", "BNY", "Absa"],
      stablecoins: ["Circle (USDC)", "AllUnity", "Avenia", "BDACs (KRW1)", "Bitso/Juno"]
    },
    keyPartners: ["Circle", "BlackRock", "Coinbase", "Chainlink", "Deutsche Bank", "Alchemy", "Fireblocks"],
    useCases: [
      "Global cross-border payments",
      "FX and remittance settlements",
      "Capital markets infrastructure",
      "Stablecoin DeFi protocols",
      "Tokenized real-world assets (RWA)",
      "Enterprise treasury management",
      "B2B payment rails"
    ]
  },
  hashtags: {
    primary: ["#ArcNetwork", "#USDC", "#Stablecoins"],
    secondary: ["#DeFi", "#Web3", "#Blockchain", "#Crypto", "#Fintech"],
    technical: ["#Layer1", "#EVM", "#SmartContracts", "#DeterministicFinality"]
  }
};

const CAMPAIGN_TYPE_PROMPTS: Record<string, string> = {
  "product-launch": "Create an exciting product launch announcement that generates anticipation and highlights Arc's unique value proposition",
  "community-event": "Write about a community milestone or event that celebrates Arc's growing ecosystem and early adopters",
  "educational": "Create an educational post that teaches developers and users about Arc's innovative technology in an accessible way",
  "meme-campaign": "Write a fun, shareable post with crypto-native humor that the DeFi community will appreciate and want to share",
  "defi-promotion": "Create a post highlighting DeFi opportunities on Arc, emphasizing stable fees and fast finality",
  "partnership": "Announce or celebrate a partnership highlighting ecosystem growth and institutional adoption",
  "testnet": "Encourage testnet participation with clear value propositions for early builders and users"
};

const TONE_MODIFIERS: Record<string, string> = {
  "professional": "Use polished, corporate language suitable for institutional investors, enterprises, and traditional finance audiences",
  "hype": "Use energetic, exciting language with strategic emojis to build momentum and FOMO",
  "educational": "Use clear, jargon-free explanations that make complex concepts accessible to newcomers",
  "degen": "Use crypto-native slang, abbreviations (gm, wagmi, ngmi), and degen culture references authentically",
  "technical": "Include specific technical details, specs, and developer-focused information"
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ============================================
    // JWT Authentication - Protect AI endpoint
    // ============================================
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing authentication token" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("JWT verification failed:", claimsError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid authentication token" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log("Authenticated user for caption generation:", userId);
    // ============================================

    const { campaignType, tones, arcContext, customInput, walletAddress } = await req.json();

    if (!campaignType || !tones?.length || !arcContext?.length) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: campaignType, tones, arcContext" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build comprehensive context from selected Arc features
    const selectedFeatures = arcContext.map((id: string) => {
      const feature = ARC_KNOWLEDGE_BASE.coreFeatures[id as keyof typeof ARC_KNOWLEDGE_BASE.coreFeatures];
      if (feature) {
        return `${feature.name}:
- ${feature.description}
- Key benefits: ${feature.benefits.join(', ')}
- Unique value: ${feature.uniqueValue}`;
      }
      return null;
    }).filter(Boolean).join("\n\n");

    // Build tone instructions
    const toneInstructions = tones.map((t: string) => TONE_MODIFIERS[t] || "").filter(Boolean).join(". ");

    // Select relevant hashtags based on context
    const relevantHashtags = [
      ...ARC_KNOWLEDGE_BASE.hashtags.primary,
      ...ARC_KNOWLEDGE_BASE.hashtags.secondary.slice(0, 2)
    ];

    const systemPrompt = `You are an expert Web3 marketing copywriter specializing in creating viral, engaging content for Arc Network.

=== ARC NETWORK KNOWLEDGE BASE ===

ABOUT ARC:
${ARC_KNOWLEDGE_BASE.network.name} - ${ARC_KNOWLEDGE_BASE.network.tagline}
${ARC_KNOWLEDGE_BASE.network.description}

NETWORK STATUS:
- Testnet: ${ARC_KNOWLEDGE_BASE.network.testnet.name} is LIVE
- Chain ID: ${ARC_KNOWLEDGE_BASE.network.testnet.chainId}
- Explorer: ${ARC_KNOWLEDGE_BASE.network.testnet.explorer}

=== SELECTED FEATURES TO HIGHLIGHT ===
${selectedFeatures}

=== ECOSYSTEM CONTEXT ===
Key Partners: ${ARC_KNOWLEDGE_BASE.ecosystem.keyPartners.join(', ')}
Use Cases: ${ARC_KNOWLEDGE_BASE.ecosystem.useCases.slice(0, 4).join(', ')}
Trading: ${ARC_KNOWLEDGE_BASE.ecosystem.categories.trading.join(', ')}
Infrastructure: ${ARC_KNOWLEDGE_BASE.ecosystem.categories.infrastructure.join(', ')}

=== CAMPAIGN CONTEXT ===
Campaign Type: ${CAMPAIGN_TYPE_PROMPTS[campaignType] || "Create engaging content"}
Tone: ${toneInstructions}

=== STRICT RULES ===
1. MAXIMUM 280 characters for X/Twitter compatibility
2. Be creative and unique - avoid generic phrases like "the future of finance"
3. Include 2-3 relevant hashtags from: ${relevantHashtags.join(", ")}
4. NEVER include fake statistics or unverifiable claims
5. NEVER promise guaranteed returns or financial advice
6. Each caption MUST be unique in structure, hook, and angle
7. Use appropriate emojis strategically (not excessive)
8. Focus on genuine, specific value propositions
9. Create urgency without being manipulative
10. Make it shareable and conversation-starting`;

    const userPrompt = customInput 
      ? `Create a unique, viral-worthy campaign caption that incorporates this specific angle: "${customInput}"

Remember: 280 characters max, be specific about Arc's technology, make it shareable.`
      : `Create a unique, engaging campaign caption that stands out from typical crypto marketing.

Remember: 280 characters max, highlight a specific Arc feature, make it conversation-worthy.`;

    console.log("Layer 1: Generating caption for campaign type:", campaignType);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service error", details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const caption = data.choices?.[0]?.message?.content?.trim();

    if (!caption) {
      console.error("No caption generated:", data);
      return new Response(
        JSON.stringify({ error: "Failed to generate caption" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Caption generated successfully:", caption.substring(0, 50) + "...");

    return new Response(
      JSON.stringify({ 
        caption,
        metadata: {
          campaignType,
          tones,
          arcContext,
          generatedAt: new Date().toISOString()
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Caption generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
