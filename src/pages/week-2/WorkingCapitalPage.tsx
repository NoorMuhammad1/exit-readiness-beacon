import React from 'react';
import { WorkingCapital } from '@/components/working-capital/WorkingCapital';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const WorkingCapitalPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            Working Capital — The Surprise at Closing
          </h1>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-2 py-0.5">
            <Sparkles className="w-3 h-3 mr-1" />
            NEW
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground">
          How the working capital peg works, why it exists, and how to avoid losing money at the closing table.
        </p>
      </div>

      <WorkingCapital />
    </div>
  );
};

export default WorkingCapitalPage;
