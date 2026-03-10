import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProgress } from '@/hooks/useProgress';
import { 
  AlertTriangle, 
  Skull,
  Users,
  UserX,
  DollarSign,
  Scale,
  Brain,
  Eye,
  EyeOff,
  HeartCrack,
  Bomb,
  FileWarning,
  Shield,
  ChevronLeft,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface DiagnosticQuestion {
  id: string;
  category: 'mindset' | 'nepotism' | 'hidden' | 'business' | 'financial';
  question: string;
  subtext?: string;
  yesIsFatal?: boolean;
  noIsFatal?: boolean;
  severity: 'fatal' | 'critical' | 'major' | 'minor';
}

interface Answer {
  questionId: string;
  answer: 'yes' | 'no' | null;
  severity: 'fatal' | 'critical' | 'major' | 'minor';
  category: string;
}

export const DealKillersDiagnostic: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [justAnswered, setJustAnswered] = useState<'yes' | 'no' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { markModuleComplete } = useProgress();

  const questions: DiagnosticQuestion[] = [
    // MINDSET KILLERS
    {
      id: 'control-freak',
      category: 'mindset',
      question: "Will you refuse PE's changes if you disagree with them?",
      subtext: "Think about rebranding, restructuring, or strategic pivots",
      yesIsFatal: true,
      severity: 'fatal'
    },
    {
      id: 'my-way',
      category: 'mindset',
      question: "Do you believe you know better than PE how to grow your business?",
      subtext: "They've done this 50 times across their portfolio",
      yesIsFatal: true,
      severity: 'fatal'
    },
    {
      id: 'just-money',
      category: 'mindset',
      question: "Are you looking for just capital, not operational help?",
      subtext: "PE is about partnership and transformation, not just funding",
      yesIsFatal: true,
      severity: 'fatal'
    },
    {
      id: 'company-name',
      category: 'mindset',
      question: "Would you fight to keep your company name if PE wants to change it?",
      subtext: "Sometimes rebranding is part of the growth strategy",
      yesIsFatal: true,
      severity: 'critical'
    },
    {
      id: 'fire-friend',
      category: 'mindset',
      question: "Would you block PE from firing your underperforming friend?",
      subtext: "Personal relationships vs. business performance",
      yesIsFatal: true,
      severity: 'critical'
    },

    // NEPOTISM & DEAD WEIGHT
    {
      id: 'spouse-payroll',
      category: 'nepotism',
      question: "Is your spouse on payroll but doing less than a full-time job?",
      subtext: "Be honest about their actual contribution",
      yesIsFatal: true,
      severity: 'fatal'
    },
    {
      id: 'family-employees',
      category: 'nepotism',
      question: "Do you have family members in key roles who couldn't get hired elsewhere?",
      subtext: "Would they get the same role at another company?",
      yesIsFatal: true,
      severity: 'critical'
    },
    {
      id: 'hidden-incompetence',
      category: 'nepotism',
      question: "Are you hiding someone's incompetence because of personal relationships?",
      subtext: "PE will test everyone individually",
      yesIsFatal: true,
      severity: 'fatal'
    },
    {
      id: 'ghost-employees',
      category: 'nepotism',
      question: "Do you have anyone on payroll who rarely shows up?",
      subtext: "Kids, consultants, advisors who don't actually work",
      yesIsFatal: true,
      severity: 'fatal'
    },
    {
      id: 'protect-weak',
      category: 'nepotism',
      question: "Will you lie about someone's performance to protect them?",
      subtext: "PE interviews everyone separately - truth comes out",
      yesIsFatal: true,
      severity: 'fatal'
    },
    {
      id: 'made-up-roles',
      category: 'nepotism',
      question: "Did you create titles just to justify family salaries?",
      subtext: "Chief Happiness Officer, Brand Ambassador, etc.",
      yesIsFatal: true,
      severity: 'critical'
    },

    // HIDDEN LANDMINES
    {
      id: 'pending-lawsuit',
      category: 'hidden',
      question: "Are there ANY pending or threatened lawsuits?",
      subtext: "Even verbal threats or potential claims",
      yesIsFatal: true,
      severity: 'fatal'
    },
    {
      id: 'side-deals',
      category: 'hidden',
      question: "Do you have any handshake deals or verbal agreements?",
      subtext: "Customer discounts, employee promises, supplier terms",
      yesIsFatal: true,
      severity: 'fatal'
    },
    {
      id: 'personal-expenses',
      category: 'hidden',
      question: "Are you running personal expenses through the business?",
      subtext: "Country club, cars, vacation homes, family trips",
      yesIsFatal: true,
      severity: 'critical'
    },
    {
      id: 'revenue-games',
      category: 'hidden',
      question: "Have you played ANY games with revenue timing?",
      subtext: "Pulling forward sales, channel stuffing, prebilling",
      yesIsFatal: true,
      severity: 'fatal'
    },
    {
      id: 'regulatory-issues',
      category: 'hidden',
      question: "Are you non-compliant with ANY regulations?",
      subtext: "Licenses, permits, safety, employment law",
      yesIsFatal: true,
      severity: 'fatal'
    },
    {
      id: 'tax-problems',
      category: 'hidden',
      question: "Do you have any tax issues or payment plans?",
      subtext: "IRS, state, payroll, sales tax",
      yesIsFatal: true,
      severity: 'fatal'
    },
    {
      id: 'customer-leaving',
      category: 'hidden',
      question: "Is any major customer planning to leave?",
      subtext: "Or even considering other options",
      yesIsFatal: true,
      severity: 'fatal'
    },

    // BUSINESS FUNDAMENTALS
    {
      id: 'customer-concentration',
      category: 'business',
      question: "Does your largest customer represent over 30% of revenue?",
      yesIsFatal: true,
      severity: 'critical'
    },
    {
      id: 'revenue-decline',
      category: 'business',
      question: "Has revenue declined for 2+ consecutive years?",
      yesIsFatal: true,
      severity: 'fatal'
    },
    {
      id: 'no-contracts',
      category: 'business',
      question: "Do key employees lack employment contracts?",
      yesIsFatal: true,
      severity: 'critical'
    },
    {
      id: 'owner-dependent',
      category: 'business',
      question: "Would the business struggle without you for 30 days?",
      yesIsFatal: true,
      severity: 'critical'
    },
    {
      id: 'no-financials',
      category: 'business',
      question: "Do you lack reviewed/audited financials?",
      yesIsFatal: true,
      severity: 'critical'
    },
    {
      id: 'ancient-tech',
      category: 'business',
      question: "Are you still using paper or Excel for critical processes?",
      yesIsFatal: true,
      severity: 'major'
    },
    {
      id: 'no-management',
      category: 'business',
      question: "Is there no real management team beyond you?",
      yesIsFatal: true,
      severity: 'critical'
    },

    // FINANCIAL REALITY
    {
      id: 'ebitda-games',
      category: 'financial',
      question: "Are your EBITDA adjustments over 20% of reported EBITDA?",
      subtext: "All those add-backs you're claiming",
      yesIsFatal: true,
      severity: 'critical'
    },
    {
      id: 'working-capital',
      category: 'financial',
      question: "Do you have deteriorating working capital?",
      yesIsFatal: true,
      severity: 'critical'
    },
    {
      id: 'hidden-liabilities',
      category: 'financial',
      question: "Are there ANY unrecorded liabilities?",
      subtext: "Warranties, commitments, lease obligations",
      yesIsFatal: true,
      severity: 'fatal'
    },
    {
      id: 'inventory-issues',
      category: 'financial',
      question: "Is inventory overstated or obsolete?",
      yesIsFatal: true,
      severity: 'major'
    },
    {
      id: 'bad-receivables',
      category: 'financial',
      question: "Do you have uncollectible receivables on the books?",
      yesIsFatal: true,
      severity: 'major'
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Determine which answer is good/bad
  const goodAnswer = currentQuestion.yesIsFatal ? 'no' : 
                     currentQuestion.noIsFatal ? 'yes' : 'no';
  const badAnswer = goodAnswer === 'yes' ? 'no' : 'yes';

  const handleAnswer = (answer: 'yes' | 'no') => {
    const question = questions[currentQuestionIndex];
    const isFatal = (answer === 'yes' && question.yesIsFatal) || 
                    (answer === 'no' && question.noIsFatal);
    
    const newAnswer: Answer = {
      questionId: question.id,
      answer,
      severity: isFatal ? 'fatal' : question.severity,
      category: question.category
    };

    setAnswers([...answers, newAnswer]);
    setJustAnswered(answer);
    setShowFeedback(true);

    // Auto-advance after showing feedback
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setJustAnswered(null);
        setShowFeedback(false);
      } else {
        setShowResults(true);
      }
    }, 2000);
  };

  const goBack = () => {
    if (currentQuestionIndex > 0) {
      setAnswers(answers.slice(0, -1));
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setJustAnswered(null);
      setShowFeedback(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      await markModuleComplete('Deal Killers Diagnostic', 3);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error marking module complete:', error);
    }
  };

  if (showResults) {
    return <DiagnosticResults 
      answers={answers} 
      questions={questions} 
      onMarkComplete={handleMarkComplete}
      isCompleted={isCompleted}
    />;
  }

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'mindset': return <Brain className="w-5 h-5" />;
      case 'nepotism': return <Users className="w-5 h-5" />;
      case 'hidden': return <EyeOff className="w-5 h-5" />;
      case 'business': return <FileWarning className="w-5 h-5" />;
      case 'financial': return <DollarSign className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Deal Killer Diagnostic
        </h1>
        <p className="text-xl text-muted-foreground">
          30 Questions That Determine Your PE Fundability
        </p>
      </div>

      {/* Progress */}
      <Card className="p-4 bg-card border-border">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </Card>

      {/* Question Card */}
      <Card className={`p-8 border-2 transition-all duration-500 ${
        showFeedback && justAnswered === badAnswer ? 
          'bg-destructive/10 border-destructive' : 
        showFeedback && justAnswered === goodAnswer ?
          'bg-green-500/10 border-green-500' :
          'bg-card border-border'
      }`}>
        <div className="space-y-6">
          {/* Category Badge */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground">
              {getCategoryIcon(currentQuestion.category)}
              <span className="text-sm font-semibold capitalize">
                {currentQuestion.category === 'nepotism' ? 'Dead Weight' : currentQuestion.category}
              </span>
            </div>
          </div>

          {/* Question */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-foreground">
              {currentQuestion.question}
            </h2>
            {currentQuestion.subtext && (
              <p className="text-muted-foreground text-sm">
                {currentQuestion.subtext}
              </p>
            )}
          </div>

          {/* Warning/Feedback when bad answer is clicked */}
          {showFeedback && justAnswered === badAnswer && (
            <Alert className="bg-destructive/10 border-destructive animate-pulse">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDescription className="text-destructive">
                <strong>⚠️ DEAL KILLER WARNING:</strong> This issue will significantly 
                impact your PE deal. {currentQuestion.severity === 'fatal' ? 
                  'This could kill the entire transaction.' : 
                  'This will reduce your valuation substantially.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Success feedback for good answer */}
          {showFeedback && justAnswered === goodAnswer && (
            <div className="text-center p-4 rounded-lg bg-green-500/10 animate-pulse">
              <div className="flex items-center justify-center gap-2 text-green-500">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Good - No Issue Here</span>
              </div>
            </div>
          )}

          {/* Answer Buttons - Show colors before clicking */}
          {!showFeedback && (
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleAnswer('yes')}
                size="lg"
                className={`h-20 text-lg text-white border-0 transition-all ${
                  goodAnswer === 'yes' ? 
                    'bg-green-600 hover:bg-green-700' : 
                    'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                YES
              </Button>
              <Button
                onClick={() => handleAnswer('no')}
                size="lg"
                className={`h-20 text-lg text-white border-0 transition-all ${
                  goodAnswer === 'no' ? 
                    'bg-green-600 hover:bg-green-700' : 
                    'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                NO
              </Button>
            </div>
          )}

          {/* Back Button */}
          {currentQuestionIndex > 0 && !showFeedback && (
            <div className="flex justify-center">
              <Button
                onClick={goBack}
                variant="outline"
                className="border-border hover:bg-muted"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous Question
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Context Card */}
      <Card className="p-4 bg-card border-border">
        <p className="text-muted-foreground text-sm">
          <strong className="text-foreground">Why these questions matter:</strong> PE firms have seen it all. 
          They use forensic accountants, operational experts, and behavioral interviews to uncover everything. 
          Answer honestly - this diagnostic is for your benefit.
        </p>
      </Card>
    </div>
  );
};

function DiagnosticResults({ answers, questions, onMarkComplete, isCompleted }: any) {
  // Calculate results
  const fatalIssues = answers.filter((a: Answer) => a.severity === 'fatal');
  const criticalIssues = answers.filter((a: Answer) => a.severity === 'critical');
  const majorIssues = answers.filter((a: Answer) => a.severity === 'major');

  // Category breakdowns
  const mindsetFatals = fatalIssues.filter((a: Answer) => a.category === 'mindset').length;
  const nepotismFatals = fatalIssues.filter((a: Answer) => a.category === 'nepotism').length;
  const hiddenFatals = fatalIssues.filter((a: Answer) => a.category === 'hidden').length;
  const businessFatals = fatalIssues.filter((a: Answer) => a.category === 'business').length;
  const financialFatals = fatalIssues.filter((a: Answer) => a.category === 'financial').length;

  const totalFatals = fatalIssues.length;
  const totalCriticals = criticalIssues.length;
  const totalMajors = majorIssues.length;

  // Determine verdict
  const getVerdict = () => {
    if (totalFatals > 5) {
      return {
        status: 'UNFUNDABLE',
        emoji: '💀',
        title: "You're Completely Unfundable",
        message: "Too many fatal issues. PE won't touch this deal.",
        advice: "You need 12+ months of serious changes or find a different exit path.",
        color: 'red'
      };
    }
    if (totalFatals > 2) {
      return {
        status: 'UNLIKELY',
        emoji: '🚨',
        title: "Deal Extremely Unlikely",
        message: "Multiple deal killers that need immediate fixing.",
        advice: "6-12 months of hard work required before approaching PE.",
        color: 'orange'
      };
    }
    if (totalFatals > 0 || totalCriticals > 5) {
      return {
        status: 'AT_RISK',
        emoji: '⚠️',
        title: "Deal At Serious Risk",
        message: "Significant issues that will hurt valuation or kill the deal.",
        advice: "3-6 months to fix critical issues before going to market.",
        color: 'yellow'
      };
    }
    if (totalCriticals > 2) {
      return {
        status: 'NEEDS_WORK',
        emoji: '🔧',
        title: "Needs Work But Possible",
        message: "Some issues to address but deal is doable.",
        advice: "1-3 months of optimization recommended.",
        color: 'blue'
      };
    }
    return {
      status: 'READY',
      emoji: '✅',
      title: "PE Ready",
      message: "You're in good shape for a PE transaction.",
      advice: "Focus on maximizing valuation and preparing for due diligence.",
      color: 'emerald'
    };
  };

  const verdict = getVerdict();
  const dealProbability = Math.max(0, 100 - (totalFatals * 20) - (totalCriticals * 10) - (totalMajors * 3));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">
          Your Deal Killer Report
        </h1>
        <p className="text-xl text-muted-foreground">
          The Brutal Truth About Your PE Readiness
        </p>
      </div>

      {/* Main Verdict Card */}
      <Card className={`p-8 border-2 ${
        verdict.color === 'red' ? 'bg-red-950/50 border-red-500' :
        verdict.color === 'orange' ? 'bg-orange-950/50 border-orange-500' :
        verdict.color === 'yellow' ? 'bg-yellow-950/50 border-yellow-600' :
        verdict.color === 'blue' ? 'bg-blue-950/50 border-white/30' :
        'bg-emerald-950/50 border-emerald-500'
      }`}>
        <div className="text-center space-y-4">
          <div className="text-7xl">{verdict.emoji}</div>
          <h2 className={`text-4xl font-bold ${
            verdict.color === 'red' ? 'text-red-400' :
            verdict.color === 'orange' ? 'text-orange-400' :
            verdict.color === 'yellow' ? 'text-yellow-400' :
            verdict.color === 'blue' ? 'text-white' :
            'text-emerald-400'
          }`}>
            {verdict.title}
          </h2>
          <p className="text-xl text-foreground">{verdict.message}</p>
          <div className="pt-4 border-t border-border">
            <p className="text-muted-foreground">{verdict.advice}</p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6 bg-card border-border text-center">
          <div className="text-3xl font-bold text-red-500">{totalFatals}</div>
          <div className="text-muted-foreground mt-1">Fatal Issues</div>
        </Card>
        <Card className="p-6 bg-card border-border text-center">
          <div className="text-3xl font-bold text-orange-500">{totalCriticals}</div>
          <div className="text-muted-foreground mt-1">Critical Issues</div>
        </Card>
        <Card className="p-6 bg-card border-border text-center">
          <div className="text-3xl font-bold text-yellow-500">{dealProbability}%</div>
          <div className="text-muted-foreground mt-1">Deal Probability</div>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-xl font-bold text-foreground mb-4">Fatal Issues by Category</h3>
        <div className="space-y-3">
          {mindsetFatals > 0 && (
            <Alert className="bg-purple-950/30 border-purple-900/50">
              <Brain className="h-4 w-4 text-purple-500" />
              <AlertDescription>
                <strong className="text-purple-400">Mindset Issues ({mindsetFatals}):</strong> You're not ready to give up control. PE isn't for you.
              </AlertDescription>
            </Alert>
          )}
          {nepotismFatals > 0 && (
            <Alert className="bg-pink-950/30 border-pink-900/50">
              <Users className="h-4 w-4 text-pink-500" />
              <AlertDescription>
                <strong className="text-pink-400">Dead Weight ({nepotismFatals}):</strong> Family and friends on payroll will be discovered and fired.
              </AlertDescription>
            </Alert>
          )}
          {hiddenFatals > 0 && (
            <Alert className="bg-red-950/30 border-red-900/50">
              <EyeOff className="h-4 w-4 text-red-500" />
              <AlertDescription>
                <strong className="text-red-400">Hidden Issues ({hiddenFatals}):</strong> These will be found. Disclose now or face fraud claims.
              </AlertDescription>
            </Alert>
          )}
          {businessFatals > 0 && (
            <Alert className="bg-orange-950/30 border-orange-900/50">
              <FileWarning className="h-4 w-4 text-orange-500" />
              <AlertDescription>
                <strong className="text-orange-400">Business Fundamentals ({businessFatals}):</strong> Core operational issues that make you uninvestable.
              </AlertDescription>
            </Alert>
          )}
          {financialFatals > 0 && (
            <Alert className="bg-yellow-950/30 border-yellow-900/50">
              <DollarSign className="h-4 w-4 text-yellow-500" />
              <AlertDescription>
                <strong className="text-yellow-400">Financial Issues ({financialFatals}):</strong> Your numbers don't work for PE math.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      {/* Specific Fatal Issues */}
      {totalFatals > 0 && (
        <Card className="p-6 bg-red-950/30 border-red-900/50">
          <h3 className="text-xl font-bold text-red-400 mb-4">
            <Skull className="inline w-6 h-6 mr-2" />
            Your Deal Killers (Must Fix or Abandon PE)
          </h3>
          <div className="space-y-2">
            {fatalIssues.map((issue: Answer) => {
              const question = questions.find((q: any) => q.id === issue.questionId);
              return (
                <div key={issue.questionId} className="flex items-start space-x-3">
                  <span className="text-red-500">•</span>
                  <div>
                    <p className="text-foreground">{question.question}</p>
                    <p className="text-muted-foreground text-sm">You answered: {issue.answer?.toUpperCase()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* The Hard Truth */}
      <Card className="p-6 bg-gradient-to-r from-muted/50 to-muted border-border">
        <h3 className="text-xl font-bold text-foreground mb-4">The Hard Truth</h3>
        <div className="space-y-3 text-foreground">
          {(mindsetFatals > 0 || nepotismFatals > 0) && (
            <p>
              <strong className="text-red-400">Your biggest problem isn't the business - it's you.</strong> 
              {' '}You're either not willing to give up control or you're protecting dead weight. 
              PE will see through this immediately.
            </p>
          )}
          {hiddenFatals > 0 && (
            <p>
              <strong className="text-orange-400">You're hiding things that WILL be discovered.</strong>
              {' '}PE firms employ forensic accountants and former FBI investigators. 
              Every skeleton will be found. Come clean now or face fraud accusations later.
            </p>
          )}
          <p className="pt-3 border-t border-border text-sm">
            <strong>Remember:</strong> PE isn't buying your business - they're buying a platform for growth. 
            If you can't be a team player, if you're protecting incompetent family members, or if you're 
            hiding material issues, you're wasting everyone's time and money.
          </p>
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-xl font-bold text-foreground mb-4">Your Next Steps</h3>
        <div className="space-y-2 text-foreground">
          {verdict.status === 'UNFUNDABLE' && (
            <>
              <p>1. Accept that PE isn't your path right now</p>
              <p>2. Consider strategic buyers or management buyout</p>
              <p>3. If determined, spend 12+ months fixing fatal issues</p>
              <p>4. Get professional help - you can't do this alone</p>
            </>
          )}
          {verdict.status === 'UNLIKELY' && (
            <>
              <p>1. Address all fatal issues immediately</p>
              <p>2. Come clean on hidden problems</p>
              <p>3. Remove dead weight from payroll</p>
              <p>4. Work on your control issues</p>
              <p>5. Reassess in 6 months</p>
            </>
          )}
          {verdict.status === 'AT_RISK' && (
            <>
              <p>1. Fix fatal issues within 90 days</p>
              <p>2. Document all verbal agreements</p>
              <p>3. Clean up financial reporting</p>
              <p>4. Build a real management team</p>
              <p>5. Get PE-ready financial statements</p>
            </>
          )}
          {verdict.status === 'NEEDS_WORK' && (
            <>
              <p>1. Address critical issues</p>
              <p>2. Strengthen management team</p>
              <p>3. Improve financial controls</p>
              <p>4. Document all processes</p>
            </>
          )}
          {verdict.status === 'READY' && (
            <>
              <p>1. Get your data room ready</p>
              <p>2. Practice management presentations</p>
              <p>3. Identify and fix minor issues</p>
              <p>4. Focus on maximizing valuation</p>
            </>
          )}
        </div>
      </Card>

      {/* Mark Complete Button */}
      <div className="flex justify-center">
        <Button
          onClick={onMarkComplete}
          disabled={isCompleted}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
        >
          {isCompleted ? '✓ Module Completed' : 'Mark Module Complete'}
        </Button>
      </div>
    </div>
  );
}

export default DealKillersDiagnostic;
