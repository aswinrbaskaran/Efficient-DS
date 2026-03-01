import { useState } from 'react';
import {
  ChevronRight, Home, Settings, Users, BarChart2, FileText,
  Package, Bell, Shield, ChevronDown, LayoutDashboard,
  Terminal, GitBranch, Hash, Folder, File
} from 'lucide-react';

function SH({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5">
      <h2 style={{ fontSize: 'var(--ada-fs-xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '3px' }}>{title}</h2>
      {desc && <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>{desc}</p>}
    </div>
  );
}
function Divider() { return <hr className="my-10" style={{ borderColor: 'var(--ada-border-default)' }} />; }

/* ── Breadcrumb ─────────────────────────────────────────────── */
function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={13} style={{ color: 'var(--ada-text-4)' }} aria-hidden="true" />}
            {item.href && i < items.length - 1 ? (
              <a href="#" onClick={e => e.preventDefault()}
                className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] hover:underline"
                style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-p-600)' }}
                aria-label={item.label}>{item.label}</a>
            ) : (
              <span style={{ fontSize: 'var(--ada-fs-sm)', color: i === items.length - 1 ? 'var(--ada-text-2)' : 'var(--ada-text-3)', fontWeight: i === items.length - 1 ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)' }} aria-current={i === items.length - 1 ? 'page' : undefined}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ── Pagination ─────────────────────────────────────────────── */
function Pagination({ total, current, onChange }: { total: number; current: number; onChange: (p: number) => void }) {
  const pages: (number | '...')[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
  }
  return (
    <nav aria-label="Pagination">
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
          style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', color: current === 1 ? 'var(--ada-text-disabled)' : 'var(--ada-text-2)', backgroundColor: 'var(--ada-surface-1)', cursor: current === 1 ? 'not-allowed' : 'pointer', opacity: current === 1 ? 0.5 : 1 }} aria-label="Previous page">
          <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /> Prev
        </button>
        {pages.map((p, i) => (
          <button key={i} disabled={p === '...'} onClick={() => typeof p === 'number' && onChange(p)}
            className="w-9 h-9 flex items-center justify-center rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: current === p ? 'var(--ada-fw-semibold)' : 'var(--ada-fw-regular)', borderColor: current === p ? 'var(--ada-p-600)' : 'var(--ada-border-default)', color: current === p ? 'var(--ada-p-600)' : p === '...' ? 'var(--ada-text-4)' : 'var(--ada-text-2)', backgroundColor: current === p ? 'var(--ada-p-50)' : 'var(--ada-surface-1)', cursor: p === '...' ? 'default' : 'pointer' }}
            aria-label={typeof p === 'number' ? `Page ${p}` : 'More pages'} aria-current={current === p ? 'page' : undefined}>{p}</button>
        ))}
        <button onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total}
          className="flex items-center gap-1 px-3 py-1.5 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
          style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', color: current === total ? 'var(--ada-text-disabled)' : 'var(--ada-text-2)', backgroundColor: 'var(--ada-surface-1)', cursor: current === total ? 'not-allowed' : 'pointer', opacity: current === total ? 0.5 : 1 }} aria-label="Next page">
          Next <ChevronRight size={14} />
        </button>
      </div>
    </nav>
  );
}

/* ── Tabs ───────────────────────────────────────────────────── */
function Tabs({ variant, tabs, badges }: { variant: 'underline' | 'pill' | 'bordered'; tabs: string[]; badges?: Record<string, number> }) {
  const [active, setActive] = useState(tabs[0]);
  return (
    <div>
      {variant === 'underline' && (
        <div className="flex border-b" style={{ borderColor: 'var(--ada-border-default)' }} role="tablist">
          {tabs.map(t => (
            <button key={t} role="tab" aria-selected={active === t}
              onClick={() => setActive(t)}
              className="relative flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: active === t ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)', color: active === t ? 'var(--ada-p-600)' : 'var(--ada-text-3)', borderColor: active === t ? 'var(--ada-p-600)' : 'transparent', marginBottom: '-1px' }}>
              {t}
              {badges?.[t] !== undefined && <span className="px-1.5 rounded-full" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-semibold)', backgroundColor: active === t ? 'var(--ada-p-100)' : 'var(--ada-surface-3)', color: active === t ? 'var(--ada-p-700)' : 'var(--ada-text-4)' }}>{badges[t]}</span>}
            </button>
          ))}
        </div>
      )}
      {variant === 'pill' && (
        <div className="inline-flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--ada-surface-2)', border: '1px solid var(--ada-border-default)' }} role="tablist">
          {tabs.map(t => (
            <button key={t} role="tab" aria-selected={active === t}
              onClick={() => setActive(t)}
              className="px-4 py-1.5 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: active === t ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)', backgroundColor: active === t ? 'var(--ada-surface-1)' : 'transparent', color: active === t ? 'var(--ada-text-1)' : 'var(--ada-text-3)', boxShadow: active === t ? 'var(--ada-shadow-1)' : 'none' }}>
              {t}
            </button>
          ))}
        </div>
      )}
      {variant === 'bordered' && (
        <div className="flex" role="tablist">
          {tabs.map((t, i) => (
            <button key={t} role="tab" aria-selected={active === t}
              onClick={() => setActive(t)}
              className="px-4 py-2 border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: active === t ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)', backgroundColor: active === t ? 'var(--ada-surface-1)' : 'var(--ada-surface-2)', color: active === t ? 'var(--ada-text-1)' : 'var(--ada-text-3)', borderColor: 'var(--ada-border-default)', marginRight: i < tabs.length - 1 ? '-1px' : 0, borderBottomColor: active === t ? 'var(--ada-surface-1)' : 'var(--ada-border-default)', position: 'relative', zIndex: active === t ? 1 : 0, borderRadius: i === 0 ? '4px 0 0 0' : i === tabs.length - 1 ? '0 4px 0 0' : 0 }}>
              {t}
            </button>
          ))}
        </div>
      )}
      <div className="mt-4 p-4 rounded-lg border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)', fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>
        Content for <strong style={{ color: 'var(--ada-text-1)' }}>{active}</strong> tab
      </div>
    </div>
  );
}

/* ── Navigation Menu ────────────────────────────────────────── */
function NavigationMenu() {
  const [open, setOpen] = useState<string | null>(null);
  const nav = [
    { label: 'Dashboard', href: '#' },
    {
      label: 'Products', children: [
        { icon: <Package size={14} />, label: 'Catalog', desc: 'Manage your product listings' },
        { icon: <BarChart2 size={14} />, label: 'Analytics', desc: 'Sales and traffic insights' },
        { icon: <Settings size={14} />, label: 'Settings', desc: 'Pricing, shipping, taxes' },
      ]
    },
    {
      label: 'Team', children: [
        { icon: <Users size={14} />, label: 'Members', desc: 'Invite and manage team members' },
        { icon: <Shield size={14} />, label: 'Roles', desc: 'Permissions and access control' },
      ]
    },
    { label: 'Docs', href: '#' },
  ];
  return (
    <div className="rounded-lg border overflow-visible" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', boxShadow: 'var(--ada-shadow-2)' }}>
      <nav className="flex items-center h-12 px-4 gap-1" aria-label="Main navigation">
        <div className="flex items-center gap-2 mr-4">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--ada-p-600)' }}>
            <GitBranch size={13} color="white" />
          </div>
          <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Efficient DS</span>
        </div>
        <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--ada-border-default)' }} />
        {nav.map(item => (
          <div key={item.label} className="relative">
            <button
              onClick={() => setOpen(open === item.label ? null : item.label)}
              onBlur={() => setTimeout(() => setOpen(null), 150)}
              className="flex items-center gap-1 px-3 py-1.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-sm)', color: open === item.label ? 'var(--ada-text-1)' : 'var(--ada-text-3)', backgroundColor: open === item.label ? 'var(--ada-surface-2)' : 'transparent', fontWeight: open === item.label ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)' }}
              aria-haspopup={item.children ? 'true' : undefined} aria-expanded={open === item.label}
            >
              {item.label}
              {item.children && <ChevronDown size={13} style={{ color: 'var(--ada-text-4)', transform: open === item.label ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />}
            </button>
            {item.children && open === item.label && (
              <div className="absolute top-full mt-1 left-0 rounded-xl border p-2 z-50" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-4)', minWidth: 260 }}>
                {item.children.map(child => (
                  <div key={child.label} className="flex items-start gap-3 p-3 rounded-lg cursor-pointer"
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: 'var(--ada-p-50)', color: 'var(--ada-p-600)' }}>{child.icon}</div>
                    <div>
                      <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)', marginBottom: '2px' }}>{child.label}</div>
                      <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{child.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

/* ── Menubar ────────────────────────────────────────────────── */
function Menubar() {
  const [open, setOpen] = useState<string | null>(null);
  const menus = {
    File: [
      { label: 'New File', shortcut: '⌘N' },
      { label: 'Open…', shortcut: '⌘O' },
      { label: 'Save', shortcut: '⌘S' },
      null,
      { label: 'Export…', shortcut: '⌘⇧E' },
      null,
      { label: 'Close Window', shortcut: '⌘W', danger: true },
    ],
    Edit: [
      { label: 'Undo', shortcut: '⌘Z' },
      { label: 'Redo', shortcut: '⌘⇧Z' },
      null,
      { label: 'Cut', shortcut: '⌘X' },
      { label: 'Copy', shortcut: '⌘C' },
      { label: 'Paste', shortcut: '⌘V' },
    ],
    View: [
      { label: 'Command Palette', shortcut: '⌘K' },
      { label: 'Toggle Sidebar', shortcut: '⌘B' },
      null,
      { label: 'Zoom In', shortcut: '⌘+' },
      { label: 'Zoom Out', shortcut: '⌘-' },
    ],
    Help: [
      { label: 'Documentation', shortcut: '' },
      { label: 'Keyboard Shortcuts', shortcut: '⌘/' },
      null,
      { label: 'Release Notes', shortcut: '' },
    ],
  };
  return (
    <div className="rounded-lg border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', boxShadow: 'var(--ada-shadow-2)' }}>
      <div className="flex items-center px-2 h-9" style={{ borderBottom: '1px solid var(--ada-border-default)' }} role="menubar">
        {Object.entries(menus).map(([name, items]) => (
          <div key={name} className="relative">
            <button
              onClick={() => setOpen(open === name ? null : name)}
              onBlur={() => setTimeout(() => setOpen(null), 100)}
              className="px-3 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-xs)', color: open === name ? 'var(--ada-text-1)' : 'var(--ada-text-2)', backgroundColor: open === name ? 'var(--ada-p-600)' : 'transparent', fontWeight: open === name ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)' }}
              role="menuitem" aria-haspopup="true" aria-expanded={open === name}
            >
              {name}
            </button>
            {open === name && (
              <div className="absolute top-full left-0 rounded-lg border overflow-hidden z-50" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-4)', minWidth: 200 }} role="menu">
                {items.map((item, i) =>
                  item === null ? <div key={i} style={{ height: 1, backgroundColor: 'var(--ada-border-subtle)', margin: '4px 0' }} /> :
                  <div key={item.label} role="menuitem"
                    className="flex items-center justify-between px-3 py-2 cursor-pointer"
                    style={{ fontSize: 'var(--ada-fs-xs)', color: (item as any).danger ? 'var(--ada-e-600)' : 'var(--ada-text-1)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = (item as any).danger ? 'var(--ada-e-50)' : 'var(--ada-surface-2)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span>{item.label}</span>
                    {item.shortcut && <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)', marginLeft: 16, fontFamily: 'var(--ada-font-sans)' }}>{item.shortcut}</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center h-16" style={{ backgroundColor: 'var(--ada-surface-2)' }}>
        <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>Application content area</span>
      </div>
    </div>
  );
}

/* ── Sidebar ────────────────────────────────────────────────── */
function SidebarDemo() {
  const [active, setActive] = useState('Dashboard');
  const [expanded, setExpanded] = useState<string[]>(['Team']);
  const [collapsed, setCollapsed] = useState(false);
  const items = [
    { icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
    { icon: <BarChart2 size={15} />, label: 'Analytics', badge: 'New' },
    {
      icon: <Users size={15} />, label: 'Team', children: [
        { icon: <Users size={13} />, label: 'All Members' },
        { icon: <Shield size={13} />, label: 'Roles' },
        { icon: <Bell size={13} />, label: 'Invites', badge: 4 },
      ]
    },
    { icon: <FileText size={15} />, label: 'Docs' },
    { icon: <Settings size={15} />, label: 'Settings' },
  ];
  const toggle = (label: string) => setExpanded(e => e.includes(label) ? e.filter(x => x !== label) : [...e, label]);

  return (
    <div className="rounded-lg border overflow-hidden flex" style={{ borderColor: 'var(--ada-border-default)', height: 280, boxShadow: 'var(--ada-shadow-2)' }}>
      <aside className="flex flex-col border-r flex-shrink-0 transition-all duration-200 overflow-hidden" style={{ width: collapsed ? 48 : 200, backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
        <div className="flex items-center justify-between px-3 h-10 border-b flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)' }}>
          {!collapsed && <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Menu</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded ml-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ color: 'var(--ada-text-3)' }} aria-label={collapsed ? 'Expand' : 'Collapse'}>
            <ChevronRight size={14} style={{ transform: collapsed ? 'rotate(0)' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {items.map(item => (
            <div key={item.label}>
              <button
                onClick={() => item.children ? toggle(item.label) : setActive(item.label)}
                title={collapsed ? item.label : undefined}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] focus-visible:ring-offset-1 mb-0.5"
                style={{ backgroundColor: active === item.label ? 'var(--ada-p-100)' : 'transparent', color: active === item.label ? 'var(--ada-p-700)' : 'var(--ada-text-2)', fontSize: 'var(--ada-fs-sm)' }}
                onMouseEnter={e => { if (active !== item.label) e.currentTarget.style.backgroundColor = 'var(--ada-btn-ghost-hover)'; }}
                onMouseLeave={e => { if (active !== item.label) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {(item as any).badge !== undefined && (
                      <span className="px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-semibold)', backgroundColor: typeof (item as any).badge === 'number' ? 'var(--ada-e-100)' : 'var(--ada-p-100)', color: typeof (item as any).badge === 'number' ? 'var(--ada-e-700)' : 'var(--ada-p-700)' }}>{(item as any).badge}</span>
                    )}
                    {item.children && <ChevronDown size={12} style={{ color: 'var(--ada-text-4)', transform: expanded.includes(item.label) ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform 0.15s', flexShrink: 0 }} />}
                  </>
                )}
              </button>
              {!collapsed && item.children && expanded.includes(item.label) && (
                <div className="ml-4 mb-1 border-l pl-2" style={{ borderColor: 'var(--ada-border-default)' }}>
                  {item.children.map(child => (
                    <button key={child.label} onClick={() => setActive(child.label)}
                      className="w-full flex items-center gap-2 px-2 py-1 rounded transition-colors text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ada-focus-ring)]"
                      style={{ fontSize: 'var(--ada-fs-sm)', color: active === child.label ? 'var(--ada-p-600)' : 'var(--ada-text-3)', backgroundColor: active === child.label ? 'var(--ada-p-50)' : 'transparent' }}
                      onMouseEnter={e => { if (active !== child.label) e.currentTarget.style.backgroundColor = 'var(--ada-btn-ghost-hover)'; }}
                      onMouseLeave={e => { if (active !== child.label) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                      {child.icon}{child.label}
                      {(child as any).badge && <span className="ml-auto px-1.5 rounded-full" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: 'var(--ada-e-100)', color: 'var(--ada-e-700)' }}>{(child as any).badge}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'var(--ada-surface-1)' }}>
        <div className="text-center">
          <div style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>Active: <strong style={{ color: 'var(--ada-text-1)' }}>{active}</strong></div>
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', marginTop: '4px' }}>Toggle sidebar with ‹ button</div>
        </div>
      </main>
    </div>
  );
}

export function NavigationSection() {
  const [page, setPage] = useState(3);
  return (
    <div>
      {/* ── BREADCRUMB ────────────────────────────────────── */}
      <SH title="Breadcrumb" desc="Path indicator showing the user's location within a hierarchy. Supports truncation and icons." />
      <div className="mb-6 space-y-4">
        <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Variants</div>
        <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Settings' }]} />
        <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Projects', href: '#' }, { label: 'API Gateway', href: '#' }, { label: 'Configuration' }]} />
        <div>
          <nav aria-label="Breadcrumb with ellipsis">
            <ol className="flex items-center gap-1" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              <li><a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-p-600)' }} className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] rounded">Home</a></li>
              <li><ChevronRight size={13} style={{ color: 'var(--ada-text-4)' }} /></li>
              <li><button className="px-1.5 py-0.5 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)', color: 'var(--ada-text-3)' }} aria-label="Show full path">…</button></li>
              <li><ChevronRight size={13} style={{ color: 'var(--ada-text-4)' }} /></li>
              <li><a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-p-600)' }} className="hover:underline">Services</a></li>
              <li><ChevronRight size={13} style={{ color: 'var(--ada-text-4)' }} /></li>
              <li><span style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)', fontWeight: 'var(--ada-fw-medium)' }} aria-current="page">Edge Config</span></li>
            </ol>
          </nav>
        </div>
      </div>

      <Divider />

      {/* ── PAGINATION ───────────────────────────────────── */}
      <SH title="Pagination" desc="Page navigation with dynamic ellipsis, keyboard support, and accessible labeling." />
      <div className="mb-6 space-y-4">
        <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Full Pagination</div>
        <Pagination total={10} current={page} onChange={setPage} />
        <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>Page {page} of 10 · Click to navigate</div>
      </div>

      <Divider />

      {/* ── TABS ─────────────────────────────────────────── */}
      <SH title="Tabs" desc="Content organization with three visual variants. Supports badge counts and keyboard navigation." />
      <div className="mb-6 space-y-8">
        <div>
          <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Underline (Default)</div>
          <Tabs variant="underline" tabs={['Overview', 'Analytics', 'Settings', 'Members']} badges={{ Analytics: 3, Members: 12 }} />
        </div>
        <div>
          <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Pill</div>
          <Tabs variant="pill" tabs={['Day', 'Week', 'Month', 'Quarter']} />
        </div>
        <div>
          <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Bordered</div>
          <Tabs variant="bordered" tabs={['Editor', 'Preview', 'Console']} />
        </div>
      </div>

      <Divider />

      {/* ── NAVIGATION MENU ──────────────────────────────── */}
      <SH title="Navigation Menu" desc="Top-level navigation with mega-menu flyouts. Suitable for application headers." />
      <div className="mb-6">
        <NavigationMenu />
      </div>

      <Divider />

      {/* ── MENUBAR ──────────────────────────────────────── */}
      <SH title="Menubar" desc="Application-style menubar with File, Edit, View, Help menus. Keyboard shortcut indicators included." />
      <div className="mb-6">
        <Menubar />
      </div>

      <Divider />

      {/* ── SIDEBAR ──────────────────────────────────────── */}
      <SH title="Sidebar" desc="Collapsible navigation sidebar with nested items, badges, and icon-only collapsed state." />
      <div className="mb-6">
        <SidebarDemo />
      </div>

      <div className="h-8" />
    </div>
  );
}
