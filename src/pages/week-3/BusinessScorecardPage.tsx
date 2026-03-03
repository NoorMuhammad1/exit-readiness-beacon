
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

      <AIVoiceWidget context={{
        module: 'Business Scorecard',
        firstMessage: `Let me walk you through the Business Scorecard — and why every dimension on it either adds to or subtracts from your valuation.

When a PE buyer looks at your business, they're not just looking at your financials. They're scoring it across multiple dimensions: revenue quality, customer concentration, management depth, operational efficiency, growth trajectory, and more. Think of it like a credit score for your business. The higher your score, the more leverage you have in negotiations.

A low score on any dimension gives the buyer a reason to discount the multiple they apply to your EBITDA. Even a half-turn reduction in your multiple can mean hundreds of thousands — or millions — of dollars off your exit price.

As you go through this scorecard, answer honestly. Don't score yourself on how you think you're doing — score yourself on how a skeptical PE buyer walking through your business for the first time would see it. The gaps you identify here are exactly what the full PE Ready program helps you close before you go to market.

Fill out the scorecard, and I'll explain what any dimension means or what buyers are specifically looking for in each area.`,
        systemPrompt: `You are a PE readiness expert advisor for PE Ready. You just narrated an explanation of the Business Scorecard. Now help the user understand what PE buyers look for in each scoring dimension, how to improve weak areas, and how scores translate to valuation multiples. Be concise and practical. Do not give tax or legal advice.`,
      }} />
    </div>
  );
};

export default BusinessScorecardPage;
