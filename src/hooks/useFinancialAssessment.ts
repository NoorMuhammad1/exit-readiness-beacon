import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/hooks/use-toast';

export interface FinancialAssessment {
  id: string;
  company_id: string;
  revenue: number | null;
  net_income: number | null;
  current_ebitda: number | null;
  adjusted_ebitda: number | null;
  ebitda_margin: number | null;
  pe_readiness_score: number;
  assessment_status: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface AddBackCategory {
  id: string;
  assessment_id: string;
  category: string;
  description: string | null;
  amount: number;
  is_applied: boolean;
  created_at: string;
}

export interface IndustryBenchmark {
  id: string;
  industry: string;
  multiple_low: number;
  multiple_mid: number;
  multiple_high: number;
  margin_excellent: number;
  margin_good: number;
  margin_fair: number;
  created_at: string;
}

export const useFinancialAssessment = (companyId: string) => {
  return useQuery({
    queryKey: ['financial-assessment', companyId],
    queryFn: async () => {
      const response = await apiClient.getAssessments();
      const assessment = response.assessments.find((a: any) => a.company_id === companyId);
      return assessment as FinancialAssessment | null;
    },
    enabled: !!companyId,
  });
};

export const useAddBackCategories = (assessmentId: string) => {
  return useQuery({
    queryKey: ['add-back-categories', assessmentId],
    queryFn: async () => {
      // Backend doesn't have add-back categories endpoint yet
      // Return empty array for now
      return [] as AddBackCategory[];
    },
    enabled: !!assessmentId,
  });
};

export const useIndustryBenchmarks = () => {
  return useQuery({
    queryKey: ['industry-benchmarks'],
    queryFn: async () => {
      // Backend doesn't have industry benchmarks endpoint yet
      // Return empty array for now
      return [] as IndustryBenchmark[];
    },
  });
};

export const useCreateFinancialAssessment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (assessment: Partial<FinancialAssessment> & { company_id: string }) => {
      const data = await apiClient.createAssessment(assessment);
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['financial-assessment', data.company_id] });
      toast({
        title: "Success",
        description: "Financial assessment created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create financial assessment: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateFinancialAssessment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FinancialAssessment> }) => {
      const data = await apiClient.updateAssessment(id, updates);
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['financial-assessment', data.company_id] });
      toast({
        title: "Success",
        description: "Financial assessment updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update financial assessment: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAddBackCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ categoryId, amount, isApplied, assessmentId }: {
      categoryId: string;
      amount: number;
      isApplied: boolean;
      assessmentId: string;
    }) => {
      // Backend doesn't have add-back categories endpoint yet
      throw new Error('Add-back categories not yet implemented in backend');
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['add-back-categories', data.assessment_id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update add-back category: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Calculate PE readiness score based on multiple factors
export const calculatePEScore = (
  ebitdaMargin: number,
  adjustedEbitdaMargin: number,
  hasDocumentation: boolean,
  addBacksTotal: number,
  currentEbitda: number,
  businessHealthScore: number = 75
): number => {
  let score = 0;
  
  // Use adjusted EBITDA margin for scoring (40% of total score)
  const marginToUse = adjustedEbitdaMargin || ebitdaMargin;
  if (marginToUse >= 0.25) score += 40; // 25%+ margin = excellent
  else if (marginToUse >= 0.20) score += 32; // 20-25% = very good
  else if (marginToUse >= 0.15) score += 24; // 15-20% = good
  else if (marginToUse >= 0.10) score += 16; // 10-15% = fair
  else score += 8; // <10% = needs improvement
  
  // Documentation (20% of total score)
  if (hasDocumentation) score += 20;
  else score += 5; // Partial credit for basic records
  
  // Add-back quality scoring (20% of total score)
  const addBackPercentage = currentEbitda > 0 ? (addBacksTotal / currentEbitda) : 0;
  if (addBackPercentage <= 0.05) score += 20; // Clean books (≤5% add-backs)
  else if (addBackPercentage <= 0.15) score += 16; // Moderate add-backs (5-15%)
  else if (addBackPercentage <= 0.25) score += 12; // Significant add-backs (15-25%)
  else score += 8; // Heavy add-backs (>25%)
  
  // Business health (20% of total score)
  score += (businessHealthScore / 100) * 20;
  
  return Math.min(Math.round(score), 100);
};

// Calculate valuation multiple based on EBITDA margin and industry
export const calculateValuationMultiple = (
  ebitdaMargin: number,
  adjustedEbitdaMargin: number,
  industry: string = "default"
): number => {
  // Use adjusted EBITDA margin for valuation if available
  const marginToUse = adjustedEbitdaMargin || ebitdaMargin;
  
  // Base multiple ranges by margin quality
  let baseMultiple = 3.0; // Default minimum
  
  if (marginToUse >= 0.25) baseMultiple = 6.0; // 25%+ = premium multiple
  else if (marginToUse >= 0.20) baseMultiple = 5.0; // 20-25% = high multiple  
  else if (marginToUse >= 0.15) baseMultiple = 4.5; // 15-20% = good multiple
  else if (marginToUse >= 0.10) baseMultiple = 4.0; // 10-15% = average multiple
  else if (marginToUse >= 0.05) baseMultiple = 3.5; // 5-10% = below average
  
  // Industry adjustments (simplified for now)
  const industryAdjustments: Record<string, number> = {
    "Technology": 1.2,
    "Healthcare": 1.1,
    "Manufacturing": 1.0,
    "Professional Services": 1.1,
    "Construction": 0.9,
    "Retail": 0.8,
    "default": 1.0
  };
  
  const adjustment = industryAdjustments[industry] || industryAdjustments.default;
  return Math.round((baseMultiple * adjustment) * 10) / 10;
};