
import React from 'react';
import { BusinessScorecard } from '@/components/business-scorecard/BusinessScorecard';
import AIVoiceWidget from '@/components/mvp/AIVoiceWidget';

const BusinessScorecardPage = () => {
  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Business Scorecard
        </h1>
        <p className="text-xl text-muted-foreground">
          Discover exactly how PE firms score your business and what every weakness costs you.
        </p>
      </div>

      <BusinessScorecard />

      <AIVoiceWidget context={{ module: 'Business Scorecard' }} />
    </div>
  );
};

export default BusinessScorecardPage;
