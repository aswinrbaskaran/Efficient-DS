import { useState } from 'react';
import { ChevronDown, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, MoreHorizontal, ChevronLeft } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function SH({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5">
      <h2 style={{ fontSize: 'var(--ada-fs-xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '3px' }}>{title}</h2>
      {desc && <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>{desc}</p>}
    </div>
  );
}
function Divider() { return <hr className="my-10" style={{ borderColor: 'var(--ada-border-default)' }} />; }

/* ── Chart Tooltip ─────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border px-3 py-2" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-3)' }}>
      <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-2)', marginBottom: '4px' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color, display: 'inline-block' }} />
          <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{p.name}:</span>
          <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{typeof p.value === 'number' && p.value > 999 ? `${(p.value / 1000).toFixed(1)}k` : p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Data ──────────────────────────────────────────────────── */
const chartData = [
  { month: 'Sep', value: 4200, sessions: 3100 }, { month: 'Oct', value: 5100, sessions: 3800 },
  { month: 'Nov', value: 4800, sessions: 3500 }, { month: 'Dec', value: 6100, sessions: 4600 },
  { month: 'Jan', value: 5800, sessions: 4200 }, { month: 'Feb', value: 6400, sessions: 4800 },
  { month: 'Mar', value: 7100, sessions: 5300 },
];
const barData = [
  { day: 'Mon', users: 2400 }, { day: 'Tue', users: 1800 }, { day: 'Wed', users: 3200 },
  { day: 'Thu', users: 2800 }, { day: 'Fri', users: 3600 }, { day: 'Sat', users: 1200 }, { day: 'Sun', users: 900 },
];

const tableUsers = [
  { id: 'u1', name: 'Sarah Chen', email: 'sarah@acme.com', role: 'Admin', status: 'Active', plan: 'Enterprise', joined: 'Jan 12, 2026' },
  { id: 'u2', name: 'Marcus Reed', email: 'marcus@acme.com', role: 'Developer', status: 'Active', plan: 'Pro', joined: 'Feb 3, 2026' },
  { id: 'u3', name: 'Priya Patel', email: 'priya@acme.com', role: 'Viewer', status: 'Inactive', plan: 'Free', joined: 'Mar 1, 2026' },
  { id: 'u4', name: 'James Wilson', email: 'james@acme.com', role: 'Developer', status: 'Pending', plan: 'Pro', joined: 'Mar 14, 2026' },
  { id: 'u5', name: 'Aiko Tanaka', email: 'aiko@acme.com', role: 'Admin', status: 'Active', plan: 'Enterprise', joined: 'Apr 2, 2026' },
  { id: 'u6', name: 'Carlos Ruiz', email: 'carlos@acme.com', role: 'Developer', status: 'Active', plan: 'Pro', joined: 'Apr 8, 2026' },
];

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, [string, string]> = {
    Active: ['var(--ada-s-100)', 'var(--ada-s-700)'],
    Inactive: ['var(--ada-surface-3)', 'var(--ada-text-3)'],
    Pending: ['var(--ada-w-100)', 'var(--ada-w-700)'],
  };
  const [bg, text] = cfg[status] || cfg['Inactive'];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: bg, color: text }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: text, display: 'inline-block' }} />
      {status}
    </span>
  );
}

