import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { FiUsers, FiPackage, FiShoppingCart, FiDollarSign, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
import { getAdminDashboard } from '../services/api';

const AdminDashboard = () => {
  const { dark } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getAdminDashboard();
      setData(res.data);
    } catch (err) {
      console.error('Dashboard load failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-chocolate-200 border-t-chocolate-500"></div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const cards = [
    { label: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString() || 0}`, icon: <FiDollarSign size={24} />, color: 'from-green-500 to-emerald-600', change: '+12.5%' },
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: <FiShoppingCart size={24} />, color: 'from-blue-500 to-indigo-600', change: `${stats.pendingOrders} pending` },
    { label: 'Total Users', value: stats.totalUsers || 0, icon: <FiUsers size={24} />, color: 'from-purple-500 to-violet-600', change: 'Active users' },
    { label: 'Total Products', value: stats.totalProducts || 0, icon: <FiPackage size={24} />, color: 'from-orange-500 to-amber-600', change: 'In stock' },
  ];

  const statusColors = {
    'Processing': 'bg-yellow-100 text-yellow-700',
    'Confirmed': 'bg-blue-100 text-blue-700',
    'Shipped': 'bg-purple-100 text-purple-700',
    'Out for Delivery': 'bg-orange-100 text-orange-700',
    'Delivered': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className={`text-2xl lg:text-3xl font-display font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Dashboard</h1>
        <p className={`text-sm mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className={`rounded-2xl p-5 ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}>
                {card.icon}
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>
                {card.change}
              </span>
            </div>
            <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>{card.value}</p>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className={`rounded-2xl p-5 ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-display font-semibold text-lg ${dark ? 'text-white' : 'text-gray-800'}`}>Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-chocolate-500 hover:text-chocolate-600 font-medium">View All →</Link>
          </div>
          <div className="space-y-3">
            {(data?.recentOrders || []).map(order => (
              <div key={order._id} className={`flex items-center justify-between py-3 border-b last:border-0 ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
                <div>
                  <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>
                    #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {order.user?.name || 'Guest'} · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <span className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>₹{order.totalPrice}</span>
                </div>
              </div>
            ))}
            {(!data?.recentOrders || data.recentOrders.length === 0) && (
              <p className={`text-sm py-4 text-center ${dark ? 'text-gray-500' : 'text-gray-400'}`}>No orders yet</p>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className={`rounded-2xl p-5 ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-display font-semibold text-lg flex items-center space-x-2 ${dark ? 'text-white' : 'text-gray-800'}`}>
              <FiAlertTriangle className="text-amber-500" />
              <span>Low Stock Alerts</span>
            </h2>
            <Link to="/admin/products" className="text-sm text-chocolate-500 hover:text-chocolate-600 font-medium">Manage →</Link>
          </div>
          <div className="space-y-3">
            {(data?.lowStockProducts || []).map(p => (
              <div key={p._id} className={`flex items-center space-x-3 py-3 border-b last:border-0 ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${dark ? 'text-white' : 'text-gray-800'}`}>{p.name}</p>
                  <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{p.category}</p>
                </div>
                <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${
                  p.stock < 5 ? 'bg-red-100 text-red-700' : p.stock < 10 ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {p.stock} left
                </span>
              </div>
            ))}
            {(!data?.lowStockProducts || data.lowStockProducts.length === 0) && (
              <p className={`text-sm py-4 text-center ${dark ? 'text-gray-500' : 'text-gray-400'}`}>All products well stocked! 🎉</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: stats.pendingOrders, color: 'text-yellow-500' },
          { label: 'Delivered', value: stats.deliveredOrders, color: 'text-green-500' },
          { label: 'Avg Order', value: `₹${stats.totalOrders ? Math.round(stats.totalRevenue / stats.totalOrders) : 0}`, color: 'text-blue-500' },
          { label: 'Products/User', value: stats.totalUsers ? (stats.totalProducts / stats.totalUsers).toFixed(1) : 0, color: 'text-purple-500' },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl p-4 text-center ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
