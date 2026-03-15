import React from 'react';
import Button from '../../ui/Button';

export default function WishlistGrid({ wishlist, onRemove, onAddToCart }) {
  if (!wishlist?.length) {
    return (
      <div className="rounded-3xl border border-chocolate-100 bg-white p-10 text-center">
        <p className="text-lg font-semibold text-chocolate-800">Your wishlist is empty</p>
        <p className="mt-2 text-sm text-chocolate-500">Start adding your favorite treats to save them for later.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {wishlist.map((product) => (
        <div key={product._id} className="rounded-3xl border border-chocolate-100 bg-white p-6 shadow-sm">
          <div className="h-44 overflow-hidden rounded-2xl bg-chocolate-50">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl text-chocolate-300">🍫</div>
            )}
          </div>
          <div className="mt-4">
            <p className="text-sm font-semibold text-chocolate-800">{product.name}</p>
            <p className="mt-1 text-sm text-chocolate-500">₹{product.price}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" onClick={() => onAddToCart(product)}>
              Add to cart
            </Button>
            <Button variant="outline" size="sm" onClick={() => onRemove(product._id)}>
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
