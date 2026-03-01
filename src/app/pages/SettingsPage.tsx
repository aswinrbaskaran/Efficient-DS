import { useState } from 'react';
import {
  User, Bell, Shield, CreditCard, Key, Globe, Palette, Terminal,
  ChevronRight, Check, X, AlertTriangle, Eye, EyeOff, Copy,
  Plus, Trash2, Upload, Camera
} from 'lucide-react';

/* ─── Nav Groups ──────────────────────────────────────────── */
const navGroups = [
  {
    group: 'Account', items: [
      { id: 'profile', icon: <User size={14} />, label: 'Profile' },
      { id: 'notifications', icon: <Bell size={14} />, label: 'Notifications' },
      { id: 'security', icon: <Shield size={14} />, label: 'Security & Privacy' },
    ],
  },
  {
    group: 'Workspace', items: [
      { id: 'billing', icon: <CreditCard size={14} />, label: 'Billing & Plans' },
      { id: 'api', icon: <Key size={14} />, label: 'API Keys' },
      { id: 'integrations', icon: <Globe size={14} />, label: 'Integrations' },
    ],
  },
  {
    group: 'Preferences', items: [
      { id: 'appearance', icon: <Palette size={14} />, label: 'Appearance' },
      { id: 'developer', icon: <Terminal size={14} />, label: 'Developer' },
    ],
  },
];

/* ─── Helpers ─────────────────────────────────────────────── */
function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5 pb-4 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
      <h2 style={{ fontSize: 'var(--ada-fs-xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>{title}</h2>
      {desc && <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>{desc}</p>}
    </div>
  );
}

function FieldRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-4 border-b last:border-0" style={{ borderColor: 'var(--ada-border-subtle)' }}>
      <div className="flex-1 mr-6">
        <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)', marginBottom: '2px' }}>{label}</div>
        {desc && <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', lineHeight: 1.5 }}>{desc}</div>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onChange}
      className="relative rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] focus-visible:ring-offset-2"
      style={{ width: 40, height: 22, backgroundColor: on ? 'var(--ada-p-600)' : 'var(--ada-n-300)', flexShrink: 0 }}
    >
      <span className="absolute top-1 rounded-full bg-white transition-all duration-200"
        style={{ width: 14, height: 14, left: on ? '23px' : '3px', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
    </button>
  );
}

/* ─── Profile Panel ───────────────────────────────────────── */
function ProfilePanel() {
  const [name, setName] = useState('Sarah Chen');
  const [email, setEmail] = useState('sarah.chen@acmecorp.com');
  const [bio, setBio] = useState('Senior Platform Engineer at Acme Corp. Building developer tools.');
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <SectionTitle title="Profile" desc="Update your personal information and profile picture." />

      {/* Avatar section */}
      <div className="flex items-center gap-5 mb-6 p-4 rounded-lg border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
        <div className="relative">
          <div className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, backgroundColor: 'var(--ada-p-100)', border: '2px solid var(--ada-p-200)' }}>
            <span style={{ fontSize: 'var(--ada-fs-2xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-p-700)' }}>SC</span>
          </div>
          <button className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-strong)' }} aria-label="Change avatar">
            <Camera size={11} style={{ color: 'var(--ada-text-2)' }} />
          </button>
        </div>
        <div>
          <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>{name}</div>
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', marginBottom: '8px' }}>Joined January 2025</div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-2)' }}>
            <Upload size={12} /> Upload photo
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Display Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }} />
          </div>
          <div>
            <label className="block mb-1.5" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }} />
          </div>
        </div>
        <div>
          <label className="block mb-1.5" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full rounded border px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }} />
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', marginTop: '4px', textAlign: 'right' }}>{bio.length} / 200</div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button onClick={save} className="flex items-center gap-1.5 px-4 py-2 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: saved ? 'var(--ada-s-600)' : 'var(--ada-btn-primary-bg)', color: 'white' }}>
            {saved ? <><Check size={14} /> Saved</> : 'Save Changes'}
          </button>
          <button className="px-4 py-2 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-2)' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Notifications Panel ─────────────────────────────────── */
