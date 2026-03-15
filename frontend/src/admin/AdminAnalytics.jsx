import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { FiTrendingUp, FiPackage, FiPieChart } from 'react-icons/fi';
import { getAdminAnalytics } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminAnalytics = () => {
  const { dark } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await getAdminAnalytics();
      setData(res.data);
    } catch (err) {
      console.error('Analytics load failed');
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: dark ? '#e5e7eb' : '#374151',
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: dark ? '#374151' : '#ffffff',
        titleColor: dark ? '#e5e7eb' : '#111827',
        bodyColor: dark ? '#e5e7eb' : '#374151',
        borderColor: dark ? '#4b5563' : '#d1d5db',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: { color: dark ? '#9ca3af' : '#6b7280' },
        grid: { color: dark ? '#374151' : '#f3f4f6' }
      },
      y: {
        ticks: { color: dark ? '#9ca3af' : '#6b7280' },
        grid: { color: dark ? '#374151' : '#f3f4f6' }
      }
    }
  };

  const revenueData = {
    labels: data?.monthlyRevenue?.map(m => m.label) || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: data?.monthlyRevenue?.map(m => m.revenue) || [],
        borderColor: '#7B3F00',
        backgroundColor: 'rgba(123, 63, 0, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const ordersData = {
    labels: data?.monthlyRevenue?.map(m => m.label) || [],
    datasets: [
      {
        label: 'Orders',
        data: data?.monthlyRevenue?.map(m => m.orders) || [],
        backgroundColor: 'rgba(123, 63, 0, 0.8)',
        borderColor: '#7B3F00',
        borderWidth: 1
      }
    ]
  };

  const statusData = {
    labels: data?.statusDistribution?.map(s => s._id) || [],
    datasets: [
      {
        data: data?.statusDistribution?.map(s => s.count) || [],
        backgroundColor: [
          '#fbbf24', // Processing
          '#3b82f6', // Confirmed
          '#8b5cf6', // Shipped
          '#f97316', // Out for Delivery
          '#10b981', // Delivered
          '#ef4444'  // Cancelled
        ],
        borderWidth: 2,
        borderColor: dark ? '#374151' : '#ffffff'
      }
    ]
  };

  const categoryData = {
    labels: data?.categorySales?.map(c => c._id || 'Uncategorized') || [],
    datasets: [
      {
        label: 'Revenue by Category (₹)',
        data: data?.categorySales?.map(c => c.revenue) || [],
        backgroundColor: 'rgba(123, 63, 0, 0.8)',
        borderColor: '#7B3F00',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className={`text-2xl lg:text-3xl font-display font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Analytics</h1>
        <p className={`text-sm mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Insights into your store's performance</p>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <div className={`rounded-2xl p-6 ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
          <div className="flex items-center space-x-2 mb-4">
            <FiTrendingUp className="text-chocolate-500" size={20} />
            <h2 className={`font-display font-semibold text-lg ${dark ? 'text-white' : 'text-gray-800'}`}>Monthly Revenue</h2>
          </div>
          <div className="h-64">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>

        {/* Monthly Orders */}
        <div className={`rounded-2xl p-6 ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
          <div className="flex items-center space-x-2 mb-4">
            <FiPackage className="text-chocolate-500" size={20} />
            <h2 className={`font-display font-semibold text-lg ${dark ? 'text-white' : 'text-gray-800'}`}>Monthly Orders</h2>
          </div>
          <div className="h-64">
            <Bar data={ordersData} options={chartOptions} />
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className={`rounded-2xl p-6 ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
          <div className="flex items-center space-x-2 mb-4">
            <FiPieChart className="text-chocolate-500" size={20} />
            <h2 className={`font-display font-semibold text-lg ${dark ? 'text-white' : 'text-gray-800'}`}>Order Status Distribution</h2>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={statusData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: { position: 'bottom' }
                }
              }}
            />
          </div>
        </div>

        {/* Category Sales */}
        <div className={`rounded-2xl p-6 ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
          <div className="flex items-center space-x-2 mb-4">
            <FiTrendingUp className="text-chocolate-500" size={20} />
            <h2 className={`font-display font-semibold text-lg ${dark ? 'text-white' : 'text-gray-800'}`}>Sales by Category</h2>
          </div>
          <div className="h-64">
            <Bar data={categoryData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className={`rounded-2xl p-6 ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
        <h2 className={`font-display font-semibold text-lg mb-4 ${dark ? 'text-white' : 'text-gray-800'}`}>Top Selling Products</h2>
        <div className="space-y-3">
          {(data?.topProducts || []).map((product, i) => (
            <div key={product._id} className={`flex items-center justify-between py-3 border-b last:border-0 ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                  i === 0 ? 'bg-yellow-100 text-yellow-700' :
                  i === 1 ? 'bg-gray-100 text-gray-700' :
                  i === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  {i + 1}
                </span>
                <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{product.name}</p>
                  <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{product.totalSold} sold · ₹{product.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
              <div className={`text-right ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p className="text-sm font-bold">₹{product.totalRevenue.toLocaleString()}</p>
                <p className="text-xs">{product.totalSold} units</p>
              </div>
            </div>
          ))}
          {(!data?.topProducts || data.topProducts.length === 0) && (
            <p className={`text-sm py-4 text-center ${dark ? 'text-gray-500' : 'text-gray-400'}`}>No sales data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;