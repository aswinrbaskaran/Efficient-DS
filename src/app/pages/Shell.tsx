import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router';
import { useTheme, type Theme } from '../context/ThemeContext';
import {
  LayoutDashboard, Layers, Component, Navigation, Settings, Users,
  Terminal, ChevronDown, ChevronRight, Sun, Moon, Contrast, Menu, X,
  Command, Palette, GitBranch, Shield,
  TrendingUp, ShoppingCart, UsersRound, Kanban, BookOpen, GraduationCap,
  DollarSign, Bot, Share2, UserRound, Headphones, Key, FolderOpen,
  Activity, ChartBar,
} from 'lucide-react';
import Logo from '../../imports/Logo';

interface NavItem {
  label: string;
  to?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Home', to: '/', icon: <Layers size={15} /> },
  {
    label: 'Foundations',
    to: '/foundations',
    icon: <Palette size={15} />,
  },
  {
    label: 'Components',
    to: '/components',
    icon: <Component size={15} />,
  },
  {
    label: 'Navigation Patterns',
    to: '/navigation',
    icon: <Navigation size={15} />,
  },
  {
    label: 'Developer & Admin',
    icon: <LayoutDashboard size={15} />,
    children: [
      { label: 'Enterprise Dashboard', to: '/layouts/dashboard', icon: <LayoutDashboard size={14} /> },
      { label: 'Admin Panel', to: '/layouts/admin', icon: <Shield size={14} /> },
      { label: 'Developer IDE', to: '/layouts/ide', icon: <Terminal size={14} /> },
      { label: 'Settings Page', to: '/layouts/settings', icon: <Settings size={14} /> },
      { label: 'User Management', to: '/layouts/users', icon: <Users size={14} /> },
    ],
  },
  {
    label: 'Analytics & Marketing',
    icon: <TrendingUp size={15} />,
    children: [
      { label: 'Marketing Dashboard', to: '/layouts/marketing', icon: <TrendingUp size={14} /> },
      { label: 'Financial SaaS', to: '/layouts/finance', icon: <DollarSign size={14} /> },
      { label: 'Data Monitoring', to: '/layouts/monitoring', icon: <Activity size={14} /> },
      { label: 'Social Media', to: '/layouts/social-media', icon: <Share2 size={14} /> },
    ],
  },
  {
    label: 'Commerce & CRM',
    icon: <ShoppingCart size={15} />,
    children: [
      { label: 'E-commerce Admin', to: '/layouts/ecommerce', icon: <ShoppingCart size={14} /> },
      { label: 'CRM System', to: '/layouts/crm', icon: <UsersRound size={14} /> },
    ],
  },
  {
    label: 'Productivity Tools',
    icon: <Kanban size={15} />,
    children: [
      { label: 'Project Management', to: '/layouts/projects', icon: <Kanban size={14} /> },
      { label: 'Knowledge Base', to: '/layouts/knowledge-base', icon: <BookOpen size={14} /> },
      { label: 'Learning (LMS)', to: '/layouts/lms', icon: <GraduationCap size={14} /> },
      { label: 'AI Tool Interface', to: '/layouts/ai-tool', icon: <Bot size={14} /> },
      { label: 'Agent Interface', to: '/layouts/agent', icon: <Cpu size={14} /> },
    ],
  },
  {
    label: 'Operations & HR',
    icon: <UserRound size={15} />,
    children: [
      { label: 'Customer Support', to: '/layouts/support', icon: <Headphones size={14} /> },
      { label: 'HR Portal', to: '/layouts/hr', icon: <UserRound size={14} /> },
      { label: 'Permissions & Audit', to: '/layouts/permissions', icon: <Key size={14} /> },
      { label: 'File Manager', to: '/layouts/files', icon: <FolderOpen size={14} /> },
    ],
  },
];

