
import React from 'react';
import { ReturnsSensitivity } from '@/components/returns-sensitivity/ReturnsSensitivity';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const ReturnsSensitivityPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            Returns Sensitivity
          </h1>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs px-2 py-0.5">
            <Sparkles className="w-3 h-3 mr-1" />
            ENHANCED
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground">
          See the exact math PE firms use to decide if your deal makes them money — IRR, MOIC, and sensitivity tables.
        </p>
      </div>

      <ReturnsSensitivity />
    </div>
  );
};

export default ReturnsSensitivityPage;
