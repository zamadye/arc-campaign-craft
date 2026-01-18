import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive Arc Network knowledge base with expanded ecosystem data
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
    },
    "opt-in-privacy": {
      name: "Opt-In Privacy",
      description: "Privacy-preserving transactions when needed, with full auditability for compliance.",
      benefits: ["Regulatory compliance", "User choice", "Enterprise ready"],
    }
  },
  ecosystem: {
    partners: ["Circle", "Coinbase", "BlackRock", "Chainlink", "Alchemy", "Aave", "Across", "Deutsche Bank", "HSBC", "Societe Generale", "BNY", "Commerzbank", "Axelar", "LayerZero"],
    useCases: ["Global payments", "FX settlements", "Capital markets", "Stablecoin DeFi", "Tokenized assets (RWA)", "Cross-border remittances", "Trade finance", "Treasury management"]
  },
  hashtags: ["#ArcNetwork", "#USDC", "#DeFi", "#Web3", "#Stablecoins", "#RWA", "#TradFi", "#CryptoFinance"]
};

// ============================================================
// DYNAMIC VARIETY SYSTEM - Unique themes, colors, POV per generation
// ============================================================

const VISUAL_THEMES = [
  "cosmic voyage through digital space",
  "quantum data flow visualization",
  "neon-lit cyberpunk cityscape",
  "crystalline blockchain architecture",
  "aurora borealis data streams",
  "deep ocean bioluminescent network",
  "solar flare energy burst",
  "matrix digital rain cascade",
  "holographic financial interface",
  "abstract geometric transformation",
  "orbital satellite network view",
  "molecular bond visualization",
  "magnetic field line patterns",
  "fractal expansion animation",
  "particle physics collision art",
  "time-lapse city lights network",
];

const COLOR_PALETTES = [
  "electric cyan and deep navy",
  "magenta and cool teal gradient",
  "golden amber with dark purple",
  "coral pink and ocean blue",
  "lime green and charcoal",
  "violet purple and mint green",
  "sunset orange with midnight blue",
  "ice blue and warm coral",
  "neon pink and electric blue",
  "emerald green and rose gold",
  "arctic white and deep indigo",
  "copper bronze and steel blue",
];

const POV_PERSPECTIVES = [
  "aerial bird's-eye view looking down",
  "macro close-up detail shot",
  "isometric 3D perspective",
  "first-person immersive view",
  "wide cinematic landscape",
  "abstract pattern top-down",
  "orbital space view",
  "underwater depth perspective",
  "tunnel perspective receding",
  "split-screen dual view",
  "fisheye lens distortion",
  "time-slice multi-exposure",
];

const MOTION_STYLES = [
  "flowing liquid movement",
  "sharp geometric transitions",
  "organic growth animation",
  "particle dispersion effect",
  "wave ripple propagation",
  "crystallization formation",
  "glitch distortion flicker",
  "smooth gradient morph",
];

