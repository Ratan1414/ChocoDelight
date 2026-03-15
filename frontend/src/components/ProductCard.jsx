import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiEye, FiX } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [showQuickView, setShowQuickView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const inWishlist = isInWishlist(product._id);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className="text-gold-500" size={14} />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-gold-500" size={14} />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gold-500" size={14} />);
      }
    }
    return stars;
  };

  return (
    <>
      <div className="card group relative transform hover:scale-105 transition-all duration-500 hover:shadow-2xl" id={`product-${product._id}`}>
        {/* Sale Badge */}
        {product.originalPrice && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-coral-400 to-coral-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 z-10 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product._id); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
              inWishlist ? 'bg-coral-400 text-white' : 'bg-white/90 text-chocolate-400 hover:bg-coral-400 hover:text-white'
            }`}
          >
            <FiHeart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); setShowQuickView(true); }}
            className="w-10 h-10 rounded-full bg-white/90 text-chocolate-400 flex items-center justify-center shadow-lg hover:bg-chocolate-500 hover:text-white transition-all duration-300 hover:scale-110"
          >
            <FiEye size={16} />
          </button>
        </div>

        {/* Image */}
        <Link to={`/product/${product._id}`} className="block overflow-hidden">
          <div className="relative h-52 sm:h-60 overflow-hidden bg-gradient-to-br from-cream-100 to-cream-200">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-chocolate-100 via-cream-100 to-chocolate-100 animate-pulse"></div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Info */}
        <div className="p-4">
          <Link to={`/product/${product._id}`}>
            <p className="text-xs text-coral-400 font-semibold uppercase tracking-wide mb-1 transform group-hover:scale-105 transition-transform duration-300">{product.category}</p>
            <h3 className="font-display font-semibold text-chocolate-700 text-lg leading-tight mb-2 group-hover:text-coral-400 transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-1.5 mb-3">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-xs text-chocolate-400">({product.numReviews})</span>
          </div>

          {/* Price & Cart */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-chocolate-600">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-chocolate-300 line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <button
              onClick={() => addToCart(product)}
              className="w-12 h-12 rounded-xl bg-gradient-to-r from-chocolate-500 to-chocolate-600 text-white flex items-center justify-center
                         hover:from-coral-400 hover:to-coral-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 transform group-hover:scale-110"
              title="Add to Cart"
            >
              <FiShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
            <div className="flex">
              {/* Image */}
              <div className="w-1/2 p-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-xl"
                />
              </div>

              {/* Details */}
              <div className="w-1/2 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-coral-400 font-semibold uppercase tracking-wide mb-1">{product.category}</p>
                    <h2 className="text-2xl font-display font-bold text-chocolate-700">{product.name}</h2>
                  </div>
                  <button
                    onClick={() => setShowQuickView(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">{renderStars(product.rating)}</div>
                  <span className="text-sm text-chocolate-400">({product.numReviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-3xl font-bold text-chocolate-600">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xl text-chocolate-300 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <span className="text-sm bg-coral-100 text-coral-700 px-2 py-1 rounded-full">
                      Save ₹{product.originalPrice - product.price}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-chocolate-600 text-sm mb-6 line-clamp-3">{product.description}</p>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => { addToCart(product); setShowQuickView(false); }}
                    className="w-full bg-gradient-to-r from-chocolate-500 to-chocolate-600 text-white py-3 px-6 rounded-xl hover:from-coral-400 hover:to-coral-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Add to Cart
                  </button>
                  <Link
                    to={`/product/${product._id}`}
                    onClick={() => setShowQuickView(false)}
                    className="block w-full text-center bg-gray-100 text-chocolate-600 py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
