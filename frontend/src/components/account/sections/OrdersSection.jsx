import React from 'react';
import Button from '../../ui/Button';
import OrderDetails from './OrderDetails';
import LoadingSkeleton from '../../LoadingSkeleton';

export default function OrdersSection({
  orders,
  loading,
  error,
  selectedOrder,
  onSelectOrder,
  onDownloadInvoice,
  onTrackOrder,
}) {
  if (loading) {
    return <LoadingSkeleton type="card" count={2} />;
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-700">
        <p className="font-semibold">Unable to load orders.</p>
        <p className="text-sm">Please try again later or contact support.</p>
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="rounded-3xl border border-chocolate-100 bg-white p-10 text-center">
        <p className="text-lg font-semibold text-chocolate-800">No orders yet</p>
        <p className="mt-2 text-sm text-chocolate-500">Your recent orders will appear here once you checkout.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-chocolate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-display font-semibold text-chocolate-800">My Orders</h2>
            <p className="mt-1 text-sm text-chocolate-500">Track the status of your recent purchases.</p>
          </div>
          <Button variant="secondary" onClick={() => onTrackOrder?.()}>Track Orders</Button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-chocolate-100">
              <tr className="text-chocolate-600">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-chocolate-100">
              {orders.map((order) => {
                const firstItem = order.items?.[0] || {};
                const isSelected = selectedOrder?._id === order._id;
                return (
                  <>
                    <tr key={order._id} className="hover:bg-chocolate-50">
                      <td className="py-4 px-4 font-medium text-chocolate-700">#{order._id.slice(-8).toUpperCase()}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-xl bg-chocolate-50">
                            {firstItem.image ? (
                              <img src={firstItem.image} alt={firstItem.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-chocolate-300">🍫</div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-chocolate-700">{firstItem.name || 'Chocolate'}</p>
                            <p className="text-xs text-chocolate-500">{order.items.length} item(s)</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-chocolate-700">₹{order.totalPrice}</td>
                      <td className="py-4 px-4 text-chocolate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center rounded-full bg-chocolate-100 px-3 py-1 text-xs font-semibold text-chocolate-700">
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          size="sm"
                          variant={isSelected ? 'primary' : 'outline'}
                          onClick={() => onSelectOrder(isSelected ? null : order)}
                        >
                          {isSelected ? 'Hide details' : 'View details'}
                        </Button>
                      </td>
                    </tr>

                    {isSelected && (
                      <tr key={`${order._id}-details`} className="bg-chocolate-50">
                        <td colSpan={6} className="p-4">
                          <OrderDetails order={order} onDownload={onDownloadInvoice} />
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
