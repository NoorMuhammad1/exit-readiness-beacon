
'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  AlertTriangle, 
  Skull,
  Shield,
  DollarSign,
  Gavel,
  Target,
  Bomb,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface UserTerm {
  id: string;
  whatYouWant: string;
  whatItSays: string;
  isMatch: boolean;
  issue?: string;
}

export const LOIReview: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [userTerms, setUserTerms] = useState<UserTerm[]>([]);
  const [attorneyNotes, setAttorneyNotes] = useState('');

  const sections = [
    { id: 'reality-check', title: 'The Brutal Reality', icon: Skull },
    { id: 'word-comparison', title: 'Word-by-Word Comparison', icon: Eye },
    { id: 'common-traps', title: 'Common Death Traps', icon: Bomb },
    { id: 'critical-terms', title: 'Critical Terms Decoder', icon: Target },
    { id: 'your-checklist', title: 'Your Protection Checklist', icon: Shield },
    { id: 'attorney-prep', title: 'Attorney Battle Plan', icon: Gavel }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          LOI Death Trap Detector
        </h1>
        <p className="text-xl text-zinc-400">
          One Word Can Cost You Everything - Find It Before You Sign
        </p>
      </div>

      {/* Critical Warning */}
      <Alert className="bg-red-950/50 border-red-500">
        <Skull className="h-5 w-5 text-red-500" />
        <AlertDescription className="text-red-300">
          <strong className="text-red-400 text-lg">THE #1 MISTAKE THAT RUINS SELLERS:</strong>
          <br />
          Reading what you WANT to see, not what it ACTUALLY says. One word difference = you're fired in 6 months.
          <br />
          <span className="text-yellow-400 font-bold">SPEND THE MONEY ON ATTORNEYS NOW OR LOSE EVERYTHING LATER.</span>
        </AlertDescription>
      </Alert>

      {currentSection === 0 && <RealityCheck />}
      {currentSection === 1 && <WordComparison userTerms={userTerms} setUserTerms={setUserTerms} />}
      {currentSection === 2 && <CommonTraps />}
      {currentSection === 3 && <CriticalTerms />}
      {currentSection === 4 && <ProtectionChecklist />}
      {currentSection === 5 && <AttorneyPrep attorneyNotes={attorneyNotes} setAttorneyNotes={setAttorneyNotes} />}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          className="border-zinc-700 hover:bg-zinc-800"
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          {sections.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx === currentSection ? 'bg-orange-500' : 'bg-zinc-700'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
          disabled={currentSection === sections.length - 1}
          className="bg-orange-600 hover:bg-orange-700"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

function RealityCheck() {
  return (
    <Card className="p-8 bg-zinc-900 border-zinc-800 space-y-6">
      <div className="text-center space-y-2">
        <Skull className="w-16 h-16 mx-auto text-red-500" />
        <h2 className="text-3xl font-bold text-white">LOIs Are Where CEOs Get Fucked</h2>
        <p className="text-zinc-400">And it's usually their own fault for not reading carefully</p>
      </div>

      <div className="space-y-4">
        <Card className="p-6 bg-red-950/30 border-red-900/50">
          <h3 className="text-xl font-bold text-red-400 mb-3">Your Real-Life Horror Story</h3>
          <div className="space-y-3 text-zinc-300">
            <div className="pl-4 border-l-4 border-red-500">
              <p className="font-semibold">What You Negotiated:</p>
              <p className="text-yellow-400">"I will be CEO and President of the platform Newco"</p>
            </div>
            <div className="pl-4 border-l-4 border-red-500">
              <p className="font-semibold">What They Wrote:</p>
              <p className="text-red-400">"I will be CEO and President of Newco"</p>
            </div>
            <div className="pl-4 border-l-4 border-orange-500">
              <p className="font-semibold">The Difference:</p>
              <p className="text-orange-400">
                <strong>ONE WORD - "platform"</strong><br />
                Without it, you're CEO of just YOUR company (now renamed), not the entire PE platform.
                That's a $2M/year difference and actual power vs. glorified manager.
              </p>
            </div>
          </div>
        </Card>

        <Alert className="bg-yellow-950/50 border-yellow-600">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-300">
            <strong>REMEMBER:</strong> LOIs aren't binding, but they set expectations. 
            If it's not EXACTLY right in the LOI, it won't be in the final docs either.
          </AlertDescription>
        </Alert>

        <Card className="p-6 bg-zinc-800 border-zinc-700">
          <h3 className="text-lg font-bold text-white mb-3">The Ugly Truth About LOIs</h3>
          <div className="space-y-2 text-zinc-300">
            <p>✓ <strong>Not Binding</strong> = They can change everything later</p>
            <p>✓ <strong>Sets Precedent</strong> = Hard to negotiate what's not in LOI</p>
            <p>✓ <strong>Your Leverage Dies</strong> = After signing, you lose negotiating power</p>
            <p>✓ <strong>PE Lawyers Are Pros</strong> = They write 50 LOIs/year, you read one</p>
            <p>✓ <strong>Every Word Matters</strong> = "Platform" vs company, "base" vs total comp</p>
          </div>
        </Card>

        <Alert className="bg-green-950/50 border-green-600">
          <DollarSign className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-300">
            <strong>THE SOLUTION:</strong> Spend $5-10K on attorneys NOW to save millions later. 
            This is NOT where you save money. Get the best M&A lawyer you can afford.
          </AlertDescription>
        </Alert>
      </div>
    </Card>
  );
}

function WordComparison({ userTerms, setUserTerms }: any) {
  const [newTermWant, setNewTermWant] = useState('');
  const [newTermSays, setNewTermSays] = useState('');

  const addComparison = () => {
    if (!newTermWant || !newTermSays) return;
    
    const newTerm: UserTerm = {
      id: Date.now().toString(),
      whatYouWant: newTermWant,
      whatItSays: newTermSays,
      isMatch: newTermWant.toLowerCase() === newTermSays.toLowerCase(),
      issue: newTermWant.toLowerCase() !== newTermSays.toLowerCase() ? 
        'MISMATCH - Review with attorney immediately' : undefined
    };
    
    setUserTerms([...userTerms, newTerm]);
    setNewTermWant('');
    setNewTermSays('');
  };

  const criticalWords = [
    { term: 'Platform Newco', meaning: 'CEO of entire PE portfolio', trap: 'Just "Newco" = CEO of only your company' },
    { term: 'Base salary', meaning: 'Guaranteed money only', trap: '"Salary" could include variable comp' },
    { term: 'For cause', meaning: 'Can only be fired for specific reasons', trap: '"At will" = fired anytime' },
    { term: 'Board approval', meaning: 'Board must approve', trap: '"PE approval" = operating partner decides' },
    { term: 'Equity rollover', meaning: 'Your shares convert', trap: '"Opportunity to invest" = buy new shares' },
    { term: 'Management equity', meaning: 'Free/earned shares', trap: '"Investment opportunity" = you pay' },
    { term: 'Working capital target', meaning: 'Specific number', trap: '"Normalized" = PE decides later' },
    { term: 'Material adverse change', meaning: 'Major issues only', trap: 'Any "adverse change" = any excuse' }
  ];

  return (
    <Card className="p-8 bg-zinc-900 border-zinc-800 space-y-6">
      <div className="text-center space-y-2">
        <Eye className="w-12 h-12 mx-auto text-yellow-500" />
        <h2 className="text-2xl font-bold text-white">Word-by-Word Death Trap Detector</h2>
        <p className="text-zinc-400">Compare what you THINK it says vs. what it ACTUALLY says</p>
      </div>

      {/* Add Comparison Tool */}
      <Card className="p-6 bg-zinc-800 border-zinc-700">
        <h3 className="text-lg font-bold text-white mb-4">Compare Critical Terms</h3>
        <div className="space-y-3">
          <div>
            <Label>What You Want It To Say</Label>
            <Textarea
              placeholder="Example: I will be CEO and President of the platform company"
              value={newTermWant}
              onChange={(e) => setNewTermWant(e.target.value)}
              className="bg-zinc-900 border-zinc-600"
              rows={2}
            />
          </div>
          <div>
            <Label>What The LOI Actually Says</Label>
            <Textarea
              placeholder="Example: I will be CEO and President of the company"
              value={newTermSays}
              onChange={(e) => setNewTermSays(e.target.value)}
              className="bg-zinc-900 border-zinc-600"
              rows={2}
            />
          </div>
          <Button onClick={addComparison} className="w-full bg-yellow-600 hover:bg-yellow-700">
            Compare Terms
          </Button>
        </div>
      </Card>

      {/* Comparisons List */}
      {userTerms.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white">Your Term Comparisons</h3>
          {userTerms.map((term: UserTerm) => (
            <Card key={term.id} className={`p-4 ${
              term.isMatch ? 'bg-green-950/30 border-green-900/50' : 'bg-red-950/30 border-red-900/50'
            }`}>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-xs text-zinc-500">What You Want:</p>
                      <p className="text-green-400">{term.whatYouWant}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">What It Says:</p>
                      <p className={term.isMatch ? 'text-green-400' : 'text-red-400'}>
                        {term.whatItSays}
                      </p>
                    </div>
                  </div>
                  <div>
                    {term.isMatch ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </div>
                {term.issue && (
                  <Alert className="bg-red-950/50 border-red-900/50">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-300">
                      {term.issue}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Critical Words Reference */}
      <Card className="p-6 bg-zinc-800 border-zinc-700">
        <h3 className="text-lg font-bold text-white mb-4">🚨 Critical Word Differences</h3>
        <div className="space-y-3">
          {criticalWords.map((word, idx) => (
            <div key={idx} className="border-l-4 border-yellow-500 pl-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-yellow-400">{word.term}</p>
                  <p className="text-sm text-green-400">✓ Means: {word.meaning}</p>
                  <p className="text-sm text-red-400">✗ Trap: {word.trap}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Card>
  );
}

function CommonTraps() {
  const traps = [
    {
      category: 'Your Role',
      traps: [
        {
          trap: 'CEO of "Newco" vs "Platform Newco"',
          reality: 'Without "Platform", you\'re CEO of just your renamed company, not the rollup',
          cost: '$1-3M lifetime earnings difference'
        },
        {
          trap: '"Senior executive role" vs specific title',
          reality: 'Could be EVP of nothing with no direct reports',
          cost: 'Your entire career trajectory'
        },
        {
          trap: '"Management role" vs C-suite commitment',
          reality: 'You become a middle manager, not executive',
          cost: '50-70% comp reduction'
        }
      ]
    },
    {
      category: 'Employment Terms',
      traps: [
        {
          trap: '"At-will employment" in the fine print',
          reality: 'You can be fired Day 1 post-close for any reason',
          cost: 'Your entire earnout'
        },
        {
          trap: 'No severance terms specified',
          reality: 'Fired with nothing but thanks for playing',
          cost: '1-2 years salary + benefits'
        },
        {
          trap: '"Subject to PE employment policies"',
          reality: 'They can change everything after closing',
          cost: 'All negotiated protections'
        }
      ]
    },
    {
      category: 'Compensation',
      traps: [
        {
          trap: '"Market compensation" vs specific numbers',
          reality: 'PE decides market = 50% pay cut',
          cost: '$200K+/year'
        },
        {
          trap: '"Eligible for bonus" vs guaranteed percentage',
          reality: 'Eligible = $0 if they decide',
          cost: '30-100% of base salary'
        },
        {
          trap: 'Base salary only, bonus "TBD"',
          reality: 'TBD = never determined in your favor',
          cost: '40-60% of total comp'
        }
      ]
    },
    {
      category: 'Equity',
      traps: [
        {
          trap: '"Opportunity to invest" vs rollover equity',
          reality: 'You have to write a check vs converting shares',
          cost: '$500K-2M cash out of pocket'
        },
        {
          trap: '"Management incentive plan" undefined',
          reality: 'Could be 0.1% when you expected 5%',
          cost: 'Millions at exit'
        },
        {
          trap: 'Vesting resets on your rollover',
          reality: 'Your 100% vested shares become 0% vested',
          cost: 'Everything if fired early'
        }
      ]
    },
    {
      category: 'Deal Terms',
      traps: [
        {
          trap: 'Working capital "to be normalized"',
          reality: 'PE normalizes = you pay them $2M at closing',
          cost: '$500K-5M surprise haircut'
        },
        {
          trap: 'Earnout based on "platform performance"',
          reality: 'Platform fails = you get nothing regardless of your performance',
          cost: 'Entire earnout'
        },
        {
          trap: 'Escrow terms longer than 18 months',
          reality: 'Your money locked up for years',
          cost: 'Time value + litigation risk'
        }
      ]
    }
  ];

  return (
    <Card className="p-8 bg-zinc-900 border-zinc-800 space-y-6">
      <div className="text-center space-y-2">
        <Bomb className="w-12 h-12 mx-auto text-red-500" />
        <h2 className="text-2xl font-bold text-white">The Death Traps That Kill Sellers</h2>
        <p className="text-zinc-400">Real traps that have fucked real founders</p>
      </div>

      <Alert className="bg-orange-950/50 border-orange-600">
        <AlertCircle className="h-4 w-4 text-orange-500" />
        <AlertDescription className="text-orange-300">
          <strong>PATTERN RECOGNITION:</strong> PE firms use the same traps over and over because they work. 
          Sellers don't share notes, so each one falls for the same shit.
        </AlertDescription>
      </Alert>

      {traps.map((category, idx) => (
        <Card key={idx} className="p-6 bg-zinc-800 border-zinc-700">
          <h3 className="text-xl font-bold text-orange-400 mb-4">{category.category}</h3>
          <div className="space-y-4">
            {category.traps.map((trap, tidx) => (
              <div key={tidx} className="border-l-4 border-red-500 pl-4 space-y-1">
                <p className="font-semibold text-red-400">⚠️ {trap.trap}</p>
                <p className="text-zinc-300">Reality: {trap.reality}</p>
                <p className="text-yellow-400 font-bold">Cost: {trap.cost}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Card className="p-6 bg-green-950/30 border-green-900/50">
        <h3 className="text-lg font-bold text-green-400 mb-3">How to Protect Yourself</h3>
        <div className="space-y-2 text-zinc-300">
          <p>1. <strong>Specific &gt; Vague:</strong> Numbers, titles, and dates in writing</p>
          <p>2. <strong>Define Everything:</strong> "Market", "normal", "reasonable" = PE decides</p>
          <p>3. <strong>Get it in LOI:</strong> If it's not there, it won't be in final docs</p>
          <p>4. <strong>Use YOUR lawyer:</strong> Not the "efficient" lawyer PE recommends</p>
          <p>5. <strong>Compare versions:</strong> Track every single change word-by-word</p>
        </div>
      </Card>
    </Card>
  );
}

function CriticalTerms() {
  const terms = [
    {
      term: 'Purchase Price',
      lookFor: ['Base purchase price NUMBER', 'Earnout structure', 'Escrow amounts', 'Working capital adjustments'],
      redFlags: ['Subject to adjustment', 'To be determined', 'Normalized working capital', 'Platform-based earnout'],
      negotiate: 'Get specific numbers, caps on adjustments, and individual performance earnouts'
    },
    {
      term: 'Your Role Post-Close',
      lookFor: ['Exact title with "Platform" or "Portfolio"', 'Reporting structure', 'Duration commitment', 'Severance terms'],
      redFlags: ['At-will employment', 'Subject to change', 'Management role TBD', 'No severance specified'],
      negotiate: 'Named position, 2-3 year guarantee, severance = accelerated vesting + 12 months pay'
    },
    {
      term: 'Compensation Package',
      lookFor: ['Base salary NUMBER', 'Bonus percentage', 'Benefits specified', 'Annual increases'],
      redFlags: ['Market compensation', 'Eligible for bonus', 'Per company policy', 'Subject to review'],
      negotiate: 'Specific numbers for everything, guaranteed minimums, no reduction clauses'
    },
    {
      term: 'Equity & Vesting',
      lookFor: ['Rollover percentage', 'New equity grant', 'Vesting schedule', 'Acceleration triggers'],
      redFlags: ['Opportunity to invest', 'Vesting resets', 'Subject to plan', 'Good leaver/bad leaver'],
      negotiate: 'Credit for time served, double-trigger acceleration, tag-along rights'
    },
    {
      term: 'Reps & Warranties',
      lookFor: ['Knowledge qualifiers', 'Materiality thresholds', 'Survival periods', 'Cap on liability'],
      redFlags: ['Fundamental reps uncapped', 'No knowledge qualifiers', '3+ year survival', 'Joint and several liability'],
      negotiate: 'Knowledge qualifiers everything possible, 10-20% cap, 12-18 month survival'
    },
    {
      term: 'Conditions to Close',
      lookFor: ['Specific, measurable conditions', 'No financing condition', 'MAC definition', 'Drop-dead date'],
      redFlags: ['Subject to PE approval', 'Satisfactory due diligence', 'No specified timeline', 'Broad MAC clause'],
      negotiate: 'Narrow, specific conditions, hell-or-high-water closing, tight timeline'
    }
  ];

  return (
    <Card className="p-8 bg-zinc-900 border-zinc-800 space-y-6">
      <div className="text-center space-y-2">
        <Target className="w-12 h-12 mx-auto text-white" />
        <h2 className="text-2xl font-bold text-white">Critical Terms Decoder</h2>
        <p className="text-zinc-400">What to look for, red flags, and negotiation ammunition</p>
      </div>

      {terms.map((item, idx) => (
        <Card key={idx} className="p-6 bg-zinc-800 border-zinc-700">
          <h3 className="text-xl font-bold text-white mb-4">{item.term}</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-green-400 mb-2">✓ Must Have:</h4>
              <div className="space-y-1">
                {item.lookFor.map((point, pidx) => (
                  <p key={pidx} className="text-zinc-300 text-sm pl-4">• {point}</p>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-red-400 mb-2">🚩 Red Flags:</h4>
              <div className="space-y-1">
                {item.redFlags.map((flag, fidx) => (
                  <p key={fidx} className="text-zinc-300 text-sm pl-4">• {flag}</p>
                ))}
              </div>
            </div>

            <div className="bg-blue-950/30 p-3 rounded border border-blue-900/50">
              <h4 className="text-sm font-semibold text-white mb-1">💪 How to Negotiate:</h4>
              <p className="text-zinc-300 text-sm">{item.negotiate}</p>
            </div>
          </div>
        </Card>
      ))}
    </Card>
  );
}

function ProtectionChecklist() {
  const protections = [
    { item: 'Hired M&A attorney (not general counsel)', critical: true },
    { item: 'Exact title WITH "Platform" or "Portfolio" specified', critical: true },
    { item: 'Base salary as specific NUMBER, not "market"', critical: true },
    { item: 'Bonus as percentage, not "eligible" or "discretionary"', critical: true },
    { item: 'Employment period specified (2-3 years typical)', critical: true },
    { item: 'Severance terms defined (without cause = 12+ months)', critical: true },
    { item: 'Rollover equity percentage locked', critical: true },
    { item: 'Vesting credit for time already served', critical: true },
    { item: 'Working capital target as specific number', critical: true },
    { item: 'Earnout based on YOUR performance, not platform', critical: true },
    { item: 'Change of control provisions for double-trigger', critical: false },
    { item: 'Non-compete limited to 12-18 months and geographic', critical: false },
    { item: 'Indemnification cap at 10-20% of purchase price', critical: false },
    { item: 'Knowledge qualifiers on all possible reps', critical: false },
    { item: 'Escrow limited to 12-18 months', critical: false },
    { item: 'No personal guarantees on anything', critical: true },
    { item: 'Legal fees paid by buyer at closing', critical: false },
    { item: 'Side letter for special arrangements signed', critical: false }
  ];

  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    if (checkedItems.includes(item)) {
      setCheckedItems(checkedItems.filter(i => i !== item));
    } else {
      setCheckedItems([...checkedItems, item]);
    }
  };

  const criticalMissing = protections
    .filter(p => p.critical && !checkedItems.includes(p.item))
    .length;

  return (
    <Card className="p-8 bg-zinc-900 border-zinc-800 space-y-6">
      <div className="text-center space-y-2">
        <Shield className="w-12 h-12 mx-auto text-green-500" />
        <h2 className="text-2xl font-bold text-white">Your Protection Checklist</h2>
        <p className="text-zinc-400">Check off what's actually in your LOI</p>
      </div>

      {criticalMissing > 0 && (
        <Alert className="bg-red-950/50 border-red-500">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-300">
            <strong>WARNING:</strong> You're missing {criticalMissing} CRITICAL protections. 
            Do NOT sign until these are addressed.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        {protections.map((protection, idx) => (
          <div 
            key={idx}
            className={`flex items-center justify-between p-3 rounded cursor-pointer transition-all ${
              checkedItems.includes(protection.item) 
                ? 'bg-green-950/30 border border-green-900/50' 
                : protection.critical
                  ? 'bg-red-950/20 border border-red-900/30'
                  : 'bg-zinc-800 border border-zinc-700'
            }`}
            onClick={() => toggleItem(protection.item)}
          >
            <div className="flex items-center gap-3">
              {checkedItems.includes(protection.item) ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className={`w-5 h-5 ${protection.critical ? 'text-red-500' : 'text-zinc-500'}`} />
              )}
              <span className={`${
                checkedItems.includes(protection.item) ? 'text-green-400' : 'text-zinc-300'
              }`}>
                {protection.item}
              </span>
            </div>
            {protection.critical && (
              <Badge className="bg-red-900/50 text-red-400 border-red-700">
                CRITICAL
              </Badge>
            )}
          </div>
        ))}
      </div>

      <Card className="p-6 bg-green-950/30 border-green-900/50">
        <h3 className="text-lg font-bold text-green-400 mb-3">Your Protection Score</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-zinc-300">Total Protections:</span>
            <span className="text-xl font-bold text-white">
              {checkedItems.length} / {protections.length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-300">Critical Protections:</span>
            <span className={`text-xl font-bold ${
              criticalMissing === 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {protections.filter(p => p.critical && checkedItems.includes(p.item)).length} / 
              {protections.filter(p => p.critical).length}
            </span>
          </div>
        </div>
        {criticalMissing === 0 && checkedItems.length === protections.length && (
          <Alert className="mt-4 bg-green-900/50 border-green-700">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-300">
              Excellent! You have all critical protections in place.
            </AlertDescription>
          </Alert>
        )}
      </Card>
    </Card>
  );
}

function AttorneyPrep({ attorneyNotes, setAttorneyNotes }: any) {
  const questions = [
    'Can we add "Platform" to my CEO title to ensure portfolio-wide authority?',
    'What happens to my equity if I\'m terminated without cause?',
    'Can we get specific numbers instead of "market compensation"?',
    'How do we ensure earnout is based on my division, not platform performance?',
    'What\'s our walk-away point if they won\'t agree to critical terms?',
    'Can we get a side letter for verbal agreements made?',
    'How do we limit personal liability on reps and warranties?',
    'What\'s market for severance in similar deals?',
    'Can we accelerate vesting on change of control?',
    'How do we protect against working capital adjustments?'
  ];

  return (
    <Card className="p-8 bg-zinc-900 border-zinc-800 space-y-6">
      <div className="text-center space-y-2">
        <Gavel className="w-12 h-12 mx-auto text-purple-500" />
        <h2 className="text-2xl font-bold text-white">Attorney Battle Plan</h2>
        <p className="text-zinc-400">What to demand from your lawyer (who you're paying $1000/hour)</p>
      </div>

      <Alert className="bg-purple-950/50 border-purple-600">
        <DollarSign className="h-4 w-4 text-purple-500" />
        <AlertDescription className="text-purple-300">
          <strong>REMEMBER:</strong> Your attorney works for YOU. If they say "that's market" or 
          "PE won't agree to that", fire them and get one with balls. This is YOUR exit, not theirs.
        </AlertDescription>
      </Alert>

      <Card className="p-6 bg-zinc-800 border-zinc-700">
        <h3 className="text-lg font-bold text-white mb-4">Questions Your Attorney Must Answer</h3>
        <div className="space-y-2">
          {questions.map((q, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">{idx + 1}.</span>
              <p className="text-zinc-300">{q}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-zinc-800 border-zinc-700">
        <h3 className="text-lg font-bold text-white mb-4">Your Battle Notes</h3>
        <Textarea
          placeholder="Document every change they make, every pushback, every 'market' excuse. This is your evidence trail..."
          value={attorneyNotes}
          onChange={(e) => setAttorneyNotes(e.target.value)}
          className="bg-zinc-900 border-zinc-600 min-h-[200px]"
        />
        <p className="text-xs text-zinc-500 mt-2">
          Keep notes on: What you asked for vs what they offered, Their reasoning for changes, 
          Red flags your attorney missed, Verbal promises not in writing
        </p>
      </Card>

      <Card className="p-6 bg-red-950/30 border-red-900/50">
        <h3 className="text-lg font-bold text-red-400 mb-4">The Nuclear Options</h3>
        <div className="space-y-3 text-zinc-300">
          <div className="border-l-4 border-red-500 pl-4">
            <p className="font-semibold text-red-400">If they won't specify your role:</p>
            <p>"I need written confirmation of my position or we walk."</p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <p className="font-semibold text-red-400">If they won't guarantee severance:</p>
            <p>"No protection = no deal. Find another sucker."</p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <p className="font-semibold text-red-400">If working capital is "TBD":</p>
            <p>"Set the number now or the deal is dead."</p>
          </div>
        </div>
      </Card>

      <Alert className="bg-green-950/50 border-green-600">
        <Shield className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-300">
          <strong>FINAL TRUTH:</strong> You have leverage ONLY until you sign the LOI. After that, 
          you're in exclusivity and they know you're committed. Get EVERYTHING important in the LOI 
          or kiss it goodbye forever.
        </AlertDescription>
        </Alert>
    </Card>
  );
}

export default LOIReview;
