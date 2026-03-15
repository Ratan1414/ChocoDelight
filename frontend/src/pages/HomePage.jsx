import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiGift, FiTruck, FiStar, FiArrowRight, FiSend } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getFeaturedProducts, getBestSellers } from '../services/api';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      console.log('Loading products...');
      const [featRes, bestRes] = await Promise.all([
        getFeaturedProducts(),
        getBestSellers()
      ]);
      console.log('Featured products:', featRes.data.products);
      console.log('Best sellers:', bestRes.data.products);
      setFeatured(featRes.data.products);
      setBestSellers(bestRes.data.products);
    } catch (error) {
      console.error('Failed to load products:', error);
      // Set dummy data on error for testing
      setFeatured([
        {
          _id: '1',
          name: 'Test Chocolate 1',
          price: 299,
          originalPrice: 399,
          category: 'Dark Chocolate',
          image: 'https://images.unsplash.com/photo-1548741487-18d363dc4469?w=500',
          rating: 4.5,
          numReviews: 10
        }
      ]);
      setBestSellers([
        {
          _id: '2',
          name: 'Best Seller Chocolate',
          price: 349,
          category: 'Dark Chocolate',
          image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500',
          rating: 4.8,
          numReviews: 25
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const testimonials = [
    { name: 'Sarah M.', text: 'The Belgian truffles are absolutely divine! Best chocolates I\'ve ever tasted. The packaging was beautiful too.', rating: 5, avatar: '👩‍💼' },
    { name: 'James K.', text: 'Ordered the gift box for my wife\'s birthday. She was thrilled! The quality is exceptional and delivery was super fast.', rating: 5, avatar: '👨‍💻' },
    { name: 'Emily R.', text: 'The sugar-free options taste amazing — you\'d never know they\'re sugar free! Finally, chocolates I can enjoy guilt-free.', rating: 4, avatar: '👩‍🎨' },
  ];

  const offers = [
    { title: 'First Order Discount', desc: 'Use code WELCOME15 for 15% off', icon: <FiGift className="text-coral-400" size={32} />, bg: 'from-coral-50 to-cream-100' },
    { title: 'Free Shipping', desc: 'On all orders above ₹500', icon: <FiTruck className="text-chocolate-500" size={32} />, bg: 'from-chocolate-50 to-cream-100' },
    { title: 'Loyalty Points', desc: 'Earn points on every purchase', icon: <FiStar className="text-gold-500" size={32} />, bg: 'from-gold-50 to-cream-100' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-chocolate-800 via-chocolate-700 to-chocolate-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <span className="mr-2">🎉</span> New collection just dropped — 20% off!
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight">
                Indulge in{' '}
                <span className="text-gold-400">Premium</span>{' '}
                Chocolate Bliss
              </h1>
              <p className="text-lg lg:text-xl text-chocolate-100 max-w-lg leading-relaxed">
                Handcrafted artisan chocolates made with the finest cocoa beans from around the world.
                Every bite is a journey of pure delight.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="inline-flex items-center space-x-2 bg-coral-400 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-coral-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                  <FiShoppingBag size={20} />
                  <span>Shop Now</span>
                </Link>
                <Link to="/shop?category=Chocolate+Gift+Boxes" className="inline-flex items-center space-x-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all">
                  <FiGift size={20} />
                  <span>Gift Boxes</span>
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center relative">
              <div className="relative w-96 h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-400/30 to-coral-400/30 rounded-full blur-2xl"></div>
                <div className="relative z-10 animate-float text-center">
                  <span className="text-[12rem] select-none">🍫</span>
                  <div className="absolute top-8 right-0 animate-bounce-gentle delay-150">
                    <span className="text-6xl select-none">🍬</span>
                  </div>
                  <div className="absolute bottom-12 left-0 animate-bounce-gentle">
                    <span className="text-5xl select-none">🎁</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50L48 45C96 40 192 30 288 35C384 40 480 60 576 65C672 70 768 60 864 50C960 40 1056 30 1152 35C1248 40 1344 60 1392 70L1440 80V100H0V50Z" fill="#FFF5E1"/>
          </svg>
        </div>
      </section>

      {/* Offers Strip */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer, i) => (
              <div key={i} className={`card p-6 bg-gradient-to-br ${offer.bg} flex items-start space-x-4 hover:-translate-y-1`}>
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm">
                  {offer.icon}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-chocolate-700 text-lg">{offer.title}</h3>
                  <p className="text-chocolate-400 text-sm mt-1">{offer.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 lg:py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-coral-400 font-semibold uppercase tracking-wider text-sm">Curated Selection</span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-chocolate-700 mt-2">
              Featured Chocolates
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-coral-400 to-gold-400 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <LoadingSkeleton type="product-grid" count={4} />
            ) : (
              featured.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
          <div className="text-center mt-10">
            <Link to="/shop" className="inline-flex items-center space-x-2 btn-outline">
              <span>View All Products</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-gold-500 font-semibold uppercase tracking-wider text-sm">🏆 Most Popular</span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-chocolate-700 mt-2">
              Best Selling Candies
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold-400 to-chocolate-400 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <LoadingSkeleton type="product-grid" count={4} />
            ) : (
              bestSellers.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Big Promo Banner */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-chocolate-700 via-chocolate-600 to-coral-500 text-white p-8 lg:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-5xl font-display font-bold">
                  Sweet Deal! <span className="text-gold-400">20% Off</span> Gift Boxes
                </h2>
                <p className="text-chocolate-100 text-lg">
                  Perfect for birthdays, anniversaries, or just because.
                  Use code <span className="bg-white/20 px-3 py-1 rounded-lg font-mono font-bold">SWEET20</span> at checkout.
                </p>
                <Link to="/shop?category=Chocolate+Gift+Boxes" className="inline-flex items-center space-x-2 bg-gold-500 text-chocolate-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gold-400 transition-all shadow-lg">
                  <FiGift />
                  <span>Shop Gift Boxes</span>
                </Link>
              </div>
              <div className="hidden lg:flex justify-center">
                <span className="text-[10rem] animate-float select-none">🎁</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 lg:py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-coral-400 font-semibold uppercase tracking-wider text-sm">💝 Love Letters</span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-chocolate-700 mt-2">
              What Our Customers Say
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-coral-400 to-gold-400 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card p-6 hover:-translate-y-2 transition-all duration-300">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, si) => (
                    <FiStar key={si} size={16} className={si < t.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-300'} />
                  ))}
                </div>
                <p className="text-chocolate-500 italic leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center space-x-3 pt-4 border-t border-chocolate-100">
                  <span className="text-3xl">{t.avatar}</span>
                  <span className="font-semibold text-chocolate-700">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-chocolate-600 to-chocolate-800 rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-40 h-40 bg-gold-400 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-coral-400 rounded-full blur-2xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-3">
                Stay Sweet 🍭
              </h2>
              <p className="text-chocolate-100 text-lg mb-8 max-w-xl mx-auto">
                Subscribe to our newsletter for exclusive deals, new arrivals, and chocolate tips.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); setEmail(''); }} className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-gold-400 backdrop-blur-sm"
                  required
                />
                <button type="submit" className="bg-gold-500 text-chocolate-800 px-8 py-3.5 rounded-xl font-bold hover:bg-gold-400 transition-all flex items-center justify-center space-x-2 shadow-lg">
                  <FiSend size={18} />
                  <span>Subscribe</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
