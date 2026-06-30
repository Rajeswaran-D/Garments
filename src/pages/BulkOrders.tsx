import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Package, TrendingDown, HeadphonesIcon, CheckCircle } from 'lucide-react';

export default function BulkOrders() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    supabase.from('settings').select('*').single().then(({ data, error }) => {
      if (!error && data) {
        setSettings({
          businessName: data.business_name,
          whatsappNumber: data.whatsapp_number,
          email: data.email,
        });
      }
    });
  }, []);

  const handleWhatsApp = () => {
    const wa = settings?.whatsappNumber;
    if (!wa) return alert('WhatsApp not configured.');
    const msg = `Hello ${settings.businessName || 'Shona Garments'}! I am interested in placing a Bulk Order. Please share details.`;
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{ background: 'var(--color-bg-soft)', minHeight: '100vh' }}>

      {/* ─── Hero ─── */}
      <div style={{
        background: 'linear-gradient(135deg, #0A3D1F 0%, #166534 55%, #15803D 100%)',
        padding: '6.5rem 1.25rem',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-30%', right: '-8%',
          width: '500px', height: '500px',
          background: 'rgba(34,197,94,0.08)', borderRadius: '50%',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(34,197,94,0.18)',
            color: '#22C55E',
            fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            padding: '0.375rem 1.125rem', borderRadius: '999px',
            border: '1px solid rgba(34,197,94,0.3)',
            marginBottom: '1.5rem',
          }}>B2B & Wholesale</span>
          <h1 className="heading-section" style={{ color: '#fff', marginBottom: '1.25rem' }}>Bulk Orders</h1>
          <p style={{
            color: 'rgba(255,255,255,0.75)', fontSize: '1rem',
            lineHeight: 1.75, maxWidth: '560px', margin: '0 auto 2.5rem',
          }}>
            Partner with us to provide premium garments to your customers. We cater to businesses of all sizes with dedicated support.
          </p>
          <button onClick={handleWhatsApp} className="btn-whatsapp" style={{ padding: '1rem 2.5rem', fontSize: '0.875rem' }}>
            Start WhatsApp Enquiry
          </button>
        </div>
      </div>

      {/* ─── Content ─── */}
      <section className="section-gap">
        <div className="container-site">
          <div className="container-content">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p className="label-overline" style={{ color: 'var(--color-primary-green)', marginBottom: '0.75rem' }}>Why Partner With Us</p>
              <h2 className="heading-section" style={{ marginBottom: '1rem' }}>Our Services</h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              marginBottom: '5rem',
            }}>
              {[
                { icon: Package, title: 'Custom Manufacturing', desc: 'We offer tailored manufacturing solutions for your brand with precision and care.' },
                { icon: TrendingDown, title: 'Wholesale Supply', desc: 'Reliable and consistent supply of our premium collections for retail partners.' },
                { icon: HeadphonesIcon, title: 'Corporate Orders', desc: 'Premium uniforms and corporate gifting solutions designed for everyday comfort.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{
                  background: '#fff', borderRadius: '20px',
                  padding: '2.5rem 2rem', textAlign: 'center',
                  border: '1px solid var(--color-border-light)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 32px rgba(0,0,0,0.07)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = '';
                    (e.currentTarget as HTMLElement).style.boxShadow = '';
                  }}
                >
                  <div style={{
                    width: '4rem', height: '4rem',
                    background: '#DCFCE7', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1.5rem', color: 'var(--color-primary-green)',
                  }}>
                    <Icon size={24} strokeWidth={1.75} />
                  </div>
                  <h3 className="heading-card" style={{ marginBottom: '0.75rem' }}>{title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 0 }}>{desc}</p>
                </div>
              ))}
            </div>

            {/* Included features list */}
            <div style={{
              background: 'linear-gradient(135deg, #0A3D1F 0%, #166534 100%)',
              borderRadius: '20px', padding: '3rem 2.5rem',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: '-20%', right: '-5%',
                width: '300px', height: '300px',
                background: 'rgba(255,255,255,0.04)', borderRadius: '50%',
                filter: 'blur(40px)', pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', alignItems: 'center' }}>
                  <div>
                    <h2 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.75rem', fontWeight: 700,
                      color: '#fff', marginBottom: '1rem', lineHeight: 1.25,
                    }}>Ready to stock premium quality?</h2>
                    <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                      Get in touch with our wholesale team via WhatsApp to discuss your requirements and receive a custom quote within 24 hours.
                    </p>
                    <button onClick={handleWhatsApp} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                      padding: '1rem 2.25rem', background: '#fff',
                      color: 'var(--color-primary-green)', fontWeight: 700,
                      fontSize: '0.8125rem', letterSpacing: '0.08em',
                      textTransform: 'uppercase', borderRadius: '12px',
                      border: 'none', cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    }}>
                      Start WhatsApp Chat
                    </button>
                  </div>
                  <div>
                    {[
                      'Dedicated account manager',
                      'Custom branding options available',
                      'Priority order processing',
                      'Exclusive wholesale catalogue',
                      'Flexible dispatch times',
                    ].map(item => (
                      <div key={item} style={{
                        display: 'flex', alignItems: 'center', gap: '0.875rem',
                        marginBottom: '1rem',
                      }}>
                        <CheckCircle size={18} style={{ color: '#22C55E', flexShrink: 0 }} />
                        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
