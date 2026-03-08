// Sector-Tailored Due Diligence Checklist Data
// Enhancement #1 — PE Ready Plus

export type Sector = 'saas' | 'healthcare' | 'manufacturing' | 'financial-services' | 'consumer';
export type Workstream = 'financial' | 'commercial' | 'legal' | 'operational' | 'hr-people' | 'it-tech' | 'esg';
export type ItemStatus = 'not-started' | 'requested' | 'received' | 'in-review' | 'complete' | 'red-flag';
export type Priority = 'P0' | 'P1' | 'P2';
export type RedFlagSeverity = 'deal-breaker' | 'significant' | 'manageable';

export interface DDItemTemplate {
  id: string;
  workstream: Workstream;
  title: string;
  description: string;
  priority: Priority;
  sectors: Sector[] | 'all';
}

export interface RedFlagData {
  severity: RedFlagSeverity;
  finding: string;
  mitigant: string;
}

export interface DDChecklistItem extends DDItemTemplate {
  status: ItemStatus;
  notes: string;
  redFlag?: RedFlagData;
}

export interface DDChecklistState {
  sector: Sector;
  items: DDChecklistItem[];
}

// Display names
export const sectorLabels: Record<Sector, string> = {
  'saas': 'Software / SaaS',
  'healthcare': 'Healthcare',
  'manufacturing': 'Manufacturing / Industrial',
  'financial-services': 'Financial Services',
  'consumer': 'Consumer / Retail',
};

export const sectorDescriptions: Record<Sector, string> = {
  'saas': 'Cloud software, subscription platforms, tech-enabled services',
  'healthcare': 'Healthcare services, medtech, pharma, behavioral health',
  'manufacturing': 'Industrial, aerospace, building products, chemicals',
  'financial-services': 'Insurance, banking, asset management, fintech',
  'consumer': 'Retail, restaurants, e-commerce, CPG, franchises',
};

export const workstreamLabels: Record<Workstream, string> = {
  'financial': 'Financial',
  'commercial': 'Commercial',
  'legal': 'Legal',
  'operational': 'Operational',
  'hr-people': 'HR / People',
  'it-tech': 'IT / Technology',
  'esg': 'Environmental / ESG',
};

export const statusLabels: Record<ItemStatus, string> = {
  'not-started': 'Not Started',
  'requested': 'Requested',
  'received': 'Received',
  'in-review': 'In Review',
  'complete': 'Complete',
  'red-flag': 'Red Flag',
};

export const statusColors: Record<ItemStatus, string> = {
  'not-started': 'text-gray-500',
  'requested': 'text-blue-500',
  'received': 'text-purple-500',
  'in-review': 'text-yellow-600',
  'complete': 'text-green-600',
  'red-flag': 'text-red-600',
};

export const statusBgColors: Record<ItemStatus, string> = {
  'not-started': 'bg-gray-100 text-gray-700',
  'requested': 'bg-blue-100 text-blue-700',
  'received': 'bg-purple-100 text-purple-700',
  'in-review': 'bg-yellow-100 text-yellow-700',
  'complete': 'bg-green-100 text-green-700',
  'red-flag': 'bg-red-100 text-red-700',
};

export const priorityColors: Record<Priority, string> = {
  'P0': 'bg-red-100 text-red-800 border-red-200',
  'P1': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'P2': 'bg-gray-100 text-gray-600 border-gray-200',
};

export const priorityLabels: Record<Priority, string> = {
  'P0': 'P0 — Critical',
  'P1': 'P1 — Important',
  'P2': 'P2 — Nice to Have',
};

export const severityColors: Record<RedFlagSeverity, string> = {
  'deal-breaker': 'bg-red-600 text-white',
  'significant': 'bg-orange-500 text-white',
  'manageable': 'bg-yellow-500 text-white',
};

// ─── CHECKLIST ITEM TEMPLATES ───────────────────────────────────────

