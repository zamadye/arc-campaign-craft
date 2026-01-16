import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive Arc Network knowledge base
const ARC_KNOWLEDGE_BASE = {
  network: {
    name: "Arc Network",
    type: "Purpose-built EVM-compatible Layer-1 blockchain",
    tagline: "The Economic OS for the internet",
    description: "Arc is advancing the frontier of stablecoin finance and tokenization with USDC as native gas, deterministic settlement finality, opt-in privacy, and stable transaction fee architecture",
  },
  coreFeatures: {
    "usdc-gas": {
      name: "USDC as Native Gas",
      description: "Arc uses USDC as the native gas token, eliminating gas price volatility and enabling predictable transaction costs.",
      benefits: ["Predictable costs", "No volatile native token required", "Better UX for mainstream adoption"],
    },
    "deterministic-finality": {
      name: "Deterministic Finality",
      description: "Transactions achieve true finality in sub-second timeframes - no probabilistic confirmation waiting.",
      benefits: ["Real-time settlement", "Instant confirmations", "No reorg risk"],
    },
    "malachite": {
      name: "Malachite Consensus",
      description: "Arc's bespoke consensus layer built for financial infrastructure with high throughput.",
      benefits: ["High TPS", "Byzantine fault tolerance", "Energy efficient"],
    },
    "evm-compatible": {
      name: "Full EVM Compatibility",
      description: "Deploy existing Solidity contracts without modification using standard tools.",
      benefits: ["Easy migration", "Existing tooling", "Battle-tested patterns"],
    },
    "stable-fees": {
      name: "Stable Fee Architecture",
      description: "Transaction fees are denominated in USDC with predictable pricing.",
      benefits: ["Budget certainty", "No fee spikes", "Business-friendly"],
    }
  },
  ecosystem: {
    partners: ["Circle", "Coinbase", "BlackRock", "Chainlink", "Alchemy", "Aave", "Across", "Deutsche Bank"],
    useCases: ["Global payments", "FX settlements", "Capital markets", "Stablecoin DeFi", "Tokenized assets (RWA)"]
  },
  hashtags: ["#ArcNetwork", "#USDC", "#DeFi", "#Web3", "#Stablecoins"]
};

// Visual style guides for image generation
const IMAGE_STYLE_GUIDES: Record<string, string> = {
  // Simplified UI styles
  tech: "clean minimalist tech aesthetic, precise geometric shapes, electric cyan accents, white and deep blue palette, professional and polished, subtle grid patterns, floating UI elements",
  vibrant: "neon-lit cyberpunk aesthetic, holographic displays, cyan and magenta gradients, dark tech environment, glowing blockchain visualizations, energy streams",
  cosmic: "deep cosmic space backdrop, nebulae and stars, blockchain constellation patterns, ethereal glow, sci-fi grandeur, orbital trajectories, interstellar theme",

  // Backwards-compatible style aliases (if clients send these)
  minimalist: "clean minimalist tech aesthetic, precise geometric shapes, electric cyan accents, white and deep blue palette, professional and polished, subtle grid patterns, floating UI elements",
  blueprint: "technical blueprint style, deep space blue background, white wireframe drawings, engineering grid overlay, cyan highlights, precise schematic lines",
  cyberpunk: "neon-lit cyberpunk aesthetic, holographic displays, cyan and magenta gradients, dark tech environment, glowing blockchain visualizations, energy streams",
  gradient: "abstract gradient art, flowing colors from deep blue to cyan to teal, organic shapes, ethereal glow, premium marketing lighting",
  space: "deep cosmic space backdrop, nebulae and stars, blockchain constellation patterns, ethereal glow, sci-fi grandeur, orbital trajectories, interstellar theme",
};

// Campaign type context
const CAMPAIGN_CONTEXT: Record<string, string> = {
  "product-launch": "exciting product announcement with anticipation",
  "community-event": "community milestone celebration",
  "educational": "accessible educational content about technology",
  "meme-campaign": "fun shareable crypto-native humor",
  "defi-promotion": "DeFi opportunities with stable fees and fast finality",
  "partnership": "ecosystem growth and institutional adoption",
  "testnet": "testnet participation encouragement",
};

// Tone modifiers
const TONE_GUIDES: Record<string, string> = {
  professional: "polished corporate language for institutional audiences",
  hype: "energetic exciting language with strategic emojis",
  educational: "clear jargon-free explanations",
  degen: "crypto-native slang (gm, wagmi) and culture references",
  technical: "specific technical details and developer focus",
};

