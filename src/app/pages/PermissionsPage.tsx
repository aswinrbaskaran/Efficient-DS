import { useState } from 'react';
import {
  Shield, Key, ClipboardList, Search, Plus, Copy, Eye, EyeOff,
  Trash2, RefreshCw, Check, X, MoreHorizontal, AlertTriangle,
  Clock, User, Filter, Download, ChevronDown,
} from 'lucide-react';

const roles = ['Admin', 'Editor', 'Viewer', 'Developer', 'Billing'];
const resources = [
  { category: 'Users', perms: ['Create', 'Read', 'Update', 'Delete', 'Export'] },
  { category: 'Projects', perms: ['Create', 'Read', 'Update', 'Delete', 'Publish'] },
  { category: 'Billing', perms: ['View', 'Manage', 'Export', '', ''] },
  { category: 'API Keys', perms: ['Create', 'Read', 'Revoke', '', ''] },
  { category: 'Settings', perms: ['Read', 'Update', '', '', ''] },
  { category: 'Analytics', perms: ['Read', 'Export', '', '', ''] },
  { category: 'Audit Logs', perms: ['Read', 'Export', '', '', ''] },
];

// matrix[role][resource][perm]
const defaultMatrix: Record<string, Record<string, string[]>> = {
  Admin: { Users: ['Create', 'Read', 'Update', 'Delete', 'Export'], Projects: ['Create', 'Read', 'Update', 'Delete', 'Publish'], Billing: ['View', 'Manage', 'Export'], 'API Keys': ['Create', 'Read', 'Revoke'], Settings: ['Read', 'Update'], Analytics: ['Read', 'Export'], 'Audit Logs': ['Read', 'Export'] },
  Editor: { Users: ['Read'], Projects: ['Create', 'Read', 'Update', 'Publish'], Billing: [], 'API Keys': ['Create', 'Read'], Settings: ['Read'], Analytics: ['Read'], 'Audit Logs': [] },
  Viewer: { Users: ['Read'], Projects: ['Read'], Billing: ['View'], 'API Keys': ['Read'], Settings: ['Read'], Analytics: ['Read'], 'Audit Logs': [] },
  Developer: { Users: ['Read'], Projects: ['Create', 'Read', 'Update'], Billing: [], 'API Keys': ['Create', 'Read', 'Revoke'], Settings: ['Read'], Analytics: ['Read', 'Export'], 'Audit Logs': ['Read'] },
  Billing: { Users: ['Read'], Projects: ['Read'], Billing: ['View', 'Manage', 'Export'], 'API Keys': [], Settings: ['Read'], Analytics: ['Read'], 'Audit Logs': ['Read'] },
};

const auditLogs = [
  { user: 'admin@company.com', action: 'Updated role permissions', target: 'Editor', time: '2 min ago', ip: '10.0.1.42', severity: 'medium' },
  { user: 'sarah@company.com', action: 'API key created', target: 'sk_live_9f3a...', time: '1h ago', ip: '10.0.2.88', severity: 'low' },
  { user: 'admin@company.com', action: 'User role changed', target: 'marcus@company.com → Editor', time: '3h ago', ip: '10.0.1.42', severity: 'medium' },
  { user: 'billing@company.com', action: 'Billing export downloaded', target: 'Q1-2026-invoice.csv', time: '5h ago', ip: '10.0.4.21', severity: 'low' },
  { user: 'admin@company.com', action: 'API key revoked', target: 'sk_live_7c2b...', time: '1d ago', ip: '10.0.1.42', severity: 'high' },
  { user: 'james@company.com', action: 'Failed login attempt', target: 'admin panel', time: '1d ago', ip: '185.12.44.9', severity: 'high' },
];

