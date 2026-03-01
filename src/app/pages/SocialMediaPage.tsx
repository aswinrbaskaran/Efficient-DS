import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Calendar, Plus, Twitter, Instagram, Linkedin, Facebook,
  Heart, MessageCircle, Share2, Eye, TrendingUp, Clock,
  ChevronLeft, ChevronRight, Image, Type, Link, Send,
  MoreHorizontal, Search, Star,
} from 'lucide-react';

const engagementData = [
  { day: 'Mon', likes: 420, comments: 82, shares: 44 },
  { day: 'Tue', likes: 310, comments: 64, shares: 31 },
  { day: 'Wed', likes: 680, comments: 124, shares: 72 },
  { day: 'Thu', likes: 540, comments: 98, shares: 58 },
  { day: 'Fri', likes: 820, comments: 156, shares: 94 },
  { day: 'Sat', likes: 1040, comments: 201, shares: 120 },
  { day: 'Sun', likes: 760, comments: 142, shares: 88 },
];

const reachData = [
  { week: 'W1', reach: 12400 }, { week: 'W2', reach: 15800 },
  { week: 'W3', reach: 11200 }, { week: 'W4', reach: 18900 },
];

const platformColors: Record<string, string> = {
  Twitter: '#1d9bf0', Instagram: '#e1306c', LinkedIn: '#0a66c2', Facebook: '#1877f2',
};

const scheduledPosts = [
  { id: 'p1', content: 'Exciting announcement! Our Q1 2026 product update is live with 40+ new features designed for developer teams...', platforms: ['Twitter', 'LinkedIn'], time: 'Today 10:00 AM', img: true, status: 'scheduled' },
  { id: 'p2', content: 'Behind the scenes of our design system revamp. Swipe to see the before and after! #design #ux #developer', platforms: ['Instagram'], time: 'Today 2:00 PM', img: true, status: 'scheduled' },
  { id: 'p3', content: 'We\'re hiring! Looking for a senior frontend engineer who loves design systems and developer tooling. DM or link in bio →', platforms: ['Twitter', 'LinkedIn', 'Facebook'], time: 'Tomorrow 9:00 AM', img: false, status: 'draft' },
  { id: 'p4', content: 'Tip Tuesday: Use CSS custom properties for your design tokens to get free dark mode support!', platforms: ['Twitter'], time: 'Mar 4, 10:00 AM', img: false, status: 'scheduled' },
];

const inbox = [
  { from: '@devjane42', platform: 'Twitter', msg: 'Just tried your new API — incredibly smooth DX! 🔥', time: '5m ago', unread: true },
  { from: 'techcorp.official', platform: 'Instagram', msg: 'Love the design system showcase! Would love to collaborate', time: '22m ago', unread: true },
  { from: 'marcus_builds', platform: 'Twitter', msg: 'When is the CLI tool dropping? Been waiting all year', time: '1h ago', unread: false },
  { from: 'Sarah Lee', platform: 'LinkedIn', msg: 'Congrats on the launch! The WCAG compliance work is impressive', time: '3h ago', unread: false },
];

const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
const postsByDay: Record<number, string[]> = { 1: ['Twitter', 'LinkedIn'], 4: ['Instagram'], 7: ['Twitter'], 10: ['LinkedIn', 'Facebook'], 14: ['Twitter', 'Instagram'], 18: ['Twitter'], 21: ['LinkedIn'], 25: ['Twitter', 'Instagram', 'LinkedIn'] };

function PlatformIcon({ platform }: { platform: string }) {
  const icons: Record<string, React.ReactNode> = { Twitter: <Twitter size={11} />, Instagram: <Instagram size={11} />, LinkedIn: <Linkedin size={11} />, Facebook: <Facebook size={11} /> };
  return <span style={{ color: platformColors[platform] || 'var(--ada-text-3)' }}>{icons[platform]}</span>;
}

