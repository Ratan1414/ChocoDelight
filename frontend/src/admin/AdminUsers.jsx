import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiSearch, FiTrash2, FiShield, FiShieldOff } from 'react-icons/fi';
import { getAdminUsers, deleteAdminUser, toggleBlockUser } from '../services/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const { dark } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const { data } = await getAdminUsers();
      setUsers(data.users);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await deleteAdminUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  const handleBlock = async (id) => {
    try {
      const { data } = await toggleBlockUser(id);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: data.user.isBlocked } : u));
      toast.success(data.message);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const cardCls = `rounded-2xl ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`;
  const inputCls = `rounded-xl px-4 py-2.5 text-sm border transition-colors ${dark
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-chocolate-500'
    : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-chocolate-500'} focus:outline-none`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-display font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Users</h1>
          <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{users.length} registered users</p>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className={`${inputCls} pl-9 w-full sm:w-64`} />
        </div>
      </div>

      <div className={`${cardCls} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={dark ? 'bg-gray-750' : 'bg-gray-50'}>
              <tr className={`${dark ? 'text-gray-300' : 'text-gray-500'} text-left`}>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${dark ? 'divide-gray-700' : 'divide-gray-100'}`}>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-chocolate-200 border-t-chocolate-500 mx-auto"></div>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className={`px-5 py-12 text-center ${dark ? 'text-gray-500' : 'text-gray-400'}`}>No users found</td></tr>
              ) : filtered.map(u => (
                <tr key={u._id} className={`${dark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} transition-colors`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        u.role === 'admin' ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-chocolate-400 to-coral-400'
                      }`}>{u.name.charAt(0).toUpperCase()}</div>
                      <span className={`font-medium ${dark ? 'text-white' : 'text-gray-800'}`}>{u.name}</span>
                    </div>
                  </td>
                  <td className={`px-5 py-3 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>{u.isBlocked ? 'Blocked' : 'Active'}</span>
                  </td>
                  <td className={`px-5 py-3 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {u.role !== 'admin' && (
                      <>
                        <button onClick={() => handleBlock(u._id)}
                          className={`p-2 rounded-lg transition-colors mr-1 ${u.isBlocked
                            ? 'text-green-500 hover:bg-green-50' : 'text-orange-500 hover:bg-orange-50'}`}
                          title={u.isBlocked ? 'Unblock' : 'Block'}>
                          {u.isBlocked ? <FiShield size={16} /> : <FiShieldOff size={16} />}
                        </button>
                        <button onClick={() => handleDelete(u._id)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                          <FiTrash2 size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
