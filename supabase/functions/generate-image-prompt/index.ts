import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive Arc Network knowledge base for visual prompt generation
const ARC_VISUAL_CONTEXT = {
  brand: {
    name: "Arc Network",
    tagline: "The Economic OS for the internet",
    description: "Purpose-built EVM-compatible Layer-1 blockchain for stablecoin finance and tokenization",
    colors: {
      primary: "electric cyan (#00D9FF)",
      secondary: "deep space blue (#0A0E27)", 
      accent: "USDC green (#26A17B)",
      gradients: ["cyan to teal", "deep blue to purple", "emerald to cyan"]
    },
    visualElements: [
      "circular arc shapes",
      "interconnected nodes",
      "flowing transaction lines",
      "USDC coin symbols",
      "blockchain network visualization",
      "deterministic finality indicators",
      "speed/lightning motifs"
    ]
  },
  technology: {
    consensus: "Malachite - innovative consensus providing deterministic finality",
    finality: "Sub-second settlement with deterministic confirmation",
    gas: "USDC as native gas token for predictable costs",
    compatibility: "Full EVM compatibility for easy migration"
  },
  ecosystem: {
    categories: ["DeFi", "Payments", "Tokenization", "Trading", "Infrastructure"],
    partners: [
      "Circle", "Coinbase", "BlackRock", "Chainlink", "Alchemy", 
      "Fireblocks", "Curve", "Deutsche Bank", "BitGo", "Blockdaemon"
    ],
    useCases: [
      "Global payments",
      "FX settlements", 
      "Capital markets",
      "Stablecoin DeFi",
      "Tokenized assets (RWA)",
      "Cross-border remittances"
    ]
  }
};

const IMAGE_STYLE_VISUAL_GUIDES: Record<string, string> = {
  "cyberpunk": "neon-lit futuristic cityscape, holographic displays, cyan and magenta accents, dark tech aesthetic, glowing blockchain networks in the sky, digital rain effects",
  "minimalist": "clean geometric composition, abundant negative space, precise lines, monochromatic with single cyan accent, zen-like simplicity, floating elements",
  "gradient": "smooth flowing color transitions, abstract organic shapes, dreamy atmosphere, soft glows, ethereal light beams, aurora-like effects",
  "blueprint": "technical schematic style, grid overlay, precise wireframe drawings, dark blue background with white/cyan lines, engineering precision, node diagrams",
  "space": "deep cosmic backdrop, nebulae and stars, planetary elements, blockchain constellation patterns, ethereal glow, sci-fi grandeur, orbital trajectories"
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { caption, imageStyle, campaignType, arcContext } = await req.json();

    if (!caption || !imageStyle) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: caption, imageStyle" }),
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

    const styleGuide = IMAGE_STYLE_VISUAL_GUIDES[imageStyle] || IMAGE_STYLE_VISUAL_GUIDES["cyberpunk"];

    // Layer 2: Generate detailed visual prompt from caption + knowledge
    const systemPrompt = `You are an expert visual prompt engineer specializing in blockchain and fintech marketing imagery.

Your task: Transform a marketing caption into a detailed, evocative image generation prompt.

BRAND KNOWLEDGE - ARC NETWORK:
- Name: ${ARC_VISUAL_CONTEXT.brand.name}
- Tagline: "${ARC_VISUAL_CONTEXT.brand.tagline}"
- Description: ${ARC_VISUAL_CONTEXT.brand.description}

COLOR PALETTE:
- Primary: ${ARC_VISUAL_CONTEXT.brand.colors.primary}
- Secondary: ${ARC_VISUAL_CONTEXT.brand.colors.secondary}
- Accent: ${ARC_VISUAL_CONTEXT.brand.colors.accent}

BRAND VISUAL ELEMENTS:
${ARC_VISUAL_CONTEXT.brand.visualElements.map(e => `- ${e}`).join('\n')}

TECHNOLOGY THEMES:
- ${ARC_VISUAL_CONTEXT.technology.consensus}
- ${ARC_VISUAL_CONTEXT.technology.finality}
- ${ARC_VISUAL_CONTEXT.technology.gas}

ECOSYSTEM CONTEXT:
Partners: ${ARC_VISUAL_CONTEXT.ecosystem.partners.slice(0, 5).join(', ')}
Use cases: ${ARC_VISUAL_CONTEXT.ecosystem.useCases.join(', ')}

STYLE DIRECTION: ${styleGuide}

RULES:
1. Create a vivid, detailed visual description (150-200 words)
2. NEVER include text, words, letters, or logos in the image description
3. Focus on abstract representations of the concepts
4. Use the exact color palette specified
5. Include atmospheric and lighting details
6. Make it suitable for social media marketing
7. Emphasize motion, energy, and innovation
8. Create a 16:9 cinematic composition
9. Ultra high resolution, professional marketing quality`;

    const userPrompt = `Transform this Arc Network marketing caption into a detailed image generation prompt:

CAPTION: "${caption}"

CAMPAIGN TYPE: ${campaignType || 'general'}

Create a visually stunning, abstract representation that captures the essence of this message without any text or words. Focus on the emotional impact and technological innovation.`;

    console.log("Layer 2: Generating visual prompt from caption...");

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
        max_tokens: 500,
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
    const visualPrompt = data.choices?.[0]?.message?.content?.trim();

    if (!visualPrompt) {
      console.error("No visual prompt generated:", data);
      return new Response(
        JSON.stringify({ error: "Failed to generate visual prompt" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Visual prompt generated successfully:", visualPrompt.substring(0, 100) + "...");

    return new Response(
      JSON.stringify({ 
        visualPrompt,
        metadata: {
          sourceCaption: caption.substring(0, 50) + "...",
          style: imageStyle,
          generatedAt: new Date().toISOString()
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Visual prompt generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