export function DataSection() {
  /* Table state */
  const [sortCol, setSortCol] = useState<string>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [dtPage, setDtPage] = useState(1);
  const perPage = 4;

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <ArrowUpDown size={11} style={{ color: 'var(--ada-text-4)' }} />;
    return sortDir === 'asc' ? <ArrowUp size={11} style={{ color: 'var(--ada-p-600)' }} /> : <ArrowDown size={11} style={{ color: 'var(--ada-p-600)' }} />;
  };

  const filtered = tableUsers.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => {
    const av = (a as any)[sortCol], bv = (b as any)[sortCol];
    return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });
  const paginated = sorted.slice((dtPage - 1) * perPage, dtPage * perPage);
  const pageCount = Math.ceil(sorted.length / perPage);

  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map(u => u.id));
  const toggleOne = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  /* Accordion state */
  const [accOpen, setAccOpen] = useState<string[]>(['what']);
  const [multiMode, setMultiMode] = useState(false);
  const toggleAcc = (id: string) => {
    if (multiMode) setAccOpen(o => o.includes(id) ? o.filter(x => x !== id) : [...o, id]);
    else setAccOpen(o => o.includes(id) ? [] : [id]);
  };
  const accItems = [
    { id: 'what', q: 'What is this design system?', a: 'Efficient Design System is an accessibility-first, token-based system for VS Code extensions, enterprise dashboards, SaaS platforms, and admin panels. Built with an 8pt grid, CSS custom properties, and three themes.' },
    { id: 'wcag', q: 'How is WCAG AA compliance achieved?', a: 'Every component uses semantic HTML, visible focus states (2px ring), sufficient color contrast (≥4.5:1 for text), and keyboard navigation. All interactive states are programmatically determinable.' },
    { id: 'themes', q: 'How do themes work?', a: 'Three themes are included: light (default), dark, and high-contrast. All colors are CSS custom properties. Switching themes applies class names to the root element, remapping all tokens.' },
    { id: 'tokens', q: 'What is a design token?', a: 'A design token is a name-value pair representing a design decision — like a color, spacing value, or typeface. Tokens make visual changes propagate consistently without touching component logic.' },
  ];

  /* Collapsible state */
  const [collOpen, setCollOpen] = useState(false);

  /* Carousel state */
  const cards = ['Dashboard Overview', 'User Management', 'API Configuration', 'Analytics Report', 'System Health'];
  const [carIdx, setCarIdx] = useState(0);
  const carPrev = () => setCarIdx(i => (i - 1 + cards.length) % cards.length);
  const carNext = () => setCarIdx(i => (i + 1) % cards.length);

  const tickStyle = { fill: 'var(--ada-text-4)', fontSize: 10 };

  return (
    <div>
      {/* ── SIMPLE TABLE ─────────────────────────────────── */}
      <SH title="Table" desc="Structured data table with sortable columns, row hover, and semantic markup." />
      <div className="rounded-lg border overflow-hidden mb-6" style={{ borderColor: 'var(--ada-border-default)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" role="table" aria-label="Users table">
            <thead>
              <tr style={{ backgroundColor: 'var(--ada-surface-2)', borderBottom: '1px solid var(--ada-border-default)' }}>
                {['Name', 'Email', 'Role', 'Plan', 'Status'].map(col => (
                  <th key={col} className="text-left px-4 py-2.5" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-3)', whiteSpace: 'nowrap' }}>
                    <button onClick={() => handleSort(col.toLowerCase())} className="flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] rounded" aria-sort={sortCol === col.toLowerCase() ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}>
                      {col} <SortIcon col={col.toLowerCase()} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableUsers.slice(0, 4).map((u, i) => (
                <tr key={u.id} className="transition-colors" style={{ borderBottom: i < 3 ? '1px solid var(--ada-border-subtle)' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <td className="px-4 py-3"><span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}>{u.name}</span></td>
                  <td className="px-4 py-3"><span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', fontFamily: 'var(--ada-font-mono)' }}>{u.email}</span></td>
                  <td className="px-4 py-3"><span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>{u.role}</span></td>
                  <td className="px-4 py-3"><span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>{u.plan}</span></td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Divider />

      {/* ── DATA TABLE ───────────────────────────────────── */}
      <SH title="Data Table" desc="Full-featured table: search, sort, row selection, bulk actions, and pagination." />
      <div className="rounded-lg border overflow-hidden mb-6" style={{ borderColor: 'var(--ada-border-default)' }}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <span className="px-2.5 py-1 rounded text-sm" style={{ fontSize: 'var(--ada-fs-xs)', backgroundColor: 'var(--ada-p-100)', color: 'var(--ada-p-700)', fontWeight: 'var(--ada-fw-medium)' }}>{selected.length} selected</span>
            )}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--ada-text-3)' }} />
              <input value={search} onChange={e => { setSearch(e.target.value); setDtPage(1); }} placeholder="Search users…"
                className="pl-8 pr-3 py-1.5 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
                style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)', width: 220 }} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <button className="px-3 py-1.5 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', borderColor: 'var(--ada-e-200)', backgroundColor: 'var(--ada-e-50)', color: 'var(--ada-e-700)' }}>Delete {selected.length}</button>
            )}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-2)' }}>
              <Filter size={12} /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full" role="grid" aria-label="Data table">
            <thead>
              <tr style={{ backgroundColor: 'var(--ada-surface-2)', borderBottom: '1px solid var(--ada-border-default)' }}>
                <th className="px-4 py-2.5 w-10">
                  <input type="checkbox" checked={selected.length === paginated.length && paginated.length > 0} onChange={toggleAll}
                    className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" aria-label="Select all" />
                </th>
                {[['name', 'Name'], ['role', 'Role'], ['status', 'Status'], ['plan', 'Plan'], ['joined', 'Joined']].map(([key, label]) => (
                  <th key={key} className="text-left px-4 py-2.5" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-3)', whiteSpace: 'nowrap' }}>
                    <button onClick={() => handleSort(key)} className="flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] rounded">{label} <SortIcon col={key} /></button>
                  </th>
                ))}
                <th className="w-10 px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center" style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-4)' }}>No users match your search.</td></tr>
              ) : paginated.map((u, i) => (
                <tr key={u.id} className="transition-colors" style={{ borderBottom: i < paginated.length - 1 ? '1px solid var(--ada-border-subtle)' : 'none', backgroundColor: selected.includes(u.id) ? 'var(--ada-p-50)' : 'transparent' }}
                  onMouseEnter={e => { if (!selected.includes(u.id)) e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = selected.includes(u.id) ? 'var(--ada-p-50)' : 'transparent'; }}>
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggleOne(u.id)} className="rounded" aria-label={`Select ${u.name}`} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--ada-p-100)' }}>
                        <span style={{ fontSize: '10px', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-p-700)' }}>{u.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}>{u.name}</div>
                        <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>{u.role}</span></td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3"><span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>{u.plan}</span></td>
                  <td className="px-4 py-3"><span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>{u.joined}</span></td>
                  <td className="px-4 py-3"><button className="p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ color: 'var(--ada-text-4)' }} aria-label="Row options"><MoreHorizontal size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t" style={{ backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
          <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>Showing {paginated.length} of {sorted.length} users</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setDtPage(p => Math.max(1, p - 1))} disabled={dtPage === 1}
              className="p-1.5 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: dtPage === 1 ? 'var(--ada-text-disabled)' : 'var(--ada-text-2)' }} aria-label="Previous">
              <ChevronLeft size={14} />
            </button>
            {Array(pageCount).fill(0).map((_, i) => (
              <button key={i} onClick={() => setDtPage(i + 1)}
                className="w-8 h-8 flex items-center justify-center rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
                style={{ fontSize: 'var(--ada-fs-xs)', borderColor: dtPage === i + 1 ? 'var(--ada-p-600)' : 'var(--ada-border-default)', backgroundColor: dtPage === i + 1 ? 'var(--ada-p-600)' : 'var(--ada-surface-1)', color: dtPage === i + 1 ? 'white' : 'var(--ada-text-2)' }}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setDtPage(p => Math.min(pageCount, p + 1))} disabled={dtPage === pageCount}
              className="p-1.5 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: dtPage === pageCount ? 'var(--ada-text-disabled)' : 'var(--ada-text-2)' }} aria-label="Next">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* ── ACCORDION ────────────────────────────────────── */}
      <SH title="Accordion" desc="Expandable content panels. Single-expand and multi-expand modes. Full keyboard support." />
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>Mode:</span>
          {[['Single', false], ['Multi', true]].map(([label, val]) => (
            <button key={label as string} onClick={() => { setMultiMode(val as boolean); setAccOpen([]); }}
              className="px-3 py-1 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: (multiMode === val) ? 'var(--ada-fw-semibold)' : 'var(--ada-fw-regular)', backgroundColor: (multiMode === val) ? 'var(--ada-p-100)' : 'var(--ada-surface-1)', color: (multiMode === val) ? 'var(--ada-p-700)' : 'var(--ada-text-2)', borderColor: (multiMode === val) ? 'var(--ada-p-300)' : 'var(--ada-border-default)' }}>
              {label as string}
            </button>
          ))}
        </div>
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
          {accItems.map((item, i) => (
            <div key={item.id} style={{ borderBottom: i < accItems.length - 1 ? '1px solid var(--ada-border-subtle)' : 'none' }}>
              <button
                onClick={() => toggleAcc(item.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ada-focus-ring)]"
                style={{ backgroundColor: accOpen.includes(item.id) ? 'var(--ada-surface-2)' : 'var(--ada-surface-1)', fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}
                aria-expanded={accOpen.includes(item.id)}
              >
                {item.q}
                <ChevronDown size={15} style={{ color: 'var(--ada-text-3)', transform: accOpen.includes(item.id) ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
              </button>
              {accOpen.includes(item.id) && (
                <div className="px-4 pb-4" style={{ backgroundColor: 'var(--ada-surface-1)' }}>
                  <div style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)', lineHeight: 1.6, paddingTop: '8px', borderTop: '1px solid var(--ada-border-subtle)' }}>{item.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* ── COLLAPSIBLE ──────────────────────────────────── */}
      <SH title="Collapsible" desc="Simple toggle section for secondary or advanced content. No animation overhead." />
      <div className="mb-6 rounded-lg border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
        <button
          onClick={() => setCollOpen(!collOpen)}
          className="w-full flex items-center justify-between px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ada-focus-ring)]"
          style={{ backgroundColor: 'var(--ada-surface-2)', fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}
          aria-expanded={collOpen}
        >
          <span>Advanced Configuration</span>
          <ChevronRight size={15} style={{ color: 'var(--ada-text-3)', transform: collOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
        </button>
        {collOpen && (
          <div className="px-4 py-4 space-y-3" style={{ borderTop: '1px solid var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
            {['Max connections', 'Timeout (ms)', 'Retry attempts'].map(field => (
              <div key={field} className="flex items-center justify-between">
                <label style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)' }}>{field}</label>
                <input type="number" defaultValue={field === 'Timeout (ms)' ? 5000 : field === 'Max connections' ? 10 : 3}
                  className="rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
                  style={{ width: 90, fontSize: 'var(--ada-fs-sm)', fontFamily: 'var(--ada-font-mono)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)', textAlign: 'right' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      <Divider />

      {/* ── CAROUSEL ─────────────────────────────────────── */}
      <SH title="Carousel" desc="Horizontal content slider with arrow navigation, dot indicators, and keyboard support." />
      <div className="mb-6">
        <div className="relative overflow-hidden rounded-xl border" style={{ borderColor: 'var(--ada-border-default)' }}>
          <div style={{ display: 'flex', transition: 'transform 0.3s ease', transform: `translateX(-${carIdx * 100}%)` }}>
            {cards.map((card, i) => (
              <div key={card} className="flex-shrink-0 w-full flex items-center justify-center" style={{ height: 160, backgroundColor: i % 2 === 0 ? 'var(--ada-surface-2)' : 'var(--ada-bg-muted)' }}>
                <div className="text-center">
                  <div style={{ fontSize: 'var(--ada-fs-xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>{card}</div>
                  <div style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-4)' }}>Slide {i + 1} of {cards.length}</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={carPrev} className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-2)', boxShadow: 'var(--ada-shadow-2)' }} aria-label="Previous slide">
            <ChevronLeft size={16} />
          </button>
          <button onClick={carNext} className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-2)', boxShadow: 'var(--ada-shadow-2)' }} aria-label="Next slide">
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5" aria-label="Slide indicators">
            {cards.map((_, i) => (
              <button key={i} onClick={() => setCarIdx(i)} className="rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
                style={{ width: i === carIdx ? 20 : 6, height: 6, backgroundColor: i === carIdx ? 'var(--ada-p-600)' : 'var(--ada-border-strong)' }} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>

      <Divider />

      {/* ── CHART CONTAINER ──────────────────────────────── */}
      <SH title="Chart Container" desc="Responsive chart wrappers. Area, Bar, and Line chart patterns using Recharts." />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 p-4 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
          <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '12px' }}>Area Chart — Revenue</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ada-border-subtle)" vertical={false} />
              <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} width={30} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" name="Revenue" stroke="#2563eb" strokeWidth={2} fill="url(#g1)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
          <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '12px' }}>Bar Chart — Daily Users</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={barData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ada-border-subtle)" vertical={false} />
              <XAxis dataKey="day" tick={{ ...tickStyle, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} width={26} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="users" name="Users" fill="#2563eb" radius={[2, 2, 0, 0]} maxBarSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Divider />

      {/* ── SCROLL AREA ──────────────────────────────────── */}
      <SH title="Scroll Area" desc="Custom scrollbar styled with design tokens. Overflow content with visible scrollbar indicator." />
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', marginBottom: '8px' }}>Vertical Scroll</div>
          <div className="rounded-lg border overflow-y-auto" style={{ height: 200, borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
            {Array(20).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-0 transition-colors" style={{ borderColor: 'var(--ada-border-subtle)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--ada-p-100)' }}>
                  <span style={{ fontSize: '9px', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-p-700)' }}>U{i + 1}</span>
                </div>
                <div style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)' }}>List item {i + 1}</div>
                <div style={{ marginLeft: 'auto', fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>{i * 7 + 3} min ago</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', marginBottom: '8px' }}>Horizontal Scroll</div>
          <div className="rounded-lg border overflow-x-auto" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', height: 200 }}>
            <div style={{ display: 'flex', gap: 12, padding: 16, width: 'max-content' }}>
              {Array(10).fill(0).map((_, i) => (
                <div key={i} className="rounded-lg border p-4 flex-shrink-0" style={{ width: 160, backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
                  <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>Card {i + 1}</div>
                  <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>Scrollable item</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
