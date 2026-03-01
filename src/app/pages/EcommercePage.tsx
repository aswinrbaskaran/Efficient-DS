import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Package, ShoppingCart, DollarSign, Users, Search, Filter,
  Plus, MoreHorizontal, TrendingUp, ArrowUpRight, Truck, CheckCircle,
  Clock, AlertCircle, Star, ChevronDown,
} from 'lucide-react';

const revenueData = [
  { month: 'Oct', revenue: 68000 }, { month: 'Nov', revenue: 91000 },
  { month: 'Dec', revenue: 134000 }, { month: 'Jan', revenue: 72000 },
  { month: 'Feb', revenue: 88000 }, { month: 'Mar', revenue: 97000 },
];

const products = [
  { id: 'SKU-1042', name: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', price: '$299', stock: 142, sold: 1847, rating: 4.8, status: 'In Stock' },
  { id: 'SKU-0987', name: 'Ergonomic Office Chair', category: 'Furniture', price: '$549', stock: 23, sold: 634, rating: 4.6, status: 'Low Stock' },
  { id: 'SKU-2201', name: 'Mechanical Keyboard TKL', category: 'Electronics', price: '$129', stock: 0, sold: 2341, rating: 4.9, status: 'Out of Stock' },
  { id: 'SKU-1155', name: 'Bamboo Desk Organiser', category: 'Office', price: '$49', stock: 312, sold: 892, rating: 4.3, status: 'In Stock' },
  { id: 'SKU-0834', name: '4K USB-C Monitor 27"', category: 'Electronics', price: '$699', stock: 58, sold: 421, rating: 4.7, status: 'In Stock' },
  { id: 'SKU-3310', name: 'Leather Laptop Sleeve 15"', category: 'Accessories', price: '$79', stock: 9, sold: 1122, rating: 4.5, status: 'Low Stock' },
];

const orders = [
  { id: '#ORD-48821', customer: 'Sarah Chen', items: 3, total: '$647', status: 'Shipped', date: 'Mar 1, 2026', eta: 'Mar 3' },
  { id: '#ORD-48820', customer: 'Marcus Reed', items: 1, total: '$299', status: 'Processing', date: 'Mar 1, 2026', eta: 'Mar 4' },
  { id: '#ORD-48819', customer: 'Priya Patel', items: 2, total: '$178', status: 'Delivered', date: 'Feb 28, 2026', eta: 'Delivered' },
  { id: '#ORD-48818', customer: 'James Wilson', items: 1, total: '$549', status: 'Pending', date: 'Feb 28, 2026', eta: 'Mar 5' },
  { id: '#ORD-48817', customer: 'Aiko Tanaka', items: 4, total: '$1,124', status: 'Shipped', date: 'Feb 27, 2026', eta: 'Mar 2' },
];

const stockByCategory = [
  { cat: 'Electronics', stock: 200 }, { cat: 'Furniture', stock: 45 },
  { cat: 'Office', cat2: 'Office', stock: 312 }, { cat: 'Accessories', stock: 120 },
];

function StatusChip({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    'In Stock': ['var(--ada-bg-success)', 'var(--ada-text-success)'],
    'Low Stock': ['var(--ada-bg-warning)', 'var(--ada-text-warning)'],
    'Out of Stock': ['var(--ada-bg-error)', 'var(--ada-text-error)'],
    'Shipped': ['var(--ada-p-100)', 'var(--ada-p-700)'],
    'Processing': ['var(--ada-bg-warning)', 'var(--ada-text-warning)'],
    'Delivered': ['var(--ada-bg-success)', 'var(--ada-text-success)'],
    'Pending': ['var(--ada-bg-muted)', 'var(--ada-text-3)'],
  };
  const [bg, color] = map[status] || ['var(--ada-bg-muted)', 'var(--ada-text-3)'];
  return (
    <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: bg, color }}>{status}</span>
  );
}

function KPI({ title, value, delta, icon }: { title: string; value: string; delta: string; icon: React.ReactNode }) {
  return (
    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
      <div className="flex items-center justify-between mb-3">
        <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 'var(--ada-fw-medium)' }}>{title}</span>
        <span style={{ color: 'var(--ada-text-4)' }}>{icon}</span>
      </div>
      <div style={{ fontSize: 'var(--ada-fs-3xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', letterSpacing: '-0.02em' }}>{value}</div>
      <div className="flex items-center gap-1 mt-1">
        <ArrowUpRight size={11} style={{ color: 'var(--ada-text-success)' }} />
        <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-success)', fontWeight: 'var(--ada-fw-medium)' }}>{delta}</span>
        <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>vs last month</span>
      </div>
    </div>
  );
}

