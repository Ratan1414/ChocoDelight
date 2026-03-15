import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiSave } from 'react-icons/fi';
import { getProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct, getCategories } from '../services/api';
import toast from 'react-hot-toast';

const emptyProduct = {
  name: '', description: '', price: '', originalPrice: '', category: 'Dark Chocolate',
  image: '', stock: '', rating: 0, featured: false, bestSeller: false, tags: ''
};

const AdminProducts = () => {
  const { dark } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const { data } = await getProducts({ limit: 100 });
      setProducts(data.products);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data.categories);
    } catch (e) { /* fallback */ }
  };

  const openAdd = () => { setEditing(null); setForm(emptyProduct); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, tags: (p.tags || []).join(', '), originalPrice: p.originalPrice || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      stock: Number(form.stock),
      rating: Number(form.rating),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    };
    try {
      if (editing) {
        await updateAdminProduct(editing, payload);
        toast.success('Product updated!');
      } else {
        await createAdminProduct(payload);
        toast.success('Product created!');
      }
      setShowModal(false);
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteAdminProduct(id);
      toast.success('Product deleted!');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) { toast.error('Failed to delete'); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const cardCls = `rounded-2xl ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`;
  const inputCls = `w-full rounded-xl px-4 py-2.5 text-sm border transition-colors ${dark
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-chocolate-500'
    : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-chocolate-500'} focus:outline-none`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-display font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Products</h1>
          <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{products.length} total products</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative flex-1 sm:flex-none">
            <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? 'text-gray-400' : 'text-gray-400'}`} size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className={`${inputCls} pl-9 sm:w-64`} />
          </div>
          <button onClick={openAdd}
            className="flex items-center space-x-2 bg-gradient-to-r from-chocolate-500 to-chocolate-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
            <FiPlus size={18} />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className={`${cardCls} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={dark ? 'bg-gray-750' : 'bg-gray-50'}>
              <tr className={`${dark ? 'text-gray-300' : 'text-gray-500'} text-left`}>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Rating</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${dark ? 'divide-gray-700' : 'divide-gray-100'}`}>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-chocolate-200 border-t-chocolate-500 mx-auto"></div>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className={`px-5 py-12 text-center ${dark ? 'text-gray-500' : 'text-gray-400'}`}>No products found</td></tr>
              ) : filtered.map(p => (
                <tr key={p._id} className={`${dark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} transition-colors`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center space-x-3">
                      <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <p className={`font-medium truncate max-w-[200px] ${dark ? 'text-white' : 'text-gray-800'}`}>{p.name}</p>
                        {p.featured && <span className="text-[10px] bg-gold-100 text-gold-700 px-1.5 py-0.5 rounded-full font-semibold">Featured</span>}
                        {p.bestSeller && <span className="text-[10px] bg-coral-100 text-coral-600 px-1.5 py-0.5 rounded-full font-semibold ml-1">Bestseller</span>}
                      </div>
                    </div>
                  </td>
                  <td className={`px-5 py-3 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{p.category}</td>
                  <td className="px-5 py-3">
                    <span className={`font-semibold ${dark ? 'text-white' : 'text-gray-800'}`}>₹{p.price}</span>
                    {p.originalPrice && <span className={`text-xs line-through ml-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>₹{p.originalPrice}</span>}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      p.stock < 5 ? 'bg-red-100 text-red-700' :
                      p.stock < 20 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>{p.stock}</span>
                  </td>
                  <td className={`px-5 py-3 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>⭐ {p.rating}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors mr-1" title="Edit"><FiEdit2 size={16} /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Delete"><FiTrash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className={`${cardCls} w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-display font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>
                {editing ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className={`p-2 rounded-lg ${dark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Product Name</label>
                  <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className={inputCls} required />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} className={`${inputCls} h-24 resize-none`} required />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Price (₹)</label>
                  <input type="number" value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} className={inputCls} required />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Original Price (₹)</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm(p => ({...p, originalPrice: e.target.value}))} className={inputCls} placeholder="Leave empty if no discount" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}
                    className={inputCls}>
                    {['Dark Chocolate','Milk Chocolate','Caramel Candy','Hazelnut Chocolate','Fruit Chocolate','Chocolate Bars','Chocolate Gift Boxes'].map(c =>
                      <option key={c} value={c}>{c}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm(p => ({...p, stock: e.target.value}))} className={inputCls} required />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Image URL</label>
                  <input value={form.image} onChange={e => setForm(p => ({...p, image: e.target.value}))} className={inputCls} required placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Tags (comma separated)</label>
                  <input value={form.tags} onChange={e => setForm(p => ({...p, tags: e.target.value}))} className={inputCls} placeholder="e.g. premium, dark, gift" />
                </div>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({...p, featured: e.target.checked}))}
                      className="w-4 h-4 text-chocolate-500 rounded" />
                    <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Featured</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={form.bestSeller} onChange={e => setForm(p => ({...p, bestSeller: e.target.checked}))}
                      className="w-4 h-4 text-chocolate-500 rounded" />
                    <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Best Seller</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium ${dark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex items-center space-x-2 bg-gradient-to-r from-chocolate-500 to-chocolate-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                  <FiSave size={16} />
                  <span>{saving ? 'Saving...' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
