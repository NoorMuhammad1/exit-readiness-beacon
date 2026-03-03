
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, ArrowRight, Play, Calculator, BarChart3, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { moduleConfigurations, isMvpEnabled } from '@/config/moduleConfig';
import { LockedModuleBadge } from '@/components/mvp/LockedModuleBadge';

// The 3 MVP modules with their icons and descriptions
const MVP_MODULES = [
  {
    path: '/portal/week-3/ebitda-calculator',
    name: 'EBITDA Calculator',
    description: 'Get your real PE-adjusted number — the exact figure buyers will use to value your business.',
    icon: Calculator,
    cta: 'Calculate Now',
  },
  {
    path: '/portal/week-3/business-scorecard',
    name: 'Business Scorecard',
    description: 'Score your business across 8 dimensions PE buyers care most about. See exactly where you stand.',
    icon: BarChart3,
    cta: 'Get My Score',
  },
  {
    path: '/portal/week-3/deal-killers',
    name: 'Deal Killers Diagnostic',
    description: 'Identify the specific red flags that will kill your deal — before buyers find them.',
    icon: AlertTriangle,
    cta: 'Diagnose Now',
  },
];

export default function ClientPortalDashboard() {
  const lockedModules = moduleConfigurations.filter(m => !isMvpEnabled(m));

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Crown className="h-8 w-8" />
          <h1 className="text-4xl font-bold text-slate-50">PE Ready — Early Access</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          You're in early. Three powerful tools are unlocked now. The full platform — all modules, all weeks — launches soon.
        </p>
        <Badge variant="secondary" className="text-base px-4 py-1.5">
          3 Modules Unlocked • Full Launch Coming
        </Badge>
      </div>

      {/* Available Now */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-50">Available Now</h2>
          <Badge className="bg-primary text-primary-foreground">Early Access</Badge>
        </div>
        <p className="text-muted-foreground">
          These three modules give you a real picture of your business's PE value right now.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {MVP_MODULES.map(mod => {
            const Icon = mod.icon;
            return (
              <Card key={mod.path} className="border-primary/30 bg-gradient-to-b from-primary/5 to-transparent hover:border-primary/60 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs border-primary/40 text-primary">Unlocked</Badge>
                  </div>
                  <CardTitle className="text-lg">{mod.name}</CardTitle>
                  <CardDescription>{mod.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link to={mod.path}>
                      <Play className="h-4 w-4 mr-2" />
                      {mod.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Full Launch Modules — Locked */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-100">Full Launch Modules</h2>
          <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
        </div>
        <p className="text-muted-foreground">
          When the full platform launches, your account unlocks all {lockedModules.length + 3} modules across 4 weeks — no re-signup needed.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {lockedModules.map(mod => (
            <div key={mod.path} className="relative">
              <Card className="opacity-60 select-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{mod.name}</CardTitle>
                  <CardDescription className="text-xs">
                    Week {mod.weekNumber}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-7 bg-muted rounded" />
                </CardContent>
              </Card>
              <LockedModuleBadge />
            </div>
          ))}
        </div>
      </section>

      {/* Full Launch CTA */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="text-center py-8 space-y-4">
          <h3 className="text-2xl font-bold">Your data is already saved.</h3>
          <p className="text-primary-foreground/90 max-w-md mx-auto">
            When the full PE Ready platform launches, everything you've done here carries over automatically — all modules unlock instantly.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/portal/week-3/ebitda-calculator">
              Start with EBITDA Calculator
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
