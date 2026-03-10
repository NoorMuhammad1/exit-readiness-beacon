import React from 'react';
import { QoEExplainer } from '@/components/qoe-explainer/QoEExplainer';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const QoEExplainerPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            Surviving the Quality of Earnings
          </h1>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-2 py-0.5">
            <Sparkles className="w-3 h-3 mr-1" />
            NEW
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground">
          What a QoE report is, what the accountants will look at, and how to prepare so there are no surprises at the closing table.
        </p>
      </div>

      <QoEExplainer />
    </div>
  );
};

export default QoEExplainerPage;
