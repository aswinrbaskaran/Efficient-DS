import { createBrowserRouter } from 'react-router';
import { Shell } from './pages/Shell';
import { HomePage } from './pages/HomePage';
import { FoundationsPage } from './pages/FoundationsPage';
import { ComponentsPage } from './pages/ComponentsPage';
import { NavigationPage } from './pages/NavigationPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { IDEPage } from './pages/IDEPage';
import { SettingsPage } from './pages/SettingsPage';
import { UsersPage } from './pages/UsersPage';
import { MarketingDashboardPage } from './pages/MarketingDashboardPage';
import { EcommercePage } from './pages/EcommercePage';
import { CRMPage } from './pages/CRMPage';
import { ProjectManagementPage } from './pages/ProjectManagementPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { LMSPage } from './pages/LMSPage';
import { FinancialPage } from './pages/FinancialPage';
import { AIToolPage } from './pages/AIToolPage';
import { SocialMediaPage } from './pages/SocialMediaPage';
import { HRPortalPage } from './pages/HRPortalPage';
import { SupportPage } from './pages/SupportPage';
import { PermissionsPage } from './pages/PermissionsPage';
import { FileManagerPage } from './pages/FileManagerPage';
import { DataMonitoringPage } from './pages/DataMonitoringPage';
import { AgentPage } from './pages/AgentPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Shell,
    children: [
      { index: true, Component: HomePage },
      { path: 'foundations', Component: FoundationsPage },
      { path: 'components', Component: ComponentsPage },
      { path: 'navigation', Component: NavigationPage },
      // Original layouts
      { path: 'layouts/dashboard', Component: DashboardPage },
      { path: 'layouts/admin', Component: AdminPage },
      { path: 'layouts/ide', Component: IDEPage },
      { path: 'layouts/settings', Component: SettingsPage },
      { path: 'layouts/users', Component: UsersPage },
      // Analytics & Marketing
      { path: 'layouts/marketing', Component: MarketingDashboardPage },
      { path: 'layouts/finance', Component: FinancialPage },
      { path: 'layouts/monitoring', Component: DataMonitoringPage },
      { path: 'layouts/social-media', Component: SocialMediaPage },
      // Commerce & CRM
      { path: 'layouts/ecommerce', Component: EcommercePage },
      { path: 'layouts/crm', Component: CRMPage },
      // Productivity Tools
      { path: 'layouts/projects', Component: ProjectManagementPage },
      { path: 'layouts/knowledge-base', Component: KnowledgeBasePage },
      { path: 'layouts/lms', Component: LMSPage },
      { path: 'layouts/ai-tool', Component: AIToolPage },
      { path: 'layouts/agent', Component: AgentPage },
      // Operations
      { path: 'layouts/support', Component: SupportPage },
      { path: 'layouts/hr', Component: HRPortalPage },
      { path: 'layouts/permissions', Component: PermissionsPage },
      { path: 'layouts/files', Component: FileManagerPage },
    ],
  },
]);
