import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Search, Filter, Plus, MoreHorizontal, Star, Calendar,
  DollarSign, TrendingUp, Users, CheckCircle, Clock, AlertCircle,
  Mail, Phone, MapPin, Award, ChevronDown,
} from 'lucide-react';

const employees = [
  { id: 'E-1042', name: 'Sarah Chen', role: 'Senior Engineer', dept: 'Engineering', location: 'San Francisco', status: 'active', joined: 'Jan 2022', salary: '$148,000', leave: 3 },
  { id: 'E-1038', name: 'Marcus Reed', role: 'Product Manager', dept: 'Product', location: 'New York', status: 'active', joined: 'Mar 2021', salary: '$162,000', leave: 0 },
  { id: 'E-1031', name: 'Priya Patel', role: 'UX Designer', dept: 'Design', location: 'London', status: 'remote', joined: 'Jul 2022', salary: '$115,000', leave: 5 },
  { id: 'E-1028', name: 'James Wilson', role: 'DevOps Engineer', dept: 'Infrastructure', location: 'Austin', status: 'active', joined: 'Nov 2020', salary: '$138,000', leave: 0 },
  { id: 'E-1021', name: 'Aiko Tanaka', role: 'Data Scientist', dept: 'Analytics', location: 'Tokyo', status: 'remote', joined: 'Feb 2023', salary: '$128,000', leave: 10 },
  { id: 'E-1014', name: 'Carlos Ruiz', role: 'Sales Director', dept: 'Sales', location: 'Miami', status: 'active', joined: 'Apr 2019', salary: '$185,000', leave: 0 },
];

const leaveRequests = [
  { employee: 'Priya Patel', type: 'Annual', from: 'Mar 10', to: 'Mar 14', days: 5, status: 'pending' },
  { employee: 'Aiko Tanaka', type: 'Medical', from: 'Mar 5', to: 'Mar 18', days: 10, status: 'approved' },
  { employee: 'Sarah Chen', type: 'Annual', from: 'Mar 20', to: 'Mar 22', days: 3, status: 'approved' },
];

const payrollData = [
  { dept: 'Engineering', headcount: 42, total: 6216000 },
  { dept: 'Sales', headcount: 28, total: 5180000 },
  { dept: 'Product', headcount: 18, total: 2916000 },
  { dept: 'Design', headcount: 12, total: 1380000 },
  { dept: 'Infrastructure', headcount: 15, total: 2070000 },
  { dept: 'Analytics', headcount: 10, total: 1280000 },
];

const reviews = [
  { employee: 'Sarah Chen', reviewer: 'Mark T.', overall: 4.6, rating: 'Exceeds', due: 'Mar 31', status: 'submitted' },
  { employee: 'Marcus Reed', reviewer: 'Jane D.', overall: 4.2, rating: 'Meets', due: 'Mar 31', status: 'in-progress' },
  { employee: 'Carlos Ruiz', reviewer: 'Mark T.', overall: 4.9, rating: 'Outstanding', due: 'Apr 7', status: 'not-started' },
];

function StatusBadge({ s }: { s: string }) {
  const map: Record<string, [string, string]> = {
    active: ['var(--ada-bg-success)', 'var(--ada-text-success)'],
    remote: ['var(--ada-p-100)', 'var(--ada-p-700)'],
    pending: ['var(--ada-bg-warning)', 'var(--ada-text-warning)'],
    approved: ['var(--ada-bg-success)', 'var(--ada-text-success)'],
    submitted: ['var(--ada-bg-success)', 'var(--ada-text-success)'],
    'in-progress': ['var(--ada-bg-warning)', 'var(--ada-text-warning)'],
    'not-started': ['var(--ada-bg-muted)', 'var(--ada-text-3)'],
  };
  const [bg, color] = map[s] || ['var(--ada-bg-muted)', 'var(--ada-text-3)'];
  return <span className="px-2 py-0.5 rounded-full capitalize" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: bg, color }}>{s.replace('-', ' ')}</span>;
}

