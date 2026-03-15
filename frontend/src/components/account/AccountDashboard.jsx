import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { downloadInvoice, getMyOrders } from '../../services/api';
import SidebarNav from './SidebarNav';
import DashboardOverview from './sections/DashboardOverview';
import ProfileView from './sections/ProfileView';
import EditProfile from './sections/EditProfile';
import OrdersSection from './sections/OrdersSection';
import WishlistGrid from './sections/WishlistGrid';
import AddressesSection from './sections/AddressesSection';
import ChangePassword from './sections/ChangePassword';
import DeleteAccount from './sections/DeleteAccount';
import LoadingSkeleton from '../LoadingSkeleton';

const DEFAULT_ADDRESSES = [
  {
    id: 'home',
    label: 'Home',
    line1: '123 Cocoa Lane',
    line2: 'Suite 202',
    city: 'Choco City',
    state: 'CA',
    zip: '90210',
    phone: '+1 (555) 123-4567',
  },
  {
    id: 'work',
    label: 'Work',
    line1: '77 Truffle Street',
    line2: 'Floor 5',
    city: 'Sweetville',
    state: 'NY',
    zip: '10001',
    phone: '+1 (555) 987-6543',
  },
];

export default function AccountDashboard() {
  const { user, logout, updateUserProfile, changePassword } = useAuth();
  const { cartItems, addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [addresses, setAddresses] = useState(() => {
    const stored = localStorage.getItem('saved_addresses');
    return stored ? JSON.parse(stored) : DEFAULT_ADDRESSES;
  });

  const stats = useMemo(() => {
    const pendingOrders = orders.filter((o) => ['Processing', 'Pending'].includes(o.status)).length;
    return {
      totalOrders: orders.length,
      pendingOrders,
      wishlistCount: wishlist?.length || 0,
      accountStatus: user?.isBlocked ? 'Blocked' : 'Active',
    };
  }, [orders, wishlist, user]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    localStorage.setItem('saved_addresses', JSON.stringify(addresses));
  }, [addresses]);

  const loadOrders = async () => {
    setOrdersError(null);
    setLoadingOrders(true);
    try {
      const { data } = await getMyOrders();
      setOrders(data.orders);
    } catch (error) {
      setOrdersError(error);
      toast.error('Unable to load your orders.');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleDownloadInvoice = async (order) => {
    try {
      const response = await downloadInvoice(order._id);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/html' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order.invoiceNumber}.html`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Unable to download invoice');
    }
  };

  const handleSaveProfile = async (payload) => {
    setProfileSaving(true);
    try {
      await updateUserProfile(payload);
      toast.success('Profile updated.');
      setEditingProfile(false);
      setActiveTab('profile');
    } catch (error) {
      // Errors handled in context
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (payload) => {
    setPasswordLoading(true);
    try {
      await changePassword(payload);
      setActiveTab('profile');
    } catch (error) {
      // handled in context
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveAddress = (newAddress) => {
    setAddresses((prev) => {
      const exists = prev.find((addr) => addr.id === newAddress.id);
      if (exists) {
        return prev.map((addr) => (addr.id === newAddress.id ? newAddress : addr));
      }
      return [...prev, newAddress];
    });
    toast.success('Address saved');
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    toast.success('Address removed');
  };

  const handleDeleteAccount = () => {
    toast.success('Account deletion is currently a placeholder. Logging out for safety.');
    logout();
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const content = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview stats={stats} />;
      case 'profile':
        return (
          <ProfileView
            user={user}
            onEdit={() => {
              setEditingProfile(true);
              setActiveTab('editProfile');
            }}
            onChangePassword={() => setActiveTab('changePassword')}
          />
        );
      case 'editProfile':
        return (
          <EditProfile
            user={user}
            loading={profileSaving}
            onSave={handleSaveProfile}
            onCancel={() => setActiveTab('profile')}
          />
        );
      case 'orders':
        return (
          <OrdersSection
            orders={orders}
            loading={loadingOrders}
            error={ordersError}
            selectedOrder={selectedOrder}
            onSelectOrder={setSelectedOrder}
            onDownloadInvoice={handleDownloadInvoice}
            onTrackOrder={() => setActiveTab('track')}
          />
        );
      case 'track':
        return (
          <div className="rounded-3xl border border-chocolate-100 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-chocolate-800">Track Orders</h2>
            <p className="mt-2 text-sm text-chocolate-500">
              Use the order number found in your orders list to track delivery status. For real-time tracking, this feature can be connected to a courier API.
            </p>
            <div className="mt-6">
              <input
                className="w-full max-w-md rounded-xl border border-chocolate-200 bg-white px-4 py-2 text-chocolate-700 focus:border-chocolate-400 focus:ring-2 focus:ring-chocolate-200 outline-none"
                placeholder="Enter order number"
              />
            </div>
          </div>
        );
      case 'wishlist':
        return <WishlistGrid wishlist={wishlist} onRemove={toggleWishlist} onAddToCart={handleAddToCart} />;
      case 'addresses':
        return <AddressesSection addresses={addresses} onSave={handleSaveAddress} onDelete={handleDeleteAddress} />;
      case 'payments':
        return (
          <div className="rounded-3xl border border-chocolate-100 bg-white p-10 shadow-sm">
            <h2 className="text-xl font-semibold text-chocolate-800">Payment Methods</h2>
            <p className="mt-2 text-sm text-chocolate-500">
              Save card details to speed up checkout. This feature is coming soon.
            </p>
          </div>
        );
      case 'notifications':
        return (
          <div className="rounded-3xl border border-chocolate-100 bg-white p-10 shadow-sm">
            <h2 className="text-xl font-semibold text-chocolate-800">Notifications</h2>
            <p className="mt-2 text-sm text-chocolate-500">
              Control which emails and updates you receive. This section can be extended to include preference toggles.
            </p>
          </div>
        );
      case 'changePassword':
        return <ChangePassword onChangePassword={handleChangePassword} loading={passwordLoading} />;
      case 'deleteAccount':
        return <DeleteAccount onDelete={handleDeleteAccount} />;
      default:
        return <DashboardOverview stats={stats} />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSkeleton type="text" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-24">
      <header className="bg-gradient-to-r from-chocolate-800 to-chocolate-700 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-display font-bold">My Account</h1>
            <p className="mt-1 text-sm text-chocolate-100">Manage your profile, orders, and settings.</p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/25 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="h-5 w-5" />
            Menu
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:grid-cols-[250px_1fr]">
        <div className="hidden lg:block">
          <SidebarNav activeTab={activeTab} onChange={setActiveTab} onLogout={logout} />
        </div>

        <main className="space-y-6">{content()}</main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-72 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-chocolate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-chocolate-800">Menu</h2>
              <button
                type="button"
                className="rounded-xl px-3 py-2 text-chocolate-600 hover:bg-chocolate-50"
                onClick={() => setSidebarOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="p-4">
              <SidebarNav
                activeTab={activeTab}
                onChange={(key) => {
                  setActiveTab(key);
                  setSidebarOpen(false);
                }}
                onLogout={logout}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
