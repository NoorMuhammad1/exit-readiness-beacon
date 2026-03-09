import React from 'react';
import { Countdown24 } from '@/components/countdown-24/Countdown24';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const Countdown24Page = () => {
  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            The 24-Month Countdown
          </h1>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-2 py-0.5">
            <Sparkles className="w-3 h-3 mr-1" />
            NEW
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground">
          Enter your target close date — get a month-by-month preparation calendar with "you're behind" warnings.
        </p>
      </div>

      <Countdown24 />
    </div>
  );
};

export default Countdown24Page;
