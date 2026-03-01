import { useState } from 'react';
import {
  Search, Plus, Filter, MoreHorizontal, ChevronDown, X, Check,
  ArrowUpDown, ArrowUp, ArrowDown, Mail, Shield, Clock, UserPlus,
  Trash2, Edit, Ban, ChevronLeft, ChevronRight, Users, UserCheck,
  UserX, AlertCircle
} from 'lucide-react';

/* ─── Types & Data ────────────────────────────────────────── */
type Role = 'Admin' | 'Developer' | 'Viewer' | 'Billing';
type Status = 'Active' | 'Inactive' | 'Pending' | 'Suspended';

type User = {
  id: string; name: string; email: string; role: Role;
  status: Status; plan: string; lastLogin: string;
  joined: string; teams: number; mfa: boolean;
};

const initialUsers: User[] = [
  { id: 'USR-001', name: 'Sarah Chen', email: 'sarah.chen@acmecorp.com', role: 'Admin', status: 'Active', plan: 'Enterprise', lastLogin: '2 min ago', joined: 'Jan 12, 2026', teams: 4, mfa: true },
  { id: 'USR-002', name: 'Marcus Reed', email: 'marcus.reed@acmecorp.com', role: 'Developer', status: 'Active', plan: 'Pro', lastLogin: '1 hour ago', joined: 'Feb 3, 2026', teams: 2, mfa: true },
  { id: 'USR-003', name: 'Priya Patel', email: 'priya.patel@acmecorp.com', role: 'Viewer', status: 'Inactive', plan: 'Free', lastLogin: '14 days ago', joined: 'Mar 1, 2025', teams: 1, mfa: false },
  { id: 'USR-004', name: 'James Wilson', email: 'james.wilson@acmecorp.com', role: 'Developer', status: 'Pending', plan: 'Pro', lastLogin: 'Never', joined: 'Mar 15, 2026', teams: 0, mfa: false },
  { id: 'USR-005', name: 'Aiko Tanaka', email: 'aiko.tanaka@acmecorp.com', role: 'Admin', status: 'Active', plan: 'Enterprise', lastLogin: '30 min ago', joined: 'Apr 2, 2025', teams: 5, mfa: true },
  { id: 'USR-006', name: 'Carlos Ruiz', email: 'carlos.ruiz@acmecorp.com', role: 'Developer', status: 'Active', plan: 'Pro', lastLogin: '3 hours ago', joined: 'Jan 28, 2026', teams: 3, mfa: true },
  { id: 'USR-007', name: 'Fatima Al-Rashid', email: 'fatima.a@acmecorp.com', role: 'Billing', status: 'Active', plan: 'Enterprise', lastLogin: 'Yesterday', joined: 'Dec 10, 2025', teams: 1, mfa: false },
  { id: 'USR-008', name: 'Liam O\'Brien', email: 'liam.o@acmecorp.com', role: 'Developer', status: 'Suspended', plan: 'Pro', lastLogin: '32 days ago', joined: 'Nov 5, 2025', teams: 2, mfa: true },
  { id: 'USR-009', name: 'Yuna Kim', email: 'yuna.kim@acmecorp.com', role: 'Viewer', status: 'Active', plan: 'Free', lastLogin: '2 days ago', joined: 'Feb 20, 2026', teams: 1, mfa: false },
  { id: 'USR-010', name: 'Devon Park', email: 'devon.park@acmecorp.com', role: 'Developer', status: 'Active', plan: 'Pro', lastLogin: '5 hours ago', joined: 'Jan 5, 2026', teams: 3, mfa: true },
];

/* ─── Helpers ─────────────────────────────────────────────── */
const roleColors: Record<Role, { bg: string; text: string }> = {
  Admin:     { bg: 'var(--ada-p-100)',  text: 'var(--ada-p-700)' },
  Developer: { bg: 'var(--ada-i-100)',  text: 'var(--ada-i-700)' },
  Viewer:    { bg: 'var(--ada-surface-3)', text: 'var(--ada-text-3)' },
  Billing:   { bg: 'var(--ada-w-100)',  text: 'var(--ada-w-700)' },
};

const statusConfig: Record<Status, { bg: string; text: string; dot: string }> = {
  Active:    { bg: 'var(--ada-s-100)', text: 'var(--ada-s-700)', dot: 'var(--ada-s-500)' },
  Inactive:  { bg: 'var(--ada-surface-3)', text: 'var(--ada-text-3)', dot: 'var(--ada-n-400)' },
  Pending:   { bg: 'var(--ada-w-100)', text: 'var(--ada-w-700)', dot: 'var(--ada-w-500)' },
  Suspended: { bg: 'var(--ada-e-100)', text: 'var(--ada-e-700)', dot: 'var(--ada-e-500)' },
};

