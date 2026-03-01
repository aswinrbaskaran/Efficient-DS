import { useState } from 'react';
import {
  Phone, Mail, Globe, MapPin, Plus, MoreHorizontal, Search,
  Calendar, DollarSign, TrendingUp, Users, ArrowRight, CheckCircle,
  MessageSquare, FileText, Star, ChevronRight,
} from 'lucide-react';

const stages = [
  {
    id: 'lead', label: 'Lead', color: 'var(--ada-n-400)',
    deals: [
      { id: 1, company: 'Vertex Systems', contact: 'Alan Park', value: '$12,000', days: 3, prob: 20 },
      { id: 2, company: 'Meridian AI', contact: 'Sophie Bell', value: '$45,000', days: 1, prob: 25 },
      { id: 3, company: 'Cloudnine SaaS', contact: 'Omar Hassen', value: '$8,500', days: 7, prob: 15 },
    ],
  },
  {
    id: 'qualified', label: 'Qualified', color: 'var(--ada-p-500)',
    deals: [
      { id: 4, company: 'TechCorp Global', contact: 'Nadia Flores', value: '$78,000', days: 12, prob: 45 },
      { id: 5, company: 'Nexus Analytics', contact: 'Tom Grant', value: '$34,200', days: 8, prob: 50 },
    ],
  },
  {
    id: 'proposal', label: 'Proposal', color: 'var(--ada-w-500)',
    deals: [
      { id: 6, company: 'Aurora Finance', contact: 'Lin Wei', value: '$124,000', days: 19, prob: 65 },
      { id: 7, company: 'Epsilon Labs', contact: 'Ryan Moss', value: '$56,800', days: 14, prob: 60 },
    ],
  },
  {
    id: 'negotiation', label: 'Negotiation', color: 'var(--ada-s-500)',
    deals: [
      { id: 8, company: 'Orion Cloud', contact: 'Clara Hunt', value: '$210,000', days: 31, prob: 80 },
    ],
  },
  {
    id: 'closed', label: 'Closed Won', color: 'var(--ada-s-600)',
    deals: [
      { id: 9, company: 'Pinnacle Retail', contact: 'Dave Kim', value: '$89,000', days: 44, prob: 100 },
      { id: 10, company: 'Brightwave Media', contact: 'Zoe Adams', value: '$42,000', days: 38, prob: 100 },
    ],
  },
];

const contacts = [
  { name: 'Alan Park', company: 'Vertex Systems', role: 'CTO', status: 'Hot', email: 'alan@vertex.io', lastActivity: '2h ago' },
  { name: 'Sophie Bell', company: 'Meridian AI', role: 'CEO', status: 'Warm', email: 'sophie@meridian.ai', lastActivity: '1d ago' },
  { name: 'Nadia Flores', company: 'TechCorp Global', role: 'VP Engineering', status: 'Hot', email: 'nadia@techcorp.com', lastActivity: '3h ago' },
  { name: 'Lin Wei', company: 'Aurora Finance', role: 'CFO', status: 'Warm', email: 'lin@aurora.finance', lastActivity: '2d ago' },
  { name: 'Clara Hunt', company: 'Orion Cloud', role: 'Head of Ops', status: 'Hot', email: 'clara@orion.cloud', lastActivity: '30m ago' },
];

const activities = [
  { type: 'call', text: 'Called Clara Hunt (Orion Cloud) — 42 min negotiation call', time: '30m ago', icon: <Phone size={13} /> },
  { type: 'email', text: 'Sent proposal PDF to Aurora Finance team', time: '2h ago', icon: <Mail size={13} /> },
  { type: 'meeting', text: 'Demo meeting with TechCorp Global — 4 attendees', time: '5h ago', icon: <Calendar size={13} /> },
  { type: 'note', text: 'Updated deal stage for Orion Cloud to Negotiation', time: '1d ago', icon: <FileText size={13} /> },
  { type: 'email', text: 'Follow-up email sequence triggered for Meridian AI', time: '1d ago', icon: <Mail size={13} /> },
  { type: 'call', text: 'Intro call with Vertex Systems — Alan Park', time: '2d ago', icon: <Phone size={13} /> },
];

const activityColors: Record<string, string> = {
  call: 'var(--ada-s-500)', email: 'var(--ada-p-500)',
  meeting: 'var(--ada-w-500)', note: 'var(--ada-n-400)',
};

function StatusBadge({ s }: { s: string }) {
  return (
    <span style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-semibold)', padding: '1px 6px', borderRadius: 9999, backgroundColor: s === 'Hot' ? 'var(--ada-bg-error)' : 'var(--ada-bg-warning)', color: s === 'Hot' ? 'var(--ada-text-error)' : 'var(--ada-text-warning)' }}>{s}</span>
  );
}

