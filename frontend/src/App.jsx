import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminUsers from './admin/AdminUsers';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminCoupons from './admin/AdminCoupons';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Routes>
        {/* Auth pages - no navbar/footer */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="coupons" element={<AdminCoupons />} />
        </Route>

        {/* Main routes with navbar/footer */}
        <Route path="/" element={
          <>
            <Navbar />
            <main className="flex-1">
              <HomePage />
            </main>
            <Footer />
          </>
        } />
        <Route path="/shop" element={
          <>
            <Navbar />
            <main className="flex-1">
              <ShopPage />
            </main>
            <Footer />
          </>
        } />
        <Route path="/product/:id" element={
          <>
            <Navbar />
            <main className="flex-1">
              <ProductPage />
            </main>
            <Footer />
          </>
        } />
        <Route path="/cart" element={
          <>
            <Navbar />
            <main className="flex-1">
              <CartPage />
            </main>
            <Footer />
          </>
        } />
        <Route path="/checkout" element={
          <>
            <Navbar />
            <main className="flex-1">
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            </main>
            <Footer />
          </>
        } />
        <Route path="/account" element={
          <>
            <Navbar />
            <main className="flex-1">
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
