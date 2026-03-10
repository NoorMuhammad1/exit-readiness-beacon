
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChevronRight, ChevronLeft, AlertTriangle, Shield, Target, Clock, Users, CheckCircle, DollarSign } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { getNextModulePath } from '@/config/moduleConfig';

interface ExecutiveScore {
  name: string;
  role: string;
  compensation: number;
  numbersObsession: number;
  coachability: number;
  clockSpeed: number;
  executionFocus: number;
  complexityShield: number;
  replaceability: number;
  compensationScore: number;
  overallScore?: number;
  verdict?: 'keeper' | 'coach' | 'replace';
}

export const ManagementScorecard: React.FC = () => {
  const navigate = useNavigate();
  const { markModuleComplete } = useProgress();
  const [currentPage, setCurrentPage] = useState(0);
  const [executives, setExecutives] = useState<ExecutiveScore[]>([]);
  const [currentExec, setCurrentExec] = useState<ExecutiveScore>({
    name: '',
    role: '',
    compensation: 0,
    numbersObsession: 0,
    coachability: 0,
    clockSpeed: 0,
    executionFocus: 0,
    complexityShield: 0,
    replaceability: 0,
    compensationScore: 0
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('management-scorecard');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setExecutives(data.executives || []);
        setCurrentPage(data.currentPage || 0);
      } catch (error) {
        console.error('Error loading saved scorecard data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    const data = {
      executives,
      currentPage
    };
    localStorage.setItem('management-scorecard', JSON.stringify(data));
  }, [executives, currentPage]);
  
  const pages = [
    {
      title: "The Brutal Truth About PE & Your Team",
      content: <IntroPage />
    },
    {
      title: "Add Your Leadership Team",
      content: <AddExecutivePage 
        currentExec={currentExec}
        setCurrentExec={setCurrentExec}
        executives={executives}
        setExecutives={setExecutives}
      />
    },
    {
      title: "Score Each Executive",
      content: <ScoringPage 
        executives={executives}
        setExecutives={setExecutives}
      />
    },
    {
      title: "Your Team's Survival Report",
      content: <ReportPage 
        executives={executives} 
        onComplete={async () => {
          await markModuleComplete('Management Scorecard', 3);
          const nextPath = getNextModulePath('Management Scorecard');
          if (nextPath) {
            navigate(nextPath);
          }
        }}
      />
    }
  ];
  
  return (
    <div>
      <div className="mb-8">
        <Progress value={(currentPage + 1) / pages.length * 100} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Step {currentPage + 1} of {pages.length}</span>
          <span>{pages[currentPage].title}</span>
        </div>
      </div>
      
      <Card className="p-8 min-h-[600px]">
        {pages[currentPage].content}
      </Card>
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
          disabled={currentPage === pages.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const IntroPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-foreground">
      40% of Your Team Won't Survive PE Ownership
    </h2>
    
    <Card className="bg-red-500/10 border-red-500/30 p-6">
      <p className="text-red-600 dark:text-red-400 font-semibold mb-2">The Reality:</p>
      <p className="text-foreground">
        PE firms replace 40% of leadership within 18 months. Another 20% leave voluntarily 
        because they can't handle the pace. Let's figure out who makes it before PE does.
      </p>
    </Card>
    
    <div className="grid grid-cols-2 gap-6">
      <Card className="p-6 bg-muted">
        <Users className="w-8 h-8 text-green-500 mb-3" />
        <h3 className="text-xl font-semibold mb-3">Who Survives</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Numbers-obsessed operators</li>
          <li>• Ego-free executors</li>
          <li>• 24/7 availability mindset</li>
          <li>• Zero-drama professionals</li>
          <li>• Reasonably compensated (not overpaid)</li>
          <li>• Complex role holders (harder to replace)</li>
        </ul>
      </Card>
      
      <Card className="p-6 bg-muted">
        <AlertTriangle className="w-8 h-8 text-red-500 mb-3" />
        <h3 className="text-xl font-semibold mb-3">Who Gets Cut</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• "We've always done it this way" people</li>
          <li>• Can't quote their numbers</li>
          <li>• Corporate politicians</li>
          <li>• 9-to-5 mentality</li>
          <li>• Massively overpaid vs. market</li>
          <li>• Sacred cows (family, friends)</li>
        </ul>
      </Card>
    </div>
    
    <Alert className="border-yellow-500/30 bg-yellow-500/10">
      <Shield className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-foreground">
        <strong>The Complexity Shield:</strong> If your business is hard to understand (like insurance 
        adjusting, specialized healthcare, complex manufacturing), PE may leave your team alone longer. 
        Simple businesses get gutted immediately.
      </AlertDescription>
    </Alert>
    
    <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
      <h3 className="text-xl font-semibold mb-3">The Three Verdicts</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <div>
            <span className="font-semibold">Keeper:</span> Will thrive under PE. Protect them at all costs.
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <div>
            <span className="font-semibold">Coach:</span> Can survive with immediate improvement. Start now.
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <div>
            <span className="font-semibold">Replace:</span> Start recruiting their replacement before the sale.
          </div>
        </div>
      </div>
    </Card>
  </div>
);

const AddExecutivePage: React.FC<{
  currentExec: ExecutiveScore;
  setCurrentExec: (exec: ExecutiveScore) => void;
  executives: ExecutiveScore[];
  setExecutives: (execs: ExecutiveScore[]) => void;
}> = ({ currentExec, setCurrentExec, executives, setExecutives }) => {
  
  const addExecutive = () => {
    if (currentExec.name.trim() && currentExec.role.trim()) {
      setExecutives([...executives, { ...currentExec }]);
      setCurrentExec({
        name: '',
        role: '',
        compensation: 0,
        numbersObsession: 0,
        coachability: 0,
        clockSpeed: 0,
        executionFocus: 0,
        complexityShield: 0,
        replaceability: 0,
        compensationScore: 0
      });
    }
  };
  
  const removeExecutive = (index: number) => {
    setExecutives(executives.filter((_, i) => i !== index));
  };
  
  const isAddDisabled = !currentExec.name.trim() || !currentExec.role.trim();
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">
        Add Your Leadership Team
      </h2>
      
      <p className="text-muted-foreground">
        Include everyone who reports to you directly, plus any critical leaders PE will scrutinize.
      </p>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="name">Executive Name *</Label>
          <Input
            id="name"
            value={currentExec.name}
            onChange={(e) => setCurrentExec({...currentExec, name: e.target.value})}
            placeholder="John Smith"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="role">Role/Title *</Label>
          <Input
            id="role"
            value={currentExec.role}
            onChange={(e) => setCurrentExec({...currentExec, role: e.target.value})}
            placeholder="CFO"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="compensation">Total Compensation ($)</Label>
          <Input
            id="compensation"
            type="number"
            value={currentExec.compensation || ''}
            onChange={(e) => setCurrentExec({...currentExec, compensation: parseInt(e.target.value) || 0})}
            placeholder="150000"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Include salary + bonus + benefits</p>
        </div>
      </div>
      
      <Button 
        onClick={addExecutive} 
        className="w-full"
        disabled={isAddDisabled}
      >
        <Users className="w-4 h-4 mr-2" />
        Add Executive
      </Button>
      
      {executives.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Your Team ({executives.length})</h3>
          {executives.map((exec, index) => (
            <Card key={index} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{exec.name}</p>
                <p className="text-sm text-muted-foreground">{exec.role}</p>
                {exec.compensation > 0 && (
                  <p className="text-xs text-muted-foreground">${exec.compensation.toLocaleString()}/year</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExecutive(index)}
                className="text-red-500 hover:text-red-600"
              >
                Remove
              </Button>
            </Card>
          ))}
        </div>
      )}
      
      {executives.length === 0 && (
        <Alert>
          <AlertDescription>
            Add at least 3-5 key executives to get a meaningful assessment.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

const ScoringPage: React.FC<{
  executives: ExecutiveScore[];
  setExecutives: (execs: ExecutiveScore[]) => void;
}> = ({ executives, setExecutives }) => {
  const [currentExecIndex, setCurrentExecIndex] = useState(0);
  
  if (executives.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground">No Executives to Score</h2>
        <p>Please go back and add your leadership team members.</p>
      </div>
    );
  }
  
  const currentExec = executives[currentExecIndex];
  
  const updateScore = (field: keyof ExecutiveScore, value: number) => {
    const updated = [...executives];
    updated[currentExecIndex] = {
      ...updated[currentExecIndex],
      [field]: value
    };
    setExecutives(updated);
  };
  
  const calculateVerdict = (exec: ExecutiveScore): 'keeper' | 'coach' | 'replace' => {
    const avgScore = (exec.numbersObsession + exec.coachability + exec.clockSpeed + 
                     exec.executionFocus - exec.replaceability + exec.complexityShield + exec.compensationScore) / 7;
    if (avgScore >= 7) return 'keeper';
    if (avgScore >= 4) return 'coach';
    return 'replace';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">
          Scoring: {currentExec.name}
        </h2>
        <span className="text-sm text-muted-foreground">
          {currentExecIndex + 1} of {executives.length}
        </span>
      </div>
      
      <p className="text-lg text-muted-foreground">{currentExec.role}</p>
      {currentExec.compensation > 0 && (
        <p className="text-sm text-muted-foreground">
          Compensation: ${currentExec.compensation.toLocaleString()}/year
        </p>
      )}
      
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            1. Compensation vs. Market Rate
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            PE firms will benchmark every executive against market rates. Overpaid = immediate target.
          </p>
          <RadioGroup 
            value={currentExec.compensationScore?.toString()} 
            onValueChange={(value) => updateScore('compensationScore', parseInt(value))}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10" id="comp-10" />
                <Label htmlFor="comp-10">Below market rate - great value for PE</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="7" id="comp-7" />
                <Label htmlFor="comp-7">At market rate - fair compensation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="comp-3" />
                <Label htmlFor="comp-3">10-20% above market - slight overpay</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="comp-1" />
                <Label htmlFor="comp-1">20%+ above market - PE will cut immediately</Label>
              </div>
            </div>
          </RadioGroup>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">2. Numbers Obsession (Deal Breaker)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Can they quote their KPIs without looking? Do they live in spreadsheets?
          </p>
          <RadioGroup 
            value={currentExec.numbersObsession?.toString()} 
            onValueChange={(value) => updateScore('numbersObsession', parseInt(value))}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10" id="no1-10" />
                <Label htmlFor="no1-10">Knows every number cold, thinks in metrics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="no1-5" />
                <Label htmlFor="no1-5">Knows most numbers, occasionally needs to check</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="no1-1" />
                <Label htmlFor="no1-1">"Let me get back to you on that"</Label>
              </div>
            </div>
          </RadioGroup>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">3. Coachability vs Ego</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Will they accept a 28-year-old MBA as their boss? Can they handle "That's not how PE does it"?
          </p>
          <RadioGroup 
            value={currentExec.coachability?.toString()} 
            onValueChange={(value) => updateScore('coachability', parseInt(value))}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10" id="co1-10" />
                <Label htmlFor="co1-10">Zero ego, eager to learn, adapts instantly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="co1-5" />
                <Label htmlFor="co1-5">Some resistance but ultimately adapts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="co1-1" />
                <Label htmlFor="co1-1">"But we've always done it this way"</Label>
              </div>
            </div>
          </RadioGroup>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">4. Clock Speed</h3>
          <p className="text-sm text-muted-foreground mb-4">
            PE moves at 3x normal speed. Daily reports, weekly reviews, always on.
          </p>
          <RadioGroup 
            value={currentExec.clockSpeed?.toString()} 
            onValueChange={(value) => updateScore('clockSpeed', parseInt(value))}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10" id="cs1-10" />
                <Label htmlFor="cs1-10">Already operates at PE speed, 24/7 mentality</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="cs1-5" />
                <Label htmlFor="cs1-5">Can speed up with effort</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="cs1-1" />
                <Label htmlFor="cs1-1">9-to-5 mentality, "work-life balance" focus</Label>
              </div>
            </div>
          </RadioGroup>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">5. Execution vs Philosophy</h3>
          <p className="text-sm text-muted-foreground mb-4">
            PE wants doers, not thinkers. Results, not strategy decks.
          </p>
          <RadioGroup 
            value={currentExec.executionFocus?.toString()} 
            onValueChange={(value) => updateScore('executionFocus', parseInt(value))}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10" id="ef1-10" />
                <Label htmlFor="ef1-10">Pure executor, delivers results consistently</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="ef1-5" />
                <Label htmlFor="ef1-5">Good executor but likes to strategize</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="ef1-1" />
                <Label htmlFor="ef1-1">All talk, light on results</Label>
              </div>
            </div>
          </RadioGroup>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">6. Complexity Shield</h3>
          <p className="text-sm text-muted-foreground mb-4">
            How hard is their job for PE to understand? Complex = safer.
          </p>
          <RadioGroup 
            value={currentExec.complexityShield?.toString()} 
            onValueChange={(value) => updateScore('complexityShield', parseInt(value))}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10" id="cx1-10" />
                <Label htmlFor="cx1-10">Highly specialized, PE won't understand for 2+ years</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="cx1-5" />
                <Label htmlFor="cx1-5">Somewhat complex, 6-12 months to understand</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="cx1-1" />
                <Label htmlFor="cx1-1">Simple role, PE understands day one</Label>
              </div>
            </div>
          </RadioGroup>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">7. Replaceability (Lower is Better)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            How fast could PE replace them? What walks out the door?
          </p>
          <RadioGroup 
            value={currentExec.replaceability?.toString()} 
            onValueChange={(value) => updateScore('replaceability', parseInt(value))}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="rp1-1" />
                <Label htmlFor="rp1-1">Irreplaceable - key relationships, unique knowledge</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="rp1-5" />
                <Label htmlFor="rp1-5">Hard to replace - 3-6 months to find equal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10" id="rp1-10" />
                <Label htmlFor="rp1-10">Easy - could replace in 2 weeks</Label>
              </div>
            </div>
          </RadioGroup>
        </Card>
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentExecIndex(Math.max(0, currentExecIndex - 1))}
          disabled={currentExecIndex === 0}
        >
          Previous Executive
        </Button>
        
        {currentExecIndex < executives.length - 1 ? (
          <Button
            onClick={() => setCurrentExecIndex(currentExecIndex + 1)}
          >
            Next Executive
          </Button>
        ) : (
          <Button
            onClick={() => {
              // Calculate final scores
              const updatedExecs = executives.map(exec => ({
                ...exec,
                verdict: calculateVerdict(exec),
                overallScore: (exec.numbersObsession + exec.coachability + exec.clockSpeed + 
                              exec.executionFocus - exec.replaceability + exec.complexityShield + exec.compensationScore) / 7
              }));
              setExecutives(updatedExecs);
            }}
            className="bg-green-500 hover:bg-green-600"
          >
            Generate Report
          </Button>
        )}
      </div>
    </div>
  );
};

const ReportPage: React.FC<{ 
  executives: ExecutiveScore[];
  onComplete: () => void;
}> = ({ executives, onComplete }) => {
  const keepers = executives.filter(e => e.verdict === 'keeper');
  const coaches = executives.filter(e => e.verdict === 'coach');
  const replaces = executives.filter(e => e.verdict === 'replace');
  
  const teamScore = executives.length > 0 
    ? executives.reduce((acc, e) => acc + (e.overallScore || 0), 0) / executives.length 
    : 0;
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">
        Your Team's PE Survival Report
      </h2>
      
      <Card className={`p-6 ${teamScore >= 7 ? 'bg-green-500/10 border-green-500/30' : 
                              teamScore >= 4 ? 'bg-yellow-500/10 border-yellow-500/30' : 
                              'bg-red-500/10 border-red-500/30'}`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Overall Team Score</p>
            <p className="text-4xl font-bold">{teamScore.toFixed(1)}/10</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {teamScore >= 7 ? 'PE Ready' : teamScore >= 4 ? 'Needs Work' : 'High Risk'}
            </p>
            <p className="text-sm text-muted-foreground">
              {replaces.length > 0 ? `Replace ${replaces.length} before selling` : 'Team intact'}
            </p>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-green-500">{keepers.length}</div>
          <p className="text-sm text-muted-foreground">Keepers</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-yellow-500">{coaches.length}</div>
          <p className="text-sm text-muted-foreground">Need Coaching</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-red-500">{replaces.length}</div>
          <p className="text-sm text-muted-foreground">Replace Now</p>
        </Card>
      </div>
      
      <div className="space-y-4">
        {keepers.length > 0 && (
          <Card className="p-6 border-l-4 border-l-green-500">
            <h3 className="text-xl font-semibold mb-3 text-green-600">✓ Keepers - Protect These People</h3>
            {keepers.map((exec, i) => (
              <div key={i} className="py-2 border-b border-border last:border-0">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{exec.name}</p>
                    <p className="text-sm text-muted-foreground">{exec.role}</p>
                    {exec.compensation > 0 && (
                      <p className="text-xs text-muted-foreground">${exec.compensation.toLocaleString()}/year</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">Score: {exec.overallScore?.toFixed(1)}</p>
                    <p className="text-xs text-green-600">Will thrive under PE</p>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        )}
        
        {coaches.length > 0 && (
          <Card className="p-6 border-l-4 border-l-yellow-500">
            <h3 className="text-xl font-semibold mb-3 text-yellow-600">⚠ Need Immediate Coaching</h3>
            {coaches.map((exec, i) => (
              <div key={i} className="py-2 border-b border-border last:border-0">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{exec.name}</p>
                    <p className="text-sm text-muted-foreground">{exec.role}</p>
                    {exec.compensation > 0 && (
                      <p className="text-xs text-muted-foreground">${exec.compensation.toLocaleString()}/year</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">Score: {exec.overallScore?.toFixed(1)}</p>
                    <p className="text-xs text-yellow-600">50/50 survival odds</p>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        )}
        
        {replaces.length > 0 && (
          <Card className="p-6 border-l-4 border-l-red-500">
            <h3 className="text-xl font-semibold mb-3 text-red-600">✗ Start Recruiting Replacements</h3>
            {replaces.map((exec, i) => (
              <div key={i} className="py-2 border-b border-border last:border-0">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{exec.name}</p>
                    <p className="text-sm text-muted-foreground">{exec.role}</p>
                    {exec.compensation > 0 && (
                      <p className="text-xs text-muted-foreground">${exec.compensation.toLocaleString()}/year</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">Score: {exec.overallScore?.toFixed(1)}</p>
                    <p className="text-xs text-red-600">Won't survive PE</p>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
      
      <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <h3 className="text-xl font-semibold mb-3">Action Items Before Sale</h3>
        <div className="space-y-2">
          {replaces.length > 0 && (
            <p className="text-sm">
              • Start recruiting for {replaces.length} replacement{replaces.length > 1 ? 's' : ''} immediately
            </p>
          )}
          {coaches.length > 0 && (
            <p className="text-sm">
              • Begin intensive coaching for {coaches.length} at-risk executive{coaches.length > 1 ? 's' : ''}
            </p>
          )}
          <p className="text-sm">
            • Create retention packages for your {keepers.length} keeper{keepers.length !== 1 ? 's' : ''}
          </p>
          <p className="text-sm">
            • Benchmark all executive compensation against market rates
          </p>
          <p className="text-sm">
            • Document all key processes before any transitions
          </p>
          {teamScore < 5 && (
            <p className="text-sm font-semibold text-red-600">
              • Consider delaying sale by 6-12 months to strengthen team
            </p>
          )}
        </div>
      </Card>
      
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Remember:</strong> It's better to make these changes yourself before the sale than 
          have PE force them after. You control the narrative and protect earnout.
        </AlertDescription>
      </Alert>

      <div className="flex justify-center pt-6">
        <Button 
          onClick={onComplete}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3"
          size="lg"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Complete Module & Continue
        </Button>
      </div>
    </div>
  );
};

export default ManagementScorecard;
