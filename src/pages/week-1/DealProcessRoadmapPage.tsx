import React from 'react';
import { DealProcessRoadmap } from '@/components/deal-process-roadmap/DealProcessRoadmap';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const DealProcessRoadmapPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            Deal Process Roadmap
          </h1>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs px-2 py-0.5">
            <Sparkles className="w-3 h-3 mr-1" />
            ENHANCED
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground">
          The complete PE deal process — 8 stages from preparation to close. Click any stage to see what happens, what you need, and what to watch out for.
        </p>
      </div>

      <DealProcessRoadmap />
    </div>
  );
};

export default DealProcessRoadmapPage;
