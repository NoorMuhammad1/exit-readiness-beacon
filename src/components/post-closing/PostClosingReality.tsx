
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, Heart, Users, Building, AlertTriangle, DollarSign, Briefcase, Target, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '@/hooks/useProgress';
import { getNextModulePath } from '@/config/moduleConfig';

export const PostClosingReality: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const navigate = useNavigate();
  const { markModuleComplete } = useProgress();
  
  const sections = [
    {
      title: "It's Not Your Baby Anymore",
      icon: Heart,
      content: <NotYourBusinessPage />
    },
    {
      title: "Your New Role & Reality",
      icon: Briefcase,
      content: <NewRolePage />
    },
    {
      title: "Platform Consolidation",
      icon: Building,
      content: <ConsolidationPage />
    },
    {
      title: "Financial Discipline",
      icon: DollarSign,
      content: <MoneyManagementPage />
    },
    {
      title: "The Earnout Trap",
      icon: Target,
      content: <EarnoutRealityPage />
    }
  ];

  const isLastSection = currentSection === sections.length - 1;

  const handleComplete = async () => {
    await markModuleComplete('Post-Closing Reality', 2);
    const nextPath = getNextModulePath('Post-Closing Reality');
    if (nextPath) {
      navigate(nextPath);
    } else {
      navigate('/portal');
    }
  };
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Life After the Sale: The Unvarnished Truth
        </h1>
        <p className="text-muted-foreground">
          Father-to-son advice about what really happens after closing
        </p>
      </div>
      
      {/* Progress */}
      <Progress value={(currentSection + 1) / sections.length * 100} className="h-2 mb-6" />
      
      {/* Content */}
      <Card className="p-8 min-h-[500px]">
        <div className="flex items-center mb-6">
          {React.createElement(sections[currentSection].icon, {
            className: "w-8 h-8 mr-3 text-primary"
          })}
          <h2 className="text-2xl font-bold">{sections[currentSection].title}</h2>
        </div>
        {sections[currentSection].content}
      </Card>
      
      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        {isLastSection ? (
          <Button onClick={handleComplete} className="bg-success text-success-foreground hover:bg-success/90">
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Module
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

// Section 1: Not Your Business
const NotYourBusinessPage: React.FC = () => {
  const [showAnalogy, setShowAnalogy] = useState(false);
  
  return (
    <div className="space-y-6">
      <Card className="bg-blue-500/10 border-blue-500/30 p-6">
        <p className="text-lg">
          <strong>It's like when your daughter gets married.</strong> You still have a voice 
          in her life, you still care deeply, but she's got her own family now. She makes 
          decisions with someone else. That's your business after PE buys it.
        </p>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">The Mental Shift You Must Make:</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-muted">
            <h4 className="font-semibold text-red-600 mb-2">Before (Owner)</h4>
            <ul className="text-sm space-y-1">
              <li>• Final say on everything</li>
              <li>• Your name on the door</li>
              <li>• Your rules, your way</li>
              <li>• Take money when you want</li>
              <li>• Change direction anytime</li>
            </ul>
          </Card>
          
          <Card className="p-4 bg-muted">
            <h4 className="font-semibold text-green-600 mb-2">After (Part-Owner)</h4>
            <ul className="text-sm space-y-1">
              <li>• Board approves major decisions</li>
              <li>• Platform brand coming</li>
              <li>• PE's playbook</li>
              <li>• Structured compensation only</li>
              <li>• Strategic plan locked in</li>
            </ul>
          </Card>
        </div>
        
        <Button
          onClick={() => setShowAnalogy(true)}
          variant="outline"
          className="w-full"
          disabled={showAnalogy}
        >
          The Hard Truth About Control
        </Button>
        
        {showAnalogy && (
          <Alert className="border-yellow-500/30 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Reality Check:</strong> You own 30% but have 0% control. 
              PE has board majority. They can (and will) make decisions you hate. 
              You can voice objections, but you can't stop them. If you can't handle 
              this, take all cash at closing.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

// Section 2: New Role
const NewRolePage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  const roles = [
    {
      title: "CEO/President",
      reality: "You report to a board now. Monthly reports, quarterly reviews, annual budgets. Miss your numbers? Expect hard conversations.",
      accountability: "Hit EBITDA targets or face replacement"
    },
    {
      title: "Strategic Advisor",
      reality: "They'll listen politely, then do what they planned anyway. Your influence fades monthly.",
      accountability: "Show up to meetings, cash your check"
    },
    {
      title: "Earnout Chaser",
      reality: "100% focused on hitting targets for 2-3 years. Everything else is secondary.",
      accountability: "Make the numbers or lose millions"
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-lg">
          <strong>PE doesn't want to run your plumbing company.</strong> But they will 
          hold you to corporate executive standards. Pick your role and understand the deal:
        </p>
        
        <div className="space-y-3">
          {roles.map((role, idx) => (
            <Card
              key={idx}
              className={`p-4 cursor-pointer transition-all ${
                selectedRole === role.title ? 'bg-primary/10 border-primary/30' : 'hover:bg-muted'
              }`}
              onClick={() => setSelectedRole(role.title)}
            >
              <h3 className="font-semibold text-lg">{role.title}</h3>
              {selectedRole === role.title && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm">{role.reality}</p>
                  <p className="text-sm font-semibold text-yellow-600">
                    Bottom Line: {role.accountability}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
        
        <Alert>
          <AlertDescription>
            <strong>Pro Tip:</strong> If you stay as CEO, you're no longer an owner 
            who happens to manage. You're an employee who happens to own shares. 
            Big difference.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

// Section 3: Consolidation
const ConsolidationPage: React.FC = () => {
  const [showExamples, setShowExamples] = useState(false);
  
  return (
    <div className="space-y-6">
      <Card className="bg-orange-500/10 border-orange-500/30 p-6">
        <h3 className="font-semibold text-orange-600 mb-2">The Platform Play:</h3>
        <p>
          Your company name? Gone within 18 months. You're now part of "National HVAC 
          Solutions" or whatever vanilla name tested well with focus groups. Your trucks, 
          uniforms, business cards—all getting rebranded. Deal with it.
        </p>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">What Gets Consolidated:</h3>
        
        <Button
          onClick={() => setShowExamples(true)}
          className="w-full"
          disabled={showExamples}
        >
          Show Real Examples
        </Button>
        
        {showExamples && (
          <div className="space-y-3">
            <Card className="p-4 bg-muted">
              <h4 className="font-semibold mb-2">Fleet Fuel (Your AC Company Example)</h4>
              <p className="text-sm">
                Company A uses Wawa, Company B uses Murphy, Company C uses Exxon. 
                PE consolidates everyone to Shell for 15% better pricing. Your local 
                Wawa guy you've known 10 years? Sorry, relationship over.
              </p>
            </Card>
            
            <Card className="p-4 bg-muted">
              <h4 className="font-semibold mb-2">Software Systems</h4>
              <p className="text-sm">
                Love your QuickBooks setup? Too bad. Everyone moves to NetSuite. 
                That custom CRM you built? Replaced with Salesforce. Your efficiency 
                drops 30% for 6 months while you learn new systems.
              </p>
            </Card>
            
            <Card className="p-4 bg-muted">
              <h4 className="font-semibold mb-2">Insurance & Benefits</h4>
              <p className="text-sm">
                Your local broker who sponsors your kid's baseball team? Gone. 
                National broker saves 20%. Your employees' favorite health plan? 
                Switched to corporate standard.
              </p>
            </Card>
            
            <Card className="p-4 bg-muted">
              <h4 className="font-semibold mb-2">Your Best Vendors</h4>
              <p className="text-sm">
                That supplier who always came through in a pinch? If they can't 
                handle 10x volume at 20% less margin, they're out. Relationships 
                you built over 20 years—gone in a procurement review.
              </p>
            </Card>
          </div>
        )}
        
        <Alert className="border-blue-500/30 bg-blue-500/10">
          <AlertDescription>
            <strong>The Upside:</strong> These consolidations do save 10-20% on costs, 
            which improves EBITDA, which increases your equity value. It's not personal, 
            it's math.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

// Section 4: Money Management
const MoneyManagementPage: React.FC = () => {
  const [showMistakes, setShowMistakes] = useState(false);
  
  return (
    <div className="space-y-6">
      <Alert className="border-red-500/30 bg-red-500/10">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-lg">
          <strong>DO NOT GO NOUVEAU RICHE!</strong> That wire hitting your account? 
          It needs to last the rest of your life. There's no more big influx coming.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">The Smart Money Playbook:</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-green-500/10 border-green-500/30">
            <h4 className="font-semibold text-green-600 mb-2">✅ Smart Moves</h4>
            <ul className="text-sm space-y-1">
              <li>• Pay off all personal debt</li>
              <li>• Set aside 40% for taxes</li>
              <li>• Create 2-year expense fund</li>
              <li>• Diversified investment portfolio</li>
              <li>• Keep your current house/car</li>
            </ul>
          </Card>
          
          <Card className="p-4 bg-red-500/10 border-red-500/30">
            <h4 className="font-semibold text-red-600 mb-2">❌ Stupid Moves</h4>
            <ul className="text-sm space-y-1">
              <li>• Buying the yacht/jet</li>
              <li>• "Sure thing" investments</li>
              <li>• Lending to friends/family</li>
              <li>• Lifestyle inflation</li>
              <li>• Assuming earnouts are guaranteed</li>
            </ul>
          </Card>
        </div>
        
        <Button
          onClick={() => setShowMistakes(true)}
          variant="outline"
          className="w-full"
          disabled={showMistakes}
        >
          Real Stories of Post-Sale Disasters
        </Button>
        
        {showMistakes && (
          <div className="space-y-3">
            <Card className="p-4 bg-red-500/10">
              <p className="text-sm">
                <strong>HVAC Owner, Florida:</strong> Got funds at closing. Bought expensive house, 
                boat, gave to family. Earnout missed by 5%. Lost millions. Now selling 
                the house to pay taxes.
              </p>
            </Card>
            
            <Card className="p-4 bg-red-500/10">
              <p className="text-sm">
                <strong>Manufacturing CEO, Ohio:</strong> Big wire. Started angel investing. 
                Lost half in 18 months. PE fired him year 2. No earnout. Living on remainder 
                at age 52.
              </p>
            </Card>
            
            <Card className="p-4 bg-green-500/10">
              <p className="text-sm">
                <strong>Software Founder, Texas:</strong> Closing funds. Kept liquid portion, 
                invested conservatively, paid off everything. Missed earnout but still 
                retired comfortably at 48.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// Section 5: Earnout Reality
const EarnoutRealityPage: React.FC = () => {
  const [showTruth, setShowTruth] = useState(false);
  
  return (
    <div className="space-y-6">
      <Card className="bg-red-500/10 border-red-500/30 p-6">
        <h3 className="text-2xl font-bold text-red-600 mb-3">
          The Brutal Earnout Truth
        </h3>
        <p className="text-lg">
          If half the deal is earnouts, assume the real price is just the upfront cash. 
          Everything else is a bonus you might not get.
        </p>
      </Card>
      
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <Card className="p-4">
            <p className="text-3xl font-bold text-red-600">40%</p>
            <p className="text-sm text-muted-foreground">Get nothing</p>
          </Card>
          <Card className="p-4">
            <p className="text-3xl font-bold text-yellow-600">35%</p>
            <p className="text-sm text-muted-foreground">Get partial</p>
          </Card>
          <Card className="p-4">
            <p className="text-3xl font-bold text-green-600">25%</p>
            <p className="text-sm text-muted-foreground">Get full earnout</p>
          </Card>
        </div>
        
        <Button
          onClick={() => setShowTruth(true)}
          className="w-full"
          disabled={showTruth}
        >
          Why Earnouts Fail (Even When You Perform)
        </Button>
        
        {showTruth && (
          <div className="space-y-3">
            <Card className="p-4 bg-muted">
              <h4 className="font-semibold mb-2">Accounting Changes</h4>
              <p className="text-sm">
                PE changes from cash to accrual accounting. Your EBITDA drops 20% 
                on paper. You miss earnout. Perfectly legal.
              </p>
            </Card>
            
            <Card className="p-4 bg-muted">
              <h4 className="font-semibold mb-2">Allocated Costs</h4>
              <p className="text-sm">
                Platform allocates "management fees" and "shared services" to your P&L. 
                Suddenly you're paying hundreds of thousands you never paid before. EBITDA crushed.
              </p>
            </Card>
            
            <Card className="p-4 bg-muted">
              <h4 className="font-semibold mb-2">Strategic Pivots</h4>
              <p className="text-sm">
                PE decides to sacrifice profitability for growth. They cut prices 20% 
                to gain market share. Your EBITDA earnout is toast. Not your call.
              </p>
            </Card>
          </div>
        )}
        
        <Alert className="border-green-500/30 bg-green-500/10">
          <AlertDescription>
            <strong>The Only Safe Approach:</strong> Celebrate the upfront cash. 
            Work hard for the earnout. But live your life assuming you'll never 
            see a penny of it. If it comes, it's gravy. If not, you're not eating 
            ramen at 65.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default PostClosingReality;
