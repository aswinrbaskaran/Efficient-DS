import { useState } from 'react';
import {
  Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye,
  ChevronDown, X, Check, AlertCircle, Upload, ChevronLeft, ChevronRight,
  ArrowUpDown, ArrowUp, ArrowDown, Package, Users, DollarSign, Activity
} from 'lucide-react';

/* ─── Data ────────────────────────────────────────────────── */
type Product = {
  id: string; name: string; category: string; sku: string;
  price: number; stock: number; status: 'Active' | 'Draft' | 'Archived';
  sales: number; created: string;
};

const initialProducts: Product[] = [
  { id: 'PRD-001', name: 'Enterprise API Suite', category: 'Software', sku: 'API-ENT-001', price: 2400, stock: 999, status: 'Active', sales: 142, created: 'Jan 12, 2026' },
  { id: 'PRD-002', name: 'Pro Developer License', category: 'License', sku: 'LIC-PRO-001', price: 149, stock: 999, status: 'Active', sales: 891, created: 'Jan 8, 2026' },
  { id: 'PRD-003', name: 'Starter Workspace', category: 'Software', sku: 'WRK-STR-001', price: 29, stock: 999, status: 'Active', sales: 2341, created: 'Dec 15, 2025' },
  { id: 'PRD-004', name: 'CLI Toolchain Bundle', category: 'Tool', sku: 'CLI-BDL-001', price: 79, stock: 45, status: 'Draft', sales: 0, created: 'Feb 20, 2026' },
  { id: 'PRD-005', name: 'Legacy SDK v2', category: 'Software', sku: 'SDK-LEG-002', price: 99, stock: 12, status: 'Archived', sales: 418, created: 'Mar 1, 2025' },
  { id: 'PRD-006', name: 'Monitoring Dashboard', category: 'Software', sku: 'MON-DSH-001', price: 199, stock: 999, status: 'Active', sales: 267, created: 'Feb 1, 2026' },
  { id: 'PRD-007', name: 'Custom Webhook Service', category: 'Service', sku: 'SVC-WHK-001', price: 499, stock: 50, status: 'Active', sales: 89, created: 'Jan 28, 2026' },
];

const categories = ['All', 'Software', 'License', 'Tool', 'Service'];
const statuses = ['All', 'Active', 'Draft', 'Archived'];

