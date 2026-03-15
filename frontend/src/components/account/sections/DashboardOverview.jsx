import React from 'react';

export default function DashboardOverview({ stats }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-chocolate-900">Welcome back!</h2>
          <p className="mt-1 text-sm text-chocolate-500">Here's a snapshot of your account activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Orders',
            value: stats.totalOrders,
            icon: '📦',
            highlight: 'bg-chocolate-100',
          },
          {
            label: 'Pending Orders',
            value: stats.pendingOrders,
            icon: '⏳',
            highlight: 'bg-coral-100',
          },
          {
            label: 'Wishlist Items',
            value: stats.wishlistCount,
            icon: '❤️',
            highlight: 'bg-gold-100',
          },
          {
            label: 'Account Status',
            value: stats.accountStatus,
            icon: '✅',
            highlight: 'bg-cream-200',
          },
        ].map((card) => (
          <div key={card.label} className="rounded-3xl border border-chocolate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-3xl" aria-hidden>
                {card.icon}
              </div>
              <div className={`rounded-full px-3 py-1 text-xs font-semibold ${card.highlight} text-chocolate-800`}>{card.label}</div>
            </div>
            <div className="mt-6 text-3xl font-display font-bold text-chocolate-900">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-chocolate-100 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-chocolate-800">Quick tips</h3>
          <ul className="mt-4 space-y-2 text-sm text-chocolate-600">
            <li>✨ Keep your profile up to date for faster checkout.</li>
            <li>❤️ Save favorite chocolates to your wishlist for later.</li>
            <li>🛒 Track your orders from the “Track Orders” section.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-chocolate-100 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-chocolate-800">Need help?</h3>
          <p className="mt-2 text-sm text-chocolate-600">
            Reach out to support at <span className="font-medium text-chocolate-800">support@chocodelight.com</span> for help with orders, refunds, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