// Expanded visual style guides with more variety
const IMAGE_STYLE_GUIDES: Record<string, string> = {
  tech: "clean minimalist tech aesthetic, precise geometric shapes, electric cyan (#00D9FF) accents, deep space blue (#0A0E27) background, professional and polished, subtle hexagonal grid patterns, floating holographic UI elements, soft ambient glow",
  vibrant: "neon-lit cyberpunk aesthetic, holographic displays with depth, cyan and magenta gradients, dark futuristic environment, glowing blockchain node visualizations, energy streams flowing through circuits, volumetric lighting",
  cosmic: "deep cosmic space backdrop with distant galaxies, nebulae and stellar formations, blockchain constellation patterns connecting nodes, ethereal glow, sci-fi grandeur, orbital trajectories around a central Arc logo form, interstellar data streams",
  minimalist: "ultra-clean Swiss design aesthetic, generous whitespace, single cyan accent line, typography-focused, architectural precision, subtle shadows, glass morphism elements",
  blueprint: "technical blueprint style on deep navy background, white and cyan wireframe drawings, engineering grid overlay, precise schematic lines, annotation markers, technical callouts",
  cyberpunk: "rain-soaked neon cityscape, holographic billboards, pink and cyan color palette, chrome reflections, digital rain effects, corporate megastructures, blade runner atmosphere",
  gradient: "abstract gradient art, flowing organic shapes transitioning from deep purple through electric blue to vibrant cyan, liquid metal aesthetics, premium product photography lighting, subtle noise texture",
  space: "vast cosmic void with supernova remnants, arc of light connecting distant stars, data packets visualized as shooting stars, deep field astronomy aesthetic, cosmic dust particles",
  neon: "dark environment with intense neon tube lighting, pink/cyan/purple color scheme, reflective wet surfaces, 80s retro-futurism, synthwave aesthetic, geometric neon shapes",
  matrix: "digital rain of green/cyan code, matrix-style data visualization, dark void background, glowing symbols, binary streams forming patterns, hacker aesthetic",
  crystal: "crystalline structures with internal light refraction, faceted geometric forms, prismatic color dispersion, frozen light aesthetic, ice palace vibes, clarity and precision",
  aurora: "northern lights color palette, flowing bands of green/purple/pink light, arctic twilight sky, ethereal and mystical atmosphere, particle effects, organic movement",
  circuit: "printed circuit board macro photography style, copper traces with cyan LED glow, silicon wafer patterns, microscopic tech aesthetic, solder points as nodes",
  quantum: "quantum computing aesthetic, superposition visualizations, entangled particle paths, probability clouds, Schrödinger-inspired uncertainty, deep blue with white particles",
  ocean: "deep ocean bioluminescence, underwater data cables glowing, abyssal darkness with cyan creatures, pressure depth aesthetic, mysterious and vast",
  solar: "solar flare and corona visualization, plasma arcs, intense orange transitioning to cool space, fusion energy aesthetic, power and energy theme",
};

// Expanded campaign type context with more variety
const CAMPAIGN_CONTEXT: Record<string, string> = {
  "product-launch": "exciting product announcement building anticipation and FOMO",
  "community-event": "community milestone celebration with gratitude and excitement",
  "educational": "accessible educational content breaking down complex technology",
  "meme-campaign": "fun shareable crypto-native humor with viral potential",
  "defi-promotion": "DeFi opportunities highlighting stable fees and instant finality",
  "partnership": "ecosystem growth celebrating institutional adoption",
  "testnet": "testnet participation encouragement with builder energy",
  "trading": "trading activity highlight showcasing volume and efficiency",
  "yield": "yield farming opportunity with risk-aware messaging",
  "bridge": "cross-chain bridging made simple with fast finality",
  "nft": "digital collectible or proof-of-participation moment",
  "governance": "community voice and DAO participation",
  "developer": "builder-focused technical achievement",
  "milestone": "protocol or user milestone celebration",
};

// Expanded tone modifiers
const TONE_GUIDES: Record<string, string> = {
  professional: "polished corporate language for institutional audiences, measured confidence",
  hype: "energetic exciting language with strategic emojis 🚀⚡, FOMO-inducing",
  educational: "clear jargon-free explanations, patient and thorough",
  degen: "crypto-native slang (gm, wagmi, lfg, ser), culture references, based energy",
  technical: "specific technical details and developer focus, precise terminology",
  chill: "relaxed casual tone, conversational, friendly vibes",
  bold: "strong confident statements, declarative, alpha energy",
  minimal: "extremely concise, powerful single statements, less is more",
  storytelling: "narrative arc, journey framing, personal experience",
  urgent: "time-sensitive, don't miss out, act now energy",
};

