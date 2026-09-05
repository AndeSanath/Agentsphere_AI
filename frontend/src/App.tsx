import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ICPPage } from './pages/ICPPage';
import { NewSearchPage } from './pages/NewSearchPage';
import { AgentWorkflowPage } from './pages/AgentWorkflowPage';
import { ProspectResultsPage } from './pages/ProspectResultsPage';
import { OrganizationDetailsPage } from './pages/OrganizationDetailsPage';
import { ResearchActivityPage } from './pages/ResearchActivityPage';
import { HumanReviewPage } from './pages/HumanReviewPage';
import { AgentManagementPage } from './pages/AgentManagementPage';
import { SearchHistoryPage } from './pages/SearchHistoryPage';
import { SharedMemoryViewPage } from './pages/SharedMemoryViewPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-slate-100 font-sans antialiased">
      <Sidebar pendingReviewsCount={1} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar isDemoMode={false} />
        <main className="flex-1 overflow-y-auto pb-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/icp" element={<ICPPage />} />
          <Route path="/search/new" element={<ICPPage />} />
          <Route path="/workflow" element={<AgentWorkflowPage />} />
          <Route path="/prospects" element={<ProspectResultsPage />} />
          <Route path="/prospects/:id" element={<OrganizationDetailsPage />} />
          <Route path="/activity" element={<ResearchActivityPage />} />
          <Route path="/review" element={<HumanReviewPage />} />
          <Route path="/agents" element={<AgentManagementPage />} />
          <Route path="/history" element={<SearchHistoryPage />} />
          <Route path="/memory" element={<SharedMemoryViewPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
