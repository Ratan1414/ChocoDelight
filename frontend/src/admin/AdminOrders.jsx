import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiSearch, FiTruck, FiXCircle } from 'react-icons/fi';
import { getAdminOrders, updateAdminOrderStatus, cancelAdminOrder } from '../services/api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const { dark } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const { data } = await getAdminOrders();
      setOrders(data.orders);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await updateAdminOrderStatus(id, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status, ...(status === 'Delivered' ? { deliveredAt: new Date() } : {}) } : o));
      toast.success(`Order ${status.toLowerCase()}`);
    } catch (err) { toast.error('Failed to update status'); }
  };

  const cancelOrder = async (id) => {
    if (!confirm('Cancel this order? Stock will be restored.')) return;
    try {
      await cancelAdminOrder(id);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: 'Cancelled' } : o));
      toast.success('Order cancelled!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to cancel'); }
  };

  const statuses = ['All', 'Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
  const statusColors = {
    'Processing': 'bg-yellow-100 text-yellow-700',
    'Confirmed': 'bg-blue-100 text-blue-700',
    'Shipped': 'bg-purple-100 text-purple-700',
    'Out for Delivery': 'bg-orange-100 text-orange-700',
    'Delivered': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700'
  };
  const nextStatus = {
    'Processing': 'Confirmed', 'Confirmed': 'Shipped',
    'Shipped': 'Out for Delivery', 'Out for Delivery': 'Delivered'
  };

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchSearch = search === '' ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const cardCls = `rounded-2xl ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`;
  const inputCls = `rounded-xl px-4 py-2.5 text-sm border transition-colors ${dark
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-chocolate-500'
    : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-chocolate-500'} focus:outline-none`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className={`text-2xl lg:text-3xl font-display font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Orders</h1>
        <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID, customer..." className={`${inputCls} pl-9 w-full`} />
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === s
                  ? 'bg-chocolate-500 text-white shadow-md'
                  : dark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-chocolate-200 border-t-chocolate-500"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className={`${cardCls} p-12 text-center`}>
          <p className={dark ? 'text-gray-500' : 'text-gray-400'}>No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order._id} className={`${cardCls} p-4 transition-all`}>
              {/* Order header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                <div className="flex items-center space-x-4">
                  <div>
                    <p className={`font-semibold ${dark ? 'text-white' : 'text-gray-800'}`}>#{order._id.slice(-8).toUpperCase()}</p>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {order.user?.name} · {order.user?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>{order.status}</span>
                  <span className={`font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>₹{order.totalPrice}</span>
                </div>
              </div>

              {/* Expanded details */}
              {expandedOrder === order._id && (
                <div className={`mt-4 pt-4 border-t ${dark ? 'border-gray-700' : 'border-gray-100'} space-y-4`}>
                  {/* Items */}
                  <div className="flex flex-wrap gap-3">
                    {order.items.map((item, i) => (
                      <div key={i} className={`flex items-center space-x-2 rounded-lg px-3 py-2 ${dark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{item.name}</p>
                          <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Qty: {item.quantity} · ₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping address */}
                  <div className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p className="font-medium mb-1">Shipping Address:</p>
                    <p>{order.shippingAddress?.fullName}, {order.shippingAddress?.address}</p>
                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}</p>
                    <p>Phone: {order.shippingAddress?.phone}</p>
                  </div>

                  {/* Price breakdown */}
                  <div className={`text-sm space-y-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
                    {order.discount > 0 && <div className="flex justify-between text-green-500"><span>Discount</span><span>-₹{order.discount}</span></div>}
                    <div className={`flex justify-between font-bold ${dark ? 'text-white' : 'text-gray-800'}`}><span>Total</span><span>₹{order.totalPrice}</span></div>
                  </div>

                  {/* Actions */}
                  {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {nextStatus[order.status] && (
                        <button onClick={() => updateStatus(order._id, nextStatus[order.status])}
                          className="flex items-center space-x-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-md transition-all">
                          <FiTruck size={14} />
                          <span>Mark as {nextStatus[order.status]}</span>
                        </button>
                      )}
                      <button onClick={() => cancelOrder(order._id)}
                        className="flex items-center space-x-1.5 bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-md transition-all">
                        <FiXCircle size={14} />
                        <span>Cancel Order</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
