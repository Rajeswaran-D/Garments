import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Lock, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../store/cartStore';
import { supabase } from '../lib/supabase';

interface Settings {
  businessName: string;
  whatsappNumber: string;
}

export default function Cart() {
  const items = useCart((state) => state.items);
  const removeItem = useCart((state) => state.removeItem);
  const updateQty = useCart((state) => state.updateQty);
  const totalPrice = useCart((state) => state.totalPrice());
  const totalCount = useCart((state) => state.totalCount());
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    supabase.from('settings').select('*').single().then(({ data }) => {
      if (data) setSettings({ businessName: data.business_name, whatsappNumber: data.whatsapp_number });
    });
  }, []);

  const handleCheckout = () => {
    if (items.length === 0 || isCheckingOut) return;
    const wa = settings?.whatsappNumber;
    if (!wa) return alert('WhatsApp not configured. Please contact the store.');
    const businessName = settings?.businessName || 'Shona Garments';

    setIsCheckingOut(true);
    const lines = items.map(item =>
      `• *${item.name}*${item.size ? ` (${item.size})` : ''} × ${item.quantity} — ₹${(item.price * item.quantity).toFixed(0)}`
    ).join('\n');

    const msg = `Hello ${businessName}! I'd like to place an order:\n\n${lines}\n\n*Total: ₹${totalPrice.toFixed(0)}*\n\nPlease confirm my order. Thank you!`;
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank');
    setTimeout(() => setIsCheckingOut(false), 3000);
  };

  /* ── EMPTY STATE ── */
  if (items.length === 0) {
    return (
      <div style={{
        background: 'var(--color-bg-soft)', minHeight: '80vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '2rem 1.25rem', textAlign: 'center',
      }}>
        <div style={{
          background: '#fff', borderRadius: '24px',
          padding: '4rem 3rem', maxWidth: '440px', width: '100%',
          border: '1px solid var(--color-border-light)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            width: '80px', height: '80px',
            background: '#DCFCE7', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 2rem',
            color: 'var(--color-primary-green)',
          }}>
            <ShoppingBag size={36} strokeWidth={1.5} />
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.625rem', fontWeight: 700,
            color: 'var(--color-text-primary)', marginBottom: '0.875rem',
          }}>Your bag is empty</h2>
          <p style={{
            color: 'var(--color-text-secondary)', fontSize: '0.9375rem',
            lineHeight: 1.7, marginBottom: '2.5rem',
          }}>
            You haven't added anything yet. Discover our premium collections to get started.
          </p>
          <Link to="/products" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  /* ── CART WITH ITEMS ── */
  return (
    <div style={{ background: 'var(--color-bg-soft)', minHeight: '100vh', paddingBottom: '5rem' }}>

      {/* Header */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid var(--color-border-light)',
        padding: '2rem 0',
      }}>
        <div className="container-site">
          <div className="container-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <Link to="/products" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                fontSize: '0.8rem', color: 'var(--color-text-secondary)',
                textDecoration: 'none', marginBottom: '0.625rem',
                fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                <ArrowLeft size={14} /> Continue Shopping
              </Link>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 700, color: 'var(--color-text-primary)',
              }}>Your Bag</h1>
            </div>
            <span style={{
              background: 'var(--color-bg-soft)',
              border: '1px solid var(--color-border-light)',
              borderRadius: '999px', padding: '0.375rem 1rem',
              fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)',
            }}>
              {totalCount} item{totalCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="container-site" style={{ paddingTop: '2.5rem' }}>
        <div className="container-content">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 360px',
            gap: '2rem',
            alignItems: 'start',
          }}
            className="cart-grid"
          >

            {/* ── LEFT: Cart Items ── */}
            <div style={{
              background: '#fff',
              borderRadius: '20px',
              border: '1px solid var(--color-border-light)',
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}>
              {/* Table head */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr auto auto',
                gap: '1rem', padding: '1rem 1.5rem',
                background: 'var(--color-bg-soft)',
                borderBottom: '1px solid var(--color-border-light)',
              }}
                className="cart-header"
              >
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Product</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', textAlign: 'center' }}>Qty</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', textAlign: 'right' }}>Total</span>
              </div>

              {/* Items */}
              <div style={{}}>
                {items.map((item, idx) => {
                  const key = `${item.id}-${item.size || ''}`;
                  return (
                    <div key={key} style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto auto',
                      gap: '1rem',
                      padding: '1.5rem',
                      borderBottom: idx < items.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                      alignItems: 'center',
                    }}
                      className="cart-item"
                    >
                      {/* Product info */}
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', minWidth: 0 }}>
                        <Link to={`/products/${item.id}`} style={{
                          width: '72px', height: '96px', flexShrink: 0,
                          borderRadius: '12px', overflow: 'hidden',
                          background: 'var(--color-bg-soft)',
                          border: '1px solid var(--color-border-light)',
                          textDecoration: 'none',
                        }}>
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👕</div>
                          )}
                        </Link>
                        <div style={{ minWidth: 0 }}>
                          <Link to={`/products/${item.id}`} style={{ textDecoration: 'none' }}>
                            <h3 style={{
                              fontWeight: 600, fontSize: '0.9375rem',
                              color: 'var(--color-text-primary)', lineHeight: 1.3,
                              marginBottom: '0.25rem',
                            }} className="line-clamp-2">{item.name}</h3>
                          </Link>
                          {item.size && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                              Size: <strong>{item.size}</strong>
                            </p>
                          )}
                          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>₹{item.price}</p>
                          <button
                            onClick={() => removeItem(item.id, item.size)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                              display: 'flex', alignItems: 'center', gap: '0.25rem',
                              fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)',
                              transition: 'color var(--transition-fast)',
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#EF4444'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)'}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border-light)', borderRadius: '10px', overflow: 'hidden' }}>
                        <button
                          onClick={() => updateQty(item.id, item.size, item.quantity - 1)}
                          style={qtyBtn}
                        ><Minus size={14} /></button>
                        <span style={{ width: '2.5rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700 }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.size, item.quantity + 1)}
                          style={qtyBtn}
                        ><Plus size={14} /></button>
                      </div>

                      {/* Price */}
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', textAlign: 'right', minWidth: '60px' }}>
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <div style={{
                background: '#fff',
                borderRadius: '20px',
                border: '1px solid var(--color-border-light)',
                padding: '2rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              }}>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.25rem', fontWeight: 700,
                  color: 'var(--color-text-primary)', marginBottom: '1.75rem',
                }}>Order Summary</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal ({totalCount} items)</span>
                    <span style={{ fontWeight: 700 }}>₹{totalPrice.toFixed(0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Shipping</span>
                    <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Calculated next step</span>
                  </div>
                </div>

                <div style={{
                  borderTop: '1px solid var(--color-border-light)',
                  paddingTop: '1.25rem', marginBottom: '1.75rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.0625rem' }}>Total</span>
                    <span style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.875rem', fontWeight: 700,
                      color: 'var(--color-primary-green)',
                    }}>₹{totalPrice.toFixed(0)}</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', marginBottom: 0 }}>
                    Inclusive of all applicable taxes
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || !settings?.whatsappNumber}
                  className="btn-primary"
                  style={{ width: '100%', padding: '1rem', fontSize: '0.875rem', marginBottom: '1rem', justifyContent: 'center' }}
                >
                  {isCheckingOut ? 'Opening WhatsApp...' : '💬 Checkout via WhatsApp'}
                </button>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  background: 'var(--color-bg-soft)', borderRadius: '10px', padding: '0.75rem',
                  fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500,
                }}>
                  <Lock size={14} style={{ color: 'var(--color-primary-green)' }} />
                  Secure checkout via WhatsApp
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Responsive grid fix */}
      <style>{`
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .cart-header { display: none !important; }
          .cart-item { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const qtyBtn: React.CSSProperties = {
  width: '2.25rem', height: '2.25rem',
  background: 'none', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--color-text-secondary)', transition: 'background-color var(--transition-fast)',
};
