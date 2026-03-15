import { useState, createContext, useContext, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiPackage, FiShoppingCart, FiUsers, FiTag,
  FiBarChart2, FiLogOut, FiMenu, FiX, FiMoon, FiSun, FiChevronLeft
} from 'react-icons/fi';

const DarkModeContext = createContext();
export const useDarkMode = () => useContext(DarkModeContext);

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('admin-dark') === 'true');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('admin-dark', dark);
  }, [dark]);

  const links = [
    { to: '/admin', label: 'Dashboard', icon: <FiGrid size={20} /> },
    { to: '/admin/products', label: 'Products', icon: <FiPackage size={20} /> },
    { to: '/admin/orders', label: 'Orders', icon: <FiShoppingCart size={20} /> },
    { to: '/admin/users', label: 'Users', icon: <FiUsers size={20} /> },
    { to: '/admin/coupons', label: 'Coupons', icon: <FiTag size={20} /> },
    { to: '/admin/analytics', label: 'Analytics', icon: <FiBarChart2 size={20} /> },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <DarkModeContext.Provider value={{ dark, setDark }}>
      <div className={`min-h-screen flex ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 flex-shrink-0 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
          {/* Logo */}
          <div className={`p-5 border-b ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <Link to="/admin" className="flex items-center space-x-2">
                <span className="text-2xl">🍫</span>
                <div>
                  <h1 className={`font-display font-bold text-lg ${dark ? 'text-white' : 'text-gray-800'}`}>ChocoDelight</h1>
                  <p className="text-xs text-coral-400 font-semibold -mt-0.5">Admin Panel</p>
                </div>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-gradient-to-r from-chocolate-500 to-chocolate-600 text-white shadow-md shadow-chocolate-500/25'
                    : dark
                      ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className={`p-3 border-t ${dark ? 'border-gray-700' : 'border-gray-200'} space-y-1`}>
            <Link
              to="/"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                dark ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiChevronLeft size={20} />
              <span>Back to Store</span>
            </Link>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50/10 transition-all"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top bar */}
          <header className={`sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-8 border-b ${
            dark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
          } backdrop-blur-sm`}>
            <button onClick={() => setSidebarOpen(true)} className={`lg:hidden ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
              <FiMenu size={24} />
            </button>
            <div className="flex items-center space-x-4 ml-auto">
              <button
                onClick={() => setDark(!dark)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  dark ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={dark ? 'Light mode' : 'Dark mode'}
              >
                {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-xl ${dark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-chocolate-400 to-coral-400 flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <span className={`text-sm font-medium hidden sm:inline ${dark ? 'text-white' : 'text-gray-700'}`}>
                  {user?.name}
                </span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 lg:p-8">
            <Outlet context={{ dark }} />
          </main>
        </div>
      </div>
    </DarkModeContext.Provider>
  );
};

export default AdminLayout;
