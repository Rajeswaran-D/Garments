import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';


export default function Contact() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    supabase.from('settings').select('*').single().then(({ data, error }) => {
      if (!error && data) {
        setSettings({
          ...data,
          whatsappNumber: data.whatsapp_number,
          instagramUrl: data.instagram_url,
          facebookUrl: data.facebook_url,
        });
      }
    });
  }, []);

  const contactItems = [
    settings?.whatsappNumber && {
      icon: Phone,
      label: 'WhatsApp / Phone',
      sub: 'We typically reply within a few hours.',
      href: `https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`,
      value: `+${settings.whatsappNumber.replace(/\D/g, '')}`,
    },
    settings?.email && {
      icon: Mail,
      label: 'Email',
      sub: 'For detailed inquiries and support.',
      href: `mailto:${settings.email}`,
      value: settings.email,
    },
    settings?.address && {
      icon: MapPin,
      label: 'Location',
      sub: 'Visit us during business hours.',
      href: null,
      value: settings.address,
    },
    {
      icon: Clock,
      label: 'Business Hours',
      sub: null,
      href: null,
      value: 'Mon – Sat: 9:00 AM – 6:00 PM\nSunday: Closed',
    },
  ].filter(Boolean) as {
    icon: React.ComponentType<any>;
    label: string;
    sub: string | null;
    href: string | null;
    value: string;
  }[];

  return (
    <div style={{ background: 'var(--color-bg-soft)', minHeight: '100vh' }}>

      {/* ─── Hero ─── */}
      <div style={{
        background: 'linear-gradient(135deg, #0A3D1F 0%, #166534 60%, #15803D 100%)',
        padding: '6rem 1.25rem',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-8%',
          width: '450px', height: '450px',
          background: 'rgba(34,197,94,0.08)', borderRadius: '50%',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="label-overline" style={{ color: '#22C55E', marginBottom: '1rem' }}>Get In Touch</p>
          <h1 className="heading-section" style={{ color: '#fff', marginBottom: '1.25rem' }}>Contact Us</h1>
          <p style={{
            color: 'rgba(255,255,255,0.75)', fontSize: '1rem',
            lineHeight: 1.75, maxWidth: '500px', margin: '0 auto',
          }}>
            We're here to help. Reach out via WhatsApp, email, or visit our office.
          </p>
        </div>
      </div>

      {/* ─── Two-Column Layout ─── */}
      <section className="section-gap">
        <div className="container-site">
          <div className="container-content">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              alignItems: 'start',
            }}>

              {/* Left: Contact Information */}
              <div style={{
                background: '#fff',
                borderRadius: '20px',
                padding: '2.5rem',
                border: '1px solid var(--color-border-light)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.5rem', fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: '2rem',
                }}>Contact Information</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                  {contactItems.map(({ icon: Icon, label, sub, href, value }) => (
                    <div key={label} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '2.75rem', height: '2.75rem', flexShrink: 0,
                        background: '#DCFCE7', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--color-primary-green)',
                      }}>
                        <Icon size={18} strokeWidth={2} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '0.2rem' }}>{label}</p>
                        {sub && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.3rem' }}>{sub}</p>}
                        {href ? (
                          <a href={href} target="_blank" rel="noopener noreferrer" style={{
                            color: 'var(--color-primary-green)', fontWeight: 600,
                            fontSize: '0.9rem', textDecoration: 'none',
                          }} onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                          >{value}</a>
                        ) : (
                          <p style={{ color: 'var(--color-text-primary)', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'pre-line', marginBottom: 0 }}>{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* WhatsApp CTA */}
                {settings?.whatsappNumber && (
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp"
                    style={{ width: '100%', marginTop: '2rem' }}
                  >
                    💬 Chat on WhatsApp
                  </a>
                )}
              </div>

              {/* Right: Map Placeholder */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Map embed placeholder */}
                <div style={{
                  background: '#fff',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border-light)',
                  minHeight: '320px',
                  position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {/* If we had a real maps URL we'd use an iframe, for now a styled placeholder */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, #F8FAF8 0%, #DCFCE7 100%)',
                  }} />
                  {/* Grid lines for map feel */}
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }} viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="#166534" strokeWidth="1"/>
                    ))}
                    {Array.from({ length: 10 }).map((_, i) => (
                      <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="320" stroke="#166534" strokeWidth="1"/>
                    ))}
                  </svg>
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem' }}>
                    <div style={{
                      width: '60px', height: '60px',
                      background: '#fff', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 1rem',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    }}>
                      <MapPin size={24} style={{ color: 'var(--color-primary-green)' }} />
                    </div>
                    <h3 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.125rem', fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      marginBottom: '0.5rem',
                    }}>Visit Our Office</h3>
                    <p style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: '0.85rem', lineHeight: 1.6,
                      maxWidth: '260px', margin: '0 auto 1.25rem',
                    }}>
                      {settings?.address || 'Connect with our team directly — we\'re always happy to meet customers and wholesale partners.'}
                    </p>
                    {settings?.address && (
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.625rem 1.25rem' }}
                      >
                        Open in Google Maps
                      </a>
                    )}
                  </div>
                </div>

                {/* Quick Info Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { label: 'Response Time', value: '< 2 Hours', icon: '⚡' },
                    { label: 'Languages', value: 'English, Tamil', icon: '🌐' },
                    { label: 'Support Days', value: 'Mon – Sat', icon: '📅' },
                    { label: 'Order Via', value: 'WhatsApp', icon: '📱' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} style={{
                      background: '#fff', borderRadius: '14px',
                      padding: '1.25rem', border: '1px solid var(--color-border-light)',
                      textAlign: 'center',
                    }}>
                      <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: '0.5rem' }}>{icon}</span>
                      <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>{label}</p>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}