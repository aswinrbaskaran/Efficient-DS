import { useState } from 'react';
import {
  Folder, FolderOpen, File, FileText, FileImage, FileCode,
  ChevronRight, ChevronDown, Search, Grid, List, Upload,
  Download, Trash2, MoreHorizontal, Eye, Share, Move,
  Check, Star, Clock, User, HardDrive, ArrowLeft,
} from 'lucide-react';

const tree = [
  {
    id: 'root', name: 'Company Drive', open: true,
    children: [
      { id: 'design', name: 'Design Assets', open: true, children: [
        { id: 'logos', name: 'Logos', open: false, children: [] },
        { id: 'icons', name: 'Icon Library', open: false, children: [] },
        { id: 'mockups', name: 'UI Mockups', open: false, children: [] },
      ]},
      { id: 'engineering', name: 'Engineering', open: false, children: [
        { id: 'docs', name: 'Documentation', open: false, children: [] },
        { id: 'specs', name: 'API Specs', open: false, children: [] },
      ]},
      { id: 'marketing', name: 'Marketing', open: false, children: [
        { id: 'campaigns', name: 'Campaigns', open: false, children: [] },
      ]},
      { id: 'legal', name: 'Legal & Compliance', open: false, children: [] },
    ],
  },
];

type FileItem = {
  id: string; name: string; type: 'folder' | 'image' | 'pdf' | 'code' | 'doc' | 'video';
  size: string; modified: string; owner: string; starred: boolean;
};

const files: FileItem[] = [
  { id: 'f1', name: 'brand-guidelines-v4.pdf', type: 'pdf', size: '4.2 MB', modified: '1h ago', owner: 'Sarah Chen', starred: true },
  { id: 'f2', name: 'logo-primary-2026.svg', type: 'image', size: '48 KB', modified: '2d ago', owner: 'Priya Patel', starred: false },
  { id: 'f3', name: 'design-system-tokens.json', type: 'code', size: '12 KB', modified: '3d ago', owner: 'Priya Patel', starred: true },
  { id: 'f4', name: 'component-library-v2.fig', type: 'image', size: '84 MB', modified: '1w ago', owner: 'Priya Patel', starred: false },
  { id: 'f5', name: 'icon-set-outline.zip', type: 'doc', size: '2.1 MB', modified: '2w ago', owner: 'Marcus Reed', starred: false },
  { id: 'f6', name: 'landing-page-mockup.png', type: 'image', size: '3.4 MB', modified: '3w ago', owner: 'Sarah Chen', starred: false },
  { id: 'f7', name: 'color-palette-2026.pdf', type: 'pdf', size: '820 KB', modified: '1mo ago', owner: 'Priya Patel', starred: false },
  { id: 'f8', name: 'typography-samples.pdf', type: 'pdf', size: '1.1 MB', modified: '1mo ago', owner: 'Sarah Chen', starred: false },
];

const fileIconConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  folder: { icon: <Folder size={20} />, color: 'var(--ada-w-500)' },
  image: { icon: <FileImage size={20} />, color: 'var(--ada-p-500)' },
  pdf: { icon: <FileText size={20} />, color: 'var(--ada-e-500)' },
  code: { icon: <FileCode size={20} />, color: 'var(--ada-s-500)' },
  doc: { icon: <File size={20} />, color: 'var(--ada-i-500)' },
  video: { icon: <File size={20} />, color: '#9333ea' },
};

