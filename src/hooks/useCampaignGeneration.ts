import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import toast from 'react-hot-toast';

interface CampaignData {
  campaignType: string;
  tones: string[];
  arcContext: string[];
  customInput: string;
  imageStyle: string;
  intentCategory?: string;
  targetDApps?: string[];
  actionOrder?: string[];
  timeWindow?: string;
}

export interface GeneratedCampaign {
  id: string;
  caption: string;
  imageUrl: string | null;
  imageStatus: 'pending' | 'generating' | 'completed' | 'failed';
  captionHash?: string;
}

// Simple hash function for caption deduplication
async function hashCaption(caption: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(caption.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate fingerprint from intent data
async function generateFingerprint(campaignData: CampaignData): Promise<string> {
  const intentData = {
    category: campaignData.intentCategory || '',
    dApps: (campaignData.targetDApps || []).sort(),
    actions: campaignData.actionOrder || [],
    timeWindow: campaignData.timeWindow || 'none'
  };
  
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(intentData));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function useCampaignGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [generatedCampaign, setGeneratedCampaign] = useState<GeneratedCampaign | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateCampaign = useCallback(async (
    campaignData: CampaignData,
    walletAddress: string | null
  ) => {
    setIsGenerating(true);
    setError(null);

    try {
      // ========================================
      // LAYER 1: Generate caption from Arc Network knowledge
      // ========================================
      console.log('🔵 Layer 1: Generating caption from Arc Network knowledge...');
      const captionResponse = await supabase.functions.invoke('generate-caption', {
        body: {
          campaignType: campaignData.campaignType,
          tones: campaignData.tones,
          arcContext: campaignData.arcContext,
          customInput: campaignData.customInput,
          walletAddress,
          intentCategory: campaignData.intentCategory,
          targetDApps: campaignData.targetDApps,
          actionOrder: campaignData.actionOrder
        }
      });

      if (captionResponse.error) {
        throw new Error(captionResponse.error.message || 'Failed to generate caption');
      }

      const { caption } = captionResponse.data;
      if (!caption) {
        throw new Error('No caption received from AI');
      }

      const captionHash = await hashCaption(caption);
      const campaignId = `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Set initial state with caption
      setGeneratedCampaign({
        id: campaignId,
        caption,
        imageUrl: null,
        imageStatus: 'generating',
        captionHash
      });

      toast.success('Caption generated!', { icon: '✍️' });
      console.log('✅ Layer 1 complete:', caption.substring(0, 50) + '...');

      // ========================================
      // LAYER 2: Generate visual prompt from caption + knowledge
      // ========================================
      console.log('🟡 Layer 2: Generating visual prompt from caption...');
      let visualPrompt: string | null = null;
      
      try {
        const promptResponse = await supabase.functions.invoke('generate-image-prompt', {
          body: {
            caption,
            imageStyle: campaignData.imageStyle,
            campaignType: campaignData.campaignType,
            arcContext: campaignData.arcContext
          }
        });

        if (promptResponse.error) {
          console.warn('Layer 2 warning - falling back to direct generation:', promptResponse.error);
        } else {
          visualPrompt = promptResponse.data?.visualPrompt;
          console.log('✅ Layer 2 complete: Visual prompt generated');
        }
      } catch (layer2Error) {
        console.warn('Layer 2 failed, proceeding with fallback:', layer2Error);
      }

      // ========================================
      // LAYER 3: Generate image from visual prompt
      // ========================================
      console.log('🟢 Layer 3: Generating image from visual prompt...');
      const imageResponse = await supabase.functions.invoke('generate-image', {
        body: {
          caption,
          imageStyle: campaignData.imageStyle,
          campaignType: campaignData.campaignType,
          visualPrompt // Pass the AI-generated visual prompt if available
        }
      });

      if (imageResponse.error) {
        console.error('Layer 3 failed:', imageResponse.error);
        setGeneratedCampaign(prev => prev ? {
          ...prev,
          imageStatus: 'failed'
        } : null);
        toast.error('Image generation failed, but caption is ready!');
      } else {
        const { imageUrl } = imageResponse.data;
        setGeneratedCampaign(prev => prev ? {
          ...prev,
          imageUrl,
          imageStatus: 'completed'
        } : null);
        toast.success('Image generated!', { icon: '🎨' });
        console.log('✅ Layer 3 complete: Image generated successfully');
      }

      return { success: true, campaignId };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Campaign generation failed';
      console.error('Campaign generation error:', err);
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const regenerateCampaign = useCallback(async (
    campaignData: CampaignData,
    walletAddress: string | null
  ) => {
    setGeneratedCampaign(null);
    return generateCampaign(campaignData, walletAddress);
  }, [generateCampaign]);

  const updateCaption = useCallback(async (newCaption: string) => {
    if (generatedCampaign) {
      const captionHash = await hashCaption(newCaption);
      setGeneratedCampaign({
        ...generatedCampaign,
        caption: newCaption,
        captionHash
      });
    }
  }, [generatedCampaign]);

  const completeCampaign = useCallback(async (
    campaignData: CampaignData,
    walletAddress: string
  ) => {
    if (!generatedCampaign) {
      throw new Error('No campaign to complete');
    }

    setIsCompleting(true);
    setError(null);

    try {
      // Generate fingerprint from intent data
      const fingerprint = await generateFingerprint(campaignData);
      
      const { data, error: insertError } = await supabase
        .from('campaigns')
        .insert({
          wallet_address: walletAddress,
          campaign_type: campaignData.campaignType,
          tones: campaignData.tones,
          arc_context: campaignData.arcContext,
          custom_input: campaignData.customInput,
          image_style: campaignData.imageStyle,
          caption: generatedCampaign.caption,
          caption_hash: generatedCampaign.captionHash || await hashCaption(generatedCampaign.caption),
          image_url: generatedCampaign.imageUrl,
          image_status: generatedCampaign.imageStatus,
          status: 'completed' // Mark as completed instead of draft
        })
        .select()
        .single();

      if (insertError) {
        // Check for duplicate caption
        if (insertError.code === '23505') {
          throw new Error('A campaign with similar content already exists. Please regenerate with different context.');
        }
        throw insertError;
      }

      // Quiet confirmation - no celebration
      toast('Campaign completed. Proof generating...', { 
        icon: '🔒',
        duration: 3000 
      });
      
      console.log('✅ Campaign completed with fingerprint:', fingerprint);
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete campaign';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsCompleting(false);
    }
  }, [generatedCampaign]);

  const resetCampaign = useCallback(() => {
    setGeneratedCampaign(null);
    setError(null);
  }, []);

  return {
    isGenerating,
    isCompleting,
    generatedCampaign,
    error,
    generateCampaign,
    regenerateCampaign,
    updateCaption,
    completeCampaign,
    resetCampaign,
    setGeneratedCampaign
  };
}
