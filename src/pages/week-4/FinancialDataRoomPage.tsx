import React from 'react';
import FinancialDataRoom from '@/components/financial-data-room/FinancialDataRoom';

const FinancialDataRoomPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Financial Data Room Prep</h1>
          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
            NEW
          </span>
        </div>
        <p className="text-gray-400">
          Translate your QuickBooks into PE-speak — organize your financials into the standardized format PE firms expect.
        </p>
      </div>
      <FinancialDataRoom />
    </div>
  );
};

export default FinancialDataRoomPage;
