import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, Users, DollarSign, Activity, Server,
  ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, RefreshCw,
  Download, Filter, CheckCircle, AlertCircle, Clock, Zap
} from 'lucide-react';

/* ─── Data ────────────────────────────────────────────────── */
const revenueData = [
  { month: 'Aug', revenue: 42000, expenses: 28000, profit: 14000 },
  { month: 'Sep', revenue: 47500, expenses: 31000, profit: 16500 },
  { month: 'Oct', revenue: 52000, expenses: 33000, profit: 19000 },
  { month: 'Nov', revenue: 49000, expenses: 30000, profit: 19000 },
  { month: 'Dec', revenue: 61000, expenses: 36000, profit: 25000 },
  { month: 'Jan', revenue: 58000, expenses: 34000, profit: 24000 },
  { month: 'Feb', revenue: 64000, expenses: 37000, profit: 27000 },
  { month: 'Mar', revenue: 71000, expenses: 40000, profit: 31000 },
];

const trafficData = [
  { day: 'Mon', users: 2400, sessions: 3200, pageviews: 9800 },
  { day: 'Tue', users: 1800, sessions: 2400, pageviews: 7200 },
  { day: 'Wed', users: 3200, sessions: 4100, pageviews: 12600 },
  { day: 'Thu', users: 2800, sessions: 3700, pageviews: 11200 },
  { day: 'Fri', users: 3600, sessions: 4800, pageviews: 14400 },
  { day: 'Sat', users: 1200, sessions: 1600, pageviews: 4800 },
  { day: 'Sun', users: 900, sessions: 1200, pageviews: 3600 },
];

const apiData = [
  { hour: '00', calls: 1200 }, { hour: '02', calls: 800 }, { hour: '04', calls: 600 },
  { hour: '06', calls: 1100 }, { hour: '08', calls: 3400 }, { hour: '10', calls: 5200 },
  { hour: '12', calls: 4800 }, { hour: '14', calls: 5600 }, { hour: '16', calls: 4900 },
  { hour: '18', calls: 3800 }, { hour: '20', calls: 2800 }, { hour: '22', calls: 1700 },
];

const tableRows = [
  { id: 'TXN-8821', user: 'Sarah Chen', plan: 'Enterprise', amount: '$2,400', status: 'Completed', date: 'Mar 1, 2026', region: 'US-East' },
  { id: 'TXN-8820', user: 'Marcus Reed', plan: 'Pro', amount: '$149', status: 'Completed', date: 'Mar 1, 2026', region: 'EU-West' },
  { id: 'TXN-8819', user: 'Priya Patel', plan: 'Starter', amount: '$29', status: 'Pending', date: 'Feb 28, 2026', region: 'AP-South' },
  { id: 'TXN-8818', user: 'James Wilson', plan: 'Pro', amount: '$149', status: 'Failed', date: 'Feb 28, 2026', region: 'US-West' },
  { id: 'TXN-8817', user: 'Aiko Tanaka', plan: 'Enterprise', amount: '$2,400', status: 'Completed', date: 'Feb 27, 2026', region: 'AP-East' },
  { id: 'TXN-8816', user: 'Carlos Ruiz', plan: 'Pro', amount: '$149', status: 'Completed', date: 'Feb 27, 2026', region: 'SA-East' },
  { id: 'TXN-8815', user: 'Fatima Al-Rashid', plan: 'Starter', amount: '$29', status: 'Pending', date: 'Feb 26, 2026', region: 'ME-Central' },
];

const services = [
  { name: 'API Gateway', status: 'operational', latency: '12ms', uptime: '99.99%' },
  { name: 'Auth Service', status: 'operational', latency: '8ms', uptime: '100%' },
  { name: 'Database Primary', status: 'operational', latency: '3ms', uptime: '99.99%' },
  { name: 'CDN Edge', status: 'degraded', latency: '142ms', uptime: '99.84%' },
  { name: 'Worker Queue', status: 'operational', latency: '21ms', uptime: '99.97%' },
];

