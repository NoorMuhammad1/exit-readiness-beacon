
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

      <AIVoiceWidget context={{ module: 'Deal Killers Diagnostic' }} />
    </div>
  );
};

export default DealKillersDiagnosticPage;
