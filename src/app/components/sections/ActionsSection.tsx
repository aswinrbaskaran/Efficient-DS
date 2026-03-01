import { useState } from 'react';
import {
  Plus, Upload, Copy, ExternalLink, ChevronDown, Loader2,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Sun, Moon, Monitor, List, LayoutGrid, Trash2, Edit,
  Command, Keyboard, Info
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
      <div className="flex flex-wrap gap-3 items-center">{children}</div>
    </div>
  );
}
function Divider() {
  return <hr className="my-10" style={{ borderColor: 'var(--ada-border-default)' }} />;
}

/* ── Button component ─────────────────────────────────────── */
function Btn({
  variant = 'primary', size = 'md', disabled = false, loading = false,
  icon, iconRight, children, className = '', onClick,
}: {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg'; disabled?: boolean; loading?: boolean;
  icon?: React.ReactNode; iconRight?: React.ReactNode;
  children?: React.ReactNode; className?: string; onClick?: () => void;
}) {
  const sizes = { sm: { px: '8px', py: '5px', fs: 'var(--ada-fs-xs)' }, md: { px: '12px', py: '7px', fs: 'var(--ada-fs-sm)' }, lg: { px: '16px', py: '10px', fs: 'var(--ada-fs-base)' } };
  const s = sizes[size];
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)', border: '1px solid transparent' },
    secondary: { backgroundColor: 'var(--ada-btn-secondary-bg)', color: 'var(--ada-btn-secondary-text)', border: '1px solid var(--ada-border-default)' },
    ghost: { backgroundColor: 'transparent', color: 'var(--ada-btn-ghost-text)', border: '1px solid transparent' },
    destructive: { backgroundColor: 'var(--ada-e-600)', color: '#fff', border: '1px solid transparent' },
    link: { backgroundColor: 'transparent', color: 'var(--ada-p-600)', border: '1px solid transparent', textDecoration: 'underline', padding: '0' },
  };
  const hoverBg: Record<string, string> = { primary: 'var(--ada-btn-primary-hover)', secondary: 'var(--ada-btn-secondary-hover)', ghost: 'var(--ada-btn-ghost-hover)', destructive: 'var(--ada-e-700)', link: 'transparent' };
  const restBg: Record<string, string> = { primary: 'var(--ada-btn-primary-bg)', secondary: 'var(--ada-btn-secondary-bg)', ghost: 'transparent', destructive: 'var(--ada-e-600)', link: 'transparent' };

  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] focus-visible:ring-offset-2 ${className}`}
      style={{ ...variantStyles[variant], padding: variant === 'link' ? '0' : `${s.py} ${s.px}`, fontSize: s.fs, fontWeight: 'var(--ada-fw-medium)', opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
      onMouseEnter={e => { if (!disabled && !loading) e.currentTarget.style.backgroundColor = hoverBg[variant]; }}
      onMouseLeave={e => { if (!disabled && !loading) e.currentTarget.style.backgroundColor = restBg[variant]; }}
    >
      {loading ? <Loader2 size={size === 'sm' ? 12 : 14} className="animate-spin" /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}

/* ── Toggle button ────────────────────────────────────────── */
function Toggle({ pressed, onChange, children, icon, disabled = false, size = 'md' }: {
  pressed: boolean; onChange: () => void; children?: React.ReactNode;
  icon?: React.ReactNode; disabled?: boolean; size?: 'sm' | 'md';
}) {
  const h = size === 'sm' ? '28px' : '32px';
  return (
    <button
      role="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onChange}
      className="inline-flex items-center gap-1.5 px-2.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] focus-visible:ring-offset-1"
      style={{
        height: h,
        fontSize: 'var(--ada-fs-xs)',
        fontWeight: 'var(--ada-fw-medium)',
        backgroundColor: pressed ? 'var(--ada-p-100)' : 'transparent',
        color: pressed ? 'var(--ada-p-700)' : 'var(--ada-text-2)',
        border: `1px solid ${pressed ? 'var(--ada-p-300)' : 'var(--ada-border-default)'}`,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {icon}{children}
    </button>
  );
}

export function ActionsSection() {
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('left');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  return (
    <div>
      {/* ── BUTTON ───────────────────────────────────────── */}
      <SH title="Button" desc="Primary interactive element. Five variants × three sizes, plus loading and disabled states." />

      <Row label="Variants">
        <Btn variant="primary">Primary</Btn>
        <Btn variant="secondary">Secondary</Btn>
        <Btn variant="ghost">Ghost</Btn>
        <Btn variant="destructive">Destructive</Btn>
        <Btn variant="link">Link button</Btn>
      </Row>

      <Row label="Sizes">
        <Btn size="sm">Small</Btn>
        <Btn size="md">Medium</Btn>
        <Btn size="lg">Large</Btn>
        <Btn variant="secondary" size="sm">Small</Btn>
        <Btn variant="secondary" size="md">Medium</Btn>
        <Btn variant="secondary" size="lg">Large</Btn>
      </Row>

      <Row label="With Icons">
        <Btn icon={<Plus size={14} />}>Add Item</Btn>
        <Btn variant="secondary" icon={<Upload size={14} />}>Upload</Btn>
        <Btn variant="ghost" icon={<Copy size={14} />}>Copy</Btn>
        <Btn variant="secondary" iconRight={<ChevronDown size={14} />}>Options</Btn>
        <Btn variant="secondary" iconRight={<ExternalLink size={13} />}>Open link</Btn>
      </Row>

      <Row label="States">
        <Btn>Default</Btn>
        <Btn loading>Loading</Btn>
        <Btn disabled>Disabled</Btn>
        <Btn variant="secondary" loading>Loading</Btn>
        <Btn variant="secondary" disabled>Disabled</Btn>
        <Btn variant="ghost" disabled>Disabled</Btn>
        <Btn variant="destructive" loading>Deleting…</Btn>
      </Row>

      <Row label="Icon-only">
        {[
          { icon: <Plus size={15} />, label: 'Add', v: 'primary' as const },
          { icon: <Edit size={15} />, label: 'Edit', v: 'secondary' as const },
          { icon: <Copy size={15} />, label: 'Copy', v: 'ghost' as const },
          { icon: <Trash2 size={15} />, label: 'Delete', v: 'destructive' as const },
        ].map(b => (
          <button
            key={b.label}
            aria-label={b.label}
            title={b.label}
            className="flex items-center justify-center rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] focus-visible:ring-offset-1"
            style={{ width: 32, height: 32, backgroundColor: b.v === 'primary' ? 'var(--ada-btn-primary-bg)' : b.v === 'destructive' ? 'var(--ada-e-600)' : 'var(--ada-surface-1)', borderColor: b.v === 'primary' ? 'transparent' : b.v === 'destructive' ? 'transparent' : 'var(--ada-border-default)', color: b.v === 'primary' || b.v === 'destructive' ? 'white' : 'var(--ada-text-2)' }}
          >
            {b.icon}
          </button>
        ))}
      </Row>

      <Divider />

      {/* ── BUTTON GROUP ─────────────────────────────────── */}
      <SH title="Button Group" desc="Grouped related actions sharing a border. Segmented control pattern." />

      <Row label="Horizontal Group">
        <div className="inline-flex rounded border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
          {['Previous', 'Today', 'Next'].map((l, i) => (
            <button key={l}
              className="px-3 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: i === 1 ? 'var(--ada-p-600)' : 'var(--ada-surface-1)', color: i === 1 ? 'white' : 'var(--ada-text-2)', borderRight: i < 2 ? '1px solid var(--ada-border-default)' : 'none' }}
            >{l}</button>
          ))}
        </div>
        <div className="inline-flex rounded border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
          {['Copy', 'Paste', 'Cut'].map((l, i) => (
            <button key={l}
              className="flex items-center gap-1 px-3 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-sm)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-2)', borderRight: i < 2 ? '1px solid var(--ada-border-default)' : 'none' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-1)')}
            >{l}</button>
          ))}
        </div>
      </Row>

      <Row label="Segmented Control">
        <div className="inline-flex gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--ada-surface-2)', border: '1px solid var(--ada-border-default)' }}>
          {(['light', 'dark', 'system'] as const).map(t => (
            <button key={t}
              onClick={() => setTheme(t)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: theme === t ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)', backgroundColor: theme === t ? 'var(--ada-surface-1)' : 'transparent', color: theme === t ? 'var(--ada-text-1)' : 'var(--ada-text-3)', boxShadow: theme === t ? 'var(--ada-shadow-1)' : 'none' }}
              aria-pressed={theme === t}
            >
              {t === 'light' ? <Sun size={12} /> : t === 'dark' ? <Moon size={12} /> : <Monitor size={12} />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </Row>

      <Divider />

      {/* ── TOGGLE ───────────────────────────────────────── */}
      <SH title="Toggle" desc="Two-state button indicating active/inactive for a single feature. Supports pressed/unpressed ARIA state." />

      <Row label="Text Toggles">
        <Toggle pressed={bold} onChange={() => setBold(!bold)} icon={<Bold size={13} />}>Bold</Toggle>
        <Toggle pressed={italic} onChange={() => setItalic(!italic)} icon={<Italic size={13} />}>Italic</Toggle>
        <Toggle pressed={underline} onChange={() => setUnderline(!underline)} icon={<Underline size={13} />}>Underline</Toggle>
        <Toggle pressed={false} onChange={() => {}} disabled icon={<Copy size={13} />}>Disabled Off</Toggle>
        <Toggle pressed={true} onChange={() => {}} disabled icon={<Bold size={13} />}>Disabled On</Toggle>
      </Row>

      <Row label="Icon-only Toggles">
        <Toggle pressed={bold} onChange={() => setBold(!bold)} icon={<Bold size={14} />} />
        <Toggle pressed={italic} onChange={() => setItalic(!italic)} icon={<Italic size={14} />} />
        <Toggle pressed={underline} onChange={() => setUnderline(!underline)} icon={<Underline size={14} />} />
      </Row>

      <Divider />

      {/* ── TOGGLE GROUP ─────────────────────────────────── */}
      <SH title="Toggle Group" desc="Group of toggles enforcing single-select or multi-select semantics." />

      <Row label="Single Select (Alignment)">
        <div className="inline-flex rounded border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }} role="radiogroup" aria-label="Text alignment">
          {([['left', <AlignLeft size={14} />, 'Left'], ['center', <AlignCenter size={14} />, 'Center'], ['right', <AlignRight size={14} />, 'Right']] as [typeof align, React.ReactNode, string][]).map(([val, icon, label]) => (
            <button
              key={val}
              role="radio"
              aria-checked={align === val}
              aria-label={label}
              onClick={() => setAlign(val)}
              className="flex items-center justify-center w-9 h-9 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ backgroundColor: align === val ? 'var(--ada-p-100)' : 'var(--ada-surface-1)', color: align === val ? 'var(--ada-p-700)' : 'var(--ada-text-2)', borderRight: val !== 'right' ? '1px solid var(--ada-border-default)' : 'none' }}
            >{icon}</button>
          ))}
        </div>
      </Row>

      <Row label="Multi Select (Formatting)">
        <div className="inline-flex gap-1 p-1 rounded-md" style={{ backgroundColor: 'var(--ada-surface-2)', border: '1px solid var(--ada-border-default)' }} role="group" aria-label="Text formatting">
          <Toggle pressed={bold} onChange={() => setBold(!bold)} icon={<Bold size={13} />} size="sm" />
          <Toggle pressed={italic} onChange={() => setItalic(!italic)} icon={<Italic size={13} />} size="sm" />
          <Toggle pressed={underline} onChange={() => setUnderline(!underline)} icon={<Underline size={13} />} size="sm" />
        </div>
      </Row>

      <Row label="View Toggle">
        <div className="inline-flex rounded border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
          {([['list', <List size={14} />, 'List view'], ['grid', <LayoutGrid size={14} />, 'Grid view']] as ['list' | 'grid', React.ReactNode, string][]).map(([v, icon, label]) => (
            <button
              key={v}
              aria-label={label}
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className="flex items-center justify-center w-9 h-9 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ backgroundColor: view === v ? 'var(--ada-p-600)' : 'var(--ada-surface-1)', color: view === v ? 'white' : 'var(--ada-text-3)', borderRight: v === 'list' ? '1px solid var(--ada-border-default)' : 'none' }}
            >{icon}</button>
          ))}
        </div>
      </Row>

      <Divider />

      {/* ── KBD ──────────────────────────────────────────── */}
      <SH title="Kbd — Keyboard Key Indicator" desc="Visual representation of keyboard shortcuts and key combinations." />

      <Row label="Single Keys">
        {['⌘', '⇧', '⌥', '⌃', '⏎', '⎋', '⌫', '⇥'].map(k => (
          <kbd key={k} className="inline-flex items-center justify-center rounded border px-2 py-1" style={{ fontSize: 'var(--ada-fs-sm)', fontFamily: 'var(--ada-font-sans)', backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-strong)', color: 'var(--ada-text-1)', minWidth: 28, boxShadow: '0 1px 0 var(--ada-border-strong)' }}>{k}</kbd>
        ))}
      </Row>

      <Row label="Combinations">
        {[
          ['⌘', 'K'],
          ['⌘', '⇧', 'P'],
          ['⌃', 'C'],
          ['⌥', '⌘', 'I'],
        ].map((combo, i) => (
          <div key={i} className="flex items-center gap-0.5">
            {combo.map((k, j) => (
              <span key={j} className="flex items-center gap-0.5">
                <kbd className="inline-flex items-center justify-center rounded border px-1.5 py-0.5" style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-sans)', backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-strong)', color: 'var(--ada-text-1)', boxShadow: '0 1px 0 var(--ada-border-strong)' }}>{k}</kbd>
                {j < combo.length - 1 && <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', margin: '0 1px' }}>+</span>}
              </span>
            ))}
          </div>
        ))}
      </Row>

      <Row label="In Context">
        <div className="flex items-center gap-4 p-3 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
          {[
            { action: 'Open command palette', keys: ['⌘', 'K'] },
            { action: 'Search', keys: ['⌘', 'F'] },
            { action: 'Save', keys: ['⌘', 'S'] },
          ].map(item => (
            <div key={item.action} className="flex items-center gap-2">
              <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{item.action}</span>
              <div className="flex items-center gap-0.5">
                {item.keys.map((k, i) => (
                  <span key={i} className="flex items-center gap-0.5">
                    <kbd className="px-1.5 py-0.5 rounded border" style={{ fontSize: 'var(--ada-fs-2xs)', fontFamily: 'var(--ada-font-sans)', backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-strong)', color: 'var(--ada-text-2)', boxShadow: '0 1px 0 var(--ada-border-strong)' }}>{k}</kbd>
                    {i < item.keys.length - 1 && <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>+</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Row>

      <Divider />

      {/* ── LABEL ────────────────────────────────────────── */}
      <SH title="Label" desc="Accessible form label with required, optional, and tooltip indicator variants." />

      <Row label="Variants">
        {[
          { text: 'Full name', note: null },
          { text: 'Email address', note: 'required' },
          { text: 'Phone number', note: 'optional' },
          { text: 'API Key', note: 'hint' },
        ].map(({ text, note }) => (
          <div key={text} className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5">
              <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>{text}</span>
              {note === 'required' && <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-e-500)' }}>*</span>}
              {note === 'optional' && <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', fontWeight: 'var(--ada-fw-regular)' }}>(optional)</span>}
              {note === 'hint' && <Info size={11} style={{ color: 'var(--ada-text-4)' }} />}
            </label>
            <input
              placeholder={`Enter ${text.toLowerCase()}…`}
              className="rounded border px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)', width: 180 }}
            />
          </div>
        ))}
      </Row>

      <div className="h-8" />
    </div>
  );
}