/* ─── Helpers ─────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; text: string }> = {
    Active:   { bg: 'var(--ada-s-100)', text: 'var(--ada-s-700)' },
    Draft:    { bg: 'var(--ada-w-100)', text: 'var(--ada-w-700)' },
    Archived: { bg: 'var(--ada-surface-3)', text: 'var(--ada-text-3)' },
  };
  const c = cfg[status] || cfg['Draft'];
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

/* ─── Modal ───────────────────────────────────────────────── */
function ProductModal({ mode, product, onClose, onSave }: {
  mode: 'create' | 'edit';
  product?: Product;
  onClose: () => void;
  onSave: (p: Partial<Product>) => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    category: product?.category || 'Software',
    sku: product?.sku || '',
    price: product?.price?.toString() || '',
    stock: product?.stock?.toString() || '',
    status: product?.status || 'Draft',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.sku.trim()) e.sku = 'SKU is required';
    if (!form.price || isNaN(Number(form.price))) e.price = 'Valid price required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, price: Number(form.price), stock: Number(form.stock) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-lg rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-modal)' }} role="dialog" aria-modal="true" aria-label={mode === 'create' ? 'Create product' : 'Edit product'}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          <h2 style={{ fontSize: 'var(--ada-fs-base)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>
            {mode === 'create' ? 'Add Product' : 'Edit Product'}
          </h2>
          <button onClick={onClose} className="p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ color: 'var(--ada-text-3)' }} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div className="col-span-2">
              <label className="block mb-1.5" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>
                Product Name <span style={{ color: 'var(--ada-e-500)' }}>*</span>
              </label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Enter product name"
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
                style={{ fontSize: 'var(--ada-fs-sm)', borderColor: errors.name ? 'var(--ada-e-500)' : 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }}
              />
              {errors.name && <p style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-error)', marginTop: '4px' }}>{errors.name}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block mb-1.5" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Category</label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full appearance-none rounded border px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
                  style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }}
                >
                  {categories.slice(1).map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--ada-text-3)' }} />
              </div>
            </div>

            {/* SKU */}
            <div>
              <label className="block mb-1.5" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>
                SKU <span style={{ color: 'var(--ada-e-500)' }}>*</span>
              </label>
              <input
                value={form.sku}
                onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                placeholder="ABC-XYZ-001"
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
                style={{ fontSize: 'var(--ada-fs-sm)', fontFamily: 'var(--ada-font-mono)', borderColor: errors.sku ? 'var(--ada-e-500)' : 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }}
              />
              {errors.sku && <p style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-error)', marginTop: '4px' }}>{errors.sku}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block mb-1.5" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>
                Price (USD) <span style={{ color: 'var(--ada-e-500)' }}>*</span>
              </label>
              <div className="flex rounded border overflow-hidden" style={{ borderColor: errors.price ? 'var(--ada-e-500)' : 'var(--ada-border-default)' }}>
                <div className="flex items-center px-2.5" style={{ backgroundColor: 'var(--ada-surface-2)', borderRight: '1px solid var(--ada-border-default)', fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>$</div>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="0.00"
                  className="flex-1 px-3 py-2 focus:outline-none"
                  style={{ fontSize: 'var(--ada-fs-sm)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }}
                />
              </div>
              {errors.price && <p style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-error)', marginTop: '4px' }}>{errors.price}</p>}
            </div>

            {/* Stock */}
            <div>
              <label className="block mb-1.5" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Stock Quantity</label>
              <input
                type="number"
                value={form.stock}
                onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                placeholder="999"
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
                style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }}
              />
            </div>

            {/* Status */}
            <div className="col-span-2">
              <label className="block mb-2" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Status</label>
              <div className="flex gap-2">
                {(['Active', 'Draft', 'Archived'] as const).map(s => (
                  <label key={s} className="flex items-center gap-2 px-3 py-2 rounded border cursor-pointer" style={{ borderColor: form.status === s ? 'var(--ada-p-400)' : 'var(--ada-border-default)', backgroundColor: form.status === s ? 'var(--ada-p-50)' : 'var(--ada-surface-1)' }}>
                    <div className="flex items-center justify-center rounded-full" style={{ width: 14, height: 14, border: `2px solid ${form.status === s ? 'var(--ada-p-600)' : 'var(--ada-border-strong)'}`, backgroundColor: 'var(--ada-surface-1)' }}>
                      {form.status === s && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--ada-p-600)' }} />}
                    </div>
                    <input type="radio" name="status" value={s} checked={form.status === s} onChange={() => setForm(f => ({ ...f, status: s }))} className="sr-only" />
                    <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: form.status === s ? 'var(--ada-p-700)' : 'var(--ada-text-2)' }}>{s}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
          <button onClick={onClose} className="px-4 py-2 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-2)', fontWeight: 'var(--ada-fw-medium)' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex items-center gap-1.5 px-4 py-2 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-sm)', backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)', fontWeight: 'var(--ada-fw-medium)' }}>
            <Check size={14} />
            {mode === 'create' ? 'Create Product' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Confirm ──────────────────────────────────────── */
function DeleteConfirm({ name, onClose, onConfirm }: { name: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="w-full max-w-sm rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-modal)' }} role="alertdialog" aria-modal="true">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full" style={{ backgroundColor: 'var(--ada-e-100)' }}>
              <AlertCircle size={18} style={{ color: 'var(--ada-e-600)' }} />
            </div>
            <h2 style={{ fontSize: 'var(--ada-fs-base)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Delete Product</h2>
          </div>
          <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)', lineHeight: 1.5 }}>
            Are you sure you want to delete <strong style={{ color: 'var(--ada-text-1)' }}>{name}</strong>? This action cannot be undone.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
          <button onClick={onClose} className="px-4 py-2 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-2)', fontWeight: 'var(--ada-fw-medium)' }}>Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-sm)', backgroundColor: 'var(--ada-e-600)', color: 'white', fontWeight: 'var(--ada-fw-medium)' }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export function AdminPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortCol, setSortCol] = useState<keyof Product>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [modal, setModal] = useState<{ type: 'create' | 'edit' | 'delete' | null; product?: Product }>({ type: null });
  const [page, setPage] = useState(1);
  const perPage = 5;

  const handleSort = (col: keyof Product) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => {
    const av = String(a[sortCol]); const bv = String(b[sortCol]);
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const pageCount = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map(p => p.id));

  const SortIcon = ({ col }: { col: keyof Product }) => {
    if (sortCol !== col) return <ArrowUpDown size={11} style={{ color: 'var(--ada-text-4)' }} />;
    return sortDir === 'asc' ? <ArrowUp size={11} style={{ color: 'var(--ada-p-600)' }} /> : <ArrowDown size={11} style={{ color: 'var(--ada-p-600)' }} />;
  };

  const stats = [
    { label: 'Total Products', value: products.length, icon: <Package size={16} />, color: 'var(--ada-p-600)' },
    { label: 'Active Listings', value: products.filter(p => p.status === 'Active').length, icon: <Activity size={16} />, color: 'var(--ada-s-600)' },
    { label: 'Total Revenue', value: `$${(products.reduce((a, p) => a + p.price * p.sales, 0) / 1000).toFixed(1)}k`, icon: <DollarSign size={16} />, color: 'var(--ada-p-600)' },
    { label: 'Total Sales', value: products.reduce((a, p) => a + p.sales, 0).toLocaleString(), icon: <Users size={16} />, color: 'var(--ada-i-600)' },
  ];

  return (
    <div className="p-6 space-y-5" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 style={{ fontSize: 'var(--ada-fs-3xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>Products</h1>
          <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>Manage your product catalog — create, edit, and archive listings.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-2)' }}>
            <Upload size={13} /> Import CSV
          </button>
          <button onClick={() => setModal({ type: 'create' })} className="flex items-center gap-1.5 px-3 py-2 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: 'var(--ada-btn-primary-bg)', color: 'white' }}>
            <Plus size={14} /> Add Product
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="flex items-center gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
            <div className="flex items-center justify-center w-8 h-8 rounded" style={{ backgroundColor: 'var(--ada-p-50)', color: s.color }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 'var(--ada-fs-2xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', lineHeight: 1.2 }}>{s.value}</div>
              <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--ada-text-3)' }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or SKU..."
            className="w-full pl-9 pr-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }}
          />
        </div>

        <div className="flex gap-1 items-center p-0.5 rounded border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
          {categories.map(c => (
            <button key={c} onClick={() => { setCategoryFilter(c); setPage(1); }}
              className="px-3 py-1 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: categoryFilter === c ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)', backgroundColor: categoryFilter === c ? 'var(--ada-surface-1)' : 'transparent', color: categoryFilter === c ? 'var(--ada-text-1)' : 'var(--ada-text-3)', boxShadow: categoryFilter === c ? 'var(--ada-shadow-1)' : 'none' }}>
              {c}
            </button>
          ))}
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="appearance-none pl-3 pr-8 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }}
          >
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--ada-text-3)' }} />
        </div>

        {selected.length > 0 && (
          <button className="flex items-center gap-1.5 px-3 py-2 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-xs)', backgroundColor: 'var(--ada-e-100)', borderColor: 'var(--ada-e-200)', color: 'var(--ada-e-700)', fontWeight: 'var(--ada-fw-medium)' }}
            onClick={() => setSelected([])}>
            <X size={12} /> {selected.length} selected
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" role="grid" aria-label="Product catalog">
            <thead>
              <tr style={{ backgroundColor: 'var(--ada-surface-2)', borderBottom: '1px solid var(--ada-border-default)' }}>
                <th className="px-4 py-2.5 w-10">
                  <input type="checkbox"
                    checked={selected.length === paginated.length && paginated.length > 0}
                    onChange={toggleAll}
                    className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
                    aria-label="Select all"
                  />
                </th>
                {[
                  { key: 'name' as const, label: 'Product' },
                  { key: 'category' as const, label: 'Category' },
                  { key: 'sku' as const, label: 'SKU' },
                  { key: 'price' as const, label: 'Price' },
                  { key: 'stock' as const, label: 'Stock' },
                  { key: 'sales' as const, label: 'Sales' },
                  { key: 'status' as const, label: 'Status' },
                  { key: 'created' as const, label: 'Created' },
                ].map(col => (
                  <th key={col.key} className="text-left px-4 py-2.5" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-3)' }}>
                    <button onClick={() => handleSort(col.key)} className="flex items-center gap-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ada-focus-ring)] rounded">
                      {col.label} <SortIcon col={col.key} />
                    </button>
                  </th>
                ))}
                <th className="px-4 py-2.5 w-12" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center">
                    <div style={{ color: 'var(--ada-text-4)', fontSize: 'var(--ada-fs-sm)' }}>No products match your filters.</div>
                  </td>
                </tr>
              ) : paginated.map((p, i) => (
                <tr
                  key={p.id}
                  className="transition-colors"
                  style={{ borderBottom: i < paginated.length - 1 ? '1px solid var(--ada-border-subtle)' : 'none', backgroundColor: selected.includes(p.id) ? 'var(--ada-p-50)' : 'transparent' }}
                  onMouseEnter={e => { if (!selected.includes(p.id)) e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = selected.includes(p.id) ? 'var(--ada-p-50)' : 'transparent'; }}
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} className="rounded" aria-label={`Select ${p.name}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}>{p.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{p.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <code style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-3)' }}>{p.sku}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', fontFamily: 'var(--ada-font-mono)' }}>
                      ${p.price.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', color: p.stock < 20 ? 'var(--ada-text-warning)' : 'var(--ada-text-2)', fontFamily: 'var(--ada-font-mono)' }}>
                      {p.stock === 999 ? '∞' : p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)', fontFamily: 'var(--ada-font-mono)' }}>{p.sales.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>{p.created}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setModal({ type: 'edit', product: p })} className="p-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ color: 'var(--ada-text-4)' }} aria-label="Edit" title="Edit">
                        <Edit size={13} />
                      </button>
                      <button onClick={() => setModal({ type: 'delete', product: p })} className="p-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ color: 'var(--ada-text-4)' }} aria-label="Delete" title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t" style={{ backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
          <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} · Page {page} of {Math.max(pageCount, 1)}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: page === 1 ? 'var(--ada-text-4)' : 'var(--ada-text-2)' }}
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.max(pageCount, 1) }, (_, i) => i + 1).slice(0, 5).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className="px-2.5 py-1 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
                style={{ fontSize: 'var(--ada-fs-xs)', minWidth: '32px', backgroundColor: page === n ? 'var(--ada-p-600)' : 'var(--ada-surface-1)', color: page === n ? 'white' : 'var(--ada-text-3)', borderColor: 'var(--ada-border-default)', fontWeight: page === n ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)' }}>
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(Math.max(pageCount, 1), p + 1))}
              disabled={page >= pageCount}
              className="p-1.5 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: page >= pageCount ? 'var(--ada-text-4)' : 'var(--ada-text-2)' }}
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal.type === 'create' && (
        <ProductModal mode="create" onClose={() => setModal({ type: null })} onSave={(data) => {
          const newProduct: Product = { id: `PRD-${String(products.length + 1).padStart(3, '0')}`, name: data.name!, category: data.category!, sku: data.sku!, price: data.price!, stock: data.stock!, status: data.status as any, sales: 0, created: 'Mar 1, 2026' };
          setProducts(p => [...p, newProduct]);
        }} />
      )}
      {modal.type === 'edit' && modal.product && (
        <ProductModal mode="edit" product={modal.product} onClose={() => setModal({ type: null })} onSave={(data) => {
          setProducts(p => p.map(pr => pr.id === modal.product!.id ? { ...pr, ...data } : pr));
        }} />
      )}
      {modal.type === 'delete' && modal.product && (
        <DeleteConfirm name={modal.product.name} onClose={() => setModal({ type: null })} onConfirm={() => {
          setProducts(p => p.filter(pr => pr.id !== modal.product!.id));
          setModal({ type: null });
        }} />
      )}
    </div>
  );
}
