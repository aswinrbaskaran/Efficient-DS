import { useState } from 'react';
import {
  Search, Filter, ChevronRight, Clock, AlertCircle, CheckCircle,
  MessageSquare, Phone, Mail, Globe, User, Tag, MoreHorizontal,
  Send, Paperclip, Smile, Star, AlertTriangle, XCircle, Info,
} from 'lucide-react';

const tickets = [
  { id: 'TKT-4821', subject: 'Cannot connect to SSO provider after migration', customer: 'Orion Cloud', priority: 'critical', status: 'open', sla: '18m', agent: 'AK', channel: 'email', unread: true },
  { id: 'TKT-4820', subject: 'Dashboard charts not loading in Firefox 122', customer: 'Aurora Finance', priority: 'high', status: 'open', sla: '2h 14m', agent: 'SL', channel: 'web', unread: false },
  { id: 'TKT-4819', subject: 'Bulk export exceeds 5000 row limit', customer: 'TechCorp Global', priority: 'medium', status: 'pending', sla: '6h 40m', agent: 'MR', channel: 'chat', unread: true },
  { id: 'TKT-4818', subject: 'API webhook not firing on plan upgrade', customer: 'Meridian AI', priority: 'high', status: 'open', sla: '1h 02m', agent: 'JP', channel: 'email', unread: false },
  { id: 'TKT-4817', subject: 'Password reset email not received', customer: 'Vertex Systems', priority: 'medium', status: 'resolved', sla: 'Resolved', agent: 'AK', channel: 'web', unread: false },
  { id: 'TKT-4816', subject: 'Custom domain SSL certificate expired', customer: 'Epsilon Labs', priority: 'critical', status: 'open', sla: '32m', agent: 'SL', channel: 'phone', unread: true },
];

const messages = [
  { from: 'customer', name: 'Alan Park', time: '10:14 AM', content: 'Hi, we migrated our workspace to a new SSO provider (Okta → AzureAD) and now no-one on our team can log in. We get the error: "SSO configuration mismatch — contact your administrator." This is urgent — all 240 users are locked out.' },
  { from: 'agent', name: 'Alex Kim', time: '10:22 AM', content: "Hi Alan, I'm sorry to hear that — being locked out is critical and I'm treating this with the highest priority.\n\nCan you please confirm:\n1. The entity ID you configured in AzureAD\n2. The ACS URL you used\n3. Whether you updated the metadata URL in our settings\n\nI'll pull up your workspace config on my end now." },
  { from: 'customer', name: 'Alan Park', time: '10:31 AM', content: "Entity ID: https://orion.app/sso/azure\nACS URL: https://orion.app/auth/saml/callback\n\nI don't think we updated the metadata URL — where is that in the settings?" },
  { from: 'agent', name: 'Alex Kim', time: '10:35 AM', content: 'Got it! The metadata URL is under Settings → Security → SSO → "Identity Provider Metadata". You need to paste your Azure federation metadata URL there. This step is required after any IdP change.\n\nI can see your workspace is still pointing to the old Okta config. Once you update that field, it should resolve immediately. I\'ll stay on this ticket until confirmed.' },
];

const slaMetrics = [
  { label: 'First Response', target: '< 1h', current: '28m', ok: true },
  { label: 'Resolution Time', target: '< 8h', current: '4h 12m', ok: true },
  { label: 'SLA Breached', target: '0', current: '2', ok: false },
  { label: 'CSAT Score', target: '> 90%', current: '94.2%', ok: true },
];

const priorityConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  critical: { bg: 'var(--ada-bg-error)', text: 'var(--ada-text-error)', icon: <XCircle size={11} /> },
  high: { bg: 'var(--ada-bg-warning)', text: 'var(--ada-text-warning)', icon: <AlertTriangle size={11} /> },
  medium: { bg: 'var(--ada-p-100)', text: 'var(--ada-p-700)', icon: <Info size={11} /> },
  low: { bg: 'var(--ada-bg-muted)', text: 'var(--ada-text-3)', icon: <Info size={11} /> },
};

