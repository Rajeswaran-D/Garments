import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useCart } from '../store/cartStore';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, ChevronDown, MapPin, Mail, Phone } from 'lucide-react';
interface Settings {
  id: number;
  businessName: string;
  whatsappNumber: string;
  address: string;
  email: string;
  heroBanner: string;
  instagramUrl: string;
  facebookUrl: string;
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const totalCount = useCart((state) => state.totalCount());

  useEffect(() => {
    supabase.from('settings').select('*').single().then(({ data, error }) => {
      if (!error && data) {
        setSettings({
          ...data,
          businessName: data.business_name,
          whatsappNumber: data.whatsapp_number,
          heroBanner: data.hero_banner,
          instagramUrl: data.instagram_url,
          facebookUrl: data.facebook_url,
        });
      }
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const navLinkStyle = (isActive: boolean): React.CSSProperties => ({
    fontSize: '0.8125rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textDecoration: 'none',
    color: isActive ? 'var(--color-primary-green)' : 'var(--color-text-primary)',
    transition: 'color var(--transition-fast)',
    outline: 'none',
    padding: '0.25rem 0',
    borderBottom: isActive ? '2px solid var(--color-primary-green)' : '2px solid transparent',
    paddingBottom: '2px',
  });

  const businessName = settings?.businessName || 'Shona Garments';
  const wa = settings?.whatsappNumber?.replace(/\D/g, '') || '';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-soft)' }}>

      {/* ─── NAVBAR ─────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: scrolled ? '#fff' : 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border-light)',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.06)' : 'none',
        transition: 'box-shadow var(--transition-base)',
      }}>
        <div className="container-site">
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', height: '72px',
          }}>

            {/* Logo */}
            <Link to="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img
                src="/logo.png"
                alt="Shona Garments"
                style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>

            {/* Desktop Nav */}
            <div style={{
              display: 'none',
              alignItems: 'center', gap: '2rem',
            }} className="desktop-nav">
              <NavLink to="/" end style={({ isActive }) => navLinkStyle(isActive)}>Home</NavLink>

              {/* Products Dropdown */}
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  style={{
                    ...navLinkStyle(false),
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onClick={() => { navigate('/products'); setDropdownOpen(false); }}
                >
                  Products
                  <ChevronDown size={14} style={{ transition: 'transform var(--transition-fast)', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} />
                </button>
                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute', top: 'calc(100% + 12px)',
                      left: '50%', transform: 'translateX(-50%)',
                      width: '220px',
                      background: '#fff',
                      border: '1px solid var(--color-border-light)',
                      borderRadius: '16px',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                      padding: '0.5rem 0',
                      animation: 'fadeIn 0.18s ease',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    {[
                      { label: "Men's Collection", to: '/products?category=Men' },
                      { label: "Women's Collection", to: '/products?category=Women' },
                    ].map(({ label, to }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'block', padding: '0.75rem 1.25rem',
                          fontSize: '0.875rem', fontWeight: 500,
                          color: 'var(--color-text-primary)', textDecoration: 'none',
                          transition: 'background-color var(--transition-fast), color var(--transition-fast)',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background = 'var(--color-bg-soft)';
                          (e.currentTarget as HTMLElement).style.color = 'var(--color-primary-green)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background = '';
                          (e.currentTarget as HTMLElement).style.color = 'var(--color-text-primary)';
                        }}
                      >{label}</Link>
                    ))}
                    <div style={{ height: '1px', background: 'var(--color-border-light)', margin: '0.25rem 0' }} />
                    <Link
                      to="/products"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'block', padding: '0.75rem 1.25rem',
                        fontSize: '0.875rem', fontWeight: 600,
                        color: 'var(--color-primary-green)', textDecoration: 'none',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--color-bg-soft)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
                    >View All Products</Link>
                  </div>
                )}
              </div>

              <NavLink to="/combos" style={({ isActive }) => navLinkStyle(isActive)}>Combos</NavLink>
              <NavLink to="/quality" style={({ isActive }) => navLinkStyle(isActive)}>Quality</NavLink>
              <NavLink to="/about" style={({ isActive }) => navLinkStyle(isActive)}>About</NavLink>
              <NavLink to="/bulk-orders" style={({ isActive }) => navLinkStyle(isActive)}>Bulk Orders</NavLink>
              <NavLink to="/contact" style={({ isActive }) => navLinkStyle(isActive)}>Contact</NavLink>

              {/* Cart */}
              <NavLink to="/cart" style={{ position: 'relative', padding: '0.5rem', color: 'var(--color-text-primary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-primary-green)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-primary)'}
              >
                <ShoppingBag size={22} />
                {totalCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-2px', right: '-2px',
                    width: '18px', height: '18px',
                    background: 'var(--color-primary-green)',
                    color: '#fff', fontSize: '10px', fontWeight: 700,
                    borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    border: '2px solid #fff',
                  }}>{totalCount > 9 ? '9+' : totalCount}</span>
                )}
              </NavLink>
            </div>

            {/* Mobile: Cart + Hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="mobile-nav-buttons">
              <NavLink to="/cart" style={{ position: 'relative', padding: '0.4rem', color: 'var(--color-text-primary)', textDecoration: 'none' }}>
                <ShoppingBag size={22} />
                {totalCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-2px', right: '-2px',
                    width: '18px', height: '18px',
                    background: 'var(--color-primary-green)',
                    color: '#fff', fontSize: '10px', fontWeight: 700,
                    borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    border: '2px solid #fff',
                  }}>{totalCount}</span>
                )}
              </NavLink>
              <button
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '0.4rem', color: 'var(--color-text-primary)',
                  borderRadius: '8px',
                }}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── MOBILE DRAWER ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.45)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity var(--transition-base)',
        }}
        onClick={closeMobile}
      />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '320px', maxWidth: '88vw', zIndex: 50,
        background: '#fff',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Drawer Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-border-light)',
          flexShrink: 0,
        }}>
          <Link to="/" onClick={closeMobile} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src="/logo.png"
              alt="Shona Garments"
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
            />
          </Link>
          <button
            onClick={closeMobile}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.375rem', borderRadius: '8px', color: 'var(--color-text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {[
            { label: 'Home', to: '/' },
            { label: 'All Products', to: '/products' },
            { label: "Men's Collection", to: '/products?category=Men', indent: true },
            { label: "Women's Collection", to: '/products?category=Women', indent: true },
            { label: 'Combo Offers', to: '/combos' },
            { label: 'Quality Promise', to: '/quality' },
            { label: 'About Us', to: '/about' },
            { label: 'Bulk Orders', to: '/bulk-orders' },
            { label: 'Contact', to: '/contact' },
          ].map(({ label, to, indent }) => (
            <Link
              key={label}
              to={to}
              onClick={closeMobile}
              style={{
                display: 'block',
                padding: '0.875rem 0',
                paddingLeft: indent ? '1.25rem' : '0',
                fontSize: indent ? '0.875rem' : '0.9375rem',
                fontWeight: indent ? 500 : 600,
                color: indent ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--color-border-light)',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-primary-green)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = indent ? 'var(--color-text-secondary)' : 'var(--color-text-primary)'}
            >{label}</Link>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid var(--color-border-light)',
          background: 'var(--color-bg-soft)',
          flexShrink: 0,
        }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Need Help?</p>
          {wa && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                color: '#25D366', fontWeight: 600, fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              <Phone size={16} /> WhatsApp Us
            </a>
          )}
        </div>
      </div>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────── */}
      <main style={{ flexGrow: 1, minWidth: 0, background: 'var(--color-bg-soft)' }}>
        <Outlet />
      </main>

      {/* ─── FOOTER ──────────────────────────────────────────────── */}
      <footer style={{
        background: '#fff',
        borderTop: '1px solid var(--color-border-light)',
        paddingTop: '4rem',
        paddingBottom: '2rem',
        marginTop: 'auto',
      }}>
        <div className="container-site">
          {/* 4-Column Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}>

            {/* Brand */}
            <div>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', marginBottom: '1rem' }}>
                <img
                  src="/logo.png"
                  alt="Shona Garments"
                  style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
                />
              </Link>
              <p style={{
                fontSize: '0.875rem', color: 'var(--color-text-secondary)',
                lineHeight: 1.75, marginBottom: '1.5rem',
              }}>
                Premium nightwear and casual wear for Men & Women. Experience comfort tailored to perfection.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {settings?.instagramUrl ? (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                    style={socialIconStyle}>
                    IG
                  </a>
                ) : null}
                {settings?.facebookUrl ? (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                    style={socialIconStyle}>
                    FB
                  </a>
                ) : null}
                {wa && (
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                    style={{ ...socialIconStyle, background: '#25D366', color: '#fff' }}>
                    <Phone size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Collections */}
            <div>
              <h4 style={footerHeadingStyle}>Collections</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: "Men's Collection", to: '/products?category=Men' },
                  { label: "Women's Collection", to: '/products?category=Women' },
                  { label: 'Combo Offers', to: '/combos' },
                  { label: 'All Products', to: '/products' },
                ].map(({ label, to }) => (
                  <li key={to}><Link to={to} style={footerLinkStyle}>{label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={footerHeadingStyle}>Quick Links</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'Our Quality', to: '/quality' },
                  { label: 'About Us', to: '/about' },
                  { label: 'Bulk Orders', to: '/bulk-orders' },
                  { label: 'Contact Us', to: '/contact' },
                ].map(({ label, to }) => (
                  <li key={to}><Link to={to} style={footerLinkStyle}>{label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 style={footerHeadingStyle}>Contact Info</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {wa && (
                  <li>
                    <a href={`https://wa.me/${wa}`} style={{ ...footerLinkStyle, display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <Phone size={14} style={{ flexShrink: 0 }} />
                      <span>+{wa}</span>
                    </a>
                  </li>
                )}
                {settings?.email && (
                  <li>
                    <a href={`mailto:${settings.email}`} style={{ ...footerLinkStyle, display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <Mail size={14} style={{ flexShrink: 0 }} />
                      <span>{settings.email}</span>
                    </a>
                  </li>
                )}
                {settings?.address && (
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    <MapPin size={14} style={{ flexShrink: 0, marginTop: '3px', color: 'var(--color-primary-green)' }} />
                    <span style={{ lineHeight: 1.6 }}>{settings.address}</span>
                  </li>
                )}
              </ul>
            </div>

          </div>

          {/* Copyright Row */}
          <div style={{
            borderTop: '1px solid var(--color-border-light)',
            paddingTop: '1.75rem',
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'center', alignItems: 'center',
            gap: '1rem',
          }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: 0 }}>
              © {new Date().getFullYear()} {businessName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Responsive CSS injected */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav-buttons { display: none !important; }
        }
      `}</style>
    </div>
  );
}

const socialIconStyle: React.CSSProperties = {
  width: '36px', height: '36px', borderRadius: '50%',
  background: 'var(--color-bg-soft)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--color-text-secondary)', textDecoration: 'none',
  transition: 'background-color var(--transition-fast), color var(--transition-fast)',
  border: '1px solid var(--color-border-light)',
};

const footerHeadingStyle: React.CSSProperties = {
  fontSize: '0.7rem', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: 'var(--color-text-primary)', marginBottom: '1.25rem',
};

const footerLinkStyle: React.CSSProperties = {
  fontSize: '0.875rem', color: 'var(--color-text-secondary)',
  textDecoration: 'none',
  transition: 'color var(--transition-fast)',
};