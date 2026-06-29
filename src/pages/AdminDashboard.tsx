import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Package, Tag, Settings, TrendingUp, ShoppingBag, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, combos: 0, activeProducts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('id, status'),
      supabase.from('combos').select('id'),
    ])
      .then(([p, c]) => {
        const products = p.data || [];
        const combos = c.data || [];
        setStats({
          products: products.length,
          combos: combos.length,
          activeProducts: products.filter((x: any) => x.status === 'ACTIVE').length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: 'Total Products',
      value: stats.products,
      icon: Package,
      to: '/admin/products',
      color: '#DCFCE7',
      iconColor: 'var(--color-primary-green)',
      trend: `${stats.activeProducts} active`,
    },
    {
      label: 'Combo Deals',
      value: stats.combos,
      icon: Tag,
      to: '/admin/combos',
      color: '#EDE9FE',
      iconColor: '#7C3AED',
      trend: 'Manage bundles',
    },
    {
      label: 'Active Listings',
      value: stats.activeProducts,
      icon: TrendingUp,
      to: '/admin/products',
      color: '#FEF9C3',
      iconColor: '#CA8A04',
      trend: 'Live on store',
    },
    {
      label: 'Settings',
      value: null,
      icon: Settings,
      to: '/admin/settings',
      color: '#F1F5F9',
      iconColor: '#64748B',
      trend: 'Configure site',
    },
  ];

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p className="label-overline" style={{ marginBottom: '0.5rem' }}>Overview</p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.875rem', fontWeight: 700,
          color: 'var(--color-text-primary)',
        }}>Admin Dashboard</h1>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem',
      }}>
        {statCards.map(({ label, value, icon: Icon, to, color, iconColor, trend }) => (
          <Link
            key={label}
            to={to}
            style={{
              background: '#fff',
              border: '1px solid var(--color-border-light)',
              borderRadius: '16px',
              padding: '1.5rem',
              textDecoration: 'none',
              display: 'block',
              transition: 'box-shadow var(--transition-base), transform var(--transition-base)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = '';
              (e.currentTarget as HTMLElement).style.transform = '';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{
                width: '2.75rem', height: '2.75rem',
                background: color, borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: iconColor,
              }}>
                <Icon size={20} strokeWidth={2} />
              </div>
            </div>
            {loading ? (
              <div style={{ height: '2.5rem', background: 'var(--color-bg-soft)', borderRadius: '8px', marginBottom: '0.5rem', animation: 'pulse 2s infinite' }} />
            ) : (
              <p style={{
                fontFamily: value !== null ? "'Playfair Display', serif" : 'Inter, sans-serif',
                fontSize: value !== null ? '2.25rem' : '1rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1, marginBottom: '0.375rem',
              }}>
                {value !== null ? value : '⚙️'}
              </p>
            )}
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.2rem' }}>{label}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: 0 }}>{trend}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{
        background: '#fff',
        border: '1px solid var(--color-border-light)',
        borderRadius: '16px',
        padding: '1.75rem',
        marginBottom: '1.5rem',
      }}>
        <h2 style={{
          fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--color-text-secondary)',
          marginBottom: '1.25rem',
        }}>Quick Actions</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link to="/admin/products" className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.625rem 1.25rem', gap: '0.375rem' }}>
            <Package size={14} /> Add Product
          </Link>
          <Link to="/admin/combos" className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.625rem 1.25rem', gap: '0.375rem' }}>
            <Tag size={14} /> Add Combo
          </Link>
          <Link to="/admin/settings" className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.625rem 1.25rem', gap: '0.375rem' }}>
            <Settings size={14} /> Edit Settings
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.625rem 1.25rem', gap: '0.375rem' }}>
            <ExternalLink size={14} /> View Website
          </a>
        </div>
      </div>

      {/* Help */}
      <div style={{
        background: 'linear-gradient(135deg, #0A3D1F 0%, #166534 100%)',
        borderRadius: '16px', padding: '1.75rem 2rem',
        display: 'flex', flexWrap: 'wrap',
        justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
      }}>
        <div>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.975rem', marginBottom: '0.25rem' }}>
            Store is Live 🟢
          </p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', marginBottom: 0 }}>
            Your customers can browse and order via WhatsApp right now.
          </p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: '#fff', color: 'var(--color-primary-green)',
          padding: '0.625rem 1.25rem', borderRadius: '10px',
          fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none',
          letterSpacing: '0.05em', textTransform: 'uppercase',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }}>
          <ShoppingBag size={14} /> Open Store
        </a>
      </div>
    </div>
  );
}