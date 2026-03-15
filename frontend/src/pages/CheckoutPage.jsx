import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheck, FiCreditCard, FiTruck, FiDollarSign } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, cartTotal, clearCart, removeFromCart } = useCart();
  const discount = location.state?.discount || 0;
  const couponCode = location.state?.couponCode || '';
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [address, setAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const shippingPrice = cartTotal > 500 ? 0 : 49;
  const taxPrice = Math.round(cartTotal * 0.18); // 18% GST
  const finalTotal = cartTotal + shippingPrice + taxPrice - discount;

  const handleChange = (e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity
        })),
        shippingAddress: address,
        paymentMethod,
        discount,
        couponCode
      };

      const { data } = await createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/account?tab=orders');
    } catch (error) {
      const message = error.response?.data?.message;
      if (message?.startsWith('Products not found:') || message?.startsWith('Product not found:')) {
        const idsPart = message.split(':')[1] || '';
        const missingIds = idsPart.split(',').map(id => id.trim()).filter(Boolean);
        if (missingIds.length) {
          const removedNames = [];
          missingIds.forEach(id => {
            const found = cartItems.find(item => item._id === id);
            if (found) removedNames.push(found.name);
            removeFromCart(id);
          });
          const displayNames = removedNames.length > 0 ? ` (${removedNames.join(', ')})` : '';
          toast.error(`Removed unavailable item(s)${displayNames}. Please try again.`);
          return;
        }
      }
      toast.error(message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const paymentOptions = [
    { value: 'COD', label: 'Cash on Delivery', icon: <FiDollarSign size={20} />, desc: 'Pay when you receive' },
    { value: 'Card', label: 'Credit/Debit Card', icon: <FiCreditCard size={20} />, desc: 'Secure card payment' },
    { value: 'UPI', label: 'UPI Payment', icon: <span className="text-lg">📱</span>, desc: 'Google Pay, PhonePe, etc.' }
  ];

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      <div className="bg-gradient-to-r from-chocolate-700 to-chocolate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold">Checkout</h1>
          <p className="text-chocolate-200 mt-2">Complete your order</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Address & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="card p-6">
                <h2 className="font-display font-semibold text-xl text-chocolate-700 mb-6 flex items-center space-x-2">
                  <FiTruck className="text-coral-400" />
                  <span>Shipping Address</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-chocolate-600 mb-1">Full Name</label>
                    <input type="text" name="fullName" value={address.fullName} onChange={handleChange}
                      className="input-field" placeholder="John Doe" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-chocolate-600 mb-1">Address</label>
                    <input type="text" name="address" value={address.address} onChange={handleChange}
                      className="input-field" placeholder="123 Main Street, Apt 4B" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-chocolate-600 mb-1">City</label>
                    <input type="text" name="city" value={address.city} onChange={handleChange}
                      className="input-field" placeholder="New York" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-chocolate-600 mb-1">State</label>
                    <input type="text" name="state" value={address.state} onChange={handleChange}
                      className="input-field" placeholder="NY" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-chocolate-600 mb-1">Zip Code</label>
                    <input type="text" name="zipCode" value={address.zipCode} onChange={handleChange}
                      className="input-field" placeholder="10001" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-chocolate-600 mb-1">Phone</label>
                    <input type="tel" name="phone" value={address.phone} onChange={handleChange}
                      className="input-field" placeholder="+91 98765 43210" required />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card p-6">
                <h2 className="font-display font-semibold text-xl text-chocolate-700 mb-6 flex items-center space-x-2">
                  <FiCreditCard className="text-coral-400" />
                  <span>Payment Method</span>
                </h2>
                <div className="space-y-3">
                  {paymentOptions.map(opt => (
                    <label key={opt.value}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === opt.value
                          ? 'border-chocolate-500 bg-chocolate-50'
                          : 'border-chocolate-100 hover:border-chocolate-200'
                      }`}
                    >
                      <input type="radio" name="paymentMethod" value={opt.value}
                        checked={paymentMethod === opt.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only" />
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                        paymentMethod === opt.value ? 'border-chocolate-500' : 'border-chocolate-200'
                      }`}>
                        {paymentMethod === opt.value && (
                          <div className="w-3 h-3 rounded-full bg-chocolate-500"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-chocolate-500">{opt.icon}</span>
                        <div>
                          <p className="font-semibold text-chocolate-700">{opt.label}</p>
                          <p className="text-xs text-chocolate-400">{opt.desc}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="card p-6 sticky top-24">
                <h2 className="font-display font-semibold text-xl text-chocolate-700 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item._id} className="flex items-center space-x-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-chocolate-700 truncate">{item.name}</p>
                        <p className="text-xs text-chocolate-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-chocolate-600">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-chocolate-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-chocolate-500">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-chocolate-500">
                    <span>Shipping</span>
                    <span>{shippingPrice === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingPrice}`}</span>
                  </div>
                  <div className="flex justify-between text-chocolate-500">
                    <span>Tax (GST 18%)</span>
                    <span>₹{taxPrice}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="border-t border-chocolate-100 pt-3 flex justify-between">
                    <span className="font-display font-bold text-lg text-chocolate-700">Total</span>
                    <span className="font-bold text-2xl text-chocolate-700">₹{finalTotal}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-secondary mt-6 py-4 flex items-center justify-center space-x-2 text-lg disabled:opacity-50"
                >
                  {loading ? (
                    <span>Placing Order...</span>
                  ) : (
                    <>
                      <FiCheck size={20} />
                      <span>Place Order</span>
                    </>
                  )}
                </button>
                <p className="text-xs text-chocolate-300 text-center mt-3">
                  By placing this order, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
