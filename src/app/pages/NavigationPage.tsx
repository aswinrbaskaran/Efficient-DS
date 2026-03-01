import { useState, useEffect, useRef } from 'react';
import {
  Search, Command, ChevronRight, ChevronDown, Home, Settings, Users,
  FileText, BarChart2, Shield, Package, Bell, HelpCircle,
  LayoutDashboard, GitBranch, Terminal, Folder, File, Hash,
  ArrowRight, Keyboard, X, Clock, Star, Plus
} from 'lucide-react';

/* ─── Helpers ─────────────────────────────────────────── */
function SH({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5">
      <h2 style={{ fontSize: 'var(--ada-fs-lg)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '3px' }}>{title}</h2>
      {desc && <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>{desc}</p>}
    </div>
  );
}
function Divider() {
  return <hr className="my-10" style={{ borderColor: 'var(--ada-border-default)' }} />;
}

/* ─── Top Navigation ──────────────────────────────────── */
function TopNav() {
  const [activeLink, setActiveLink] = useState('Dashboard');
  const links = ['Dashboard', 'Projects', 'Team', 'Analytics', 'Settings'];

  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-2)' }}>
      <nav className="flex items-center h-12 px-4 border-b gap-6" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }} aria-label="Top navigation">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: 'var(--ada-p-600)' }}>
            <GitBranch size={13} color="white" />
          </div>
          <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Efficient Design System</span>
        </div>

        {/* Divider */}
        <div className="h-5 w-px" style={{ backgroundColor: 'var(--ada-border-default)' }} />

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {links.map(l => (
            <button
              key={l}
              onClick={() => setActiveLink(l)}
              className="px-3 py-1.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
              style={{
                fontSize: 'var(--ada-fs-sm)',
                fontWeight: activeLink === l ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)',
                color: activeLink === l ? 'var(--ada-text-1)' : 'var(--ada-text-3)',
                backgroundColor: activeLink === l ? 'var(--ada-surface-2)' : 'transparent',
              }}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border cursor-pointer" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)', width: '160px' }}>
            <Search size={12} style={{ color: 'var(--ada-text-3)' }} />
            <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', flex: 1 }}>Search...</span>
            <span className="flex items-center gap-0.5 px-1 py-0.5 rounded border" style={{ fontSize: 'var(--ada-fs-2xs)', borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-3)', backgroundColor: 'var(--ada-surface-1)' }}>
              <Command size={9} />K
            </span>
          </div>
          <button className="p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ color: 'var(--ada-text-3)' }} aria-label="Notifications">
            <Bell size={15} />
          </button>
          <button className="p-1.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ color: 'var(--ada-text-3)' }} aria-label="Help">
            <HelpCircle size={15} />
          </button>
          <div className="flex items-center justify-center w-7 h-7 rounded-full" style={{ backgroundColor: 'var(--ada-p-100)', border: '1.5px solid var(--ada-p-300)' }}>
            <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-p-700)' }}>SC</span>
          </div>
        </div>
      </nav>
      {/* Content placeholder */}
      <div className="h-24 flex items-center justify-center" style={{ backgroundColor: 'var(--ada-surface-2)' }}>
        <span style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-4)' }}>Page content area — active: {activeLink}</span>
      </div>
    </div>
  );
}

/* ─── Collapsible Sidebar ─────────────────────────────── */
interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  badge?: string | number;
  children?: { icon: React.ReactNode; label: string }[];
}