function RoleBadge({ role }: { role: Role }) {
  const c = roleColors[role];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: c.bg, color: c.text }}>
      <Shield size={10} />
      {role}
    </span>
  );
}

function StatusDot({ status }: { status: Status }) {
  const c = statusConfig[status];
  return (
    <span className="inline-flex items-center gap-1.5" style={{ fontSize: 'var(--ada-fs-xs)', color: c.text }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: c.dot, display: 'inline-block', flexShrink: 0 }} />
      {status}
    </span>
  );
}

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  // Deterministic color from name
  const colors = ['var(--ada-p-100)', 'var(--ada-i-100)', 'var(--ada-s-100)', 'var(--ada-w-100)'];
  const textColors = ['var(--ada-p-700)', 'var(--ada-i-700)', 'var(--ada-s-700)', 'var(--ada-w-700)'];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: size, height: size, backgroundColor: colors[idx], border: '1.5px solid var(--ada-border-default)' }}>
      <span style={{ fontSize: `${size * 0.35}px`, fontWeight: 'var(--ada-fw-semibold)', color: textColors[idx] }}>{initials}</span>
    </div>
  );
}

/* ─── Invite Modal ────────────────────────────────────────── */
function InviteModal({ onClose }: { onClose: () => void }) {
  const [emails, setEmails] = useState('');
  const [role, setRole] = useState<Role>('Developer');
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!emails.trim()) return;
    setSent(true);
    setTimeout(() => { setSent(false); onClose(); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-md rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-modal)' }} role="dialog" aria-modal="true" aria-label="Invite team members">
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded" style={{ backgroundColor: 'var(--ada-p-50)' }}>
              <UserPlus size={16} style={{ color: 'var(--ada-p-600)' }} />
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--ada-fs-base)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Invite Team Members</h2>
              <p style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>Invitations will be sent by email</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ color: 'var(--ada-text-3)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block mb-1.5" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>
              Email addresses <span style={{ color: 'var(--ada-e-500)' }}>*</span>
            </label>
            <textarea
              value={emails}
              onChange={e => setEmails(e.target.value)}
              placeholder="jane@company.com, john@company.com"
              rows={3}
              className="w-full rounded border px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }}
            />
            <p style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', marginTop: '4px' }}>Separate multiple emails with commas</p>
          </div>

          <div>
            <label className="block mb-2" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Assign Role</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Admin', 'Developer', 'Viewer', 'Billing'] as const).map(r => (
                <label key={r} className="flex items-center gap-2.5 p-2.5 rounded border cursor-pointer"
                  style={{ borderColor: role === r ? 'var(--ada-p-400)' : 'var(--ada-border-default)', backgroundColor: role === r ? 'var(--ada-p-50)' : 'var(--ada-surface-1)' }}>
                  <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} className="sr-only" />
                  <div className="flex items-center justify-center rounded-full" style={{ width: 14, height: 14, border: `2px solid ${role === r ? 'var(--ada-p-600)' : 'var(--ada-border-strong)'}` }}>
                    {role === r && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--ada-p-600)' }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: role === r ? 'var(--ada-p-700)' : 'var(--ada-text-1)' }}>{r}</div>
                    <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>
                      {r === 'Admin' ? 'Full access' : r === 'Developer' ? 'API + code' : r === 'Viewer' ? 'Read only' : 'Billing only'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
          <button onClick={onClose} className="px-4 py-2 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-2)' }}>
            Cancel
          </button>
          <button onClick={send} className="flex items-center gap-1.5 px-4 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: sent ? 'var(--ada-s-600)' : 'var(--ada-btn-primary-bg)', color: 'white' }}>
            {sent ? <><Check size={14} /> Sent!</> : <><Mail size={14} /> Send Invites</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── User Detail Drawer ──────────────────────────────────── */
function UserDrawer({ user, onClose }: { user: User; onClose: () => void }) {
  const [role, setRole] = useState<Role>(user.role);

  return (
    <div className="fixed inset-0 z-40 flex justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-80 h-full border-l flex flex-col" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-modal)' }} role="dialog" aria-label={`User details: ${user.name}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
          <h2 style={{ fontSize: 'var(--ada-fs-base)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>User Details</h2>
          <button onClick={onClose} className="p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ color: 'var(--ada-text-3)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Profile */}
        <div className="p-5 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          <div className="flex items-center gap-3 mb-4">
            <Avatar name={user.name} size={48} />
            <div>
              <div style={{ fontSize: 'var(--ada-fs-base)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{user.name}</div>
              <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{user.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Status', value: <StatusDot status={user.status} /> },
              { label: 'Plan', value: user.plan },
              { label: 'Teams', value: `${user.teams} team${user.teams !== 1 ? 's' : ''}` },
              { label: '2FA', value: user.mfa ? '✓ Enabled' : '✗ Disabled' },
              { label: 'Last Login', value: user.lastLogin },
              { label: 'Joined', value: user.joined },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)', fontWeight: 'var(--ada-fw-medium)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{item.label}</div>
                <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-1)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Role selector */}
        <div className="p-5 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-2)', marginBottom: '8px' }}>Role</div>
          <div className="space-y-1.5">
            {(['Admin', 'Developer', 'Viewer', 'Billing'] as const).map(r => (
              <label key={r} className="flex items-center gap-2.5 p-2 rounded cursor-pointer transition-colors" style={{ backgroundColor: role === r ? 'var(--ada-p-50)' : 'transparent' }}
                onMouseEnter={e => { if (role !== r) e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)'; }}
                onMouseLeave={e => { if (role !== r) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <div className="flex items-center justify-center rounded-full" style={{ width: 14, height: 14, border: `2px solid ${role === r ? 'var(--ada-p-600)' : 'var(--ada-border-strong)'}` }}>
                  {role === r && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--ada-p-600)' }} />}
                </div>
                <input type="radio" name="drawer-role" value={r} checked={role === r} onChange={() => setRole(r)} className="sr-only" />
                <div className="flex-1">
                  <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: role === r ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)', color: role === r ? 'var(--ada-p-700)' : 'var(--ada-text-1)' }}>{r}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 space-y-2">
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }}>
            <Check size={14} /> Save Changes
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', borderColor: 'var(--ada-e-200)', backgroundColor: 'var(--ada-e-50)', color: 'var(--ada-e-700)' }}>
            <Ban size={14} /> Suspend User
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortCol, setSortCol] = useState<keyof User>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [drawerUser, setDrawerUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const handleSort = (col: keyof User) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const filtered = users.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    if (statusFilter !== 'All' && u.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => {
    const av = String(a[sortCol]); const bv = String(b[sortCol]);
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const pageCount = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map(u => u.id));

  const SortIcon = ({ col }: { col: keyof User }) => {
    if (sortCol !== col) return <ArrowUpDown size={11} style={{ color: 'var(--ada-text-4)' }} />;
    return sortDir === 'asc' ? <ArrowUp size={11} style={{ color: 'var(--ada-p-600)' }} /> : <ArrowDown size={11} style={{ color: 'var(--ada-p-600)' }} />;
  };

  const kpis = [
    { label: 'Total Users', value: users.length, icon: <Users size={16} />, color: 'var(--ada-p-600)' },
    { label: 'Active Users', value: users.filter(u => u.status === 'Active').length, icon: <UserCheck size={16} />, color: 'var(--ada-s-600)' },
    { label: 'Pending Invites', value: users.filter(u => u.status === 'Pending').length, icon: <Clock size={16} />, color: 'var(--ada-w-600)' },
    { label: 'Suspended', value: users.filter(u => u.status === 'Suspended').length, icon: <UserX size={16} />, color: 'var(--ada-e-600)' },
  ];

  return (
    <div className="p-6 space-y-5" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 style={{ fontSize: 'var(--ada-fs-3xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>User Management</h1>
          <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>Invite, manage roles, and monitor team member access.</p>
        </div>
        <button onClick={() => setInviteOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
          style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: 'var(--ada-btn-primary-bg)', color: 'white' }}>
          <UserPlus size={15} /> Invite Members
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="flex items-center gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
            <div className="flex items-center justify-center w-8 h-8 rounded" style={{ backgroundColor: 'var(--ada-surface-3)', color: k.color }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 'var(--ada-fs-2xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', lineHeight: 1.2 }}>{k.value}</div>
              <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--ada-text-3)' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }} />
        </div>

        <div className="relative">
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            className="appearance-none pl-3 pr-8 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }}>
            <option value="All">All Roles</option>
            {(['Admin', 'Developer', 'Viewer', 'Billing'] as const).map(r => <option key={r}>{r}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--ada-text-3)' }} />
        </div>

        <div className="relative">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="appearance-none pl-3 pr-8 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }}>
            <option value="All">All Statuses</option>
            {(['Active', 'Inactive', 'Pending', 'Suspended'] as const).map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--ada-text-3)' }} />
        </div>

        {selected.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{selected.length} selected</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border focus:outline-none"
              style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-e-200)', backgroundColor: 'var(--ada-e-50)', color: 'var(--ada-e-600)', fontWeight: 'var(--ada-fw-medium)' }}>
              <Ban size={12} /> Suspend selected
            </button>
            <button onClick={() => setSelected([])} className="p-1.5 rounded focus:outline-none" style={{ color: 'var(--ada-text-4)' }}>
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" role="grid" aria-label="User management table">
            <thead>
              <tr style={{ backgroundColor: 'var(--ada-surface-2)', borderBottom: '1px solid var(--ada-border-default)' }}>
                <th className="px-4 py-2.5 w-10">
                  <input type="checkbox" checked={selected.length === paginated.length && paginated.length > 0}
                    onChange={toggleAll} className="rounded focus:outline-none" aria-label="Select all" />
                </th>
                {[
                  { key: 'name' as const, label: 'User' },
                  { key: 'role' as const, label: 'Role' },
                  { key: 'status' as const, label: 'Status' },
                  { key: 'plan' as const, label: 'Plan' },
                  { key: 'lastLogin' as const, label: 'Last Login' },
                  { key: 'joined' as const, label: 'Joined' },
                ].map(col => (
                  <th key={col.key} className="text-left px-4 py-2.5" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-3)', whiteSpace: 'nowrap' }}>
                    <button onClick={() => handleSort(col.key)} className="flex items-center gap-1.5 focus:outline-none rounded">
                      {col.label} <SortIcon col={col.key} />
                    </button>
                  </th>
                ))}
                <th className="px-4 py-2.5" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', fontWeight: 'var(--ada-fw-semibold)' }}>2FA</th>
                <th className="w-12 px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users size={32} style={{ color: 'var(--ada-text-4)' }} />
                      <div style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>No users match your filters</div>
                      <button onClick={() => { setSearch(''); setRoleFilter('All'); setStatusFilter('All'); }} style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-p-600)', textDecoration: 'underline' }}>
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : paginated.map((u, i) => (
                <tr
                  key={u.id}
                  className="transition-colors cursor-pointer"
                  style={{ borderBottom: i < paginated.length - 1 ? '1px solid var(--ada-border-subtle)' : 'none', backgroundColor: selected.includes(u.id) ? 'var(--ada-p-50)' : 'transparent' }}
                  onClick={() => setDrawerUser(u)}
                  onMouseEnter={e => { if (!selected.includes(u.id)) e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = selected.includes(u.id) ? 'var(--ada-p-50)' : 'transparent'; }}
                >
                  <td className="px-4 py-3" onClick={e => { e.stopPropagation(); toggleSelect(u.id); }}>
                    <input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggleSelect(u.id)} className="rounded" aria-label={`Select ${u.name}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={u.name} />
                      <div>
                        <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}>{u.name}</div>
                        <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                  <td className="px-4 py-3"><StatusDot status={u.status} /></td>
                  <td className="px-4 py-3"><span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>{u.plan}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} style={{ color: 'var(--ada-text-4)' }} />
                      <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{u.lastLogin}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>{u.joined}</span></td>
                  <td className="px-4 py-3">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: u.mfa ? 'var(--ada-s-600)' : 'var(--ada-text-4)' }}>
                      {u.mfa ? '✓' : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={e => { e.stopPropagation(); setDrawerUser(u); }}
                      className="p-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
                      style={{ color: 'var(--ada-text-4)' }}
                      aria-label="View user details"
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
            {filtered.length} user{filtered.length !== 1 ? 's' : ''} · Page {page} of {Math.max(pageCount, 1)}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded border focus:outline-none"
              style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: page === 1 ? 'var(--ada-text-4)' : 'var(--ada-text-2)' }}
              aria-label="Previous">
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.max(pageCount, 1) }, (_, i) => i + 1).slice(0, 4).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className="px-2.5 py-1 rounded border focus:outline-none"
                style={{ fontSize: 'var(--ada-fs-xs)', minWidth: 32, backgroundColor: page === n ? 'var(--ada-p-600)' : 'var(--ada-surface-1)', color: page === n ? 'white' : 'var(--ada-text-3)', borderColor: 'var(--ada-border-default)', fontWeight: page === n ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)' }}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(Math.max(pageCount, 1), p + 1))} disabled={page >= pageCount}
              className="p-1.5 rounded border focus:outline-none"
              style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: page >= pageCount ? 'var(--ada-text-4)' : 'var(--ada-text-2)' }}
              aria-label="Next">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {inviteOpen && <InviteModal onClose={() => setInviteOpen(false)} />}

      {/* User Drawer */}
      {drawerUser && <UserDrawer user={drawerUser} onClose={() => setDrawerUser(null)} />}
    </div>
  );
}
