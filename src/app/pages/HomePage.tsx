import { Link } from 'react-router';
import { Layers, Component, Navigation, LayoutDashboard, ArrowRight, Shield, Contrast, Keyboard, Zap, GitBranch } from 'lucide-react';

const stats = [
  { label: 'Components', value: '28+' },
  { label: 'Design Tokens', value: '140+' },
  { label: 'Color Scales', value: '6' },
  { label: 'Themes', value: '3' },
];

const sections = [
  {
    to: '/foundations',
    icon: <Layers size={20} />,
    title: 'Foundations',
    desc: 'Complete token system — neutral scales, primary brand color, semantic colors, typography, spacing, radius, and elevation.',
    tags: ['Colors', 'Typography', 'Spacing', 'Elevation'],
  },
  {
    to: '/components',
    icon: <Component size={20} />,
    title: 'Components',
    desc: 'Production-ready UI components with all interaction states: default, hover, active, focus, and disabled.',
    tags: ['Buttons', 'Forms', 'Feedback', 'Data Display'],
  },
  {
    to: '/navigation',
    icon: <Navigation size={20} />,
    title: 'Navigation Patterns',
    desc: 'Top nav, collapsible sidebar, nested sidebar, command bar (⌘K), tabs, breadcrumbs, and pagination.',
    tags: ['Top Nav', 'Sidebar', 'Command Bar', 'Breadcrumb'],
  },
  {
    to: '/layouts/dashboard',
    icon: <LayoutDashboard size={20} />,
    title: 'Example Layouts',
    desc: 'Real-world layouts: enterprise dashboard, admin panel, developer IDE, settings page, and user management.',
    tags: ['Dashboard', 'Admin', 'IDE', 'Settings'],
  },
];

const principles = [
  {
    icon: <Shield size={18} />,
    title: 'Accessibility First',
    desc: 'WCAG AA contrast ratios, visible focus rings, full keyboard navigation, and semantic markup throughout.',
  },
  {
    icon: <Zap size={18} />,
    title: 'Token-Based',
    desc: 'Every visual decision maps to a design token. Change one variable and propagate consistently across the entire system.',
  },
  {
    icon: <Contrast size={18} />,
    title: 'Theme-Ready',
    desc: 'Light, dark, and high-contrast themes baked in — no extra configuration required.',
  },
  {
    icon: <Keyboard size={18} />,
    title: 'Keyboard Accessible',
    desc: 'Every interactive element is fully operable via keyboard with clear focus indicators meeting WCAG 2.4.7.',
  },
];

export function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      {/* Hero */}
      <div className="mb-14">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: 'var(--ada-p-600)' }}>
            <GitBranch size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', fontWeight: 'var(--ada-fw-medium)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Design System
            </div>
            <div style={{ fontSize: 'var(--ada-fs-2xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', lineHeight: 1.2 }}>
              Efficient Design System
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: 'var(--ada-fs-4xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '16px', maxWidth: '640px' }}>
          A clean, neutral design system built for developer tools.
        </h1>
        <p style={{ fontSize: 'var(--ada-fs-lg)', color: 'var(--ada-text-2)', lineHeight: 1.6, maxWidth: '560px', marginBottom: '28px' }}>
          Efficient Design System is an accessibility-first, token-based design system for Visual Studio Code extensions, 
          enterprise dashboards, SaaS platforms, and admin panels. Clean. Scalable. Usable.
        </p>

        <div className="flex items-center gap-3">
          <Link
            to="/foundations"
            className="inline-flex items-center gap-2 px-4 py-2 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] focus-visible:ring-offset-2"
            style={{ backgroundColor: 'var(--ada-p-600)', color: 'white', fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)' }}
          >
            Explore Foundations
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/components"
            className="inline-flex items-center gap-2 px-4 py-2 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] focus-visible:ring-offset-2"
            style={{ borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-1)', fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: 'var(--ada-surface-1)' }}
          >
            View Components
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-14 p-6 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <div style={{ fontSize: 'var(--ada-fs-3xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-p-600)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', marginTop: '4px', fontWeight: 'var(--ada-fw-medium)' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div className="mb-12">
        <h2 style={{ fontSize: 'var(--ada-fs-xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>
          What's inside
        </h2>
        <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)', marginBottom: '20px' }}>
          Explore every section of the design system
        </p>

        <div className="grid grid-cols-2 gap-4">
          {sections.map(s => (
            <Link
              key={s.to}
              to={s.to}
              className="group block p-5 rounded-lg border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] focus-visible:ring-offset-2"
              style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--ada-p-300)';
                e.currentTarget.style.boxShadow = 'var(--ada-shadow-2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--ada-border-default)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded" style={{ backgroundColor: 'var(--ada-p-50)', color: 'var(--ada-p-600)' }}>
                  {s.icon}
                </div>
                <ArrowRight size={16} style={{ color: 'var(--ada-text-4)', marginTop: '4px' }} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
              <h3 style={{ fontSize: 'var(--ada-fs-base)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '6px' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)', lineHeight: 1.5, marginBottom: '12px' }}>
                {s.desc}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded" style={{ fontSize: 'var(--ada-fs-xs)', backgroundColor: 'var(--ada-surface-3)', color: 'var(--ada-text-2)', fontWeight: 'var(--ada-fw-medium)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Design Principles */}
      <div>
        <h2 style={{ fontSize: 'var(--ada-fs-xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>
          Design Principles
        </h2>
        <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)', marginBottom: '20px' }}>
          The values that guide every decision in Efficient Design System
        </p>

        <div className="grid grid-cols-2 gap-4">
          {principles.map(p => (
            <div key={p.title} className="p-4 rounded-lg border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
              <div className="flex items-center gap-2.5 mb-2">
                <div style={{ color: 'var(--ada-p-600)' }}>{p.icon}</div>
                <h4 style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>
                  {p.title}
                </h4>
              </div>
              <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)', lineHeight: 1.5 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Token Preview Strip */}
      <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--ada-border-default)' }}>
        <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', marginBottom: '10px', fontWeight: 'var(--ada-fw-medium)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Color System Preview
        </div>
        <div className="flex gap-1">
          {['--ada-n-100','--ada-n-200','--ada-n-300','--ada-n-400','--ada-n-500','--ada-n-600','--ada-n-700','--ada-n-800','--ada-n-900'].map(v => (
            <div key={v} className="flex-1 h-8 rounded" style={{ backgroundColor: `var(${v})` }} title={v} />
          ))}
        </div>
        <div className="flex gap-1 mt-1">
          {['--ada-p-100','--ada-p-200','--ada-p-300','--ada-p-400','--ada-p-500','--ada-p-600','--ada-p-700','--ada-p-800','--ada-p-900'].map(v => (
            <div key={v} className="flex-1 h-8 rounded" style={{ backgroundColor: `var(${v})` }} title={v} />
          ))}
        </div>
        <div className="flex gap-1 mt-1">
          {['--ada-s-100','--ada-s-500','--ada-s-600','--ada-w-100','--ada-w-500','--ada-w-600','--ada-e-100','--ada-e-500','--ada-e-600'].map(v => (
            <div key={v} className="flex-1 h-8 rounded" style={{ backgroundColor: `var(${v})` }} title={v} />
          ))}
        </div>
        <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', marginTop: '8px' }}>
          Neutral · Primary · Semantic — hover to see token names
        </div>
      </div>
    </div>
  );
}