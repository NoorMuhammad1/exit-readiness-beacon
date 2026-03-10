import React from 'react';
import { LifeAfterExit } from '@/components/life-after-exit/LifeAfterExit';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const LifeAfterExitPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            Life After Exit
          </h1>
          <Badge className="bg-white/10 text-white border-white/15 text-xs px-2 py-0.5">
            <Sparkles className="w-3 h-3 mr-1" />
            NEW
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground">
          You got the check. Now what? Tax strategies, wealth allocation, and the plan that protects everything you built.
        </p>
      </div>

      <LifeAfterExit />
    </div>
  );
};

export default LifeAfterExitPage;
