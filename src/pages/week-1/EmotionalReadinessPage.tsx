import React from 'react';
import { EmotionalReadiness } from '@/components/emotional-readiness/EmotionalReadiness';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const EmotionalReadinessPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            The Emotional Side of Selling
          </h1>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-2 py-0.5">
            <Sparkles className="w-3 h-3 mr-1" />
            NEW
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground">
          Are you actually ready to let go? What every seller goes through emotionally — and how to prepare so it doesn't kill the deal.
        </p>
      </div>

      <EmotionalReadiness />
    </div>
  );
};

export default EmotionalReadinessPage;
