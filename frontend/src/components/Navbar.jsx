import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiChevronDown, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const categories = [
    { name: 'Dark Chocolate', count: 8, image: 'https://images.unsplash.com/photo-1548741487-18d363dc4469?w=100' },
    { name: 'Milk Chocolate', count: 8, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=100' },
    { name: 'Caramel Candy', count: 7, image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=100' },
    { name: 'Hazelnut Chocolate', count: 7, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=100' },
    { name: 'Fruit Chocolate', count: 7, image: 'https://images.unsplash.com/photo-1548741487-18d363dc4469?w=100' },
    { name: 'Chocolate Bars', count: 7, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=100' },
    { name: 'Chocolate Gift Boxes', count: 6, image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=100' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-chocolate-100'
        : 'bg-white/90 backdrop-blur-md shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">🍫</span>
            <span className="text-2xl lg:text-3xl font-display font-bold gradient-text">
              ChocoDelight
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-chocolate-600 hover:text-chocolate-500 font-medium transition-all duration-300 relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-coral-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Shop with Mega Menu */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowMegaMenu(true)}
                onMouseLeave={() => setShowMegaMenu(false)}
                className="flex items-center space-x-1 text-chocolate-600 hover:text-chocolate-500 font-medium transition-all duration-300 relative group"
              >
                <span>Shop</span>
                <FiChevronDown size={16} className={`transition-transform duration-300 ${showMegaMenu ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-coral-400 transition-all duration-300 group-hover:w-full"></span>
              </button>

              {/* Mega Menu */}
              {showMegaMenu && (
                <div
                  className="absolute top-full left-0 mt-2 w-screen max-w-4xl bg-white rounded-2xl shadow-2xl border border-chocolate-100 overflow-hidden animate-fade-in"
                  onMouseEnter={() => setShowMegaMenu(true)}
                  onMouseLeave={() => setShowMegaMenu(false)}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-6">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          to={`/shop?category=${encodeURIComponent(category.name)}`}
                          className="group flex items-center space-x-3 p-3 rounded-xl hover:bg-cream-50 transition-all duration-300"
                        >
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-12 h-12 rounded-lg object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div>
                            <h3 className="font-medium text-chocolate-700 group-hover:text-coral-500 transition-colors">
                              {category.name}
                            </h3>
                            <p className="text-sm text-chocolate-400">{category.count} products</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-chocolate-100">
                      <Link
                        to="/shop"
                        className="inline-flex items-center space-x-2 text-coral-500 hover:text-coral-600 font-medium transition-colors group"
                      >
                        <span>View All Products</span>
                        <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search chocolates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 rounded-full border-2 border-chocolate-200 focus:border-chocolate-400 focus:outline-none bg-cream-50 text-sm transition-all duration-300 focus:w-80 focus:shadow-lg"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate-300" />
            </form>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {user && (
              <Link to="/account?tab=wishlist" className="relative p-2 text-chocolate-600 hover:text-coral-400 transition-all duration-300 hover:scale-110" title="Wishlist">
                <FiHeart size={22} />
                {wishlist?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-coral-400 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}
            <button onClick={() => setShowCartDrawer(true)} className="relative p-2 text-chocolate-600 hover:text-coral-400 transition-all duration-300 hover:scale-110" title="Cart">
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-coral-400 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
            {user ? (
              <div className="hidden lg:flex items-center space-x-2">
                <Link to="/account" className="p-2 text-chocolate-600 hover:text-coral-400 transition-all duration-300 hover:scale-110" title="Account">
                  <FiUser size={22} />
                </Link>
                <button onClick={logout} className="p-2 text-chocolate-400 hover:text-coral-400 transition-all duration-300 hover:scale-110" title="Logout">
                  <FiLogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden lg:inline-flex btn-primary text-sm py-2 px-4 transform hover:scale-105 transition-all duration-300">
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-chocolate-600 hover:text-coral-400 transition-all duration-300"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-chocolate-100 animate-slide-down">
          <div className="px-4 py-4 space-y-3">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Search chocolates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border-2 border-chocolate-200 focus:border-chocolate-400 focus:outline-none bg-cream-50 text-sm"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-chocolate-300" />
            </form>
            <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-chocolate-600 font-medium hover:text-coral-400 transition-colors">Home</Link>
            <Link to="/shop" onClick={() => setIsOpen(false)} className="block py-2 text-chocolate-600 font-medium hover:text-coral-400 transition-colors">Shop</Link>
            {user ? (
              <>
                <Link to="/account" onClick={() => setIsOpen(false)} className="block py-2 text-chocolate-600 font-medium hover:text-coral-400 transition-colors">My Account</Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="block py-2 text-coral-400 font-medium hover:text-coral-500 transition-colors">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2">
                <span className="btn-primary text-sm py-2 px-4">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
      <CartDrawer isOpen={showCartDrawer} onClose={() => setShowCartDrawer(false)} />
    </nav>
  );
};

export default Navbar;
