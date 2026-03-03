
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import AuthPage from './pages/AuthPage';
import AssessmentPage from './pages/AssessmentPage';
import ClientPortalDashboard from './pages/ClientPortalDashboard';
import DueDiligenceChecklistPage from './pages/week-4/DueDiligenceChecklistPage';
import LOIReviewPage from './pages/LOIReviewPage';
import FinalReportPage from './pages/week-4/FinalReportPage';
import StrategyDocBuilderPage from './pages/StrategyDocBuilderPage';
import KPIandOKRPage from './pages/KPIandOKRPage';
import InteractiveGlossaryPage from './pages/GlossaryPage';
import DealProgressionPage from './pages/DealProgressionPage';
import ProfessionalAdvisorsPage from './pages/ProfessionalAdvisorsPage';
import KnowYourBuyerPage from './pages/KnowYourBuyerPage';
import AssetFreeEducationPage from './pages/AssetFreeEducationPage';
import TimeKillsDealsPage from './pages/TimeKillsDealsPage';
import EBITDAExplainedPage from './pages/EBITDACoursePage';
import DataRoomPage from './pages/DataRoomPage';
import { DataRoomIntroPage } from './pages/DataRoomIntroPage';
import { DataRoomWorkspacePage } from './pages/DataRoomWorkspacePage';
import AssetWorkshopPage from './pages/AssetWorkshopPage';
import HoldCoStructurePage from './pages/week-2/HoldCoStructurePage';
import QuickWinsPage from './pages/QuickWinsPage';
import DebtInterestPage from './pages/week-2/DebtInterestPage';
import EarnoutsMultipliersPage from './pages/week-2/EarnoutsMultipliersPage';
import PostClosingRealityPage from './pages/week-2/PostClosingRealityPage';
import EbitdaCalculatorPage from './pages/EBITDACalculatorPage';
import MultiplesPage from './pages/IndustryMultiplesPage';
import { ScenarioPlanningPage } from './pages/ScenarioPlanningPage';
import ScorecardPage from './pages/week-3/ManagementScorecardPage';
import TopPerformersPage from './pages/week-3/TopPerformersPage';
import BusinessScorecardPage from './pages/week-3/BusinessScorecardPage';
import DealKillersPage from './pages/week-3/DealKillersDiagnosticPage';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminInquiries from './pages/AdminInquiries';
import AdminCompanyDetail from './pages/AdminCompanyDetail';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import { AuthProvider } from './components/AuthProvider';
import { ProgressProvider } from './components/ProgressProvider';
import { ClientPortalLayout } from './components/ClientPortalLayout';
import { ScheduleConsultationPage } from './pages/ScheduleConsultationPage';
import DiscoveryInterviewPage from './pages/DiscoveryInterviewPage';
import ExecutiveDiscoveryInterviewPage from './pages/ExecutiveDiscoveryInterviewPage';
import RealityCheck from './pages/RealityCheck';
import { MVPModuleGuard } from './components/mvp/MVPModuleGuard';

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProgressProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/reality-check" element={<RealityCheck />} />
              
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
              <Route path="/portal/schedule-consultation" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/schedule-consultation"><ScheduleConsultationPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />

              {/* Week 1 Routes — locked in mini-mvp */}
              <Route path="/portal/week-1/glossary" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-1/glossary"><InteractiveGlossaryPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-1/deal-progression" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-1/deal-progression"><DealProgressionPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-1/professional-advisors" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-1/professional-advisors"><ProfessionalAdvisorsPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-1/know-your-buyer" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-1/know-your-buyer"><KnowYourBuyerPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-1/asset-free-education" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-1/asset-free-education"><AssetFreeEducationPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-1/time-kills-deals" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-1/time-kills-deals"><TimeKillsDealsPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-1/ebitda-course" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-1/ebitda-course"><EBITDAExplainedPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />

              {/* Week 2 Routes — locked in mini-mvp */}
              <Route path="/portal/week-2/data-room" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-2/data-room"><DataRoomIntroPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-2/data-room/workspace" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-2/data-room/workspace"><DataRoomWorkspacePage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-2/data-room/advanced" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-2/data-room/advanced"><DataRoomPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-2/asset-workshop" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-2/asset-workshop"><AssetWorkshopPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-2/holdco-structure" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-2/holdco-structure"><HoldCoStructurePage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-2/quick-wins" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-2/quick-wins"><QuickWinsPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-2/debt-interest" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-2/debt-interest"><DebtInterestPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-2/earnouts-multipliers" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-2/earnouts-multipliers"><EarnoutsMultipliersPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-2/post-closing-reality" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-2/post-closing-reality"><PostClosingRealityPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />

              {/* Week 3 Routes — EBITDA Calculator, Business Scorecard, Deal Killers are MVP-enabled */}
              <Route path="/portal/week-3/ebitda-calculator" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-3/ebitda-calculator"><EbitdaCalculatorPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-3/multiples" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-3/multiples"><MultiplesPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-3/industry-multipliers" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-3/industry-multipliers"><MultiplesPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-3/scenarios" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-3/scenarios"><ScenarioPlanningPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-3/scorecard" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-3/scorecard"><ScorecardPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-3/top-performers" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-3/top-performers"><TopPerformersPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-3/business-scorecard" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-3/business-scorecard"><BusinessScorecardPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-3/deal-killers" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-3/deal-killers"><DealKillersPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />

              {/* Week 4 Routes — locked in mini-mvp */}
              <Route path="/portal/week-4/dd-checklist" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-4/dd-checklist"><DueDiligenceChecklistPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-4/loi-review" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-4/loi-review"><LOIReviewPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-4/final-report" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-4/final-report"><FinalReportPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-4/discovery-interview" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-4/discovery-interview"><DiscoveryInterviewPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-4/executive-discovery" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-4/executive-discovery"><ExecutiveDiscoveryInterviewPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-4/value-builder" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-4/value-builder"><StrategyDocBuilderPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              <Route path="/portal/week-4/kpis-okrs" element={
                <ClientPortalLayout>
                  <MVPModuleGuard modulePath="/portal/week-4/kpis-okrs"><KPIandOKRPage /></MVPModuleGuard>
                </ClientPortalLayout>
              } />
              
              {/* Catch-all 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ProgressProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