export function CRMPage() {
  const [view, setView] = useState<'pipeline' | 'contacts'>('pipeline');
  const [selected, setSelected] = useState<number | null>(null);

  const pipelineValue = stages.reduce((sum, s) => sum + s.deals.reduce((a, d) => a + parseInt(d.value.replace(/[$,]/g, '')), 0), 0);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--ada-fs-xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>CRM System</h1>
          <p style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>Pipeline · Contacts · Activities · Deal Management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded border flex items-center gap-2" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
            <DollarSign size={13} style={{ color: 'var(--ada-text-3)' }} />
            <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>${(pipelineValue / 1000).toFixed(0)}k</span>
            <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>pipeline</span>
          </div>
          <div className="flex gap-1">
            {(['pipeline', 'contacts'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} className="px-3 py-1.5 rounded capitalize" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: view === v ? 'var(--ada-p-600)' : 'transparent', color: view === v ? 'white' : 'var(--ada-text-2)' }}>{v}</button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded" style={{ backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)', fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)' }}>
            <Plus size={13} /> Add Deal
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {view === 'pipeline' ? (
          <>
            {/* Kanban */}
            <div className="flex-1 overflow-x-auto p-4">
              <div className="flex gap-3 h-full" style={{ minWidth: 'max-content' }}>
                {stages.map(stage => (
                  <div key={stage.id} className="flex flex-col rounded-lg border" style={{ width: '220px', backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
                    <div className="px-3 py-2.5 border-b flex items-center justify-between" style={{ borderColor: 'var(--ada-border-default)' }}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                        <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{stage.label}</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: 'var(--ada-surface-3)', color: 'var(--ada-text-3)' }}>{stage.deals.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                      {stage.deals.map(deal => (
                        <button key={deal.id} onClick={() => setSelected(selected === deal.id ? null : deal.id)} className="w-full text-left p-3 rounded-md border transition-all" style={{
                          backgroundColor: selected === deal.id ? 'var(--ada-p-50)' : 'var(--ada-surface-1)',
                          borderColor: selected === deal.id ? 'var(--ada-p-300)' : 'var(--ada-border-default)',
                        }}>
                          <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '2px' }}>{deal.company}</div>
                          <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)', marginBottom: '6px' }}>{deal.contact}</div>
                          <div className="flex items-center justify-between">
                            <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', fontFamily: 'var(--ada-font-mono)' }}>{deal.value}</span>
                            <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>{deal.days}d</span>
                          </div>
                          <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-3)' }}>
                            <div style={{ width: `${deal.prob}%`, height: '100%', backgroundColor: stage.color, borderRadius: 9999 }} />
                          </div>
                          <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)', marginTop: '2px', textAlign: 'right' }}>{deal.prob}%</div>
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t" style={{ borderColor: 'var(--ada-border-default)' }}>
                      <button className="w-full flex items-center justify-center gap-1 py-1.5 rounded" style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-3)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                        <Plus size={11} /> Add deal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="w-72 border-l flex flex-col flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
                <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Activity Timeline</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="relative">
                  <div className="absolute left-3.5 top-0 bottom-0 w-px" style={{ backgroundColor: 'var(--ada-border-default)' }} />
                  <div className="space-y-5">
                    {activities.map((a, i) => (
                      <div key={i} className="flex gap-3 relative">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center z-10" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: activityColors[a.type], color: activityColors[a.type] }}>
                          {a.icon}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)', lineHeight: 1.4 }}>{a.text}</p>
                          <p style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)', marginTop: '2px' }}>{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t" style={{ borderColor: 'var(--ada-border-default)' }}>
                <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded border" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)', borderColor: 'var(--ada-border-default)' }}>
                  <Plus size={13} /> Log Activity
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
                <Search size={14} style={{ color: 'var(--ada-text-3)' }} />
                <input placeholder="Search contacts…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)', flex: 1 }} />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded border" style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-2)', backgroundColor: 'var(--ada-surface-1)' }}>
                <Filter size={13} /> Filter
              </button>
            </div>
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ada-fs-xs)' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--ada-surface-2)', borderBottom: '1px solid var(--ada-border-default)' }}>
                    {['Name', 'Company', 'Role', 'Status', 'Email', 'Last Activity', ''].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contacts.map(c => (
                    <tr key={c.name} style={{ borderBottom: '1px solid var(--ada-border-subtle)' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                      <td style={{ padding: '10px 12px' }}>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--ada-p-100)', color: 'var(--ada-p-700)', fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)' }}>
                            {c.name.charAt(0)}
                          </div>
                          <span style={{ fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}>{c.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--ada-text-2)' }}>{c.company}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--ada-text-3)' }}>{c.role}</td>
                      <td style={{ padding: '10px 12px' }}><StatusBadge s={c.status} /></td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-3)', fontSize: 'var(--ada-fs-2xs)' }}>{c.email}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--ada-text-4)' }}>{c.lastActivity}</td>
                      <td style={{ padding: '10px 12px' }}><button style={{ color: 'var(--ada-text-3)' }}><ChevronRight size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