// Expanded DApp link registry with real Arc ecosystem partners
const DAPP_REGISTRY: Record<string, { name: string; url: string; category: string }> = {
  arcflow: { name: "ArcFlow Finance", url: "https://arcflow.finance", category: "DeFi" },
  aave: { name: "Aave", url: "https://aave.com", category: "Lending" },
  maple: { name: "Maple Finance", url: "https://maple.finance", category: "Lending" },
  morpho: { name: "Morpho", url: "https://morpho.org", category: "Lending" },
  centrifuge: { name: "Centrifuge", url: "https://centrifuge.io", category: "RWA" },
  securitize: { name: "Securitize", url: "https://securitize.io", category: "RWA" },
  superform: { name: "Superform", url: "https://superform.xyz", category: "Yield" },
  usyc: { name: "Circle USYC", url: "https://circle.com", category: "Yield" },
  across: { name: "Across Protocol", url: "https://across.to", category: "Bridge" },
  stargate: { name: "Stargate Finance", url: "https://stargate.finance", category: "Bridge" },
  wormhole: { name: "Wormhole", url: "https://wormhole.com", category: "Bridge" },
  layerzero: { name: "LayerZero", url: "https://layerzero.network", category: "Bridge" },
  axelar: { name: "Axelar", url: "https://axelar.network", category: "Bridge" },
  alchemy: { name: "Alchemy", url: "https://alchemy.com", category: "Infrastructure" },
  chainlink: { name: "Chainlink", url: "https://chain.link", category: "Oracles" },
  thirdweb: { name: "thirdweb", url: "https://thirdweb.com", category: "Dev Tools" },
  blockdaemon: { name: "Blockdaemon", url: "https://blockdaemon.com", category: "Infrastructure" },
  blockscout: { name: "ArcScan", url: "https://testnet.arcscan.app", category: "Explorer" },
  tenderly: { name: "Tenderly", url: "https://tenderly.co", category: "Dev Tools" },
  drpc: { name: "dRPC", url: "https://drpc.org", category: "RPC" },
  quicknode: { name: "QuickNode", url: "https://quicknode.com", category: "RPC" },
  metamask: { name: "MetaMask", url: "https://metamask.io", category: "Wallet" },
  rainbow: { name: "Rainbow", url: "https://rainbow.me", category: "Wallet" },
  privy: { name: "Privy", url: "https://privy.io", category: "Wallet" },
  "coinbase-wallet": { name: "Coinbase Wallet", url: "https://wallet.coinbase.com", category: "Wallet" },
  fireblocks: { name: "Fireblocks", url: "https://fireblocks.com", category: "Custody" },
  ramp: { name: "Ramp Network", url: "https://ramp.network", category: "Payments" },
  nuvei: { name: "Nuvei", url: "https://nuvei.com", category: "Payments" },
  stablestake: { name: "StableStake Protocol", url: "https://arcindex.xyz", category: "DeFi" },
  arcinteractionhub: { name: "ARC Interaction Hub", url: "https://arcindex.xyz", category: "Tools" },
  arcagentpay: { name: "ArcAgentPay", url: "https://arcindex.xyz", category: "Payments" },
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

  if (resolved.length >= 2) return resolved;
  return [
    { id: "arcflow", name: DAPP_REGISTRY.arcflow.name, url: DAPP_REGISTRY.arcflow.url },
    { id: "aave", name: DAPP_REGISTRY.aave.name, url: DAPP_REGISTRY.aave.url },
    { id: "across", name: DAPP_REGISTRY.across.name, url: DAPP_REGISTRY.across.url },
  ];
}

