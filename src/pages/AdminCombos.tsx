import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Edit2, X, Upload } from 'lucide-react';
const INITIAL_FORM = { name: '', description: '', discountPercentage: '', productIds: [] as number[] };

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <tr key={i} style={{ animation: 'pulse 2s infinite' }}>
          {Array.from({ length: 5 }).map((__, j) => (
            <td key={j} style={{ padding: '1.25rem' }}>
              <div style={{ height: '16px', background: 'var(--color-bg-soft)', borderRadius: '4px', width: j === 0 ? '60px' : '100%' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function AdminCombos() {
  const [combos, setCombos] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: cData, error: cError } = await supabase
        .from('combos')
        .select(`*, combo_products ( product_id, products ( name ) )`)
        .order('created_at', { ascending: false });
        
      const { data: pData, error: pError } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'ACTIVE');
        
      if (cError) throw cError;
      if (pError) throw pError;

      setCombos(cData || []);
      setProducts(pData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditing(null);
    setFormData(INITIAL_FORM);
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    setFormData({
      name: c.name, description: c.description,
      discountPercentage: String(c.discountPercentage),
      productIds: c.combo_products?.map((cp: any) => cp.product_id) || []
    });
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); };

  const toggleProduct = (id: number) => {
    setFormData(prev => ({
      ...prev,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter(pid => pid !== id)
        : [...prev.productIds, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.productIds.length < 2) {
      return alert('Select at least 2 products for a combo.');
    }
    setSaving(true);
    try {
      let bannerImage = editing?.banner_image;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `combo-images/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath);
        bannerImage = publicUrlData.publicUrl;
      }
      
      const payload = {
        name: formData.name,
        description: formData.description,
        discount_percentage: parseFloat(formData.discountPercentage),
        banner_image: bannerImage,
      };

      let comboId = editing?.id;

      if (editing) {
        const { error } = await supabase.from('combos').update(payload).eq('id', editing.id);
        if (error) throw error;
        showToast('Combo updated successfully.');
      } else {
        const { data, error } = await supabase.from('combos').insert([payload]).select();
        if (error) throw error;
        comboId = data[0].id;
        showToast('Combo created successfully.');
      }
      
      // Update Combo Products
      if (editing) {
        await supabase.from('combo_products').delete().eq('combo_id', comboId);
      }
      
      const comboProductsData = formData.productIds.map(pid => ({
        combo_id: comboId,
        product_id: pid
      }));
      await supabase.from('combo_products').insert(comboProductsData);

      closeModal();
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to save combo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this combo?')) return;
    try {
      const { error } = await supabase.from('combos').delete().eq('id', id);
      if (error) throw error;
      showToast('Combo deleted.');
      fetchData();
    } catch {
      alert('Failed to delete combo.');
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
          <p className="label-overline" style={{ marginBottom: '0.5rem' }}>Promotions</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.875rem', fontWeight: 700 }}>
            Combos & Deals
          </h1>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.8125rem' }}>
          <Plus size={16} /> Create Combo
        </button>
      </div>

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
                <th>Banner</th>
                <th>Combo Details</th>
                <th>Products Included</th>
                <th>Discount</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : combos.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
                    No combos created yet.
                  </td>
                </tr>
              ) : (
                combos.map(c => (
                  <tr key={c.id}>
                    <td style={{ width: '120px' }}>
                      <div style={{
                        width: '100px', height: '64px',
                        background: 'var(--color-bg-soft)', borderRadius: '8px',
                        overflow: 'hidden', border: '1px solid var(--color-border-light)'
                      }}>
                        {c.banner_image ? (
                          <img src={c.banner_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>🏷️</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{c.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }} className="line-clamp-1">{c.description}</div>
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {c.combo_products?.map((cp: any) => (
                          <div key={cp.id}>• {cp.products?.name}</div>
                        ))}
                      </div>
                    </td>
                    <td><span className="badge-featured" style={{ background: 'var(--color-danger)', color: '#fff' }}>{c.discount_percentage}% OFF</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => openEdit(c)} style={actionBtn}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(c.id)} style={{ ...actionBtn, color: 'var(--color-danger)' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
            width: '100%', maxWidth: '640px',
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-border-light)',
              position: 'sticky', top: 0, background: '#fff', zIndex: 10,
            }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {editing ? 'Edit Combo' : 'Create New Combo'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', color: 'var(--color-text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="form-label">Combo Name *</label>
                <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Description *</label>
                <textarea required className="form-input" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ height: '80px', resize: 'none' }} />
              </div>
              <div>
                <label className="form-label">Discount Percentage (%) *</label>
                <input required type="number" min="0" max="100" step="0.1" className="form-input" value={formData.discountPercentage} onChange={e => setFormData({ ...formData, discountPercentage: e.target.value })} />
              </div>
              
              <div>
                <label className="form-label">Banner Image</label>
                {editing?.banner_image && !imageFile && (
                  <div style={{ marginBottom: '1rem', width: '120px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border-light)' }}>
                    <img src={editing.banner_image} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

              <div>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  Select Products (Min 2)
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-primary-green)', fontWeight: 700 }}>{formData.productIds.length} Selected</span>
                </label>
                <div style={{
                  maxHeight: '200px', overflowY: 'auto',
                  border: '1px solid var(--color-border-light)', borderRadius: '12px',
                  display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--color-border-light)',
                }}>
                  {products.map(p => {
                    const active = formData.productIds.includes(p.id);
                    return (
                      <label key={p.id} style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        padding: '0.875rem 1rem', cursor: 'pointer',
                        background: active ? 'var(--color-bg-soft)' : '#fff',
                        transition: 'background-color var(--transition-fast)',
                      }}>
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleProduct(p.id)}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-green)', cursor: 'pointer' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>₹{p.price}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-light)' }}>
                <button type="button" onClick={closeModal} className="btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                  {saving ? 'Saving...' : 'Save Combo'}
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
