
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
              <Route path="/portal/schedule-consultation" element={<ClientPortalLayout><ScheduleConsultationPage /></ClientPortalLayout>} />

              {/* Week 1 Routes */}
              <Route path="/portal/week-1/glossary" element={<ClientPortalLayout><InteractiveGlossaryPage /></ClientPortalLayout>} />
              <Route path="/portal/week-1/deal-progression" element={<ClientPortalLayout><DealProgressionPage /></ClientPortalLayout>} />
              <Route path="/portal/week-1/professional-advisors" element={<ClientPortalLayout><ProfessionalAdvisorsPage /></ClientPortalLayout>} />
              <Route path="/portal/week-1/know-your-buyer" element={<ClientPortalLayout><KnowYourBuyerPage /></ClientPortalLayout>} />
              <Route path="/portal/week-1/asset-free-education" element={<ClientPortalLayout><AssetFreeEducationPage /></ClientPortalLayout>} />
              <Route path="/portal/week-1/time-kills-deals" element={<ClientPortalLayout><TimeKillsDealsPage /></ClientPortalLayout>} />
              <Route path="/portal/week-1/ebitda-course" element={<ClientPortalLayout><EBITDAExplainedPage /></ClientPortalLayout>} />

              {/* Week 2 Routes */}
              <Route path="/portal/week-2/data-room" element={<ClientPortalLayout><DataRoomIntroPage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/data-room/workspace" element={<ClientPortalLayout><DataRoomWorkspacePage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/data-room/advanced" element={<ClientPortalLayout><DataRoomPage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/asset-workshop" element={<ClientPortalLayout><AssetWorkshopPage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/holdco-structure" element={<ClientPortalLayout><HoldCoStructurePage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/quick-wins" element={<ClientPortalLayout><QuickWinsPage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/debt-interest" element={<ClientPortalLayout><DebtInterestPage /></ClientPortalLayout>} />
              <Route path="/portal/week-2/earnouts-multipliers" element={<ClientPortalLayout><EarnoutsMultipliersPage /></ClientPortalLayout>} />
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

              {/* Week 4 Routes */}
              <Route path="/portal/week-4/dd-checklist" element={<ClientPortalLayout><DueDiligenceChecklistPage /></ClientPortalLayout>} />
              <Route path="/portal/week-4/loi-review" element={<ClientPortalLayout><LOIReviewPage /></ClientPortalLayout>} />
              <Route path="/portal/week-4/final-report" element={<ClientPortalLayout><FinalReportPage /></ClientPortalLayout>} />
              <Route path="/portal/week-4/discovery-interview" element={<ClientPortalLayout><DiscoveryInterviewPage /></ClientPortalLayout>} />
              <Route path="/portal/week-4/executive-discovery" element={<ClientPortalLayout><ExecutiveDiscoveryInterviewPage /></ClientPortalLayout>} />
              <Route path="/portal/week-4/value-builder" element={<ClientPortalLayout><StrategyDocBuilderPage /></ClientPortalLayout>} />
              <Route path="/portal/week-4/kpis-okrs" element={<ClientPortalLayout><KPIandOKRPage /></ClientPortalLayout>} />
              
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
