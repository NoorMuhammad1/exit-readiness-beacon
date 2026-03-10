import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart, Brain, Users, Battery, Coffee, AlertTriangle,
  ChevronRight, ChevronLeft, Download, BookOpen, FileText,
  CheckCircle2, XCircle, Lightbulb, Shield, Clock,
  Pause, Play, TrendingUp, Home, UserCheck
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────

interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  whyItMatters: string;
}

interface AssessmentAnswers {
  [questionId: string]: number | null; // 1-5 scale
}

// ── Assessment Questions ────────────────────────────────────────

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'daily-life-vision',
    category: 'Post-Exit Vision',
    question: 'I have a clear picture of what my daily life looks like one year after selling.',
    whyItMatters: 'Sellers without a post-exit plan often experience a void that leads to regret. Knowing what comes next gives you something to run toward, not just away from.'
  },
  {
    id: 'hobbies-interests',
    category: 'Post-Exit Vision',
    question: 'I have interests, hobbies, or projects outside the business that genuinely excite me.',
    whyItMatters: 'Your business has been your primary source of purpose and stimulation. Without a replacement, the post-exit period can feel empty — even with money in the bank.'
  },
  {
    id: 'financial-plan',
    category: 'Post-Exit Vision',
    question: 'I have a financial plan for my post-exit life that does not depend on the exact sale price.',
    whyItMatters: 'If your entire retirement depends on hitting a specific number, every negotiation point becomes emotionally charged. Financial flexibility reduces deal-killing anxiety.'
  },
  {
    id: 'spouse-support',
    category: 'Family & Relationships',
    question: 'My spouse or partner fully supports the decision to sell.',
    whyItMatters: 'Spouse disagreements are one of the top reasons deals fall apart. If your partner isn\'t aligned, that tension will surface during the most stressful moments of the process.'
  },
  {
    id: 'family-discussion',
    category: 'Family & Relationships',
    question: 'I have discussed the sale with key family members and we are aligned on the decision.',
    whyItMatters: 'Children who expected to inherit, siblings who work in the business, parents who built it — unresolved family expectations can torpedo a deal at the last minute.'
  },
  {
    id: 'employee-plan',
    category: 'Family & Relationships',
    question: 'I have thought about what I will tell my employees and how they might react.',
    whyItMatters: 'Your team may feel blindsided or betrayed. Having a communication plan reduces guilt and helps you handle tough conversations during due diligence.'
  },
  {
    id: 'someone-else-decides',
    category: 'Identity & Letting Go',
    question: 'I am comfortable with someone else making decisions about how my business operates.',
    whyItMatters: 'After the sale, the new owner will change things. Some changes will feel wrong to you. If you can\'t accept that, a transition period will be miserable.'
  },
  {
    id: 'identity-beyond',
    category: 'Identity & Letting Go',
    question: 'My identity is not primarily defined by being a business owner.',
    whyItMatters: 'If "business owner" is who you ARE rather than what you DO, selling the business can feel like losing yourself. This is the #1 source of seller\'s remorse.'
  },
  {
    id: 'business-will-change',
    category: 'Identity & Letting Go',
    question: 'I have accepted that the business will change under new ownership — and that is okay.',
    whyItMatters: 'PE firms buy businesses to grow them, which means changes. New systems, new people, new priorities. Sellers who can\'t let go often sabotage their own transition period.'
  },
  {
    id: 'handle-negotiations',
    category: 'Emotional Stamina',
    question: 'I can handle 6 to 12 months of intense negotiations without burning out.',
    whyItMatters: 'The deal process is a marathon, not a sprint. Decision fatigue is real — by month 4, many sellers just want it to be over, which leads to bad concessions.'
  },
  {
    id: 'handle-criticism',
    category: 'Emotional Stamina',
    question: 'I am prepared for the buyer to criticize aspects of how I have run the business.',
    whyItMatters: 'Due diligence is essentially a professional critique of everything you\'ve built. QoE adjustments, operational questions, and management assessments can feel deeply personal.'
  },
  {
    id: 'wont-second-guess',
    category: 'Emotional Stamina',
    question: 'I will not second-guess the decision to sell when due diligence gets stressful.',
    whyItMatters: '60-70% of sellers experience remorse during due diligence. It\'s normal, but if you aren\'t prepared for it, that doubt can make you pull out of a good deal.'
  },
  {
    id: 'talked-to-sellers',
    category: 'Preparation & Support',
    question: 'I have talked to other business owners who have sold and understand what the process feels like.',
    whyItMatters: 'Nothing prepares you like hearing from someone who has been through it. Their stories normalize the emotional roller coaster and give you practical coping strategies.'
  },
  {
    id: 'support-system',
    category: 'Preparation & Support',
    question: 'I have a support system — advisor, therapist, mentor, or peer group — I can lean on during the process.',
    whyItMatters: 'You cannot talk to employees about the deal. You often cannot talk to friends. Having a confidential support system prevents isolation during the most stressful period of your career.'
  },
  {
    id: 'selling-by-choice',
    category: 'Preparation & Support',
    question: 'I am selling because I want to, not because I have to.',
    whyItMatters: 'Sellers who are forced to sell (health, burnout, financial pressure) often feel resentful throughout the process. Voluntary sellers negotiate better because they can walk away.'
  }
];

