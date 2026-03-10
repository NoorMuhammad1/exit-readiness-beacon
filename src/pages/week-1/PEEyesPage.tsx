import React from 'react';
import { PEEyes } from '@/components/pe-eyes/PEEyes';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const PEEyesPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            See Through PE Eyes
          </h1>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-2 py-0.5">
            <Sparkles className="w-3 h-3 mr-1" />
            NEW
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground">
          Input your P&L — see every red flag, adjustment, and vulnerability the way a buy-side QoE team would mark it up.
        </p>
      </div>

      <PEEyes />
    </div>
  );
};

export default PEEyesPage;