/* ─── KPI Card ────────────────────────────────────────────── */
function KPICard({ title, value, delta, deltaDir, subtitle, icon }: {
  title: string; value: string; delta: string; deltaDir: 'up' | 'down'; subtitle: string; icon: React.ReactNode;
}) {
  const isPositiveUp = deltaDir === 'up';
  return (
    <div className="p-5 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
      <div className="flex items-start justify-between mb-3">
        <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {title}
        </div>
        <div style={{ color: 'var(--ada-text-4)' }}>{icon}</div>
      </div>
      <div style={{ fontSize: 'var(--ada-fs-4xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '8px' }}>
        {value}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="flex items-center gap-0.5" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: isPositiveUp ? 'var(--ada-text-success)' : 'var(--ada-text-error)' }}>
          {deltaDir === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {delta}
        </span>
        <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>{subtitle}</span>
      </div>
    </div>
  );
}

/* ─── Status Badge ────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; text: string; dot: string }> = {
    Completed:   { bg: 'var(--ada-s-100)',  text: 'var(--ada-s-700)',  dot: 'var(--ada-s-500)' },
    Pending:     { bg: 'var(--ada-w-100)',  text: 'var(--ada-w-700)',  dot: 'var(--ada-w-500)' },
    Failed:      { bg: 'var(--ada-e-100)',  text: 'var(--ada-e-700)',  dot: 'var(--ada-e-500)' },
    operational: { bg: 'var(--ada-s-100)',  text: 'var(--ada-s-700)',  dot: 'var(--ada-s-500)' },
    degraded:    { bg: 'var(--ada-w-100)',  text: 'var(--ada-w-700)',  dot: 'var(--ada-w-500)' },
    outage:      { bg: 'var(--ada-e-100)',  text: 'var(--ada-e-700)',  dot: 'var(--ada-e-500)' },
  };
  const c = cfg[status] || cfg['Pending'];
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: c.bg, color: c.text }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: c.dot, display: 'inline-block', flexShrink: 0 }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* ─── Chart Tooltip ───────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border px-3 py-2" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-3)' }}>
      <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-2)', marginBottom: '4px' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color, display: 'inline-block' }} />
          <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{p.name}:</span>
          <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>
            {typeof p.value === 'number' && p.value > 999 ? `$${(p.value / 1000).toFixed(1)}k` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Section Header ──────────────────────────────────────── */
function SectionTitle({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 style={{ fontSize: 'var(--ada-fs-base)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{title}</h3>
      {action}
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export function DashboardPage() {
  const [sortCol, setSortCol] = useState<string | null>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [range, setRange] = useState('7d');

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <ArrowUpDown size={12} style={{ color: 'var(--ada-text-4)' }} />;
    return sortDir === 'asc'
      ? <ArrowUp size={12} style={{ color: 'var(--ada-p-600)' }} />
      : <ArrowDown size={12} style={{ color: 'var(--ada-p-600)' }} />;
  };

  const tickStyle = { fill: 'var(--ada-text-4)', fontSize: 11 };
  const gridColor = 'var(--ada-border-subtle)';

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: 'var(--ada-bg-base)' }}>

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 style={{ fontSize: 'var(--ada-fs-3xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>
            Enterprise Dashboard
          </h1>
          <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>
            Real-time overview · Last updated just now
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Range selector */}
          <div className="flex rounded border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
            {['24h', '7d', '30d', '90d'].map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className="px-3 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
                style={{
                  fontSize: 'var(--ada-fs-xs)',
                  fontWeight: range === r ? 'var(--ada-fw-semibold)' : 'var(--ada-fw-regular)',
                  backgroundColor: range === r ? 'var(--ada-p-600)' : 'var(--ada-surface-1)',
                  color: range === r ? 'white' : 'var(--ada-text-3)',
                  borderRight: r !== '90d' ? '1px solid var(--ada-border-default)' : 'none',
                }}
              >{r}</button>
            ))}
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-2)' }}
          >
            <Download size={13} /> Export
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-3)' }}
            aria-label="Refresh data"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* ── KPI Row ───────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard title="Monthly Revenue" value="$71,240" delta="+18.3%" deltaDir="up" subtitle="vs last month" icon={<DollarSign size={16} />} />
        <KPICard title="Active Users" value="14,832" delta="+6.7%" deltaDir="up" subtitle="vs last week" icon={<Users size={16} />} />
        <KPICard title="API Calls / Day" value="5.2M" delta="-2.1%" deltaDir="down" subtitle="vs yesterday" icon={<Activity size={16} />} />
        <KPICard title="Avg Response" value="12ms" delta="+0.8ms" deltaDir="down" subtitle="vs last hour" icon={<Zap size={16} />} />
      </div>

      {/* ── Charts Row ────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Revenue Chart — 2/3 */}
        <div className="col-span-2 p-5 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
          <SectionTitle title="Revenue Overview" action={
            <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>Aug – Mar 2026</div>
          } />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} width={42} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2} fill="url(#gradRevenue)" dot={false} />
              <Area type="monotone" dataKey="profit" name="Profit" stroke="#16a34a" strokeWidth={2} fill="url(#gradProfit)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* API Calls Bar — 1/3 */}
        <div className="p-5 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
          <SectionTitle title="API Calls (24h)" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={apiData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="hour" tick={{ ...tickStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} width={30} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="calls" name="API Calls" fill="#2563eb" radius={[2, 2, 0, 0]} maxBarSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Traffic + Service Status ───────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Traffic Chart — 2/3 */}
        <div className="col-span-2 p-5 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
          <SectionTitle title="Weekly Traffic" action={
            <div className="flex gap-4">
              {[{ color: '#2563eb', label: 'Users' }, { color: '#16a34a', label: 'Sessions' }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: l.color, display: 'inline-block' }} />
                  <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{l.label}</span>
                </div>
              ))}
            </div>
          } />
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={trafficData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="day" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} width={36} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="users" name="Users" stroke="#2563eb" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#16a34a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Service Status — 1/3 */}
        <div className="p-5 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
          <SectionTitle title="Service Status" action={
            <div className="flex items-center gap-1.5" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-success)' }}>
              <CheckCircle size={12} /> 4/5 healthy
            </div>
          } />
          <div className="space-y-2">
            {services.map(svc => (
              <div key={svc.name} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: 'var(--ada-border-subtle)' }}>
                <div className="flex items-center gap-2 min-w-0">
                  <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: svc.status === 'operational' ? 'var(--ada-s-500)' : 'var(--ada-w-500)', display: 'inline-block', flexShrink: 0 }} />
                  <span className="truncate" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-1)', fontWeight: 'var(--ada-fw-medium)' }}>{svc.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', fontFamily: 'var(--ada-font-mono)' }}>{svc.latency}</span>
                  <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>{svc.uptime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Transactions Table ─────────────────────────────────── */}
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
        {/* Table Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
          <h3 style={{ fontSize: 'var(--ada-fs-base)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>
            Recent Transactions
          </h3>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-3)' }}
            >
              <Filter size={12} /> Filter
            </button>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-3)' }}
            >
              <Download size={12} /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" role="grid" aria-label="Recent transactions">
            <thead>
              <tr style={{ backgroundColor: 'var(--ada-surface-2)', borderBottom: '1px solid var(--ada-border-default)' }}>
                {[
                  { key: 'id', label: 'Transaction ID' },
                  { key: 'user', label: 'User' },
                  { key: 'plan', label: 'Plan' },
                  { key: 'amount', label: 'Amount' },
                  { key: 'status', label: 'Status' },
                  { key: 'date', label: 'Date' },
                  { key: 'region', label: 'Region' },
                ].map(col => (
                  <th
                    key={col.key}
                    className="text-left px-4 py-2.5"
                    style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-3)', whiteSpace: 'nowrap' }}
                  >
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] rounded"
                      aria-sort={sortCol === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                    >
                      {col.label}
                      <SortIcon col={col.key} />
                    </button>
                  </th>
                ))}
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <tr
                  key={row.id}
                  className="transition-colors"
                  style={{ borderBottom: i < tableRows.length - 1 ? '1px solid var(--ada-border-subtle)' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td className="px-4 py-3">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-3)' }}>{row.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--ada-p-100)' }}>
                        <span style={{ fontSize: '9px', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-p-700)' }}>
                          {row.user.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)', fontWeight: 'var(--ada-fw-medium)' }}>{row.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>{row.plan}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)', fontFamily: 'var(--ada-font-mono)' }}>{row.amount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{row.date}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)' }}>{row.region}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
                      style={{ color: 'var(--ada-text-4)' }}
                      aria-label="More options"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t" style={{ backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
          <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>
            Showing 7 of 2,841 transactions
          </span>
          <div className="flex items-center gap-1">
            {['Previous', '1', '2', '3', '...', '284', 'Next'].map((p, i) => (
              <button
                key={i}
                className="px-2.5 py-1 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
                style={{
                  fontSize: 'var(--ada-fs-xs)',
                  backgroundColor: p === '1' ? 'var(--ada-p-600)' : 'var(--ada-surface-1)',
                  color: p === '1' ? 'white' : 'var(--ada-text-3)',
                  borderColor: 'var(--ada-border-default)',
                  fontWeight: p === '1' ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)',
                  minWidth: '32px',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
