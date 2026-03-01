import { useState } from 'react';
import {
  Search, ChevronRight, ChevronDown, FileText, Plus, Clock,
  Edit, Eye, RotateCcw, Tag, Users, Star, BookOpen,
  Save, MoreHorizontal, Hash, Bold, Italic, List, Link, Code, Heading,
} from 'lucide-react';

const categories = [
  {
    id: 'getting-started', label: 'Getting Started', count: 12,
    articles: ['Quick Start Guide', 'Installation', 'Configuration Basics', 'Your First Project'],
  },
  {
    id: 'api', label: 'API Reference', count: 48,
    articles: ['Authentication', 'REST Endpoints', 'Webhooks', 'Rate Limiting'],
  },
  {
    id: 'guides', label: 'How-to Guides', count: 31,
    articles: ['Deploying to Production', 'Custom Integrations', 'Team Management'],
  },
  {
    id: 'troubleshoot', label: 'Troubleshooting', count: 17,
    articles: ['Common Errors', 'Debug Mode', 'Support Contacts'],
  },
];

const revisions = [
  { version: 'v14', author: 'Sarah Chen', time: '2 hours ago', note: 'Updated rate limit examples' },
  { version: 'v13', author: 'Marcus Reed', time: '1 day ago', note: 'Added webhook payload schema' },
  { version: 'v12', author: 'Sarah Chen', time: '3 days ago', note: 'Fixed broken code snippet' },
  { version: 'v11', author: 'Priya Patel', time: '1 week ago', note: 'Initial draft published' },
];

const editorContent = `## Authentication

All API requests require a valid Bearer token in the Authorization header.

\`\`\`bash
curl https://api.yourapp.com/v1/users \\
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

### Token Expiry

Access tokens expire after **24 hours**. Use the refresh endpoint to obtain a new token without requiring the user to log in again.

### Error Responses

| Code | Message | Resolution |
|------|---------|------------|
| 401  | Unauthorized | Check your Bearer token |
| 403  | Forbidden | Insufficient permissions |
| 429  | Too Many Requests | Implement exponential backoff |`;

