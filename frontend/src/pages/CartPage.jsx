import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiTag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { validateCoupon } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const shippingPrice = cartTotal > 500 ? 0 : 49;
  const finalTotal = cartTotal + shippingPrice - discount;

  const handleApplyCoupon = async () => {
    if (!user) {
      toast.error('Please login to use coupons');
      return;
    }
    if (!couponCode.trim()) return;
    try {
      const { data } = await validateCoupon({ code: couponCode, subtotal: cartTotal });
      setDiscount(data.discount);
      setAppliedCoupon(data.code);
      toast.success(`Coupon applied! ${data.percentage}% off`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
      setDiscount(0);
      setAppliedCoupon('');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout', { state: { discount, couponCode: appliedCoupon } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center px-4 animate-fade-in">
        <span className="text-8xl mb-6">🛒</span>
        <h2 className="text-3xl font-display font-bold text-chocolate-700 mb-3">Your Cart is Empty</h2>
        <p className="text-chocolate-400 mb-6 text-center">Looks like you haven't added any chocolates yet!</p>
        <Link to="/shop" className="btn-primary flex items-center space-x-2">
          <FiShoppingBag />
          <span>Start Shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      <div className="bg-gradient-to-r from-chocolate-700 to-chocolate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold">Shopping Cart</h1>
          <p className="text-chocolate-200 mt-2">{cartItems.length} item(s) in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item._id} className="card p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link to={`/product/${item._id}`} className="w-full sm:w-24 h-32 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item._id}`}>
                    <h3 className="font-display font-semibold text-chocolate-700 hover:text-coral-400 transition-colors">{item.name}</h3>
                  </Link>
                  <p className="text-coral-400 text-sm mt-0.5">{item.category}</p>
                  <p className="text-chocolate-600 font-bold text-lg mt-1">₹{item.price}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border-2 border-chocolate-200 rounded-xl overflow-hidden">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-9 h-9 flex items-center justify-center text-chocolate-500 hover:bg-chocolate-50 transition-colors">
                      <FiMinus size={14} />
                    </button>
                    <span className="w-10 h-9 flex items-center justify-center font-semibold text-chocolate-700 border-x-2 border-chocolate-200 text-sm">
                      {item.quantity}
                    </span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center text-chocolate-500 hover:bg-chocolate-50 transition-colors">
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-chocolate-700 w-20 text-right">
                    ₹{item.price * item.quantity}
                  </span>
                  <button onClick={() => removeFromCart(item._id)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="card p-6">
              <h3 className="font-display font-semibold text-chocolate-700 mb-4 flex items-center space-x-2">
                <FiTag className="text-coral-400" />
                <span>Discount Coupon</span>
              </h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="input-field text-sm py-2 flex-1 uppercase"
                />
                <button onClick={handleApplyCoupon} className="btn-primary text-sm py-2 px-4">Apply</button>
              </div>
              {appliedCoupon && (
                <p className="text-green-600 text-sm mt-2 font-medium">✓ Code "{appliedCoupon}" applied!</p>
              )}
              <p className="text-chocolate-300 text-xs mt-2">Try: CHOCO10, SWEET20, WELCOME15, FESTIVE25</p>
            </div>

            {/* Summary */}
            <div className="card p-6">
              <h3 className="font-display font-semibold text-chocolate-700 text-xl mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-chocolate-500">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-chocolate-500">
                  <span>Shipping</span>
                  <span className="font-medium">{shippingPrice === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingPrice}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount}</span>
                  </div>
                )}
                <div className="border-t-2 border-chocolate-100 pt-3 flex justify-between">
                  <span className="font-display font-bold text-lg text-chocolate-700">Total</span>
                  <span className="font-bold text-2xl text-chocolate-700">₹{finalTotal}</span>
                </div>
              </div>
              {cartTotal < 500 && (
                <p className="text-xs text-chocolate-300 mt-3">
                  Add ₹{500 - cartTotal} more for free shipping!
                </p>
              )}
              <button onClick={handleCheckout}
                className="w-full btn-secondary mt-6 flex items-center justify-center space-x-2 py-4">
                <span>Proceed to Checkout</span>
                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