const categories = [
  { name: 'Post-Exit Vision', icon: <Home className="w-5 h-5" />, color: 'text-white', description: 'Do you know what comes next?' },
  { name: 'Family & Relationships', icon: <Users className="w-5 h-5" />, color: 'text-pink-400', description: 'Is your inner circle aligned?' },
  { name: 'Identity & Letting Go', icon: <Brain className="w-5 h-5" />, color: 'text-purple-400', description: 'Can you separate yourself from the business?' },
  { name: 'Emotional Stamina', icon: <Battery className="w-5 h-5" />, color: 'text-orange-400', description: 'Can you handle the grind?' },
  { name: 'Preparation & Support', icon: <Shield className="w-5 h-5" />, color: 'text-green-400', description: 'Do you have the right people around you?' }
];

// ── Emotional Challenges Data ───────────────────────────────────

const emotionalChallenges = [
  {
    title: "Seller's Remorse",
    icon: <Heart className="w-6 h-6" />,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    stat: '60-70%',
    statLabel: 'of sellers experience it',
    description: 'That gut-punch moment during due diligence when you think: "Why am I doing this?" It usually hits when the buyer starts questioning decisions you made, or when you realize someone else will run what you built.',
    triggers: [
      'Seeing your adjusted EBITDA come in lower than expected',
      'The buyer questioning your management team',
      'Imagining your company name on someone else\'s letterhead',
      'A particularly tough week of document requests'
    ],
    advice: 'Remorse is not a signal to stop. It\'s a signal that this is a big decision — which you already knew. Write down your reasons for selling BEFORE the process starts. Read them when doubt creeps in.'
  },
  {
    title: 'Identity Crisis',
    icon: <Brain className="w-6 h-6" />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    stat: '#1',
    statLabel: 'source of post-sale regret',
    description: '"I\'m not selling a business — I\'m selling 20 years of my life." If your self-worth is tied to being "the owner" or "the founder," selling can feel like losing your identity. You built something from nothing. Who are you without it?',
    triggers: [
      'People ask "What do you do?" and you don\'t have an answer',
      'You realize your social circle is mostly business contacts',
      'The daily routine that defined your life is about to disappear',
      'You feel invisible without the title'
    ],
    advice: 'Start building your next identity NOW, before the deal closes. Board seats, mentoring, investing, a new venture — anything that gives you purpose and social connection beyond the business.'
  },
  {
    title: 'Family Dynamics',
    icon: <Users className="w-6 h-6" />,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
    stat: '40%',
    statLabel: 'of deals affected by family issues',
    description: 'The sale isn\'t just your decision — it ripples through your entire family. Spouses who disagree about timing. Children who assumed they would take over. Siblings who work in the business. Parents who built the foundation you\'re selling.',
    triggers: [
      'Spouse says "Are you sure?" for the tenth time',
      'Your son or daughter asks "What about my future here?"',
      'A sibling who works in the company feels blindsided',
      'Extended family has opinions about "the family business"'
    ],
    advice: 'Have the hard conversations early — before you sign an LOI. Family surprises during due diligence can kill deals. A family meeting with your attorney or financial advisor as moderator can help.'
  },
  {
    title: 'Decision Fatigue',
    icon: <Battery className="w-6 h-6" />,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    stat: '6-12',
    statLabel: 'months of constant decisions',
    description: 'The deal process is relentless. Hundreds of document requests. Weekly calls with lawyers, accountants, and bankers. Negotiations on every detail. You\'re still running the business full-time while simultaneously selling it. By month 4, you just want it to be over.',
    triggers: [
      'The 200th follow-up question from the QoE team',
      'Running the business while simultaneously selling it',
      'Negotiating purchase price AND working capital AND escrow AND reps',
      'Making the biggest financial decision of your life while exhausted'
    ],
    advice: 'Build a deal team you trust — attorney, CPA, financial advisor, and ideally an investment banker. Delegate everything you can. Schedule regular breaks. The worst decisions happen when you\'re exhausted.'
  },
  {
    title: 'The Monday Morning Problem',
    icon: <Coffee className="w-6 h-6" />,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    stat: '85%',
    statLabel: 'of sellers unprepared for it',
    description: 'The deal closes. The money wires. And then it\'s Monday morning. Your phone isn\'t ringing. Nobody needs you. The business that consumed every waking hour is no longer yours. Now what? This catches more sellers off guard than any financial surprise.',
    triggers: [
      'First Monday with nothing on the calendar',
      'Checking your phone out of habit and seeing no urgent messages',
      'Driving past the office and seeing someone else in your parking spot',
      'Realizing your purpose just left with the business'
    ],
    advice: 'Plan your first 100 days post-close just like PE plans their first 100 days with your company. Travel, start that project, join a board, volunteer. The plan doesn\'t have to be permanent — it just has to exist.'
  },
  {
    title: 'Pause vs. Push Through',
    icon: <Pause className="w-6 h-6" />,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    stat: 'Critical',
    statLabel: 'judgment call',
    description: 'Not every doubt is seller\'s remorse. Sometimes the deal is actually wrong. Knowing the difference between normal anxiety and genuine red flags is one of the most important skills in the entire process.',
    triggers: [],
    advice: ''
  }
];

