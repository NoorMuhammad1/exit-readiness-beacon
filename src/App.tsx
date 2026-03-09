
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './components/AuthProvider';
import { ProgressProvider } from './components/ProgressProvider';
import { ClientPortalLayout } from './components/ClientPortalLayout';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import ErrorBoundary from './components/ErrorBoundary';

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Lazy load pages for better code splitting
const Index = lazy(() => import('./pages/Index'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminInquiries = lazy(() => import('./pages/AdminInquiries'));
const AdminCompanyDetail = lazy(() => import('./pages/AdminCompanyDetail'));

// Client Portal Dashboard
const ClientPortalDashboard = lazy(() => import('./pages/ClientPortalDashboard'));
const CompanyProfilePage = lazy(() => import('./pages/CompanyProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ScheduleConsultationPage = lazy(() => import('./pages/ScheduleConsultationPage').then(m => ({ default: m.ScheduleConsultationPage })));

// Week 1 pages
const InteractiveGlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const DealProgressionPage = lazy(() => import('./pages/DealProgressionPage'));
const ProfessionalAdvisorsPage = lazy(() => import('./pages/ProfessionalAdvisorsPage'));
const KnowYourBuyerPage = lazy(() => import('./pages/KnowYourBuyerPage'));
const AssetFreeEducationPage = lazy(() => import('./pages/AssetFreeEducationPage'));
const TimeKillsDealsPage = lazy(() => import('./pages/TimeKillsDealsPage'));
const EBITDAExplainedPage = lazy(() => import('./pages/EBITDACoursePage'));
const DealProcessRoadmapPage = lazy(() => import('./pages/week-1/DealProcessRoadmapPage'));
const LBOExplainerPage = lazy(() => import('./pages/week-1/LBOExplainerPage'));
const EmotionalReadinessPage = lazy(() => import('./pages/week-1/EmotionalReadinessPage'));
const WhenToWalkPage = lazy(() => import('./pages/week-1/WhenToWalkPage'));

// Week 4 new modules
const RepsWarrantiesPage = lazy(() => import('./pages/week-4/RepsWarrantiesPage'));

// Week 2 pages
const QoEExplainerPage = lazy(() => import('./pages/week-2/QoEExplainerPage'));
const WorkingCapitalPage = lazy(() => import('./pages/week-2/WorkingCapitalPage'));
const TaxStructuringPage = lazy(() => import('./pages/week-2/TaxStructuringPage'));
const DataRoomIntroPage = lazy(() => import('./pages/DataRoomIntroPage').then(m => ({ default: m.DataRoomIntroPage })));
const DataRoomWorkspacePage = lazy(() => import('./pages/DataRoomWorkspacePage').then(m => ({ default: m.DataRoomWorkspacePage })));
const DataRoomPage = lazy(() => import('./pages/DataRoomPage'));
const AssetWorkshopPage = lazy(() => import('./pages/AssetWorkshopPage'));
const HoldCoStructurePage = lazy(() => import('./pages/week-2/HoldCoStructurePage'));
const QuickWinsPage = lazy(() => import('./pages/QuickWinsPage'));
const DebtInterestPage = lazy(() => import('./pages/week-2/DebtInterestPage'));
const EarnoutsMultipliersPage = lazy(() => import('./pages/week-2/EarnoutsMultipliersPage'));
const RolloverEquityPage = lazy(() => import('./pages/week-2/RolloverEquityPage'));
const PostClosingRealityPage = lazy(() => import('./pages/week-2/PostClosingRealityPage'));

// Week 3 pages
const EbitdaCalculatorPage = lazy(() => import('./pages/EBITDACalculatorPage'));
const MultiplesPage = lazy(() => import('./pages/IndustryMultiplesPage'));
const ScenarioPlanningPage = lazy(() => import('./pages/ScenarioPlanningPage').then(m => ({ default: m.ScenarioPlanningPage })));
const ScorecardPage = lazy(() => import('./pages/week-3/ManagementScorecardPage'));
const TopPerformersPage = lazy(() => import('./pages/week-3/TopPerformersPage'));
const BusinessScorecardPage = lazy(() => import('./pages/week-3/BusinessScorecardPage'));
const DealKillersPage = lazy(() => import('./pages/week-3/DealKillersDiagnosticPage'));
const PEScreeningScorecardPage = lazy(() => import('./pages/week-3/PEScreeningScorecardPage'));
const CompetitiveAnalysisPage = lazy(() => import('./pages/week-3/CompetitiveAnalysisPage'));
const ReturnsSensitivityPage = lazy(() => import('./pages/week-3/ReturnsSensitivityPage'));
const ValueCreationPlanPage = lazy(() => import('./pages/week-3/ValueCreationPlanPage'));
const RevenueQualityPage = lazy(() => import('./pages/week-3/RevenueQualityPage'));

// Week 4 pages
const DueDiligenceChecklistPage = lazy(() => import('./pages/week-4/DueDiligenceChecklistPage'));
const LOIReviewPage = lazy(() => import('./pages/LOIReviewPage'));
const FinalReportPage = lazy(() => import('./pages/week-4/FinalReportPage'));
const DiscoveryInterviewPage = lazy(() => import('./pages/DiscoveryInterviewPage'));
const ExecutiveDiscoveryInterviewPage = lazy(() => import('./pages/ExecutiveDiscoveryInterviewPage'));
const StrategyDocBuilderPage = lazy(() => import('./pages/StrategyDocBuilderPage'));
const KPIandOKRPage = lazy(() => import('./pages/KPIandOKRPage'));
const AnonymousTeaserPage = lazy(() => import('./pages/week-4/AnonymousTeaserPage'));
const CIMGeneratorPage = lazy(() => import('./pages/week-4/CIMGeneratorPage'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ProgressProvider>
            <Router>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/assessment" element={<AssessmentPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              } />
              <Route path="/admin/inquiries" element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminInquiries />
                  </AdminLayout>
                </AdminRoute>
              } />
              <Route path="/admin/companies/:id" element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminCompanyDetail />
                  </AdminLayout>
                </AdminRoute>
              } />
              
              {/* Client Portal Routes */}
              <Route path="/portal" element={<ClientPortalLayout><ClientPortalDashboard /></ClientPortalLayout>} />
              <Route path="/portal/schedule-consultation" element={<ClientPortalLayout><ScheduleConsultationPage /></ClientPortalLayout>} />
              <Route path="/portal/company-profile" element={<ClientPortalLayout><CompanyProfilePage /></ClientPortalLayout>} />
              <Route path="/portal/settings" element={<ClientPortalLayout><SettingsPage /></ClientPortalLayout>} />

              {/* Week 1 Routes */}
              <Route path="/portal/week-1/glossary" element={<ClientPortalLayout><InteractiveGlossaryPage /></ClientPortalLayout>} />
              <Route path="/portal/week-1/deal-progression" element={<ClientPortalLayout><DealProgressionPage /></ClientPortalLayout>} />
              <Route path="/portal/week-1/professional-advisors" element={<ClientPortalLayout><ProfessionalAdvisorsPage /></ClientPortalLayout>} />
              <Route path="/portal/week-1/know-your-buyer" element={<ClientPortalLayout><KnowYourBuyerPage /></ClientPortalLayout>} />
              <Route path="/portal/week-1/asset-free-education" element={<ClientPortalLayout><AssetFreeEducationPage /></ClientPortalLayout>} />
              <Route path="/portal/week-1/time-kills-deals" element={<ClientPortalLayout><TimeKillsDealsPage /></ClientPortalLayout>} />
              <Route path="/portal/week-1/ebitda-course" element={<ClientPortalLayout><EBITDAExplainedPage /></ClientPortalLayout>} />
              <Route path="/portal/week-1/deal-process" element={<ClientPortalLayout><DealProcessRoadmapPage /></ClientPortalLayout>} />
              <Route path="/portal/week-1/lbo-explainer" element={<ClientPortalLayout><LBOExplainerPage /></ClientPortalLayout>} />
              <Route path="/portal/week-1/emotional-readiness" element={<ClientPortalLayout><EmotionalReadinessPage /></ClientPortalLayout>} />
              <Route path="/portal/week-1/when-to-walk" element={<ClientPortalLayout><WhenToWalkPage /></ClientPortalLayout>} />

              {/* Week 2 Routes */}
              <Route path="/portal/week-2/qoe-explainer" element={<ClientPortalLayout><QoEExplainerPage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/working-capital" element={<ClientPortalLayout><WorkingCapitalPage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/tax-structuring" element={<ClientPortalLayout><TaxStructuringPage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/data-room" element={<ClientPortalLayout><DataRoomIntroPage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/data-room/workspace" element={<ClientPortalLayout><DataRoomWorkspacePage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/data-room/advanced" element={<ClientPortalLayout><DataRoomPage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/asset-workshop" element={<ClientPortalLayout><AssetWorkshopPage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/holdco-structure" element={<ClientPortalLayout><HoldCoStructurePage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/quick-wins" element={<ClientPortalLayout><QuickWinsPage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/debt-interest" element={<ClientPortalLayout><DebtInterestPage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/earnouts-multipliers" element={<ClientPortalLayout><EarnoutsMultipliersPage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/rollover-equity" element={<ClientPortalLayout><RolloverEquityPage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/post-closing-reality" element={<ClientPortalLayout><PostClosingRealityPage /></ClientPortalLayout>} />

              {/* Week 3 Routes */}
              <Route path="/portal/week-3/ebitda-calculator" element={<ClientPortalLayout><EbitdaCalculatorPage /></ClientPortalLayout>} />
              <Route path="/portal/week-3/multiples" element={<ClientPortalLayout><MultiplesPage /></ClientPortalLayout>} />
              <Route path="/portal/week-3/industry-multipliers" element={<ClientPortalLayout><MultiplesPage /></ClientPortalLayout>} />
              <Route path="/portal/week-3/scenarios" element={<ClientPortalLayout><ScenarioPlanningPage /></ClientPortalLayout>} />
              <Route path="/portal/week-3/scorecard" element={<ClientPortalLayout><ScorecardPage /></ClientPortalLayout>} />
              <Route path="/portal/week-3/top-performers" element={<ClientPortalLayout><TopPerformersPage /></ClientPortalLayout>} />
              <Route path="/portal/week-3/business-scorecard" element={<ClientPortalLayout><BusinessScorecardPage /></ClientPortalLayout>} />
              <Route path="/portal/week-3/deal-killers" element={<ClientPortalLayout><DealKillersPage /></ClientPortalLayout>} />
              <Route path="/portal/week-3/pe-screening" element={<ClientPortalLayout><PEScreeningScorecardPage /></ClientPortalLayout>} />
              <Route path="/portal/week-3/competitive-analysis" element={<ClientPortalLayout><CompetitiveAnalysisPage /></ClientPortalLayout>} />
              <Route path="/portal/week-3/returns-sensitivity" element={<ClientPortalLayout><ReturnsSensitivityPage /></ClientPortalLayout>} />
              <Route path="/portal/week-3/value-creation" element={<ClientPortalLayout><ValueCreationPlanPage /></ClientPortalLayout>} />
              <Route path="/portal/week-3/revenue-quality" element={<ClientPortalLayout><RevenueQualityPage /></ClientPortalLayout>} />

              {/* Week 4 Routes */}
              <Route path="/portal/week-4/dd-checklist" element={<ClientPortalLayout><DueDiligenceChecklistPage /></ClientPortalLayout>} />
              <Route path="/portal/week-4/loi-review" element={<ClientPortalLayout><LOIReviewPage /></ClientPortalLayout>} />
              <Route path="/portal/week-4/reps-warranties" element={<ClientPortalLayout><RepsWarrantiesPage /></ClientPortalLayout>} />
              <Route path="/portal/week-4/final-report" element={<ClientPortalLayout><FinalReportPage /></ClientPortalLayout>} />
              <Route path="/portal/week-4/discovery-interview" element={<ClientPortalLayout><DiscoveryInterviewPage /></ClientPortalLayout>} />
              <Route path="/portal/week-4/executive-discovery" element={<ClientPortalLayout><ExecutiveDiscoveryInterviewPage /></ClientPortalLayout>} />
              <Route path="/portal/week-4/value-builder" element={<ClientPortalLayout><StrategyDocBuilderPage /></ClientPortalLayout>} />
              <Route path="/portal/week-4/kpis-okrs" element={<ClientPortalLayout><KPIandOKRPage /></ClientPortalLayout>} />
              <Route path="/portal/week-4/anonymous-teaser" element={<ClientPortalLayout><AnonymousTeaserPage /></ClientPortalLayout>} />
              <Route path="/portal/week-4/cim-generator" element={<ClientPortalLayout><CIMGeneratorPage /></ClientPortalLayout>} />
              
              {/* Catch-all 404 route */}
              <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Router>
          </ProgressProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
