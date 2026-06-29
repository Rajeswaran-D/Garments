import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Package, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const STATUS_COLORS: Record<string, { bg: string, text: string }> = {
  PENDING: { bg: '#FEF3C7', text: '#D97706' },
  CONFIRMED: { bg: '#DBEAFE', text: '#2563EB' },
  DELIVERED: { bg: '#DCFCE7', text: '#16A34A' },
  CANCELLED: { bg: '#FEE2E2', text: '#DC2626' },
};

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} style={{ animation: 'pulse 2s infinite' }}>
          {Array.from({ length: 6 }).map((__, j) => (
            <td key={j} style={{ padding: '1.25rem' }}>
              <div style={{ height: '16px', background: 'var(--color-bg-soft)', borderRadius: '4px', width: j === 0 ? '50px' : '100%' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 15;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const from = (page - 1) * LIMIT;
      const to = from + LIMIT - 1;

      const { data, count, error } = await supabase
        .from('orders')
        .select('*, order_items(id, quantity, product_id, products(name))', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setOrders(data || []);
      setTotalPages(count ? Math.ceil(count / LIMIT) : 1);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page]);

  const updateStatus = async (id: number, status: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
      fetchOrders();
    } catch {
      alert('Failed to update status.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p className="label-overline" style={{ marginBottom: '0.5rem' }}>Customer Orders</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.875rem', fontWeight: 700 }}>
          Manage Orders
        </h1>
      </div>

      <div style={{
        background: '#fff',
        border: '1px solid var(--color-border-light)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        {/* Table Toolbar */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-border-light)',
          background: 'var(--color-bg-soft)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
            <Package size={16} style={{ color: 'var(--color-text-secondary)' }} />
            Recent Orders
          </div>
          {/* We can add search/filter here if needed in future */}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o: any) => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                      #{o.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{o.customer_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{o.phone}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {o.order_items?.map((item: any) => (
                          <div key={item.id} style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.quantity}×</span> {item.products?.name || 'Item'}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary-green)' }}>
                      ₹{o.total_amount?.toFixed(0)}
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Calendar size={12} />
                        {new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td>
                      <select
                        value={o.status}
                        onChange={e => updateStatus(o.id, e.target.value)}
                        style={{
                          fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em',
                          padding: '0.375rem 0.75rem', borderRadius: '6px',
                          border: 'none', outline: 'none', cursor: 'pointer',
                          backgroundColor: STATUS_COLORS[o.status]?.bg || '#F3F4F6',
                          color: STATUS_COLORS[o.status]?.text || '#374151',
                          appearance: 'none', // clean up arrow in some browsers
                        }}
                      >
                        {['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2.5rem' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border-light)',
              background: page === 1 ? 'var(--color-bg-soft)' : '#fff',
              color: page === 1 ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
            }}
          ><ChevronLeft size={18} /></button>
          
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border-light)',
              background: page === totalPages ? 'var(--color-bg-soft)' : '#fff',
              color: page === totalPages ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
            }}
          ><ChevronRight size={18} /></button>
        </div>
      )}
    </div>
  );
}
