import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter, FiHeart } from 'react-icons/fi';

const Footer = () => {
  const instagramPosts = [
    { id: 1, image: 'https://images.unsplash.com/photo-1548741487-18d363dc4469?w=200', alt: 'Chocolate truffles' },
    { id: 2, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=200', alt: 'Dark chocolate bar' },
    { id: 3, image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=200', alt: 'Chocolate gift box' },
    { id: 4, image: 'https://images.unsplash.com/photo-1548741487-18d363dc4469?w=200', alt: 'Artisan chocolates' },
    { id: 5, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=200', alt: 'Premium chocolate' },
    { id: 6, image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=200', alt: 'Chocolate collection' },
  ];

  return (
    <footer className="bg-gradient-to-b from-chocolate-800 to-chocolate-900 text-cream-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gold-400 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-coral-400 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gold-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">🍫</span>
              <span className="text-2xl font-display font-bold text-gold-400">ChocoDelight</span>
            </Link>
            <p className="text-chocolate-200 text-sm leading-relaxed max-w-md">
              Handcrafting premium chocolates since 2020. Every piece is a celebration of flavor,
              quality, and the art of chocolate making. Made with love, shared with joy.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-12 h-12 rounded-full bg-chocolate-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-300 hover:scale-110 shadow-lg">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-chocolate-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 transition-all duration-300 hover:scale-110 shadow-lg">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-chocolate-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-500 transition-all duration-300 hover:scale-110 shadow-lg">
                <FiTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display font-semibold text-gold-400 mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { name: 'Home', path: '/' },
                { name: 'Shop', path: '/shop' },
                { name: 'Cart', path: '/cart' },
                { name: 'My Account', path: '/account' }
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.path}
                    className="text-chocolate-200 hover:text-gold-400 transition-all duration-300 hover:translate-x-1 inline-block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-display font-semibold text-gold-400 mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {[
                { name: 'Dark Chocolate', path: '/shop?category=Dark Chocolate' },
                { name: 'Milk Chocolate', path: '/shop?category=Milk Chocolate' },
                { name: 'Caramel Candy', path: '/shop?category=Caramel Candy' },
                { name: 'Hazelnut Chocolate', path: '/shop?category=Hazelnut Chocolate' },
                { name: 'Chocolate Gift Boxes', path: '/shop?category=Chocolate Gift Boxes' }
              ].map(cat => (
                <li key={cat.name}>
                  <Link to={cat.path}
                    className="text-chocolate-200 hover:text-gold-400 transition-all duration-300 hover:translate-x-1 inline-block">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-display font-semibold text-gold-400 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-chocolate-200 text-sm">
                <FiMapPin size={16} className="text-coral-400 flex-shrink-0" />
                <span>123 Cocoa Street, Chocolate City, CC 10001</span>
              </li>
              <li className="flex items-center space-x-3 text-chocolate-200 text-sm">
                <FiPhone size={16} className="text-coral-400 flex-shrink-0" />
                <span>+1 (555) 123-CHOCO</span>
              </li>
              <li className="flex items-center space-x-3 text-chocolate-200 text-sm">
                <FiMail size={16} className="text-coral-400 flex-shrink-0" />
                <span>hello@chocodelight.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Instagram Gallery */}
        <div className="mt-12 pt-8 border-t border-chocolate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-gold-400 flex items-center space-x-2">
              <FiInstagram size={20} />
              <span>Follow Us on Instagram</span>
            </h3>
            <a href="#" className="text-coral-400 hover:text-gold-400 transition-colors font-medium">
              @chocodelight
            </a>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href="#"
                className="group relative aspect-square overflow-hidden rounded-lg bg-chocolate-700 hover:scale-105 transition-all duration-300"
              >
                <img
                  src={post.image}
                  alt={post.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <FiInstagram size={24} className="text-white" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-chocolate-700">
          <div className="max-w-md">
            <h3 className="text-lg font-display font-semibold text-gold-400 mb-2">Stay Sweet!</h3>
            <p className="text-chocolate-200 text-sm mb-4">Subscribe to get exclusive offers and chocolate updates.</p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 bg-chocolate-700 border border-chocolate-600 rounded-lg text-cream-100 placeholder-chocolate-300 focus:outline-none focus:border-gold-400 transition-colors"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-coral-400 to-coral-500 hover:from-gold-400 hover:to-gold-500 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg">
                <FiMail size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-chocolate-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-chocolate-300 text-sm flex items-center space-x-1">
            <span>© 2024 ChocoDelight. Made with</span>
            <FiHeart className="text-coral-400" size={14} />
            <span>for chocolate lovers.</span>
          </p>
          <div className="flex space-x-6 text-sm text-chocolate-300">
            <a href="#" className="hover:text-gold-400 transition-colors hover:scale-105 inline-block">Privacy Policy</a>
            <a href="#" className="hover:text-gold-400 transition-colors hover:scale-105 inline-block">Terms of Service</a>
            <a href="#" className="hover:text-gold-400 transition-colors hover:scale-105 inline-block">Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
