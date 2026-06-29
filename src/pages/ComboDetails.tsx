import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ChevronRight, Percent, Package, MessageCircle } from 'lucide-react';
import { useCart } from '../store/cartStore';

export default function ComboDetails() {
  const { id } = useParams<{ id: string }>();
  const [combo, setCombo] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCart((state) => state.addItem);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: comboData, error: comboErr } = await supabase
          .from('combos')
          .select('*, combo_products(product_id, products(*, product_images(image_url)))')
          .eq('id', id)
          .single();
          
        if (comboErr || !comboData) throw new Error('Combo not found');
          
        const { data: setRes } = await supabase.from('settings').select('*').single();
        
        setCombo(comboData);
        setSettings(setRes);
      } catch {
        setError('Combo not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleWhatsAppOrder = () => {
    const whatsApp = settings?.whatsapp_number || '919585009152';
    const bizName = settings?.business_name || 'Shona Garments';
    if (!combo) return;
    const products = combo.combo_products?.map((cp: any) => cp.products?.name).filter(Boolean).join(', ');
    const msg = `Hello ${bizName}! I'd like to order the *${combo.name}* combo:\n*Includes*: ${products || 'See details'}\n*Discount*: ${combo.discount_percentage}% OFF\nPlease confirm availability.`;
    window.open(`https://wa.me/${whatsApp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAddToCart = () => {
    const products: any[] = combo.combo_products?.map((cp: any) => cp.products).filter(Boolean) || [];
    const original = products.reduce((sum: number, p: any) => sum + (p?.price || 0), 0);
    const final = original - (original * combo.discount_percentage) / 100;
    
    addItem({
      id: 10000 + combo.id,
      name: combo.name + ' (Combo)',
      price: final,
      category: 'Combo Deal',
      imageUrl: combo.banner_image ? combo.banner_image : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ background: '#fff', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="state-loading-spinner" />
      </div>
    );
  }

  if (error || !combo) {
    return (
      <div className="state-error container-site" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
        <p style={{ fontWeight: 600, marginBottom: '1rem' }}>{error || 'Combo not found.'}</p>
        <Link to="/combos" className="btn-secondary">Back to Combos</Link>
      </div>
    );
  }

  const products: any[] = combo.combo_products?.map((cp: any) => cp.products).filter(Boolean) || [];
  const original = products.reduce((sum: number, p: any) => sum + (p?.price || 0), 0);
  const final = original - (original * combo.discount_percentage) / 100;
  const hasPrice = original > 0;

  return (
    <div style={{ background: 'var(--color-bg-soft)', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid var(--color-border-light)',
        padding: '1rem 0',
      }}>
        <div className="container-site">
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={13} />
            <Link to="/combos" style={{ color: 'inherit', textDecoration: 'none' }}>Combos</Link>
            <ChevronRight size={13} />
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {combo.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container-site" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div className="container-content">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
          }}>

            {/* LEFT: Banner Image */}
            <div>
              <div style={{
                position: 'relative',
                background: 'var(--color-bg-soft)',
                aspectRatio: '4/3',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid var(--color-border-light)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
              }}>
                {combo.banner_image ? (
                  <img
                    src={combo.banner_image}
                    alt={combo.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '3rem', color: 'var(--color-text-muted)',
                  }}>🏷️</div>
                )}
                <div style={{
                  position: 'absolute', top: '1.5rem', right: '1.5rem',
                  background: 'var(--color-danger)', color: '#fff',
                  padding: '0.5rem 1rem', borderRadius: '999px',
                  fontWeight: 700, fontSize: '1rem',
                  boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)',
                  display: 'flex', alignItems: 'center', gap: '0.25rem',
                }}>
                  <Percent size={16} strokeWidth={3} /> {combo.discount_percentage}% OFF
                </div>
              </div>
            </div>

            {/* RIGHT: Details */}
            <div style={{ paddingTop: '0.5rem' }}>
              <p className="label-overline" style={{ color: 'var(--color-primary-green)', marginBottom: '0.75rem' }}>Exclusive Combo</p>
              
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                fontWeight: 700, lineHeight: 1.15,
                color: 'var(--color-text-primary)',
                marginBottom: '1rem',
              }}>{combo.name}</h1>

              {combo.description && (
                <p style={{
                  color: 'var(--color-text-secondary)', fontSize: '1rem',
                  lineHeight: 1.7, marginBottom: '2rem',
                }}>{combo.description}</p>
              )}

              {/* Pricing Summary */}
              {hasPrice && (
                <div style={{
                  background: '#fff',
                  borderRadius: '20px', padding: '1.75rem',
                  border: '1px solid var(--color-border-light)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  marginBottom: '2.5rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9375rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Original Value</span>
                    <span style={{ color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>₹{original.toFixed(0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Bundle Discount</span>
                    <span style={{ color: 'var(--color-danger)', fontWeight: 700 }}>-{combo.discount_percentage}%</span>
                  </div>
                  <div style={{ height: '1px', background: 'var(--color-border-light)', margin: '1.25rem 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-primary)' }}>Final Price</span>
                    <span style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '2.25rem', fontWeight: 700,
                      color: 'var(--color-primary-green)', lineHeight: 1,
                    }}>₹{final.toFixed(0)}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                <button
                  onClick={handleAddToCart}
                  className={`btn-cart${added ? ' btn-cart-added' : ''}`}
                  style={{ padding: '1.125rem', fontSize: '0.9375rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Package size={18} />
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleWhatsAppOrder}
                  className="btn-whatsapp"
                  style={{ padding: '1.125rem', fontSize: '0.9375rem', borderRadius: '12px', width: '100%', justifyContent: 'center' }}
                >
                  <MessageCircle size={18} /> Order Combo via WhatsApp
                </button>
              </div>

              {/* Items Included */}
              {products.length > 0 && (
                <div>
                  <h3 style={{
                    fontSize: '0.875rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    color: 'var(--color-text-primary)', marginBottom: '1.25rem',
                  }}>Items Included in this Bundle</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {products.map((p: any) => (
                      <Link key={p.id} to={`/products/${p.id}`} style={{
                        display: 'flex', alignItems: 'center', gap: '1.25rem',
                        padding: '1rem', background: '#fff',
                        borderRadius: '16px', border: '1px solid var(--color-border-light)',
                        textDecoration: 'none', transition: 'box-shadow var(--transition-fast)',
                      }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}
                      >
                        <div style={{
                          width: '64px', height: '80px', flexShrink: 0,
                          background: 'var(--color-bg-soft)', borderRadius: '10px',
                          overflow: 'hidden', border: '1px solid var(--color-border-light)',
                        }}>
                          {p.product_images?.[0]?.image_url ? (
                            <img src={p.product_images[0].image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : p.images?.[0]?.imageUrl ? (
                            <img src={p.images[0].imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👕</div>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontWeight: 600, fontSize: '0.9375rem',
                            color: 'var(--color-text-primary)', marginBottom: '0.25rem',
                          }} className="line-clamp-1">{p.name}</p>
                          <p style={{
                            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
                            textTransform: 'uppercase', color: 'var(--color-text-secondary)',
                          }}>{p.category}</p>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', paddingRight: '0.5rem' }}>
                          ₹{p.price}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