const sidebarItems: SidebarItem[] = [
  { icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
  { icon: <BarChart2 size={15} />, label: 'Analytics', badge: 'New' },
  {
    icon: <Users size={15} />, label: 'Users',
    children: [
      { icon: <Users size={14} />, label: 'All Users' },
      { icon: <Shield size={14} />, label: 'Roles & Permissions' },
      { icon: <Bell size={14} />, label: 'Invitations' },
    ],
  },
  {
    icon: <Package size={15} />, label: 'Projects',
    children: [
      { icon: <Folder size={14} />, label: 'Active' },
      { icon: <FileText size={14} />, label: 'Archived' },
    ],
  },
  { icon: <Terminal size={15} />, label: 'Logs', badge: 12 },
  { icon: <Settings size={15} />, label: 'Settings' },
];

function CollapsibleSidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [expandedItems, setExpandedItems] = useState<string[]>(['Users']);
  const [collapsed, setCollapsed] = useState(false);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  return (
    <div className="rounded-lg border overflow-hidden flex" style={{ borderColor: 'var(--ada-border-default)', height: '320px', boxShadow: 'var(--ada-shadow-2)' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col border-r flex-shrink-0 transition-all duration-200"
        style={{
          width: collapsed ? '48px' : '200px',
          backgroundColor: 'var(--ada-surface-2)',
          borderColor: 'var(--ada-border-default)',
          overflow: 'hidden',
        }}
      >
        {/* Toggle */}
        <div className="flex items-center justify-between px-3 h-10 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          {!collapsed && <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Menu</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded ml-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ color: 'var(--ada-text-3)' }}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5" aria-label="Sidebar navigation">
          {sidebarItems.map(item => (
            <div key={item.label}>
              <button
                onClick={() => {
                  if (item.children) toggleExpand(item.label);
                  else setActiveItem(item.label);
                }}
                title={collapsed ? item.label : undefined}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] focus-visible:ring-offset-1"
                style={{
                  backgroundColor: activeItem === item.label ? 'var(--ada-p-100)' : 'transparent',
                  color: activeItem === item.label ? 'var(--ada-p-700)' : 'var(--ada-text-2)',
                  fontWeight: activeItem === item.label ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)',
                  fontSize: 'var(--ada-fs-sm)',
                }}
                onMouseEnter={e => { if (activeItem !== item.label) e.currentTarget.style.backgroundColor = 'var(--ada-btn-ghost-hover)'; }}
                onMouseLeave={e => { if (activeItem !== item.label) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="ml-auto px-1.5 py-0.5 rounded-full" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: typeof item.badge === 'number' ? 'var(--ada-e-100)' : 'var(--ada-p-100)', color: typeof item.badge === 'number' ? 'var(--ada-e-700)' : 'var(--ada-p-700)' }}>
                        {item.badge}
                      </span>
                    )}
                    {item.children && (
                      <ChevronDown size={12} style={{ color: 'var(--ada-text-4)', transform: expandedItems.includes(item.label) ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s' }} />
                    )}
                  </>
                )}
              </button>
              {/* Children */}
              {!collapsed && item.children && expandedItems.includes(item.label) && (
                <div className="ml-4 mt-0.5 border-l pl-2 space-y-0.5" style={{ borderColor: 'var(--ada-border-default)' }}>
                  {item.children.map(child => (
                    <button
                      key={child.label}
                      onClick={() => setActiveItem(child.label)}
                      className="w-full flex items-center gap-2 px-2 py-1 rounded transition-colors text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ada-focus-ring)]"
                      style={{
                        fontSize: 'var(--ada-fs-sm)',
                        color: activeItem === child.label ? 'var(--ada-p-600)' : 'var(--ada-text-3)',
                        backgroundColor: activeItem === child.label ? 'var(--ada-p-50)' : 'transparent',
                        fontWeight: activeItem === child.label ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)',
                      }}
                      onMouseEnter={e => { if (activeItem !== child.label) e.currentTarget.style.backgroundColor = 'var(--ada-btn-ghost-hover)'; }}
                      onMouseLeave={e => { if (activeItem !== child.label) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {child.icon}
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'var(--ada-surface-1)' }}>
        <div className="text-center">
          <span style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>Active: <strong style={{ color: 'var(--ada-text-1)' }}>{activeItem}</strong></span>
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', marginTop: '4px' }}>Toggle sidebar with arrow button</div>
        </div>
      </main>
    </div>
  );
}

/* ─── Command Bar ─────────────────────────────────────── */
const commandItems = [
  { group: 'Quick Actions', icon: <Plus size={14} />, label: 'New Project', shortcut: 'N' },
  { group: 'Quick Actions', icon: <Users size={14} />, label: 'Invite Team Member', shortcut: 'I' },
  { group: 'Navigation', icon: <LayoutDashboard size={14} />, label: 'Go to Dashboard', shortcut: '' },
  { group: 'Navigation', icon: <BarChart2 size={14} />, label: 'Open Analytics', shortcut: '' },
  { group: 'Navigation', icon: <Settings size={14} />, label: 'Settings', shortcut: ',' },
  { group: 'Recent', icon: <Clock size={14} />, label: 'User Management', shortcut: '' },
  { group: 'Recent', icon: <Clock size={14} />, label: 'API Configuration', shortcut: '' },
  { group: 'Starred', icon: <Star size={14} />, label: 'Production Dashboard', shortcut: '' },
];

function CommandBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
        setQuery('');
        setSelected(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const filtered = commandItems.filter(i => !query || i.label.toLowerCase().includes(query.toLowerCase()));
  const groups = [...new Set(filtered.map(i => i.group))];

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter') { setOpen(false); setQuery(''); }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
          style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)', color: 'var(--ada-text-3)' }}
          aria-label="Open command palette"
          aria-keyshortcuts="Meta+K"
        >
          <Command size={13} />
          <span>Open Command Bar</span>
          <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border ml-1" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-strong)', color: 'var(--ada-text-2)', fontFamily: 'var(--ada-font-sans)' }}>
            ⌘K
          </kbd>
        </button>
        <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>or press <kbd style={{ fontFamily: 'inherit', backgroundColor: 'var(--ada-surface-2)', padding: '1px 5px', borderRadius: '3px', border: '1px solid var(--ada-border-default)' }}>⌘K</kbd> anywhere</span>
      </div>

      {/* Command Palette Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="w-full max-w-lg rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-modal)' }} role="dialog" aria-modal="true" aria-label="Command palette">
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
              <Search size={16} style={{ color: 'var(--ada-text-3)', flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setSelected(0); }}
                onKeyDown={handleKey}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent focus:outline-none"
                style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)' }}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={true}
                aria-controls="command-list"
              />
              <button onClick={() => setOpen(false)} className="focus:outline-none" style={{ color: 'var(--ada-text-4)' }} aria-label="Close"><X size={14} /></button>
            </div>

            {/* Results */}
            <div id="command-list" className="max-h-72 overflow-y-auto" role="listbox" aria-label="Commands">
              {filtered.length === 0 ? (
                <div className="py-10 text-center" style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-4)' }}>No results for "{query}"</div>
              ) : (
                groups.map(group => (
                  <div key={group}>
                    <div className="px-4 py-2" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{group}</div>
                    {filtered.filter(i => i.group === group).map((item, gi) => {
                      const globalIdx = filtered.indexOf(item);
                      return (
                        <div
                          key={item.label}
                          role="option"
                          aria-selected={globalIdx === selected}
                          className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
                          style={{ backgroundColor: globalIdx === selected ? 'var(--ada-p-50)' : 'transparent' }}
                          onMouseEnter={() => setSelected(globalIdx)}
                          onClick={() => { setOpen(false); setQuery(''); }}
                        >
                          <span style={{ color: globalIdx === selected ? 'var(--ada-p-600)' : 'var(--ada-text-3)' }}>{item.icon}</span>
                          <span style={{ fontSize: 'var(--ada-fs-sm)', color: globalIdx === selected ? 'var(--ada-p-700)' : 'var(--ada-text-1)', flex: 1 }}>{item.label}</span>
                          {item.shortcut && (
                            <kbd className="px-1.5 py-0.5 rounded border" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-3)', fontFamily: 'var(--ada-font-sans)' }}>
                              ⌘{item.shortcut}
                            </kbd>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2 border-t" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
              {[['↑↓', 'Navigate'], ['↵', 'Select'], ['Esc', 'Close']].map(([key, action]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <kbd style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: 'var(--ada-surface-1)', border: '1px solid var(--ada-border-strong)', borderRadius: '3px', padding: '1px 5px', fontFamily: 'inherit', color: 'var(--ada-text-2)' }}>{key}</kbd>
                  <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Nested Sidebar ──────────────────────────────────── */
function NestedSidebar() {
  const [active, setActive] = useState('Access Control');
  const navGroups = [
    {
      group: 'General', items: [
        { icon: <LayoutDashboard size={14} />, label: 'Overview' },
        { icon: <Bell size={14} />, label: 'Notifications' },
      ],
    },
    {
      group: 'Workspace', items: [
        { icon: <Users size={14} />, label: 'Team Members' },
        { icon: <Shield size={14} />, label: 'Access Control' },
        { icon: <Package size={14} />, label: 'Integrations' },
        { icon: <GitBranch size={14} />, label: 'API Keys' },
      ],
    },
    {
      group: 'Developer', items: [
        { icon: <Terminal size={14} />, label: 'CLI Tools' },
        { icon: <Hash size={14} />, label: 'Webhooks' },
        { icon: <File size={14} />, label: 'Audit Log' },
      ],
    },
  ];

  return (
    <div className="rounded-lg border overflow-hidden flex" style={{ borderColor: 'var(--ada-border-default)', height: '280px', boxShadow: 'var(--ada-shadow-2)' }}>
      <aside className="w-48 border-r flex-shrink-0 overflow-y-auto" style={{ backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
        {navGroups.map(group => (
          <div key={group.group} className="py-3">
            <div className="px-3 mb-1" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {group.group}
            </div>
            {group.items.map(item => (
              <button
                key={item.label}
                onClick={() => setActive(item.label)}
                className="w-full flex items-center gap-2 px-3 py-1.5 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ada-focus-ring)]"
                style={{
                  fontSize: 'var(--ada-fs-sm)',
                  color: active === item.label ? 'var(--ada-p-600)' : 'var(--ada-text-2)',
                  backgroundColor: active === item.label ? 'var(--ada-p-50)' : 'transparent',
                  fontWeight: active === item.label ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)',
                  borderLeft: `2px solid ${active === item.label ? 'var(--ada-p-500)' : 'transparent'}`,
                }}
                onMouseEnter={e => { if (active !== item.label) e.currentTarget.style.backgroundColor = 'var(--ada-btn-ghost-hover)'; }}
                onMouseLeave={e => { if (active !== item.label) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {item.icon}{item.label}
              </button>
            ))}
          </div>
        ))}
      </aside>
      <main className="flex-1 p-4 overflow-y-auto" style={{ backgroundColor: 'var(--ada-surface-1)' }}>
        <div style={{ fontSize: 'var(--ada-fs-base)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>{active}</div>
        <div style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>Configure {active.toLowerCase()} settings</div>
      </main>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────── */
export function NavigationPage() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <div className="mb-10">
        <h1 style={{ fontSize: 'var(--ada-fs-3xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>Navigation Patterns</h1>
        <p style={{ fontSize: 'var(--ada-fs-base)', color: 'var(--ada-text-3)' }}>Interactive navigation components built for developer tools and enterprise apps.</p>
      </div>

      <section>
        <SH title="Top Navigation Bar" desc="Full-width app header with logo, navigation links, search trigger, and user avatar." />
        <TopNav />
      </section>

      <Divider />

      <section>
        <SH title="Collapsible Sidebar" desc="Icon-only collapsed mode with tooltip labels. Supports nested items and badge counts." />
        <CollapsibleSidebar />
      </section>

      <Divider />

      <section>
        <SH title="Nested Sidebar Navigation" desc="Grouped navigation for settings-style pages. Supports section groups with labels." />
        <NestedSidebar />
      </section>

      <Divider />

      <section>
        <SH title="Command Bar (⌘K)" desc="Keyboard-driven command palette with search, arrow key navigation, and grouping. Press ⌘K to open." />
        <CommandBar />
        <div className="mt-4 p-4 rounded-lg border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
          <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Keyboard Shortcuts</div>
          <div className="grid grid-cols-3 gap-3">
            {[['⌘K', 'Open command bar'], ['↑ ↓', 'Navigate results'], ['↵', 'Execute command'], ['Esc', 'Dismiss'], ['⌘N', 'New project'], ['⌘,', 'Open settings']].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-2.5">
                <kbd className="px-2 py-1 rounded border" style={{ fontSize: 'var(--ada-fs-xs)', backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-strong)', color: 'var(--ada-text-1)', fontFamily: 'var(--ada-font-sans)', whiteSpace: 'nowrap' }}>{key}</kbd>
                <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-16" />
    </div>
  );
}