const pauseSignals = [
  'The buyer is fundamentally changing the deal terms after LOI',
  'Your attorney or advisor says "I\'ve never seen terms this aggressive"',
  'The buyer is pressuring you to skip steps or rush the timeline',
  'You discover the buyer has a reputation for post-close lawsuits',
  'The purchase price has dropped more than 20% from the LOI'
];

const pushThroughSignals = [
  'You feel anxious but your reasons for selling haven\'t changed',
  'The deal terms are fair but the process is exhausting',
  'You\'re scared of the unknown but excited about what\'s next',
  'Your advisors confirm the deal is solid — you\'re just nervous',
  'The doubt comes in waves but passes when you think rationally'
];

// ── Deal Emotional Timeline ─────────────────────────────────────

const emotionalTimeline = [
  {
    stage: 'Preparation',
    duration: '2-4 months',
    emotion: 'Excitement & Anxiety',
    emoji: 'text-green-400',
    description: 'You\'ve decided to explore selling. Optimism is high. You\'re imagining the number. Anxiety is manageable because it still feels theoretical.',
    tip: 'This is when you should write down your reasons for selling. You\'ll need them later.'
  },
  {
    stage: 'Marketing & IOIs',
    duration: '2-3 months',
    emotion: 'Validation & Ego',
    emoji: 'text-white',
    description: 'Buyers are interested. You\'re getting indications of interest with big numbers attached. It feels like the market is validating everything you\'ve built.',
    tip: 'Don\'t fall in love with the highest bid. Terms matter as much as price.'
  },
  {
    stage: 'LOI & Negotiation',
    duration: '2-4 weeks',
    emotion: 'Stress & Second-Guessing',
    emoji: 'text-yellow-400',
    description: 'Now it\'s real. You\'re negotiating actual terms. The number on paper starts to feel life-changing. First waves of "Am I making the right choice?" hit here.',
    tip: 'Lean on your advisor. This is what you\'re paying them for.'
  },
  {
    stage: 'Due Diligence',
    duration: '2-3 months',
    emotion: 'Exhaustion & Remorse',
    emoji: 'text-red-400',
    description: 'The hardest part. Hundreds of document requests. Your business is under a microscope. Every imperfect decision you made is being examined. Seller\'s remorse peaks here.',
    tip: 'This is the valley. Almost everyone feels it. Keep your support system close.'
  },
  {
    stage: 'Final Negotiations',
    duration: '2-4 weeks',
    emotion: 'Frustration & Fatigue',
    emoji: 'text-orange-400',
    description: 'Working capital fights. Rep negotiations. Purchase price adjustments. You\'re exhausted and just want it to be over — which is exactly when you\'re most likely to make bad concessions.',
    tip: 'Never negotiate when you\'re tired. Let your attorney handle the back-and-forth.'
  },
  {
    stage: 'Closing',
    duration: '1-2 weeks',
    emotion: 'Relief & Grief',
    emoji: 'text-purple-400',
    description: 'The wire hits. It\'s done. You feel relief, pride, sadness, and emptiness — sometimes all in the same hour. This is completely normal.',
    tip: 'Celebrate. Then give yourself permission to feel whatever comes.'
  }
];

