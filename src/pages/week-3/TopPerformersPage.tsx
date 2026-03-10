
import React from 'react';
import { TopPerformers } from '@/components/top-performers/TopPerformers';

const TopPerformersPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Top Performers Analysis
        </h1>
        <p className="text-xl text-muted-foreground">
          Identify, assess, and protect your revenue-generating talent from PE acquisition risks.
        </p>
      </div>
      
      <TopPerformers />
    </div>
  );
};

export default TopPerformersPage;
