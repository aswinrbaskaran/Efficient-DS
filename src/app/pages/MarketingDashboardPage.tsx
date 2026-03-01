import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList,
} from 'recharts';
import {
  TrendingUp, TrendingDown, MousePointerClick, Eye, DollarSign,
  ArrowUpRight, ArrowDownRight, Globe, Search, Mail, Share2,
  Filter, Download, MoreHorizontal, Calendar, RefreshCw,
} from 'lucide-react';

const sessionData = [
  { date: 'Feb 3', organic: 4200, paid: 2100, referral: 800, direct: 1100 },
  { date: 'Feb 10', organic: 4800, paid: 2600, referral: 950, direct: 1300 },
  { date: 'Feb 17', organic: 5100, paid: 3100, referral: 1100, direct: 1450 },
  { date: 'Feb 24', organic: 5600, paid: 2900, referral: 1050, direct: 1600 },
  { date: 'Mar 1', organic: 6200, paid: 3400, referral: 1250, direct: 1800 },
  { date: 'Mar 8', organic: 7100, paid: 3900, referral: 1400, direct: 2100 },
];

const trafficSources = [
  { source: 'Organic Search', sessions: 7100, pct: 42 },
  { source: 'Paid Search', sessions: 3900, pct: 23 },
  { source: 'Social Media', sessions: 2400, pct: 14 },
  { source: 'Direct', sessions: 2100, pct: 12 },
  { source: 'Referral', sessions: 1400, pct: 8 },
  { source: 'Email', sessions: 170, pct: 1 },
];

const funnelData = [
  { name: 'Impressions', value: 124000, fill: 'var(--ada-p-200)' },
  { name: 'Clicks', value: 31200, fill: 'var(--ada-p-300)' },
  { name: 'Landing Page', value: 14800, fill: 'var(--ada-p-400)' },
  { name: 'Sign-ups', value: 4320, fill: 'var(--ada-p-500)' },
  { name: 'Conversions', value: 1186, fill: 'var(--ada-p-600)' },
];

const campaigns = [
  { name: 'Spring Launch 2026', channel: 'Google Ads', budget: '$12,000', spent: '$9,340', conversions: 412, cpa: '$22.67', status: 'Active', roas: '4.2x' },
  { name: 'Brand Awareness Q1', channel: 'Meta Ads', budget: '$8,000', spent: '$8,000', conversions: 228, cpa: '$35.09', status: 'Ended', roas: '2.8x' },
  { name: 'Retargeting Wave 3', channel: 'Google Ads', budget: '$5,000', spent: '$3,812', conversions: 198, cpa: '$19.25', status: 'Active', roas: '5.1x' },
  { name: 'Influencer Collab', channel: 'TikTok', budget: '$6,500', spent: '$6,500', conversions: 89, cpa: '$73.03', status: 'Ended', roas: '1.4x' },
  { name: 'Newsletter Promo', channel: 'Email', budget: '$1,200', spent: '$1,200', conversions: 259, cpa: '$4.63', status: 'Ended', roas: '9.3x' },
];

const sourceColors: Record<string, string> = {
  'Organic Search': 'var(--ada-p-500)',
  'Paid Search': 'var(--ada-s-500)',
  'Social Media': 'var(--ada-w-500)',
  'Direct': 'var(--ada-i-500)',
  'Referral': '#9333ea',
  'Email': '#ec4899',
};

function KPI({ title, value, delta, up, sub, icon }: { title: string; value: string; delta: string; up: boolean; sub: string; icon: React.ReactNode }) {
  return (
    <div className="p-5 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
      <div className="flex items-start justify-between mb-3">
        <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</span>
        <span style={{ color: 'var(--ada-text-4)' }}>{icon}</span>
      </div>
      <div style={{ fontSize: 'var(--ada-fs-4xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '8px' }}>{value}</div>
      <div className="flex items-center gap-1.5">
        <span className="flex items-center gap-0.5" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: up ? 'var(--ada-text-success)' : 'var(--ada-text-error)' }}>
          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{delta}
        </span>
        <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>{sub}</span>
      </div>
    </div>
  );
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
        <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{title}</span>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const active = status === 'Active';
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
      fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)',
      backgroundColor: active ? 'var(--ada-bg-success)' : 'var(--ada-bg-muted)',
      color: active ? 'var(--ada-text-success)' : 'var(--ada-text-3)',
    }}>{status}</span>
  );
}

