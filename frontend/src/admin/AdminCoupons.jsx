import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiX, FiSave } from 'react-icons/fi';
import { getAdminCoupons, createAdminCoupon, updateAdminCoupon, deleteAdminCoupon } from '../services/api';
import toast from 'react-hot-toast';

const emptyCoupon = {
  code: '',
  discount: '',
  minPurchase: '',
  maxDiscount: '',
  expiresAt: ''
};

const AdminCoupons = () => {
  const { dark } = useOutletContext();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyCoupon);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const { data } = await getAdminCoupons();
      setCoupons(data.coupons);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyCoupon);
    setShowModal(true);
  };

  const openEdit = (coupon) => {
    setEditing(coupon._id);
    setForm({
      code: coupon.code,
      discount: coupon.discount,
      minPurchase: coupon.minPurchase || '',
      maxDiscount: coupon.maxDiscount || '',
      expiresAt: new Date(coupon.expiresAt).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        discount: Number(form.discount),
        minPurchase: form.minPurchase ? Number(form.minPurchase) : 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        expiresAt: new Date(form.expiresAt)
      };

      if (editing) {
        await updateAdminCoupon(editing, payload);
        toast.success('Coupon updated!');
      } else {
        await createAdminCoupon(payload);
        toast.success('Coupon created!');
      }

      setShowModal(false);
      loadCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon permanently?')) return;
    try {
      await deleteAdminCoupon(id);
      setCoupons(prev => prev.filter(c => c._id !== id));
      toast.success('Coupon deleted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const isExpired = (expiresAt) => new Date(expiresAt) < new Date();

  const cardCls = `rounded-2xl ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`;
  const inputCls = `rounded-xl px-4 py-2.5 text-sm border transition-colors ${dark
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-chocolate-500'
    : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-chocolate-500'} focus:outline-none`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-display font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Coupons</h1>
          <p className={`text-sm mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Manage discount coupons for your customers</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-chocolate-500 to-chocolate-600 text-white rounded-xl hover:from-chocolate-600 hover:to-chocolate-700 transition-all duration-200 shadow-lg shadow-chocolate-500/25"
        >
          <FiPlus size={18} />
          <span>Add Coupon</span>
        </button>
      </div>

      {/* Coupons List */}
      <div className={cardCls + ' shadow-sm'}>
        <div className="p-6">
          <div className="space-y-4">
            {coupons.map(coupon => (
              <div key={coupon._id} className={`flex items-center justify-between p-4 rounded-xl border ${dark ? 'border-gray-700 bg-gray-700/50' : 'border-gray-100 bg-gray-50'}`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dark ? 'bg-gray-600' : 'bg-white'}`}>
                    <FiTag className="text-chocolate-500" size={20} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-800'}`}>{coupon.code}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        coupon.isActive && !isExpired(coupon.expiresAt)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {coupon.isActive && !isExpired(coupon.expiresAt) ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {coupon.discount}% off • Min ₹{coupon.minPurchase || 0}
                      {coupon.maxDiscount && ` • Max ₹${coupon.maxDiscount}`}
                    </p>
                    <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                      {isExpired(coupon.expiresAt) && ' (Expired)'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEdit(coupon)}
                    className={`p-2 rounded-lg transition-colors ${dark ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {coupons.length === 0 && (
              <div className="text-center py-12">
                <FiTag className={`mx-auto h-12 w-12 ${dark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`mt-4 text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>No coupons created yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${cardCls} w-full max-w-md shadow-2xl`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-display font-semibold ${dark ? 'text-white' : 'text-gray-800'}`}>
                  {editing ? 'Edit Coupon' : 'Add Coupon'}
                </h2>
                <button onClick={() => setShowModal(false)} className={`p-1 rounded-lg ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Code</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className={inputCls}
                    placeholder="SUMMER2024"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Discount (%)</label>
                  <input
                    type="number"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    className={inputCls}
                    placeholder="20"
                    min="1"
                    max="90"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Min Purchase (₹)</label>
                  <input
                    type="number"
                    value={form.minPurchase}
                    onChange={(e) => setForm({ ...form, minPurchase: e.target.value })}
                    className={inputCls}
                    placeholder="500"
                    min="0"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Max Discount (₹)</label>
                  <input
                    type="number"
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                    className={inputCls}
                    placeholder="1000"
                    min="0"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Expires At</label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    className={inputCls}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                      dark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-chocolate-500 to-chocolate-600 text-white rounded-xl hover:from-chocolate-600 hover:to-chocolate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-chocolate-500/25"
                  >
                    {saving ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <>
                        <FiSave size={16} className="inline mr-2" />
                        {editing ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;