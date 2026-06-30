import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

import { ShieldCheck, Scissors, Sparkles, Package, DollarSign, Truck, HeadphonesIcon } from 'lucide-react';


export default function Home() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    supabase.from('settings').select('*').single().then(({ data }) => {
      if (data) setSettings(data);
    });
  }, []);

  const whatsappNumber = settings?.whatsapp_number || '919585009152';
  const businessName = settings?.business_name || 'Shona Garments';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', background: '#fff' }}>

      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="hero-section" style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      }}>
        {/* Background image fills the section */}
        <img
          src="/hero_banner.jpg"
          alt="Shona Garments Hero Banner"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            zIndex: 0,
          }}
        />
        {/* Gradient only at the bottom for text readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 35%, transparent 65%)',
          zIndex: 1,
        }} />
        {/* Text pinned to bottom-left only */}
        <div className="hero-text-container" style={{
          position: 'absolute', bottom: 0, left: 0,
          zIndex: 2,
          padding: 'clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 5vw, 4rem)',
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>Premium Garments</p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
            textShadow: '0 2px 16px rgba(0,0,0,0.4)',
          }}>
            Elevate Your Everyday{' '}
            <span style={{ color: '#4ADE80' }}>Comfort</span>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.82)',
            fontSize: 'clamp(0.8rem, 1.1vw, 0.95rem)',
            maxWidth: '380px',
            marginBottom: '1.75rem',
            lineHeight: 1.7,
            textShadow: '0 1px 6px rgba(0,0,0,0.5)',
          }}>
            Premium nightwear &amp; casual wear meticulously crafted from the finest fabrics for an unparalleled relaxation experience.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/products" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '0.75rem 1.5rem',
              background: '#fff', color: '#166534',
              fontWeight: 700, fontSize: '0.75rem',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              borderRadius: '10px', textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            }}>
              Shop Collection →
            </Link>
            <Link to="/combos" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              color: '#fff', border: '1.5px solid rgba(255,255,255,0.5)',
              fontWeight: 600, fontSize: '0.75rem',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              borderRadius: '10px', textDecoration: 'none',
            }}>
              View Combos
            </Link>
          </div>
        </div>
      </section>

      {/* ─── COLLECTIONS ─────────────────────────────────────────────── */}
      <section className="section-gap" style={{ background: '#fff' }}>
        <div className="container-site">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', gap: '1rem' }}>
            <div>
              <p className="label-overline" style={{ color: 'var(--color-primary-green)', marginBottom: '0.5rem' }}>Curated For You</p>
              <h2 className="heading-section">Shop by Category</h2>
            </div>
            <Link to="/products" style={{
              fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-green)',
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem',
              transition: 'gap var(--transition-base)',
            }}>
              View All <span>→</span>
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                to: '/products?category=Men',
                label: "Men's",
                sub: 'Premium Nightwear & Casuals',
                img: '/mens_collection.jpeg',
                overlay: 'linear-gradient(to top, rgba(22, 101, 52, 0.9) 0%, rgba(22, 101, 52, 0) 50%)',
              },
              {
                to: '/products?category=Women',
                label: "Women's",
                sub: 'Elegant Sleepwear & Loungewear',
                img: '/womens_collection.jpeg',
                overlay: 'linear-gradient(to top, rgba(76, 29, 149, 0.9) 0%, rgba(76, 29, 149, 0) 50%)',
              },
            ].map(({ to, label, sub, img, overlay }) => (
              <Link key={to} to={to} style={{
                position: 'relative', display: 'block',
                height: '520px', borderRadius: '20px', overflow: 'hidden',
                textDecoration: 'none', isolation: 'isolate',
              }}>
                <img src={img} alt={label} style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', zIndex: 0,
                }} />
                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: overlay, zIndex: 1,
                }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '2.5rem', zIndex: 2,
                  isolation: 'isolate',
                }}>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '2.25rem', fontWeight: 700,
                    color: '#fff', marginBottom: '0.5rem', lineHeight: 1.1,
                  }}>{label}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{sub}</p>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: '#fff', color: 'var(--color-primary-green)',
                    fontWeight: 700, fontSize: '1.1rem',
                    transition: 'transform var(--transition-base)',
                  }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* ─── WHY CHOOSE US ───────────────────────────────────────────── */}
      <section className="section-gap" style={{ background: '#fff' }}>
        <div className="container-site">
          <div className="container-content">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <p className="label-overline" style={{ color: 'var(--color-primary-green)', marginBottom: '0.75rem' }}>Our Promise</p>
              <h2 className="heading-section" style={{ marginBottom: '1rem' }}>Why Choose {businessName}?</h2>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '520px', margin: '0 auto', fontSize: '1rem' }}>
                We believe in delivering nothing but the best. Every garment reflects our commitment to quality and craftsmanship.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  icon: <Sparkles size={24} strokeWidth={1.5} color="var(--color-text-primary)" />,
                  title: 'Premium Fabrics',
                  desc: 'Sourced materials chosen for breathability, softness, and lasting colour retention.',
                },
                {
                  icon: <Scissors size={24} strokeWidth={1.5} color="var(--color-text-primary)" />,
                  title: 'Precision Stitching',
                  desc: 'Every stitch is crafted with exact attention to detail ensuring durability.',
                },
                {
                  icon: <ShieldCheck size={24} strokeWidth={1.5} color="var(--color-text-primary)" />,
                  title: 'Comfort & Durability',
                  desc: 'Designed for natural movement and maximum comfort through all seasons.',
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="feature-card">
                  <div className="feature-card-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    {icon}
                  </div>
                  <h3 className="heading-card" style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>{title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMBO BANNER ────────────────────────────────────────────── */}
      <section style={{ padding: '0 1.25rem 5rem' }}>
        <div className="container-site">
          <div style={{
            background: 'linear-gradient(135deg, #0A3D1F 0%, #166534 60%, #15803D 100%)',
            borderRadius: '24px',
            padding: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)',
            position: 'relative', overflow: 'hidden',
            textAlign: 'center',
          }}>
            {/* Decorative blobs */}
            <div style={{
              position: 'absolute', top: '-30%', right: '-5%',
              width: '400px', height: '400px',
              background: 'rgba(34,197,94,0.08)', borderRadius: '50%',
              filter: 'blur(50px)', pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: '-30%', left: '-5%',
              width: '350px', height: '350px',
              background: 'rgba(255,255,255,0.04)', borderRadius: '50%',
              filter: 'blur(40px)', pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <span style={{
                display: 'inline-block',
                background: 'rgba(34,197,94,0.2)',
                color: '#22C55E',
                fontSize: '0.7rem', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: '0.375rem 1rem', borderRadius: '999px',
                border: '1px solid rgba(34,197,94,0.3)',
                marginBottom: '1.5rem',
              }}>Exclusive Deals</span>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.875rem, 4vw, 2.75rem)',
                fontWeight: 700, color: '#fff',
                lineHeight: 1.2, marginBottom: '1.25rem',
              }}>
                Bundle &amp; Save More
              </h2>
              <p style={{
                color: 'rgba(255,255,255,0.72)', fontSize: '1rem',
                lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 2.5rem',
              }}>
                Pair your favourite pieces and enjoy premium comfort at exceptional value with our curated combo deals.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/combos" style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem', padding: '1rem 2.25rem',
                  background: '#fff', color: 'var(--color-primary-green)',
                  fontWeight: 700, fontSize: '0.8125rem', letterSpacing: '0.08em',
                  textTransform: 'uppercase', borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                  transition: 'transform var(--transition-base)',
                }}>
                  Explore Combos →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BULK ORDERS CTA ─────────────────────────────────────────── */}
      <section className="section-gap" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container-site">
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem', alignItems: 'center',
          }}>
            <div>
              <p className="label-overline" style={{ color: 'var(--color-primary-green)', marginBottom: '0.75rem' }}>B2B & Wholesale</p>
              <h2 className="heading-section" style={{ marginBottom: '1.25rem' }}>
                Looking for Bulk Orders?
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Partner with us to provide premium garments to your customers. We offer competitive pricing, flexible quantities, and dedicated support for wholesale buyers.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/bulk-orders" className="btn-primary">Learn More</Link>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello! I am interested in placing a Bulk Order. Please share details.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { icon: <Package size={20} strokeWidth={1.5} />, label: 'Flexible MOQ', value: 'Custom quantities tailored to your needs' },
                { icon: <DollarSign size={20} strokeWidth={1.5} />, label: 'Wholesale Pricing', value: 'Competitive rates for retail partners' },
                { icon: <Truck size={20} strokeWidth={1.5} />, label: 'Fast Dispatch', value: 'Reliable, on-time bulk shipments' },
                { icon: <HeadphonesIcon size={20} strokeWidth={1.5} />, label: '24/7 Support', value: 'Dedicated team for bulk customers' },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{
                  background: '#fff', borderRadius: '16px',
                  padding: '1.5rem', border: '1px solid var(--color-border-light)',
                }}>
                  <div style={{ color: 'var(--color-text-primary)', marginBottom: '0.75rem' }}>{icon}</div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{label}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 0 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}