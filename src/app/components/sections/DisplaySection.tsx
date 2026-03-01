import { useState } from 'react';
import { Package, Search, Plus, Inbox, FileText, Users, Loader2, AlertCircle } from 'lucide-react';

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
      <div className="flex flex-wrap gap-4 items-start">{children}</div>
    </div>
  );
}
function Divider() { return <hr className="my-10" style={{ borderColor: 'var(--ada-border-default)' }} />; }

/* ── Spinner ───────────────────────────────────────────────── */
function Spinner({ size = 16, color = 'var(--ada-p-600)' }: { size?: number; color?: string }) {
  return <Loader2 size={size} className="animate-spin" style={{ color }} />;
}

/* ── Skeleton ──────────────────────────────────────────────── */
function Sk({ w, h, r = '4px' }: { w: number | string; h: number; r?: string }) {
  return (
    <div className="animate-pulse rounded" style={{ width: w, height: h, borderRadius: r, backgroundColor: 'var(--ada-surface-3)' }} />
  );
}

/* ── Progress ──────────────────────────────────────────────── */
function Progress({ value, size = 'md', color = 'var(--ada-p-600)', indeterminate = false }: {
  value?: number; size?: 'xs' | 'sm' | 'md' | 'lg'; color?: string; indeterminate?: boolean;
}) {
  const heights = { xs: 2, sm: 4, md: 6, lg: 10 };
  const h = heights[size];
  return (
    <div className="rounded-full overflow-hidden" style={{ height: h, backgroundColor: 'var(--ada-surface-3)', width: '100%' }} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      {indeterminate ? (
        <div className="h-full rounded-full" style={{ width: '40%', backgroundColor: color, animation: 'slide 1.5s ease-in-out infinite' }} />
      ) : (
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${value ?? 0}%`, backgroundColor: color }} />
      )}
    </div>
  );
}

/* ── Badge ─────────────────────────────────────────────────── */
function Badge({ variant = 'neutral', size = 'md', dot = false, children }: {
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md'; dot?: boolean; children: React.ReactNode;
}) {
  const styles: Record<string, React.CSSProperties> = {
    neutral: { backgroundColor: 'var(--ada-surface-3)', color: 'var(--ada-text-2)', border: '1px solid var(--ada-border-default)' },
    primary: { backgroundColor: 'var(--ada-p-100)', color: 'var(--ada-p-700)', border: '1px solid var(--ada-p-200)' },
    success: { backgroundColor: 'var(--ada-s-100)', color: 'var(--ada-s-700)', border: '1px solid var(--ada-s-200)' },
    warning: { backgroundColor: 'var(--ada-w-100)', color: 'var(--ada-w-700)', border: '1px solid var(--ada-w-200)' },
    error: { backgroundColor: 'var(--ada-e-100)', color: 'var(--ada-e-700)', border: '1px solid var(--ada-e-200)' },
    info: { backgroundColor: 'var(--ada-i-100)', color: 'var(--ada-i-700)', border: '1px solid var(--ada-i-200)' },
  };
  const dotColors: Record<string, string> = { neutral: 'var(--ada-n-500)', primary: 'var(--ada-p-500)', success: 'var(--ada-s-500)', warning: 'var(--ada-w-500)', error: 'var(--ada-e-500)', info: 'var(--ada-i-500)' };
  return (
    <span className="inline-flex items-center gap-1 rounded-full" style={{ ...styles[variant], padding: size === 'sm' ? '1px 7px' : '2px 9px', fontSize: size === 'sm' ? 'var(--ada-fs-2xs)' : 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)' }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: dotColors[variant], display: 'inline-block', flexShrink: 0 }} />}
      {children}
    </span>
  );
}

const AVATAR_COLORS = [
  { bg: 'var(--ada-p-100)', text: 'var(--ada-p-700)' },
  { bg: 'var(--ada-s-100)', text: 'var(--ada-s-700)' },
  { bg: 'var(--ada-w-100)', text: 'var(--ada-w-700)' },
  { bg: 'var(--ada-i-100)', text: 'var(--ada-i-700)' },
];

function Avatar({ initials, size = 'md', status }: { initials: string; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; status?: 'online' | 'away' | 'busy' | 'offline'; }) {
  const sizes = { xs: 20, sm: 28, md: 36, lg: 44, xl: 56 };
  const px = sizes[size];
  const colorIdx = initials.charCodeAt(0) % AVATAR_COLORS.length;
  const { bg, text } = AVATAR_COLORS[colorIdx];
  const dotSize = size === 'xl' ? 12 : size === 'lg' ? 10 : 8;
  const statusColor: Record<string, string> = { online: 'var(--ada-s-500)', away: 'var(--ada-w-500)', busy: 'var(--ada-e-500)', offline: 'var(--ada-n-400)' };
  return (
    <div className="relative inline-flex flex-shrink-0">
      <div className="rounded-full flex items-center justify-center" style={{ width: px, height: px, backgroundColor: bg, border: '1.5px solid var(--ada-border-default)' }}>
        <span style={{ fontSize: px * 0.35, fontWeight: 'var(--ada-fw-semibold)', color: text }}>{initials}</span>
      </div>
      {status && (
        <span className="absolute -bottom-0.5 -right-0.5 rounded-full border-2" style={{ width: dotSize, height: dotSize, backgroundColor: statusColor[status], borderColor: 'var(--ada-bg-base)' }} />
      )}
    </div>
  );
}

export function DisplaySection() {
  const [progress, setProgress] = useState(68);

  return (
    <div>
      {/* ── AVATAR ────────────────────────────────────────── */}
      <SH title="Avatar" desc="User representation with initials fallback. Five sizes, status indicators, and group stacking." />

      <Row label="Sizes">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(s => (
          <div key={s} className="flex flex-col items-center gap-2">
            <Avatar initials="SC" size={s} />
            <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', textTransform: 'uppercase' }}>{s}</span>
          </div>
        ))}
      </Row>

      <Row label="With Status Indicator">
        {(['online', 'away', 'busy', 'offline'] as const).map(status => (
          <div key={status} className="flex flex-col items-center gap-2">
            <Avatar initials="MR" size="md" status={status} />
            <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', textTransform: 'capitalize' }}>{status}</span>
          </div>
        ))}
      </Row>

      <Row label="Avatar Group">
        <div className="flex items-center">
          {['SC', 'MR', 'PP', 'JW', 'AT'].map((i, idx) => (
            <div key={i} className="rounded-full border-2" style={{ marginLeft: idx === 0 ? 0 : -8, borderColor: 'var(--ada-bg-base)', zIndex: 5 - idx }}>
              <Avatar initials={i} size="sm" />
            </div>
          ))}
          <div className="rounded-full flex items-center justify-center border-2 ml-[-8px]" style={{ width: 28, height: 28, backgroundColor: 'var(--ada-surface-3)', borderColor: 'var(--ada-bg-base)', fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-3)' }}>
            +8
          </div>
        </div>
      </Row>

      <Divider />

      {/* ── BADGE ─────────────────────────────────────────── */}
      <SH title="Badge" desc="Status and category labels in 6 semantic color variants, two sizes, with optional dot indicator." />

      <Row label="Variants">
        <Badge variant="neutral">Neutral</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="info">Info</Badge>
      </Row>

      <Row label="Small Size">
        <Badge variant="neutral" size="sm">Neutral</Badge>
        <Badge variant="primary" size="sm">Primary</Badge>
        <Badge variant="success" size="sm">Success</Badge>
        <Badge variant="warning" size="sm">Warning</Badge>
        <Badge variant="error" size="sm">Error</Badge>
        <Badge variant="info" size="sm">Info</Badge>
      </Row>

      <Row label="With Dot Indicator">
        <Badge variant="success" dot>Online</Badge>
        <Badge variant="warning" dot>Degraded</Badge>
        <Badge variant="error" dot>Outage</Badge>
        <Badge variant="neutral" dot>Unknown</Badge>
        <Badge variant="info" dot>Syncing</Badge>
      </Row>

      <Divider />

      {/* ── CARD ─────────────────────────────────────────── */}
      <SH title="Card" desc="Content container with header, body, and footer zones. Supports interactive hover state." />

      <Row label="Variants">
        {/* Basic */}
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', width: 240 }}>
          <div style={{ fontSize: 'var(--ada-fs-base)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>Basic Card</div>
          <div style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)', lineHeight: 1.5 }}>Simple card for grouping related content into a clean container.</div>
        </div>

        {/* With Header/Footer */}
        <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', width: 240 }}>
          <div className="px-4 py-3 border-b" style={{ backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
            <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Card with Header</div>
          </div>
          <div className="px-4 py-4">
            <div style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)', lineHeight: 1.5 }}>Card body with structured header and footer zones.</div>
          </div>
          <div className="px-4 py-3 border-t flex justify-end gap-2" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
            <button className="px-3 py-1.5 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-2)' }}>Cancel</button>
            <button className="px-3 py-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-xs)', backgroundColor: 'var(--ada-p-600)', color: 'white' }}>Save</button>
          </div>
        </div>

        {/* Interactive */}
        <div className="rounded-lg border p-4 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
          tabIndex={0}
          style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', width: 240 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ada-p-300)'; e.currentTarget.style.boxShadow = 'var(--ada-shadow-2)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ada-border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <div style={{ fontSize: 'var(--ada-fs-base)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>Interactive Card</div>
          <div style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)', lineHeight: 1.5 }}>Hover or focus to see the elevation effect.</div>
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-p-600)', marginTop: '12px', fontWeight: 'var(--ada-fw-medium)' }}>View details →</div>
        </div>
      </Row>

      <Divider />

      {/* ── ASPECT RATIO ─────────────────────────────────── */}
      <SH title="Aspect Ratio" desc="Content container that maintains a fixed width-to-height proportion." />

      <Row label="Common Ratios">
        {[['16:9', 9/16], ['4:3', 3/4], ['1:1', 1], ['21:9', 9/21]].map(([label, ratio]) => (
          <div key={label as string} style={{ width: 140 }}>
            <div className="rounded-lg border flex items-center justify-center" style={{ paddingBottom: `${(ratio as number) * 100}%`, position: 'relative', backgroundColor: 'var(--ada-surface-3)', borderColor: 'var(--ada-border-default)' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-3)', fontFamily: 'var(--ada-font-mono)' }}>{label as string}</span>
              </div>
            </div>
          </div>
        ))}
      </Row>

      <Divider />

      {/* ── PROGRESS BAR ─────────────────────────────────── */}
      <SH title="Progress Bar" desc="Linear indicator for determinate and indeterminate loading states." />

      <Row label="Determinate">
        <div className="flex flex-col gap-4" style={{ width: 320 }}>
          {[
            { label: 'Uploading file', value: 68, color: 'var(--ada-p-600)', size: 'md' as const },
            { label: 'Storage used', value: 82, color: 'var(--ada-w-600)', size: 'md' as const },
            { label: 'Budget spent', value: 95, color: 'var(--ada-e-600)', size: 'md' as const },
            { label: 'Completed tasks', value: 44, color: 'var(--ada-s-600)', size: 'sm' as const },
          ].map(p => (
            <div key={p.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>{p.label}</span>
                <span style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-3)' }}>{p.value}%</span>
              </div>
              <Progress value={p.value} color={p.color} size={p.size} />
            </div>
          ))}
        </div>
      </Row>

      <Row label="Indeterminate">
        <div style={{ width: 280 }}>
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)', marginBottom: '8px' }}>Loading data…</div>
          <Progress indeterminate />
        </div>
      </Row>

      <Row label="Sizes">
        <div className="flex flex-col gap-3" style={{ width: 280 }}>
          {(['xs', 'sm', 'md', 'lg'] as const).map(s => (
            <div key={s} className="flex items-center gap-3">
              <span style={{ width: 20, fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)', textTransform: 'uppercase' }}>{s}</span>
              <div className="flex-1"><Progress value={65} size={s} /></div>
            </div>
          ))}
        </div>
      </Row>

      <Divider />

      {/* ── SKELETON ─────────────────────────────────────── */}
      <SH title="Skeleton Loader" desc="Animated placeholder shown during content loading to prevent layout shift." />

      <Row label="Patterns">
        {/* Text lines */}
        <div className="flex flex-col gap-2" style={{ width: 240 }}>
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 'var(--ada-fw-semibold)' }}>Text Lines</div>
          <Sk w="60%" h={14} />
          <Sk w="100%" h={10} />
          <Sk w="100%" h={10} />
          <Sk w="85%" h={10} />
          <Sk w="40%" h={10} />
        </div>

        {/* Profile card */}
        <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', width: 240 }}>
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 'var(--ada-fw-semibold)' }}>Profile Card</div>
          <div className="flex items-center gap-3 mb-3">
            <Sk w={40} h={40} r="50%" />
            <div className="flex flex-col gap-1.5 flex-1">
              <Sk w="70%" h={12} />
              <Sk w="50%" h={10} />
            </div>
          </div>
          <Sk w="100%" h={8} />
          <div className="mt-1"><Sk w="80%" h={8} /></div>
          <div className="flex gap-2 mt-3">
            <Sk w={70} h={28} r="6px" />
            <Sk w={70} h={28} r="6px" />
          </div>
        </div>

        {/* Table rows */}
        <div style={{ width: 280 }}>
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 'var(--ada-fw-semibold)' }}>Table Rows</div>
          {[100, 90, 75, 85, 65].map((w, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: 'var(--ada-border-subtle)' }}>
              <Sk w={24} h={24} r="50%" />
              <Sk w={`${w}%`} h={10} />
              <Sk w={40} h={20} r="12px" />
            </div>
          ))}
        </div>
      </Row>

      <Divider />

      {/* ── SPINNER ──────────────────────────────────────── */}
      <SH title="Spinner" desc="Animated loading indicator in multiple sizes and semantic colors." />

      <Row label="Sizes">
        {[12, 16, 20, 24, 32].map(s => (
          <div key={s} className="flex flex-col items-center gap-2">
            <Spinner size={s} />
            <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)' }}>{s}px</span>
          </div>
        ))}
      </Row>

      <Row label="Colors">
        {[
          ['Primary', 'var(--ada-p-600)'],
          ['Success', 'var(--ada-s-600)'],
          ['Warning', 'var(--ada-w-600)'],
          ['Error', 'var(--ada-e-600)'],
          ['Muted', 'var(--ada-text-4)'],
        ].map(([label, color]) => (
          <div key={label} className="flex items-center gap-2 px-3 py-2 rounded border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
            <Spinner size={16} color={color} />
            <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>{label}</span>
          </div>
        ))}
      </Row>

      <Divider />

      {/* ── EMPTY STATE ──────────────────────────────────── */}
      <SH title="Empty State" desc="Placeholder shown when a view has no content. Includes icon, message, and optional action." />

      <Row label="Variants">
        {[
          { icon: <Inbox size={32} />, title: 'No notifications', desc: 'You\'re all caught up. New notifications will appear here.', action: null },
          { icon: <Search size={32} />, title: 'No results found', desc: 'Try adjusting your search or filter to find what you\'re looking for.', action: 'Clear filters' },
          { icon: <FileText size={32} />, title: 'No documents yet', desc: 'Create your first document to get started with your workspace.', action: 'Create document' },
        ].map(e => (
          <div key={e.title} className="flex flex-col items-center text-center py-10 px-6 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)', width: 240, borderStyle: 'dashed' }}>
            <div style={{ color: 'var(--ada-text-4)', marginBottom: '12px' }}>{e.icon}</div>
            <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '6px' }}>{e.title}</div>
            <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', lineHeight: 1.5, marginBottom: e.action ? '16px' : '0' }}>{e.desc}</div>
            {e.action && (
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: 'var(--ada-p-600)', color: 'white' }}>
                <Plus size={12} />{e.action}
              </button>
            )}
          </div>
        ))}
      </Row>

      <Divider />

      {/* ── SEPARATOR ────────────────────────────────────── */}
      <SH title="Separator" desc="Visual divider between content sections. Horizontal and vertical orientations." />

      <Row label="Horizontal">
        <div style={{ width: 400 }}>
          <div style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)', marginBottom: '12px' }}>Section above the divider</div>
          <hr style={{ borderColor: 'var(--ada-border-default)' }} />
          <div style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)', marginTop: '12px' }}>Section below the divider</div>
        </div>
      </Row>

      <Row label="With Label">
        <div style={{ width: 400 }}>
          <div className="flex items-center gap-3">
            <hr className="flex-1" style={{ borderColor: 'var(--ada-border-default)' }} />
            <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-4)', whiteSpace: 'nowrap' }}>OR CONTINUE WITH</span>
            <hr className="flex-1" style={{ borderColor: 'var(--ada-border-default)' }} />
          </div>
        </div>
      </Row>

      <Row label="Vertical">
        <div className="flex items-center gap-4 h-8">
          <span style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)' }}>File</span>
          <div style={{ width: 1, height: '100%', backgroundColor: 'var(--ada-border-default)' }} />
          <span style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)' }}>Edit</span>
          <div style={{ width: 1, height: '100%', backgroundColor: 'var(--ada-border-default)' }} />
          <span style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)' }}>View</span>
          <div style={{ width: 1, height: '100%', backgroundColor: 'var(--ada-border-default)' }} />
          <span style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)' }}>Help</span>
        </div>
      </Row>

      <div className="h-8" />
    </div>
  );
}
