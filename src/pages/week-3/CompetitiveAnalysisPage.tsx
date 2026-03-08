
import React from 'react';
import { CompetitiveAnalysis } from '@/components/competitive-analysis/CompetitiveAnalysis';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const CompetitiveAnalysisPage = () => {
  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            Competitive Analysis
          </h1>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs px-2 py-0.5">
            <Sparkles className="w-3 h-3 mr-1" />
            ENHANCED
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground">
          TAM/SAM/SOM market sizing, Porter's Five Forces, and competitive positioning — the market story PE firms need to hear.
        </p>
      </div>

      <CompetitiveAnalysis />
    </div>
  );
};

export default CompetitiveAnalysisPage;