export function HRPortalPage() {
  const [tab, setTab] = useState<'directory' | 'leave' | 'payroll' | 'reviews'>('directory');
  const [search, setSearch] = useState('');

  const totalPayroll = payrollData.reduce((s, d) => s + d.total, 0);
  const totalHeadcount = payrollData.reduce((s, d) => s + d.headcount, 0);

  return (
    <div className="p-6 space-y-5" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: 'var(--ada-fs-2xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>HR Portal</h1>
          <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)', marginTop: '2px' }}>Employee Directory · Leave · Payroll · Performance</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded" style={{ backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)', fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)' }}>
          <Plus size={14} /> Add Employee
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: totalHeadcount, icon: <Users size={15} />, sub: '+3 this month' },
          { label: 'Annual Payroll', value: `$${(totalPayroll / 1000000).toFixed(1)}M`, icon: <DollarSign size={15} />, sub: 'excl. benefits' },
          { label: 'Leave Requests', value: leaveRequests.filter(l => l.status === 'pending').length, icon: <Calendar size={15} />, sub: 'pending approval' },
          { label: 'Reviews Due', value: reviews.filter(r => r.status !== 'submitted').length, icon: <Award size={15} />, sub: 'by end of March' },
        ].map(c => (
          <div key={c.label} className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 'var(--ada-fw-medium)' }}>{c.label}</span>
              <span style={{ color: 'var(--ada-text-4)' }}>{c.icon}</span>
            </div>
            <div style={{ fontSize: 'var(--ada-fs-3xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', letterSpacing: '-0.02em', fontFamily: 'var(--ada-font-mono)' }}>{c.value}</div>
            <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', marginTop: '4px' }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          <div className="flex gap-1">
            {(['directory', 'leave', 'payroll', 'reviews'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className="px-3 py-1.5 rounded capitalize" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: tab === t ? 'var(--ada-p-600)' : 'transparent', color: tab === t ? 'white' : 'var(--ada-text-2)' }}>{t}</button>
            ))}
          </div>
          {tab === 'directory' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
              <Search size={13} style={{ color: 'var(--ada-text-3)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-1)', width: '160px' }} />
            </div>
          )}
        </div>

        {tab === 'directory' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ada-fs-xs)' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--ada-surface-2)', borderBottom: '1px solid var(--ada-border-default)' }}>
                {['Employee', 'Role', 'Department', 'Location', 'Status', 'Joined', 'Salary', ''].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.dept.toLowerCase().includes(search.toLowerCase())).map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid var(--ada-border-subtle)' }}
                  onMouseEnter={ev => (ev.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
                  onMouseLeave={ev => (ev.currentTarget.style.backgroundColor = 'transparent')}>
                  <td style={{ padding: '10px 12px' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--ada-p-100)', color: 'var(--ada-p-700)', fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)' }}>{e.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}>{e.name}</div>
                        <div style={{ color: 'var(--ada-text-4)', fontSize: 'var(--ada-fs-2xs)', fontFamily: 'var(--ada-font-mono)' }}>{e.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--ada-text-2)' }}>{e.role}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--ada-text-3)' }}>{e.dept}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--ada-text-3)' }}><span className="flex items-center gap-1"><MapPin size={11} />{e.location}</span></td>
                  <td style={{ padding: '10px 12px' }}><StatusBadge s={e.status} /></td>
                  <td style={{ padding: '10px 12px', color: 'var(--ada-text-3)' }}>{e.joined}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-2)', fontWeight: 'var(--ada-fw-medium)' }}>{e.salary}</td>
                  <td style={{ padding: '10px 12px' }}><button style={{ color: 'var(--ada-text-3)' }}><MoreHorizontal size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'leave' && (
          <div className="p-5 space-y-3">
            {leaveRequests.map((l, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--ada-p-100)', color: 'var(--ada-p-700)', fontWeight: 'bold', fontSize: 'var(--ada-fs-xs)' }}>{l.employee.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}>{l.employee}</div>
                    <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{l.type} Leave · {l.from} – {l.to} · {l.days} days</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge s={l.status} />
                  {l.status === 'pending' && (
                    <div className="flex gap-1">
                      <button className="px-3 py-1.5 rounded" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)' }}>Approve</button>
                      <button className="px-3 py-1.5 rounded border" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-2)' }}>Decline</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'payroll' && (
          <div className="p-5">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={payrollData} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--ada-border-subtle)" />
                    <XAxis dataKey="dept" tick={{ fontSize: 10, fill: 'var(--ada-text-3)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--ada-text-3)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000000}M`} />
                    <Tooltip formatter={(v: number) => [`$${(v / 1000000).toFixed(2)}M`, 'Annual Payroll']} contentStyle={{ backgroundColor: 'var(--ada-surface-1)', border: '1px solid var(--ada-border-default)', borderRadius: 6, fontSize: 12 }} />
                    <Bar dataKey="total" fill="var(--ada-p-500)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {payrollData.map(d => (
                  <div key={d.dept} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
                    <div>
                      <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{d.dept}</div>
                      <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>{d.headcount} employees</div>
                    </div>
                    <div className="text-right">
                      <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', fontFamily: 'var(--ada-font-mono)' }}>${(d.total / 1000000).toFixed(2)}M</div>
                      <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>${Math.round(d.total / d.headcount / 1000)}k avg</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'reviews' && (
          <div className="p-5 space-y-3">
            {reviews.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--ada-p-100)', color: 'var(--ada-p-700)', fontWeight: 'bold', fontSize: 'var(--ada-fs-xs)' }}>{r.employee.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}>{r.employee}</div>
                    <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>Reviewer: {r.reviewer} · Due {r.due}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div style={{ fontSize: 'var(--ada-fs-lg)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', fontFamily: 'var(--ada-font-mono)' }}>{r.overall}</div>
                    <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)' }}>{r.rating}</div>
                  </div>
                  <StatusBadge s={r.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
