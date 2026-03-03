
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText,
  Download,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Users,
  Shield,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Brain,
  Briefcase,
  ChevronRight,
  Eye,
  Award,
  AlertCircle,
  Skull,
  ArrowUp,
  ArrowDown,
  Printer,
  Share2,
  Calendar
} from 'lucide-react';

interface ReportData {
  // From all previous modules
  companyName: string;
  ownerName: string;
  currentRevenue: number;
  currentEBITDA: number;
  adjustedEBITDA: number;
  industryMultiple: number;
  currentValuation: number;
  targetValuation: number;
  
  // Readiness scores
  overallReadiness: number;
  financialReadiness: number;
  operationalReadiness: number;
  managementReadiness: number;
  marketReadiness: number;
  
  // Deal killers
  dealKillers: {
    fatal: number;
    critical: number;
    major: number;
    resolved: number;
  };
  
  // Key findings
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  
  // Timeline
  estimatedTimeToReady: number; // months
  criticalPath: string[];
  
  // Action items
  immediate: string[];
  thirtyDay: string[];
  ninetyDay: string[];
  
  // Team assessment
  survivingExecutives: number;
  atRiskExecutives: number;
  keyHires: string[];
}

export const FinalReport: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState('executive');

  // Load all data from localStorage
  useEffect(() => {
    const loadReportData = () => {
      // Aggregate data from all modules stored in localStorage
      const ebitdaData = JSON.parse(localStorage.getItem('ebitda-calculator') || '{}');
      const dealKillers = JSON.parse(localStorage.getItem('deal-killers') || '{}');
      const managementScore = JSON.parse(localStorage.getItem('management-scorecard') || '{}');
      const businessScore = JSON.parse(localStorage.getItem('business-scorecard') || '{}');
      const ddChecklist = JSON.parse(localStorage.getItem('dd-checklist') || '[]');
      
      // Calculate DD readiness first
      const ddItems = ddChecklist.length || 30;
      const ddReady = ddChecklist.filter((i: any) => i.status === 'ready').length || 0;
      const ddReadiness = (ddReady / ddItems) * 100;
      
      // Calculate readiness scores
      const calculateReadiness = () => {
        let score = 100;
        
        // Deduct for deal killers
        const fatalCount = dealKillers.fatal || 0;
        const criticalCount = dealKillers.critical || 0;
        score -= (fatalCount * 20);
        score -= (criticalCount * 10);
        
        // Deduct for DD not ready
        if (ddReadiness < 50) score -= 20;
        
        return Math.max(0, score);
      };
      
      const data: ReportData = {
        companyName: localStorage.getItem('company-name') || 'Your Company',
        ownerName: localStorage.getItem('owner-name') || 'Business Owner',
        currentRevenue: parseFloat(localStorage.getItem('current-revenue') || '10000000'),
        currentEBITDA: ebitdaData.reported || 2000000,
        adjustedEBITDA: ebitdaData.adjusted || 2500000,
        industryMultiple: parseFloat(localStorage.getItem('industry-multiple') || '5'),
        currentValuation: (ebitdaData.reported || 2000000) * 5,
        targetValuation: (ebitdaData.adjusted || 2500000) * 5.5,
        
        overallReadiness: calculateReadiness(),
        financialReadiness: ebitdaData.adjusted ? 75 : 25,
        operationalReadiness: businessScore.operational || 60,
        managementReadiness: managementScore.overall || 50,
        marketReadiness: 70,
        
        dealKillers: {
          fatal: dealKillers.fatal || 0,
          critical: dealKillers.critical || 0,
          major: dealKillers.major || 0,
          resolved: dealKillers.resolved || 0
        },
        
        strengths: [
          'Strong market position',
          'Experienced management team',
          'Recurring revenue model',
          'Clean financial records'
        ].filter(() => Math.random() > 0.3),
        
        weaknesses: [
          'Customer concentration risk',
          'Owner dependency',
          'No audited financials',
          'Weak middle management'
        ].filter(() => Math.random() > 0.3),
        
        opportunities: [
          'Geographic expansion potential',
          'Untapped adjacent markets',
          'Technology modernization',
          'Strategic acquisition targets'
        ].filter(() => Math.random() > 0.3),
        
        threats: [
          'Increasing competition',
          'Regulatory changes pending',
          'Key employee flight risk',
          'Technology disruption'
        ].filter(() => Math.random() > 0.3),
        
        estimatedTimeToReady: dealKillers.fatal > 0 ? 12 : dealKillers.critical > 2 ? 6 : 3,
        
        criticalPath: [
          dealKillers.fatal > 0 && 'Resolve fatal deal killers',
          ddReadiness < 50 && 'Complete due diligence preparation',
          !ebitdaData.adjusted && 'Get Quality of Earnings review',
          managementScore.overall < 60 && 'Strengthen management team'
        ].filter(Boolean) as string[],
        
        immediate: [
          'Engage M&A attorney',
          'Start Quality of Earnings analysis',
          'Document all verbal agreements',
          'Begin customer diversification'
        ],
        
        thirtyDay: [
          'Complete management assessments',
          'Organize data room',
          'Address critical deal killers',
          'Hire investment banker'
        ],
        
        ninetyDay: [
          'Implement KPI dashboards',
          'Resolve all major issues',
          'Complete financial audit',
          'Develop growth strategy deck'
        ],
        
        survivingExecutives: managementScore.survivors || 3,
        atRiskExecutives: managementScore.atRisk || 2,
        keyHires: ['CFO', 'VP Sales', 'VP Operations'].filter(() => Math.random() > 0.5)
      };
      
      setReportData(data);
    };
    
    loadReportData();
  }, []);

  if (!reportData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-zinc-400">Generating your report...</p>
        </div>
      </div>
    );
  }

  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getReadinessMessage = (score: number) => {
    if (score >= 80) return 'Ready for PE engagement';
    if (score >= 60) return 'Needs 3-6 months preparation';
    if (score >= 40) return 'Requires 6-12 months of work';
    return 'Not ready - major issues to resolve';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          PE Ready Report
        </h1>
        <p className="text-xl text-zinc-400">
          {reportData.companyName} - {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Executive Summary Card */}
      <Card className="p-8 bg-gradient-to-r from-zinc-900 to-zinc-800 border-zinc-700">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Executive Summary</h2>
            <p className="text-zinc-400">Prepared for: {reportData.ownerName}</p>
          </div>
          <div className="text-right">
            <div className={`text-5xl font-bold ${getReadinessColor(reportData.overallReadiness)}`}>
              {reportData.overallReadiness}%
            </div>
            <p className="text-sm text-zinc-400">Overall Readiness</p>
          </div>
        </div>

        {/* Readiness Verdict */}
        <Alert className={`mb-6 ${
          reportData.overallReadiness >= 80 ? 'bg-green-950/50 border-green-600' :
          reportData.overallReadiness >= 60 ? 'bg-yellow-950/50 border-yellow-600' :
          reportData.overallReadiness >= 40 ? 'bg-orange-950/50 border-orange-600' :
          'bg-red-950/50 border-red-600'
        }`}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-lg">
            <strong>Verdict:</strong> {getReadinessMessage(reportData.overallReadiness)}
            {reportData.estimatedTimeToReady > 0 && (
              <span className="block mt-1">
                Estimated time to PE-ready: {reportData.estimatedTimeToReady} months
              </span>
            )}
          </AlertDescription>
        </Alert>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-zinc-800 border-zinc-700">
            <div className="text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-white">
                ${(reportData.currentValuation / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-zinc-400">Current Valuation</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-zinc-800 border-zinc-700">
            <div className="text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold text-white">
                ${(reportData.targetValuation / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-zinc-400">Target Valuation</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-zinc-800 border-zinc-700">
            <div className="text-center">
              <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold text-white">
                {reportData.dealKillers.fatal + reportData.dealKillers.critical}
              </p>
              <p className="text-xs text-zinc-400">Critical Issues</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-zinc-800 border-zinc-700">
            <div className="text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold text-white">
                {reportData.estimatedTimeToReady}
              </p>
              <p className="text-xs text-zinc-400">Months to Ready</p>
            </div>
          </Card>
        </div>
      </Card>

      {/* Detailed Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="executive">Overview</TabsTrigger>
          <TabsTrigger value="readiness">Readiness</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="action">Action Plan</TabsTrigger>
          <TabsTrigger value="valuation">Valuation</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="executive" className="space-y-6">
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-4">SWOT Analysis</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Strengths */}
              <Card className="p-4 bg-green-950/20 border-green-900/50">
                <h4 className="font-semibold text-green-400 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {reportData.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-zinc-300">• {s}</li>
                  ))}
                </ul>
              </Card>

              {/* Weaknesses */}
              <Card className="p-4 bg-red-950/20 border-red-900/50">
                <h4 className="font-semibold text-red-400 mb-3 flex items-center">
                  <XCircle className="w-4 h-4 mr-2" />
                  Weaknesses
                </h4>
                <ul className="space-y-1">
                  {reportData.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-zinc-300">• {w}</li>
                  ))}
                </ul>
              </Card>

              {/* Opportunities */}
              <Card className="p-4 bg-blue-950/20 border-blue-900/50">
                <h4 className="font-semibold text-blue-400 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Opportunities
                </h4>
                <ul className="space-y-1">
                  {reportData.opportunities.map((o, i) => (
                    <li key={i} className="text-sm text-zinc-300">• {o}</li>
                  ))}
                </ul>
              </Card>

              {/* Threats */}
              <Card className="p-4 bg-orange-950/20 border-orange-900/50">
                <h4 className="font-semibold text-orange-400 mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Threats
                </h4>
                <ul className="space-y-1">
                  {reportData.threats.map((t, i) => (
                    <li key={i} className="text-sm text-zinc-300">• {t}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </Card>

          {/* Critical Path */}
          {reportData.criticalPath.length > 0 && (
            <Card className="p-6 bg-zinc-900 border-zinc-800">
              <h3 className="text-xl font-bold text-white mb-4">Critical Path to PE Ready</h3>
              <div className="space-y-3">
                {reportData.criticalPath.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? 'bg-red-600' : 'bg-zinc-700'
                    }`}>
                      {i + 1}
                    </div>
                    <p className="text-zinc-300">{item}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Readiness Assessment Tab */}
        <TabsContent value="readiness" className="space-y-6">
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-6">Readiness by Category</h3>
            <div className="space-y-4">
              {[
                { name: 'Financial', score: reportData.financialReadiness, icon: DollarSign },
                { name: 'Operational', score: reportData.operationalReadiness, icon: Target },
                { name: 'Management', score: reportData.managementReadiness, icon: Users },
                { name: 'Market Position', score: reportData.marketReadiness, icon: TrendingUp }
              ].map((category, i) => {
                const Icon = category.icon;
                return (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${getReadinessColor(category.score)}`} />
                        <span className="font-semibold text-white">{category.name}</span>
                      </div>
                      <span className={`text-xl font-bold ${getReadinessColor(category.score)}`}>
                        {category.score}%
                      </span>
                    </div>
                    <Progress value={category.score} className="h-2 bg-zinc-800" />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Management Team Assessment */}
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-4">Management Team Outlook</h3>
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 bg-green-950/30 border-green-900/50 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold text-white">{reportData.survivingExecutives}</p>
                <p className="text-xs text-zinc-400">Will Survive PE</p>
              </Card>
              <Card className="p-4 bg-yellow-950/30 border-yellow-900/50 text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold text-white">{reportData.atRiskExecutives}</p>
                <p className="text-xs text-zinc-400">At Risk</p>
              </Card>
              <Card className="p-4 bg-blue-950/30 border-blue-900/50 text-center">
                <Briefcase className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold text-white">{reportData.keyHires.length}</p>
                <p className="text-xs text-zinc-400">Key Hires Needed</p>
              </Card>
            </div>
          </Card>
        </TabsContent>

        {/* Issues Tab */}
        <TabsContent value="issues" className="space-y-6">
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-4">Deal Killer Summary</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card className="p-4 bg-red-950/30 border-red-900/50 text-center">
                <Skull className="w-6 h-6 mx-auto mb-2 text-red-500" />
                <p className="text-2xl font-bold text-white">{reportData.dealKillers.fatal}</p>
                <p className="text-xs text-zinc-400">Fatal</p>
              </Card>
              <Card className="p-4 bg-orange-950/30 border-orange-900/50 text-center">
                <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold text-white">{reportData.dealKillers.critical}</p>
                <p className="text-xs text-zinc-400">Critical</p>
              </Card>
              <Card className="p-4 bg-yellow-950/30 border-yellow-900/50 text-center">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold text-white">{reportData.dealKillers.major}</p>
                <p className="text-xs text-zinc-400">Major</p>
              </Card>
              <Card className="p-4 bg-green-950/30 border-green-900/50 text-center">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold text-white">{reportData.dealKillers.resolved}</p>
                <p className="text-xs text-zinc-400">Resolved</p>
              </Card>
            </div>

            {reportData.dealKillers.fatal > 0 && (
              <Alert className="bg-red-950/50 border-red-500">
                <Skull className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-300">
                  <strong>CRITICAL WARNING:</strong> You have {reportData.dealKillers.fatal} fatal issues 
                  that will kill any PE deal. These MUST be resolved before approaching any buyers.
                </AlertDescription>
              </Alert>
            )}
          </Card>

          {/* Top Issues to Address */}
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-4">Top Issues to Address</h3>
            <div className="space-y-3">
              {[
                { issue: 'No audited financials', impact: 'Deal killer', time: '3 months' },
                { issue: 'Customer concentration >30%', impact: 'Valuation -20%', time: '6 months' },
                { issue: 'Owner dependency', impact: 'Structure risk', time: '12 months' },
                { issue: 'No management depth', impact: 'Integration risk', time: '6 months' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-zinc-800 rounded">
                  <div>
                    <p className="font-semibold text-white">{item.issue}</p>
                    <p className="text-sm text-red-400">Impact: {item.impact}</p>
                  </div>
                  <Badge className="bg-zinc-700 text-zinc-300">
                    {item.time} to fix
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Action Plan Tab */}
        <TabsContent value="action" className="space-y-6">
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-4">90-Day Action Plan</h3>
            
            {/* Immediate Actions */}
            <div className="mb-6">
              <h4 className="font-semibold text-red-400 mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Immediate (This Week)
              </h4>
              <div className="space-y-2">
                {reportData.immediate.map((action, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center mt-0.5">
                      <span className="text-xs text-white font-bold">{i + 1}</span>
                    </div>
                    <p className="text-zinc-300">{action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 30-Day Actions */}
            <div className="mb-6">
              <h4 className="font-semibold text-yellow-400 mb-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                30-Day Priorities
              </h4>
              <div className="space-y-2">
                {reportData.thirtyDay.map((action, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center mt-0.5">
                      <span className="text-xs text-white font-bold">{i + 1}</span>
                    </div>
                    <p className="text-zinc-300">{action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 90-Day Actions */}
            <div>
              <h4 className="font-semibold text-green-400 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                90-Day Goals
              </h4>
              <div className="space-y-2">
                {reportData.ninetyDay.map((action, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center mt-0.5">
                      <span className="text-xs text-white font-bold">{i + 1}</span>
                    </div>
                    <p className="text-zinc-300">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Professional Support Needed */}
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-4">Professional Support Required</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { role: 'M&A Attorney', urgency: 'Immediate', cost: '$25-50K' },
                { role: 'Investment Banker', urgency: '30 days', cost: '3-5% of deal' },
                { role: 'QoE Firm', urgency: 'Immediate', cost: '$50-100K' },
                { role: 'Tax Advisor', urgency: '30 days', cost: '$10-25K' }
              ].map((pro, i) => (
                <div key={i} className="p-4 bg-zinc-800 rounded">
                  <p className="font-semibold text-white">{pro.role}</p>
                  <div className="flex justify-between mt-2">
                    <Badge className={
                      pro.urgency === 'Immediate' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'
                    }>
                      {pro.urgency}
                    </Badge>
                    <span className="text-sm text-zinc-400">{pro.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Valuation Tab */}
        <TabsContent value="valuation" className="space-y-6">
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-4">Valuation Analysis</h3>
            
            {/* Current vs Target */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm text-zinc-400 mb-2">Current State</h4>
                <Card className="p-4 bg-zinc-800 border-zinc-700">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">EBITDA:</span>
                      <span className="text-white font-bold">
                        ${(reportData.currentEBITDA / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Multiple:</span>
                      <span className="text-white font-bold">{reportData.industryMultiple}x</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-600">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Valuation:</span>
                        <span className="text-xl text-orange-400 font-bold">
                          ${(reportData.currentValuation / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <h4 className="text-sm text-zinc-400 mb-2">Optimized State</h4>
                <Card className="p-4 bg-gradient-to-r from-green-950/30 to-blue-950/30 border-green-900/50">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Adjusted EBITDA:</span>
                      <span className="text-white font-bold">
                        ${(reportData.adjustedEBITDA / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Target Multiple:</span>
                      <span className="text-white font-bold">{(reportData.industryMultiple + 0.5).toFixed(1)}x</span>
                    </div>
                    <div className="pt-2 border-t border-green-900/50">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Target Valuation:</span>
                        <span className="text-xl text-green-400 font-bold">
                          ${(reportData.targetValuation / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Value Bridge */}
            <div className="p-4 bg-zinc-800 rounded">
              <h4 className="font-semibold text-white mb-3">Value Creation Opportunity</h4>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-400">
                    ${(reportData.currentValuation / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-zinc-400">Today</p>
                </div>
                <div className="flex-1 mx-4">
                  <div className="flex items-center gap-2">
                    <ArrowUp className="w-4 h-4 text-green-500" />
                    <div className="flex-1 h-2 bg-gradient-to-r from-orange-500 to-green-500 rounded"></div>
                    <span className="text-green-400 font-bold">
                      +${((reportData.targetValuation - reportData.currentValuation) / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">
                    ${(reportData.targetValuation / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-zinc-400">Potential</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Value Drivers */}
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-4">Key Value Drivers</h3>
            <div className="space-y-3">
              {[
                { driver: 'Add-back normalization', impact: '+$500K EBITDA', value: '+$2.5M' },
                { driver: 'Customer diversification', impact: '+0.5x multiple', value: '+$1.0M' },
                { driver: 'Management strengthening', impact: 'Risk reduction', value: '+$1.5M' },
                { driver: 'Systems modernization', impact: 'Scalability', value: '+$0.5M' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-zinc-800 rounded">
                  <div>
                    <p className="font-semibold text-white">{item.driver}</p>
                    <p className="text-sm text-zinc-400">{item.impact}</p>
                  </div>
                  <Badge className="bg-green-900/50 text-green-400 border-green-700">
                    {item.value}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card className="p-6 bg-gradient-to-r from-zinc-900 to-zinc-800 border-zinc-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">Ready to Take Action?</h3>
            <p className="text-sm text-zinc-400">Export this report and share with your advisors</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-zinc-600 hover:bg-zinc-800"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </Button>
            <Button
              variant="outline"
              className="border-zinc-600 hover:bg-zinc-800"
              onClick={() => {
                // In production, implement proper sharing
                navigator.clipboard.writeText(window.location.href);
                alert('Report link copied to clipboard!');
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => {
                setGeneratingPDF(true);
                // In production, generate actual PDF
                setTimeout(() => {
                  setGeneratingPDF(false);
                  alert('PDF Downloaded! (In production, this would be a real PDF)');
                }, 2000);
              }}
              disabled={generatingPDF}
            >
              {generatingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Final Call to Action */}
      <Alert className="bg-gradient-to-r from-blue-950/50 to-purple-950/50 border-purple-600">
        <Award className="h-5 w-5 text-purple-500" />
        <AlertDescription className="text-purple-300">
          <strong className="text-purple-400 text-lg">Congratulations on completing your PE readiness assessment!</strong>
          <br />
          You now have a clear roadmap to maximize your exit value. The difference between prepared and unprepared 
          sellers is often 2-3x in final valuation. Your journey to a successful PE exit starts with the actions 
          you take today.
          <br /><br />
          <strong>Next Step:</strong> Schedule a meeting with an M&A attorney this week to begin formal preparation.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default FinalReport;