export function SocialMediaPage() {
  const [tab, setTab] = useState<'calendar' | 'scheduler' | 'analytics' | 'inbox'>('analytics');
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Twitter']);

  const togglePlatform = (p: string) => setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      {/* Header */}
      <div className="px-6 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
        <h1 style={{ fontSize: 'var(--ada-fs-xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Social Media Manager</h1>
        <div className="flex gap-1">
          {(['analytics', 'calendar', 'scheduler', 'inbox'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className="px-3 py-1.5 rounded capitalize" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: tab === t ? 'var(--ada-p-600)' : 'transparent', color: tab === t ? 'white' : 'var(--ada-text-2)' }}>{t}</button>
          ))}
        </div>
      </div>

      {tab === 'analytics' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Reach', value: '58.3K', delta: '+14%', icon: <Eye size={15} /> },
              { label: 'Engagements', value: '4,570', delta: '+22%', icon: <Heart size={15} /> },
              { label: 'Followers', value: '12,841', delta: '+340', icon: <TrendingUp size={15} /> },
              { label: 'Posts This Week', value: '14', delta: '+2', icon: <Send size={15} /> },
            ].map(k => (
              <div key={k.label} className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 'var(--ada-fw-medium)' }}>{k.label}</span>
                  <span style={{ color: 'var(--ada-text-4)' }}>{k.icon}</span>
                </div>
                <div style={{ fontSize: 'var(--ada-fs-3xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', letterSpacing: '-0.02em' }}>{k.value}</div>
                <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-success)', marginTop: '2px' }}>{k.delta} vs last week</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
              <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
                <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Engagement Breakdown — This Week</span>
              </div>
              <div className="p-5">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={engagementData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--ada-border-subtle)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--ada-text-3)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--ada-text-3)' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--ada-surface-1)', border: '1px solid var(--ada-border-default)', borderRadius: 6, fontSize: 12 }} />
                    <Bar dataKey="likes" fill="var(--ada-p-400)" radius={[2, 2, 0, 0]} stackId="a" name="Likes" />
                    <Bar dataKey="comments" fill="var(--ada-s-400)" radius={[0, 0, 0, 0]} stackId="a" name="Comments" />
                    <Bar dataKey="shares" fill="var(--ada-w-400)" radius={[2, 2, 0, 0]} stackId="a" name="Shares" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
              <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
                <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Top Posts</span>
              </div>
              <div className="divide-y" style={{ '--tw-divide-color': 'var(--ada-border-subtle)' } as any}>
                {scheduledPosts.slice(0, 3).map(p => (
                  <div key={p.id} className="px-5 py-4">
                    <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.content}</div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {p.platforms.map(pl => <PlatformIcon key={pl} platform={pl} />)}
                      </div>
                      <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>{p.time}</span>
                      <div className="ml-auto flex items-center gap-3" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>
                        <span className="flex items-center gap-1"><Heart size={11} />{(Math.random() * 500 + 100).toFixed(0)}</span>
                        <span className="flex items-center gap-1"><MessageCircle size={11} />{(Math.random() * 80 + 10).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'calendar' && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
              <div className="flex items-center gap-3">
                <button style={{ color: 'var(--ada-text-3)' }}><ChevronLeft size={16} /></button>
                <h2 style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>March 2026</h2>
                <button style={{ color: 'var(--ada-text-3)' }}><ChevronRight size={16} /></button>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded" style={{ backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)', fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)' }}>
                <Plus size={13} /> Schedule Post
              </button>
            </div>
            <div>
              <div className="grid grid-cols-7 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="px-3 py-2 text-center border-r last:border-r-0" style={{ borderColor: 'var(--ada-border-subtle)', fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-3)' }}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {[...Array(6)].map((_, r) => [0, 1, 2, 3, 4, 5, 6].map(c => {
                  const day = r * 7 + c - 5;
                  const posts = postsByDay[day] || [];
                  const isToday = day === 1;
                  return (
                    <div key={`${r}-${c}`} className="min-h-20 p-2 border-r border-b last:border-r-0" style={{ borderColor: 'var(--ada-border-subtle)' }}>
                      {day > 0 && day <= 31 && (
                        <>
                          <div className="flex items-center justify-center w-6 h-6 rounded-full mb-1" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: isToday ? 'var(--ada-fw-semibold)' : undefined, backgroundColor: isToday ? 'var(--ada-p-600)' : 'transparent', color: isToday ? 'white' : 'var(--ada-text-2)' }}>{day}</div>
                          {posts.length > 0 && (
                            <div className="space-y-0.5">
                              {posts.map(pl => (
                                <div key={pl} className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: `${platformColors[pl]}22`, fontSize: '9px', color: platformColors[pl] }}>
                                  <PlatformIcon platform={pl} />{pl}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                }))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'scheduler' && (
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <h2 style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Compose New Post</h2>
            <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
              <textarea value={postContent} onChange={e => setPostContent(e.target.value)} placeholder="What's on your mind?" rows={5} className="w-full resize-none px-5 py-4" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)', fontFamily: 'inherit' }} />
              <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--ada-border-default)' }}>
                <div className="flex items-center gap-2">
                  {[<Image size={15} />, <Link size={15} />].map((icon, i) => (
                    <button key={i} className="p-1.5 rounded" style={{ color: 'var(--ada-text-3)' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>{icon}</button>
                  ))}
                </div>
                <span style={{ fontSize: 'var(--ada-fs-xs)', color: postContent.length > 250 ? 'var(--ada-text-error)' : 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)' }}>{postContent.length}/280</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)', marginBottom: '8px' }}>Publish to</div>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(platformColors).map(([platform, color]) => (
                  <button key={platform} onClick={() => togglePlatform(platform)} className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{
                    fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)',
                    backgroundColor: selectedPlatforms.includes(platform) ? `${color}18` : 'var(--ada-surface-1)',
                    borderColor: selectedPlatforms.includes(platform) ? color : 'var(--ada-border-default)',
                    color: selectedPlatforms.includes(platform) ? color : 'var(--ada-text-2)',
                  }}>
                    <PlatformIcon platform={platform} />{platform}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)', marginBottom: '8px' }}>Schedule Time</div>
              <input type="datetime-local" className="px-3 py-2 rounded border" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-1)', backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', outline: 'none' }} />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded" style={{ backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)', fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)' }}>
                <Clock size={14} /> Schedule Post
              </button>
              <button className="px-4 py-2 rounded border" style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-2)', backgroundColor: 'var(--ada-surface-1)' }}>Save as Draft</button>
            </div>
          </div>
          <div className="w-72 border-l flex flex-col overflow-y-auto" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
              <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Scheduled ({scheduledPosts.length})</span>
            </div>
            <div className="flex-1 divide-y" style={{ '--tw-divide-color': 'var(--ada-border-subtle)' } as any}>
              {scheduledPosts.map(p => (
                <div key={p.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{p.content}</p>
                    <button style={{ color: 'var(--ada-text-4)', flexShrink: 0 }}><MoreHorizontal size={13} /></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">{p.platforms.map(pl => <PlatformIcon key={pl} platform={pl} />)}</div>
                    <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>{p.time}</span>
                    <span className="ml-auto px-1.5 py-0.5 rounded-full" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: p.status === 'scheduled' ? 'var(--ada-bg-success)' : 'var(--ada-bg-muted)', color: p.status === 'scheduled' ? 'var(--ada-text-success)' : 'var(--ada-text-3)' }}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'inbox' && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
                <Search size={13} style={{ color: 'var(--ada-text-3)' }} />
                <input placeholder="Search messages…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)', flex: 1 }} />
              </div>
            </div>
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
              {inbox.map((m, i) => (
                <div key={i} className="flex items-start gap-3 p-4 border-b last:border-b-0 cursor-pointer" style={{ borderColor: 'var(--ada-border-subtle)', backgroundColor: m.unread ? 'var(--ada-p-50)' : 'var(--ada-surface-1)' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = m.unread ? 'var(--ada-p-50)' : 'var(--ada-surface-1)')}>
                  <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${platformColors[m.platform]}20`, color: platformColors[m.platform], fontWeight: 'bold', fontSize: 'var(--ada-fs-xs)' }}>
                    {m.from.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{m.from}</span>
                      <PlatformIcon platform={m.platform} />
                      <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)', marginLeft: 'auto' }}>{m.time}</span>
                    </div>
                    <p style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.msg}</p>
                  </div>
                  {m.unread && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: 'var(--ada-p-600)' }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