function NavItemRow({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isParentActive = hasChildren && item.children!.some(c => c.to === location.pathname);
  const [open, setOpen] = useState(isParentActive);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-left transition-colors group"
          style={{
            color: 'var(--ada-text-2)',
            fontSize: 'var(--ada-fs-sm)',
            fontWeight: 'var(--ada-fw-medium)',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-btn-ghost-hover)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          aria-expanded={open}
        >
          <span style={{ color: 'var(--ada-text-3)' }}>{item.icon}</span>
          <span className="flex-1">{item.label}</span>
          {open ? <ChevronDown size={13} style={{ color: 'var(--ada-text-3)' }} /> : <ChevronRight size={13} style={{ color: 'var(--ada-text-3)' }} />}
        </button>
        {open && (
          <div className="ml-3 mt-0.5 border-l pl-3" style={{ borderColor: 'var(--ada-border-default)' }}>
            {item.children!.map(child => (
              <NavItemRow key={child.to} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.to!}
      end={item.to === '/'}
      className={({ isActive }) => `
        flex items-center gap-2 px-3 py-1.5 rounded transition-colors
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] focus-visible:ring-offset-1
        ${isActive ? 'font-medium' : ''}
      `}
      style={({ isActive }) => ({
        color: isActive ? 'var(--ada-p-600)' : 'var(--ada-text-2)',
        backgroundColor: isActive ? 'var(--ada-p-50)' : 'transparent',
        fontSize: 'var(--ada-fs-sm)',
        fontWeight: isActive ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)',
      })}
      onMouseEnter={e => {
        if (!e.currentTarget.classList.contains('active')) {
          e.currentTarget.style.backgroundColor = 'var(--ada-btn-ghost-hover)';
        }
      }}
      onMouseLeave={e => {
        const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
        e.currentTarget.style.backgroundColor = isActive ? 'var(--ada-p-50)' : 'transparent';
      }}
    >
      <span style={{ opacity: 0.7 }}>{item.icon}</span>
      {item.label}
    </NavLink>
  );
}

export function Shell() {
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const themeOptions: { key: Theme; icon: React.ReactNode; label: string }[] = [
    { key: 'light', icon: <Sun size={14} />, label: 'Light' },
    { key: 'dark', icon: <Moon size={14} />, label: 'Dark' },
    { key: 'hc', icon: <Contrast size={14} />, label: 'High Contrast' },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      {/* Sidebar */}
      <aside
        className="flex-shrink-0 flex flex-col border-r transition-all duration-200"
        style={{
          width: sidebarOpen ? '240px' : '0px',
          overflow: sidebarOpen ? 'visible' : 'hidden',
          backgroundColor: 'var(--ada-surface-2)',
          borderColor: 'var(--ada-border-default)',
        }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center gap-2.5 px-4 h-12 border-b flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)' }}>
          <div className="flex items-center justify-center w-6 h-6 rounded overflow-hidden flex-shrink-0">
            <Logo />
          </div>
          <div>
            <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', lineHeight: 1.2 }}>
              Efficient Design System
            </div>
            <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)', letterSpacing: '0.04em' }}>
              Design System v1.0
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5" aria-label="Design system navigation">
          {navItems.map(item => (
            <NavItemRow key={item.to || item.label} item={item} />
          ))}
        </nav>

        {/* Theme Switcher */}
        <div className="p-3 border-t flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)' }}>
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', marginBottom: '6px', fontWeight: 'var(--ada-fw-medium)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Theme
          </div>
          <div className="flex gap-1">
            {themeOptions.map(opt => (
              <button
                key={opt.key}
                onClick={() => setTheme(opt.key)}
                title={opt.label}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
                style={{
                  fontSize: 'var(--ada-fs-xs)',
                  backgroundColor: theme === opt.key ? 'var(--ada-p-600)' : 'var(--ada-surface-3)',
                  color: theme === opt.key ? 'white' : 'var(--ada-text-2)',
                  borderColor: theme === opt.key ? 'var(--ada-p-600)' : 'var(--ada-border-default)',
                  fontWeight: 'var(--ada-fw-medium)',
                }}
              >
                {opt.icon}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', marginTop: '8px', textAlign: 'center' }}>
            {theme === 'light' ? 'Light Mode' : theme === 'dark' ? 'Dark Mode' : 'High Contrast'}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-12 flex items-center gap-3 px-4 border-b flex-shrink-0" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ color: 'var(--ada-text-2)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-btn-ghost-hover)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <div className="h-4 w-px" style={{ backgroundColor: 'var(--ada-border-default)' }} />
          <div className="flex items-center gap-1.5" style={{ color: 'var(--ada-text-3)', fontSize: 'var(--ada-fs-xs)' }}>
            <Command size={12} />
            <span style={{ fontFamily: 'var(--ada-font-mono)' }}>Efficient DS</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
            <span style={{ fontFamily: 'var(--ada-font-mono)' }}>WCAG AA</span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--ada-s-500)', display: 'inline-block' }} />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
          <Outlet />
        </main>

        {/* Footer */}
        <footer
          className="flex items-center justify-center px-4 py-2 border-t flex-shrink-0"
          style={{
            backgroundColor: 'var(--ada-surface-1)',
            borderColor: 'var(--ada-border-default)',
            fontSize: 'var(--ada-fs-xs)',
            color: 'var(--ada-text-3)',
          }}
        >
          © {new Date().getFullYear()} All rights reserved. Created by{' '}
          <a
            href="https://www.aswinbaskaran.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 underline transition-colors"
            style={{ color: 'var(--ada-p-600)' }}
          >
            Aswin Baskaran
          </a>
        </footer>
      </div>
    </div>
  );
}