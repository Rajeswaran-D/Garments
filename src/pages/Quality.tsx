import { ShieldCheck, Droplets, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const cards = [
  {
    icon: Droplets,
    title: 'Premium Fabric',
    lines: [
      'Sourced from the finest mills for unmatched softness.',
      'Breathable materials that keep you comfortable all day.',
    ],
    color: '#DCFCE7',
  },
  {
    icon: ShieldCheck,
    title: 'Precision Stitching',
    lines: [
      'Every seam is engineered for strength and durability.',
      'Meticulous craftsmanship that stands the test of time.',
    ],
    color: '#DCFCE7',
  },
  {
    icon: Heart,
    title: 'Comfort & Durability',
    lines: [
      'Designed for natural movement through every season.',
      'Lasting colour and shape wash after wash.',
    ],
    color: '#DCFCE7',
  },
];

export default function Quality() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ─── Header ─── */}
      <div style={{
        background: 'linear-gradient(135deg, #0A3D1F 0%, #166534 60%, #15803D 100%)',
        padding: '6rem 1.25rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: '500px', height: '500px',
          background: 'rgba(34,197,94,0.08)', borderRadius: '50%',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="label-overline" style={{ color: '#22C55E', marginBottom: '1rem' }}>The Shona Standard</p>
          <h1 className="heading-section" style={{ color: '#fff', marginBottom: '1.25rem' }}>Our Quality Promise</h1>
          <p style={{
            color: 'rgba(255,255,255,0.75)', fontSize: '1.0625rem',
            lineHeight: 1.7, maxWidth: '560px', margin: '0 auto',
          }}>
            We source only the finest materials to create garments that look exceptional and feel extraordinary — every single time.
          </p>
        </div>
      </div>

      {/* ─── Three Cards ─── */}
      <section className="section-gap">
        <div className="container-site">
          <div className="container-content">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}>
              {cards.map(({ icon: Icon, title, lines, color }) => (
                <div key={title} style={{
                  background: '#fff',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: '20px',
                  padding: '2.5rem 2.25rem',
                  display: 'flex', flexDirection: 'column',
                  transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = '';
                    (e.currentTarget as HTMLElement).style.boxShadow = '';
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: '3.5rem', height: '3.5rem',
                    background: color, borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.75rem',
                    color: 'var(--color-primary-green)',
                  }}>
                    <Icon size={24} strokeWidth={2} />
                  </div>

                  {/* Heading */}
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.25rem', fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: '1.25rem', lineHeight: 1.3,
                  }}>{title}</h3>

                  {/* Two-line description */}
                  {lines.map((line, i) => (
                    <p key={i} style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: '0.9rem', lineHeight: 1.7,
                      marginBottom: i < lines.length - 1 ? '0.5rem' : 0,
                    }}>{line}</p>
                  ))}
                </div>
              ))}
            </div>

            {/* Quality Process */}
            <div style={{
              marginTop: '5rem',
              background: 'var(--color-bg-soft)',
              borderRadius: '20px',
              padding: '3rem 2.5rem',
              border: '1px solid var(--color-border-light)',
            }}>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h2 className="heading-sub" style={{ marginBottom: '0.75rem' }}>Our Quality Process</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto' }}>
                  Every garment passes through our rigorous 4-step quality assurance pipeline before reaching you.
                </p>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1.5rem',
              }}>
                {[
                  { step: '01', label: 'Fabric Selection', desc: 'Premium raw material sourcing' },
                  { step: '02', label: 'Master Cutting', desc: 'Precision pattern engineering' },
                  { step: '03', label: 'Expert Stitching', desc: 'Quality-controlled assembly' },
                  { step: '04', label: 'Final Inspection', desc: 'Thorough pre-shipment check' },
                ].map(({ step, label, desc }) => (
                  <div key={step} style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '2.5rem', fontWeight: 700,
                      color: 'var(--color-accent-green)', lineHeight: 1,
                      marginBottom: '0.75rem',
                    }}>{step}</div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{label}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 0 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
              <Link to="/products" className="btn-primary" style={{ padding: '1rem 2.5rem' }}>
                Experience The Quality
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
