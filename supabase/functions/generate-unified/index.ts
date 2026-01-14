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
  "tech": "clean minimalist tech aesthetic, precise geometric shapes, electric cyan accents, white and deep blue palette, professional and polished, subtle grid patterns, floating UI elements",
  "vibrant": "neon-lit cyberpunk aesthetic, holographic displays, cyan and magenta gradients, dark tech environment, glowing blockchain visualizations, energy streams",
  "cosmic": "deep cosmic space backdrop, nebulae and stars, blockchain constellation patterns, ethereal glow, sci-fi grandeur, orbital trajectories, interstellar theme"
};

// Campaign type context
const CAMPAIGN_CONTEXT: Record<string, string> = {
  "product-launch": "exciting product announcement with anticipation",
  "community-event": "community milestone celebration",
  "educational": "accessible educational content about technology",
  "meme-campaign": "fun shareable crypto-native humor",
  "defi-promotion": "DeFi opportunities with stable fees and fast finality",
  "partnership": "ecosystem growth and institutional adoption",
  "testnet": "testnet participation encouragement"
};

// Tone modifiers
const TONE_GUIDES: Record<string, string> = {
  "professional": "polished corporate language for institutional audiences",
  "hype": "energetic exciting language with strategic emojis",
  "educational": "clear jargon-free explanations",
  "degen": "crypto-native slang (gm, wagmi) and culture references",
  "technical": "specific technical details and developer focus"
};

// Validate caption has @ArcFlowFinance mention
function validateCaption(caption: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!caption.includes('@ArcFlowFinance')) {
    issues.push('missing_arcflow_mention');
  }
  
  if (caption.length < 150) {
    issues.push('too_short');
  }
  
  if (caption.length > 300) {
    issues.push('too_long');
  }
  
  return { valid: issues.length === 0, issues };
}

// Inject @ArcFlowFinance if missing (fallback)
function injectArcFlowMention(caption: string): string {
  if (caption.includes('@ArcFlowFinance')) {
    return caption;
  }
  
  // Find good injection point
  const sentences = caption.split('. ');
  if (sentences.length > 1) {
    sentences[0] += ' via @ArcFlowFinance';
    return sentences.join('. ');
  }
  
  // Insert before hashtags or at end
  if (caption.includes('#')) {
    return caption.replace(/#/, '@ArcFlowFinance #');
  }
  
  return caption + ' @ArcFlowFinance';
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
      intentCategory 
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
    const dAppsContext = (targetDApps || []).join(', ') || 'ArcFlow Finance, Aave';

    // Unified system prompt
    const systemPrompt = `You are an expert Web3 marketing specialist for Arc Network. Your task is to generate BOTH a marketing caption AND an image prompt in a single response.

=== ARC NETWORK CONTEXT ===
${ARC_KNOWLEDGE_BASE.network.name}: ${ARC_KNOWLEDGE_BASE.network.tagline}
${ARC_KNOWLEDGE_BASE.network.description}

=== SELECTED FEATURES ===
${selectedFeatures}

=== ECOSYSTEM ===
Target dApps: ${dAppsContext}
Partners: ${ARC_KNOWLEDGE_BASE.ecosystem.partners.join(', ')}

=== BRAND COLORS ===
Primary: electric cyan (#00D9FF)
Secondary: deep space blue (#0A0E27)
Accent: USDC green (#26A17B)

=== STYLE DIRECTION FOR IMAGE ===
${styleGuide}

=== CRITICAL RULES ===

FOR CAPTION:
1. MANDATORY: Must include "@ArcFlowFinance" - this is NON-NEGOTIABLE
2. Length: 200-280 characters (count carefully)
3. Include 2-3 hashtags from: ${ARC_KNOWLEDGE_BASE.hashtags.join(', ')}
4. Mention at least one target dApp by name
5. Tone: ${toneInstructions}
6. Be unique and authentic, avoid generic phrases
7. NEVER promise guaranteed returns or make financial claims

FOR IMAGE PROMPT:
1. Describe a visual scene (NOT text or logos)
2. Use the brand colors specified
3. Match the caption's theme and energy
4. 16:9 aspect ratio, ultra high resolution
5. Abstract/conceptual - no literal representations
6. Professional marketing quality

=== OUTPUT FORMAT ===
You MUST respond with ONLY valid JSON, no markdown, no explanations:
{
  "caption": "Your 200-280 character caption here with @ArcFlowFinance mention",
  "imagePrompt": "Your detailed visual scene description for image generation"
}`;

    const userPrompt = customInput 
      ? `Create a unified campaign for Arc Network with this focus: "${customInput}"
Campaign type: ${campaignContext}
Remember: JSON only, include @ArcFlowFinance, 200-280 chars for caption.`
      : `Create a unified campaign for Arc Network.
Campaign type: ${campaignContext}
Intent: ${intentCategory || 'DeFi'}
Remember: JSON only, include @ArcFlowFinance, 200-280 chars for caption.`;

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
        const validation = validateCaption(caption);
        if (!validation.valid) {
          console.warn("Caption validation failed:", validation.issues);
          
          // Apply fallback injection if only missing @ArcFlowFinance
          if (validation.issues.includes('missing_arcflow_mention') && validation.issues.length === 1) {
            caption = injectArcFlowMention(caption);
            console.log("Applied @ArcFlowFinance injection fallback");
            break;
          }
          
          continue; // Retry for other issues
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

    // Ensure @ArcFlowFinance is present (final safety net)
    if (!caption.includes('@ArcFlowFinance')) {
      caption = injectArcFlowMention(caption);
      console.log("Applied final @ArcFlowFinance safety injection");
    }

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
