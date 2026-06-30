export default function About() {


  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ─── Hero Header ─── */}
      <div style={{
        background: 'linear-gradient(135deg, #0A3D1F 0%, #166534 60%, #15803D 100%)',
        padding: '6rem 1.25rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-25%', right: '-5%',
          width: '450px', height: '450px',
          background: 'rgba(34,197,94,0.07)', borderRadius: '50%',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="label-overline" style={{ color: '#22C55E', marginBottom: '1rem' }}>The Shona Story</p>
          <h1 className="heading-section" style={{ color: '#fff', marginBottom: '1.25rem' }}>About Us</h1>
          <p style={{
            color: 'rgba(255,255,255,0.75)', fontSize: '1rem',
            lineHeight: 1.7, maxWidth: '520px', margin: '0 auto',
          }}>
            Built on passion, craftsmanship, and a relentless pursuit of comfort.
          </p>
        </div>
      </div>

      {/* ─── Split Layout ─── */}
      <section className="section-gap">
        <div className="container-site">
          <div className="container-content">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '4rem',
              alignItems: 'start',
            }}>

              {/* Left: Visual */}
              <div>
                <div style={{
                  background: 'linear-gradient(135deg, #0A3D1F, #166534)',
                  borderRadius: '20px',
                  aspectRatio: '3/4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                  marginBottom: '1.5rem',
                }}>
                  {/* Decorative */}
                  <div style={{
                    position: 'absolute', top: '1.5rem', left: '1.5rem',
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: '2rem', right: '2rem',
                    width: '120px', height: '120px', borderRadius: '50%',
                    background: 'rgba(34,197,94,0.1)',
                  }} />
                  <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏭</div>
                    <p style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.5rem', fontWeight: 700,
                      color: '#fff', lineHeight: 1.2,
                      marginBottom: '0.75rem',
                    }}>Manufacturing<br />Excellence</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                      State-of-the-art facility with skilled artisans
                    </p>
                  </div>
                </div>

              </div>

              {/* Right: Content */}
              <div>
                {/* Story */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.625rem', fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: '1rem', lineHeight: 1.25,
                  }}>Our Story</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.8 }}>
                    Founded with a clear vision, Shona Garments set out to redefine comfortable clothing. We believe true luxury lies in the softness of the fabric and the precision of the stitch — not in ostentatious branding.
                  </p>
                </div>

                {/* Mission */}
                <div style={{
                  marginBottom: '2.5rem',
                  padding: '1.75rem',
                  background: 'var(--color-bg-soft)',
                  borderRadius: '16px',
                  borderLeft: '4px solid var(--color-primary-green)',
                }}>
                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.125rem', fontWeight: 700,
                    color: 'var(--color-text-primary)', marginBottom: '0.75rem',
                  }}>Our Mission</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 0 }}>
                    To provide impeccably crafted, premium garments that elevate your everyday comfort without compromise.
                  </p>
                </div>

                {/* Vision */}
                <div style={{
                  marginBottom: '2.5rem',
                  padding: '1.75rem',
                  background: 'var(--color-bg-soft)',
                  borderRadius: '16px',
                  borderLeft: '4px solid var(--color-accent-green)',
                }}>
                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.125rem', fontWeight: 700,
                    color: 'var(--color-text-primary)', marginBottom: '0.75rem',
                  }}>Our Vision</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 0 }}>
                    To become the leading name in premium casual and nightwear, trusted globally for uncompromising quality and ethical production.
                  </p>
                </div>

                {/* Commitment to Quality */}
                <div style={{
                  marginBottom: '2.5rem',
                  padding: '1.75rem',
                  background: 'var(--color-bg-soft)',
                  borderRadius: '16px',
                  borderLeft: '4px solid var(--color-primary-green)',
                }}>
                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.125rem', fontWeight: 700,
                    color: 'var(--color-text-primary)', marginBottom: '0.75rem',
                  }}>Commitment to Quality</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 0 }}>
                    Every garment reflects our dedication to premium craftsmanship. We use only carefully sourced materials tailored to last.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
