import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, FileText, DollarSign, BarChart3 } from 'lucide-react';
import { FinancialAssessment, AddBackCategory, calculatePEScore, calculateValuationMultiple } from '@/hooks/useFinancialAssessment';
import { ContactInquiry } from '@/hooks/useInquiries';

interface PEReadinessGaugeProps {
  score: number;
  assessment: FinancialAssessment | null | undefined;
  company: ContactInquiry;
  addBacks?: AddBackCategory[];
}

export const PEReadinessGauge = ({ score, assessment, company, addBacks = [] }: PEReadinessGaugeProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate add-backs total and adjusted EBITDA
  const totalAddBacks = addBacks
    .filter(addBack => addBack.is_applied)
    .reduce((sum, addBack) => sum + addBack.amount, 0);
  
  const adjustedEbitda = (assessment?.current_ebitda || 0) + totalAddBacks;
  const adjustedEbitdaMargin = assessment?.revenue ? adjustedEbitda / assessment.revenue : 0;
  
  // Calculate component scores using adjusted metrics
  const currentMargin = assessment?.ebitda_margin || 0;
  const marginToUse = adjustedEbitdaMargin || currentMargin;
  const ebitdaMarginScore = Math.min(marginToUse * 400, 100); // 25% margin = 100 points
  const documentationScore = assessment?.assessment_status === 'complete' ? 100 : 50;
  
  // Add-back quality score (better score for fewer add-backs relative to EBITDA)
  const addBackPercentage = assessment?.current_ebitda ? (totalAddBacks / assessment.current_ebitda) : 0;
  const addBackScore = addBackPercentage <= 0.05 ? 100 : 
                      addBackPercentage <= 0.15 ? 80 : 
                      addBackPercentage <= 0.25 ? 60 : 40;
  
  const businessHealthScore = 85; // This would come from a separate assessment
  
  // Calculate overall score using the imported function
  const overallScore = calculatePEScore(
    currentMargin,
    adjustedEbitdaMargin,
    assessment?.assessment_status === 'complete',
    totalAddBacks,
    assessment?.current_ebitda || 0,
    businessHealthScore
  );

  const components = [
    {
      name: "EBITDA Margin",
      score: ebitdaMarginScore,
      description: adjustedEbitdaMargin > currentMargin ? 
        `${(currentMargin * 100).toFixed(1)}% → ${(adjustedEbitdaMargin * 100).toFixed(1)}% (adjusted)` :
        `${(currentMargin * 100).toFixed(1)}% margin`,
      target: "Target: 20%+"
    },
    {
      name: "Documentation", 
      score: documentationScore,
      description: assessment?.assessment_status === 'complete' ? "Complete documentation" : "Basic records only",
      target: "Complete financials needed"
    },
    {
      name: "Add-Back Quality", 
      score: addBackScore,
      description: totalAddBacks > 0 ? 
        `${formatCurrency(totalAddBacks)} in add-backs (${(addBackPercentage * 100).toFixed(1)}%)` : 
        "Clean operations",
      target: "Lower % is better"
    },
    {
      name: "Business Health",
      score: businessHealthScore, 
      description: "Customer base, scalability, systems",
      target: "Diversified & scalable"
    }
  ];


  // Calculate estimated valuation using adjusted EBITDA
  const multiple = calculateValuationMultiple(currentMargin, adjustedEbitdaMargin, company.industry);
  const currentValuation = (assessment?.current_ebitda || 0) * multiple;
  const adjustedValuation = adjustedEbitda * multiple;

  return (
    <div className="space-y-6">
      {/* Main Score Display */}
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 mx-auto relative">
            {/* Background circle */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted-foreground/20"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2.51 * overallScore} 251.2`}
                className={overallScore >= 80 ? 'text-green-500' : overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'}
                strokeLinecap="round"
              />
            </svg>
            {/* Score text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}
                </div>
                <div className="text-xs text-muted-foreground">/ 100</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <Badge variant={overallScore >= 60 ? 'default' : 'destructive'} className="mb-2">
            {getScoreLabel(overallScore)}
          </Badge>
          <p className="text-sm text-muted-foreground">
            PE Readiness Score
          </p>
        </div>
      </div>

      {/* Component Breakdown */}
      <div className="space-y-4">
        <h4 className="font-medium">Score Breakdown</h4>
        {components.map((component, index) => {
          const icons = [DollarSign, FileText, TrendingUp, BarChart3];
          const Icon = icons[index];
          
          return (
            <Card key={component.name}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{component.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {Math.round(component.score)}/100
                  </span>
                </div>
                <Progress value={component.score} className="h-2 mb-2" />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{component.description}</p>
                  <p className="text-xs text-muted-foreground font-medium">{component.target}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Estimated Valuation */}
      {currentValuation > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Estimated Valuation</h4>
            <div className="text-2xl font-bold text-primary">
              {adjustedValuation > currentValuation ? (
                <div>
                  <div className="text-lg text-gray-500 line-through">{formatCurrency(currentValuation)}</div>
                  <div>{formatCurrency(adjustedValuation)}</div>
                </div>
              ) : (
                formatCurrency(currentValuation)
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {formatCurrency(adjustedEbitda)} EBITDA × {multiple}x multiple
              {adjustedValuation > currentValuation && (
                <div className="text-green-700 font-medium">
                  +{formatCurrency(adjustedValuation - currentValuation)} potential increase
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Recommended Actions</h4>
          <div className="space-y-2 text-sm">
            {overallScore < 40 && (
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                <span>Complete financial assessment to identify improvement areas</span>
              </div>
            )}
            {marginToUse < 0.15 && (
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0" />
                <span>Improve EBITDA margin through cost optimization or add-backs</span>
              </div>
            )}
            {!assessment && (
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-white/20 rounded-full mt-1.5 flex-shrink-0" />
                <span>Begin by entering basic financial information</span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
              <span>Gather supporting documentation for due diligence</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};