const apiKeys = [
  { name: 'Production API', key: 'sk_live_9f3a...2b8d', created: 'Jan 14, 2026', lastUsed: '2h ago', scope: 'Full Access', status: 'active' },
  { name: 'Staging Integration', key: 'sk_test_4c1e...7f92', created: 'Feb 2, 2026', lastUsed: '1d ago', scope: 'Read Only', status: 'active' },
  { name: 'Analytics Export', key: 'sk_live_7c2b...1a4e', created: 'Dec 12, 2025', lastUsed: 'Never', scope: 'Analytics', status: 'revoked' },
  { name: 'Webhook Service', key: 'sk_live_0d8f...3c61', created: 'Mar 1, 2026', lastUsed: '5 min ago', scope: 'Events', status: 'active' },
];

const severityColor: Record<string, string> = { high: 'var(--ada-text-error)', medium: 'var(--ada-text-warning)', low: 'var(--ada-text-3)' };

export function PermissionsPage() {
  const [tab, setTab] = useState<'matrix' | 'audit' | 'keys'>('matrix');
  const [selectedRole, setSelectedRole] = useState('Editor');
  const [matrix, setMatrix] = useState(defaultMatrix);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const togglePerm = (role: string, cat: string, perm: string) => {
    setMatrix(prev => {
      const current = prev[role][cat] || [];
      const updated = current.includes(perm) ? current.filter(p => p !== perm) : [...current, perm];
      return { ...prev, [role]: { ...prev[role], [cat]: updated } };
    });
  };

  const copyKey = (key: string) => {
    navigator.clipboard?.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="p-6 space-y-5" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: 'var(--ada-fs-2xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Settings & Permissions</h1>
          <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)', marginTop: '2px' }}>Role Access Matrix · Audit Logs · API Key Management</p>
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          <div className="flex gap-1">
            {(['matrix', 'audit', 'keys'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className="flex items-center gap-1.5 px-3 py-1.5 rounded" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: tab === t ? 'var(--ada-p-600)' : 'transparent', color: tab === t ? 'white' : 'var(--ada-text-2)' }}>
                {t === 'matrix' && <Shield size={12} />}
                {t === 'audit' && <ClipboardList size={12} />}
                {t === 'keys' && <Key size={12} />}
                {t.replace('matrix', 'Access Matrix').replace('audit', 'Audit Logs').replace('keys', 'API Keys')}
              </button>
            ))}
          </div>
          {tab === 'matrix' && (
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>Editing role:</span>
              <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="px-2 py-1 rounded border" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)', backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)', outline: 'none' }}>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          )}
          {tab === 'keys' && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded" style={{ backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)', fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)' }}>
              <Plus size={13} /> Generate Key
            </button>
          )}
        </div>

        {tab === 'matrix' && (
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ada-fs-xs)' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--ada-surface-2)', borderBottom: '1px solid var(--ada-border-default)' }}>
                  <th style={{ padding: '8px 16px', textAlign: 'left', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)', width: 140 }}>Resource</th>
                  {roles.map(r => (
                    <th key={r} style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 'var(--ada-fw-semibold)', color: r === selectedRole ? 'var(--ada-p-600)' : 'var(--ada-text-2)', whiteSpace: 'nowrap', backgroundColor: r === selectedRole ? 'var(--ada-p-50)' : 'transparent' }}>
                      {r === selectedRole && <div className="w-1.5 h-1.5 rounded-full mx-auto mb-1" style={{ backgroundColor: 'var(--ada-p-600)' }} />}
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resources.map(res => (
                  <tr key={res.category} style={{ borderBottom: '1px solid var(--ada-border-subtle)' }}>
                    <td style={{ padding: '8px 16px', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{res.category}</td>
                    {roles.map(role => (
                      <td key={role} style={{ padding: '8px 12px', textAlign: 'center', backgroundColor: role === selectedRole ? 'var(--ada-p-50)' : 'transparent' }}>
                        <div className="flex flex-col gap-1 items-center">
                          {res.perms.filter(Boolean).map(perm => {
                            const granted = (matrix[role]?.[res.category] || []).includes(perm);
                            return (
                              <button key={perm} onClick={() => togglePerm(role, res.category, perm)} className="flex items-center gap-1 px-1.5 py-0.5 rounded group" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: granted ? (role === selectedRole ? 'var(--ada-p-100)' : 'var(--ada-bg-success)') : 'var(--ada-surface-3)', color: granted ? (role === selectedRole ? 'var(--ada-p-700)' : 'var(--ada-text-success)') : 'var(--ada-text-4)', transition: 'all 0.1s' }}>
                                {granted ? <Check size={9} /> : <X size={9} />}
                                {perm}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-end gap-3 px-5 py-3 border-t" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
              <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>Click any permission to toggle for the selected role</span>
              <button className="px-4 py-1.5 rounded" style={{ backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)', fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)' }}>Save Changes</button>
            </div>
          </div>
        )}

        {tab === 'audit' && (
          <>
            <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
              <div className="flex items-center gap-2 flex-1 px-3 py-1.5 rounded border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
                <Search size={13} style={{ color: 'var(--ada-text-3)' }} />
                <input placeholder="Search audit logs…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-1)', flex: 1 }} />
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded border" style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-2)', backgroundColor: 'var(--ada-surface-1)' }}><Filter size={13} /> Filter</button>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded border" style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-2)', backgroundColor: 'var(--ada-surface-1)' }}><Download size={13} /> Export</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ada-fs-xs)' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--ada-surface-2)', borderBottom: '1px solid var(--ada-border-default)' }}>
                  {['User', 'Action', 'Target', 'IP Address', 'Time', 'Severity'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--ada-border-subtle)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-2)', fontSize: 'var(--ada-fs-xs)' }}>{log.user}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}>{log.action}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--ada-text-3)', fontFamily: 'var(--ada-font-mono)', fontSize: 'var(--ada-fs-xs)' }}>{log.target}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-4)', fontSize: 'var(--ada-fs-xs)' }}>{log.ip}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--ada-text-4)' }}><span className="flex items-center gap-1"><Clock size={11} />{log.time}</span></td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className="flex items-center gap-1 capitalize" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: severityColor[log.severity] }}>
                        {log.severity === 'high' && <AlertTriangle size={11} />}
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === 'keys' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ada-fs-xs)' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--ada-surface-2)', borderBottom: '1px solid var(--ada-border-default)' }}>
                {['Name', 'Key', 'Scope', 'Created', 'Last Used', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apiKeys.map(k => (
                <tr key={k.name} style={{ borderBottom: '1px solid var(--ada-border-subtle)', opacity: k.status === 'revoked' ? 0.5 : 1 }}>
                  <td style={{ padding: '10px 12px', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}>{k.name}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div className="flex items-center gap-2">
                      <code style={{ fontFamily: 'var(--ada-font-mono)', fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{showKey === k.key ? k.key : k.key}</code>
                      <button onClick={() => copyKey(k.key)} style={{ color: 'var(--ada-text-4)' }}>{copied === k.key ? <Check size={12} style={{ color: 'var(--ada-text-success)' }} /> : <Copy size={12} />}</button>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: 'var(--ada-p-100)', color: 'var(--ada-p-700)', fontWeight: 'var(--ada-fw-medium)' }}>{k.scope}</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--ada-text-3)' }}>{k.created}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--ada-text-3)' }}>{k.lastUsed}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: k.status === 'active' ? 'var(--ada-bg-success)' : 'var(--ada-bg-error)', color: k.status === 'active' ? 'var(--ada-text-success)' : 'var(--ada-text-error)' }}>{k.status}</span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    {k.status === 'active' && (
                      <button className="flex items-center gap-1 px-2.5 py-1 rounded border" style={{ fontSize: 'var(--ada-fs-2xs)', borderColor: 'var(--ada-e-300)', color: 'var(--ada-text-error)' }}>
                        <Trash2 size={11} /> Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
