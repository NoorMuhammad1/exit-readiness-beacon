
export interface ModuleConfig {
  name: string;
  path: string;
  weekNumber: number;
  order: number;
  enhancement?: 'ENHANCED' | 'NEW';
}

export interface WeekConfig {
  number: number;
  title: string;
  icon: string;
  modules: ModuleConfig[];
}

// Centralized module configuration — flat list, ordered like a real deal flows
export const moduleConfigurations: ModuleConfig[] = [
  // Foundation — big picture first, then the language and players
  { name: 'Deal Process Roadmap', path: '/portal/week-1/deal-process', weekNumber: 1, order: 1, enhancement: 'ENHANCED' },
  { name: 'EBITDA Explained', path: '/portal/week-1/ebitda-course', weekNumber: 1, order: 2 },
  { name: 'How PE Firms Buy Companies', path: '/portal/week-1/lbo-explainer', weekNumber: 1, order: 3, enhancement: 'NEW' },
  { name: 'Interactive Glossary', path: '/portal/week-1/glossary', weekNumber: 1, order: 4 },
  { name: 'Deal Progression', path: '/portal/week-1/deal-progression', weekNumber: 1, order: 5 },
  { name: 'Professional Advisors', path: '/portal/week-1/professional-advisors', weekNumber: 1, order: 6 },
  { name: 'Know Your Buyer', path: '/portal/week-1/know-your-buyer', weekNumber: 1, order: 7, enhancement: 'ENHANCED' },
  { name: 'Asset Free, Debt Free', path: '/portal/week-1/asset-free-education', weekNumber: 1, order: 8 },
  { name: 'Time Kills Deals', path: '/portal/week-1/time-kills-deals', weekNumber: 1, order: 9 },
  { name: 'The Emotional Side', path: '/portal/week-1/emotional-readiness', weekNumber: 1, order: 10, enhancement: 'NEW' },
  { name: 'When to Walk Away', path: '/portal/week-1/when-to-walk', weekNumber: 1, order: 11, enhancement: 'NEW' },
  { name: 'The Auction', path: '/portal/week-1/the-auction', weekNumber: 1, order: 12, enhancement: 'NEW' },
  { name: 'See Through PE Eyes', path: '/portal/week-1/pe-eyes', weekNumber: 1, order: 13, enhancement: 'NEW' },
  { name: 'The 24-Month Countdown', path: '/portal/week-1/countdown-24', weekNumber: 1, order: 14, enhancement: 'NEW' },
  { name: 'Purchase Agreement Guide', path: '/portal/week-1/purchase-agreement', weekNumber: 1, order: 15, enhancement: 'NEW' },

  // Deal Readiness — understand the money before organizing the paperwork
  { name: 'Surviving the QoE', path: '/portal/week-2/qoe-explainer', weekNumber: 2, order: 1, enhancement: 'NEW' },
  { name: 'Working Capital', path: '/portal/week-2/working-capital', weekNumber: 2, order: 2, enhancement: 'NEW' },
  { name: 'Tax Structuring', path: '/portal/week-2/tax-structuring', weekNumber: 2, order: 3, enhancement: 'NEW' },
  { name: 'Asset Workshop', path: '/portal/week-2/asset-workshop', weekNumber: 2, order: 4 },
  { name: 'HoldCo Structure', path: '/portal/week-2/holdco-structure', weekNumber: 2, order: 5 },
  { name: 'Add Backs', path: '/portal/week-2/quick-wins', weekNumber: 2, order: 6 },
  { name: 'Debt & Interest Payments', path: '/portal/week-2/debt-interest', weekNumber: 2, order: 7 },
  { name: 'Seller Earnouts & Performance Multipliers', path: '/portal/week-2/earnouts-multipliers', weekNumber: 2, order: 8 },
  { name: 'Your Second Bite', path: '/portal/week-2/rollover-equity', weekNumber: 2, order: 9, enhancement: 'NEW' },
  { name: 'Post-Closing Reality', path: '/portal/week-2/post-closing-reality', weekNumber: 2, order: 10 },
  { name: 'Data Room', path: '/portal/week-2/data-room', weekNumber: 2, order: 11 },
  { name: 'Merger Math', path: '/portal/week-2/merger-math', weekNumber: 2, order: 12, enhancement: 'NEW' },
  { name: 'The Process Letter', path: '/portal/week-2/process-letter', weekNumber: 2, order: 13, enhancement: 'NEW' },
  { name: 'Life After Exit', path: '/portal/week-2/life-after-exit', weekNumber: 2, order: 14, enhancement: 'NEW' },
  { name: 'Deal Structure Lab', path: '/portal/week-2/deal-structure-lab', weekNumber: 2, order: 15, enhancement: 'NEW' },

  // Performance — valuation tools grouped, then diagnostics
  { name: 'EBITDA Calculator', path: '/portal/week-3/ebitda-calculator', weekNumber: 3, order: 1 },
  { name: 'Industry Multipliers', path: '/portal/week-3/industry-multipliers', weekNumber: 3, order: 2 },
  { name: 'Returns Sensitivity', path: '/portal/week-3/returns-sensitivity', weekNumber: 3, order: 3, enhancement: 'ENHANCED' },
  { name: 'Scenario Planning', path: '/portal/week-3/scenarios', weekNumber: 3, order: 4 },
  { name: 'Management Scorecard', path: '/portal/week-3/scorecard', weekNumber: 3, order: 5 },
  { name: 'Top Performers', path: '/portal/week-3/top-performers', weekNumber: 3, order: 6 },
  { name: 'Business Scorecard', path: '/portal/week-3/business-scorecard', weekNumber: 3, order: 7 },
  { name: 'Deal Killers Diagnostic', path: '/portal/week-3/deal-killers', weekNumber: 3, order: 8 },
  { name: 'PE Screening Scorecard', path: '/portal/week-3/pe-screening', weekNumber: 3, order: 9, enhancement: 'ENHANCED' },
  { name: 'Competitive Analysis', path: '/portal/week-3/competitive-analysis', weekNumber: 3, order: 10, enhancement: 'ENHANCED' },
  { name: 'Value Creation Plan', path: '/portal/week-3/value-creation', weekNumber: 3, order: 11, enhancement: 'ENHANCED' },
  { name: 'Revenue Quality Score', path: '/portal/week-3/revenue-quality', weekNumber: 3, order: 12, enhancement: 'ENHANCED' },
  { name: 'Comparable Analysis', path: '/portal/week-3/comparable-analysis', weekNumber: 3, order: 13, enhancement: 'NEW' },
  { name: 'DCF Valuation', path: '/portal/week-3/dcf-valuation', weekNumber: 3, order: 14, enhancement: 'NEW' },

  // Final Readiness — no changes, this flow already works
  { name: 'Due Diligence Checklist', path: '/portal/week-4/dd-checklist', weekNumber: 4, order: 1, enhancement: 'ENHANCED' },
  { name: 'LOI Review', path: '/portal/week-4/loi-review', weekNumber: 4, order: 2 },
  { name: 'Reps & Warranties', path: '/portal/week-4/reps-warranties', weekNumber: 4, order: 3, enhancement: 'NEW' },
  { name: 'Final Report', path: '/portal/week-4/final-report', weekNumber: 4, order: 4, enhancement: 'ENHANCED' },
  { name: 'Discovery Interview', path: '/portal/week-4/discovery-interview', weekNumber: 4, order: 5, enhancement: 'ENHANCED' },
  { name: 'Strategy Doc Builder', path: '/portal/week-4/value-builder', weekNumber: 4, order: 6 },
  { name: 'KPIs and OKRs', path: '/portal/week-4/kpis-okrs', weekNumber: 4, order: 7, enhancement: 'ENHANCED' },
  { name: 'Anonymous Teaser', path: '/portal/week-4/anonymous-teaser', weekNumber: 4, order: 8, enhancement: 'ENHANCED' },
  { name: 'Draft CIM Generator', path: '/portal/week-4/cim-generator', weekNumber: 4, order: 9, enhancement: 'ENHANCED' },
  { name: 'Financial Data Room Prep', path: '/portal/week-4/financial-data-room', weekNumber: 4, order: 10, enhancement: 'NEW' },
  { name: 'PE Pitch Deck Builder', path: '/portal/week-4/pe-pitch-deck', weekNumber: 4, order: 11, enhancement: 'NEW' },
  { name: 'Company One-Pager', path: '/portal/week-4/company-one-pager', weekNumber: 4, order: 12, enhancement: 'NEW' },
  { name: 'IC Memo Builder', path: '/portal/week-4/ic-memo', weekNumber: 4, order: 13, enhancement: 'NEW' },
  { name: 'DD Framework', path: '/portal/week-4/dd-framework', weekNumber: 4, order: 14, enhancement: 'NEW' },
  { name: '100-Day Plan', path: '/portal/week-4/hundred-day-plan', weekNumber: 4, order: 15, enhancement: 'NEW' }
];