function TreeNode({ node, depth, selected, onSelect }: { node: any; depth: number; selected: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(node.open);
  const hasChildren = node.children && node.children.length > 0;
  return (
    <div>
      <button onClick={() => { setOpen(!open); onSelect(node.id); }} className="w-full flex items-center gap-1.5 py-1.5 px-2 rounded text-left" style={{
        paddingLeft: `${8 + depth * 12}px`,
        backgroundColor: selected === node.id ? 'var(--ada-p-50)' : 'transparent',
        color: selected === node.id ? 'var(--ada-p-600)' : 'var(--ada-text-2)',
        fontSize: 'var(--ada-fs-xs)',
      }}
        onMouseEnter={e => { if (selected !== node.id) e.currentTarget.style.backgroundColor = 'var(--ada-surface-3)'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = selected === node.id ? 'var(--ada-p-50)' : 'transparent'; }}>
        <span style={{ color: 'var(--ada-text-4)', flexShrink: 0 }}>{hasChildren ? (open ? <ChevronDown size={12} /> : <ChevronRight size={12} />) : <span className="w-3 h-3" />}</span>
        <span style={{ color: 'var(--ada-w-400)', flexShrink: 0 }}>{open && hasChildren ? <FolderOpen size={13} /> : <Folder size={13} />}</span>
        <span className="truncate">{node.name}</span>
      </button>
      {open && hasChildren && node.children.map((child: any) => (
        <TreeNode key={child.id} node={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
      ))}
    </div>
  );
}

export function FileManagerPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<string[]>([]);
  const [preview, setPreview] = useState<FileItem | null>(null);
  const [treeSelected, setTreeSelected] = useState('design');
  const [search, setSearch] = useState('');

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-full" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      {/* Folder Tree */}
      <div className="w-52 border-r flex flex-col flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
        <div className="px-3 py-2.5 border-b flex items-center gap-2" style={{ borderColor: 'var(--ada-border-default)' }}>
          <HardDrive size={13} style={{ color: 'var(--ada-text-3)' }} />
          <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Company Drive</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {tree[0].children.map((node: any) => (
            <TreeNode key={node.id} node={node} depth={0} selected={treeSelected} onSelect={setTreeSelected} />
          ))}
          <div className="mt-3 pt-3 border-t space-y-0.5" style={{ borderColor: 'var(--ada-border-default)' }}>
            {[{ icon: <Star size={13} />, label: 'Starred' }, { icon: <Clock size={13} />, label: 'Recent' }, { icon: <Trash2 size={13} />, label: 'Trash' }].map(item => (
              <button key={item.label} className="w-full flex items-center gap-2 px-2 py-1.5 rounded" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-3)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                {item.icon}{item.label}
              </button>
            ))}
          </div>
          <div className="mt-3 p-2 rounded-lg border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
            <div className="flex justify-between mb-1">
              <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)' }}>Storage</span>
              <span style={{ fontSize: 'var(--ada-fs-2xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-3)' }}>84/100 GB</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-3)' }}>
              <div className="h-full rounded-full" style={{ width: '84%', backgroundColor: 'var(--ada-p-500)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="px-4 py-2.5 border-b flex items-center gap-3 flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
          <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--ada-text-3)', fontSize: 'var(--ada-fs-xs)' }}>
            <span>Drive</span><ChevronRight size={12} /><span>Design Assets</span>
          </div>
          <div className="flex-1 flex items-center gap-2 max-w-xs ml-4">
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
              <Search size={13} style={{ color: 'var(--ada-text-3)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-1)', flex: 1 }} />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {selected.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-p-50)', color: 'var(--ada-p-600)', fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)' }}>
                {selected.length} selected
                <button onClick={() => setSelected([])} style={{ color: 'var(--ada-p-400)' }}><span>×</span></button>
              </div>
            )}
            {selected.length > 0 && [<Download size={14} />, <Move size={14} />, <Trash2 size={14} />].map((icon, i) => (
              <button key={i} className="p-1.5 rounded border" style={{ borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-2)', backgroundColor: 'var(--ada-surface-1)' }}>{icon}</button>
            ))}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded" style={{ backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)', fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)' }}>
              <Upload size={13} /> Upload
            </button>
            <div className="flex rounded border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
              {([['grid', <Grid size={14} />], ['list', <List size={14} />]] as const).map(([mode, icon]) => (
                <button key={mode} onClick={() => setViewMode(mode as 'grid' | 'list')} className="p-1.5" style={{ backgroundColor: viewMode === mode ? 'var(--ada-p-600)' : 'var(--ada-surface-1)', color: viewMode === mode ? 'white' : 'var(--ada-text-3)' }}>{icon}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Files */}
        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-4 gap-3">
              {filtered.map(file => {
                const cfg = fileIconConfig[file.type];
                const isSelected = selected.includes(file.id);
                return (
                  <div key={file.id} onClick={() => { toggleSelect(file.id); setPreview(file); }} className="rounded-lg border p-4 cursor-pointer group relative transition-all" style={{
                    backgroundColor: isSelected ? 'var(--ada-p-50)' : 'var(--ada-surface-1)',
                    borderColor: isSelected ? 'var(--ada-p-400)' : 'var(--ada-border-default)',
                  }}>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--ada-p-600)' }}>
                        <Check size={10} style={{ color: 'white' }} />
                      </div>
                    )}
                    <div className="flex items-center justify-center h-12 mb-3" style={{ color: cfg.color }}>{cfg.icon}</div>
                    <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>{file.name}</div>
                    <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)', textAlign: 'center', marginTop: '2px' }}>{file.size}</div>
                    {file.starred && <Star size={11} style={{ color: 'var(--ada-w-400)', fill: 'var(--ada-w-400)', position: 'absolute', top: 8, left: 8 }} />}
                  </div>
                );
              })}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ada-fs-xs)' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--ada-surface-2)', borderBottom: '1px solid var(--ada-border-default)', borderRadius: '8px' }}>
                  {['', 'Name', 'Size', 'Modified', 'Owner', ''].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(file => {
                  const cfg = fileIconConfig[file.type];
                  const isSelected = selected.includes(file.id);
                  return (
                    <tr key={file.id} onClick={() => { toggleSelect(file.id); setPreview(file); }} style={{ borderBottom: '1px solid var(--ada-border-subtle)', cursor: 'pointer', backgroundColor: isSelected ? 'var(--ada-p-50)' : 'transparent' }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = isSelected ? 'var(--ada-p-50)' : 'transparent'; }}>
                      <td style={{ padding: '8px 12px', width: 32 }}>
                        <div className="w-4 h-4 rounded border flex items-center justify-center" style={{ borderColor: isSelected ? 'var(--ada-p-600)' : 'var(--ada-border-strong)', backgroundColor: isSelected ? 'var(--ada-p-600)' : 'transparent' }}>
                          {isSelected && <Check size={10} style={{ color: 'white' }} />}
                        </div>
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <div className="flex items-center gap-2">
                          <span style={{ color: cfg.color, flexShrink: 0 }}><File size={14} /></span>
                          <span style={{ fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}>{file.name}</span>
                          {file.starred && <Star size={11} style={{ color: 'var(--ada-w-400)', fill: 'var(--ada-w-400)' }} />}
                        </div>
                      </td>
                      <td style={{ padding: '8px 12px', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-3)' }}>{file.size}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--ada-text-3)' }}>{file.modified}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--ada-text-3)' }}>{file.owner}</td>
                      <td style={{ padding: '8px 12px' }}><button style={{ color: 'var(--ada-text-3)' }}><MoreHorizontal size={14} /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Preview Panel */}
      {preview && (
        <div className="w-64 border-l flex flex-col flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--ada-border-default)' }}>
            <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Preview</span>
            <button onClick={() => setPreview(null)} style={{ color: 'var(--ada-text-3)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-center h-32 rounded-lg border mb-4" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-3)', color: fileIconConfig[preview.type].color }}>
              <div style={{ transform: 'scale(2.5)' }}>{fileIconConfig[preview.type].icon}</div>
            </div>
            <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', wordBreak: 'break-all', marginBottom: '12px' }}>{preview.name}</div>
            {[
              { label: 'Type', value: preview.type.toUpperCase() },
              { label: 'Size', value: preview.size },
              { label: 'Modified', value: preview.modified },
              { label: 'Owner', value: preview.owner },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--ada-border-subtle)' }}>
                <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{f.label}</span>
                <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)', fontWeight: 'var(--ada-fw-medium)' }}>{f.value}</span>
              </div>
            ))}
            <div className="flex flex-col gap-2 mt-4">
              {[{ icon: <Download size={13} />, label: 'Download' }, { icon: <Share size={13} />, label: 'Share Link' }, { icon: <Eye size={13} />, label: 'Open' }].map(a => (
                <button key={a.label} className="flex items-center gap-2 px-3 py-2 rounded border" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
                  {a.icon}{a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