// Random selection helpers
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// Build dynamic image prompt with variety
function buildDynamicImagePrompt(
  baseStyle: string,
  caption: string,
  dAppsContext: string,
  actionContext: string,
  excludedThemes: string[] = [],
  excludedColors: string[] = [],
  excludedPov: string[] = []
): { prompt: string; theme: string; color: string; pov: string; motion: string } {
  // Filter out recently used elements
  const availableThemes = VISUAL_THEMES.filter(t => !excludedThemes.includes(t));
  const availableColors = COLOR_PALETTES.filter(c => !excludedColors.includes(c));
  const availablePov = POV_PERSPECTIVES.filter(p => !excludedPov.includes(p));
  
  // Pick random unique elements
  const theme = pickRandom(availableThemes.length > 0 ? availableThemes : VISUAL_THEMES);
  const color = pickRandom(availableColors.length > 0 ? availableColors : COLOR_PALETTES);
  const pov = pickRandom(availablePov.length > 0 ? availablePov : POV_PERSPECTIVES);
  const motion = pickRandom(MOTION_STYLES);
  
  // Extract keywords from caption for context
  const captionKeywords = caption
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(' ')
    .filter(w => w.length > 4 && !['about', 'their', 'these', 'those', 'which', 'where'].includes(w))
    .slice(0, 5);
  
  const keywordContext = captionKeywords.length > 0 
    ? `incorporating visual metaphors for: ${captionKeywords.join(', ')}`
    : '';
  
  const prompt = `${theme}, ${pov}, color palette of ${color}, ${motion}, ${baseStyle}, 
representing ${dAppsContext} activities through ${actionContext} flow, 
${keywordContext}, 
16:9 aspect ratio, ultra high resolution, cinematic marketing quality, 
no text, no logos, no UI screenshots, abstract and conceptual, professional polish`;
  
  return { prompt: prompt.trim(), theme, color, pov, motion };
}

// Validate caption based on twitter type (verified vs non-verified)
// Verified Twitter: 1000-3000 characters (long-form content)
// Non-verified: 100-200 characters (short tweet)
function validateCaption(
  caption: string, 
  allowedLinks: string[], 
  isVerifiedTwitter: boolean
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const maxLength = isVerifiedTwitter ? 3000 : 200;
  const minLength = isVerifiedTwitter ? 800 : 100;
  const minDappLinks = isVerifiedTwitter ? 2 : 1;

  if (!caption.includes('@ArcFlowFinance')) {
    issues.push('missing_arcflow_mention');
  }

  const newlineCount = (caption.match(/\n/g) || []).length;
  if (newlineCount < 2) {
    issues.push('missing_linebreaks');
  }

  const urls = extractUrls(caption);
  if (urls.length < minDappLinks) {
    issues.push('missing_dapp_links');
  } else {
    const allowedSet = new Set(allowedLinks);
    const hits = urls.filter((u) => allowedSet.has(u));
    if (hits.length < 1) {
      issues.push('wrong_links');
    }
  }

  if (caption.length < minLength) {
    issues.push('too_short');
  }

  if (caption.length > maxLength) {
    issues.push('too_long');
  }

  return { valid: issues.length === 0, issues };
}

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

