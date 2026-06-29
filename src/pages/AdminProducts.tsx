import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Edit2, X, Upload } from 'lucide-react';

const SIZES_ALL = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const INITIAL_FORM = {
  name: '', description: '', category: 'Men', status: 'ACTIVE',
  price: '', stock: '', featured: false, sizes: [] as string[]
};

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} style={{ animation: 'pulse 2s infinite' }}>
          {Array.from({ length: 7 }).map((__, j) => (
            <td key={j} style={{ padding: '1.25rem' }}>
              <div style={{ height: '16px', background: 'var(--color-bg-soft)', borderRadius: '4px', width: j === 0 ? '40px' : '100%' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState<any>(INITIAL_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            image_url
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProducts(data || []);
      setError(null);
    } catch {
      setError('Database unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditing(null);
    setFormData(INITIAL_FORM);
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditing(p);
    setFormData({
      name: p.name, description: p.description, category: p.category,
      status: p.status, price: String(p.price), stock: String(p.stock),
      featured: p.featured,
      sizes: p.sizes ? p.sizes.split(',').map((s: string) => s.trim()) : []
    });
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); };

  const toggleSize = (size: string) => {
    setFormData((prev: any) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s: string) => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = editing?.product_images?.[0]?.image_url || null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        imageUrl = publicUrlData.publicUrl;
      }
      
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        status: formData.status,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        featured: formData.featured,
        sizes: formData.sizes.join(',') || null,
      };
      
      let productId = editing?.id;

      if (editing) {
        const { error: updateError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editing.id);
        if (updateError) throw updateError;
        showToast('Product updated successfully.');
      } else {
        const { data: insertedData, error: insertError } = await supabase
          .from('products')
          .insert([payload])
          .select();
        if (insertError) throw insertError;
        productId = insertedData[0].id;
        showToast('Product added successfully.');
      }
      
      // Update image if a new one was uploaded
      if (imageFile && imageUrl) {
        if (editing) {
          await supabase.from('product_images').delete().eq('product_id', productId);
        }
        await supabase.from('product_images').insert([{ product_id: productId, image_url: imageUrl }]);
      }

      closeModal();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      showToast('Product deleted.');
      fetchProducts();
    } catch {
      alert('Failed to delete product.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      {toast && (
        <div style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 100,
          background: 'var(--color-primary-green)', color: '#fff',
          padding: '0.875rem 1.5rem', borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          fontSize: '0.875rem', fontWeight: 600,
          animation: 'fadeUp 0.3s ease both',
        }}>✓ {toast}</div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="label-overline" style={{ marginBottom: '0.5rem' }}>Inventory</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.875rem', fontWeight: 700 }}>
            Products
          </h1>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.8125rem' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {error && <div className="state-error" style={{ margin: '0 0 2rem' }}>{error}</div>}

      {/* Table */}
      <div style={{
        background: '#fff',
        border: '1px solid var(--color-border-light)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Info</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
                    No products yet.
                  </td>
                </tr>
              ) : (
                products.map((p: any) => {
                  const img = p.product_images?.[0]?.image_url;
                  return (
                    <tr key={p.id}>
                      <td style={{ width: '80px' }}>
                        <div style={{
                          width: '48px', height: '64px',
                          background: 'var(--color-bg-soft)', borderRadius: '8px',
                          overflow: 'hidden', border: '1px solid var(--color-border-light)'
                        }}>
                          {img ? (
                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>👕</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {p.name}
                          {p.featured && <span className="badge-featured" style={{ fontSize: '0.55rem', padding: '0.15rem 0.5rem' }}>Featured</span>}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }} className="line-clamp-1">{p.sizes || 'No variants'}</div>
                      </td>
                      <td style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{p.category}</td>
                      <td style={{ fontWeight: 700, color: 'var(--color-primary-green)' }}>₹{p.price}</td>
                      <td style={{ fontSize: '0.875rem', color: p.stock > 10 ? 'var(--color-text-secondary)' : 'var(--color-danger)' }}>
                        {p.stock} units
                      </td>
                      <td><span className={p.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}>{p.status}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button onClick={() => openEdit(p)} style={actionBtn}>
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} style={{ ...actionBtn, color: 'var(--color-danger)' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}>
          <div className="animate-fade-up" style={{
            background: '#fff', borderRadius: '24px',
            width: '100%', maxWidth: '720px',
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-border-light)',
              position: 'sticky', top: 0, background: '#fff', zIndex: 10,
            }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {editing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', color: 'var(--color-text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Product Name *</label>
                  <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Description *</label>
                  <textarea required className="form-input" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ height: '100px', resize: 'none' }} />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <select className="form-input" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Price (₹) *</label>
                  <input required type="number" min="0" step="0.01" className="form-input" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Stock *</label>
                  <input required type="number" min="0" className="form-input" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Available Sizes</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {SIZES_ALL.map(size => {
                      const active = formData.sizes.includes(size);
                      return (
                        <button
                          key={size} type="button" onClick={() => toggleSize(size)}
                          style={{
                            padding: '0.5rem 1rem', borderRadius: '8px',
                            fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
                            border: `1px solid ${active ? 'var(--color-primary-green)' : 'var(--color-border-light)'}`,
                            background: active ? 'var(--color-primary-green)' : '#fff',
                            color: active ? '#fff' : 'var(--color-text-secondary)',
                            transition: 'all var(--transition-fast)',
                          }}
                        >{size}</button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--color-bg-soft)', borderRadius: '12px' }}>
                  <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-green)', cursor: 'pointer' }} />
                  <label htmlFor="featured" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', cursor: 'pointer' }}>Mark as Featured Product</label>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Product Image</label>
                  {editing?.product_images?.[0]?.image_url && !imageFile && (
                    <div style={{ marginBottom: '1rem', width: '80px', height: '104px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border-light)' }}>
                      <img src={editing.product_images[0].image_url} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem',
                    border: '2px dashed var(--color-border-light)', borderRadius: '10px', cursor: 'pointer',
                    color: 'var(--color-text-secondary)', fontSize: '0.875rem',
                  }}>
                    <Upload size={18} style={{ color: 'var(--color-primary-green)' }} />
                    {imageFile ? <span style={{ color: 'var(--color-primary-green)', fontWeight: 600 }}>✓ {imageFile.name}</span> : <span>Upload new image...</span>}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setImageFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-light)' }}>
                <button type="button" onClick={closeModal} className="btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const actionBtn: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  padding: '0.5rem', borderRadius: '8px',
  color: 'var(--color-text-secondary)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background-color var(--transition-fast)',
};
