import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Plus, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ActionOrderBuilderProps {
  value: string[];
  onChange: (actions: string[]) => void;
}

const suggestedActions = [
  'Connect wallet',
  'Swap tokens',
  'Provide liquidity',
  'Bridge assets',
  'Stake tokens',
  'Vote on proposal',
  'Mint NFT',
  'Deploy contract',
];

export const ActionOrderBuilder: React.FC<ActionOrderBuilderProps> = ({
  value,
  onChange,
}) => {
  const [newAction, setNewAction] = useState('');

  const addAction = (action: string) => {
    if (action.trim() && !value.includes(action.trim())) {
      onChange([...value, action.trim()]);
      setNewAction('');
    }
  };

  const removeAction = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveAction = (index: number, direction: 'up' | 'down') => {
    const newActions = [...value];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newActions.length) {
      [newActions[index], newActions[targetIndex]] = [newActions[targetIndex], newActions[index]];
      onChange(newActions);
    }
  };

  const isValid = value.length >= 3;
  const availableSuggestions = suggestedActions.filter(a => !value.includes(a));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Action Order</label>
          <span className="text-destructive">*</span>
        </div>
        <span className={cn(
          "text-xs",
          isValid ? "text-accent" : "text-muted-foreground"
        )}>
          {value.length} actions (min 3)
        </span>
      </div>

      {/* Action List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {value.map((action, index) => (
            <motion.div
              key={`${action}-${index}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50 group"
            >
              <div className="flex items-center gap-1 text-muted-foreground">
                <GripVertical className="w-4 h-4" />
                <span className="text-sm font-mono w-5">{index + 1}.</span>
              </div>
              <span className="flex-1 text-sm">{action}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => moveAction(index, 'up')}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-background disabled:opacity-30"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveAction(index, 'down')}
                  disabled={index === value.length - 1}
                  className="p-1 rounded hover:bg-background disabled:opacity-30"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeAction(index)}
                  className="p-1 rounded hover:bg-destructive/20 text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Custom Action */}
      <div className="flex gap-2">
        <Input
          value={newAction}
          onChange={(e) => setNewAction(e.target.value)}
          placeholder="Add custom action..."
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAction(newAction))}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => addAction(newAction)}
          disabled={!newAction.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Suggested Actions */}
      {availableSuggestions.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Quick add:</span>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.slice(0, 5).map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => addAction(action)}
                className="px-3 py-1.5 text-xs rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
              >
                + {action}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionOrderBuilder;
