// INDUSTRY MULTIPLES CALCULATION LIBRARY
// Centralizes all valuation logic for consistency

export interface IndustryMultiple {
  id: string;
  industryCategory: string;
  industrySubcategory?: string;
  sizeBand: string;
  minEbitda: number;
  maxEbitda: number;
  baseMultiple: number;
  highMultiple: number;
  typicalMarginPercent?: number;
  notes?: string;
}

export interface CompanyProfile {
  industryCategory: string;
  industrySubcategory?: string;
  annualRevenue: number;
  ebitda: number;
  recurringRevenuePercent: number;
  customerConcentration: number;
  yearsInBusiness: number;
  growthRatePercent: number;
}

export interface ValuationResult {
  baseMultiple: number;
  adjustedMultiple: number;
  enterpriseValue: number;
  adjustmentFactors: {
    sizeAdjustment: number;
    recurringRevenueAdjustment: number;
    customerConcentrationAdjustment: number;
    growthAdjustment: number;
  };
  comparableRange: {
    low: number;
    median: number;
    high: number;
  };
}

export interface MultipleHealth {
  color: 'red' | 'yellow' | 'green';
  label: string;
  description: string;
}

/**
 * Calculate adjusted multiple based on company characteristics
 */
export function calculateAdjustedMultiple(
  baseMultiple: number,
  highMultiple: number,
  companyProfile: CompanyProfile
): number {
  const range = highMultiple - baseMultiple;
  let adjustedMultiple = baseMultiple;

  // Recurring Revenue Adjustment (0 to +30% of range)
  const recurringRevenueAdjustment = (companyProfile.recurringRevenuePercent / 100) * 0.3;
  adjustedMultiple += recurringRevenueAdjustment * range;

  // Customer Concentration Risk (-20% of range if >30% concentration)
  if (companyProfile.customerConcentration > 30) {
    const concentrationRisk = -0.2 * ((companyProfile.customerConcentration - 30) / 70);
    adjustedMultiple += concentrationRisk * range;
  }

  // Growth Rate Adjustment
  if (companyProfile.growthRatePercent > 25) {
    adjustedMultiple += 0.2 * range; // High growth premium
  } else if (companyProfile.growthRatePercent < 5) {
    adjustedMultiple -= 0.1 * range; // Low growth discount
  }

  // Business Maturity (years in business)
  if (companyProfile.yearsInBusiness < 3) {
    adjustedMultiple -= 0.05 * range; // Early stage discount
  } else if (companyProfile.yearsInBusiness > 10) {
    adjustedMultiple += 0.05 * range; // Established business premium
  }

  // Ensure we stay within reasonable bounds
  return Math.max(baseMultiple * 0.7, Math.min(adjustedMultiple, highMultiple * 1.1));
}

/**
 * Determine health status of the multiple
 */
export function getMultipleHealth(
  multiple: number, 
  baseMultiple: number, 
  highMultiple: number
): MultipleHealth {
  const range = highMultiple - baseMultiple;
  const position = (multiple - baseMultiple) / range;
  
  if (position < 0.25) {
    return {
      color: 'red',
      label: 'Below Market',
      description: 'Your multiple is in the bottom quartile. Focus on improving recurring revenue and reducing customer concentration.'
    };
  } else if (position > 0.75) {
    return {
      color: 'green',
      label: 'Premium Valuation',
      description: 'Your business commands a premium multiple due to strong fundamentals.'
    };
  } else {
    return {
      color: 'yellow',
      label: 'Market Range',
      description: 'Your valuation is within typical market range for your industry and size.'
    };
  }
}

/**
 * Calculate complete valuation results
 */