export function MarketingDashboardPage() {
  const [period, setPeriod] = useState('30d');

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: 'var(--ada-fs-2xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Marketing Overview</h1>
          <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)', marginTop: '2px' }}>Campaign performance · Traffic attribution · Conversion analytics</p>
        </div>
        <div className="flex items-center gap-2">
          {['7d', '30d', '90d', 'YTD'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className="px-3 py-1.5 rounded border text-sm transition-colors" style={{
              fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)',
              backgroundColor: period === p ? 'var(--ada-p-600)' : 'var(--ada-surface-1)',
              color: period === p ? 'white' : 'var(--ada-text-2)',
              borderColor: period === p ? 'var(--ada-p-600)' : 'var(--ada-border-default)',
            }}>{p}</button>
          ))}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border" style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-2)', backgroundColor: 'var(--ada-surface-1)' }}>
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KPI title="Total Sessions" value="16,900" delta="+18.4%" up={true} sub="vs last period" icon={<Eye size={16} />} />
        <KPI title="Conversions" value="1,186" delta="+24.1%" up={true} sub="vs last period" icon={<MousePointerClick size={16} />} />
        <KPI title="Ad Spend" value="$28,852" delta="+6.2%" up={false} sub="vs last period" icon={<DollarSign size={16} />} />
        <KPI title="Avg. ROAS" value="3.8x" delta="+0.6x" up={true} sub="vs last period" icon={<TrendingUp size={16} />} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Card title="Session Trends by Source" action={
            <button className="flex items-center gap-1" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>
              <RefreshCw size={12} /> Live
            </button>
          }>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={sessionData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  {['organic','paid','referral','direct'].map((k, i) => (
                    <linearGradient key={k} id={`g${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={['var(--ada-p-500)','var(--ada-s-500)','var(--ada-w-500)','var(--ada-i-500)'][i]} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={['var(--ada-p-500)','var(--ada-s-500)','var(--ada-w-500)','var(--ada-i-500)'][i]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--ada-border-subtle)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--ada-text-3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--ada-text-3)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--ada-surface-1)', border: '1px solid var(--ada-border-default)', borderRadius: 6, fontSize: 12 }} />
                <Area type="monotone" dataKey="organic" stackId="1" stroke="var(--ada-p-500)" fill={`url(#gorganic)`} name="Organic" />
                <Area type="monotone" dataKey="paid" stackId="1" stroke="var(--ada-s-500)" fill={`url(#gpaid)`} name="Paid" />
                <Area type="monotone" dataKey="referral" stackId="1" stroke="var(--ada-w-500)" fill={`url(#greferral)`} name="Referral" />
                <Area type="monotone" dataKey="direct" stackId="1" stroke="var(--ada-i-500)" fill={`url(#gdirect)`} name="Direct" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <Card title="Traffic Sources">
          <div className="space-y-3">
            {trafficSources.map(s => (
              <div key={s.source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: sourceColors[s.source] || 'var(--ada-p-400)' }} />
                    {s.source}
                  </span>
                  <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', fontFamily: 'var(--ada-font-mono)' }}>{s.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-3)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, backgroundColor: sourceColors[s.source] || 'var(--ada-p-400)' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Funnel + Campaign table */}
      <div className="grid grid-cols-3 gap-4">
        <Card title="Conversion Funnel">
          <div className="space-y-2">
            {funnelData.map((step, i) => {
              const pct = Math.round((step.value / funnelData[0].value) * 100);
              return (
                <div key={step.name} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>{step.name}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-3)' }}>{step.value.toLocaleString()}</span>
                      <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)' }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="h-6 rounded overflow-hidden relative" style={{ backgroundColor: 'var(--ada-surface-3)', width: '100%' }}>
                    <div className="h-full rounded flex items-center pl-2 transition-all" style={{ width: `${pct}%`, backgroundColor: step.fill }}>
                      {pct > 20 && <span style={{ fontSize: 'var(--ada-fs-2xs)', color: i < 3 ? 'var(--ada-text-1)' : 'white', fontWeight: 'var(--ada-fw-medium)' }}>{pct}%</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--ada-border-default)' }}>
            <div className="flex justify-between">
              <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>Overall Conv. Rate</span>
              <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-success)' }}>0.96%</span>
            </div>
          </div>
        </Card>

        <div className="col-span-2">
          <Card title="Campaign Performance" action={
            <button className="flex items-center gap-1" style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-3)' }}>
              <Filter size={12} /> Filter
            </button>
          }>
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ada-fs-xs)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--ada-border-default)' }}>
                    {['Campaign', 'Channel', 'Budget', 'Spent', 'Conv.', 'CPA', 'ROAS', 'Status'].map(h => (
                      <th key={h} style={{ padding: '4px 8px', textAlign: 'left', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(c => (
                    <tr key={c.name} style={{ borderBottom: '1px solid var(--ada-border-subtle)' }}>
                      <td style={{ padding: '8px', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</td>
                      <td style={{ padding: '8px', color: 'var(--ada-text-3)' }}>{c.channel}</td>
                      <td style={{ padding: '8px', color: 'var(--ada-text-2)', fontFamily: 'var(--ada-font-mono)' }}>{c.budget}</td>
                      <td style={{ padding: '8px', color: 'var(--ada-text-2)', fontFamily: 'var(--ada-font-mono)' }}>{c.spent}</td>
                      <td style={{ padding: '8px', color: 'var(--ada-text-2)', fontFamily: 'var(--ada-font-mono)' }}>{c.conversions}</td>
                      <td style={{ padding: '8px', color: 'var(--ada-text-2)', fontFamily: 'var(--ada-font-mono)' }}>{c.cpa}</td>
                      <td style={{ padding: '8px', fontWeight: 'var(--ada-fw-semibold)', color: parseFloat(c.roas) >= 3 ? 'var(--ada-text-success)' : 'var(--ada-text-warning)', fontFamily: 'var(--ada-font-mono)' }}>{c.roas}</td>
                      <td style={{ padding: '8px' }}><StatusBadge status={c.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
