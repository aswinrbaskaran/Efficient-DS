import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  CreditCard, Building2, Wallet, Filter, Download, MoreHorizontal,
  ArrowUp, ArrowDown, Search, AlertCircle,
} from 'lucide-react';

const cashflowData = [
  { month: 'Sep', income: 84000, expenses: 61000 },
  { month: 'Oct', income: 91000, expenses: 68000 },
  { month: 'Nov', income: 88000, expenses: 72000 },
  { month: 'Dec', income: 107000, expenses: 81000 },
  { month: 'Jan', income: 93000, expenses: 65000 },
  { month: 'Feb', income: 102000, expenses: 71000 },
  { month: 'Mar', income: 115000, expenses: 74000 },
];

const transactions = [
  { id: 'TXN-9901', desc: 'AWS Infrastructure — March 2026', category: 'Infrastructure', amount: -12480, date: 'Mar 1, 2026', status: 'cleared', account: 'Operations' },
  { id: 'TXN-9900', desc: 'Enterprise License — Orion Cloud', category: 'Revenue', amount: 210000, date: 'Mar 1, 2026', status: 'cleared', account: 'Receivables' },
  { id: 'TXN-9899', desc: 'Payroll — February 2026', category: 'Payroll', amount: -48200, date: 'Feb 28, 2026', status: 'cleared', account: 'Payroll' },
  { id: 'TXN-9898', desc: 'Google Workspace — Annual', category: 'SaaS', amount: -2400, date: 'Feb 27, 2026', status: 'cleared', account: 'Operations' },
  { id: 'TXN-9897', desc: 'Customer Refund — INV-2841', category: 'Refund', amount: -4890, date: 'Feb 26, 2026', status: 'pending', account: 'Receivables' },
  { id: 'TXN-9896', desc: 'Pro Plan MRR Batch', category: 'Revenue', amount: 34800, date: 'Feb 25, 2026', status: 'cleared', account: 'Receivables' },
  { id: 'TXN-9895', desc: 'Office Lease — Q1 2026', category: 'Facilities', amount: -18000, date: 'Feb 24, 2026', status: 'cleared', account: 'Operations' },
  { id: 'TXN-9894', desc: 'Contractor Invoice — Design Sprint', category: 'Contractors', amount: -7200, date: 'Feb 23, 2026', status: 'pending', account: 'Operations' },
];

const budgets = [
  { category: 'Marketing', allocated: 40000, spent: 28852, color: 'var(--ada-p-500)' },
  { category: 'Infrastructure', allocated: 20000, spent: 12480, color: 'var(--ada-s-500)' },
  { category: 'Payroll', allocated: 55000, spent: 48200, color: 'var(--ada-w-500)' },
  { category: 'SaaS Tools', allocated: 8000, spent: 6100, color: 'var(--ada-i-500)' },
  { category: 'Contractors', allocated: 15000, spent: 7200, color: '#9333ea' },
  { category: 'Facilities', allocated: 22000, spent: 18000, color: '#ec4899' },
];

const accounts = [
  { name: 'Operating Account', bank: 'Chase Business', balance: 284120, change: +12400, icon: <Building2 size={16} /> },
  { name: 'Receivables', bank: 'Stripe Treasury', balance: 91340, change: +31200, icon: <CreditCard size={16} /> },
  { name: 'Reserve Fund', bank: 'Marcus Savings', balance: 500000, change: +1250, icon: <Wallet size={16} /> },
];

function AccountCard({ a }: { a: typeof accounts[0] }) {
  const positive = a.change >= 0;
  return (
    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--ada-p-50)', color: 'var(--ada-p-600)' }}>{a.icon}</div>
          <div>
            <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{a.name}</div>
            <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>{a.bank}</div>
          </div>
        </div>
        <button style={{ color: 'var(--ada-text-4)' }}><MoreHorizontal size={14} /></button>
      </div>
      <div style={{ fontSize: 'var(--ada-fs-3xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', letterSpacing: '-0.02em', fontFamily: 'var(--ada-font-mono)' }}>
        ${a.balance.toLocaleString()}
      </div>
      <div className="flex items-center gap-1 mt-1">
        {positive ? <ArrowUpRight size={12} style={{ color: 'var(--ada-text-success)' }} /> : <ArrowDownRight size={12} style={{ color: 'var(--ada-text-error)' }} />}
        <span style={{ fontSize: 'var(--ada-fs-xs)', color: positive ? 'var(--ada-text-success)' : 'var(--ada-text-error)', fontWeight: 'var(--ada-fw-medium)' }}>
          {positive ? '+' : ''}${Math.abs(a.change).toLocaleString()}
        </span>
        <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>this month</span>
      </div>
    </div>
  );
}

