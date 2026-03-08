
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

// Centralized module configuration that can be easily modified
export const moduleConfigurations: ModuleConfig[] = [
  // Week 1 - Foundation & Education (Reordered per user request)
  { name: 'Interactive Glossary', path: '/portal/week-1/glossary', weekNumber: 1, order: 1 },
  { name: 'Deal Progression', path: '/portal/week-1/deal-progression', weekNumber: 1, order: 2 },
  { name: 'Professional Advisors', path: '/portal/week-1/professional-advisors', weekNumber: 1, order: 3 },
  { name: 'Know Your Buyer', path: '/portal/week-1/know-your-buyer', weekNumber: 1, order: 4, enhancement: 'ENHANCED' },
  { name: 'Asset Free, Debt Free', path: '/portal/week-1/asset-free-education', weekNumber: 1, order: 5 },
  { name: 'Time Kills Deals', path: '/portal/week-1/time-kills-deals', weekNumber: 1, order: 6 },
  { name: 'EBITDA Explained', path: '/portal/week-1/ebitda-course', weekNumber: 1, order: 7 },
  
  // Week 2 - Deal Readiness
  { name: 'Data Room', path: '/portal/week-2/data-room', weekNumber: 2, order: 1 },
  { name: 'Asset Workshop', path: '/portal/week-2/asset-workshop', weekNumber: 2, order: 2 },
  { name: 'HoldCo Structure', path: '/portal/week-2/holdco-structure', weekNumber: 2, order: 3 },
  { name: 'Add Backs', path: '/portal/week-2/quick-wins', weekNumber: 2, order: 4 },
  { name: 'Debt & Interest Payments', path: '/portal/week-2/debt-interest', weekNumber: 2, order: 5 },
  { name: 'Seller Earnouts & Performance Multipliers', path: '/portal/week-2/earnouts-multipliers', weekNumber: 2, order: 6 },
  { name: 'Post-Closing Reality', path: '/portal/week-2/post-closing-reality', weekNumber: 2, order: 7 },
  
  // Week 3 - Performance Readiness
  { name: 'EBITDA Calculator', path: '/portal/week-3/ebitda-calculator', weekNumber: 3, order: 1 },
  { name: 'Industry Multipliers', path: '/portal/week-3/industry-multipliers', weekNumber: 3, order: 2 },
  { name: 'Scenario Planning', path: '/portal/week-3/scenarios', weekNumber: 3, order: 3 },
  { name: 'Management Scorecard', path: '/portal/week-3/scorecard', weekNumber: 3, order: 4 },
  { name: 'Top Performers', path: '/portal/week-3/top-performers', weekNumber: 3, order: 5 },
  { name: 'Business Scorecard', path: '/portal/week-3/business-scorecard', weekNumber: 3, order: 6 },
  { name: 'Deal Killers Diagnostic', path: '/portal/week-3/deal-killers', weekNumber: 3, order: 7 },
  { name: 'PE Screening Scorecard', path: '/portal/week-3/pe-screening', weekNumber: 3, order: 8, enhancement: 'ENHANCED' },
  { name: 'Competitive Analysis', path: '/portal/week-3/competitive-analysis', weekNumber: 3, order: 9, enhancement: 'ENHANCED' },
  { name: 'Returns Sensitivity', path: '/portal/week-3/returns-sensitivity', weekNumber: 3, order: 10, enhancement: 'ENHANCED' },
  
  // Week 4 - Final Readiness (Updated Discovery Interview module)
  { name: 'Due Diligence Checklist', path: '/portal/week-4/dd-checklist', weekNumber: 4, order: 1 },
  { name: 'LOI Review', path: '/portal/week-4/loi-review', weekNumber: 4, order: 2 },
  { name: 'Final Report', path: '/portal/week-4/final-report', weekNumber: 4, order: 3 },
  { name: 'Discovery Interview', path: '/portal/week-4/discovery-interview', weekNumber: 4, order: 4, enhancement: 'ENHANCED' },
  { name: 'Strategy Doc Builder', path: '/portal/week-4/value-builder', weekNumber: 4, order: 5 },
  { name: 'KPIs and OKRs', path: '/portal/week-4/kpis-okrs', weekNumber: 4, order: 6, enhancement: 'ENHANCED' },
  { name: 'Anonymous Teaser', path: '/portal/week-4/anonymous-teaser', weekNumber: 4, order: 7, enhancement: 'ENHANCED' }
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
