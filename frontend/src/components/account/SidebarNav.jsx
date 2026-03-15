import { FiHome, FiUser, FiEdit2, FiShoppingBag, FiTruck, FiHeart, FiMapPin, FiCreditCard, FiBell, FiLock, FiTrash2, FiLogOut } from 'react-icons/fi';

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: FiHome },
  { key: 'profile', label: 'My Profile', icon: FiUser },
  { key: 'editProfile', label: 'Edit Profile', icon: FiEdit2 },
  { key: 'orders', label: 'My Orders', icon: FiShoppingBag },
  { key: 'track', label: 'Track Orders', icon: FiTruck },
  { key: 'wishlist', label: 'Wishlist', icon: FiHeart },
  { key: 'addresses', label: 'Saved Addresses', icon: FiMapPin },
  { key: 'payments', label: 'Payment Methods', icon: FiCreditCard },
  { key: 'changePassword', label: 'Change Password', icon: FiLock },
  { key: 'deleteAccount', label: 'Delete Account', icon: FiTrash2 },
];

export default function SidebarNav({ activeTab, onChange, onLogout, className = '' }) {
  return (
    <aside className={`w-full max-w-[250px] text-sm ${className}`}>
      <div className="sticky top-24 space-y-6">
        <div className="rounded-3xl bg-white border border-chocolate-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-chocolate-800">Account</h2>
          <p className="mt-1 text-xs text-chocolate-500">Quick access to your dashboard and settings.</p>
        </div>

        <nav className="rounded-3xl bg-white border border-chocolate-100 shadow-sm overflow-hidden">
          <ul className="divide-y divide-chocolate-100">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => onChange(item.key)}
                    className={`group flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                      isActive
                        ? 'bg-chocolate-700 text-white'
                        : 'text-chocolate-700 hover:bg-chocolate-50 hover:text-chocolate-800'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                        isActive ? 'bg-chocolate-600' : 'bg-chocolate-100 group-hover:bg-chocolate-200'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                onClick={onLogout}
                className="group flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600 group-hover:bg-red-200">
                  <FiLogOut className="h-5 w-5" />
                </span>
                <span className="flex-1 text-sm font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