export function EcommercePage() {
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [search, setSearch] = useState('');

  return (
    <div className="p-6 space-y-5" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: 'var(--ada-fs-2xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>E-commerce Admin</h1>
          <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)', marginTop: '2px' }}>Product catalogue · Order tracking · Inventory management</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded" style={{ backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)', fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)' }}>
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KPI title="Monthly Revenue" value="$97,240" delta="+10.4%" icon={<DollarSign size={15} />} />
        <KPI title="Total Orders" value="2,841" delta="+7.2%" icon={<ShoppingCart size={15} />} />
        <KPI title="Active Products" value="486" delta="+12" icon={<Package size={15} />} />
        <KPI title="Customers" value="14,322" delta="+3.8%" icon={<Users size={15} />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
            <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Revenue Trend</span>
            <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>Last 6 months</span>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={revenueData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--ada-border-subtle)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--ada-text-3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--ada-text-3)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} contentStyle={{ backgroundColor: 'var(--ada-surface-1)', border: '1px solid var(--ada-border-default)', borderRadius: 6, fontSize: 12 }} />
                <Bar dataKey="revenue" fill="var(--ada-p-500)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
          <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
            <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Order Status</span>
          </div>
          <div className="p-5 space-y-3">
            {[
              { label: 'Delivered', count: 1842, icon: <CheckCircle size={14} />, color: 'var(--ada-text-success)' },
              { label: 'Shipped', count: 614, icon: <Truck size={14} />, color: 'var(--ada-p-600)' },
              { label: 'Processing', count: 287, icon: <Clock size={14} />, color: 'var(--ada-text-warning)' },
              { label: 'Pending', count: 98, icon: <AlertCircle size={14} />, color: 'var(--ada-text-error)' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2" style={{ color: s.color, fontSize: 'var(--ada-fs-xs)' }}>
                  {s.icon}<span style={{ color: 'var(--ada-text-2)' }}>{s.label}</span>
                </div>
                <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', fontFamily: 'var(--ada-font-mono)' }}>{s.count.toLocaleString()}</span>
              </div>
            ))}
            <div className="pt-3 border-t" style={{ borderColor: 'var(--ada-border-default)' }}>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>Fulfilment Rate</span>
                <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-success)' }}>97.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Products / Orders */}
      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          <div className="flex gap-1">
            {(['products', 'orders'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className="px-3 py-1.5 rounded capitalize" style={{
                fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)',
                backgroundColor: tab === t ? 'var(--ada-p-600)' : 'transparent',
                color: tab === t ? 'white' : 'var(--ada-text-2)',
              }}>{t}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
              <Search size={13} style={{ color: 'var(--ada-text-3)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tab === 'products' ? 'Search products…' : 'Search orders…'} style={{ background: 'none', border: 'none', outline: 'none', fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-1)', width: '160px' }} />
            </div>
            <button className="flex items-center gap-1" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>
              <Filter size={13} /> Filter
            </button>
          </div>
        </div>

        {tab === 'products' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ada-fs-xs)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
                {['SKU', 'Product', 'Category', 'Price', 'Stock', 'Sold', 'Rating', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--ada-border-subtle)' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-3)' }}>{p.id}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--ada-text-3)' }}>{p.category}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-2)', fontWeight: 'var(--ada-fw-medium)' }}>{p.price}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--ada-font-mono)', color: p.stock === 0 ? 'var(--ada-text-error)' : p.stock < 30 ? 'var(--ada-text-warning)' : 'var(--ada-text-2)' }}>{p.stock}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-2)' }}>{p.sold.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div className="flex items-center gap-1">
                      <Star size={11} style={{ color: 'var(--ada-text-warning)', fill: 'var(--ada-text-warning)' }} />
                      <span style={{ color: 'var(--ada-text-2)' }}>{p.rating}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px' }}><StatusChip status={p.status} /></td>
                  <td style={{ padding: '10px 12px' }}><button style={{ color: 'var(--ada-text-3)' }}><MoreHorizontal size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ada-fs-xs)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'ETA', ''].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--ada-border-subtle)' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-p-600)', fontWeight: 'var(--ada-fw-medium)' }}>{o.id}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}>{o.customer}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--ada-text-3)' }}>{o.items}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-2)', fontWeight: 'var(--ada-fw-medium)' }}>{o.total}</td>
                  <td style={{ padding: '10px 12px' }}><StatusChip status={o.status} /></td>
                  <td style={{ padding: '10px 12px', color: 'var(--ada-text-3)' }}>{o.date}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--ada-text-3)' }}>{o.eta}</td>
                  <td style={{ padding: '10px 12px' }}><button style={{ color: 'var(--ada-text-3)' }}><MoreHorizontal size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
