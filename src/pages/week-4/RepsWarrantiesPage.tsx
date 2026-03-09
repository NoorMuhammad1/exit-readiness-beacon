import React from 'react';
import { RepsWarranties } from '@/components/reps-warranties/RepsWarranties';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const RepsWarrantiesPage = () => {
  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            Reps & Warranties — What Are You Promising?
          </h1>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-2 py-0.5">
            <Sparkles className="w-3 h-3 mr-1" />
            NEW
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground">
          The legally binding promises in your purchase agreement — and how to protect yourself.
        </p>
      </div>

      <RepsWarranties />
    </div>
  );
};

export default RepsWarrantiesPage;
