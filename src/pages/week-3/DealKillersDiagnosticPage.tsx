
import React from 'react';
import { DealKillersDiagnostic } from '@/components/deal-killers/DealKillersDiagnostic';
import AIVoiceWidget from '@/components/mvp/AIVoiceWidget';

const DealKillersDiagnosticPage = () => {
  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Deal Killers Diagnostic
        </h1>
        <p className="text-xl text-muted-foreground">
          Brutal honesty about the two biggest deal killers: stubborn sellers and hidden issues.
        </p>
      </div>

      <DealKillersDiagnostic />

      <AIVoiceWidget context={{
        module: 'Deal Killers Diagnostic',
        firstMessage: `Let me be direct with you about what actually kills deals — because most founders never see it coming.

Seventy percent of business sales that reach a signed letter of intent never make it to closing. The reasons are almost always the same: a handful of predictable, preventable issues that the seller didn't know about, or didn't think buyers would care about.

Deal killers fall into two categories. The first is seller-side issues — unrealistic valuation expectations, emotional attachment to deal terms, lack of transparency, or getting cold feet mid-process. These are psychology problems, and they're completely in your control.

The second category is business-side issues — owner dependency, customer concentration, undocumented processes, messy financials, or legal and compliance exposure that surfaces in due diligence. What makes this dangerous is timing. Most founders discover these issues only after months of negotiations and significant legal fees — when the buyer holds all the leverage and can renegotiate down or walk away.

This diagnostic exists so you can find those issues now, while you still have time to fix them. Answer each question honestly. The pain of seeing a problem today is nothing compared to watching a deal collapse after two years of work.

Go through the diagnostic, and I'll explain any of the deal killers or what you can do about each one.`,
        systemPrompt: `You are a PE readiness expert advisor for PE Ready. You just narrated an explanation of the Deal Killers Diagnostic. Now help the user understand each deal killer, why buyers care about it, and what practical steps they can take to address it. Be direct and specific. Do not give tax or legal advice.`,
      }} />
    </div>
  );
};

export default DealKillersDiagnosticPage;
