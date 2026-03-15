import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-chocolate-100">
          <h2 className="text-xl font-display font-bold text-chocolate-700 flex items-center space-x-2">
            <FiShoppingBag size={24} />
            <span>Your Cart</span>
            <span className="text-sm bg-chocolate-100 text-chocolate-600 px-2 py-1 rounded-full">
              {cartCount} items
            </span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <FiShoppingBag size={48} className="mx-auto text-chocolate-200 mb-4" />
              <h3 className="text-lg font-medium text-chocolate-600 mb-2">Your cart is empty</h3>
              <p className="text-chocolate-400 mb-6">Add some delicious chocolates to get started!</p>
              <Link
                to="/shop"
                onClick={onClose}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-chocolate-500 to-chocolate-600 text-white px-6 py-3 rounded-xl hover:from-coral-400 hover:to-coral-500 transition-all duration-300 shadow-lg"
              >
                <span>Start Shopping</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center space-x-4 p-4 bg-cream-50 rounded-xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-chocolate-700 truncate">{item.name}</h4>
                    <p className="text-sm text-chocolate-400">₹{item.price}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-chocolate-100 flex items-center justify-center hover:bg-chocolate-200 transition-colors"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-chocolate-100 flex items-center justify-center hover:bg-chocolate-200 transition-colors"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-chocolate-600">₹{item.price * item.quantity}</p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-xs text-coral-500 hover:text-coral-600 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-chocolate-100 p-6 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-chocolate-600">₹{cartTotal}</span>
            </div>
            <div className="space-y-3">
              <Link
                to="/cart"
                onClick={onClose}
                className="block w-full text-center bg-gray-100 text-chocolate-600 py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={onClose}
                className="block w-full text-center bg-gradient-to-r from-chocolate-500 to-chocolate-600 text-white py-3 px-6 rounded-xl hover:from-coral-400 hover:to-coral-500 transition-all duration-300 shadow-lg"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;