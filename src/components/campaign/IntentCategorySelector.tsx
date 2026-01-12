import React from 'react';
import { Code, Coins, Users, Server } from 'lucide-react';
import { cn } from '@/lib/utils';

export type IntentCategory = 'builder' | 'defi' | 'social' | 'infrastructure';

interface IntentCategorySelectorProps {
  value: IntentCategory | '';
  onChange: (category: IntentCategory) => void;
}

const intentCategories = [
  { 
    value: 'builder' as IntentCategory, 
    label: 'Builder', 
    icon: Code,
    description: 'Deploying contracts, dev activity'
  },
  { 
    value: 'defi' as IntentCategory, 
    label: 'DeFi', 
    icon: Coins,
    description: 'Swaps, liquidity, lending'
  },
  { 
    value: 'social' as IntentCategory, 
    label: 'Social', 
    icon: Users,
    description: 'Content, community engagement'
  },
  { 
    value: 'infrastructure' as IntentCategory, 
    label: 'Infrastructure', 
    icon: Server,
    description: 'Node ops, tooling'
  },
];

export const IntentCategorySelector: React.FC<IntentCategorySelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Intent Category</label>
        <span className="text-destructive">*</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {intentCategories.map((category) => {
          const Icon = category.icon;
          const isSelected = value === category.value;
          
          return (
            <button
              key={category.value}
              type="button"
              onClick={() => onChange(category.value)}
              className={cn(
                "flex flex-col items-start gap-2 p-4 rounded-xl transition-all duration-300 text-left",
                isSelected
                  ? "bg-primary/20 border-2 border-primary shadow-[0_0_20px_hsl(var(--primary)/0.2)]"
                  : "bg-secondary/50 border-2 border-transparent hover:border-border"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                <span className="font-medium">{category.label}</span>
              </div>
              <span className="text-xs text-muted-foreground">{category.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default IntentCategorySelector;
