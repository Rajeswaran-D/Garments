import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/admin', { replace: true });
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) throw error;
      if (data.session) {
        localStorage.setItem('adminToken', data.session.access_token);
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0A3D1F 0%, #166534 60%, #15803D 100%)',
      padding: '1rem',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: '500px', height: '500px',
        background: 'rgba(34,197,94,0.08)', borderRadius: '50%',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', left: '-8%',
        width: '400px', height: '400px',
        background: 'rgba(255,255,255,0.04)', borderRadius: '50%',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      <div className="animate-fade-up" style={{
        background: '#fff',
        borderRadius: '24px',
        padding: 'clamp(1.5rem, 5vw, 2.5rem)',
        width: '100%', maxWidth: '420px',
        boxSizing: 'border-box',
        boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
        position: 'relative',
      }}>
        {/* Top accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #166534, #22C55E)',
          borderRadius: '24px 24px 0 0',
        }} />

        {/* Icon */}
        <div style={{
          width: '3.5rem', height: '3.5rem',
          background: '#DCFCE7', borderRadius: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: 'var(--color-primary-green)',
        }}>
          <Lock size={22} strokeWidth={2} />
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.5rem', fontWeight: 700,
          textAlign: 'center', color: 'var(--color-text-primary)',
          marginBottom: '0.375rem',
        }}>Admin Login</h1>
        <p style={{
          textAlign: 'center', color: 'var(--color-text-secondary)',
          fontSize: '0.875rem', marginBottom: '2rem',
        }}>Sign in to manage Shona Garments</p>

        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            color: '#DC2626', padding: '0.75rem 1rem',
            borderRadius: '10px', fontSize: '0.875rem',
            textAlign: 'center', marginBottom: '1.25rem',
          }}>{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input"
              placeholder="admin@shonagarments.com"
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: '0.875rem', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-text-secondary)', padding: 0,
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.9375rem', fontSize: '0.875rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}