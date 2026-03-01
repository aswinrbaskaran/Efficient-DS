import { useState, useEffect, useRef } from 'react';
import {
  X, Search, AlertCircle, Trash2, Edit, Copy, Download, Share2,
  ExternalLink, Settings, LogOut, User, ChevronRight, Command,
  Clock, Star, FileText, LayoutDashboard, Keyboard
} from 'lucide-react';

function SH({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5">
      <h2 style={{ fontSize: 'var(--ada-fs-xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '3px' }}>{title}</h2>
      {desc && <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>{desc}</p>}
    </div>
  );
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>{label}</div>
      <div className="flex flex-wrap gap-3 items-start">{children}</div>
    </div>
  );
}
function Divider() { return <hr className="my-10" style={{ borderColor: 'var(--ada-border-default)' }} />; }

const OVERLAY_STYLE: React.CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 50,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '16px', backgroundColor: 'rgba(0,0,0,0.5)',
};

/* ── Dialog ─────────────────────────────────────────────────── */
function Dialog({ open, onClose, title, children, footer, size = 'md' }: {
  open: boolean; onClose: () => void; title: string;
  children: React.ReactNode; footer?: React.ReactNode; size?: 'sm' | 'md' | 'lg';
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);
  if (!open) return null;
  const widths = { sm: 400, md: 520, lg: 640 };
  return (
    <div style={OVERLAY_STYLE} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="rounded-xl border overflow-hidden w-full" style={{ maxWidth: widths[size], backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-modal)' }} role="dialog" aria-modal="true" aria-label={title}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          <h2 style={{ fontSize: 'var(--ada-fs-base)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{title}</h2>
          <button onClick={onClose} className="p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ color: 'var(--ada-text-3)' }} aria-label="Close dialog"><X size={16} /></button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 px-5 py-4 border-t" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>{footer}</div>}
      </div>
    </div>
  );
}

/* ── Drawer ─────────────────────────────────────────────────── */
function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div className="flex flex-col border-l" style={{ width: 360, backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-modal)' }} role="dialog" aria-modal="true" aria-label={title}>
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)' }}>
          <h2 style={{ fontSize: 'var(--ada-fs-base)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{title}</h2>
          <button onClick={onClose} className="p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ color: 'var(--ada-text-3)' }} aria-label="Close"><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

/* ── Sheet ──────────────────────────────────────────────────── */
function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div className="relative border-t rounded-t-xl overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-modal)', maxHeight: '75vh' }} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          <h2 style={{ fontSize: 'var(--ada-fs-base)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{title}</h2>
          <button onClick={onClose} className="p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ color: 'var(--ada-text-3)' }} aria-label="Close"><X size={16} /></button>
        </div>
        <div className="px-5 py-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* ── Tooltip ────────────────────────────────────────────────── */
function Tooltip({ content, position = 'top', children }: { content: string; position?: 'top' | 'right' | 'bottom' | 'left'; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const pos: Record<string, React.CSSProperties> = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6 },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6 },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 6 },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 6 },
  };
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onFocus={() => setShow(true)} onBlur={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute z-50 rounded px-2.5 py-1.5 whitespace-nowrap pointer-events-none" style={{ ...pos[position], backgroundColor: 'var(--ada-n-900)', color: 'white', fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', boxShadow: 'var(--ada-shadow-3)' }} role="tooltip">
          {content}
        </div>
      )}
    </div>
  );
}