const statusConfig: Record<string, { bg: string; text: string }> = {
  open: { bg: 'var(--ada-bg-warning)', text: 'var(--ada-text-warning)' },
  pending: { bg: 'var(--ada-p-100)', text: 'var(--ada-p-600)' },
  resolved: { bg: 'var(--ada-bg-success)', text: 'var(--ada-text-success)' },
};

const channelIcon: Record<string, React.ReactNode> = {
  email: <Mail size={12} />, web: <Globe size={12} />,
  chat: <MessageSquare size={12} />, phone: <Phone size={12} />,
};

export function SupportPage() {
  const [selected, setSelected] = useState('TKT-4821');
  const [reply, setReply] = useState('');
  const selectedTicket = tickets.find(t => t.id === selected);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      {/* SLA Metrics Bar */}
      <div className="px-6 py-3 border-b flex items-center gap-6 flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
        <h1 style={{ fontSize: 'var(--ada-fs-lg)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginRight: '8px' }}>Support Queue</h1>
        {slaMetrics.map(m => (
          <div key={m.label} className="flex items-center gap-3 pl-6 border-l" style={{ borderColor: 'var(--ada-border-default)' }}>
            <div className={`w-1.5 h-1.5 rounded-full`} style={{ backgroundColor: m.ok ? 'var(--ada-s-500)' : 'var(--ada-e-500)' }} />
            <div>
              <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
              <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: m.ok ? 'var(--ada-text-1)' : 'var(--ada-text-error)' }}>{m.current}</div>
            </div>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>Target:</span>
          {slaMetrics.map(m => (
            <span key={m.label} style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)' }}>{m.target}</span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Ticket Queue */}
        <div className="w-72 border-r flex flex-col flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
          <div className="p-3 border-b space-y-2" style={{ borderColor: 'var(--ada-border-default)' }}>
            <div className="flex items-center gap-2 px-2.5 py-2 rounded border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
              <Search size={13} style={{ color: 'var(--ada-text-3)' }} />
              <input placeholder="Search tickets…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-1)', flex: 1 }} />
            </div>
            <div className="flex gap-1">
              {['All', 'Open', 'Pending', 'Resolved'].map((f, i) => (
                <button key={f} className="flex-1 py-1 rounded text-center" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: i === 0 ? 'var(--ada-p-600)' : 'transparent', color: i === 0 ? 'white' : 'var(--ada-text-3)' }}>{f}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tickets.map(t => {
              const pc = priorityConfig[t.priority];
              const sc = statusConfig[t.status];
              return (
                <button key={t.id} onClick={() => setSelected(t.id)} className="w-full text-left px-3 py-3 border-b" style={{
                  borderColor: 'var(--ada-border-subtle)',
                  backgroundColor: selected === t.id ? 'var(--ada-p-50)' : 'transparent',
                  borderLeft: selected === t.id ? '3px solid var(--ada-p-600)' : '3px solid transparent',
                }}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', lineHeight: 1.3, flex: 1 }}>{t.subject}</span>
                    {t.unread && <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: 'var(--ada-p-600)' }} />}
                  </div>
                  <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)', marginBottom: '6px' }}>{t.customer}</div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: pc.bg, color: pc.text }}>{pc.icon}{t.priority}</span>
                    <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: sc.bg, color: sc.text }}>{t.status}</span>
                    <span className="ml-auto flex items-center gap-0.5" style={{ fontSize: 'var(--ada-fs-2xs)', color: t.status === 'resolved' ? 'var(--ada-text-3)' : 'var(--ada-text-warning)' }}>
                      <Clock size={10} />{t.sla}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedTicket && (
            <>
              <div className="px-5 py-3 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', fontFamily: 'var(--ada-font-mono)' }}>{selectedTicket.id}</span>
                    <span className="px-2 py-0.5 rounded-full flex items-center gap-1" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: priorityConfig[selectedTicket.priority].bg, color: priorityConfig[selectedTicket.priority].text }}>{priorityConfig[selectedTicket.priority].icon}{selectedTicket.priority}</span>
                  </div>
                  <h2 style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{selectedTicket.subject}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1" style={{ color: 'var(--ada-text-4)', fontSize: 'var(--ada-fs-xs)' }}>{channelIcon[selectedTicket.channel]}<span className="capitalize">{selectedTicket.channel}</span></div>
                  <button style={{ color: 'var(--ada-text-3)' }}><MoreHorizontal size={15} /></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-3 ${m.from === 'agent' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: m.from === 'agent' ? 'var(--ada-p-100)' : 'var(--ada-surface-3)', color: m.from === 'agent' ? 'var(--ada-p-700)' : 'var(--ada-text-2)', fontSize: '11px', fontWeight: 'bold' }}>
                      {m.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 max-w-lg">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{m.name}</span>
                        <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>{m.time}</span>
                      </div>
                      <div className="rounded-lg px-4 py-3" style={{ backgroundColor: m.from === 'agent' ? 'var(--ada-p-50)' : 'var(--ada-surface-2)', borderLeft: m.from === 'agent' ? '2px solid var(--ada-p-300)' : 'none' }}>
                        {m.content.split('\n').map((line, j) => (
                          line === '' ? <div key={j} className="h-2" /> : <p key={j} style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)', lineHeight: 1.6 }}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
                <div className="rounded-lg border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
                  <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply…" rows={3} className="w-full resize-none px-4 py-3 rounded-t-lg" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)', fontFamily: 'inherit' }} />
                  <div className="flex items-center justify-between px-4 py-2 border-t" style={{ borderColor: 'var(--ada-border-default)' }}>
                    <div className="flex items-center gap-2">
                      {[<Paperclip size={14} />, <Smile size={14} />].map((icon, i) => (
                        <button key={i} style={{ color: 'var(--ada-text-3)' }}>{icon}</button>
                      ))}
                    </div>
                    <button onClick={() => setReply('')} className="flex items-center gap-1.5 px-4 py-1.5 rounded" style={{ backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)', fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)' }}>
                      <Send size={12} /> Send Reply
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Customer Profile Sidebar */}
        {selectedTicket && (
          <div className="w-60 border-l flex flex-col flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
              <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Customer Profile</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--ada-p-100)', color: 'var(--ada-p-700)', fontWeight: 'bold' }}>
                  {selectedTicket.customer.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{selectedTicket.customer}</div>
                  <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>Enterprise Plan</div>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'MRR', value: '$4,200', icon: null },
                  { label: 'Open Tickets', value: '3', icon: null },
                  { label: 'Health Score', value: '82%', icon: null },
                  { label: 'Since', value: 'Jan 2024', icon: null },
                ].map(f => (
                  <div key={f.label} className="flex items-center justify-between">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{f.label}</span>
                    <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{f.value}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3" style={{ borderColor: 'var(--ada-border-default)' }}>
                <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)', marginBottom: '8px' }}>Recent Tickets</div>
                {['TKT-4786', 'TKT-4712', 'TKT-4690'].map((id, i) => (
                  <div key={id} className="flex items-center justify-between py-1.5">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-p-600)' }}>{id}</span>
                    <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: i === 0 ? 'var(--ada-bg-warning)' : 'var(--ada-bg-success)', color: i === 0 ? 'var(--ada-text-warning)' : 'var(--ada-text-success)' }}>{i === 0 ? 'open' : 'resolved'}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3" style={{ borderColor: 'var(--ada-border-default)' }}>
                <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)', marginBottom: '6px' }}>CSAT Ratings</div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <Star key={n} size={14} style={{ color: n <= 4 ? 'var(--ada-w-500)' : 'var(--ada-border-default)', fill: n <= 4 ? 'var(--ada-w-500)' : 'none' }} />
                  ))}
                  <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', marginLeft: '4px' }}>4.2 avg</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