function CategoryBadge({ cat }: { cat: string }) {
  const colorMap: Record<string, string> = {
    Revenue: 'var(--ada-text-success)', Refund: 'var(--ada-text-error)',
    Payroll: 'var(--ada-text-warning)', Infrastructure: 'var(--ada-p-600)',
  };
  return <span style={{ fontSize: 'var(--ada-fs-2xs)', color: colorMap[cat] || 'var(--ada-text-3)', fontWeight: 'var(--ada-fw-medium)' }}>{cat}</span>;
}

export function FinancialPage() {
  const [search, setSearch] = useState('');

  const netCash = cashflowData[cashflowData.length - 1];
  const netIncome = netCash.income - netCash.expenses;

  return (
    <div className="p-6 space-y-5" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: 'var(--ada-fs-2xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Financial Overview</h1>
          <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)', marginTop: '2px' }}>Accounts · Transactions · Cash Flow · Budget Tracker</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border" style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-2)', backgroundColor: 'var(--ada-surface-1)' }}>
            <Filter size={13} /> Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border" style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-2)', backgroundColor: 'var(--ada-surface-1)' }}>
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-3 gap-4">
        {accounts.map(a => <AccountCard key={a.name} a={a} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
            <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Cash Flow — 7 Months</span>
            <div className="flex items-center gap-3" style={{ fontSize: 'var(--ada-fs-xs)' }}>
              <span className="flex items-center gap-1" style={{ color: 'var(--ada-text-success)' }}><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: 'var(--ada-s-500)' }} />Income</span>
              <span className="flex items-center gap-1" style={{ color: 'var(--ada-text-error)' }}><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: 'var(--ada-e-400)' }} />Expenses</span>
            </div>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={cashflowData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--ada-border-subtle)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--ada-text-3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--ada-text-3)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, '']} contentStyle={{ backgroundColor: 'var(--ada-surface-1)', border: '1px solid var(--ada-border-default)', borderRadius: 6, fontSize: 12 }} />
                <Line type="monotone" dataKey="income" stroke="var(--ada-s-500)" strokeWidth={2} dot={false} name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="var(--ada-e-400)" strokeWidth={2} dot={false} name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
          <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
            <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Budget vs. Actuals — March</span>
          </div>
          <div className="p-5 space-y-3">
            {budgets.map(b => {
              const pct = Math.round((b.spent / b.allocated) * 100);
              const over = pct > 90;
              return (
                <div key={b.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>{b.category}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-3)' }}>${(b.spent / 1000).toFixed(1)}k / ${(b.allocated / 1000).toFixed(0)}k</span>
                      {over && <AlertCircle size={11} style={{ color: 'var(--ada-text-warning)' }} />}
                      <span style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-semibold)', color: over ? 'var(--ada-text-warning)' : 'var(--ada-text-3)' }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-3)' }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: over ? 'var(--ada-w-500)' : b.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Recent Transactions</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
              <Search size={13} style={{ color: 'var(--ada-text-3)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-1)', width: '160px' }} />
            </div>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ada-fs-xs)' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--ada-surface-2)', borderBottom: '1px solid var(--ada-border-default)' }}>
              {['ID', 'Description', 'Category', 'Account', 'Date', 'Amount', 'Status'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.filter(t => t.desc.toLowerCase().includes(search.toLowerCase())).map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--ada-border-subtle)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <td style={{ padding: '10px 12px', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-4)', fontSize: 'var(--ada-fs-2xs)' }}>{t.id}</td>
                <td style={{ padding: '10px 12px', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.desc}</td>
                <td style={{ padding: '10px 12px' }}><CategoryBadge cat={t.category} /></td>
                <td style={{ padding: '10px 12px', color: 'var(--ada-text-3)' }}>{t.account}</td>
                <td style={{ padding: '10px 12px', color: 'var(--ada-text-3)' }}>{t.date}</td>
                <td style={{ padding: '10px 12px', fontFamily: 'var(--ada-font-mono)', fontWeight: 'var(--ada-fw-semibold)', color: t.amount > 0 ? 'var(--ada-text-success)' : 'var(--ada-text-1)' }}>
                  {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toLocaleString()}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: t.status === 'cleared' ? 'var(--ada-bg-success)' : 'var(--ada-bg-warning)', color: t.status === 'cleared' ? 'var(--ada-text-success)' : 'var(--ada-text-warning)' }}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
          <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>Showing {transactions.length} of 1,204 transactions</span>
          <div className="flex items-center gap-1">
            {['←', '1', '2', '3', '…', '121', '→'].map((p, i) => (
              <button key={i} className="w-7 h-7 rounded flex items-center justify-center" style={{ fontSize: 'var(--ada-fs-xs)', backgroundColor: p === '1' ? 'var(--ada-p-600)' : 'transparent', color: p === '1' ? 'white' : 'var(--ada-text-3)' }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
