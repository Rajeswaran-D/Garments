import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  LayoutDashboard, Package, Tag, Settings,
  LogOut, ExternalLink, ChevronRight, Menu, X
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Combos', to: '/admin/combos', icon: Tag },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const isActive = (to: string, exact = false) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  const handleLogout = async () => {
    localStorage.removeItem('adminToken');
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  // Breadcrumb label
  const current = navItems.find(n => isActive(n.to, n.exact)) ?? navItems[0];

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', background: 'var(--color-bg-soft)' }}>

      {/* Overlay for mobile sidebar */}
      <div 
        className={`admin-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* ─── SIDEBAR ─── */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div style={{
          padding: '1.5rem 1.25rem 1.25rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
          <p style={{
            fontSize: '0.6rem', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)', marginBottom: '0.375rem',
          }}>Admin Panel</p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.0625rem', fontWeight: 700,
            color: '#fff', letterSpacing: '0.04em',
          }}>Shona Garments</h2>
          </div>
          <button 
            className="hide-desktop"
            onClick={() => setIsSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map(({ label, to, icon: Icon, exact }) => {
            const active = isActive(to, exact);
            return (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.875rem', fontWeight: active ? 700 : 500,
                  textDecoration: 'none',
                  color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.color = '#fff';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)';
                  }
                }}
              >
                <Icon size={17} strokeWidth={2} style={{ flexShrink: 0 }} />
                {label}
                {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.7 }} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div style={{
          padding: '0.75rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.625rem 1rem',
              borderRadius: '10px',
              fontSize: '0.8125rem', fontWeight: 500,
              color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none',
              transition: 'all var(--transition-fast)',
              marginBottom: '0.25rem',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#fff';
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <ExternalLink size={15} />
            View Website
          </a>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              width: '100%', padding: '0.625rem 1rem',
              borderRadius: '10px',
              fontSize: '0.8125rem', fontWeight: 500,
              color: 'rgba(255,255,255,0.45)',
              background: 'none', border: 'none', cursor: 'pointer',
              textAlign: 'left',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#FCA5A5';
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'auto' }}>
        {/* Top bar */}
        <header style={{
          background: '#fff',
          borderBottom: '1px solid var(--color-border-light)',
          padding: '1rem 2rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <button 
            className="admin-menu-btn"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            <span className="hide-mobile">Admin</span>
            <ChevronRight size={13} className="hide-mobile" />
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{current.label}</span>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}