import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: 'accounting-financial' | 'legal-contract' | 'deal-structure' | 'pe-specific' | 'valuation-metrics';
  example?: string;
  isFavorite?: boolean;
}

const glossaryTerms: GlossaryTerm[] = [
  // ACCOUNTING & FINANCIAL TERMS
  {
    id: '1',
    term: 'EBITDA',
    definition: 'Earnings Before Interest, Taxes, Depreciation, Amortization. Your operating profit before financing and non-cash expenses. The #1 metric buyers use.',
    category: 'accounting-financial',
    example: 'A company with $2M revenue, $1.5M operating expenses has $500K EBITDA.'
  },
  {
    id: '2',
    term: 'Add-Backs',
    definition: 'Expenses added back to profit to show "normalized" EBITDA. Common examples: owner\'s excessive salary, personal vehicle, one-time legal fees.',
    category: 'accounting-financial',
    example: 'Adding back $50K in owner\'s personal expenses and $25K in one-time legal fees to increase EBITDA by $75K.'
  },
  {
    id: '3',
    term: 'Working Capital',
    definition: 'Current assets minus current liabilities. The cash needed to run day-to-day operations.',
    category: 'accounting-financial',
    example: 'Current assets of $500K minus current liabilities of $300K equals $200K working capital.'
  },
  {
    id: '4',
    term: 'Working Capital Adjustment',
    definition: 'Post-closing true-up ensuring business has normal operating cash. Like agreeing on gas in tank when selling a car.',
    category: 'accounting-financial',
    example: 'Normal working capital is $200K; at closing it\'s $150K, so purchase price reduced by $50K.'
  },
  {
    id: '5',
    term: 'Quality of Earnings (QoE)',
    definition: 'Deep financial analysis to verify your EBITDA is real and sustainable. Like an audit focused on cash flow quality.',
    category: 'accounting-financial',
    example: 'QoE finds $200K in non-recurring revenue, reducing adjusted EBITDA from $1.2M to $1M.'
  },
  {
    id: '6',
    term: 'Revenue Recognition',
    definition: 'Accounting rules for when revenue is recorded. Critical for subscription businesses and long-term contracts.',
    category: 'accounting-financial',
    example: 'SaaS company collects $12K annual subscription but recognizes $1K monthly.'
  },
  {
    id: '7',
    term: 'Gross Margin',
    definition: 'Revenue minus direct costs, expressed as percentage. Higher margins = more valuable business.',
    category: 'accounting-financial',
    example: '$1M revenue with $300K direct costs = 70% gross margin.'
  },
  {
    id: '8',
    term: 'Cash Flow',
    definition: 'Actual cash moving in and out of business. Different from profit due to timing differences.',
    category: 'accounting-financial',
    example: 'Profitable company with slow collections may have negative cash flow.'
  },
  {
    id: '9',
    term: 'Free Cash Flow',
    definition: 'Cash from operations minus capital expenditures. What\'s left after keeping business running.',
    category: 'accounting-financial',
    example: '$800K operating cash flow minus $200K equipment purchases = $600K free cash flow.'
  },
  {
    id: '10',
    term: 'CapEx (Capital Expenditures)',
    definition: 'Money spent on equipment, property, and assets that last multiple years.',
    category: 'accounting-financial',
    example: 'Buying $100K manufacturing equipment recorded as CapEx, not expense.'
  },
  {
    id: '11',
    term: 'Accounts Receivable (AR)',
    definition: 'Money customers owe you. High AR relative to revenue suggests collection problems.',
    category: 'accounting-financial',
    example: '$200K AR on $1.2M annual revenue = 60 days sales outstanding.'
  },
  {
    id: '12',
    term: 'DSO (Days Sales Outstanding)',
    definition: 'Average days to collect payment. Lower is better for cash flow.',
    category: 'accounting-financial',
    example: '45 DSO means customers pay in 45 days on average.'
  },
  {
    id: '13',
    term: 'Inventory Turnover',
    definition: 'How quickly inventory sells. Higher turnover = better cash flow and less obsolete stock.',
    category: 'accounting-financial',
    example: '$500K annual COGS ÷ $100K inventory = 5x turnover (sells inventory 5 times per year).'
  },
  {
    id: '14',
    term: 'Burn Rate',
    definition: 'Monthly cash consumption for loss-making businesses. Critical for startups and growth companies.',
    category: 'accounting-financial',
    example: 'Company loses $50K monthly = $50K burn rate.'
  },
  {
    id: '15',
    term: 'Runway',
    definition: 'Months of cash remaining at current burn rate. How long until money runs out.',
    category: 'accounting-financial',
    example: '$500K cash ÷ $50K monthly burn = 10 months runway.'
  },
  {
    id: '16',
    term: 'GAAP',
    definition: 'Generally Accepted Accounting Principles. Standard accounting rules buyers expect you to follow.',
    category: 'accounting-financial',
    example: 'Cash-basis accounting converted to GAAP accrual for sale preparation.'
  },
  {
    id: '17',
    term: 'Accrual Accounting',
    definition: 'Recording transactions when they occur, not when cash changes hands. Required for larger sales.',
    category: 'accounting-financial',
    example: 'Record December sale in December even if customer pays in January.'
  },
  {
    id: '18',
    term: 'Deferred Revenue',
    definition: 'Cash received for services not yet delivered. Liability on balance sheet.',
    category: 'accounting-financial',
    example: 'Annual subscription paid upfront creates $12K deferred revenue liability.'
  },
  {
    id: '19',
    term: 'Recurring Revenue',
    definition: 'Predictable revenue from subscriptions, contracts, or repeat customers. Highly valued by buyers.',
    category: 'accounting-financial',
    example: 'SaaS company with $100K monthly recurring revenue.'
  },
  {
    id: '20',
    term: 'ARR (Annual Recurring Revenue)',
    definition: 'Yearly value of subscription revenue. Standard metric for SaaS businesses.',
    category: 'accounting-financial',
    example: '$10K monthly subscriptions = $120K ARR.'
  },
  {
    id: '21',
    term: 'MRR (Monthly Recurring Revenue)',
    definition: 'Monthly subscription revenue. Key SaaS metric tracked closely by buyers.',
    category: 'accounting-financial',
    example: '100 customers × $100/month = $10K MRR.'
  },
  {
    id: '22',
    term: 'Customer Churn Rate',
    definition: 'Percentage of customers lost monthly. Lower churn = higher valuation.',
    category: 'accounting-financial',
    example: 'Lost 5 of 100 customers = 5% monthly churn rate.'
  },
  {
    id: '23',
    term: 'LTV (Customer Lifetime Value)',
    definition: 'Total revenue expected from average customer over their lifetime.',
    category: 'accounting-financial',
    example: '$100 monthly × 24 months average = $2,400 LTV.'
  },
  {
    id: '24',
    term: 'CAC (Customer Acquisition Cost)',
    definition: 'Total cost to acquire one new customer. Should be much lower than LTV.',
    category: 'accounting-financial',
    example: '$10K marketing spend ÷ 50 new customers = $200 CAC.'
  },
  {
    id: '25',
    term: 'Unit Economics',
    definition: 'Profit per customer or unit sold. Must be positive for sustainable growth.',
    category: 'accounting-financial',
    example: '$2,400 LTV - $200 CAC = $2,200 unit profit.'
  },
  {
    id: '117',
    term: 'Churn Rate',
    definition: 'Percentage of customers who stop using your service over a given period. Critical metric for subscription businesses.',
    category: 'accounting-financial',
    example: 'Lost 10 customers out of 200 in a month = 5% monthly churn rate.'
  },
  {
    id: '118',
    term: 'COGS (Cost of Goods Sold)',
    definition: 'Direct costs to produce goods or services sold. Used to calculate gross margin.',
    category: 'accounting-financial',
    example: 'Manufacturing costs of $300K for products that generated $1M revenue.'
  },
  {
    id: '119',
    term: 'Depreciation',
    definition: 'Accounting method to spread asset costs over its useful life. Non-cash expense added back to EBITDA.',
    category: 'accounting-financial',
    example: '$100K machine depreciated over 10 years = $10K annual depreciation expense.'
  },
  {
    id: '120',
    term: 'Amortization',
    definition: 'Similar to depreciation but for intangible assets like patents or goodwill. Non-cash expense.',
    category: 'accounting-financial',
    example: '$500K goodwill amortized over 15 years = $33K annual amortization.'
  },
  {
    id: '121',
    term: 'Net Debt',
    definition: 'Total debt minus cash and cash equivalents. Key metric in enterprise value calculations.',
    category: 'accounting-financial',
    example: '$2M in loans minus $300K cash = $1.7M net debt.'
  },
  {
    id: '122',
    term: 'Operating Margin',
    definition: 'Operating income as percentage of revenue. Shows efficiency of core business operations.',
    category: 'accounting-financial',
    example: '$400K operating income on $2M revenue = 20% operating margin.'
  },
  {
    id: '123',
    term: 'Return on Capital',
    definition: 'Measures how efficiently company uses capital to generate profits. Higher is better.',
    category: 'accounting-financial',
    example: '$500K EBITDA on $2M invested capital = 25% return on capital.'
  },
  {
    id: '124',
    term: 'Asset Light',
    definition: 'Business model requiring minimal physical assets. Often valued higher due to scalability.',
    category: 'pe-specific',
    example: 'Software company with no inventory or equipment vs. manufacturing business.'
  },
  {
    id: '125',
    term: 'Barriers to Entry',
    definition: 'Factors that make it difficult for competitors to enter your market. Increase business value.',
    category: 'pe-specific',
    example: 'Patents, regulatory licenses, or exclusive supplier relationships.'
  },
  {
    id: '126',
    term: 'Cyclicality',
    definition: 'How much business performance varies with economic cycles. Lower cyclicality valued higher.',
    category: 'pe-specific',
    example: 'Construction company (highly cyclical) vs. grocery store (low cyclicality).'
  },
  {
    id: '127',
    term: 'Patents',
    definition: 'Legal protection for inventions. Creates competitive moats and can significantly increase valuation.',
    category: 'legal-contract',
    example: 'Pharmaceutical company with 10-year patent protection on key drug.'
  },
  {
    id: '128',
    term: 'Tech Debt',
    definition: 'Cost of additional work caused by choosing quick solutions instead of better approaches.',
    category: 'pe-specific',
    example: 'Legacy software requiring $200K upgrade before company can scale.'
  },
  {
    id: '129',
    term: 'Digital Transformation',
    definition: 'Modernizing business processes with technology. Often drives operational efficiency gains.',
    category: 'pe-specific',
    example: 'Moving from paper-based to cloud-based customer management system.'
  },
  {
    id: '130',
    term: 'Warrants',
    definition: 'Right to buy additional shares at predetermined price. Often part of complex deal structures.',
    category: 'deal-structure',
    example: 'Warrants to purchase 10% additional equity at $5M valuation within 5 years.'
  },
  {
    id: '131',
    term: 'SBA Financing',
    definition: 'Small Business Administration loans that buyers can use for acquisitions. Makes deals accessible.',
    category: 'deal-structure',
    example: 'Buyer uses SBA 7(a) loan for 70% of $2M acquisition purchase price.'
  },
  {
    id: '132',
    term: 'Data Room',
    definition: 'Secure digital repository where all company documents are organized for buyer review during due diligence. Think of it as a digital file cabinet for your deal.',
    category: 'legal-contract',
    example: 'Virtual data room containing 3 years of financials, contracts, HR files, and IP documentation for buyer access.'
  },
  {
    id: '133',
    term: 'KPIs (Key Performance Indicators)',
    definition: 'Measurable values that demonstrate how effectively your business is achieving key objectives. Critical for PE buyers to understand operational performance.',
    category: 'pe-specific',
    example: 'Monthly revenue, customer acquisition cost, employee retention rate, and gross margin percentage.'
  },
  {
    id: '134',
    term: 'OKRs (Objectives and Key Results)',
    definition: 'Goal-setting framework where objectives are qualitative goals and key results are measurable outcomes. Used to align teams and track progress.',
    category: 'pe-specific',
    example: 'Objective: Improve customer satisfaction. Key Results: Increase NPS to 70+, reduce churn to <5%, achieve 95% support response rate.'
  },
  {
    id: '135',
    term: 'Strategy Document',
    definition: 'Comprehensive business plan outlining your company\'s mission, vision, goals, and growth strategy. Essential for demonstrating strategic thinking to buyers.',
    category: 'pe-specific',
    example: '3-year strategic plan with market expansion goals, product roadmap, and financial projections.'
  },
  {
    id: '136',
    term: 'Executive Discovery Interview',
    definition: 'Structured interview process where PE professionals assess management team\'s capabilities, vision, and readiness for partnership.',
    category: 'pe-specific',
    example: '2-hour interview covering leadership experience, growth plans, operational challenges, and cultural fit with PE partner.'
  },
  {
    id: '137',
    term: 'Industry Multiples',
    definition: 'Valuation benchmarks showing what companies in your industry typically sell for as a multiple of EBITDA. Used to estimate your company\'s market value.',
    category: 'valuation-metrics',
    example: 'SaaS companies trade at 8-12x EBITDA while manufacturing businesses trade at 4-6x EBITDA.'
  },
  {
    id: '138',
    term: 'Asset Workshop',
    definition: 'Structured session to identify and optimize your company\'s key assets (physical, intellectual, human capital) to maximize value before a transaction.',
    category: 'pe-specific',
    example: 'Workshop identifying $2M in undervalued equipment, proprietary processes worth $500K, and key employee retention strategies.'
  },
  
  // LEGAL & CONTRACT TERMS
  {
    id: '26',
    term: 'LOI (Letter of Intent)',
    definition: 'Non-binding offer outlining price and terms. Once signed, you enter exclusive negotiations.',
    category: 'legal-contract',
    example: 'An LOI proposing $10M purchase price with 30-day exclusivity period.'
  },
  {
    id: '27',
    term: 'Due Diligence',
    definition: 'The buyer\'s deep investigation of your business. Expect requests for every document imaginable.',
    category: 'legal-contract',
    example: 'Reviewing 3 years of financial statements, customer contracts, and operational procedures.'
  },
  {
    id: '28',
    term: 'Purchase Agreement',
    definition: 'Final binding contract for the sale. Hundreds of pages defining every detail.',
    category: 'legal-contract',
    example: 'Legal document specifying $10M price, closing conditions, and post-sale obligations.'
  },
  {
    id: '29',
    term: 'Reps & Warranties',
    definition: 'Your promises about the business being true. If wrong, triggers indemnification.',
    category: 'legal-contract',
    example: 'Warranty that financial statements are accurate; representation that all taxes are current.'
  },
  {
    id: '30',
    term: 'Indemnification',
    definition: 'Your promise to pay buyer back if certain problems arise post-sale. Usually capped.',
    category: 'legal-contract',
    example: 'You indemnify buyer for tax issues up to $1M (10% of purchase price) for 3 years.'
  },
  {
    id: '31',
    term: 'RWI (Reps & Warranties Insurance)',
    definition: 'Insurance that covers breaches instead of you paying from escrow. Good for sellers.',
    category: 'legal-contract',
    example: '$1M RWI policy covers warranty breaches, allowing lower escrow and faster release.'
  },
  {
    id: '32',
    term: 'Covenants',
    definition: 'Promises to do or not do something. These are legally binding obligations.',
    category: 'legal-contract',
    example: 'Non-compete covenant preventing you from starting similar business for 3 years.'
  },
  {
    id: '33',
    term: 'Non-Compete Agreement',
    definition: 'Contract preventing you from competing in same industry/geography for specified time.',
    category: 'legal-contract',
    example: 'Cannot start competing HVAC business within 50 miles for 3 years.'
  },
  {
    id: '34',
    term: 'Non-Solicitation Agreement',
    definition: 'Cannot recruit employees or customers from sold business for specified period.',
    category: 'legal-contract',
    example: 'Cannot hire former employees or contact customer list for 2 years.'
  },
  {
    id: '35',
    term: 'Employment Agreement',
    definition: 'Contract if you stay post-sale. Defines role, salary, termination conditions.',
    category: 'legal-contract',
    example: '2-year employment as GM at $200K salary with performance bonuses.'
  },
  {
    id: '36',
    term: 'Closing',
    definition: 'The day ownership transfers and money changes hands. You sign docs and get paid.',
    category: 'legal-contract',
    example: 'Closing day: Sign purchase agreement, receive $8.5M wire, transfer ownership.'
  },
  {
    id: '37',
    term: 'Closing Conditions',
    definition: 'Requirements that must be met before sale completes. Protect both parties.',
    category: 'legal-contract',
    example: 'Satisfactory due diligence, no material adverse changes, financing approval.'
  },
  {
    id: '38',
    term: 'MAC Clause (Material Adverse Change)',
    definition: 'Allows buyer to walk away if something major negatively impacts the business.',
    category: 'legal-contract',
    example: 'Lost of largest customer representing 40% of revenue triggers MAC clause.'
  },
  {
    id: '39',
    term: 'Redlining',
    definition: 'Marking up contracts with proposed changes. Normal part of negotiations.',
    category: 'legal-contract',
    example: 'Buyer redlines purchase agreement to extend due diligence period from 30 to 45 days.'
  },
  {
    id: '40',
    term: 'Break-Up Fee',
    definition: 'Penalty paid if deal falls through due to seller\'s fault. Protects buyer\'s costs.',
    category: 'legal-contract',
    example: '$500K break-up fee if seller accepts competing offer during exclusivity.'
  },
  {
    id: '41',
    term: 'Exclusivity Period',
    definition: 'Time when you can only negotiate with one buyer. Usually 30-90 days.',
    category: 'legal-contract',
    example: '60-day exclusivity period starting from LOI signature.'
  },
  {
    id: '42',
    term: 'Confidentiality Agreement (NDA)',
    definition: 'Legal protection preventing disclosure of sensitive business information.',
    category: 'legal-contract',
    example: 'Buyer signs NDA before seeing detailed financials or customer list.'
  },
  {
    id: '101',
    term: 'IOI (Indication of Interest)',
    definition: 'Preliminary, non-binding document expressing buyer\'s serious intent to acquire your company. Comes before LOI to screen serious buyers.',
    category: 'legal-contract',
    example: 'IOI proposing $8-10M purchase price range with 45-day due diligence timeline to gauge mutual interest.'
  },
  {
    id: '102',
    term: 'SaaS (Software as a Service)',
    definition: 'Companies that provide software applications over the internet through subscription model. Customers access via web browser instead of installing software locally.',
    category: 'accounting-financial',
    example: 'Salesforce, Slack, and Zoom are SaaS companies charging monthly subscriptions for cloud-based software access.'
  },
  
  // DEAL STRUCTURE TERMS
  {
    id: '43',
    term: 'Asset Purchase vs Stock Purchase',
    definition: 'Asset purchase: Buy specific assets/liabilities. Stock purchase: Buy entire entity including all obligations.',
    category: 'deal-structure',
    example: 'Asset purchase excludes lawsuit liability; stock purchase includes everything.'
  },
  {
    id: '44',
    term: 'Cash-Free, Debt-Free',
    definition: 'Standard transaction basis. Seller keeps cash, pays off debt. Purchase price for operations only.',
    category: 'deal-structure',
    example: '$10M deal: Seller gets $10M + keeps $200K cash - pays $300K debt = $9.9M net.'
  },
  {
    id: '45',
    term: 'Earnout',
    definition: 'Part of purchase price paid later IF business hits targets. Risky for sellers.',
    category: 'deal-structure',
    example: '$8M at closing + $2M earnout if company achieves $15M revenue in Year 1.'
  },
  {
    id: '46',
    term: 'Escrow/Holdback',
    definition: 'Money held back from purchase price for 12-18 months to cover potential claims.',
    category: 'deal-structure',
    example: '$10M sale with $1.5M held in escrow for 18 months.'
  },
  {
    id: '47',
    term: 'Rollover Equity',
    definition: 'Keeping ownership stake in new company structure. Future upside potential.',
    category: 'deal-structure',
    example: 'Selling 80% for $8M cash while rolling over 20% equity.'
  },
  {
    id: '48',
    term: 'Second Bite of the Apple',
    definition: 'Future liquidity from rollover equity when PE firm sells. Could be bigger than first bite.',
    category: 'deal-structure',
    example: 'Initial $8M + $5M from second bite when PE sells company 5 years later.'
  },
  {
    id: '49',
    term: 'Seller Note',
    definition: 'You lend part of purchase price back to buyer. Reduces upfront cash but adds risk.',
    category: 'deal-structure',
    example: '$8M cash + $2M seller note at 6% interest over 5 years.'
  },
  {
    id: '50',
    term: 'Management Buyout (MBO)',
    definition: 'Your management team buys the company. Often with PE backing.',
    category: 'deal-structure',
    example: 'CEO and CFO partner with PE firm to acquire company from retiring founder.'
  },
  {
    id: '51',
    term: 'Holding Company',
    definition: 'Entity that owns operating companies. PE firms often use for tax optimization.',
    category: 'deal-structure',
    example: 'PE creates holding company to own your business and two similar companies.'
  },
  {
    id: '52',
    term: 'Dividend Recapitalization',
    definition: 'Taking debt to pay special dividend. Allows PE to get money out while keeping ownership.',
    category: 'deal-structure',
    example: 'Company borrows $5M to pay PE firm special dividend.'
  },
  {
    id: '53',
    term: 'Refinancing',
    definition: 'Replacing existing debt with new debt at better terms. Improves cash flow.',
    category: 'deal-structure',
    example: 'Replacing 8% bank loan with 5% loan saves $150K annually on $5M debt.'
  },
  {
    id: '54',
    term: 'Mezzanine Financing',
    definition: 'Hybrid debt/equity financing. Higher cost but flexible terms.',
    category: 'deal-structure',
    example: '$2M mezzanine loan at 12% interest plus equity warrants.'
  },
  {
    id: '55',
    term: 'Preferred Equity',
    definition: 'Equity with priority over common stock for dividends and liquidation.',
    category: 'deal-structure',
    example: 'Preferred shares get paid first if company is sold or pays dividends.'
  },
  {
    id: '56',
    term: 'Common Equity',
    definition: 'Standard ownership shares. Last to get paid but unlimited upside potential.',
    category: 'deal-structure',
    example: 'Common shareholders benefit most if company value increases significantly.'
  },
  
  // PE-SPECIFIC TERMS
  {
    id: '57',
    term: 'Platform Company',
    definition: 'First acquisition in PE buy-and-build strategy. Foundation for add-on acquisitions.',
    category: 'pe-specific',
    example: 'PE buys regional HVAC company as platform, then adds 5 smaller companies.'
  },
  {
    id: '58',
    term: 'Add-On Acquisition',
    definition: 'Smaller companies bought and merged into platform company. Drives growth.',
    category: 'pe-specific',
    example: 'Platform HVAC company acquires 3 local competitors to expand territory.'
  },
  {
    id: '59',
    term: 'Bolt-On Acquisition',
    definition: 'Small strategic acquisition to fill specific gaps or add capabilities.',
    category: 'pe-specific',
    example: 'Software company acquires small AI startup for specific technology.'
  },
  {
    id: '60',
    term: 'Buy-and-Build Strategy',
    definition: 'PE strategy of buying platform company then consolidating industry through add-ons.',
    category: 'pe-specific',
    example: 'Buying largest plumbing company in region then acquiring 10 smaller ones.'
  },
  {
    id: '61',
    term: 'Roll-Up Strategy',
    definition: 'Consolidating fragmented industry by acquiring many small players.',
    category: 'pe-specific',
    example: 'Creating national pest control company by buying 50 local operators.'
  },
  {
    id: '62',
    term: 'Operational Improvements',
    definition: 'Changes PE makes to increase efficiency and profitability. Their value-add.',
    category: 'pe-specific',
    example: 'Implementing ERP system, streamlining operations, improving pricing.'
  },
  {
    id: '63',
    term: 'EBITDA Multiple Expansion',
    definition: 'Increasing the multiple buyers pay for your EBITDA. Major value driver.',
    category: 'pe-specific',
    example: 'Growing from 4x to 6x multiple adds $2M value on $1M EBITDA.'
  },
  {
    id: '64',
    term: 'Exit Strategy',
    definition: 'PE firm\'s plan to sell company in 3-7 years. Could be strategic sale or IPO.',
    category: 'pe-specific',
    example: 'PE plans to sell portfolio company to strategic buyer after doubling EBITDA.'
  },
  {
    id: '65',
    term: 'Fund Life Cycle',
    definition: 'PE funds typically last 10 years: 5 to invest, 5 to exit. Affects timing.',
    category: 'pe-specific',
    example: '8-year-old fund needs to sell companies soon to return money to investors.'
  },
  {
    id: '66',
    term: 'IRR (Internal Rate of Return)',
    definition: 'PE firm\'s annual return target. Usually 20-25% for successful funds.',
    category: 'pe-specific',
    example: 'PE needs 3x return in 5 years to achieve 25% IRR.'
  },
  {
    id: '67',
    term: 'Money Multiple',
    definition: 'Total return divided by initial investment. Simple measure of PE success.',
    category: 'pe-specific',
    example: '$5M investment returning $15M = 3x money multiple.'
  },
  {
    id: '68',
    term: 'Dry Powder',
    definition: 'Unspent money PE firms have raised. Indicates buying capacity.',
    category: 'pe-specific',
    example: 'PE firm has $500M dry powder available for new acquisitions.'
  },
  {
    id: '69',
    term: 'Portfolio Company',
    definition: 'Company owned by PE firm. You become portfolio company after acquisition.',
    category: 'pe-specific',
    example: 'PE firm\'s portfolio includes 15 companies across different industries.'
  },
  {
    id: '70',
    term: 'Investment Committee',
    definition: 'Group that approves PE investments. Key decision makers you need to convince.',
    category: 'pe-specific',
    example: 'Deal must be approved by 5-person investment committee at PE firm.'
  },
  {
    id: '71',
    term: 'Thesis',
    definition: 'PE firm\'s investment strategy and rationale. Why they buy certain companies.',
    category: 'pe-specific',
    example: 'PE thesis: consolidating fragmented healthcare services industry.'
  },
  {
    id: '72',
    term: 'Value Creation Plan',
    definition: 'PE firm\'s strategy to increase company value over ownership period.',
    category: 'pe-specific',
    example: 'Plan to double EBITDA through acquisitions, operational improvements, and geographic expansion.'
  },
  {
    id: '73',
    term: 'Management Presentations',
    definition: 'Your pitch to PE firms explaining business, growth plans, and value proposition.',
    category: 'pe-specific',
    example: '2-hour presentation covering market position, financial performance, and growth strategy.'
  },
  {
    id: '74',
    term: 'Key Person Risk',
    definition: 'Risk that business depends too heavily on one person (usually the owner).',
    category: 'pe-specific',
    example: 'Owner handles all major customer relationships and key operational decisions.'
  },
  {
    id: '75',
    term: 'Institutional Investor',
    definition: 'Large organizations that invest in PE funds. Pension funds, endowments, etc.',
    category: 'pe-specific',
    example: 'University endowment invests $50M in PE fund targeting middle-market companies.'
  },
  {
    id: '76',
    term: 'Limited Partner (LP)',
    definition: 'Investors in PE funds. Provide capital but don\'t manage investments.',
    category: 'pe-specific',
    example: 'Pension fund is LP in PE fund, providing capital but not making investment decisions.'
  },
  {
    id: '77',
    term: 'General Partner (GP)',
    definition: 'PE firm managing the fund. Makes investment decisions and manages portfolio.',
    category: 'pe-specific',
    example: 'PE firm is GP, responsible for finding deals and managing portfolio companies.'
  },
  {
    id: '78',
    term: 'Management Fee',
    definition: 'Annual fee PE firms charge (usually 2%) regardless of performance.',
    category: 'pe-specific',
    example: '2% management fee on $100M fund = $2M annual fee to PE firm.'
  },
  {
    id: '79',
    term: 'Carried Interest',
    definition: 'PE firm\'s share of profits (usually 20%) above minimum return threshold.',
    category: 'pe-specific',
    example: 'PE gets 20% of profits above 8% annual return to investors.'
  },
  {
    id: '80',
    term: 'Hurdle Rate',
    definition: 'Minimum return investors must receive before PE firm gets carried interest.',
    category: 'pe-specific',
    example: 'Investors must get 8% annual return before PE firm earns any carried interest.'
  },
  {
    id: '81',
    term: 'Clawback',
    definition: 'Mechanism requiring PE firm to return excess carried interest if later deals perform poorly.',
    category: 'pe-specific',
    example: 'PE must return fees if overall fund returns fall below agreed threshold.'
  },
  {
    id: '82',
    term: 'Capital Call',
    definition: 'PE fund requesting money from LPs for specific investment. Not all money invested upfront.',
    category: 'pe-specific',
    example: 'PE calls $10M from LPs to fund acquisition of manufacturing company.'
  },
  {
    id: '83',
    term: 'Distribution',
    definition: 'Money returned to LPs when PE sells portfolio companies.',
    category: 'pe-specific',
    example: 'PE sells company for $50M, distributing proceeds to LPs after fees.'
  },
  {
    id: '84',
    term: 'J-Curve',
    definition: 'PE fund performance pattern: negative early returns, positive later as companies sold.',
    category: 'pe-specific',
    example: 'Fund shows losses first 3 years, then strong returns as portfolio companies exit.'
  },
  
  // VALUATION METRICS
  {
    id: '85',
    term: 'Multiple',
    definition: 'What buyers pay relative to EBITDA. Higher multiples = higher valuation.',
    category: 'valuation-metrics',
    example: '5x multiple on $2M EBITDA = $10M enterprise value.'
  },
  {
    id: '86',
    term: 'Enterprise Value',
    definition: 'Total company value including debt. Purchase price + debt - cash.',
    category: 'valuation-metrics',
    example: '$10M purchase price + $2M debt - $500K cash = $11.5M enterprise value.'
  },
  {
    id: '87',
    term: 'Revenue Multiple',
    definition: 'Valuation relative to annual revenue. Common for high-growth companies.',
    category: 'valuation-metrics',
    example: '$20M revenue × 2.5x multiple = $50M enterprise value.'
  },
  {
    id: '88',
    term: 'SDE (Seller\'s Discretionary Earnings)',
    definition: 'EBITDA plus owner\'s salary and benefits. Used for smaller businesses.',
    category: 'valuation-metrics',
    example: '$500K EBITDA + $150K owner salary + $50K benefits = $700K SDE.'
  },
  {
    id: '89',
    term: 'Comparable Company Analysis',
    definition: 'Valuing your business based on what similar companies sold for.',
    category: 'valuation-metrics',
    example: 'Similar HVAC companies sold for 4-6x EBITDA, so yours worth 5x.'
  },
  {
    id: '90',
    term: 'DCF (Discounted Cash Flow)',
    definition: 'Valuation method based on projected future cash flows. Academic but important.',
    category: 'valuation-metrics',
    example: 'Projecting 5 years of cash flows and discounting back to present value.'
  },
  {
    id: '91',
    term: 'Terminal Value',
    definition: 'Company value beyond projection period in DCF analysis. Usually most of total value.',
    category: 'valuation-metrics',
    example: 'Terminal value represents 70% of total DCF valuation.'
  },
  {
    id: '92',
    term: 'WACC (Weighted Average Cost of Capital)',
    definition: 'Discount rate used in DCF analysis. Reflects company\'s risk profile.',
    category: 'valuation-metrics',
    example: '12% WACC means investors require 12% annual return for this risk level.'
  },
  {
    id: '93',
    term: 'Beta',
    definition: 'Measure of stock price volatility relative to market. Higher beta = higher risk.',
    category: 'valuation-metrics',
    example: 'Beta of 1.2 means stock moves 20% more than overall market.'
  },
  {
    id: '94',
    term: 'Premium/Discount',
    definition: 'How your multiple compares to industry average. Shows relative attractiveness.',
    category: 'valuation-metrics',
    example: 'Industry average 4.5x, your 5.5x = 22% premium for superior quality.'
  },
  {
    id: '95',
    term: 'Control Premium',
    definition: 'Extra amount buyers pay for controlling interest vs. minority stake.',
    category: 'valuation-metrics',
    example: '100% ownership worth 20% more than pro-rata minority stake value.'
  },
  {
    id: '96',
    term: 'Illiquidity Discount',
    definition: 'Reduction in value because private company shares can\'t be easily sold.',
    category: 'valuation-metrics',
    example: 'Private company worth 20% less than similar public company.'
  },
  {
    id: '97',
    term: 'Size Premium',
    definition: 'Larger companies typically trade at higher multiples than smaller ones.',
    category: 'valuation-metrics',
    example: '$50M revenue company gets higher multiple than $5M revenue company.'
  },
  {
    id: '98',
    term: 'Quality Premium',
    definition: 'Better businesses (recurring revenue, growth, margins) command higher multiples.',
    category: 'valuation-metrics',
    example: 'SaaS business gets 8x multiple while manufacturing gets 4x.'
  },
  {
    id: '99',
    term: 'Market Conditions',
    definition: 'Economic environment affects valuations. Hot markets = higher multiples.',
    category: 'valuation-metrics',
    example: 'Bull market drives multiples from 4x to 6x for same business quality.'
  },
  {
    id: '100',
    term: 'Auction Process',
    definition: 'Competitive bidding process driving up valuations. Investment banker managed.',
    category: 'valuation-metrics',
    example: '8 buyers bidding drives price from $8M initial offer to $12M final.'
  },
  
  // Additional Important Terms
  {
    id: '103',
    term: 'Investment Banking Fees',
    definition: 'Typically 3-10% of transaction value paid to investment bank for managing sale process. Percentage decreases as deal size increases.',
    category: 'deal-structure',
    example: 'Investment bank charges 5% fee on $10M sale = $500K in advisory fees at closing.'
  },
  {
    id: '104',
    term: 'Book Building',
    definition: 'Process where investment banker creates list of potential buyers and manages initial outreach to gauge interest levels.',
    category: 'pe-specific',
    example: 'Investment banker contacts 150 potential buyers, gets 20 NDAs signed, and 8 IOIs submitted.'
  },
  {
    id: '105',
    term: 'Management Roadshow',
    definition: 'Series of presentations to potential buyers where management team presents business overview and growth strategy.',
    category: 'pe-specific',
    example: 'CEO and CFO present to 12 PE firms over 3 weeks, explaining market position and value creation opportunities.'
  },
  {
    id: '106',
    term: 'Data Room',
    definition: 'Secure online repository containing all company documents for buyer review during due diligence process.',
    category: 'legal-contract',
    example: 'Virtual data room contains 500+ documents including financials, contracts, HR records, and legal documents.'
  },
  {
    id: '107',
    term: 'Teaser Document',
    definition: 'One-page anonymous summary of investment opportunity sent to potential buyers before signing NDAs.',
    category: 'pe-specific',
    example: 'Teaser describes "leading regional HVAC company with $15M revenue" without revealing company name.'
  },
  {
    id: '108',
    term: 'CIM (Confidential Information Memorandum)',
    definition: 'Detailed 30-50 page document describing company, market, financials, and investment opportunity.',
    category: 'pe-specific',
    example: 'CIM includes company history, management bios, 3-year financial performance, and market analysis.'
  },
  {
    id: '109',
    term: 'Process Letter',
    definition: 'Document outlining sale process timeline, bid requirements, and due diligence procedures.',
    category: 'pe-specific',
    example: 'Process letter sets LOI deadline for March 15th and final bids due April 30th.'
  },
  {
    id: '110',
    term: 'Stalking Horse Bid',
    definition: 'Initial bid that sets floor price and terms for auction process. Provides downside protection.',
    category: 'deal-structure',
    example: 'PE firm provides $8M stalking horse bid, ensuring minimum sale price while auction seeks higher offers.'
  },
  {
    id: '111',
    term: 'Go-Shop Period',
    definition: 'Time after signing definitive agreement when seller can still solicit higher offers.',
    category: 'deal-structure',
    example: '45-day go-shop period allows seller to find better offer even after signing with initial buyer.'
  },
  {
    id: '112',
    term: 'No-Shop Clause',
    definition: 'Provision preventing seller from soliciting other offers once deal is signed.',
    category: 'legal-contract',
    example: 'No-shop clause prevents engaging with other buyers during 60-day closing period.'
  },
  {
    id: '113',
    term: 'Fiduciary Out',
    definition: 'Allows seller to consider superior proposals even under no-shop clause to fulfill fiduciary duties.',
    category: 'legal-contract',
    example: 'Board can consider unsolicited offer 20% higher than signed deal due to fiduciary out provision.'
  },
  {
    id: '114',
    term: 'Deal Certainty',
    definition: 'Probability that proposed transaction will actually close. Affects buyer attractiveness.',
    category: 'deal-structure',
    example: 'Strategic buyer with cash offers higher deal certainty than leveraged buyout requiring financing.'
  },
  {
    id: '115',
    term: 'Financing Risk',
    definition: 'Risk that buyer cannot secure necessary funding to complete transaction.',
    category: 'deal-structure',
    example: 'Debt-financed deal has financing risk if credit markets tighten before closing.'
  },
  {
    id: '116',
    term: 'Regulatory Approval',
    definition: 'Government clearance required for certain transactions, especially larger deals or specific industries.',
    category: 'legal-contract',
    example: 'FTC approval required for $100M acquisition that creates market concentration.'
  },
  {
    id: '117',
    term: 'Core Assets',
    definition: 'Assets that are essential to business operations and revenue generation. These assets must stay with the business for it to function, and PE buyers expect them to be included in the transaction.',
    category: 'pe-specific',
    example: 'Manufacturing equipment, customer databases, and operational facilities are core assets, while executive vacation properties or redundant real estate are typically non-core.'
  }
];

export function InteractiveGlossary() {
  const sortedTerms = useMemo(() => {
    return [...glossaryTerms].sort((a, b) => a.term.localeCompare(b.term));
  }, []);

  // Color cycle for borders
  const getBorderColor = (index: number) => {
    const colors = [
      'border-l-4 border-white/30',
      'border-l-4 border-yellow-500', 
      'border-l-4 border-orange-500',
      'border-l-4 border-green-500',
      'border-l-4 border-purple-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Interactive Glossary</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Master the essential terminology of private equity transactions and business valuations. 
          Each term includes real-world examples to help you understand concepts that matter most to buyers.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedTerms.map((term, index) => (
          <Card key={term.id} className={`hover:shadow-lg transition-shadow ${getBorderColor(index)}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{term.term}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {term.definition}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {term.example && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Example:</span> {term.example}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
