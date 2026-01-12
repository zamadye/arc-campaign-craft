import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface TargetDAppsSelectorProps {
  value: string[];
  onChange: (dApps: string[]) => void;
}

const arcDApps = [
  { id: 'arcflow', name: 'ArcFlow Finance', description: 'Native DeFi protocol' },
  { id: 'arc-bridge', name: 'Arc Bridge', description: 'Cross-chain bridge' },
  { id: 'arc-swap', name: 'Arc Swap', description: 'DEX & token swaps' },
  { id: 'arc-lend', name: 'Arc Lend', description: 'Lending & borrowing' },
  { id: 'arc-nft', name: 'Arc NFT', description: 'NFT marketplace' },
  { id: 'arc-dao', name: 'Arc DAO', description: 'Governance platform' },
];

export const TargetDAppsSelector: React.FC<TargetDAppsSelectorProps> = ({
  value,
  onChange,
}) => {
  const toggleDApp = (dAppId: string) => {
    if (value.includes(dAppId)) {
      onChange(value.filter(id => id !== dAppId));
    } else {
      onChange([...value, dAppId]);
    }
  };

  const selectedCount = value.length;
  const isValid = selectedCount >= 2;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Target dApps</label>
          <span className="text-destructive">*</span>
        </div>
        <span className={cn(
          "text-xs",
          isValid ? "text-accent" : "text-muted-foreground"
        )}>
          {selectedCount} selected (min 2)
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {arcDApps.map((dApp) => {
          const isSelected = value.includes(dApp.id);
          
          return (
            <label
              key={dApp.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300",
                isSelected
                  ? "bg-accent/10 border border-accent/30"
                  : "bg-secondary/50 border border-transparent hover:bg-secondary"
              )}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => toggleDApp(dApp.id)}
                className="mt-0.5"
              />
              <div>
                <span className="text-sm font-medium">{dApp.name}</span>
                <p className="text-xs text-muted-foreground">{dApp.description}</p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default TargetDAppsSelector;
