import React from 'react';
import Button from '../../ui/Button';

export default function OrderDetails({ order, onDownload }) {
  if (!order) return null;

  return (
    <div className="rounded-3xl border border-chocolate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-chocolate-800">Order Details</h3>
          <p className="mt-1 text-sm text-chocolate-500">Invoice #: {order.invoiceNumber}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => onDownload(order)}>
            Download Invoice
          </Button>
          <span className="rounded-full bg-chocolate-100 px-3 py-1 text-xs font-semibold text-chocolate-700">
            {order.status}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-chocolate-50 p-5">
          <h4 className="font-semibold text-chocolate-800">Delivery Address</h4>
          <p className="mt-2 text-sm text-chocolate-600">
            {order.shippingAddress?.fullName}
            <br />{order.shippingAddress?.address}
            <br />{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
            <br />{order.shippingAddress?.phone}
          </p>
        </div>

        <div className="rounded-2xl bg-chocolate-50 p-5">
          <h4 className="font-semibold text-chocolate-800">Payment</h4>
          <p className="mt-2 text-sm text-chocolate-600">{order.paymentMethod || 'Credit Card'}</p>
          <p className="mt-2 text-sm text-chocolate-600">Total: ₹{order.totalPrice}</p>
        </div>

        <div className="rounded-2xl bg-chocolate-50 p-5">
          <h4 className="font-semibold text-chocolate-800">Order Timeline</h4>
          <ol className="mt-2 space-y-2 text-sm text-chocolate-600">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-chocolate-700" />
              <span>Order placed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-chocolate-700" />
              <span>Processing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-chocolate-700" />
              <span>Shipped</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-chocolate-700" />
              <span>Delivered</span>
            </li>
          </ol>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5 border border-chocolate-100">
        <h4 className="text-sm font-semibold text-chocolate-800">Items</h4>
        <ul className="mt-3 space-y-3">
          {order.items?.map((item) => (
            <li key={item._id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-xl bg-chocolate-50">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-chocolate-300">🍫</div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-chocolate-700">{item.name}</p>
                  <p className="text-xs text-chocolate-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-chocolate-700">₹{item.price * item.quantity}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
