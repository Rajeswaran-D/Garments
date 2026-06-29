import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Combos from './pages/Combos';
import ComboDetails from './pages/ComboDetails';
import Contact from './pages/Contact';
import About from './pages/About';
import Quality from './pages/Quality';
import BulkOrders from './pages/BulkOrders';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminCombos from './pages/AdminCombos';
import AdminSettings from './pages/AdminSettings';
import AdminOrders from './pages/AdminOrders';

function App() {
  return (
    <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="combos" element={<Combos />} />
            <Route path="combos/:id" element={<ComboDetails />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
            <Route path="quality" element={<Quality />} />
            <Route path="bulk-orders" element={<BulkOrders />} />
            <Route path="cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin login — public */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin routes — protected by JWT guard (Fix 5) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="combos" element={<AdminCombos />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
    </Router>
  );
}

export default App;