export function calculateValuation(
  industryMultiple: IndustryMultiple,
  companyProfile: CompanyProfile
): ValuationResult {
  const adjustedMultiple = calculateAdjustedMultiple(
    industryMultiple.baseMultiple,
    industryMultiple.highMultiple,
    companyProfile
  );

  const enterpriseValue = companyProfile.ebitda * adjustedMultiple;
  const range = industryMultiple.highMultiple - industryMultiple.baseMultiple;

  return {
    baseMultiple: industryMultiple.baseMultiple,
    adjustedMultiple,
    enterpriseValue,
    adjustmentFactors: {
      sizeAdjustment: 0, // Could add size band adjustments in future
      recurringRevenueAdjustment: (companyProfile.recurringRevenuePercent / 100) * 0.3,
      customerConcentrationAdjustment: companyProfile.customerConcentration > 30 
        ? -0.2 * ((companyProfile.customerConcentration - 30) / 70) 
        : 0,
      growthAdjustment: companyProfile.growthRatePercent > 25 
        ? 0.2 
        : companyProfile.growthRatePercent < 5 
        ? -0.1 
        : 0
    },
    comparableRange: {
      low: companyProfile.ebitda * industryMultiple.baseMultiple,
      median: companyProfile.ebitda * ((industryMultiple.baseMultiple + industryMultiple.highMultiple) / 2),
      high: companyProfile.ebitda * industryMultiple.highMultiple
    }
  };
}

/**
 * Generate valuation report content
 */
export function generateValuationReportContent(
  companyProfile: CompanyProfile,
  valuationResult: ValuationResult,
  industryMultiple: IndustryMultiple
): string {
  const margin = companyProfile.annualRevenue > 0 
    ? (companyProfile.ebitda / companyProfile.annualRevenue * 100).toFixed(1) 
    : '0.0';

  return `# Business Valuation Report

Generated: ${new Date().toLocaleDateString()}

## Company Overview
- **Industry**: ${companyProfile.industryCategory}${companyProfile.industrySubcategory ? ` - ${companyProfile.industrySubcategory}` : ''}
- **Annual Revenue**: $${(companyProfile.annualRevenue / 1000000).toFixed(2)}M
- **EBITDA**: $${(companyProfile.ebitda / 1000000).toFixed(2)}M
- **EBITDA Margin**: ${margin}%
- **Size Band**: ${industryMultiple.sizeBand}

## Valuation Summary
- **Valuation Multiple**: ${valuationResult.adjustedMultiple.toFixed(1)}x
- **Enterprise Value**: $${(valuationResult.enterpriseValue / 1000000).toFixed(2)}M

## Multiple Adjustments
- **Base Multiple**: ${valuationResult.baseMultiple.toFixed(1)}x
- **Recurring Revenue Adjustment**: ${valuationResult.adjustmentFactors.recurringRevenueAdjustment > 0 ? '+' : ''}${(valuationResult.adjustmentFactors.recurringRevenueAdjustment * (industryMultiple.highMultiple - industryMultiple.baseMultiple)).toFixed(1)}x
- **Customer Concentration**: ${(valuationResult.adjustmentFactors.customerConcentrationAdjustment * (industryMultiple.highMultiple - industryMultiple.baseMultiple)).toFixed(1)}x
- **Growth Rate**: ${valuationResult.adjustmentFactors.growthAdjustment > 0 ? '+' : ''}${(valuationResult.adjustmentFactors.growthAdjustment * (industryMultiple.highMultiple - industryMultiple.baseMultiple)).toFixed(1)}x

## Business Characteristics
- **Recurring Revenue**: ${companyProfile.recurringRevenuePercent}%
- **Customer Concentration**: ${companyProfile.customerConcentration}% (largest customer)
- **Annual Growth Rate**: ${companyProfile.growthRatePercent}%
- **Years in Business**: ${companyProfile.yearsInBusiness} years

## Industry Comparison
- **Low (25th percentile)**: $${(valuationResult.comparableRange.low / 1000000).toFixed(2)}M
- **Median**: $${(valuationResult.comparableRange.median / 1000000).toFixed(2)}M
- **High (75th percentile)**: $${(valuationResult.comparableRange.high / 1000000).toFixed(2)}M

## Methodology & Constraints
This valuation is based on industry comparable methods using:
- Current verified EBITDA only (no forecasts or projections)
- Industry-specific multiples adjusted for company characteristics
- No manual override of calculated multiples
- PE-standard valuation methodology

**Important Note**: This valuation represents enterprise value and does not account for debt, cash, or other balance sheet adjustments that would be required for equity value calculation.

---
*Report generated by the PE Ready Platform valuation engine*`;
}

/**
 * Format currency consistently
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage consistently
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}