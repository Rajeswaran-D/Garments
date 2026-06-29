import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg-soft)',
      padding: '2rem 1.25rem',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(6rem, 15vw, 10rem)',
        fontWeight: 700,
        color: 'var(--color-primary-green)',
        lineHeight: 1,
        opacity: 0.12,
        marginBottom: '-1rem',
      }}>404</div>

      <div style={{ maxWidth: '480px' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2rem', fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: '1rem', lineHeight: 1.2,
        }}>Page Not Found</h1>
        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.5rem',
        }}>
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home size={16} /> Go Home
          </Link>
          <Link to="/products" className="btn-secondary">
            Shop Products
          </Link>
        </div>
      </div>
    </div>
  );
}
