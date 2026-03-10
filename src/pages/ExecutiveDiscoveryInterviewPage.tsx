import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
// import { supabase } from '@/integrations/supabase/client'; // Removed - using MongoDB backend
import { Clock, TrendingUp, Target, ChevronRight, ChevronDown, AlertCircle, CheckCircle2, XCircle, Sparkles, MessageSquare, Users, BarChart3, Briefcase, Eye, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// PE interview questions — the exact questions PE firms ask in management presentations
const peInterviewCategories = [
  {
    id: 'overview',
    title: 'Business Overview (Warm-Up)',
    icon: Briefcase,
    description: 'They start friendly to get you talking. Don\'t ramble — be concise.',
    questions: [
      'Walk us through the founding story and key milestones.',
      'How do you describe the business to someone unfamiliar with the space?',
      'What are you most proud of building? What would you do differently?'
    ]
  },
  {
    id: 'revenue',
    title: 'Revenue & Growth',
    icon: TrendingUp,
    description: 'This is where they test if you really understand your own numbers.',
    questions: [
      'Walk us through revenue by customer, segment, and geography.',
      'What\'s driving growth? Is it price, volume, or new customers?',
      'What does the sales cycle look like? How has win rate trended?',
      'Where do you see the biggest growth opportunities in the next 3-5 years?'
    ]
  },
  {
    id: 'competitive',
    title: 'Competitive Positioning',
    icon: Target,
    description: 'They want to know your moat. If you can\'t articulate it, they assume you don\'t have one.',
    questions: [
      'Who do you lose deals to and why?',
      'What\'s your moat? How defensible is it?',
      'How do customers evaluate you vs. alternatives?'
    ]
  },
  {
    id: 'operations',
    title: 'Operations & Team',
    icon: Users,
    description: 'They\'re evaluating whether the business runs without you.',
    questions: [
      'Walk us through the org chart — who are the key people?',
      'What roles are you hiring for? What\'s been hardest to fill?',
      'What keeps you up at night operationally?'
    ]
  },
  {
    id: 'financial',
    title: 'Financial Deep-Dive',
    icon: BarChart3,
    description: 'They\'ll probe every line item. Know your numbers cold.',
    questions: [
      'Walk us through the margin bridge — what\'s changed and why?',
      'Any one-time or non-recurring items we should understand?',
      'How do you think about capex — maintenance vs. growth?',
      'Working capital seasonality?'
    ]
  },
  {
    id: 'forward',
    title: 'Forward Look',
    icon: Eye,
    description: 'This is the "can we trust the projections?" section.',
    questions: [
      'Walk us through the budget/plan for next year.',
      'What assumptions are you most confident in? Least confident?',
      'What would need to go right to significantly beat plan?',
      'What would need to go wrong to significantly miss plan?'
    ]
  }
];

// Combined question interface
interface ExecutiveQuestion {
  id: string;
  section: 'goals' | 'readiness';
  question: string;
  type: 'select' | 'multiselect';
  options: any[];
  redFlag?: number;
  impact?: string;
  fixPath?: string;
  timeToFix?: string;
  buyerView?: string;
}

// Path recommendation interface
interface PathResult {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  timeline: string;
  icon: any;
  color: string;
  highlights: string[];
}

// Comprehensive 12-question assessment
const executiveQuestions: ExecutiveQuestion[] = [
  // Part 1: Exit Goals & Preferences (5 questions from Path Discovery)
  {
    id: 'urgency',
    section: 'goals',
    question: 'How quickly do you need to exit your business?',
    type: 'select',
    options: [
      { value: 'asap', label: 'As soon as possible (within 12 months)', weight: { quick: 3, value: 1, strategic: 0 } },
      { value: 'moderate', label: 'Within 18-24 months', weight: { quick: 1, value: 3, strategic: 2 } },
      { value: 'flexible', label: 'I have 2+ years to plan', weight: { quick: 0, value: 2, strategic: 3 } }
    ]
  },
  {
    id: 'involvement',
    section: 'goals',
    question: 'How much time can you dedicate to improving your business?',
    type: 'select',
    options: [
      { value: 'minimal', label: 'Very little - I want a hands-off approach', weight: { quick: 3, value: 0, strategic: 0 } },
      { value: 'moderate', label: 'Some time for key improvements', weight: { quick: 1, value: 3, strategic: 2 } },
      { value: 'full', label: 'Significant time for major growth', weight: { quick: 0, value: 1, strategic: 3 } }
    ]
  },
  {
    id: 'risk',
    section: 'goals',
    question: 'What is your risk tolerance?',
    type: 'select',
    options: [
      { value: 'low', label: 'Conservative - I prefer certainty', weight: { quick: 3, value: 2, strategic: 0 } },
      { value: 'medium', label: 'Moderate - Some risk for better returns', weight: { quick: 1, value: 3, strategic: 2 } },
      { value: 'high', label: 'Aggressive - High risk, high reward', weight: { quick: 0, value: 1, strategic: 3 } }
    ]
  },
  {
    id: 'capital',
    section: 'goals',
    question: 'Do you have capital available for business improvements?',
    type: 'select',
    options: [
      { value: 'none', label: 'No additional capital available', weight: { quick: 3, value: 1, strategic: 0 } },
      { value: 'some', label: 'Some capital for targeted improvements', weight: { quick: 1, value: 3, strategic: 2 } },
      { value: 'significant', label: 'Significant capital for major initiatives', weight: { quick: 0, value: 2, strategic: 3 } }
    ]
  },
  {
    id: 'goals',
    section: 'goals',
    question: 'What is your primary exit goal?',
    type: 'select',
    options: [
      { value: 'liquidity', label: 'Quick liquidity for personal reasons', weight: { quick: 3, value: 1, strategic: 0 } },
      { value: 'maximize', label: 'Maximize value with reasonable effort', weight: { quick: 0, value: 3, strategic: 2 } },
      { value: 'legacy', label: 'Build something bigger and more valuable', weight: { quick: 0, value: 1, strategic: 3 } }
    ]
  },
  
  // Part 2: Business Reality Check (7 questions from Executive Discovery)
  {
    id: 'customer-concentration',
    section: 'readiness',
    question: 'What percentage of revenue comes from your largest customer?',
    type: 'select',
    options: [
      { label: 'Under 10%', value: 0, score: 100 },
      { label: '10-20%', value: 1, score: 80 },
      { label: '20-30%', value: 2, score: 50 },
      { label: '30-40%', value: 3, score: 20 },
      { label: 'Over 40%', value: 4, score: 0 }
    ],
    redFlag: 3,
    impact: 'High',
    fixPath: 'customer-diversification',
    timeToFix: '90 days',
    buyerView: 'PE sees >30% as major risk. They\'ll slash your multiple by 20-40%.'
  },
  {
    id: 'owner-dependency',
    section: 'readiness',
    question: 'How many key decisions require YOUR personal approval?',
    type: 'select',
    options: [
      { label: 'Almost none', value: 0, score: 100 },
      { label: 'Some operational', value: 1, score: 70 },
      { label: 'Most operational', value: 2, score: 30 },
      { label: 'Everything', value: 3, score: 0 }
    ],
    redFlag: 2,
    impact: 'High',
    fixPath: 'management-building',
    timeToFix: '180 days',
    buyerView: 'If you ARE the business, buyers can\'t envision it without you.'
  },
  {
    id: 'management-depth',
    section: 'readiness',
    question: 'If you disappeared for 3 months, what would happen?',
    type: 'select',
    options: [
      { label: 'Business runs smoothly', value: 0, score: 100 },
      { label: 'Minor hiccups only', value: 1, score: 70 },
      { label: 'Major issues arise', value: 2, score: 30 },
      { label: 'Business would fail', value: 3, score: 0 }
    ],
    redFlag: 2,
    impact: 'High',
    fixPath: 'leadership-development',
    timeToFix: '180 days',
    buyerView: 'No management team = no premium multiple. PE needs leadership continuity.'
  },
  {
    id: 'financial-hygiene',
    section: 'readiness',
    question: 'How \'clean\' are your financials?',
    type: 'multiselect',
    options: [
      { label: 'GAAP compliant books', value: 0, score: 20 },
      { label: 'Monthly financials within 10 days', value: 1, score: 20 },
      { label: 'Clean AR aging (90%+ current)', value: 2, score: 20 },
      { label: 'No personal expenses in P&L', value: 3, score: 20 },
      { label: '3-year audited financials', value: 4, score: 20 }
    ],
    redFlag: 2,
    impact: 'Medium',
    fixPath: 'financial-cleanup',
    timeToFix: '90 days',
    buyerView: 'Messy books = longer due diligence = dead deals. Clean financials speed everything up.'
  },
  {
    id: 'recurring-revenue',
    section: 'readiness',
    question: 'What percentage of revenue is recurring/contracted?',
    type: 'select',
    options: [
      { label: 'Over 80%', value: 0, score: 100 },
      { label: '60-80%', value: 1, score: 80 },
      { label: '40-60%', value: 2, score: 60 },
      { label: '20-40%', value: 3, score: 30 },
      { label: 'Under 20%', value: 4, score: 0 }
    ],
    redFlag: 3,
    impact: 'Medium',
    fixPath: 'revenue-model-shift',
    timeToFix: '180 days',
    buyerView: 'Recurring revenue gets 2-3x higher multiples than project work.'
  },
  {
    id: 'growth-trajectory',
    section: 'readiness',
    question: 'Your revenue growth over the last 3 years?',
    type: 'select',
    options: [
      { label: '20%+ annually', value: 0, score: 100 },
      { label: '10-20% annually', value: 1, score: 75 },
      { label: '5-10% annually', value: 2, score: 50 },
      { label: 'Flat', value: 3, score: 25 },
      { label: 'Declining', value: 4, score: 0 }
    ],
    redFlag: 3,
    impact: 'Medium',
    fixPath: 'growth-acceleration',
    timeToFix: '90 days',
    buyerView: 'PE needs growth story. Flat = commodity multiple. Growth = premium valuation.'
  },
  {
    id: 'systems-processes',
    section: 'readiness',
    question: 'Which critical processes are documented?',
    type: 'multiselect',
    options: [
      { label: 'Sales process', value: 0, score: 20 },
      { label: 'Service delivery', value: 1, score: 20 },
      { label: 'Financial reporting', value: 2, score: 20 },
      { label: 'HR/hiring', value: 3, score: 20 },
      { label: 'IT/technology', value: 4, score: 20 }
    ],
    redFlag: 3,
    impact: 'Low',
    fixPath: 'process-documentation',
    timeToFix: '90 days',
    buyerView: 'No systems = no scale = no strategic buyer interest. Documentation enables growth.'
  }
];

// Path results for recommendations
const pathResults: PathResult[] = [
  {
    id: 'quick',
    title: 'Quick Exit',
    subtitle: 'Sell as-is in 6-12 months',
    description: 'Get to market quickly with minimal preparation. Best for owners who need immediate liquidity or want a hands-off approach.',
    timeline: '6-12 months',
    icon: Clock,
    color: 'orange',
    highlights: [
      'Fastest path to liquidity',
      'Minimal time investment required',
      'Predictable timeline',
      'Less preparation needed'
    ]
  },
  {
    id: 'value',
    title: 'Value Building',
    subtitle: 'Improve first, then sell in 18-24 months',
    description: 'Make strategic improvements to increase business value before sale. Balanced approach between effort and return.',
    timeline: '18-24 months',
    icon: TrendingUp,
    color: 'blue',
    highlights: [
      'Significant value increase potential',
      'Proven improvement strategies',
      'Manageable time commitment',
      'Higher sale multiples'
    ]
  },
  {
    id: 'strategic',
    title: 'Strategic Growth',
    subtitle: 'Build something bigger over 2-3 years',
    description: 'Transform your business into a market leader through strategic initiatives. Highest potential return for committed owners.',
    timeline: '2-3 years',
    icon: Target,
    color: 'purple',
    highlights: [
      'Maximum value creation',
      'Market leadership position',
      'Premium buyer interest',
      'Legacy building opportunity'
    ]
  }
];

// Readiness scoring weights
const readinessWeights = {
  'customer-concentration': 20,
  'owner-dependency': 20,
  'management-depth': 15,
  'financial-hygiene': 15,
  'recurring-revenue': 15,
  'growth-trajectory': 10,
  'systems-processes': 5
};

export default function ExecutiveDiscoveryInterviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);
  const [readinessScore, setReadinessScore] = useState(0);
  const [recommendedPath, setRecommendedPath] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const question = executiveQuestions[currentQuestion];

  // Calculate scores whenever answers change
  useEffect(() => {
    calculateScores();
  }, [answers]);

  const calculateScores = () => {
    // Calculate readiness score (from readiness questions)
    let totalScore = 0;
    let totalWeight = 0;

    executiveQuestions.filter(q => q.section === 'readiness').forEach((q) => {
      const weight = readinessWeights[q.id] || 0;
      const answer = answers[q.id];
      
      if (answer !== undefined) {
        let questionScore = 0;
        
        if (q.type === 'select') {
          const option = q.options.find(o => o.value === answer);
          questionScore = option?.score || 0;
        } else if (q.type === 'multiselect' && Array.isArray(answer)) {
          questionScore = answer.reduce((sum, val) => {
            const option = q.options.find(o => o.value === val);
            return sum + (option?.score || 0);
          }, 0);
        }
        
        totalScore += (questionScore * weight) / 100;
        totalWeight += weight;
      }
    });

    const finalReadinessScore = totalWeight > 0 ? Math.round(totalScore) : 0;
    setReadinessScore(finalReadinessScore);

    // Calculate path recommendation (from goals questions)
    const pathScores = { quick: 0, value: 0, strategic: 0 };

    executiveQuestions.filter(q => q.section === 'goals').forEach(question => {
      const answer = answers[question.id];
      const option = question.options.find(opt => opt.value === answer);
      if (option && option.weight) {
        pathScores.quick += option.weight.quick;
        pathScores.value += option.weight.value;
        pathScores.strategic += option.weight.strategic;
      }
    });

    const maxScore = Math.max(pathScores.quick, pathScores.value, pathScores.strategic);
    let recommended = 'value'; // default

    if (pathScores.quick === maxScore) recommended = 'quick';
    else if (pathScores.strategic === maxScore) recommended = 'strategic';

    setRecommendedPath(recommended);
  };

  const handleAnswer = (value: any) => {
    if (question.type === 'multiselect') {
      const currentValues = answers[question.id] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v: any) => v !== value)
        : [...currentValues, value];
      setAnswers({ ...answers, [question.id]: newValues });
    } else {
      setAnswers({ ...answers, [question.id]: value });
    }
  };

  const handleNext = () => {
    if (currentQuestion < executiveQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      saveAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const saveAssessment = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Backend doesn't have exit_readiness_assessments table yet
      // Save to localStorage for now
      localStorage.setItem(`exit_assessment_${user.id}`, JSON.stringify({
        answers,
        score: readinessScore,
        assessment_version: '2.0',
        completed_at: new Date().toISOString()
      }));
      toast.success('Assessment saved!');
    } catch (err) {
      toast.error('Failed to save assessment');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getReadinessCategory = () => {
    if (readinessScore <= 40) return {
      label: 'Critical Gaps',
      message: 'You\'ve got gaps—but they\'re fixable with focus.',
      color: 'red',
      icon: XCircle
    };
    if (readinessScore <= 70) return {
      label: 'Fixable Risks',
      message: 'You\'re not far off. A focused 90-day plan could substantially improve your valuation.',
      color: 'yellow',
      icon: AlertCircle
    };
    return {
      label: 'Exit Ready',
      message: 'You\'re in the strike zone. Time to push for a premium.',
      color: 'green',
      icon: CheckCircle2
    };
  };

  const getRedFlagCount = () => {
    let count = 0;
    executiveQuestions.filter(q => q.section === 'readiness').forEach((q) => {
      const answer = answers[q.id];
      if (q.type === 'select' && answer >= (q.redFlag || 0)) {
        count++;
      } else if (q.type === 'multiselect' && Array.isArray(answer) && answer.length < (q.redFlag || 0)) {
        count++;
      }
    });
    return count;
  };

  const getCurrentSection = () => {
    const goalsQuestions = executiveQuestions.filter(q => q.section === 'goals').length;
    return currentQuestion < goalsQuestions ? 'goals' : 'readiness';
  };

  const getSectionTitle = () => {
    const section = getCurrentSection();
    return section === 'goals' ? 'Part 1: Exit Goals & Preferences' : 'Part 2: Business Reality Check';
  };

  if (showResults) {
    const readinessResult = getReadinessCategory();
    const ReadinessIcon = readinessResult.icon;
    const redFlags = getRedFlagCount();
    const recommendedPathData = pathResults.find(p => p.id === recommendedPath);

    return (
      <div className="min-h-screen bg-background p-6">
        <div>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-8">Your Executive Discovery Results</h1>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Path Recommendation */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Recommended Exit Path</h2>
                {recommendedPathData && (
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-${recommendedPathData.color}-500/20 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <recommendedPathData.icon className={`w-8 h-8 text-${recommendedPathData.color}-500`} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{recommendedPathData.title}</h3>
                    <p className="text-muted-foreground mb-4">{recommendedPathData.subtitle}</p>
                    <p className="text-sm text-foreground">{recommendedPathData.description}</p>
                  </div>
                )}
              </Card>

              {/* Readiness Score */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Exit Readiness Score</h2>
                <div className="text-center">
                  <ReadinessIcon className={`w-16 h-16 mx-auto mb-4 ${
                    readinessResult.color === 'red' ? 'text-destructive' : 
                    readinessResult.color === 'yellow' ? 'text-yellow-500' : 
                    'text-green-500'
                  }`} />
                  <div className="text-4xl font-bold text-foreground mb-2">{readinessScore}%</div>
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                    readinessResult.color === 'red' ? 'bg-destructive/20 text-destructive' :
                    readinessResult.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-600' :
                    'bg-green-500/20 text-green-600'
                  }`}>
                    {readinessResult.label}
                  </div>
                  <p className="text-muted-foreground mt-4">{readinessResult.message}</p>
                </div>
              </Card>
            </div>

            {/* Gap Analysis */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Gap Analysis</h2>
              <div className="text-center mb-6">
                <p className="text-lg text-muted-foreground">
                  You want a <strong>{recommendedPathData?.title}</strong> path ({recommendedPathData?.timeline}) 
                  but have a <strong>{readinessScore}% readiness score</strong>.
                </p>
                {redFlags > 0 && (
                  <p className="text-destructive mt-2">
                    You have {redFlags} critical issues that need immediate attention.
                  </p>
                )}
              </div>

              {/* Critical Issues */}
              {redFlags > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground text-left">Critical Issues to Address</h3>
                  {executiveQuestions.filter(q => q.section === 'readiness').map((q) => {
                    const answer = answers[q.id];
                    const isRedFlag = (q.type === 'select' && answer >= (q.redFlag || 0)) || 
                                      (q.type === 'multiselect' && Array.isArray(answer) && answer.length < (q.redFlag || 0));
                    
                    if (isRedFlag) {
                      return (
                        <div key={q.id} className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 text-left">
                          <div className="flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-foreground mb-2">{q.question}</h4>
                              <p className="text-muted-foreground mb-3">{q.buyerView}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-destructive">Impact: {q.impact}</span>
                                <span className="text-muted-foreground">Time to fix: {q.timeToFix}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </Card>

            {/* Action Plan */}
            <div className="bg-accent/50 border border-border rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-foreground mb-4">Your 90-Day Action Plan</h3>
              <p className="text-muted-foreground mb-6">
                Based on your {recommendedPathData?.title.toLowerCase()} goal and {readinessScore}% readiness score,
                here's your personalized roadmap to bridge the gap.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/portal/week-2/value-builder')} size="lg">
                  Build Your Action Plan
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/portal/schedule-consultation')}
                  size="lg"
                >
                  Schedule Strategy Session
                </Button>
              </div>
            </div>

            {/* Mock Management Presentation Prep */}
            <Card className="p-8 mt-8 text-left">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Mock Management Presentation Prep</h2>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs px-2 py-0.5">
                  <Sparkles className="w-3 h-3 mr-1" />
                  ENHANCED
                </Badge>
              </div>
              <p className="text-muted-foreground mb-6">
                These are the exact questions PE firms ask during management presentations.
                Review them, practice your answers, and walk into that meeting prepared.
                A typical management presentation is 60-90 minutes — you won't get through more than 15-20 questions.
              </p>

              <div className="space-y-3">
                {peInterviewCategories.map((category) => {
                  const isExpanded = expandedCategories[category.id];
                  const CategoryIcon = category.icon;
                  return (
                    <div key={category.id} className="border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedCategories(prev => ({
                          ...prev,
                          [category.id]: !prev[category.id]
                        }))}
                        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <CategoryIcon className="w-5 h-5 text-primary" />
                          <div className="text-left">
                            <span className="font-semibold text-foreground">{category.title}</span>
                            <span className="text-muted-foreground text-sm ml-2">({category.questions.length} questions)</span>
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-border">
                          <p className="text-sm text-muted-foreground italic my-3">{category.description}</p>
                          <ol className="space-y-3">
                            {category.questions.map((q, i) => (
                              <li key={i} className="flex gap-3 text-foreground">
                                <span className="text-primary font-semibold flex-shrink-0">{i + 1}.</span>
                                <span>{q}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* The Killer Question */}
                <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground mb-1">The Closing Question They Always Ask</p>
                      <p className="text-foreground italic">"What haven't we asked about that we should?"</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Have an answer ready. This is your chance to address the elephant in the room
                        before they find it in due diligence.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / executiveQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Executive Discovery Interview</h1>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs px-2 py-0.5">
              <Sparkles className="w-3 h-3 mr-1" />
              ENHANCED
            </Badge>
          </div>
          <p className="text-muted-foreground mb-6">
            Comprehensive assessment to determine your optimal exit path and business readiness — now with PE interview prep
          </p>
          
          <div className="bg-accent/50 border border-border rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-foreground mb-1">{getSectionTitle()}</h3>
            <p className="text-sm text-muted-foreground">
              {getCurrentSection() === 'goals' 
                ? 'Understanding your timeline, goals, and preferences'
                : 'Evaluating your business\'s exit readiness'
              }
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {executiveQuestions.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card className="p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            {question.question}
          </h2>

          {question.type === 'select' ? (
            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full text-left px-6 py-4 rounded-lg transition ${
                    answers[question.id] === option.value
                      ? 'bg-primary/20 border border-primary/50 text-foreground'
                      : 'bg-muted border border-border text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = (answers[question.id] || []).includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full text-left px-6 py-4 rounded-lg transition flex items-center gap-3 ${
                      isSelected
                        ? 'bg-primary/20 border border-primary/50 text-foreground'
                        : 'bg-muted border border-border text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Buyer View Insight (only for readiness questions) */}
          {question.section === 'readiness' && question.buyerView && (
            <div className="mt-8 p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-sm text-primary flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {question.buyerView}
              </p>
            </div>
          )}
        </Card>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              question.type === 'select' ? answers[question.id] === undefined :
              !answers[question.id] || answers[question.id].length === 0
            }
          >
            {currentQuestion === executiveQuestions.length - 1 ? 'See Results' : 'Next'} 
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}