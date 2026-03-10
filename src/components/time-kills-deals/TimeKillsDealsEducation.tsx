import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, Clock, TrendingDown, Phone, AlertTriangle, CheckCircle } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { useNavigate } from 'react-router-dom';

export const TimeKillsDealsEducation: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { markModuleComplete } = useProgress();
  const navigate = useNavigate();
  
  const pages = [
    {
      title: "Why Time Is Your Enemy",
      content: <IntroPage />
    },
    {
      title: "The Pager Store Disaster", 
      content: <PagerStoryPage />
    },
    {
      title: "Market Timing Risk",
      content: <MarketTimingPage />
    },
    {
      title: "Deal Fatigue Is Real",
      content: <DealFatiguePage />
    },
    {
      title: "How Preparation Saves Deals",
      content: <PreparationPage />
    }
  ];

  const handleComplete = async () => {
    await markModuleComplete('Time Kills Deals', 1);
    navigate('/portal/week-1');
  };
  
  return (
    <div>
      <div className="mb-8">
        <Progress value={(currentPage + 1) / pages.length * 100} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Step {currentPage + 1} of {pages.length}</span>
          <span>{pages[currentPage].title}</span>
        </div>
      </div>
      
      <Card className="p-8 min-h-[500px]">
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
        
        {currentPage === pages.length - 1 ? (
          <Button onClick={handleComplete} className="bg-success text-success-foreground hover:bg-success/90">
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Module
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

const IntroPage: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold flex items-center">
      <Clock className="w-10 h-10 mr-3 text-destructive" />
      Time Kills Deals
    </h2>
    
    <div className="text-lg space-y-4 text-muted-foreground">
      <p>
        In M&A, there's a saying that every experienced dealmaker knows by heart: 
        <strong className="text-destructive"> "Time kills deals."</strong>
      </p>
      
      <div className="bg-destructive/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-destructive/30">
        <p className="font-semibold mb-2 text-foreground">Two Ways Time Destroys Value:</p>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li><strong>Waiting too long to sell</strong> - Your industry changes, competition emerges, technology shifts</li>
          <li><strong>Taking too long to close</strong> - Deal fatigue, changing conditions, buyers get cold feet</li>
        </ol>
      </div>
      
      <p>
        This program exists because we've seen too many great businesses lose millions 
        by not understanding these time dynamics. Let's learn from their mistakes.
      </p>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mt-8">
      <Card className="p-4 bg-warning/10 backdrop-blur-sm border border-warning/30">
        <TrendingDown className="w-8 h-8 text-warning mb-2" />
        <p className="font-semibold">Market Windows Close</p>
        <p className="text-sm text-muted-foreground">Industries can change overnight</p>
      </Card>
      <Card className="p-4 bg-accent/10 backdrop-blur-sm border border-accent/30">
        <Clock className="w-8 h-8 text-accent mb-2" />
        <p className="font-semibold">Buyers Don't Wait</p>
        <p className="text-sm text-muted-foreground">They have other options</p>
      </Card>
    </div>
    
    <div className="mt-8">
      <Card className="p-6">
        <div className="flex items-start space-x-4">
          <div className="text-4xl">🥚</div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-3">
              The Egg Paradox of M&A
            </h3>
            <p className="text-muted-foreground mb-4">
              A deal is like an egg - incredibly strong yet devastatingly fragile.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-success/10 backdrop-blur-sm border border-success/30 rounded-lg p-4">
                <p className="text-success font-semibold mb-2">When Nurtured:</p>
                <p className="text-muted-foreground text-sm">
                  Can withstand months of pressure, negotiations, and due diligence. 
                  A well-cared-for deal grows stronger over time.
                </p>
              </div>
              
              <div className="bg-destructive/10 backdrop-blur-sm border border-destructive/30 rounded-lg p-4">
                <p className="text-destructive font-semibold mb-2">When Attacked:</p>
                <p className="text-muted-foreground text-sm">
                  One aggressive move, one surprise, one broken promise - 
                  and it shatters instantly. No putting it back together.
                </p>
              </div>
            </div>
            
            <p className="text-muted-foreground mt-4 text-sm italic">
              The strongest deals require the gentlest hands.
            </p>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const PagerStoryPage: React.FC = () => {
  const [showReveal, setShowReveal] = useState(false);
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">The $50 Million Mistake</h2>
      
      <Card className="p-6">
        <p className="text-lg mb-4 text-muted-foreground">
          <strong className="text-foreground">1998:</strong> A chain of pager stores in Texas. 
          42 locations. $8M in EBITDA. Life is good.
        </p>
        
        <div className="space-y-3 text-muted-foreground">
          <p>📟 Pagers are everywhere - doctors, executives, teenagers</p>
          <p>💰 PE firm offers $50M (6.25x multiple)</p>
          <p>🤔 Owner thinks: "Business is growing. Let's wait a year for a better price."</p>
        </div>
      </Card>
      
      <Button 
        onClick={() => setShowReveal(true)} 
        className="w-full"
        disabled={showReveal}
      >
        What Happened Next?
      </Button>
      
      {showReveal && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-destructive/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-destructive/30">
            <p className="text-lg mb-4 text-foreground">
              <strong>1999:</strong> Cell phones explode in popularity.
            </p>
            
            <div className="space-y-3 text-muted-foreground">
              <p>📱 Nokia sells 78 million phones</p>
              <p>📉 Pager sales drop 40% in 6 months</p>
              <p>💸 PE firms won't even return calls</p>
              <p>🚫 Business sells for $8M in 2001 (asset value only)</p>
            </div>
          </div>
          
          <div className="bg-warning/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-warning/30">
            <AlertTriangle className="w-6 h-6 text-warning mb-2" />
            <p className="font-semibold">The Lesson:</p>
            <p className="text-sm text-muted-foreground">
              Waiting for "just a little more" cost this owner $42 million. 
              Technology changed. The window closed. Game over.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const MarketTimingPage: React.FC = () => {
  const examples = [
    {
      industry: "Video Rental",
      peak: "2004: Blockbuster worth $5B",
      crash: "2010: Bankruptcy. Netflix won.",
      icon: "📼"
    },
    {
      industry: "Travel Agencies", 
      peak: "1999: $100B industry",
      crash: "2005: Expedia/Kayak killed 80%",
      icon: "✈️"
    },
    {
      industry: "Print Newspapers",
      peak: "2000: Record valuations", 
      crash: "2010: Lost 90% of value",
      icon: "📰"
    },
    {
      industry: "Taxi Medallions",
      peak: "2013: NYC medallion = $1.3M",
      crash: "2020: Worth $150K. Uber won.",
      icon: "🚕"
    }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Industries Can Die Overnight</h2>
      
      <p className="text-lg text-muted-foreground">
        These business owners all thought they had more time:
      </p>
      
      <div className="space-y-4">
        {examples.map((example, idx) => (
          <Card key={idx} className="p-4 hover:bg-accent transition-colors">
            <div className="flex items-start space-x-4">
              <span className="text-3xl">{example.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-lg">{example.industry}</p>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                  <p className="text-success">✅ {example.peak}</p>
                  <p className="text-destructive">❌ {example.crash}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="bg-accent/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-accent/30">
        <p className="font-semibold mb-2">The Pattern:</p>
        <p className="text-muted-foreground">
          Disruption happens slowly, then suddenly. By the time you see it coming, 
          buyers have already disappeared. The best time to sell is when you don't have to.
        </p>
      </div>
    </div>
  );
};

const DealFatiguePage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(0);
  
  const timeline = [
    { month: 0, event: "LOI Signed", mood: "😊", buyer: 100, seller: 100 },
    { month: 1, event: "Due diligence starts", mood: "😐", buyer: 95, seller: 95 },
    { month: 3, event: "Still requesting documents", mood: "😕", buyer: 85, seller: 80 },
    { month: 5, event: "Re-trading begins", mood: "😟", buyer: 75, seller: 60 },
    { month: 7, event: "Deal fatigue sets in", mood: "😡", buyer: 60, seller: 40 },
    { month: 9, event: "Deal dies", mood: "💀", buyer: 0, seller: 0 }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Why Long Deals Die</h2>
      
      <p className="text-lg text-muted-foreground">
        Watch what happens to enthusiasm over time in a poorly prepared deal:
      </p>
      
      <Card className="p-6">
        <div className="flex justify-between mb-4">
          {timeline.map((point, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedMonth(idx)}
              className={`text-center px-2 py-1 rounded transition-colors ${
                idx === selectedMonth ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              <p className="text-2xl">{point.mood}</p>
              <p className="text-xs mt-1">Month {point.month}</p>
            </button>
          ))}
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="font-semibold mb-2">Event: {timeline[selectedMonth].event}</p>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Buyer Enthusiasm</p>
              <div className="w-full bg-muted rounded-full h-4">
                <div 
                  className="bg-success h-4 rounded-full transition-all duration-500"
                  style={{ width: `${timeline[selectedMonth].buyer}%` }}
                />
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Seller Enthusiasm</p>
              <div className="w-full bg-muted rounded-full h-4">
                <div 
                  className="bg-accent h-4 rounded-full transition-all duration-500"
                  style={{ width: `${timeline[selectedMonth].seller}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-destructive/10 backdrop-blur-sm border border-destructive/30">
          <p className="font-semibold mb-2">What Kills Enthusiasm:</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Endless document requests</li>
            <li>• Surprise findings</li>
            <li>• Re-negotiation attempts</li>
            <li>• Key employee departures</li>
            <li>• Market changes</li>
          </ul>
        </Card>
        
        <Card className="p-4 bg-success/10 backdrop-blur-sm border border-success/30">
          <p className="font-semibold mb-2">What Preserves It:</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Clean data room ready</li>
            <li>• No surprises</li>
            <li>• Fast responses</li>
            <li>• Aligned expectations</li>
            <li>• Professional advisors</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

const PreparationPage: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  
  const benefits = [
    {
      id: 'speed',
      title: 'Close 3-4 Months Faster',
      description: 'Prepared sellers close in 90-120 days vs 180-270 days',
      icon: '⚡'
    },
    {
      id: 'price',
      title: 'Maintain Your Price',
      description: 'No re-trading when there are no surprises',
      icon: '💰'
    },
    {
      id: 'certainty',
      title: 'Higher Close Rate',
      description: '90% of prepared deals close vs 50% unprepared',
      icon: '✅'
    },
    {
      id: 'stress',
      title: 'Less Stress',
      description: 'You know what\'s coming and you\'re ready',
      icon: '😌'
    }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Preparation = Speed = Success</h2>
      
      <p className="text-lg text-muted-foreground">
        This 4-week program turns a 9-month nightmare into a 3-month sprint:
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {benefits.map(benefit => (
          <Card 
            key={benefit.id}
            className={`p-4 cursor-pointer transition-all border ${
              checkedItems.includes(benefit.id) 
                ? 'bg-success/10 backdrop-blur-sm border-success/30' 
                : 'hover:bg-accent'
            }`}
            onClick={() => {
              if (checkedItems.includes(benefit.id)) {
                setCheckedItems(checkedItems.filter(id => id !== benefit.id));
              } else {
                setCheckedItems([...checkedItems, benefit.id]);
              }
            }}
          >
            <div className="flex items-start space-x-3">
              <span className="text-3xl">{benefit.icon}</span>
              <div>
                <p className="font-semibold">{benefit.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
              </div>
            </div>
            {checkedItems.includes(benefit.id) && (
              <CheckCircle className="w-6 h-6 text-success mt-2" />
            )}
          </Card>
        ))}
      </div>
      
      <div className="bg-gradient-to-r from-accent/10 to-success/10 backdrop-blur-sm border border-accent/30 p-6 rounded-lg">
        <h3 className="font-bold text-xl mb-4">The Bottom Line:</h3>
        
        <div className="space-y-3 text-muted-foreground">
          <p>
            <strong className="text-foreground">Unprepared sellers:</strong> 6-9 months of hell, 50% close rate, 
            price drops 10-20%, everyone exhausted
          </p>
          
          <p>
            <strong className="text-foreground">Prepared sellers:</strong> 3-4 months smooth sailing, 90% close rate, 
            maintain price, celebrate at closing
          </p>
        </div>
      </div>
      
      <div className="bg-warning/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-warning/30">
        <p className="text-center text-lg text-muted-foreground">
          <strong className="text-foreground">Remember:</strong> Every week you spend preparing 
          saves a month in the deal process.
        </p>
      </div>
    </div>
  );
};

export default TimeKillsDealsEducation;