// Helper function to get modules by week
export const getModulesByWeek = (weekNumber: number): ModuleConfig[] => {
  return moduleConfigurations
    .filter(module => module.weekNumber === weekNumber)
    .sort((a, b) => a.order - b.order);
};

// Helper function to get module count by week
export const getModuleCountByWeek = (weekNumber: number): number => {
  return moduleConfigurations.filter(module => module.weekNumber === weekNumber).length;
};

// Helper function to get all week configurations
export const getWeekConfigurations = () => {
  const weeks = [
    { number: 1, title: 'Foundation & Education', icon: 'BookOpen' },
    { number: 2, title: 'Deal Readiness', icon: 'Calculator' },
    { number: 3, title: 'Performance Readiness', icon: 'TrendingUp' },
    { number: 4, title: 'Final Readiness', icon: 'FileCheck' }
  ];

  return weeks.map(week => ({
    ...week,
    modules: getModulesByWeek(week.number)
  }));
};

// Helper function to move a module to a different week
export const moveModuleToWeek = (moduleName: string, newWeekNumber: number, newOrder: number = 999): ModuleConfig[] => {
  return moduleConfigurations.map(module => {
    if (module.name === moduleName) {
      return {
        ...module,
        weekNumber: newWeekNumber,
        order: newOrder,
        path: module.path.replace(/week-\d+/, `week-${newWeekNumber}`)
      };
    }
    return module;
  });
};

// Helper function to get the next module path
export const getNextModulePath = (currentModuleName: string): string | null => {
  const currentModule = moduleConfigurations.find(module => module.name === currentModuleName);
  if (!currentModule) return null;

  // Find the next module in the same week
  const nextInWeek = moduleConfigurations.find(module => 
    module.weekNumber === currentModule.weekNumber && 
    module.order === currentModule.order + 1
  );

  if (nextInWeek) {
    return nextInWeek.path;
  }

  // If no next module in the same week, find the first module of the next week
  const nextWeekModule = moduleConfigurations.find(module => 
    module.weekNumber === currentModule.weekNumber + 1 && 
    module.order === 1
  );

  return nextWeekModule ? nextWeekModule.path : null;
};
