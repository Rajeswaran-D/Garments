const fs = require('fs');
const path = require('path');

const files = {
  'src/components/Layout.tsx': `
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-warm-ivory)]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[var(--color-warm-ivory)]/80 backdrop-blur-md border-b border-[var(--color-light-sand)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="text-2xl font-bold tracking-widest text-[var(--color-charcoal)] uppercase">
              Shona Garments
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/" className="text-sm uppercase tracking-widest hover:text-[var(--color-luxury-bronze)]">Home</Link>
              <Link to="/products" className="text-sm uppercase tracking-widest hover:text-[var(--color-luxury-bronze)]">Products</Link>
              <Link to="/combos" className="text-sm uppercase tracking-widest hover:text-[var(--color-luxury-bronze)]">Combos</Link>
              <Link to="/contact" className="text-sm uppercase tracking-widest hover:text-[var(--color-luxury-bronze)]">Contact</Link>
              <Link to="/cart" className="p-2 hover:bg-[var(--color-soft-beige)] rounded-full transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-0 right-0 bg-[var(--color-luxury-bronze)] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
              </Link>
            </div>

            {/* Mobile Nav Toggle */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--color-warm-ivory)] pt-24 px-6 flex flex-col space-y-6 md:hidden">
          <Link onClick={() => setMenuOpen(false)} to="/" className="text-2xl uppercase tracking-widest border-b border-[var(--color-light-sand)] pb-4">Home</Link>
          <Link onClick={() => setMenuOpen(false)} to="/products" className="text-2xl uppercase tracking-widest border-b border-[var(--color-light-sand)] pb-4">Products</Link>
          <Link onClick={() => setMenuOpen(false)} to="/combos" className="text-2xl uppercase tracking-widest border-b border-[var(--color-light-sand)] pb-4">Combos</Link>
          <Link onClick={() => setMenuOpen(false)} to="/contact" className="text-2xl uppercase tracking-widest border-b border-[var(--color-light-sand)] pb-4">Contact</Link>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[var(--color-charcoal)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold tracking-widest uppercase mb-4 text-[var(--color-luxury-bronze)]">Shona Garments</h3>
            <p className="text-gray-400 text-sm">Premium Nightwear & Casual Wear for Men and Women.</p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/products" className="hover:text-white">Products</Link></li>
              <li><Link to="/combos" className="hover:text-white">Combos Offers</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Contact</h4>
            <p className="text-gray-400 text-sm">Main Market</p>
            <p className="text-gray-400 text-sm mt-2">WhatsApp: +91 9585009152</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
`,
  'src/pages/Home.tsx': `
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-[var(--color-soft-beige)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-warm-ivory)] to-transparent z-10 opacity-70"></div>
        <div className="relative z-20 text-center px-4 max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-widest uppercase mb-6"
          >
            Elevate Your Comfort
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-10"
          >
            Premium Nightwear & Casual Wear crafted for the perfect balance of style and relaxation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/products" className="inline-block bg-[var(--color-charcoal)] text-white px-8 py-4 uppercase tracking-widest text-sm hover:bg-[var(--color-luxury-bronze)] transition-colors">
              Shop Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-4 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center uppercase tracking-widest mb-16">Discover Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group relative h-[500px] overflow-hidden bg-gray-200 cursor-pointer">
            <div className="absolute inset-0 bg-[var(--color-charcoal)]/20 group-hover:bg-transparent transition-all duration-500 z-10"></div>
            <div className="absolute bottom-8 left-8 z-20">
              <h3 className="text-3xl font-bold text-white uppercase tracking-widest mb-2 drop-shadow-md">Men's</h3>
              <p className="text-white mb-4 drop-shadow-md">Night Wear & Casuals</p>
              <Link to="/products?category=Men" className="text-white underline tracking-widest uppercase text-sm">Shop Now</Link>
            </div>
          </div>
          <div className="group relative h-[500px] overflow-hidden bg-gray-300 cursor-pointer">
            <div className="absolute inset-0 bg-[var(--color-charcoal)]/20 group-hover:bg-transparent transition-all duration-500 z-10"></div>
            <div className="absolute bottom-8 left-8 z-20">
              <h3 className="text-3xl font-bold text-white uppercase tracking-widest mb-2 drop-shadow-md">Women's</h3>
              <p className="text-white mb-4 drop-shadow-md">Night Wear & Casuals</p>
              <Link to="/products?category=Women" className="text-white underline tracking-widest uppercase text-sm">Shop Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="py-24 bg-[var(--color-soft-beige)]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold uppercase tracking-widest mb-8">Uncompromising Quality</h2>
          <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed">
            At Shona Garments, we believe comfort shouldn't sacrifice style. Every piece is crafted from premium fabrics, 
            featuring reinforced stitching and a perfect fit designed to last. Experience luxury in your everyday wear.
          </p>
        </div>
      </section>
    </div>
  );
}
`,
  'src/pages/Products.tsx': `
export default function Products() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold uppercase tracking-widest mb-12 text-center">All Products</h1>
      <div className="text-center text-gray-500">Products will be loaded from the API...</div>
    </div>
  );
}
`,
  'src/pages/Combos.tsx': `
export default function Combos() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold uppercase tracking-widest mb-12 text-center">Combo Offers</h1>
      <div className="text-center text-gray-500">Combos will be loaded from the API...</div>
    </div>
  );
}
`,
  'src/pages/Contact.tsx': `
export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold uppercase tracking-widest mb-8">Contact Us</h1>
      <p className="text-lg text-gray-600 mb-4">We're here to help with your orders and bulk enquiries.</p>
      <div className="mt-8">
        <p className="font-bold uppercase tracking-widest">WhatsApp</p>
        <p className="text-2xl text-[var(--color-luxury-bronze)] mt-2">+91 9585009152</p>
      </div>
    </div>
  );
}
`,
  'src/pages/AdminLogin.tsx': `
export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-warm-ivory)]">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center uppercase tracking-widest mb-6">Admin Login</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input type="text" className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="w-full border p-2 rounded" />
          </div>
          <button type="button" className="w-full bg-[var(--color-charcoal)] text-white py-2 rounded uppercase tracking-widest">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
`,
  'src/pages/AdminDashboard.tsx': `
export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome to the admin panel. Manage products, combos, and settings from here.</p>
    </div>
  );
}
`,
  'src/components/AdminLayout.tsx': `
import { Outlet, Link } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-8 tracking-widest uppercase">Shona Admin</h2>
        <nav className="space-y-4">
          <Link to="/admin" className="block hover:text-gray-300">Dashboard</Link>
          <Link to="/" className="block text-gray-500 text-sm mt-8">← Back to Site</Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim());
  console.log('Created:', fullPath);
}