// DApp link registry (keep small + deterministic; only real URLs)
const DAPP_REGISTRY: Record<string, { name: string; url: string }> = {
  arcflow: { name: "ArcFlow Finance", url: "https://arcflow.finance" },
  aave: { name: "Aave", url: "https://aave.com" },
  maple: { name: "Maple", url: "https://maple.finance" },
  morpho: { name: "Morpho", url: "https://morpho.org" },
  centrifuge: { name: "Centrifuge", url: "https://centrifuge.io" },
  superform: { name: "Superform", url: "https://superform.xyz" },
  securitize: { name: "Securitize", url: "https://securitize.io" },
  usyc: { name: "USYC (Circle)", url: "https://circle.com" },
  across: { name: "Across Protocol", url: "https://across.to" },
  stargate: { name: "Stargate", url: "https://stargate.finance" },
  wormhole: { name: "Wormhole", url: "https://wormhole.com" },
  alchemy: { name: "Alchemy", url: "https://alchemy.com" },
  chainlink: { name: "Chainlink", url: "https://chain.link" },
  thirdweb: { name: "thirdweb", url: "https://thirdweb.com" },
  blockdaemon: { name: "Blockdaemon", url: "https://blockdaemon.com" },
  blockscout: { name: "Blockscout", url: "https://testnet.arcscan.app" },
  metamask: { name: "MetaMask", url: "https://metamask.io" },
  rainbow: { name: "Rainbow", url: "https://rainbow.me" },
  privy: { name: "Privy", url: "https://privy.io" },
  "coinbase-wallet": { name: "Coinbase Wallet", url: "https://wallet.coinbase.com" },
};

function extractUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s)\]]+/g);
  return matches ? Array.from(new Set(matches)) : [];
}

function resolveDApps(targetDApps: unknown): Array<{ id: string; name: string; url: string }> {
  const ids = Array.isArray(targetDApps) ? targetDApps.filter((x) => typeof x === "string") as string[] : [];
  const resolved = ids
    .map((id) => {
      const entry = DAPP_REGISTRY[id];
      return entry ? { id, name: entry.name, url: entry.url } : null;
    })
    .filter(Boolean) as Array<{ id: string; name: string; url: string }>;

  // Deterministic fallback
  if (resolved.length >= 2) return resolved;
  return [
    { id: "arcflow", name: DAPP_REGISTRY.arcflow.name, url: DAPP_REGISTRY.arcflow.url },
    { id: "aave", name: DAPP_REGISTRY.aave.name, url: DAPP_REGISTRY.aave.url },
    { id: "across", name: DAPP_REGISTRY.across.name, url: DAPP_REGISTRY.across.url },
  ];
}

// Validate caption has @ArcFlowFinance mention + line breaks + dApp links
function validateCaption(caption: string, allowedLinks: string[]): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!caption.includes('@ArcFlowFinance')) {
    issues.push('missing_arcflow_mention');
  }

  // Expect multi-line formatting for readability ("No enter" issue)
  const newlineCount = (caption.match(/\n/g) || []).length;
  if (newlineCount < 2) {
    issues.push('missing_linebreaks');
  }

  const urls = extractUrls(caption);
  if (urls.length < 2) {
    issues.push('missing_dapp_links');
  } else {
    const allowedSet = new Set(allowedLinks);
    const hits = urls.filter((u) => allowedSet.has(u));
    if (hits.length < 1) {
      issues.push('wrong_links');
    }
  }

  if (caption.length < 150) {
    issues.push('too_short');
  }

  if (caption.length > 320) {
    issues.push('too_long');
  }

  return { valid: issues.length === 0, issues };
}

