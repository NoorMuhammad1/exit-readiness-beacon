import React from 'react';
import { TheAuction } from '@/components/the-auction/TheAuction';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const TheAuctionPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            The Auction
          </h1>
          <Badge className="bg-white/10 text-white border-white/15 text-xs px-2 py-0.5">
            <Sparkles className="w-3 h-3 mr-1" />
            NEW
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground">
          Why 3+ bidders changes everything, how to run a competitive process, and why you need a banker.
        </p>
      </div>

      <TheAuction />
    </div>
  );
};

export default TheAuctionPage;
