
import React from 'react';
import { DealKillersDiagnostic } from '@/components/deal-killers/DealKillersDiagnostic';

const DealKillersDiagnosticPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Deal Killers Diagnostic
        </h1>
        <p className="text-xl text-muted-foreground">
          Brutal honesty about the two biggest deal killers: stubborn sellers and hidden issues.
        </p>
      </div>
      
      <DealKillersDiagnostic />
    </div>
  );
};

export default DealKillersDiagnosticPage;