/* ── Hover Card ─────────────────────────────────────────────── */
function HoverCard({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {trigger}
      {show && (
        <div className="absolute top-full mt-2 left-0 z-50 rounded-xl border p-4 w-72" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-4)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Popover ────────────────────────────────────────────────── */
function Popover({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex">
      <div onClick={() => setShow(!show)}>{trigger}</div>
      {show && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShow(false)} />
          <div className="absolute top-full mt-2 left-0 z-50 rounded-xl border p-4" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-4)', minWidth: 240 }}>
            {children}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Dropdown Menu ──────────────────────────────────────────── */
function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const items = [
    { icon: <User size={13} />, label: 'Profile', shortcut: '⌘P' },
    { icon: <Settings size={13} />, label: 'Settings', shortcut: '⌘,' },
    { icon: <Copy size={13} />, label: 'Duplicate', shortcut: '⌘D' },
    null,
    { icon: <Share2 size={13} />, label: 'Share…', shortcut: '' },
    { icon: <Download size={13} />, label: 'Export', shortcut: '' },
    null,
    { icon: <LogOut size={13} />, label: 'Sign out', shortcut: '', danger: true },
  ];
  return (
    <div className="relative inline-flex">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-2 px-3 py-2 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
        style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)', fontWeight: 'var(--ada-fw-medium)' }}
        aria-haspopup="menu" aria-expanded={open}
      >
        Options <ChevronRight size={13} style={{ color: 'var(--ada-text-3)', transform: 'rotate(90deg)' }} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 right-0 rounded-lg border overflow-hidden z-50" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-4)', minWidth: 200 }} role="menu">
          {items.map((item, i) =>
            item === null ? <div key={i} style={{ height: 1, backgroundColor: 'var(--ada-border-subtle)', margin: '4px 0' }} /> :
            <div key={item.label} role="menuitem"
              className="flex items-center gap-2.5 px-3 py-2 cursor-pointer"
              style={{ fontSize: 'var(--ada-fs-sm)', color: (item as any).danger ? 'var(--ada-e-600)' : 'var(--ada-text-1)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = (item as any).danger ? 'var(--ada-e-50)' : 'var(--ada-surface-2)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span style={{ color: (item as any).danger ? 'var(--ada-e-500)' : 'var(--ada-text-3)' }}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.shortcut && <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-sans)' }}>{item.shortcut}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Context Menu ───────────────────────────────────────────── */
function ContextMenu() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const items = [
    { icon: <Copy size={13} />, label: 'Copy', shortcut: '⌘C' },
    { icon: <Edit size={13} />, label: 'Edit', shortcut: '⌘E' },
    null,
    { icon: <Share2 size={13} />, label: 'Share', shortcut: '' },
    { icon: <Download size={13} />, label: 'Download', shortcut: '' },
    null,
    { icon: <Trash2 size={13} />, label: 'Delete', shortcut: '⌫', danger: true },
  ];
  useEffect(() => {
    const close = () => setPos(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);
  return (
    <div>
      <div
        ref={areaRef}
        onContextMenu={e => { e.preventDefault(); setPos({ x: e.clientX, y: e.clientY }); }}
        className="flex items-center justify-center rounded-lg border-2 border-dashed cursor-context-menu select-none"
        style={{ height: 100, borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)', fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}
        aria-label="Right-click target area"
      >
        Right-click or long-press here
      </div>
      {pos && (
        <div className="fixed rounded-lg border overflow-hidden z-50" style={{ top: pos.y, left: pos.x, backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-4)', minWidth: 180 }} role="menu">
          {items.map((item, i) =>
            item === null ? <div key={i} style={{ height: 1, backgroundColor: 'var(--ada-border-subtle)', margin: '4px 0' }} /> :
            <div key={item.label} role="menuitem"
              className="flex items-center gap-2.5 px-3 py-2 cursor-pointer"
              style={{ fontSize: 'var(--ada-fs-sm)', color: (item as any).danger ? 'var(--ada-e-600)' : 'var(--ada-text-1)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = (item as any).danger ? 'var(--ada-e-50)' : 'var(--ada-surface-2)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              onClick={() => setPos(null)}
            >
              <span style={{ color: (item as any).danger ? 'var(--ada-e-500)' : 'var(--ada-text-3)' }}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.shortcut && <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>{item.shortcut}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Command Palette ────────────────────────────────────────── */
const CMD_ITEMS = [
  { group: 'Quick Actions', icon: <FileText size={14} />, label: 'New document', shortcut: 'N' },
  { group: 'Quick Actions', icon: <LayoutDashboard size={14} />, label: 'Go to dashboard', shortcut: '' },
  { group: 'Quick Actions', icon: <Settings size={14} />, label: 'Open settings', shortcut: ',' },
  { group: 'Recent', icon: <Clock size={14} />, label: 'API Configuration', shortcut: '' },
  { group: 'Recent', icon: <Clock size={14} />, label: 'User Management', shortcut: '' },
  { group: 'Starred', icon: <Star size={14} />, label: 'Production Dashboard', shortcut: '' },
  { group: 'Starred', icon: <Star size={14} />, label: 'Main API Key', shortcut: '' },
];

function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(o => !o); setQuery(''); setSel(0); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 10); }, [open]);
  const filtered = CMD_ITEMS.filter(i => !query || i.label.toLowerCase().includes(query.toLowerCase()));
  const groups = [...new Set(filtered.map(i => i.group))];
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter') { setOpen(false); setQuery(''); }
  };
  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
        style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)', color: 'var(--ada-text-3)' }}
        aria-keyshortcuts="Meta+K"
      >
        <Command size={13} />Open Command Palette
        <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border ml-1" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-strong)', color: 'var(--ada-text-2)', fontFamily: 'var(--ada-font-sans)' }}>⌘K</kbd>
      </button>
      {open && (
        <div style={{ ...OVERLAY_STYLE, alignItems: 'flex-start', paddingTop: 80 }} onClick={e => e.target === e.currentTarget && setOpen(false)}>
          <div className="w-full max-w-lg rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-modal)' }} role="dialog" aria-modal="true" aria-label="Command palette">
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
              <Search size={15} style={{ color: 'var(--ada-text-3)', flexShrink: 0 }} />
              <input ref={inputRef} value={query} onChange={e => { setQuery(e.target.value); setSel(0); }} onKeyDown={handleKey}
                placeholder="Search commands…" className="flex-1 bg-transparent focus:outline-none" style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)' }} role="combobox" aria-autocomplete="list" aria-expanded="true" />
              <button onClick={() => setOpen(false)} style={{ color: 'var(--ada-text-4)' }} className="focus:outline-none" aria-label="Close"><X size={14} /></button>
            </div>
            <div className="max-h-64 overflow-y-auto" role="listbox">
              {filtered.length === 0 ? (
                <div className="py-10 text-center" style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-4)' }}>No results for "{query}"</div>
              ) : groups.map(group => (
                <div key={group}>
                  <div className="px-4 py-2" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{group}</div>
                  {filtered.filter(i => i.group === group).map(item => {
                    const gi = filtered.indexOf(item);
                    return (
                      <div key={item.label} role="option" aria-selected={gi === sel}
                        className="flex items-center gap-3 px-4 py-2.5 cursor-pointer"
                        style={{ backgroundColor: gi === sel ? 'var(--ada-p-50)' : 'transparent' }}
                        onMouseEnter={() => setSel(gi)} onClick={() => { setOpen(false); setQuery(''); }}
                      >
                        <span style={{ color: gi === sel ? 'var(--ada-p-600)' : 'var(--ada-text-3)' }}>{item.icon}</span>
                        <span style={{ fontSize: 'var(--ada-fs-sm)', color: gi === sel ? 'var(--ada-p-700)' : 'var(--ada-text-1)', flex: 1 }}>{item.label}</span>
                        {item.shortcut && <kbd className="px-1.5 py-0.5 rounded border" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-3)', fontFamily: 'var(--ada-font-sans)' }}>⌘{item.shortcut}</kbd>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 px-4 py-2 border-t" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
              {[['↑↓', 'Navigate'], ['↵', 'Select'], ['Esc', 'Close']].map(([k, a]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <kbd style={{ fontSize: 'var(--ada-fs-xs)', backgroundColor: 'var(--ada-surface-1)', border: '1px solid var(--ada-border-strong)', borderRadius: '3px', padding: '1px 5px', color: 'var(--ada-text-2)' }}>{k}</kbd>
                  <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function OverlaysSection() {
  const [dialog, setDialog] = useState<null | 'basic' | 'form' | 'destruct'>(null);
  const [alertDialog, setAlertDialog] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [sheet, setSheet] = useState(false);

  const Btn = ({ onClick, children, variant = 'secondary' }: { onClick: () => void; children: React.ReactNode; variant?: 'primary' | 'secondary' | 'danger' }) => (
    <button onClick={onClick}
      className="px-3 py-2 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
      style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: variant === 'primary' ? 'var(--ada-p-600)' : variant === 'danger' ? 'var(--ada-e-600)' : 'var(--ada-surface-1)', color: variant !== 'secondary' ? 'white' : 'var(--ada-text-1)', borderColor: variant === 'secondary' ? 'var(--ada-border-default)' : 'transparent' }}>
      {children}
    </button>
  );

  return (
    <div>
      {/* ── DIALOG ─────────────────────────────────────────── */}
      <SH title="Dialog" desc="Modal window for focused tasks. Traps focus, closes on Escape and backdrop click." />

      <Row label="Variants">
        <Btn variant="secondary" onClick={() => setDialog('basic')}>Open Basic Dialog</Btn>
        <Btn variant="secondary" onClick={() => setDialog('form')}>Open Form Dialog</Btn>
        <Btn variant="danger" onClick={() => setDialog('destruct')}>Destructive Dialog</Btn>
      </Row>

      <Dialog open={dialog === 'basic'} onClose={() => setDialog(null)} title="Dialog Title"
        footer={<><Btn variant="secondary" onClick={() => setDialog(null)}>Cancel</Btn><Btn variant="primary" onClick={() => setDialog(null)}>Confirm</Btn></>}>
        <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)', lineHeight: 1.6 }}>This is the dialog body. It can contain any content including text, forms, media, or interactive elements. Press Escape or click the backdrop to close.</p>
      </Dialog>

      <Dialog open={dialog === 'form'} onClose={() => setDialog(null)} title="Create New Project"
        footer={<><Btn variant="secondary" onClick={() => setDialog(null)}>Cancel</Btn><Btn variant="primary" onClick={() => setDialog(null)}>Create Project</Btn></>}>
        <div className="space-y-4">
          {['Project name', 'Description'].map((label, i) => (
            <div key={label}>
              <label className="block mb-1.5" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>{label} {i === 0 && <span style={{ color: 'var(--ada-e-500)' }}>*</span>}</label>
              {i === 0 ? <input placeholder="My new project" className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }} /> : <textarea rows={3} placeholder="Optional description…" className="w-full rounded border px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }} />}
            </div>
          ))}
        </div>
      </Dialog>

      <Dialog open={dialog === 'destruct'} onClose={() => setDialog(null)} title="Delete Project" size="sm"
        footer={<><Btn variant="secondary" onClick={() => setDialog(null)}>Cancel</Btn><Btn variant="danger" onClick={() => setDialog(null)}>Delete</Btn></>}>
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--ada-e-100)' }}>
            <AlertCircle size={18} style={{ color: 'var(--ada-e-600)' }} />
          </div>
          <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)', lineHeight: 1.6 }}>Are you sure you want to delete <strong style={{ color: 'var(--ada-text-1)' }}>My Project</strong>? This will permanently remove all data. This action cannot be undone.</p>
        </div>
      </Dialog>

      <Divider />

      {/* ── ALERT DIALOG ─────────────────────────────────── */}
      <SH title="Alert Dialog" desc="Blocking confirmation dialog that requires an explicit user decision before proceeding." />
      <Row label="Confirmation">
        <Btn variant="danger" onClick={() => setAlertDialog(true)}>Delete account</Btn>
      </Row>
      {alertDialog && (
        <div style={OVERLAY_STYLE}>
          <div className="w-full max-w-sm rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-modal)' }} role="alertdialog" aria-modal="true" aria-labelledby="ad-title" aria-describedby="ad-desc">
            <div className="p-5">
              <h2 id="ad-title" style={{ fontSize: 'var(--ada-fs-base)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '8px' }}>Are you absolutely sure?</h2>
              <p id="ad-desc" style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)', lineHeight: 1.6 }}>This will permanently delete your account and all associated data. This action <strong>cannot be undone.</strong></p>
            </div>
            <div className="flex gap-2 px-5 pb-5">
              <button onClick={() => setAlertDialog(false)} className="flex-1 px-4 py-2 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)', fontWeight: 'var(--ada-fw-medium)' }}>Cancel</button>
              <button onClick={() => setAlertDialog(false)} className="flex-1 px-4 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-sm)', backgroundColor: 'var(--ada-e-600)', color: 'white', fontWeight: 'var(--ada-fw-medium)' }}>Delete account</button>
            </div>
          </div>
        </div>
      )}

      <Divider />

      {/* ── DRAWER ───────────────────────────────────────── */}
      <SH title="Drawer" desc="Side panel that slides in from the right edge. Used for detail views, filters, and settings." />
      <Row label="Right Drawer">
        <Btn variant="secondary" onClick={() => setDrawer(true)}>Open Drawer</Btn>
      </Row>
      <Drawer open={drawer} onClose={() => setDrawer(false)} title="User Details">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
            <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: 'var(--ada-p-100)' }}>
              <span style={{ fontSize: 'var(--ada-fs-base)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-p-700)' }}>SC</span>
            </div>
            <div>
              <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Sarah Chen</div>
              <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>sarah.chen@acme.com</div>
            </div>
          </div>
          {['Role', 'Department', 'Location', 'Joined'].map((field, i) => (
            <div key={field}>
              <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)', marginBottom: '4px' }}>{field}</div>
              <div style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)' }}>{['Administrator', 'Platform Engineering', 'San Francisco, CA', 'January 12, 2025'][i]}</div>
            </div>
          ))}
        </div>
      </Drawer>

      <Divider />

      {/* ── SHEET ────────────────────────────────────────── */}
      <SH title="Sheet" desc="Bottom sheet panel, common in mobile-first layouts for contextual actions." />
      <Row label="Bottom Sheet">
        <Btn variant="secondary" onClick={() => setSheet(true)}>Open Sheet</Btn>
      </Row>
      <Sheet open={sheet} onClose={() => setSheet(false)} title="Share document">
        <div className="space-y-3">
          {['Copy link', 'Share via email', 'Export as PDF', 'Export as PNG'].map(action => (
            <button key={action} onClick={() => setSheet(false)} className="w-full text-left px-4 py-3 rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-1)')}>
              {action}
            </button>
          ))}
        </div>
      </Sheet>

      <Divider />

      {/* ── POPOVER ──────────────────────────────────────── */}
      <SH title="Popover" desc="Non-blocking floating panel anchored to a trigger. Dismisses on outside click." />
      <Row label="Popover">
        <Popover trigger={
          <button className="px-3 py-2 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)', fontWeight: 'var(--ada-fw-medium)', cursor: 'pointer' }}>
            Open Popover
          </button>
        }>
          <div>
            <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>Notification Settings</div>
            <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', marginBottom: '12px' }}>Manage how you receive notifications.</div>
            {['Email', 'Push', 'SMS'].map(ch => (
              <label key={ch} className="flex items-center justify-between py-1.5 cursor-pointer">
                <span style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)' }}>{ch}</span>
                <div className="relative rounded-full" style={{ width: 36, height: 20, backgroundColor: 'var(--ada-p-600)' }}>
                  <div className="absolute top-1 rounded-full bg-white" style={{ width: 12, height: 12, left: 20 }} />
                </div>
              </label>
            ))}
          </div>
        </Popover>
      </Row>

      <Divider />

      {/* ── HOVER CARD ───────────────────────────────────── */}
      <SH title="Hover Card" desc="Rich preview card revealed on hover. Used for user profiles, link previews, etc." />
      <Row label="User Hover Card">
        <HoverCard trigger={
          <span className="underline cursor-pointer" style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-p-600)', textDecorationStyle: 'dashed' }}>@sarah.chen</span>
        }>
          <div className="flex items-start gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--ada-p-100)' }}>
              <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-p-700)' }}>SC</span>
            </div>
            <div>
              <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Sarah Chen</div>
              <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>@sarah.chen · Admin</div>
            </div>
          </div>
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)', lineHeight: 1.5, marginBottom: '12px' }}>Senior Platform Engineer at Acme Corp. Building developer tools and design systems.</div>
          <div className="flex items-center gap-4">
            {[['142', 'Commits'], ['28', 'PRs'], ['4', 'Reviews']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{val}</div>
                <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>{label}</div>
              </div>
            ))}
          </div>
        </HoverCard>
      </Row>

      <Divider />

      {/* ── DROPDOWN MENU ────────────────────────────────── */}
      <SH title="Dropdown Menu" desc="Contextual action menu anchored to a trigger button. Supports icons, keyboard shortcuts, separators, and destructive actions." />
      <Row label="Dropdown">
        <DropdownMenu />
      </Row>

      <Divider />

      {/* ── CONTEXT MENU ─────────────────────────────────── */}
      <SH title="Context Menu" desc="Right-click triggered menu for contextual actions. Works on desktop and long-press mobile." />
      <Row label="Right-click Area">
        <div style={{ width: 320 }}>
          <ContextMenu />
        </div>
      </Row>

      <Divider />

      {/* ── TOOLTIP ──────────────────────────────────────── */}
      <SH title="Tooltip" desc="Short informational label revealed on hover or focus. All four positions supported." />
      <Row label="All Positions">
        {(['top', 'right', 'bottom', 'left'] as const).map(pos => (
          <Tooltip key={pos} content={`Tooltip on ${pos}`} position={pos}>
            <button className="px-3 py-2 rounded border capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)', cursor: 'pointer' }}>
              {pos}
            </button>
          </Tooltip>
        ))}
      </Row>

      <Row label="Disabled Element Tooltip">
        <Tooltip content="This action is unavailable" position="right">
          <button disabled className="px-3 py-2 rounded border" style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-disabled-bg)', color: 'var(--ada-text-disabled)', cursor: 'not-allowed', opacity: 0.6, pointerEvents: 'none' }}>Disabled</button>
        </Tooltip>
      </Row>

      <Divider />

      {/* ── COMMAND PALETTE ──────────────────────────────── */}
      <SH title="Command Palette" desc="⌘K keyboard-driven command palette with search, grouped results, and arrow key navigation." />
      <Row label="Trigger">
        <CommandPalette />
      </Row>

      <div className="h-8" />
    </div>
  );
}
