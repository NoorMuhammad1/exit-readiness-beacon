
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, FileText, Clock, ArrowRight } from 'lucide-react';

export const DataRoomIntroPage: React.FC = () => {
  const navigate = useNavigate();
  const [showExample, setShowExample] = useState(false);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Your Data Room</h1>
        <p className="text-muted-foreground">
          The command center for due diligence documentation
        </p>
      </div>
      
      {/* Critical Reality Check */}
      <Card className="bg-warning/10 backdrop-blur-sm p-6 rounded-lg border-l-4 border-warning/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-warning font-semibold mb-2">Before You Start: Understand the Beast</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">Scale:</strong> You'll upload 3,000-5,000 documents. 
                This is not an exaggeration.
              </p>
              <p>
                <strong className="text-foreground">Time Investment:</strong> Expect 100+ hours of work. 
                But this saves 500+ hours during the deal.
              </p>
              <p>
                <strong className="text-foreground">The Payoff:</strong> A prepared data room cuts 60-90 days 
                off your deal and prevents price reductions from delays.
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* The Redundancy Reality */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-3">The Redundancy Requirement</h3>
        <p className="text-muted-foreground mb-4">
          PE firms divide due diligence across specialized teams. Each team needs documents in their 
          workflow. This means the SAME document goes in MULTIPLE folders.
        </p>
        
        <Button 
          onClick={() => setShowExample(!showExample)}
          variant="outline"
          className="w-full"
        >
          {showExample ? 'Hide' : 'Show'} Real Example
        </Button>
        
        {showExample && (
          <div className="mt-4 bg-slate-800 p-4 rounded animate-in fade-in-50">
            <p className="font-semibold text-foreground mb-3">
              Your Employee Handbook will be requested in:
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">✓ Human Resources → Policies</div>
              <div className="text-muted-foreground">✓ Legal → Employment Docs</div>
              <div className="text-muted-foreground">✓ Operations → SOPs</div>
              <div className="text-muted-foreground">✓ Warranties → Employment</div>
              <div className="text-muted-foreground">✓ Compliance → Labor Law</div>
              <div className="text-muted-foreground">✓ Risk → HR Policies</div>
            </div>
            <p className="text-yellow-400 mt-3 text-sm">
              Same document. Six locations. This is NORMAL and REQUIRED.
            </p>
          </div>
        )}
      </Card>
      
      {/* Success Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="font-semibold text-foreground">90 Days Faster</p>
          <p className="text-sm text-muted-foreground">Average time saved</p>
        </Card>
        <Card className="p-4 text-center">
          <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="font-semibold text-foreground">3,500 Documents</p>
          <p className="text-sm text-muted-foreground">Typical requirement</p>
        </Card>
        <Card className="p-4 text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="font-semibold text-foreground">15% Higher Price</p>
          <p className="text-sm text-muted-foreground">From faster close</p>
        </Card>
      </div>
      
      {/* Call to Action */}
      <Card className="bg-primary/10 backdrop-blur-sm p-6 border-primary/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Ready to Build Your Data Room?</h3>
            <p className="text-muted-foreground">
              Start organizing now. Every hour invested today saves 5 hours during the deal.
            </p>
          </div>
          <Button 
            size="lg"
            onClick={() => navigate('/portal/week-2/data-room/workspace')}
            className="min-w-[200px]"
          >
            Start Building
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