// ── Main Component ──────────────────────────────────────────────

const STORAGE_KEY = 'emotional-readiness-v1';

type Tab = 'journey' | 'challenges' | 'assessment' | 'report';

export function EmotionalReadiness() {
  const [activeTab, setActiveTab] = useState<Tab>('journey');
  const [answers, setAnswers] = useState<AssessmentAnswers>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).answers || {}; } catch { return {}; }
    }
    return {};
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [assessmentStarted, setAssessmentStarted] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved).assessmentStarted || false; } catch { return false; }
    }
    return false;
  });
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, assessmentStarted }));
  }, [answers, assessmentStarted]);

  const answeredCount = Object.values(answers).filter(a => a !== null && a !== undefined).length;
  const assessmentComplete = answeredCount === assessmentQuestions.length;

  // ── Scoring ──────────────────────────────────────────────────

  const getCategoryScore = (categoryName: string) => {
    const qs = assessmentQuestions.filter(q => q.category === categoryName);
    const answered = qs.filter(q => answers[q.id] !== null && answers[q.id] !== undefined);
    if (answered.length === 0) return 0;
    const total = answered.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    return Math.round((total / (answered.length * 5)) * 100);
  };

  const getOverallScore = () => {
    const answered = assessmentQuestions.filter(q => answers[q.id] !== null && answers[q.id] !== undefined);
    if (answered.length === 0) return 0;
    const total = answered.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    return Math.round((total / (answered.length * 5)) * 100);
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: 'Ready', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' };
    if (score >= 60) return { label: 'Almost Ready', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
    if (score >= 40) return { label: 'Needs Work', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
    return { label: 'Not Ready Yet', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
  };

  const getScoreAdvice = (score: number) => {
    if (score >= 80) return 'You are emotionally prepared for this process. You have a clear vision for life after the exit, your family is aligned, and you have the stamina and support system to get through the tough months ahead. Stay anchored to your reasons for selling when doubt shows up — it will, and that is normal.';
    if (score >= 60) return 'You are close to ready, but there are areas that need attention before you start the process. Unresolved items in the yellow or red categories below could become problems during due diligence — the most emotionally intense phase. Address these now while you have time and clarity.';
    if (score >= 40) return 'You have significant preparation to do before you are emotionally ready to sell. This is not a criticism — it is a protection. Sellers who enter the process unprepared often make costly concessions out of exhaustion, or pull out of good deals because of unresolved doubts. Use the action items below to get ready.';
    return 'You are not emotionally ready to sell right now — and that is valuable information. Entering the deal process in this state puts you at risk of deal fatigue, family conflict, and seller\'s remorse that could cost you millions in bad negotiation decisions. Take 3-6 months to work through the items below, then reassess.';
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const resetAssessment = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setAssessmentStarted(false);
  };

  // ── Category Action Items ────────────────────────────────────

  const getCategoryActions = (categoryName: string, score: number): string[] => {
    if (score >= 80) return [];

    const actions: Record<string, string[]> = {
      'Post-Exit Vision': [
        'Write a detailed description of your ideal Tuesday one year from now',
        'Start one new activity or project outside the business this month',
        'Meet with a financial planner to model post-exit scenarios at different sale prices',
        'Create a "first 100 days post-close" plan — travel, projects, relationships'
      ],
      'Family & Relationships': [
        'Schedule a dedicated family conversation about the sale — not over dinner, not casually',
        'If your spouse has concerns, listen without defending. Their fears are valid.',
        'Draft an employee communication plan — who hears first, what you say, when',
        'Consider involving a family business advisor or mediator if there are disagreements'
      ],
      'Identity & Letting Go': [
        'Write down 10 things that define you that have nothing to do with your business',
        'Practice saying "I used to own a business. Now I..." — fill in the blank',
        'Join a peer group of former business owners (YPO, EO alumni, or local equivalents)',
        'Start the mental handoff now: delegate one decision per week that you would normally make'
      ],
      'Emotional Stamina': [
        'Talk to 2-3 owners who have sold. Ask them about the emotional toll, not just the money.',
        'Build your deal team NOW — attorney, CPA, advisor. You need people to absorb the stress.',
        'Block personal time in your calendar during the process. Protect weekends.',
        'Read your reasons-for-selling list whenever doubt creeps in'
      ],
      'Preparation & Support': [
        'Find a confidential sounding board — therapist, executive coach, or trusted mentor',
        'Join an owner peer group if you are not already in one',
        'Write your "reasons for selling" document. Be specific and honest.',
        'If you are selling under pressure, consult your advisor about timing options'
      ]
    };

    return actions[categoryName] || [];
  };

  // ── CSV Export ──────────────────────────────────────────────

  const exportCSV = () => {
    const overall = getOverallScore();
    const scoreInfo = getScoreLabel(overall);

    const lines = [
      'Emotional Readiness Report — PE Ready Plus',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      `Overall Score: ${overall}% — ${scoreInfo.label}`,
      '',
      'Category Scores',
      'Category,Score,Assessment',
      ...categories.map(cat => {
        const score = getCategoryScore(cat.name);
        const info = getScoreLabel(score);
        return `"${cat.name}",${score}%,"${info.label}"`;
      }),
      '',
      'Individual Responses',
      'Category,Question,Score (1-5),Why It Matters',
      ...assessmentQuestions.map(q => {
        const score = answers[q.id];
        return `"${q.category}","${q.question}",${score !== null && score !== undefined ? score : 'Not answered'},"${q.whyItMatters}"`;
      }),
      '',
      'Action Items',
      ...categories.flatMap(cat => {
        const score = getCategoryScore(cat.name);
        const actions = getCategoryActions(cat.name, score);
        if (actions.length === 0) return [`"${cat.name}",No action items needed`];
        return actions.map(a => `"${cat.name}","${a}"`);
      }),
      '',
      'Overall Assessment',
      `"${getScoreAdvice(overall)}"`
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotional-readiness-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Tab Navigation ────────────────────────────────────────

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'journey', label: 'The Emotional Journey', icon: <Heart className="w-4 h-4" /> },
    { id: 'challenges', label: 'What You\'ll Face', icon: <Brain className="w-4 h-4" /> },
    { id: 'assessment', label: 'Readiness Assessment', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'report', label: 'Your Report', icon: <FileText className="w-4 h-4" /> }
  ];

  const scaleLabels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-white/10 text-white border-b-2 border-purple-400'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.id === 'report' && assessmentComplete && (
              <span className="ml-1 w-2 h-2 rounded-full bg-green-400" />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab 1: The Emotional Journey ──────────────────────── */}
      {activeTab === 'journey' && (
        <div className="space-y-6">
          {/* Hero Card */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Nobody Talks About This Part</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-4">
                Every M&A guide covers the financials — EBITDA, multiples, tax structure. But the #1 reason deals fall apart
                has nothing to do with numbers. <strong className="text-white">It's the emotional toll on the seller.</strong>
              </p>
              <p className="text-white/70 leading-relaxed mb-4">
                Selling your business is one of the most significant decisions you will ever make. It affects your identity,
                your family, your daily routine, and your sense of purpose. Sellers who prepare emotionally come out of the
                process with fewer regrets, better deal terms, and a smoother transition. Sellers who don't prepare often
                make costly mistakes under stress — or walk away from good deals.
              </p>
              <div className="bg-white/5 rounded-lg p-4 border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                  <p className="text-yellow-200/80 text-sm">
                    <strong className="text-yellow-300">This module is not therapy.</strong> It's preparation.
                    Just like you prepare your financials for a QoE, you need to prepare yourself for the emotional
                    reality of the deal process. What follows is what actually happens — based on thousands of deals.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-5 text-center">
                <div className="text-3xl font-bold text-red-400 mb-1">60-70%</div>
                <p className="text-white/60 text-sm">of sellers experience remorse during the process</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-5 text-center">
                <div className="text-3xl font-bold text-orange-400 mb-1">50%</div>
                <p className="text-white/60 text-sm">of deals that fall apart cite non-financial reasons</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-5 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-1">75%</div>
                <p className="text-white/60 text-sm">of sellers wish they had prepared emotionally first</p>
              </CardContent>
            </Card>
          </div>

          {/* Emotional Timeline */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                The Emotional Timeline of a Deal
              </CardTitle>
              <p className="text-white/50 text-sm">What you'll feel at each stage — so nothing catches you off guard</p>
            </CardHeader>
            <CardContent className="space-y-0">
              {emotionalTimeline.map((stage, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full bg-white/5 border border-white/20 flex items-center justify-center ${stage.emoji} text-sm font-bold shrink-0`}>
                      {i + 1}
                    </div>
                    {i < emotionalTimeline.length - 1 && (
                      <div className="w-px h-full bg-white/10 min-h-[40px]" />
                    )}
                  </div>
                  <div className="pb-6 flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h4 className="text-white font-semibold">{stage.stage}</h4>
                      <Badge className="bg-white/10 text-white/60 border-white/20 text-xs">{stage.duration}</Badge>
                      <Badge className={`${stage.emoji} bg-white/5 border-white/10 text-xs`}>{stage.emotion}</Badge>
                    </div>
                    <p className="text-white/60 text-sm mb-2">{stage.description}</p>
                    <div className="flex items-start gap-2 bg-white/5 rounded-lg p-3 border border-white/10">
                      <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                      <p className="text-white/70 text-xs">{stage.tip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Key Insight */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">The Insight That Changes Everything</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Emotional preparation isn't about being "soft." It's about being strategic. A seller who panics during due diligence
                    makes bad concessions. A seller who hasn't aligned their family pulls out of a $20M deal because of a dinner argument.
                    A seller who hasn't planned their post-exit life negotiates from fear instead of strength. The sellers who get the best
                    outcomes aren't the ones who feel nothing — they're the ones who expected what they'd feel and planned for it.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={() => setActiveTab('challenges')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              What You'll Face <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 2: What You'll Face ───────────────────────────── */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">The Six Emotional Challenges Every Seller Faces</h2>
              <p className="text-white/70 text-sm leading-relaxed">
                These aren't possibilities — they're certainties. Every seller who has gone through a deal recognizes these.
                Understanding them in advance is the difference between being caught off guard and being prepared.
              </p>
            </CardContent>
          </Card>

          {emotionalChallenges.map((challenge, i) => (
            <Card key={i} className={`${challenge.bgColor} ${challenge.borderColor} border cursor-pointer transition-all hover:border-white/20`}
              onClick={() => setExpandedChallenge(expandedChallenge === challenge.title ? null : challenge.title)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`${challenge.color} mt-1 shrink-0`}>{challenge.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-white font-bold text-lg">{challenge.title}</h3>
                      <Badge className="bg-white/10 text-white/70 border-white/20 text-xs">
                        {challenge.stat} {challenge.statLabel}
                      </Badge>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed mb-3">{challenge.description}</p>

                    {(expandedChallenge === challenge.title || challenge.title === 'Pause vs. Push Through') && (
                      <div className="space-y-3 mt-4">
                        {challenge.triggers.length > 0 && (
                          <div>
                            <h4 className="text-white/80 text-sm font-semibold mb-2">Common triggers:</h4>
                            <ul className="space-y-1">
                              {challenge.triggers.map((trigger, j) => (
                                <li key={j} className="text-white/60 text-sm flex items-start gap-2">
                                  <span className={`${challenge.color} mt-1`}>&#8226;</span>
                                  {trigger}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {challenge.advice && (
                          <div className="bg-white/[0.03] rounded-lg p-4 border border-white/10">
                            <div className="flex items-start gap-2">
                              <Shield className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                              <p className="text-white/70 text-sm"><strong className="text-green-400">How to handle it:</strong> {challenge.advice}</p>
                            </div>
                          </div>
                        )}

                        {/* Special content for Pause vs Push Through */}
                        {challenge.title === 'Pause vs. Push Through' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/20">
                              <div className="flex items-center gap-2 mb-3">
                                <Pause className="w-5 h-5 text-red-400" />
                                <h4 className="text-red-400 font-semibold text-sm">Signals to PAUSE</h4>
                              </div>
                              <ul className="space-y-2">
                                {pauseSignals.map((signal, j) => (
                                  <li key={j} className="text-white/60 text-sm flex items-start gap-2">
                                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                    {signal}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
                              <div className="flex items-center gap-2 mb-3">
                                <Play className="w-5 h-5 text-green-400" />
                                <h4 className="text-green-400 font-semibold text-sm">Signals to PUSH THROUGH</h4>
                              </div>
                              <ul className="space-y-2">
                                {pushThroughSignals.map((signal, j) => (
                                  <li key={j} className="text-white/60 text-sm flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                                    {signal}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {challenge.triggers.length > 0 && expandedChallenge !== challenge.title && (
                      <p className="text-white/40 text-xs mt-2">Click to expand</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between">
            <Button
              onClick={() => setActiveTab('journey')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> The Emotional Journey
            </Button>
            <Button
              onClick={() => setActiveTab('assessment')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Take the Assessment <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Tab 3: Readiness Assessment ───────────────────────── */}
      {activeTab === 'assessment' && (
        <div className="space-y-6">
          {!assessmentStarted ? (
            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
              <CardContent className="p-8 text-center">
                <UserCheck className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">Emotional Readiness Self-Assessment</h2>
                <p className="text-white/70 text-lg max-w-2xl mx-auto mb-6">
                  15 honest questions about whether you are personally, emotionally, and relationally ready to sell your business.
                  This is not a test — there are no wrong answers. The goal is to surface areas that need attention
                  before you enter the deal process.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                  {[
                    { label: '15 Questions', sub: 'across 5 categories' },
                    { label: '1-5 Scale', sub: 'strongly disagree to agree' },
                    { label: 'Personalized', sub: 'category-by-category report' }
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="text-white font-semibold text-sm">{item.label}</div>
                      <div className="text-white/50 text-xs">{item.sub}</div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setAssessmentStarted(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                >
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Question {Math.min(currentQuestion + 1, assessmentQuestions.length)} of {assessmentQuestions.length}</span>
                  <span className="text-white/50">{answeredCount} answered</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(answeredCount / assessmentQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Question */}
              {currentQuestion < assessmentQuestions.length && (
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-8">
                    <Badge className="bg-white/10 text-white/60 border-white/20 text-xs mb-4">
                      {assessmentQuestions[currentQuestion].category}
                    </Badge>
                    <h3 className="text-white text-xl font-semibold mb-4 leading-relaxed">
                      {assessmentQuestions[currentQuestion].question}
                    </h3>

                    {/* Scale Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mb-6">
                      {[1, 2, 3, 4, 5].map(value => (
                        <button
                          key={value}
                          onClick={() => handleAnswer(assessmentQuestions[currentQuestion].id, value)}
                          className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all border ${
                            answers[assessmentQuestions[currentQuestion].id] === value
                              ? 'bg-purple-500/30 border-purple-400 text-white'
                              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className="text-lg font-bold mb-1">{value}</div>
                          <div className="text-xs opacity-80">{scaleLabels[value - 1]}</div>
                        </button>
                      ))}
                    </div>

                    {/* Why It Matters */}
                    <div className="bg-white/[0.03] rounded-lg p-4 border border-white/10">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-white/50 text-xs font-semibold mb-1">Why this matters:</p>
                          <p className="text-white/60 text-sm">{assessmentQuestions[currentQuestion].whyItMatters}</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-6">
                      <Button
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                        disabled={currentQuestion === 0}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                      </Button>
                      <Button
                        onClick={() => {
                          if (currentQuestion < assessmentQuestions.length - 1) {
                            setCurrentQuestion(currentQuestion + 1);
                          } else {
                            setActiveTab('report');
                          }
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {currentQuestion === assessmentQuestions.length - 1 ? 'See Your Report' : 'Next'} <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Question Overview Grid */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-sm">All Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-15 gap-2">
                    {assessmentQuestions.map((q, i) => (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestion(i)}
                        className={`w-9 h-9 rounded-lg text-xs font-medium transition-all border ${
                          i === currentQuestion
                            ? 'bg-purple-500/30 border-purple-400 text-white'
                            : answers[q.id] !== null && answers[q.id] !== undefined
                              ? 'bg-green-500/20 border-green-500/30 text-green-400'
                              : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reset */}
              <div className="flex justify-center">
                <Button
                  onClick={resetAssessment}
                  variant="outline"
                  className="border-white/20 text-white/50 hover:bg-white/10 text-xs"
                >
                  Reset Assessment
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Tab 4: Your Report ────────────────────────────────── */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          {!assessmentComplete ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Complete the Assessment First</h2>
                <p className="text-white/60 mb-6">
                  Answer all 15 questions to generate your personalized Emotional Readiness Report.
                </p>
                <p className="text-white/40 text-sm mb-6">{answeredCount} of {assessmentQuestions.length} questions answered</p>
                <Button
                  onClick={() => setActiveTab('assessment')}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {assessmentStarted ? 'Continue Assessment' : 'Start Assessment'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Overall Score */}
              {(() => {
                const overall = getOverallScore();
                const info = getScoreLabel(overall);
                return (
                  <Card className={`${info.bg} ${info.border} border`}>
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="text-center">
                          <div className={`text-6xl font-bold ${info.color} mb-1`}>{overall}%</div>
                          <Badge className={`${info.bg} ${info.color} ${info.border} border text-sm px-3 py-1`}>
                            {info.label}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-white mb-3">Your Emotional Readiness Score</h2>
                          <p className="text-white/70 text-sm leading-relaxed">{getScoreAdvice(overall)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Category Breakdown */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categories.map(cat => {
                    const score = getCategoryScore(cat.name);
                    const info = getScoreLabel(score);
                    return (
                      <div key={cat.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={cat.color}>{cat.icon}</span>
                            <span className="text-white font-medium text-sm">{cat.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`${info.color} font-bold text-sm`}>{score}%</span>
                            <Badge className={`${info.bg} ${info.color} ${info.border} border text-xs`}>
                              {info.label}
                            </Badge>
                          </div>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-700 ${
                              score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Category Details with Action Items */}
              {categories.map(cat => {
                const score = getCategoryScore(cat.name);
                const info = getScoreLabel(score);
                const actions = getCategoryActions(cat.name, score);
                const catQuestions = assessmentQuestions.filter(q => q.category === cat.name);

                return (
                  <Card key={cat.name} className="bg-white/5 border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2 text-base">
                          <span className={cat.color}>{cat.icon}</span>
                          {cat.name}
                        </CardTitle>
                        <Badge className={`${info.bg} ${info.color} ${info.border} border text-xs`}>
                          {score}% — {info.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Individual question scores */}
                      {catQuestions.map(q => {
                        const val = answers[q.id] || 0;
                        return (
                          <div key={q.id} className="flex items-center gap-3 text-sm">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map(n => (
                                <div
                                  key={n}
                                  className={`w-3 h-3 rounded-full ${
                                    n <= val
                                      ? val >= 4 ? 'bg-green-500' : val >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                                      : 'bg-white/10'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-white/70 flex-1">{q.question}</span>
                          </div>
                        );
                      })}

                      {/* Action Items */}
                      {actions.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <h4 className="text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-purple-400" />
                            Action Items
                          </h4>
                          <ul className="space-y-2">
                            {actions.map((action, i) => (
                              <li key={i} className="text-white/60 text-sm flex items-start gap-2">
                                <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {/* Advisor Discussion Guide */}
              <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    Conversations to Have Before You Start
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { who: 'With your spouse/partner', topic: 'Are we aligned on selling, on timing, and on what life looks like after?' },
                    { who: 'With your financial advisor', topic: 'What does my post-exit financial life look like at different sale prices?' },
                    { who: 'With a peer who has sold', topic: 'What surprised you most about the process? What would you do differently?' },
                    { who: 'With yourself', topic: 'Am I running toward something, or just running away from the business?' },
                    { who: 'With your M&A attorney', topic: 'What is the realistic timeline, and what should I expect during due diligence?' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{item.who}</p>
                        <p className="text-white/60 text-sm">{item.topic}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Export */}
              <div className="flex justify-center gap-3">
                <Button
                  onClick={exportCSV}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report (CSV)
                </Button>
                <Button
                  onClick={resetAssessment}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Retake Assessment
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