export function KnowledgeBasePage() {
  const [expandedCat, setExpandedCat] = useState<string[]>(['api']);
  const [selectedArticle, setSelectedArticle] = useState('Authentication');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [search, setSearch] = useState('');
  const [content, setContent] = useState(editorContent);
  const [showRevisions, setShowRevisions] = useState(true);

  const toggleCat = (id: string) => setExpandedCat(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="flex h-full" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      {/* Left: Category Nav */}
      <div className="w-56 border-r flex flex-col flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
        <div className="p-3 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          <div className="flex items-center gap-2 px-2.5 py-2 rounded border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
            <Search size={13} style={{ color: 'var(--ada-text-3)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search docs…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-1)', flex: 1 }} />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {categories.map(cat => (
            <div key={cat.id} className="mb-1">
              <button onClick={() => toggleCat(cat.id)} className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-left" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-3)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                {expandedCat.includes(cat.id) ? <ChevronDown size={12} style={{ color: 'var(--ada-text-3)' }} /> : <ChevronRight size={12} style={{ color: 'var(--ada-text-3)' }} />}
                <BookOpen size={12} style={{ color: 'var(--ada-text-3)' }} />
                <span className="flex-1">{cat.label}</span>
                <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>{cat.count}</span>
              </button>
              {expandedCat.includes(cat.id) && (
                <div className="ml-4 border-l pl-2 mt-0.5 space-y-0.5" style={{ borderColor: 'var(--ada-border-default)' }}>
                  {cat.articles.map(a => (
                    <button key={a} onClick={() => setSelectedArticle(a)} className="w-full text-left px-2 py-1 rounded" style={{
                      fontSize: 'var(--ada-fs-xs)',
                      color: selectedArticle === a ? 'var(--ada-p-600)' : 'var(--ada-text-3)',
                      backgroundColor: selectedArticle === a ? 'var(--ada-p-50)' : 'transparent',
                      fontWeight: selectedArticle === a ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)',
                    }}
                      onMouseEnter={e => { if (selectedArticle !== a) e.currentTarget.style.backgroundColor = 'var(--ada-surface-3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = selectedArticle === a ? 'var(--ada-p-50)' : 'transparent'; }}>
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded mt-2" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', border: '1px dashed var(--ada-border-strong)' }}>
            <Plus size={12} /> New Article
          </button>
        </nav>
      </div>

      {/* Center: Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor Toolbar */}
        <div className="px-5 py-2 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {(['edit', 'preview'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)} className="px-3 py-1 rounded capitalize" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: mode === m ? 'var(--ada-p-600)' : 'transparent', color: mode === m ? 'white' : 'var(--ada-text-2)' }}>{m}</button>
              ))}
            </div>
            {mode === 'edit' && (
              <div className="flex items-center gap-0.5 ml-2 border-l pl-2" style={{ borderColor: 'var(--ada-border-default)' }}>
                {[<Bold size={13} />, <Italic size={13} />, <Heading size={13} />, <List size={13} />, <Link size={13} />, <Code size={13} />].map((icon, i) => (
                  <button key={i} className="p-1.5 rounded" style={{ color: 'var(--ada-text-3)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    {icon}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)' }}>{content.length} chars</span>
            <button onClick={() => setShowRevisions(!showRevisions)} className="flex items-center gap-1 px-2.5 py-1 rounded border" style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-2)', backgroundColor: 'var(--ada-surface-1)' }}>
              <RotateCcw size={12} /> History
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)' }}>
              <Save size={12} /> Save
            </button>
          </div>
        </div>

        {/* Article Header */}
        <div className="px-8 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--ada-border-subtle)' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>API Reference</span>
              <ChevronRight size={12} style={{ color: 'var(--ada-text-4)' }} />
              <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>{selectedArticle}</span>
            </div>
            <h1 style={{ fontSize: 'var(--ada-fs-2xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{selectedArticle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>
              <Clock size={12} /> Updated 2h ago
            </div>
            <div className="flex items-center gap-1" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>
              <Eye size={12} /> 1,240 views
            </div>
            <button style={{ color: 'var(--ada-text-3)' }}><MoreHorizontal size={14} /></button>
          </div>
        </div>

        {/* Editor / Preview */}
        <div className="flex-1 overflow-y-auto">
          {mode === 'edit' ? (
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full h-full px-8 py-6 resize-none"
              style={{
                background: 'var(--ada-surface-1)',
                border: 'none',
                outline: 'none',
                fontSize: 'var(--ada-fs-sm)',
                fontFamily: 'var(--ada-font-mono)',
                color: 'var(--ada-text-1)',
                lineHeight: 1.8,
                minHeight: '400px',
              }}
            />
          ) : (
            <div className="px-8 py-6" style={{ backgroundColor: 'var(--ada-surface-1)' }}>
              {content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: 'var(--ada-fs-2xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '12px', marginTop: '24px' }}>{line.slice(3)}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: 'var(--ada-fs-lg)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '8px', marginTop: '20px' }}>{line.slice(4)}</h3>;
                if (line.startsWith('```')) return null;
                if (line.startsWith('|')) return <div key={i} style={{ fontFamily: 'var(--ada-font-mono)', fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)', borderBottom: '1px solid var(--ada-border-subtle)', padding: '4px 0' }}>{line}</div>;
                if (line === '') return <div key={i} style={{ marginBottom: '8px' }} />;
                return <p key={i} style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)', lineHeight: 1.7, marginBottom: '8px' }}>{line.replace(/\*\*/g, '')}</p>;
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right: Revision History */}
      {showRevisions && (
        <div className="w-60 border-l flex flex-col flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--ada-border-default)' }}>
            <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Revisions</span>
            <button onClick={() => setShowRevisions(false)} style={{ color: 'var(--ada-text-3)' }}><X size={13} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {revisions.map((rev, i) => (
              <div key={rev.version} className="p-3 rounded-md border cursor-pointer" style={{ backgroundColor: i === 0 ? 'var(--ada-p-50)' : 'var(--ada-surface-1)', borderColor: i === 0 ? 'var(--ada-p-300)' : 'var(--ada-border-default)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: i === 0 ? 'var(--ada-p-600)' : 'var(--ada-text-2)', fontFamily: 'var(--ada-font-mono)' }}>{rev.version}</span>
                  {i === 0 && <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: 'var(--ada-p-100)', color: 'var(--ada-p-600)', fontWeight: 'var(--ada-fw-medium)' }}>Current</span>}
                </div>
                <p style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', marginBottom: '4px' }}>{rev.note}</p>
                <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>{rev.author} · {rev.time}</div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t" style={{ borderColor: 'var(--ada-border-default)' }}>
            <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded border" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', borderColor: 'var(--ada-border-default)' }}>
              <RotateCcw size={12} /> View All Versions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function X({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  );
}
