import React from 'react';
import { MergerMath } from '@/components/merger-math/MergerMath';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const MergerMathPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            Merger Math
          </h1>
          <Badge className="bg-white/10 text-white border-white/15 text-xs px-2 py-0.5">
            <Sparkles className="w-3 h-3 mr-1" />
            NEW
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground">
          Why strategic buyers pay more — and how to use that knowledge at the negotiation table.
        </p>
      </div>

      <MergerMath />
    </div>
  );
};

export default MergerMathPage;
