import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { CampaignData } from '@/pages/CreateCampaign';
import { IntentCategorySelector, IntentCategory } from './IntentCategorySelector';
import { TargetDAppsSelector } from './TargetDAppsSelector';
import { ActionOrderBuilder } from './ActionOrderBuilder';
import { TimeWindowSelector, TimeWindow } from './TimeWindowSelector';

const campaignTypes = [
  { value: 'product-launch', label: 'Product Launch', icon: '🚀' },
  { value: 'community-event', label: 'Community Event', icon: '👥' },
  { value: 'educational', label: 'Educational', icon: '📚' },
  { value: 'meme-campaign', label: 'Meme Campaign', icon: '🎭' },
  { value: 'defi-promotion', label: 'DeFi Promotion', icon: '💰' },
];

const tones = [
  { value: 'professional', label: 'Professional' },
  { value: 'hype', label: 'Hype' },
  { value: 'educational', label: 'Educational' },
  { value: 'degen', label: 'Degen' },
  { value: 'technical', label: 'Technical' },
];

const arcContextOptions = [
  { id: 'usdc-gas', label: 'USDC gas fees', description: 'Predictable transaction costs' },
  { id: 'sub-second', label: 'Sub-second finality', description: 'Lightning fast confirmations' },
  { id: 'arcflow', label: 'ArcFlow Finance', description: 'Native DeFi ecosystem' },
  { id: 'malachite', label: 'Malachite consensus', description: 'Innovative consensus mechanism' },
  { id: 'testnet', label: 'Testnet participation', description: 'Early adopter benefits' },
];

const imageStyles = [
  { value: 'cyberpunk', label: 'Cyberpunk', preview: '🌃' },
  { value: 'minimalist', label: 'Minimalist', preview: '◻️' },
  { value: 'gradient', label: 'Gradient Abstract', preview: '🌈' },
  { value: 'blueprint', label: 'Tech Blueprint', preview: '📐' },
  { value: 'space', label: 'Space Theme', preview: '🌌' },
];