// Inject @ArcFlowFinance if missing (fallback)
function injectArcFlowMention(caption: string): string {
  if (caption.includes('@ArcFlowFinance')) {
    return caption;
  }

  const sentences = caption.split('. ');
  if (sentences.length > 1) {
    sentences[0] += ' via @ArcFlowFinance';
    return sentences.join('. ');
  }

  if (caption.includes('#')) {
    return caption.replace(/#/, '@ArcFlowFinance #');
  }

  return caption + ' @ArcFlowFinance';
}

function injectDAppLinks(caption: string, links: string[]): string {
  const urls = extractUrls(caption);
  if (urls.length >= 2) return caption;

  const chosen = links.slice(0, 3);
  const linksLine = chosen.join(' ');

  // Add a dedicated links line to keep tweet readable
  return `${caption.trim()}\n\n${linksLine}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // JWT Authentication
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
    console.log("Authenticated user for unified generation:", userId);

    const { 
      campaignType, 
      tones, 
      arcContext, 
      customInput, 
      imageStyle,
      targetDApps,
      intentCategory,
      actionOrder,
      timeWindow,
      dappUrls,
    } = await req.json();

    if (!campaignType || !imageStyle) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: campaignType, imageStyle" }),
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

    // Build context from selected features
    const selectedFeatures = (arcContext || ['usdc-gas', 'deterministic-finality']).map((id: string) => {
      const feature = ARC_KNOWLEDGE_BASE.coreFeatures[id as keyof typeof ARC_KNOWLEDGE_BASE.coreFeatures];
      return feature ? `${feature.name}: ${feature.description}` : null;
    }).filter(Boolean).join('\n');

    const toneInstructions = (tones || ['hype']).map((t: string) => TONE_GUIDES[t] || '').filter(Boolean).join('. ');
    const styleGuide = IMAGE_STYLE_GUIDES[imageStyle] || IMAGE_STYLE_GUIDES["vibrant"];
    const campaignContext = CAMPAIGN_CONTEXT[campaignType] || "engaging blockchain content";

    // PRIORITY: Use dappUrls passed from frontend (from verified daily tasks)
    // Fallback to registry-based resolution only if no URLs provided
    const passedDappUrls = Array.isArray(dappUrls) && dappUrls.length > 0 
      ? dappUrls.filter((url: string) => typeof url === 'string' && url.startsWith('http'))
      : [];
    
    const selectedDApps = passedDappUrls.length >= 2 
      ? passedDappUrls.map((url: string, i: number) => ({ 
          id: `dapp-${i}`, 
          name: targetDApps?.[i] || `dApp ${i + 1}`, 
          url 
        }))
      : resolveDApps(targetDApps);
    
    const dAppsContext = Array.isArray(targetDApps) ? targetDApps.join(', ') : selectedDApps.map((d) => d.name).join(', ');
    const allowedLinks = selectedDApps.map((d) => d.url);
    const linksContext = allowedLinks.slice(0, 3).map((u) => `- ${u}`).join('\n');

    const actionContext = Array.isArray(actionOrder) && actionOrder.length
      ? actionOrder.slice(0, 6).join(' → ')
      : 'Connect → Execute → Verify';

    const timeContext = typeof timeWindow === 'string' && timeWindow ? timeWindow : 'none';

    // Unified system prompt
    const systemPrompt = `You are an expert Web3 marketing specialist for Arc Network. Your task is to generate BOTH a marketing caption AND an image prompt in a single response.

=== ARC NETWORK CONTEXT ===
${ARC_KNOWLEDGE_BASE.network.name}: ${ARC_KNOWLEDGE_BASE.network.tagline}
${ARC_KNOWLEDGE_BASE.network.description}

=== SELECTED FEATURES ===
${selectedFeatures}

=== ECOSYSTEM ===
Target dApps (names): ${dAppsContext}
Allowed dApp links (MUST use 2-3 of these, exactly as written):
${linksContext}

Action order (intent steps): ${actionContext}
Time window: ${timeContext}

Partners: ${ARC_KNOWLEDGE_BASE.ecosystem.partners.join(', ')}

=== BRAND COLORS ===
Primary: electric cyan (#00D9FF)
Secondary: deep space blue (#0A0E27)
Accent: USDC green (#26A17B)

=== STYLE DIRECTION FOR IMAGE ===
${styleGuide}

=== CRITICAL RULES ===

FOR CAPTION:
1. MANDATORY: Must include "@ArcFlowFinance" - NON-NEGOTIABLE
2. Length: 200-280 characters (including line breaks)
3. FORMAT: Use 4 lines exactly:
   - Line 1: Hook (1 sentence)
   - Line 2: What to do (mention at least 2 target dApps by name)
   - Line 3: 2-3 dApp LINKS (plain URLs) from the allowed list
   - Line 4: 2-3 hashtags from: ${ARC_KNOWLEDGE_BASE.hashtags.join(', ')}
4. Tone: ${toneInstructions}
5. Unique + concrete (refer to the action order)
6. NEVER promise guaranteed returns or make financial claims

FOR IMAGE PROMPT:
1. Must be DIFFERENT for each caption: include 4-6 distinct visual motifs tied to the caption + action order + chosen dApps
2. Describe a visual scene (NO text, NO logos, NO UI screenshots)
3. Use the brand colors specified
4. Match the caption's theme and energy
5. 16:9 aspect ratio, ultra high resolution
6. Abstract/conceptual, professional marketing quality

=== OUTPUT FORMAT ===
You MUST respond with ONLY valid JSON, no markdown, no explanations:
{
  "caption": "4-line caption with \\n line breaks, includes @ArcFlowFinance and 2-3 allowed URLs",
  "imagePrompt": "Detailed scene description"
}`;

    const userPrompt = customInput 
      ? `Create a unified campaign for Arc Network with this focus: "${customInput}"
Campaign type: ${campaignContext}
Target dApps: ${dAppsContext}
Action order: ${actionContext}
Time window: ${timeContext}
Return JSON only.`
      : `Create a unified campaign for Arc Network.
Campaign type: ${campaignContext}
Intent: ${intentCategory || 'DeFi'}
Target dApps: ${dAppsContext}
Action order: ${actionContext}
Time window: ${timeContext}
Return JSON only.`;

    console.log("Unified generation: Generating caption + image prompt together...");

    // Make single AI call for both outputs
    let caption: string | null = null;
    let imagePrompt: string | null = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Generation attempt ${attempts}/${maxAttempts}...`);

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
            { role: "user", content: attempts > 1 
              ? `${userPrompt}\n\nPREVIOUS ATTEMPT FAILED: Did not include @ArcFlowFinance or had invalid format. MANDATORY: Include @ArcFlowFinance mention!`
              : userPrompt 
            }
          ],
          max_tokens: 600,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI API error:", response.status, errorText);
        
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
        
        continue; // Retry on other errors
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content?.trim();
      
      if (!content) {
        console.error("Empty response from AI");
        continue;
      }

      console.log("Raw AI response:", content.substring(0, 200) + "...");

      // Parse JSON response
      try {
        // Clean potential markdown wrapping
        let jsonStr = content;
        if (jsonStr.startsWith('```json')) {
          jsonStr = jsonStr.replace(/^```json\n?/, '').replace(/\n?```$/, '');
        } else if (jsonStr.startsWith('```')) {
          jsonStr = jsonStr.replace(/^```\n?/, '').replace(/\n?```$/, '');
        }

        const parsed = JSON.parse(jsonStr);
        caption = parsed.caption;
        imagePrompt = parsed.imagePrompt;

        if (!caption || !imagePrompt) {
          console.error("Missing fields in parsed response");
          continue;
        }

        // Validate caption
        const validation = validateCaption(caption, allowedLinks);
        if (!validation.valid) {
          console.warn("Caption validation failed:", validation.issues);

          // Apply deterministic fallbacks when possible
          if (validation.issues.includes('missing_arcflow_mention')) {
            caption = injectArcFlowMention(caption);
          }
          if (validation.issues.includes('missing_dapp_links') || validation.issues.includes('wrong_links')) {
            caption = injectDAppLinks(caption, allowedLinks);
          }

          // Re-check after fallbacks; if still invalid, retry
          const recheck = validateCaption(caption, allowedLinks);
          if (!recheck.valid) {
            continue;
          }

          console.log("Applied fallbacks and recovered a valid caption");
          break;
        }

        // Valid response - break out of retry loop
        console.log("Valid unified response generated");
        break;

      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        continue;
      }
    }

    // Final fallback - if we still don't have valid data after all attempts
    if (!caption || !imagePrompt) {
      console.error("Failed to generate valid content after", maxAttempts, "attempts");
      return new Response(
        JSON.stringify({ error: "Generation failed. Please try again." }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Final safety nets
    if (!caption.includes('@ArcFlowFinance')) {
      caption = injectArcFlowMention(caption);
      console.log("Applied final @ArcFlowFinance safety injection");
    }

    caption = injectDAppLinks(caption, allowedLinks);

    console.log("✅ Unified generation complete");
    console.log("Caption:", caption.substring(0, 80) + "...");
    console.log("Image prompt:", imagePrompt.substring(0, 80) + "...");

    return new Response(
      JSON.stringify({ 
        caption,
        imagePrompt,
        metadata: {
          campaignType,
          imageStyle,
          targetDApps: targetDApps || [],
          attempts,
          generatedAt: new Date().toISOString(),
          hasArcFlowMention: caption.includes('@ArcFlowFinance')
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Unified generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