function NotificationsPanel() {
  const [settings, setSettings] = useState({
    email_security: true, email_billing: true, email_updates: false,
    email_newsletter: false, push_mentions: true, push_comments: false,
    digest_weekly: true, digest_monthly: false,
  });

  const toggle = (key: keyof typeof settings) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const groups = [
    {
      title: 'Email Notifications', items: [
        { key: 'email_security' as const, label: 'Security alerts', desc: 'Login attempts, password changes, suspicious activity' },
        { key: 'email_billing' as const, label: 'Billing & payments', desc: 'Invoices, plan changes, payment failures' },
        { key: 'email_updates' as const, label: 'Product updates', desc: 'New features, changelog, and release notes' },
        { key: 'email_newsletter' as const, label: 'Newsletter', desc: 'Monthly tips, tutorials, and industry insights' },
      ],
    },
    {
      title: 'Push Notifications', items: [
        { key: 'push_mentions' as const, label: 'Mentions & replies', desc: 'When someone mentions you or replies to your comment' },
        { key: 'push_comments' as const, label: 'Comments on your work', desc: 'Activity on projects and documents you own' },
      ],
    },
    {
      title: 'Digest', items: [
        { key: 'digest_weekly' as const, label: 'Weekly digest', desc: 'Summary of activity from the past 7 days' },
        { key: 'digest_monthly' as const, label: 'Monthly report', desc: 'Detailed usage analytics and team stats' },
      ],
    },
  ];

  return (
    <div>
      <SectionTitle title="Notifications" desc="Choose how and when you want to be notified." />
      <div className="space-y-8">
        {groups.map(group => (
          <div key={group.title}>
            <h3 style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
              {group.title}
            </h3>
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
              {group.items.map(item => (
                <FieldRow key={item.key} label={item.label} desc={item.desc}>
                  <Toggle on={settings[item.key]} onChange={() => toggle(item.key)} />
                </FieldRow>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Security Panel ──────────────────────────────────────── */
function SecurityPanel() {
  const [showPw, setShowPw] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [sessions] = useState([
    { device: 'Chrome on macOS', location: 'San Francisco, CA', lastSeen: 'Active now', current: true },
    { device: 'Safari on iPhone 15', location: 'San Francisco, CA', lastSeen: '2 hours ago', current: false },
    { device: 'Firefox on Windows', location: 'New York, NY', lastSeen: '5 days ago', current: false },
  ]);

  return (
    <div>
      <SectionTitle title="Security & Privacy" desc="Manage your password, two-factor authentication, and active sessions." />

      {/* Password */}
      <div className="mb-6">
        <h3 style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '12px' }}>Change Password</h3>
        <div className="space-y-3 max-w-sm">
          {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
            <div key={label}>
              <label className="block mb-1.5" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>{label}</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  className="w-full rounded border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
                  style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }} />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none" style={{ color: 'var(--ada-text-3)' }} aria-label={showPw ? 'Hide' : 'Show'}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}
          <button className="flex items-center gap-1.5 px-4 py-2 rounded mt-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: 'var(--ada-btn-primary-bg)', color: 'white' }}>
            Update Password
          </button>
        </div>
      </div>

      <div className="border-t my-6" style={{ borderColor: 'var(--ada-border-default)' }} />

      {/* 2FA */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>Two-Factor Authentication</h3>
            <p style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>Add an extra layer of security to your account using TOTP or SMS.</p>
          </div>
          <Toggle on={twoFA} onChange={() => setTwoFA(!twoFA)} />
        </div>
        {twoFA && (
          <div className="mt-3 flex items-center gap-2 p-3 rounded-lg border" style={{ backgroundColor: 'var(--ada-bg-success)', borderColor: 'var(--ada-border-success)' }}>
            <Check size={14} style={{ color: 'var(--ada-s-600)', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-success)' }}>2FA is enabled via authenticator app. Last verified 3 days ago.</span>
          </div>
        )}
      </div>

      <div className="border-t my-6" style={{ borderColor: 'var(--ada-border-default)' }} />

      {/* Active Sessions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Active Sessions</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-e-600)', borderColor: 'var(--ada-e-200)', backgroundColor: 'var(--ada-e-50)', fontWeight: 'var(--ada-fw-medium)' }}>
            <AlertTriangle size={12} /> Revoke all others
          </button>
        </div>
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 border-b last:border-0" style={{ borderColor: 'var(--ada-border-subtle)' }}>
              <div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}>{s.device}</span>
                  {s.current && <span className="px-1.5 py-0.5 rounded" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: 'var(--ada-s-100)', color: 'var(--ada-s-700)', fontWeight: 'var(--ada-fw-medium)' }}>Current</span>}
                </div>
                <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', marginTop: '2px' }}>{s.location} · {s.lastSeen}</div>
              </div>
              {!s.current && (
                <button className="px-3 py-1.5 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
                  style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-3)', fontWeight: 'var(--ada-fw-medium)' }}>
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── API Keys Panel ──────────────────────────────────────── */
function APIPanel() {
  const [showKey, setShowKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [keys] = useState([
    { id: 'key_1', name: 'Production API Key', key: 'ada_live_sk_4xTp9mQnR2vKz8wYbL3jHfCdE7uAsN1', created: 'Jan 12, 2026', lastUsed: '5 min ago', scope: 'Full access' },
    { id: 'key_2', name: 'CI/CD Pipeline Key', key: 'ada_live_sk_9kBn3wZqV6xMt1pR8cGdJ5sEeYrNaU4', created: 'Feb 8, 2026', lastUsed: '1 hour ago', scope: 'Read only' },
    { id: 'key_3', name: 'Development Key', key: 'ada_test_sk_2mPo7yWnX4vKs3qL8hRfBtCgDjEaNu5', created: 'Feb 20, 2026', lastUsed: 'Never', scope: 'Full access' },
  ]);

  const copy = (id: string, value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const mask = (key: string) => key.slice(0, 16) + '••••••••••••••••••••••••••••';

  return (
    <div>
      <SectionTitle title="API Keys" desc="Manage authentication keys for the Efficient Design System API. Keep your keys secure — never commit them to version control." />

      <div className="flex justify-end mb-4">
        <button className="flex items-center gap-1.5 px-3 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
          style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: 'var(--ada-btn-primary-bg)', color: 'white' }}>
          <Plus size={13} /> Generate New Key
        </button>
      </div>

      <div className="space-y-3">
        {keys.map(key => (
          <div key={key.id} className="p-4 rounded-lg border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '2px' }}>{key.name}</div>
                <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>Created {key.created} · Last used {key.lastUsed}</div>
              </div>
              <span className="px-2 py-0.5 rounded" style={{ fontSize: 'var(--ada-fs-xs)', backgroundColor: 'var(--ada-surface-3)', color: 'var(--ada-text-3)' }}>{key.scope}</span>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
                <code style={{ flex: 1, fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {showKey === key.id ? key.key : mask(key.key)}
                </code>
              </div>
              <button onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                className="p-2 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
                style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-3)' }}
                aria-label={showKey === key.id ? 'Hide key' : 'Show key'}>
                {showKey === key.id ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => copy(key.id, key.key)}
                className="p-2 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
                style={{ borderColor: copied === key.id ? 'var(--ada-s-300)' : 'var(--ada-border-default)', backgroundColor: copied === key.id ? 'var(--ada-s-50)' : 'var(--ada-surface-1)', color: copied === key.id ? 'var(--ada-s-600)' : 'var(--ada-text-3)' }}
                aria-label="Copy key">
                {copied === key.id ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <button className="p-2 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
                style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-e-500)' }}
                aria-label="Delete key">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg border" style={{ backgroundColor: 'var(--ada-bg-warning)', borderColor: 'var(--ada-border-warning)' }}>
        <div className="flex items-start gap-2">
          <AlertTriangle size={14} style={{ color: 'var(--ada-w-600)', flexShrink: 0, marginTop: '1px' }} />
          <p style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-warning)', lineHeight: 1.5 }}>
            API keys grant full access to your account. Treat them like passwords — store them securely in environment variables, never in source code.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Appearance Panel ────────────────────────────────────── */
function AppearancePanel() {
  const [density, setDensity] = useState('comfortable');
  const [font, setFont] = useState('inter');
  const [codeFont, setCodeFont] = useState('jetbrains');
  const [accentColor, setAccentColor] = useState('#2563eb');

  const accents = ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#d97706', '#0891b2'];

  return (
    <div>
      <SectionTitle title="Appearance" desc="Customize the visual density, fonts, and accent color of the interface." />

      <div className="space-y-0">
        <FieldRow label="UI Density" desc="How much space elements take up in the interface.">
          <div className="flex rounded border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
            {[{ v: 'compact', label: 'Compact' }, { v: 'comfortable', label: 'Comfortable' }, { v: 'spacious', label: 'Spacious' }].map(d => (
              <button key={d.v} onClick={() => setDensity(d.v)}
                className="px-3 py-1.5 focus:outline-none"
                style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: density === d.v ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)', backgroundColor: density === d.v ? 'var(--ada-p-600)' : 'var(--ada-surface-1)', color: density === d.v ? 'white' : 'var(--ada-text-3)', borderRight: d.v !== 'spacious' ? '1px solid var(--ada-border-default)' : 'none' }}>
                {d.label}
              </button>
            ))}
          </div>
        </FieldRow>

        <FieldRow label="UI Font" desc="The sans-serif font used for all interface text.">
          <div className="relative">
            <select value={font} onChange={e => setFont(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }}>
              <option value="inter">Inter (Default)</option>
              <option value="system">System UI</option>
              <option value="roboto">Roboto</option>
            </select>
            <ChevronRight size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" style={{ color: 'var(--ada-text-3)' }} />
          </div>
        </FieldRow>

        <FieldRow label="Code Font" desc="Monospace font for code editors and terminals.">
          <div className="relative">
            <select value={codeFont} onChange={e => setCodeFont(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-sm)', fontFamily: 'var(--ada-font-mono)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }}>
              <option value="jetbrains">JetBrains Mono</option>
              <option value="fira">Fira Code</option>
              <option value="cascadia">Cascadia Code</option>
              <option value="mono">System Mono</option>
            </select>
            <ChevronRight size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" style={{ color: 'var(--ada-text-3)' }} />
          </div>
        </FieldRow>

        <FieldRow label="Accent Color" desc="Primary brand color used for buttons, links, and highlights.">
          <div className="flex gap-2 items-center">
            {accents.map(c => (
              <button key={c} onClick={() => setAccentColor(c)}
                className="flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ width: 24, height: 24, backgroundColor: c, focusRingColor: c }}
                aria-label={c}>
                {accentColor === c && <Check size={12} color="white" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </FieldRow>
      </div>
    </div>
  );
}

/* ─── Panel Renderer ──────────────────────────────────────── */
function Panel({ id }: { id: string }) {
  if (id === 'profile') return <ProfilePanel />;
  if (id === 'notifications') return <NotificationsPanel />;
  if (id === 'security') return <SecurityPanel />;
  if (id === 'api') return <APIPanel />;
  if (id === 'appearance') return <AppearancePanel />;

  const placeholders: Record<string, { title: string; desc: string }> = {
    billing: { title: 'Billing & Plans', desc: 'Manage your subscription, invoices, and payment methods.' },
    integrations: { title: 'Integrations', desc: 'Connect third-party tools and services to your workspace.' },
    developer: { title: 'Developer', desc: 'Advanced settings for developers: CLI config, debug flags, API explorer.' },
  };
  const ph = placeholders[id] || { title: id, desc: 'This section is under construction.' };

  return (
    <div>
      <SectionTitle title={ph.title} desc={ph.desc} />
      <div className="flex flex-col items-center justify-center py-16 rounded-lg border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
        <div style={{ fontSize: 'var(--ada-fs-xl)', marginBottom: '8px' }}>🚧</div>
        <div style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>Coming soon</div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');

  return (
    <div className="flex" style={{ backgroundColor: 'var(--ada-bg-base)', minHeight: 'calc(100vh - 48px)' }}>
      {/* Sidebar */}
      <aside className="flex-shrink-0 border-r overflow-y-auto" style={{ width: 220, backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
        <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          <h1 style={{ fontSize: 'var(--ada-fs-base)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Settings</h1>
        </div>
        <nav className="py-2" aria-label="Settings navigation">
          {navGroups.map(group => (
            <div key={group.group} className="py-2">
              <div className="px-4 mb-1" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {group.group}
              </div>
              {group.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ada-focus-ring)] text-left"
                  style={{
                    fontSize: 'var(--ada-fs-sm)',
                    color: activeSection === item.id ? 'var(--ada-p-600)' : 'var(--ada-text-2)',
                    backgroundColor: activeSection === item.id ? 'var(--ada-p-50)' : 'transparent',
                    fontWeight: activeSection === item.id ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)',
                    borderLeft: `2px solid ${activeSection === item.id ? 'var(--ada-p-500)' : 'transparent'}`,
                  }}
                  onMouseEnter={e => { if (activeSection !== item.id) e.currentTarget.style.backgroundColor = 'var(--ada-btn-ghost-hover)'; }}
                  onMouseLeave={e => { if (activeSection !== item.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  <span style={{ color: activeSection === item.id ? 'var(--ada-p-600)' : 'var(--ada-text-4)' }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8" style={{ maxWidth: 720 }}>
        <Panel id={activeSection} />
      </main>
    </div>
  );
}