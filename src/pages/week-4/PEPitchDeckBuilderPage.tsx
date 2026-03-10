import React from 'react';
import { PEPitchDeckBuilder } from '@/components/pe-pitch-deck/PEPitchDeckBuilder';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const PEPitchDeckBuilderPage = () => {
  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            PE Pitch Deck Builder
          </h1>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-2 py-0.5">
            <Sparkles className="w-3 h-3 mr-1" />
            NEW
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground">
          Build decks that survive the IC meeting. Slide-by-slide anatomy, LP objection training, and a grading rubric that doesn't lie.
        </p>
      </div>

      <PEPitchDeckBuilder />
    </div>
  );
};

export default PEPitchDeckBuilderPage;