interface CampaignFormProps {
  campaignData: CampaignData;
  setCampaignData: React.Dispatch<React.SetStateAction<CampaignData>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({
  campaignData,
  setCampaignData,
  onGenerate,
  isGenerating,
}) => {
  const selectedContextCount = campaignData.arcContext.length;
  
  // Basic form validation for AI generation
  const isBasicFormValid =
    campaignData.campaignType &&
    campaignData.tones.length > 0 &&
    selectedContextCount >= 2 &&
    campaignData.imageStyle;

  // Full form validation including INTENT fields
  const isIntentFieldsValid = 
    campaignData.intentCategory !== '' &&
    campaignData.targetDApps.length >= 2 &&
    campaignData.actionOrder.length >= 3;

  const toggleTone = (tone: string) => {
    setCampaignData(prev => ({
      ...prev,
      tones: prev.tones.includes(tone)
        ? prev.tones.filter(t => t !== tone)
        : [...prev.tones, tone],
    }));
  };

  const toggleArcContext = (contextId: string) => {
    setCampaignData(prev => ({
      ...prev,
      arcContext: prev.arcContext.includes(contextId)
        ? prev.arcContext.filter(c => c !== contextId)
        : [...prev.arcContext, contextId],
    }));
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8 border border-border/50">
      <div className="space-y-8">
        {/* Section: Intent Definition */}
        <div className="space-y-2">
          <h3 className="font-display font-semibold text-lg flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">1</span>
            Define Your Intent
          </h3>
          <p className="text-sm text-muted-foreground">Choose what type of activity you'll perform</p>
        </div>

        {/* Intent Category */}
        <IntentCategorySelector
          value={campaignData.intentCategory}
          onChange={(category) => setCampaignData(prev => ({ ...prev, intentCategory: category }))}
        />

        {/* Target dApps */}
        <TargetDAppsSelector
          value={campaignData.targetDApps}
          onChange={(dApps) => setCampaignData(prev => ({ ...prev, targetDApps: dApps }))}
        />

        {/* Action Order */}
        <ActionOrderBuilder
          value={campaignData.actionOrder}
          onChange={(actions) => setCampaignData(prev => ({ ...prev, actionOrder: actions }))}
        />

        {/* Time Window */}
        <TimeWindowSelector
          value={campaignData.timeWindow}
          onChange={(window) => setCampaignData(prev => ({ ...prev, timeWindow: window }))}
        />

        <Separator className="my-8" />

        {/* Section: Content Generation */}
        <div className="space-y-2">
          <h3 className="font-display font-semibold text-lg flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">2</span>
            Generate Content
          </h3>
          <p className="text-sm text-muted-foreground">AI will create marketing content for your intent</p>
        </div>

        {/* Campaign Type */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Campaign Type</label>
            <span className="text-destructive">*</span>
          </div>
          <Select
            value={campaignData.campaignType}
            onValueChange={(value) =>
              setCampaignData(prev => ({ ...prev, campaignType: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select campaign type" />
            </SelectTrigger>
            <SelectContent>
              {campaignTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <span className="flex items-center gap-2">
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tone Selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Tone</label>
            <span className="text-destructive">*</span>
            <span className="text-xs text-muted-foreground">(select one or more)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tones.map((tone) => (
              <button
                key={tone.value}
                onClick={() => toggleTone(tone.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  campaignData.tones.includes(tone.value)
                    ? 'bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)]'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {tone.label}
              </button>
            ))}
          </div>
        </div>

        {/* Arc Context */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Arc Context</label>
              <span className="text-destructive">*</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select features to mention in your campaign</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className={`text-xs ${selectedContextCount >= 2 ? 'text-accent' : 'text-muted-foreground'}`}>
              {selectedContextCount} of 5 selected (min 2)
            </span>
          </div>
          <div className="space-y-2">
            {arcContextOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                  campaignData.arcContext.includes(option.id)
                    ? 'bg-primary/10 border border-primary/30'
                    : 'bg-secondary/50 border border-transparent hover:bg-secondary'
                }`}
              >
                <Checkbox
                  checked={campaignData.arcContext.includes(option.id)}
                  onCheckedChange={() => toggleArcContext(option.id)}
                  className="mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium">{option.label}</span>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Custom Input (optional)</label>
            <span className="text-xs text-muted-foreground">
              {campaignData.customInput.length}/280
            </span>
          </div>
          <Textarea
            value={campaignData.customInput}
            onChange={(e) =>
              setCampaignData(prev => ({
                ...prev,
                customInput: e.target.value.slice(0, 280),
              }))
            }
            placeholder="Add your unique angle... (optional)"
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* Image Style */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Image Style</label>
            <span className="text-destructive">*</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {imageStyles.map((style) => (
              <button
                key={style.value}
                onClick={() =>
                  setCampaignData(prev => ({ ...prev, imageStyle: style.value }))
                }
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${
                  campaignData.imageStyle === style.value
                    ? 'bg-primary/20 border-2 border-primary shadow-[0_0_20px_hsl(var(--primary)/0.2)]'
                    : 'bg-secondary/50 border-2 border-transparent hover:border-border'
                }`}
              >
                <span className="text-2xl">{style.preview}</span>
                <span className="text-xs font-medium">{style.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="gradient"
            size="xl"
            className="w-full"
            onClick={onGenerate}
            disabled={!isBasicFormValid || isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                AI is generating...
              </>
            ) : (
              <>
                Generate Campaign
                <Zap className="w-5 h-5" />
              </>
            )}
          </Button>
          
          {/* Validation Messages */}
          <div className="mt-3 space-y-1">
            {!isBasicFormValid && (
              <p className="text-xs text-muted-foreground text-center">
                Fill in Campaign Type, Tone, Arc Context (min 2), and Image Style to generate
              </p>
            )}
            {isBasicFormValid && !isIntentFieldsValid && (
              <p className="text-xs text-accent/80 text-center">
                💡 Complete Intent fields above to lock your campaign as on-chain proof
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CampaignForm;
