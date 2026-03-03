
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Clock, Trophy, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProgress } from '@/hooks/useProgress';
import { getModulesByWeek } from '@/config/moduleConfig';

export default function ClientPortalDashboard() {
  const { weekProgress } = useProgress();
  
  // Calculate overall progress
  const totalModules = weekProgress.reduce((sum, week) => sum + week.totalModules, 0);
  const completedModules = weekProgress.reduce((sum, week) => sum + week.completedModules, 0);
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  
  const currentWeek = 1;
  const week1Modules = getModulesByWeek(1);
  const week1Progress = weekProgress.find(w => w.weekNumber === 1);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Crown className="h-8 w-8" />
          <h1 className="text-4xl font-bold text-slate-50">Welcome to Your Deal Room</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your exclusive 4-week journey to maximize exit value. Let's transform your business into a PE-ready powerhouse.
        </p>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          $5,000 Investment • 4 Weeks • Maximum Value
        </Badge>
      </div>

      {/* Progress Overview */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Your Journey Progress
          </CardTitle>
          <CardDescription>
            Track your progress through the 4-week PE Ready program
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Completion</span>
              <span>{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-6">
            {weekProgress.map((week) => (
              <div key={week.weekNumber} className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  week.isUnlocked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {week.weekNumber}
                </div>
                <div className="text-xs text-muted-foreground">
                  {week.completedModules}/{week.totalModules} modules
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Week Focus */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Week {currentWeek}: Foundation & Education
          </CardTitle>
          <CardDescription>
            Build your PE knowledge foundation and identify immediate value drivers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Interactive Glossary</CardTitle>
                <CardDescription className="text-sm">
                  Master the language of private equity transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/portal/week-1/glossary">
                    <Play className="h-4 w-4 mr-2" />
                    Start Learning
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Asset Free Education</CardTitle>
                <CardDescription className="text-sm">
                  Learn what PE buyers really want in your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/portal/week-1/asset-free-education">
                    <Play className="h-4 w-4 mr-2" />
                    Explore Now
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Time Kills Deals</CardTitle>
                <CardDescription className="text-sm">
                  Understand why speed and preparation are critical
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/portal/week-1/time-kills-deals">
                    <Play className="h-4 w-4 mr-2" />
                    Learn Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">This Week You'll:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Master 20+ essential PE terms and concepts</li>
              <li>• Learn how EBITDA calculation affects your valuation</li>
              <li>• Understand asset-free, debt-free transactions</li>
              <li>• Categorize your assets (core vs non-core)</li>
              <li>• Identify your buyer personas and data room needs</li>
              <li>• Learn why time kills deals and how to prepare</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">20+</CardTitle>
            <CardDescription>Essential PE Terms to Master</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">6</CardTitle>
            <CardDescription>Educational Modules This Week</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">4 Weeks</CardTitle>
            <CardDescription>To Exit-Ready Status</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="text-center py-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Begin Your Journey?</h3>
          <p className="mb-6 text-primary-foreground/90">
            Start with the Interactive Glossary to build your foundation in PE terminology.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/portal/week-1/glossary">
              Begin Week 1
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
