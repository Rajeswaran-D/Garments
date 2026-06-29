import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../store/cartStore';
import { ChevronRight, Package, MessageCircle } from 'lucide-react';
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [added, setAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setActiveImage(0);
      setSelectedSize('');
      try {
        const { data: prodData, error: prodErr } = await supabase
          .from('products')
          .select('*, product_images(image_url)')
          .eq('id', id)
          .single();
          
        if (prodErr || !prodData) throw new Error('Product not found');
          
        const { data: setRes } = await supabase.from('settings').select('*').single();
        
        setProduct(prodData);
        setSettings(setRes);

        // Fetch related products
        const { data: allData } = await supabase
          .from('products')
          .select('*, product_images(image_url)')
          .eq('category', prodData.category)
          .eq('status', 'ACTIVE')
          .neq('id', id)
          .limit(4);
          
        setRelated(allData || []);
      } catch {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const sizes = product.sizes ? product.sizes.split(',').map((s: string) => s.trim()) : [];
    if (sizes.length > 0 && !selectedSize) {
      alert('Please select a size before adding to cart.');
      return;
    }
    const imageUrl = product.product_images?.[0]?.image_url || product.images?.[0]?.imageUrl;
    addItem({
      id: product.id, name: product.name, price: product.price,
      category: product.category,
      imageUrl: imageUrl,
      size: selectedSize || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBulkOrder = () => {
    const whatsApp = settings?.whatsapp_number || '919585009152';
    const bizName = settings?.business_name || 'Shona Garments';
    const msg = `Hello ${bizName}! I'm interested in a *Bulk Order*:\n*Product*: ${product?.name}\n*Category*: ${product?.category}\nPlease share bulk pricing.`;
    window.open(`https://wa.me/${whatsApp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) {
    return (
      <div style={{ background: '#fff', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="state-loading-spinner" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="state-error container-site" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
        <p style={{ fontWeight: 600, marginBottom: '1rem' }}>{error || 'Product not found.'}</p>
        <Link to="/products" className="btn-secondary">Back to Products</Link>
      </div>
    );
  }

  const images: any[] = product.product_images?.map((i: any) => ({ imageUrl: i.image_url })) || product.images || [];
  const availableSizes: string[] = product.sizes
    ? product.sizes.split(',').map((s: string) => s.trim()).filter((s: string) => SIZES.includes(s))
    : [];

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
            <Link to="/products" style={{ color: 'inherit', textDecoration: 'none' }}>Products</Link>
            <ChevronRight size={13} />
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container-site" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div className="container-content">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '4rem',
            marginBottom: '5rem',
          }}>

            {/* LEFT: Image Gallery */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Main image */}
              <div style={{
                position: 'relative',
                background: 'var(--color-bg-soft)',
                aspectRatio: '3/4',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid var(--color-border-light)',
              }}>
                {images[activeImage]?.imageUrl ? (
                  <img
                    src={images[activeImage].imageUrl}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '4rem',
                  }}>👕</div>
                )}
                {product.featured && (
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                    <span className="badge-featured">Featured</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }} className="scrollbar-none">
                  {images.map((img: any, i: number) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(i)}
                      style={{
                        flexShrink: 0, width: '80px', height: '104px',
                        borderRadius: '12px', overflow: 'hidden',
                        border: `2px solid ${activeImage === i ? 'var(--color-primary-green)' : 'transparent'}`,
                        opacity: activeImage === i ? 1 : 0.55,
                        transition: 'all var(--transition-fast)',
                        cursor: 'pointer', background: 'none', padding: 0,
                      }}
                    >
                      <img src={img.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Product Details */}
            <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '0.5rem' }}>
              <p style={{
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em',
                textTransform: 'uppercase', color: 'var(--color-text-secondary)',
                marginBottom: '0.5rem',
              }}>{product.category}</p>

              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.625rem, 3vw, 2.25rem)',
                fontWeight: 700, lineHeight: 1.15,
                color: 'var(--color-text-primary)',
                marginBottom: '1.25rem',
              }}>{product.name}</h1>

              <div style={{
                fontSize: '2rem', fontWeight: 700,
                color: 'var(--color-primary-green)',
                marginBottom: '2rem',
              }}>₹{product.price}</div>

              {/* Size Selector */}
              {availableSizes.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block', fontSize: '0.75rem', fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'var(--color-text-primary)', marginBottom: '0.875rem',
                  }}>Select Size</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                    {availableSizes.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        style={{
                          width: '52px', height: '52px',
                          borderRadius: '12px', fontSize: '0.875rem',
                          fontWeight: 700, cursor: 'pointer',
                          border: `2px solid ${selectedSize === s ? 'var(--color-primary-green)' : 'var(--color-border-light)'}`,
                          background: selectedSize === s ? 'var(--color-primary-green)' : '#fff',
                          color: selectedSize === s ? '#fff' : 'var(--color-text-primary)',
                          transition: 'all var(--transition-fast)',
                        }}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quality Box */}
              <div style={{
                background: 'var(--color-bg-soft)',
                borderRadius: '14px', padding: '1.25rem',
                border: '1px solid var(--color-border-light)',
                marginBottom: '2rem',
              }}>
                <h3 style={{
                  fontSize: '0.75rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'var(--color-text-primary)', marginBottom: '0.625rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <span style={{ color: 'var(--color-primary-green)' }}>✦</span> Quality Note
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 0 }}>
                  {product.description && product.description.length < 200
                    ? product.description
                    : 'Soft-touch comfort crafted with durable stitching and long-lasting colour retention for everyday elegance.'}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <button
                  onClick={handleAddToCart}
                  className={`btn-cart${added ? ' btn-cart-added' : ''}`}
                  style={{ padding: '1rem', fontSize: '0.875rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Package size={17} />
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBulkOrder}
                  className="btn-secondary"
                  style={{ padding: '1rem', fontSize: '0.875rem', width: '100%', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <MessageCircle size={17} />
                  Bulk Order Enquiry
                </button>
              </div>

              {/* Guarantees */}
              <div style={{
                marginTop: '2rem', paddingTop: '1.5rem',
                borderTop: '1px solid var(--color-border-light)',
                display: 'flex', flexDirection: 'column', gap: '0.625rem',
              }}>
                {['Premium quality guaranteed', 'Order via WhatsApp instantly', 'Trusted by 10K+ customers'].map(item => (
                  <p key={item} style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                    fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: 0,
                  }}>
                    <span style={{ color: 'var(--color-primary-green)', fontWeight: 700, fontSize: '1rem' }}>✓</span>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.625rem', fontWeight: 700 }}>
                  You May Also Like
                </h2>
                <Link to={`/products?category=${product.category}`} style={{
                  fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-green)', textDecoration: 'none',
                }}>View All →</Link>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1.25rem',
              }}>
                {related.map((p: any) => {
                  const img = p.product_images?.[0]?.image_url || p.images?.[0]?.imageUrl;
                  return (
                    <Link key={p.id} to={`/products/${p.id}`} className="product-card" style={{ textDecoration: 'none' }}>
                      <div className="product-card-image">
                        {img ? (
                          <img src={img} alt={p.name} loading="lazy" />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👕</div>
                        )}
                      </div>
                      <div className="product-card-body" style={{ padding: '1rem' }}>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.375rem' }} className="line-clamp-2">{p.name}</h3>
                        <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary-green)', marginBottom: 0 }}>₹{p.price}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
