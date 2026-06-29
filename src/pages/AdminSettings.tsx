import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Upload } from 'lucide-react';

interface SettingsForm {
  businessName: string;
  whatsappNumber: string;
  address: string;
  email: string;
  heroBanner: string;
  instagramUrl: string;
  facebookUrl: string;
}

const EMPTY: SettingsForm = {
  businessName: '', whatsappNumber: '', address: '',
  email: '', heroBanner: '', instagramUrl: '', facebookUrl: '',
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingsForm>(EMPTY);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase.from('settings').select('*').single();
        if (data) {
          setSettings({
            businessName: data.business_name || '',
            whatsappNumber: data.whatsapp_number || '',
            address: data.address || '',
            email: data.email || '',
            heroBanner: data.hero_banner || '',
            instagramUrl: data.instagram_url || '',
            facebookUrl: data.facebook_url || '',
          });
        }
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let heroBanner = settings.heroBanner;

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `settings/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath);
        heroBanner = publicUrlData.publicUrl;
      }

      const payload = {
        business_name: settings.businessName,
        whatsapp_number: settings.whatsappNumber,
        address: settings.address,
        email: settings.email,
        hero_banner: heroBanner,
        instagram_url: settings.instagramUrl,
        facebook_url: settings.facebookUrl,
      };

      const { data: existingData } = await supabase.from('settings').select('id').single();
      if (existingData) {
        await supabase.from('settings').update(payload).eq('id', existingData.id);
      } else {
        await supabase.from('settings').insert([payload]);
      }

      setSettings(s => ({ ...s, heroBanner }));
      setImageFile(null);
      showToast('Settings saved successfully.');
    } catch {
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const Field = ({
    label, id, type = 'text', value, onChange, hint, placeholder,
  }: {
    label: string; id: string; type?: string;
    value: string; onChange: (v: string) => void;
    hint?: string; placeholder?: string;
  }) => (
    <div>
      <label htmlFor={id} className="form-label">{label}</label>
      <input
        id={id}
        type={type}
        className="form-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {hint && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.375rem', marginBottom: 0 }}>{hint}</p>}
    </div>
  );

  return (
    <div style={{ maxWidth: '760px' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 50,
          background: 'var(--color-primary-green)', color: '#fff',
          padding: '0.875rem 1.5rem', borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          fontSize: '0.875rem', fontWeight: 600,
          animation: 'fadeUp 0.3s ease both',
        }}>
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p className="label-overline" style={{ marginBottom: '0.5rem' }}>Configuration</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.875rem', fontWeight: 700 }}>
          Website Settings
        </h1>
      </div>

      {loading ? (
        <div className="state-loading"><div className="state-loading-spinner" /></div>
      ) : (
        <form onSubmit={handleSubmit}>

          {/* Business Info */}
          <Section title="Business Information">
            <Field
              label="Business Name" id="businessName"
              value={settings.businessName}
              onChange={v => setSettings(s => ({ ...s, businessName: v }))}
              placeholder="Shona Garments"
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <Field
                label="WhatsApp Number" id="whatsappNumber"
                value={settings.whatsappNumber}
                onChange={v => setSettings(s => ({ ...s, whatsappNumber: v }))}
                hint="Include country code, e.g. 919585009152"
                placeholder="919585009152"
              />
              <Field
                label="Contact Email" id="email" type="email"
                value={settings.email}
                onChange={v => setSettings(s => ({ ...s, email: v }))}
                placeholder="hello@shonagarments.com"
              />
            </div>
            <div>
              <label htmlFor="address" className="form-label">Business Address</label>
              <textarea
                id="address"
                className="form-input"
                value={settings.address}
                onChange={e => setSettings(s => ({ ...s, address: e.target.value }))}
                style={{ height: '80px', resize: 'none' }}
                placeholder="123, Garment Street, City, State, PIN"
              />
            </div>
          </Section>

          {/* Social Links */}
          <Section title="Social Links">
            <Field
              label="Instagram URL" id="instagramUrl"
              value={settings.instagramUrl}
              onChange={v => setSettings(s => ({ ...s, instagramUrl: v }))}
              placeholder="https://instagram.com/shonagarments"
            />
            <Field
              label="Facebook URL" id="facebookUrl"
              value={settings.facebookUrl}
              onChange={v => setSettings(s => ({ ...s, facebookUrl: v }))}
              placeholder="https://facebook.com/shonagarments"
            />
          </Section>

          {/* Hero Banner */}
          <Section title="Hero Banner Image">
            {settings.heroBanner && !imageFile && (
              <div style={{ marginBottom: '1rem' }}>
                <img
                  src={settings.heroBanner}
                  alt="Current banner"
                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--color-border-light)' }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.375rem', marginBottom: 0 }}>Current banner image</p>
              </div>
            )}
            <label style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.875rem 1rem',
              border: '2px dashed var(--color-border-light)',
              borderRadius: '10px', cursor: 'pointer',
              transition: 'border-color var(--transition-fast)',
              color: 'var(--color-text-secondary)',
              fontSize: '0.875rem',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary-green)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-light)'}
            >
              <Upload size={18} style={{ color: 'var(--color-primary-green)', flexShrink: 0 }} />
              {imageFile ? (
                <span style={{ color: 'var(--color-primary-green)', fontWeight: 600 }}>✓ {imageFile.name}</span>
              ) : (
                <span>Click to upload new banner image</span>
              )}
              <input
                type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => setImageFile(e.target.files?.[0] || null)}
              />
            </label>
          </Section>

          {/* Save */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{ padding: '0.9375rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--color-border-light)',
      borderRadius: '16px',
      padding: '1.75rem',
      marginBottom: '1.5rem',
    }}>
      <h2 style={{
        fontSize: '0.75rem', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--color-text-secondary)',
        marginBottom: '1.5rem', paddingBottom: '0.875rem',
        borderBottom: '1px solid var(--color-border-light)',
      }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {children}
      </div>
    </div>
  );
}
