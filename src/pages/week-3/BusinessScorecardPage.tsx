
import React from 'react';
import { BusinessScorecard } from '@/components/business-scorecard/BusinessScorecard';

const BusinessScorecardPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Business Scorecard
        </h1>
        <p className="text-xl text-muted-foreground">
          Discover exactly how PE firms score your business and what every weakness costs you.
        </p>
      </div>
      
      <BusinessScorecard />
    </div>
  );
};

export default BusinessScorecardPage;