export const ddItemTemplates: DDItemTemplate[] = [

  // ═══════════════════════════════════════════════════════════════════
  // FINANCIAL DUE DILIGENCE
  // ═══════════════════════════════════════════════════════════════════

  // Base items (all sectors)
  { id: 'fin-01', workstream: 'financial', title: 'Quality of Earnings (QoE) Analysis', description: 'Third-party QoE report validating reported EBITDA — revenue and cost adjustments', priority: 'P0', sectors: 'all' },
  { id: 'fin-02', workstream: 'financial', title: 'Audited Financial Statements (3-5 Years)', description: 'CPA-audited annual financials with footnotes', priority: 'P0', sectors: 'all' },
  { id: 'fin-03', workstream: 'financial', title: 'Monthly Financial Statements (Current Year)', description: 'P&L, balance sheet, and cash flow by month for the trailing 12 months', priority: 'P0', sectors: 'all' },
  { id: 'fin-04', workstream: 'financial', title: 'Tax Returns (3-5 Years)', description: 'Federal and state tax returns, including any amended filings', priority: 'P0', sectors: 'all' },
  { id: 'fin-05', workstream: 'financial', title: 'Working Capital Analysis', description: 'Normalized vs. actual working capital with seasonal adjustments', priority: 'P0', sectors: 'all' },
  { id: 'fin-06', workstream: 'financial', title: 'Cash Flow Statements & Projections', description: 'Historical and projected free cash flow, including capex requirements', priority: 'P0', sectors: 'all' },
  { id: 'fin-07', workstream: 'financial', title: 'Debt and Debt-Like Items Schedule', description: 'All outstanding debt, capital leases, deferred revenue, and off-balance-sheet items', priority: 'P1', sectors: 'all' },
  { id: 'fin-08', workstream: 'financial', title: 'Capital Expenditure Breakdown', description: 'Maintenance capex vs. growth capex split for the last 3 years', priority: 'P1', sectors: 'all' },
  { id: 'fin-09', workstream: 'financial', title: 'Accounts Receivable Aging', description: 'AR aging schedule with bad debt history and reserve methodology', priority: 'P1', sectors: 'all' },
  { id: 'fin-10', workstream: 'financial', title: 'Accounts Payable Summary', description: 'AP aging, payment terms with key vendors, and any past-due balances', priority: 'P1', sectors: 'all' },
  { id: 'fin-11', workstream: 'financial', title: 'Budget vs. Actual Variance Reports', description: 'Monthly budget-to-actual comparison for the last 2 years', priority: 'P1', sectors: 'all' },
  { id: 'fin-12', workstream: 'financial', title: 'Pro Forma Adjustments', description: 'Run-rate adjustments, synergies, add-backs, and one-time costs', priority: 'P1', sectors: 'all' },
  { id: 'fin-13', workstream: 'financial', title: 'Management Letter from Auditors', description: 'Most recent auditor management letter with recommendations', priority: 'P2', sectors: 'all' },

  // SaaS-specific
  { id: 'fin-s1', workstream: 'financial', title: 'ARR/MRR Cohort Analysis', description: 'Monthly recurring revenue by customer cohort with expansion and contraction', priority: 'P0', sectors: ['saas'] },
  { id: 'fin-s2', workstream: 'financial', title: 'Deferred Revenue Analysis', description: 'Deferred revenue schedule, ASC 606 compliance, and billing terms', priority: 'P1', sectors: ['saas'] },
  { id: 'fin-s3', workstream: 'financial', title: 'Hosting & Infrastructure Cost Breakdown', description: 'Cloud hosting costs as % of revenue, cost per customer trends', priority: 'P1', sectors: ['saas'] },

  // Healthcare-specific
  { id: 'fin-h1', workstream: 'financial', title: 'Reimbursement Rate Analysis', description: 'Payor reimbursement rates by CPT code, rate change trends over 3 years', priority: 'P0', sectors: ['healthcare'] },
  { id: 'fin-h2', workstream: 'financial', title: 'Payor Mix Breakdown', description: 'Revenue by payor type (Medicare, Medicaid, commercial, self-pay, workers comp)', priority: 'P0', sectors: ['healthcare'] },
  { id: 'fin-h3', workstream: 'financial', title: 'Revenue Cycle Metrics', description: 'Days in AR, denial rates, clean claim rates, collection rates by payor', priority: 'P1', sectors: ['healthcare'] },

  // Manufacturing-specific
  { id: 'fin-m1', workstream: 'financial', title: 'Raw Material Cost Trends', description: 'Key input costs over 3 years, hedging strategies, supplier pricing agreements', priority: 'P1', sectors: ['manufacturing'] },
  { id: 'fin-m2', workstream: 'financial', title: 'Inventory Valuation & Methods', description: 'FIFO/LIFO methodology, obsolescence reserves, inventory turns by category', priority: 'P0', sectors: ['manufacturing'] },
  { id: 'fin-m3', workstream: 'financial', title: 'Fixed vs. Variable Cost Structure', description: 'Cost breakdown showing operating leverage and breakeven analysis', priority: 'P1', sectors: ['manufacturing'] },

  // Financial Services-specific
  { id: 'fin-f1', workstream: 'financial', title: 'Regulatory Capital Adequacy', description: 'Capital ratios, reserve requirements, and stress test results', priority: 'P0', sectors: ['financial-services'] },
  { id: 'fin-f2', workstream: 'financial', title: 'Credit Loss Reserves', description: 'Loan loss provision methodology, historical loss rates, and reserve adequacy', priority: 'P0', sectors: ['financial-services'] },
  { id: 'fin-f3', workstream: 'financial', title: 'Interest Rate Sensitivity', description: 'Net interest margin analysis and impact of rate changes on portfolio', priority: 'P1', sectors: ['financial-services'] },

  // Consumer-specific
  { id: 'fin-c1', workstream: 'financial', title: 'Seasonal Revenue Patterns', description: 'Monthly revenue seasonality, peak periods, and inventory build cycles', priority: 'P1', sectors: ['consumer'] },
  { id: 'fin-c2', workstream: 'financial', title: 'Channel Profitability Analysis', description: 'Gross margin by channel (DTC, wholesale, e-commerce, retail)', priority: 'P0', sectors: ['consumer'] },
  { id: 'fin-c3', workstream: 'financial', title: 'Inventory Turnover Analysis', description: 'Turns by SKU category, markdown history, and shrinkage rates', priority: 'P1', sectors: ['consumer'] },

  // ═══════════════════════════════════════════════════════════════════
  // COMMERCIAL DUE DILIGENCE
  // ═══════════════════════════════════════════════════════════════════

  // Base items
  { id: 'com-01', workstream: 'commercial', title: 'Market Size & Growth (TAM/SAM/SOM)', description: 'Total addressable market, serviceable market, and obtainable market with sources', priority: 'P0', sectors: 'all' },
  { id: 'com-02', workstream: 'commercial', title: 'Competitive Positioning & Market Share', description: 'Market share estimate, key competitors, and competitive moats', priority: 'P0', sectors: 'all' },
  { id: 'com-03', workstream: 'commercial', title: 'Customer Concentration Analysis', description: 'Revenue by top 10/20 customers, single customer > 10% flag', priority: 'P0', sectors: 'all' },
  { id: 'com-04', workstream: 'commercial', title: 'Customer Retention & Churn Rates', description: 'Logo churn and revenue churn rates over 3 years', priority: 'P0', sectors: 'all' },
  { id: 'com-05', workstream: 'commercial', title: 'Pricing Strategy & Pricing Power', description: 'Pricing methodology, recent price increases, competitive pricing comparison', priority: 'P1', sectors: 'all' },
  { id: 'com-06', workstream: 'commercial', title: 'Sales Pipeline & Backlog', description: 'Current pipeline by stage, win rates, and committed backlog', priority: 'P1', sectors: 'all' },
  { id: 'com-07', workstream: 'commercial', title: 'Go-to-Market Strategy', description: 'Sales model (inside/outside/channel), marketing channels, and CAC', priority: 'P1', sectors: 'all' },
  { id: 'com-08', workstream: 'commercial', title: 'Contract Structure & Renewal Terms', description: 'Standard contract terms, auto-renewal clauses, termination provisions', priority: 'P1', sectors: 'all' },
  { id: 'com-09', workstream: 'commercial', title: 'NPS / Customer Satisfaction', description: 'Net Promoter Score or CSAT data with trends', priority: 'P2', sectors: 'all' },
  { id: 'com-10', workstream: 'commercial', title: 'Channel Partner Relationships', description: 'Key distribution partners, reseller agreements, and channel revenue %', priority: 'P2', sectors: 'all' },

  // SaaS-specific
  { id: 'com-s1', workstream: 'commercial', title: 'Net Dollar Retention (NDR)', description: 'NDR by cohort — expansion, contraction, and churn breakdown', priority: 'P0', sectors: ['saas'] },
  { id: 'com-s2', workstream: 'commercial', title: 'CAC & LTV Analysis', description: 'Customer acquisition cost, lifetime value, LTV:CAC ratio by segment', priority: 'P0', sectors: ['saas'] },
  { id: 'com-s3', workstream: 'commercial', title: 'Logo vs. Revenue Churn', description: 'Separate churn metrics for customer count and revenue dollars', priority: 'P1', sectors: ['saas'] },

  // Healthcare-specific
  { id: 'com-h1', workstream: 'commercial', title: 'Referral Network Analysis', description: 'Physician referral sources, referral volume trends, key relationships', priority: 'P0', sectors: ['healthcare'] },
  { id: 'com-h2', workstream: 'commercial', title: 'Regulatory Barrier Assessment', description: 'Certificate of Need, licensing, and other barriers to entry/competition', priority: 'P1', sectors: ['healthcare'] },
  { id: 'com-h3', workstream: 'commercial', title: 'Payor Relationship Quality', description: 'In-network status by payor, contract renewal timelines, rate negotiation history', priority: 'P1', sectors: ['healthcare'] },

  // Manufacturing-specific
  { id: 'com-m1', workstream: 'commercial', title: 'Long-Term Supply Agreements', description: 'Multi-year customer contracts, minimum purchase commitments, price escalators', priority: 'P0', sectors: ['manufacturing'] },
  { id: 'com-m2', workstream: 'commercial', title: 'Customer Switching Cost Analysis', description: 'How hard is it for customers to switch to a competitor? Qualification costs?', priority: 'P1', sectors: ['manufacturing'] },
  { id: 'com-m3', workstream: 'commercial', title: 'Order Backlog Depth', description: 'Committed order backlog in months of revenue, trend over 2 years', priority: 'P1', sectors: ['manufacturing'] },

  // Financial Services-specific
  { id: 'com-f1', workstream: 'commercial', title: 'AUM Growth Trajectory', description: 'Assets under management growth, net flows, and organic vs. acquired growth', priority: 'P0', sectors: ['financial-services'] },
  { id: 'com-f2', workstream: 'commercial', title: 'Client Segmentation Analysis', description: 'Revenue by client type, average account size, and wallet share', priority: 'P1', sectors: ['financial-services'] },
  { id: 'com-f3', workstream: 'commercial', title: 'Fee Structure Benchmarking', description: 'Fee schedules vs. industry benchmarks, fee compression trends', priority: 'P1', sectors: ['financial-services'] },

  // Consumer-specific
  { id: 'com-c1', workstream: 'commercial', title: 'Brand Awareness & Equity Metrics', description: 'Brand recognition surveys, social media following, sentiment analysis', priority: 'P1', sectors: ['consumer'] },
  { id: 'com-c2', workstream: 'commercial', title: 'E-commerce vs. Retail Channel Mix', description: 'Revenue split by channel with growth trends for each', priority: 'P0', sectors: ['consumer'] },
  { id: 'com-c3', workstream: 'commercial', title: 'Customer Acquisition Trends', description: 'New customer acquisition rates, source mix, and cost per acquisition', priority: 'P1', sectors: ['consumer'] },

  // ═══════════════════════════════════════════════════════════════════
  // LEGAL DUE DILIGENCE
  // ═══════════════════════════════════════════════════════════════════

  // Base items
  { id: 'leg-01', workstream: 'legal', title: 'Corporate Structure & Org Chart', description: 'Entity structure, subsidiaries, joint ventures, and ownership chain', priority: 'P0', sectors: 'all' },
  { id: 'leg-02', workstream: 'legal', title: 'Articles of Incorporation & Bylaws', description: 'Formation documents, amendments, and operating agreements', priority: 'P0', sectors: 'all' },
  { id: 'leg-03', workstream: 'legal', title: 'Stock Records & Cap Table', description: 'Fully diluted cap table, option pool, warrants, convertible notes', priority: 'P0', sectors: 'all' },
  { id: 'leg-04', workstream: 'legal', title: 'Material Contracts & Agreements', description: 'All contracts > $100K annually or with change-of-control provisions', priority: 'P0', sectors: 'all' },
  { id: 'leg-05', workstream: 'legal', title: 'Litigation History & Pending Claims', description: 'Active and threatened litigation, settlements in last 5 years, contingent liabilities', priority: 'P0', sectors: 'all' },
  { id: 'leg-06', workstream: 'legal', title: 'Intellectual Property Portfolio', description: 'Patents, trademarks, copyrights, trade secrets, and any challenges', priority: 'P1', sectors: 'all' },
  { id: 'leg-07', workstream: 'legal', title: 'Insurance Policies & Coverage', description: 'D&O, E&O, general liability, cyber, key-person — limits and exclusions', priority: 'P1', sectors: 'all' },
  { id: 'leg-08', workstream: 'legal', title: 'Board Meeting Minutes (2 Years)', description: 'Board and shareholder meeting minutes, written consents', priority: 'P1', sectors: 'all' },
  { id: 'leg-09', workstream: 'legal', title: 'Non-Compete & Non-Solicitation Agreements', description: 'Key employee restrictive covenants, enforceability analysis', priority: 'P1', sectors: 'all' },
  { id: 'leg-10', workstream: 'legal', title: 'Regulatory Licenses & Permits', description: 'All government licenses, permits, and certifications required to operate', priority: 'P1', sectors: 'all' },

  // SaaS-specific
  { id: 'leg-s1', workstream: 'legal', title: 'SaaS Subscription Agreement Templates', description: 'Standard terms, SLA commitments, data ownership clauses', priority: 'P1', sectors: ['saas'] },
  { id: 'leg-s2', workstream: 'legal', title: 'Open Source License Compliance', description: 'Open source inventory, license types (GPL, MIT, Apache), compliance risks', priority: 'P1', sectors: ['saas'] },
  { id: 'leg-s3', workstream: 'legal', title: 'Data Processing Agreements (DPAs)', description: 'Customer DPAs, sub-processor list, data residency commitments', priority: 'P1', sectors: ['saas'] },

  // Healthcare-specific
  { id: 'leg-h1', workstream: 'legal', title: 'HIPAA Compliance Documentation', description: 'HIPAA policies, risk assessments, BAAs, and breach history', priority: 'P0', sectors: ['healthcare'] },
  { id: 'leg-h2', workstream: 'legal', title: 'Medical License Verification', description: 'Physician/provider licenses, DEA registrations, any sanctions or exclusions', priority: 'P0', sectors: ['healthcare'] },
  { id: 'leg-h3', workstream: 'legal', title: 'Malpractice Insurance & Claims', description: 'Claims history, tail coverage, current policy limits', priority: 'P0', sectors: ['healthcare'] },

  // Manufacturing-specific
  { id: 'leg-m1', workstream: 'legal', title: 'Environmental Permits & Compliance', description: 'EPA permits, state environmental compliance, Phase I/II assessments', priority: 'P0', sectors: ['manufacturing'] },
  { id: 'leg-m2', workstream: 'legal', title: 'Product Liability History', description: 'Product liability claims, recalls, warranty reserves, and insurance', priority: 'P0', sectors: ['manufacturing'] },
  { id: 'leg-m3', workstream: 'legal', title: 'Union & Labor Agreements', description: 'Collective bargaining agreements, grievance history, contract expiration dates', priority: 'P1', sectors: ['manufacturing'] },

  // Financial Services-specific
  { id: 'leg-f1', workstream: 'legal', title: 'Regulatory Filing History', description: 'SEC, FINRA, state filings, examination history, and consent orders', priority: 'P0', sectors: ['financial-services'] },
  { id: 'leg-f2', workstream: 'legal', title: 'Broker-Dealer & Advisor Registrations', description: 'RIA, BD registrations, state registrations, Form ADV/CRS', priority: 'P0', sectors: ['financial-services'] },
  { id: 'leg-f3', workstream: 'legal', title: 'AML/KYC Compliance Documentation', description: 'Anti-money laundering program, KYC procedures, SAR filing history', priority: 'P0', sectors: ['financial-services'] },

  // Consumer-specific
  { id: 'leg-c1', workstream: 'legal', title: 'Trademark & Brand Registrations', description: 'All brand marks, trade dress, domain portfolio, and any challenges', priority: 'P0', sectors: ['consumer'] },
  { id: 'leg-c2', workstream: 'legal', title: 'Product Safety & Compliance', description: 'CPSC compliance, product testing certifications, recall history', priority: 'P1', sectors: ['consumer'] },
  { id: 'leg-c3', workstream: 'legal', title: 'Franchise Agreements (if applicable)', description: 'FDD filings, franchisee agreements, territory restrictions', priority: 'P1', sectors: ['consumer'] },

  // ═══════════════════════════════════════════════════════════════════
  // OPERATIONAL DUE DILIGENCE
  // ═══════════════════════════════════════════════════════════════════

  // Base items
  { id: 'ops-01', workstream: 'operational', title: 'Management Team Assessment', description: 'Bios, tenure, strengths/gaps, flight risk, and 360 references', priority: 'P0', sectors: 'all' },
  { id: 'ops-02', workstream: 'operational', title: 'Organizational Structure & Key Person Risk', description: 'Org chart with reporting lines, single points of failure', priority: 'P0', sectors: 'all' },
  { id: 'ops-03', workstream: 'operational', title: 'IT Systems & Infrastructure', description: 'Core systems inventory, age, integration points, and upgrade needs', priority: 'P1', sectors: 'all' },
  { id: 'ops-04', workstream: 'operational', title: 'Supply Chain & Vendor Dependencies', description: 'Key supplier list, single-source risks, payment terms, alternative sources', priority: 'P1', sectors: 'all' },
  { id: 'ops-05', workstream: 'operational', title: 'Facilities & Real Estate', description: 'Owned vs. leased, lease terms, condition assessments, expansion capacity', priority: 'P1', sectors: 'all' },
  { id: 'ops-06', workstream: 'operational', title: 'Business Continuity Plan', description: 'DR/BCP documentation, last test date, insurance coverage', priority: 'P1', sectors: 'all' },
  { id: 'ops-07', workstream: 'operational', title: 'Standard Operating Procedures', description: 'SOPs for core processes, documentation quality, institutional knowledge risk', priority: 'P2', sectors: 'all' },
  { id: 'ops-08', workstream: 'operational', title: 'Quality Management System', description: 'Quality certifications (ISO, etc.), defect rates, customer complaint tracking', priority: 'P2', sectors: 'all' },

  // SaaS-specific
  { id: 'ops-s1', workstream: 'operational', title: 'Technology Architecture Review', description: 'System architecture, microservices, cloud infrastructure, deployment model', priority: 'P0', sectors: ['saas'] },
  { id: 'ops-s2', workstream: 'operational', title: 'Scalability Assessment', description: 'Can infrastructure handle 10x growth? Bottlenecks and scaling plan', priority: 'P1', sectors: ['saas'] },
  { id: 'ops-s3', workstream: 'operational', title: 'DevOps & Deployment Processes', description: 'CI/CD pipeline, deployment frequency, rollback procedures, uptime SLA', priority: 'P1', sectors: ['saas'] },

  // Healthcare-specific
  { id: 'ops-h1', workstream: 'operational', title: 'Clinical Operations Workflow', description: 'Patient flow, appointment scheduling, clinical protocols, throughput metrics', priority: 'P0', sectors: ['healthcare'] },
  { id: 'ops-h2', workstream: 'operational', title: 'Patient Scheduling Systems', description: 'Scheduling platform, no-show rates, capacity utilization, wait times', priority: 'P1', sectors: ['healthcare'] },
  { id: 'ops-h3', workstream: 'operational', title: 'Equipment & Technology Audit', description: 'Medical equipment inventory, age, maintenance schedules, replacement costs', priority: 'P1', sectors: ['healthcare'] },

  // Manufacturing-specific
  { id: 'ops-m1', workstream: 'operational', title: 'Production Capacity Utilization', description: 'Current utilization %, shift patterns, bottlenecks, and expansion potential', priority: 'P0', sectors: ['manufacturing'] },
  { id: 'ops-m2', workstream: 'operational', title: 'Equipment Age & Condition Report', description: 'Major equipment list, age, maintenance log, and remaining useful life', priority: 'P0', sectors: ['manufacturing'] },
  { id: 'ops-m3', workstream: 'operational', title: 'Lean / Six Sigma Certifications', description: 'Process improvement history, waste reduction metrics, certified personnel', priority: 'P2', sectors: ['manufacturing'] },

  // Financial Services-specific
  { id: 'ops-f1', workstream: 'operational', title: 'Trading Systems & Platforms', description: 'Core trading/portfolio management systems, vendor contracts, integration points', priority: 'P0', sectors: ['financial-services'] },
  { id: 'ops-f2', workstream: 'operational', title: 'Disaster Recovery Plan', description: 'RTO/RPO targets, backup systems, last DR test results, regulatory requirements', priority: 'P0', sectors: ['financial-services'] },
  { id: 'ops-f3', workstream: 'operational', title: 'Third-Party Vendor Risk Management', description: 'Vendor due diligence program, critical vendors, concentration risk', priority: 'P1', sectors: ['financial-services'] },

  // Consumer-specific
  { id: 'ops-c1', workstream: 'operational', title: 'Distribution Network Assessment', description: 'Distribution centers, logistics partners, delivery times, fulfillment costs', priority: 'P0', sectors: ['consumer'] },
  { id: 'ops-c2', workstream: 'operational', title: 'Warehouse & Fulfillment Operations', description: 'Warehouse capacity, automation level, pick/pack efficiency, 3PL relationships', priority: 'P1', sectors: ['consumer'] },
  { id: 'ops-c3', workstream: 'operational', title: 'Omnichannel Capability', description: 'Online-to-store integration, inventory visibility, unified customer experience', priority: 'P1', sectors: ['consumer'] },

  // ═══════════════════════════════════════════════════════════════════
  // HR / PEOPLE DUE DILIGENCE
  // ═══════════════════════════════════════════════════════════════════

  // Base items
  { id: 'hr-01', workstream: 'hr-people', title: 'Org Chart & Headcount Trends', description: 'Current org chart, headcount by department over 3 years, open positions', priority: 'P0', sectors: 'all' },
  { id: 'hr-02', workstream: 'hr-people', title: 'Key Employee Retention Risk', description: 'Flight risk assessment for top 10-15 people, retention packages in place', priority: 'P0', sectors: 'all' },
  { id: 'hr-03', workstream: 'hr-people', title: 'Compensation Benchmarking', description: 'Total comp by role vs. market rates, equity/bonus structures', priority: 'P1', sectors: 'all' },
  { id: 'hr-04', workstream: 'hr-people', title: 'Benefits & Pension Obligations', description: 'Health insurance, 401k match, pension liabilities, COBRA obligations', priority: 'P1', sectors: 'all' },
  { id: 'hr-05', workstream: 'hr-people', title: 'Employee Handbook & Policies', description: 'Current handbook, PTO policies, remote work policies, disciplinary procedures', priority: 'P1', sectors: 'all' },
  { id: 'hr-06', workstream: 'hr-people', title: 'Culture & Engagement Assessment', description: 'Employee engagement survey results, Glassdoor reviews, turnover reasons', priority: 'P2', sectors: 'all' },
  { id: 'hr-07', workstream: 'hr-people', title: 'Training & Development Programs', description: 'Onboarding process, ongoing training, leadership development pipeline', priority: 'P2', sectors: 'all' },

  // SaaS-specific
  { id: 'hr-s1', workstream: 'hr-people', title: 'Engineering Talent Retention', description: 'Senior engineer tenure, equity vesting schedules, competitive offers', priority: 'P0', sectors: ['saas'] },
  { id: 'hr-s2', workstream: 'hr-people', title: 'Stock Option / Equity Plan Analysis', description: 'Option pool, vesting schedules, exercise prices, 409A valuations', priority: 'P1', sectors: ['saas'] },
  { id: 'hr-s3', workstream: 'hr-people', title: 'Remote Work Policies & Productivity', description: 'Remote/hybrid split, productivity metrics, collaboration tools', priority: 'P2', sectors: ['saas'] },

  // Healthcare-specific
  { id: 'hr-h1', workstream: 'hr-people', title: 'Physician / Clinician Staffing Ratios', description: 'Provider-to-patient ratios, staffing model, locum usage', priority: 'P0', sectors: ['healthcare'] },
  { id: 'hr-h2', workstream: 'hr-people', title: 'Credentialing Processes', description: 'Provider credentialing status, re-credentialing timelines, any lapses', priority: 'P1', sectors: ['healthcare'] },
  { id: 'hr-h3', workstream: 'hr-people', title: 'Turnover Rates by Department', description: 'Nursing, admin, clinical support turnover rates vs. industry benchmarks', priority: 'P1', sectors: ['healthcare'] },

  // Manufacturing-specific
  { id: 'hr-m1', workstream: 'hr-people', title: 'Skilled Labor Availability', description: 'Local labor market, apprenticeship programs, recruiting pipeline', priority: 'P0', sectors: ['manufacturing'] },
  { id: 'hr-m2', workstream: 'hr-people', title: 'Safety Record (OSHA)', description: 'OSHA recordable rates, TRIR, lost time incidents, safety programs', priority: 'P0', sectors: ['manufacturing'] },
  { id: 'hr-m3', workstream: 'hr-people', title: 'Union Agreements & CBA Terms', description: 'Collective bargaining terms, wage escalators, grievance history, expiration dates', priority: 'P1', sectors: ['manufacturing'] },

  // Financial Services-specific
  { id: 'hr-f1', workstream: 'hr-people', title: 'Licensed Personnel Inventory', description: 'Series 7, 66, CFA, CFP holders — registration status and compliance', priority: 'P0', sectors: ['financial-services'] },
  { id: 'hr-f2', workstream: 'hr-people', title: 'Compliance Training Records', description: 'Annual compliance training completion, AML certification, regulatory exams', priority: 'P1', sectors: ['financial-services'] },
  { id: 'hr-f3', workstream: 'hr-people', title: 'Non-Compete Enforceability', description: 'Key advisor non-competes, state enforceability, garden leave provisions', priority: 'P1', sectors: ['financial-services'] },

  // Consumer-specific
  { id: 'hr-c1', workstream: 'hr-people', title: 'Seasonal Staffing Patterns', description: 'Seasonal hiring needs, temporary worker costs, staffing agency relationships', priority: 'P1', sectors: ['consumer'] },
  { id: 'hr-c2', workstream: 'hr-people', title: 'Retail Employee Turnover', description: 'Hourly vs. salaried turnover rates, cost of turnover, retention programs', priority: 'P0', sectors: ['consumer'] },
  { id: 'hr-c3', workstream: 'hr-people', title: 'Store Management Bench Strength', description: 'Manager pipeline, internal promotion rates, multi-unit management capability', priority: 'P1', sectors: ['consumer'] },

  // ═══════════════════════════════════════════════════════════════════
  // IT / TECHNOLOGY DUE DILIGENCE
  // ═══════════════════════════════════════════════════════════════════

  // Base items
  { id: 'it-01', workstream: 'it-tech', title: 'Technology Stack & Architecture', description: 'Core systems, programming languages, databases, and how they connect', priority: 'P1', sectors: 'all' },
  { id: 'it-02', workstream: 'it-tech', title: 'Technical Debt Assessment', description: 'Known tech debt, legacy systems, modernization backlog and cost estimates', priority: 'P1', sectors: 'all' },
  { id: 'it-03', workstream: 'it-tech', title: 'Cybersecurity Posture', description: 'Security audit results, penetration test findings, incident history', priority: 'P0', sectors: 'all' },
  { id: 'it-04', workstream: 'it-tech', title: 'Data Privacy Compliance', description: 'GDPR, CCPA, state privacy law compliance, data inventory, consent management', priority: 'P0', sectors: 'all' },
  { id: 'it-05', workstream: 'it-tech', title: 'Product Roadmap & R&D Spend', description: 'Forward-looking product plans, R&D as % of revenue, key development bets', priority: 'P1', sectors: 'all' },
  { id: 'it-06', workstream: 'it-tech', title: 'Scalability Assessment', description: 'Ability to handle growth — infrastructure, licensing, architecture limits', priority: 'P1', sectors: 'all' },

  // SaaS-specific
  { id: 'it-s1', workstream: 'it-tech', title: 'SOC 2 Compliance Status', description: 'SOC 2 Type I/II reports, audit findings, remediation plans', priority: 'P0', sectors: ['saas'] },
  { id: 'it-s2', workstream: 'it-tech', title: 'Multi-Tenancy Architecture', description: 'Tenant isolation model, data segregation, customization per tenant', priority: 'P1', sectors: ['saas'] },
  { id: 'it-s3', workstream: 'it-tech', title: 'API Infrastructure & Integrations', description: 'API ecosystem, third-party integrations, rate limits, developer documentation', priority: 'P1', sectors: ['saas'] },

  // Healthcare-specific
  { id: 'it-h1', workstream: 'it-tech', title: 'EHR/EMR System Assessment', description: 'Electronic health records platform, version, customization level, data migration risk', priority: 'P0', sectors: ['healthcare'] },
  { id: 'it-h2', workstream: 'it-tech', title: 'HL7/FHIR Interoperability', description: 'Healthcare data exchange capabilities, integration with payors and labs', priority: 'P1', sectors: ['healthcare'] },
  { id: 'it-h3', workstream: 'it-tech', title: 'Telemedicine Platform Security', description: 'Telehealth platform, HIPAA compliance, patient data protection', priority: 'P1', sectors: ['healthcare'] },

  // Manufacturing-specific
  { id: 'it-m1', workstream: 'it-tech', title: 'SCADA / OT Security', description: 'Operational technology systems, network segmentation, vulnerability management', priority: 'P0', sectors: ['manufacturing'] },
  { id: 'it-m2', workstream: 'it-tech', title: 'ERP System Maturity', description: 'ERP platform, modules in use, data quality, upgrade path', priority: 'P1', sectors: ['manufacturing'] },
  { id: 'it-m3', workstream: 'it-tech', title: 'IoT Device Management', description: 'Connected devices on production floor, firmware management, security policies', priority: 'P2', sectors: ['manufacturing'] },

  // Financial Services-specific
  { id: 'it-f1', workstream: 'it-tech', title: 'Core Banking / Trading Systems', description: 'Core platform assessment, vendor lock-in risk, upgrade timeline', priority: 'P0', sectors: ['financial-services'] },
  { id: 'it-f2', workstream: 'it-tech', title: 'PCI-DSS Compliance', description: 'Payment card data handling, PCI compliance status, last audit results', priority: 'P0', sectors: ['financial-services'] },
  { id: 'it-f3', workstream: 'it-tech', title: 'Real-Time Processing Capabilities', description: 'Transaction processing speed, latency requirements, failover capacity', priority: 'P1', sectors: ['financial-services'] },

  // Consumer-specific
  { id: 'it-c1', workstream: 'it-tech', title: 'E-Commerce Platform Assessment', description: 'Platform (Shopify, custom, etc.), performance, conversion optimization, mobile experience', priority: 'P0', sectors: ['consumer'] },
  { id: 'it-c2', workstream: 'it-tech', title: 'POS System Integration', description: 'Point-of-sale platform, inventory sync, payment processing, reporting', priority: 'P1', sectors: ['consumer'] },
  { id: 'it-c3', workstream: 'it-tech', title: 'Mobile App & Digital Analytics', description: 'App store ratings, usage metrics, attribution tracking, personalization', priority: 'P1', sectors: ['consumer'] },

  // ═══════════════════════════════════════════════════════════════════
  // ENVIRONMENTAL / ESG
  // ═══════════════════════════════════════════════════════════════════

  // Base items
  { id: 'esg-01', workstream: 'esg', title: 'Environmental Liabilities Assessment', description: 'Known contamination, remediation obligations, Phase I/II environmental site assessments', priority: 'P1', sectors: 'all' },
  { id: 'esg-02', workstream: 'esg', title: 'Regulatory Compliance History', description: 'EPA/state environmental violations, fines, consent orders in last 10 years', priority: 'P1', sectors: 'all' },
  { id: 'esg-03', workstream: 'esg', title: 'ESG Policy & Reporting', description: 'Published ESG policy, sustainability reports, investor ESG questionnaire responses', priority: 'P2', sectors: 'all' },
  { id: 'esg-04', workstream: 'esg', title: 'Carbon Footprint & Sustainability', description: 'Scope 1/2/3 emissions, reduction targets, sustainability initiatives', priority: 'P2', sectors: 'all' },

  // SaaS-specific
  { id: 'esg-s1', workstream: 'esg', title: 'Data Center Energy Efficiency', description: 'PUE metrics, renewable energy %, carbon offset programs', priority: 'P2', sectors: ['saas'] },
  { id: 'esg-s2', workstream: 'esg', title: 'Digital Accessibility Compliance', description: 'WCAG compliance, Section 508, accessibility audit results', priority: 'P2', sectors: ['saas'] },

  // Healthcare-specific
  { id: 'esg-h1', workstream: 'esg', title: 'Medical Waste Management', description: 'Biohazard waste disposal, compliance with EPA and state regulations', priority: 'P1', sectors: ['healthcare'] },
  { id: 'esg-h2', workstream: 'esg', title: 'Community Health Impact', description: 'Community benefit reporting, charity care programs, health equity initiatives', priority: 'P2', sectors: ['healthcare'] },

  // Manufacturing-specific
  { id: 'esg-m1', workstream: 'esg', title: 'Emissions & Waste Management', description: 'Air permits, wastewater discharge, hazardous waste manifests, reduction targets', priority: 'P0', sectors: ['manufacturing'] },
  { id: 'esg-m2', workstream: 'esg', title: 'Environmental Remediation Costs', description: 'Known cleanup obligations, estimated costs, insurance coverage, timeline', priority: 'P0', sectors: ['manufacturing'] },
  { id: 'esg-m3', workstream: 'esg', title: 'Supply Chain Sustainability', description: 'Supplier environmental standards, conflict minerals, ethical sourcing policies', priority: 'P2', sectors: ['manufacturing'] },

  // Financial Services-specific
  { id: 'esg-f1', workstream: 'esg', title: 'ESG Investment Portfolio Screening', description: 'ESG integration in investment process, exclusion lists, impact measurement', priority: 'P1', sectors: ['financial-services'] },
  { id: 'esg-f2', workstream: 'esg', title: 'Regulatory ESG Reporting', description: 'SEC climate disclosure readiness, EU Taxonomy alignment (if applicable)', priority: 'P2', sectors: ['financial-services'] },

  // Consumer-specific
  { id: 'esg-c1', workstream: 'esg', title: 'Sustainable Sourcing Practices', description: 'Ethical sourcing certifications, fair trade, organic, supply chain transparency', priority: 'P1', sectors: ['consumer'] },
  { id: 'esg-c2', workstream: 'esg', title: 'Packaging & Waste Reduction', description: 'Packaging materials, recyclability, waste reduction targets, circular economy', priority: 'P2', sectors: ['consumer'] },
  { id: 'esg-c3', workstream: 'esg', title: 'Fair Labor Practices (Supply Chain)', description: 'Labor audit results, supplier code of conduct, forced labor screening', priority: 'P1', sectors: ['consumer'] },
];

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────

export function getItemsForSector(sector: Sector): DDItemTemplate[] {
  return ddItemTemplates.filter(item =>
    item.sectors === 'all' || item.sectors.includes(sector)
  );
}

export function generateChecklist(sector: Sector): DDChecklistItem[] {
  return getItemsForSector(sector).map(template => ({
    ...template,
    status: 'not-started' as ItemStatus,
    notes: '',
  }));
}

export function getWorkstreams(): Workstream[] {
  return ['financial', 'commercial', 'legal', 'operational', 'hr-people', 'it-tech', 'esg'];
}

export function getAllSectors(): Sector[] {
  return ['saas', 'healthcare', 'manufacturing', 'financial-services', 'consumer'];
}