function injectDAppLinks(caption: string, links: string[], maxLinks: number = 3): string {
  const urls = extractUrls(caption);
  if (urls.length >= maxLinks) return caption;

  const chosen = links.slice(0, maxLinks);
  const linksLine = chosen.join(' ');

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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Service role client for generation history
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("JWT verification failed:", claimsError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid authentication token" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub as string;
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
      walletAddress,
      isVerifiedTwitter = false, // NEW: Twitter account type
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

    // ============================================================
    // FETCH RECENT GENERATION HISTORY for variety
    // ============================================================
    let excludedThemes: string[] = [];
    let excludedColors: string[] = [];
    let excludedPov: string[] = [];

    try {
      const { data: recentHistory } = await supabaseService
        .from('generation_history')
        .select('visual_theme, color_palette, pov_perspective')
        .eq('user_id', userId)
        .order('generated_at', { ascending: false })
        .limit(5);

      if (recentHistory && recentHistory.length > 0) {
        excludedThemes = recentHistory.map(h => h.visual_theme).filter(Boolean) as string[];
        excludedColors = recentHistory.map(h => h.color_palette).filter(Boolean) as string[];
        excludedPov = recentHistory.map(h => h.pov_perspective).filter(Boolean) as string[];
        console.log("Excluding recent variety:", { excludedThemes: excludedThemes.length, excludedColors: excludedColors.length });
      }
    } catch (historyError) {
      console.warn("Could not fetch generation history:", historyError);
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
    
    // Adjust link limits based on Twitter type
    const maxDappLinks = isVerifiedTwitter ? 4 : 2;
    const linksContext = allowedLinks.slice(0, maxDappLinks).map((u) => `- ${u}`).join('\n');

    const actionContext = Array.isArray(actionOrder) && actionOrder.length
      ? actionOrder.slice(0, 6).join(' → ')
      : 'Connect → Execute → Verify';

    const timeContext = typeof timeWindow === 'string' && timeWindow ? timeWindow : 'none';

    // Soft CTA for Intent promotion (verified accounts only)
    const intentCTA = `\n\n---\n✨ Want to create unique on-chain content like this? Try Intent on Arc Network → https://app-intent.lovable.app`;

    // Dynamic caption length based on Twitter type
    // Verified: Long-form structured content (1000-3000 chars)
    // Non-verified: Short punchy tweet (100-200 chars)
    const captionMinLength = isVerifiedTwitter ? 1000 : 100;
    const captionMaxLength = isVerifiedTwitter ? 3000 : 200;
    const dappLinkCount = isVerifiedTwitter ? '3-4' : '1-2';

    // Unified system prompt with dynamic length rules
    // Different system prompts for verified (long-form) vs non-verified (short)
    const systemPrompt = isVerifiedTwitter 
      ? `You are an expert Web3 content creator for Arc Network. Your task is to generate a LONG-FORM structured post AND an image prompt.

=== ARC NETWORK CONTEXT ===
${ARC_KNOWLEDGE_BASE.network.name}: ${ARC_KNOWLEDGE_BASE.network.tagline}
${ARC_KNOWLEDGE_BASE.network.description}

=== CORE FEATURES TO HIGHLIGHT ===
${selectedFeatures}

=== ECOSYSTEM & dApps ===
Target dApps: ${dAppsContext}
dApp links to include:
${linksContext}

Action flow: ${actionContext}
Time context: ${timeContext}

Key Partners: ${ARC_KNOWLEDGE_BASE.ecosystem.partners.slice(0, 8).join(', ')}

=== TWITTER ACCOUNT TYPE ===
VERIFIED account - LONG-FORM content required (${captionMinLength}-${captionMaxLength} characters)

=== CRITICAL RULES FOR LONG-FORM CAPTION ===

1. MANDATORY: Include "@ArcFlowFinance" early in the post
2. LENGTH: ${captionMinLength}-${captionMaxLength} characters - this is a THREAD-STYLE long post
3. STRUCTURE (use clear sections with line breaks):
   
   🎯 HOOK (2-3 sentences)
   - Start with an attention-grabbing statement about DeFi/Arc
   - Pose a question or highlight a pain point
   
   📌 CONTEXT (3-4 sentences)  
   - Explain what you did: "${actionContext}"
   - Mention the dApps used: ${dAppsContext}
   - Highlight Arc Network advantages (USDC gas, instant finality)
   
   💡 KEY INSIGHTS (3-5 bullet points)
   - What made this experience unique
   - Specific benefits you noticed
   - Comparisons to other chains (subtle)
   
   🔗 RESOURCES (include ${dappLinkCount} links)
   - List the dApp URLs naturally
   
   📊 HASHTAGS
   - End with 3-5 relevant hashtags: ${ARC_KNOWLEDGE_BASE.hashtags.join(', ')}

4. TONE: ${toneInstructions}
5. Make it EDUCATIONAL and VALUABLE - readers should learn something
6. Be AUTHENTIC - write like a real user sharing their experience
7. NEVER promise returns or make financial claims

=== FOR IMAGE PROMPT ===
1. Create a unique visual matching the post's theme
2. Include motifs for: ${dAppsContext}, ${actionContext}
3. NO text, NO logos, NO UI - abstract/conceptual only
4. 16:9 aspect ratio, ultra high resolution
5. Style: ${styleGuide}`

      : `You are an expert Web3 marketing specialist for Arc Network. Your task is to generate a SHORT punchy caption AND an image prompt.

=== ARC NETWORK CONTEXT ===
${ARC_KNOWLEDGE_BASE.network.name}: ${ARC_KNOWLEDGE_BASE.network.tagline}
${ARC_KNOWLEDGE_BASE.network.description}

=== SELECTED FEATURES ===
${selectedFeatures}

=== ECOSYSTEM ===
Target dApps: ${dAppsContext}
Allowed links:
${linksContext}

Action: ${actionContext}

=== TWITTER ACCOUNT TYPE ===
NON-VERIFIED - SHORT caption required (${captionMinLength}-${captionMaxLength} characters MAX)

=== CRITICAL RULES FOR SHORT CAPTION ===

1. MANDATORY: Include "@ArcFlowFinance"
2. LENGTH: MAX ${captionMaxLength} characters - be CONCISE
3. FORMAT (3 lines only):
   - Line 1: Hook (1 punchy sentence)
   - Line 2: Action + 1-2 dApp mentions
   - Line 3: 1-2 URLs + 1-2 hashtags
4. TONE: ${toneInstructions}
5. NO financial claims

=== FOR IMAGE PROMPT ===
1. Unique visual for this specific post
2. NO text, NO logos - abstract only
3. 16:9, high resolution
4. Style: ${styleGuide}`;

const outputFormat = `
=== OUTPUT FORMAT ===
You MUST respond with ONLY valid JSON, no markdown, no explanations:
{
  "caption": "${isVerifiedTwitter ? 'Long-form structured post (1000-3000 chars)' : 'Short 3-line caption (max 200 chars)'} with \\n line breaks, includes @ArcFlowFinance and ${dappLinkCount} URLs",
  "imagePrompt": "Detailed visual scene description"
}`;

    const fullSystemPrompt = systemPrompt + outputFormat;

    const userPrompt = customInput 
      ? `Create a ${isVerifiedTwitter ? 'long-form educational post' : 'short punchy tweet'} for Arc Network with this focus: "${customInput}"
Campaign type: ${campaignContext}
Target dApps: ${dAppsContext}
Action order: ${actionContext}
Time window: ${timeContext}
Twitter type: ${isVerifiedTwitter ? 'VERIFIED (1000-3000 chars, structured, educational)' : 'Non-verified (max 200 chars, punchy)'}
Return JSON only.`
      : `Create a ${isVerifiedTwitter ? 'long-form educational post' : 'short punchy tweet'} for Arc Network.
Campaign type: ${campaignContext}
Intent: ${intentCategory || 'DeFi'}
Target dApps: ${dAppsContext}
Action order: ${actionContext}
Time window: ${timeContext}
Twitter type: ${isVerifiedTwitter ? 'VERIFIED (1000-3000 chars, structured, educational)' : 'Non-verified (max 200 chars, punchy)'}
Return JSON only.`;

    console.log("Unified generation: Generating caption + image prompt together...");
    console.log("Twitter type:", isVerifiedTwitter ? 'Verified' : 'Non-verified');

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
            { role: "system", content: fullSystemPrompt },
            { role: "user", content: attempts > 1 
              ? `${userPrompt}\n\nPREVIOUS ATTEMPT FAILED: Did not include @ArcFlowFinance or had invalid format. MANDATORY: Include @ArcFlowFinance mention! Caption must be ${captionMinLength}-${captionMaxLength} characters.`
              : userPrompt 
            }
          ],
          max_tokens: isVerifiedTwitter ? 2000 : 600, // More tokens for long-form
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
        
        continue;
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

        // Validate caption with Twitter type
        const validation = validateCaption(caption, allowedLinks, isVerifiedTwitter);
        if (!validation.valid) {
          console.warn("Caption validation failed:", validation.issues);

          // Apply deterministic fallbacks
          if (validation.issues.includes('missing_arcflow_mention')) {
            caption = injectArcFlowMention(caption);
          }
          if (validation.issues.includes('missing_dapp_links') || validation.issues.includes('wrong_links')) {
            caption = injectDAppLinks(caption, allowedLinks, maxDappLinks);
          }

          // Truncate if too long
          if (validation.issues.includes('too_long') && caption.length > captionMaxLength) {
            // Find last complete sentence within limit
            const sentences = caption.split('. ');
            let truncated = '';
            for (const sentence of sentences) {
              if ((truncated + sentence + '. ').length <= captionMaxLength - 20) {
                truncated += sentence + '. ';
              }
            }
            if (truncated.length > captionMinLength) {
              caption = truncated.trim();
              caption = injectArcFlowMention(caption);
              caption = injectDAppLinks(caption, allowedLinks, maxDappLinks);
            }
          }

          // Re-check after fallbacks
          const recheck = validateCaption(caption, allowedLinks, isVerifiedTwitter);
          if (!recheck.valid && !recheck.issues.includes('too_long')) {
            continue;
          }

          console.log("Applied fallbacks and recovered a valid caption");
          break;
        }

        console.log("Valid unified response generated");
        break;

      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        continue;
      }
    }

    // Final fallback
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

    caption = injectDAppLinks(caption, allowedLinks, maxDappLinks);

    // Add soft CTA for verified accounts
    if (isVerifiedTwitter && !caption.includes('app-intent.lovable.app')) {
      caption = caption.trim() + intentCTA;
    }

    // ============================================================
    // BUILD DYNAMIC IMAGE PROMPT with variety
    // ============================================================
    const dynamicPrompt = buildDynamicImagePrompt(
      styleGuide,
      caption,
      dAppsContext,
      actionContext,
      excludedThemes,
      excludedColors,
      excludedPov
    );

    // Enhance the AI-generated image prompt with dynamic variety
    const enhancedImagePrompt = `${dynamicPrompt.prompt}. ${imagePrompt}`;

    // ============================================================
    // SAVE TO GENERATION HISTORY for learning & duplicate prevention
    // ============================================================
    const captionHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(caption.toLowerCase().trim())
    ).then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));

    try {
      // Check for duplicate
      const { data: existingCaption } = await supabaseService
        .from('generation_history')
        .select('id')
        .eq('caption_hash', captionHash)
        .limit(1);

      if (existingCaption && existingCaption.length > 0) {
        console.warn("Duplicate caption detected, but proceeding (will save with same hash)");
      }

      // Save generation history
      await supabaseService
        .from('generation_history')
        .insert({
          user_id: userId,
          wallet_address: walletAddress || '',
          caption,
          caption_hash: captionHash,
          image_prompt: enhancedImagePrompt,
          dapps_context: Array.isArray(targetDApps) ? targetDApps : [],
          action_context: Array.isArray(actionOrder) ? actionOrder : [],
          style_used: imageStyle,
          tone_used: Array.isArray(tones) ? tones : [],
          color_palette: dynamicPrompt.color,
          visual_theme: dynamicPrompt.theme,
          pov_perspective: dynamicPrompt.pov,
          is_verified_twitter: isVerifiedTwitter,
        });

      console.log("✅ Generation history saved for AI learning");
    } catch (historyError) {
      console.warn("Could not save generation history:", historyError);
      // Non-blocking - continue with response
    }

    console.log("✅ Unified generation complete");
    console.log("Caption length:", caption.length, "chars (limit:", captionMaxLength, ")");
    console.log("Dynamic variety:", dynamicPrompt.theme.substring(0, 30) + "...");

    return new Response(
      JSON.stringify({ 
        caption,
        imagePrompt: enhancedImagePrompt,
        metadata: {
          campaignType,
          imageStyle,
          targetDApps: targetDApps || [],
          attempts,
          generatedAt: new Date().toISOString(),
          hasArcFlowMention: caption.includes('@ArcFlowFinance'),
          isVerifiedTwitter,
          captionLength: caption.length,
          maxLength: captionMaxLength,
          visualTheme: dynamicPrompt.theme,
          colorPalette: dynamicPrompt.color,
          povPerspective: dynamicPrompt.pov,
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
