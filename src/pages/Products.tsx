import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../store/cartStore';
import { ShoppingBag } from 'lucide-react';

function SkeletonCard() {
  return (
    <div style={{
      background: '#fff', borderRadius: '16px',
      border: '1px solid var(--color-border-light)', overflow: 'hidden',
    }}>
      <div style={{ aspectRatio: '3/4', background: 'var(--color-bg-soft)', animation: 'pulse 2s infinite' }} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <div style={{ height: '10px', background: 'var(--color-bg-soft)', borderRadius: '6px', width: '40%', animation: 'pulse 2s infinite' }} />
        <div style={{ height: '14px', background: 'var(--color-bg-soft)', borderRadius: '6px', width: '75%', animation: 'pulse 2s infinite' }} />
        <div style={{ height: '12px', background: 'var(--color-bg-soft)', borderRadius: '6px', width: '35%', animation: 'pulse 2s infinite', marginTop: '0.25rem' }} />
        <div style={{ height: '40px', background: 'var(--color-bg-soft)', borderRadius: '10px', marginTop: '0.5rem', animation: 'pulse 2s infinite' }} />
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const addItem = useCart((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.from('products').select('*, product_images(image_url)').eq('status', 'ACTIVE');
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError('Unable to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    const imageUrl = product.product_images?.[0]?.image_url || product.images?.[0]?.imageUrl;
    addItem({
      id: product.id, name: product.name, price: product.price,
      category: product.category,
      imageUrl: imageUrl,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const displayed = categoryFilter
    ? products.filter((p: any) => p.category === categoryFilter)
    : products;

  const tabs = [
    { label: 'All', value: null },
    { label: "Men's", value: 'Men' },
    { label: "Women's", value: 'Women' },
    { label: 'Unisex', value: 'Unisex' },
  ];

  return (
    <div style={{ background: 'var(--color-bg-soft)', minHeight: '100vh' }}>

      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0A3D1F 0%, #166534 60%, #15803D 100%)',
        padding: '5rem 1.25rem 4rem',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-8%',
          width: '400px', height: '400px',
          background: 'rgba(34,197,94,0.08)', borderRadius: '50%',
          filter: 'blur(50px)', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="label-overline" style={{ color: '#22C55E', marginBottom: '0.75rem' }}>
            {categoryFilter ? `${categoryFilter}'s Wear` : 'All Collections'}
          </p>
          <h1 className="heading-section" style={{ color: '#fff', marginBottom: '0.75rem' }}>
            {categoryFilter ? `${categoryFilter}'s Collection` : 'Our Products'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9375rem', maxWidth: '440px', margin: '0 auto', lineHeight: 1.7 }}>
            Premium garments crafted for comfort, style, and lasting quality.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid var(--color-border-light)',
        position: 'sticky', top: '72px', zIndex: 30,
      }}>
        <div className="container-site">
          <div style={{
            display: 'flex', gap: '0.5rem',
            overflowX: 'auto', padding: '1rem 0',
            scrollbarWidth: 'none',
          }} className="scrollbar-none">
            {tabs.map(({ label, value }) => {
              const isActive = categoryFilter === value;
              return (
                <Link
                  key={label}
                  to={value ? `/products?category=${value}` : '/products'}
                  style={{
                    display: 'inline-flex', flexShrink: 0,
                    padding: '0.5rem 1.25rem',
                    borderRadius: '999px',
                    fontSize: '0.875rem', fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all var(--transition-fast)',
                    background: isActive ? 'var(--color-primary-green)' : 'transparent',
                    color: isActive ? '#fff' : 'var(--color-text-secondary)',
                    border: isActive ? 'none' : '1px solid var(--color-border-light)',
                    boxShadow: isActive ? '0 4px 12px rgba(22,101,52,0.25)' : 'none',
                  }}
                >{label}</Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container-site section-gap">
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="state-error">{error}</div>
        ) : displayed.length === 0 ? (
          <div className="state-empty">
            <ShoppingBag size={48} style={{ color: 'var(--color-border-dark)', marginBottom: '1rem' }} />
            <p style={{ fontWeight: 600, fontSize: '1.125rem', color: 'var(--color-text-primary)' }}>No products found</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>Check back soon for new arrivals.</p>
            <Link to="/products" className="btn-secondary">View All</Link>
          </div>
        ) : (
          <>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.5rem',
            }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Showing <strong style={{ color: 'var(--color-text-primary)' }}>{displayed.length}</strong> products
              </p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}>
              {displayed.map((p: any) => {
                const imageUrl = p.product_images?.[0]?.image_url || p.images?.[0]?.imageUrl;
                const isAdded = addedId === p.id;
                return (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    className="product-card"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="product-card-image">
                      {imageUrl ? (
                        <img src={imageUrl} alt={p.name} loading="lazy" />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'var(--color-bg-soft)', fontSize: '2.5rem',
                        }}>👕</div>
                      )}
                      {p.featured && (
                        <div style={{ position: 'absolute', top: '0.875rem', left: '0.875rem' }}>
                          <span className="badge-featured">Featured</span>
                        </div>
                      )}
                    </div>

                    <div className="product-card-body" style={{ padding: '1.125rem' }}>
                      <p style={{
                        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em',
                        textTransform: 'uppercase', color: 'var(--color-text-secondary)',
                        marginBottom: '0.375rem',
                      }}>{p.category}</p>
                      <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1rem', fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.35, marginBottom: '0.5rem',
                      }} className="line-clamp-2">{p.name}</h3>
                      <p style={{
                        fontSize: '1.0625rem', fontWeight: 700,
                        color: 'var(--color-primary-green)',
                        marginTop: 'auto', paddingTop: '0.25rem', marginBottom: 0,
                      }}>₹{p.price}</p>
                    </div>

                    <div className="product-card-footer" style={{ padding: '0 1.125rem 1.125rem' }}>
                      <button
                        onClick={e => handleAddToCart(e, p)}
                        className={`btn-cart${isAdded ? ' btn-cart-added' : ''}`}
                        style={{ borderRadius: '10px', padding: '0.625rem' }}
                      >
                        {isAdded ? '✓ Added to Cart' : 'Add to Cart'}
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}