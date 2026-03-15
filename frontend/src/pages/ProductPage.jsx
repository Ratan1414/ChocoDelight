import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiStar, FiChevronRight } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { getProduct, getRelatedProducts, getProductReviews, createReview } from '../services/api';
import toast from 'react-hot-toast';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const [prodRes, relRes, revRes] = await Promise.all([
        getProduct(id),
        getRelatedProducts(id),
        getProductReviews(id)
      ]);
      setProduct(prodRes.data.product);
      setRelated(relRes.data.products);
      setReviews(revRes.data.reviews);
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await createReview(id, reviewForm);
      setReviews(prev => [data.review, ...prev]);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted!');
      // Reload product to update rating
      const prodRes = await getProduct(id);
      setProduct(prodRes.data.product);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, size = 18) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars.push(<FaStar key={i} className="text-gold-500" size={size} />);
      else if (i - 0.5 <= rating) stars.push(<FaStarHalfAlt key={i} className="text-gold-500" size={size} />);
      else stars.push(<FaRegStar key={i} className="text-gold-500" size={size} />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-chocolate-200 border-t-chocolate-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream-50">
        <span className="text-6xl mb-4">🍫</span>
        <h2 className="text-2xl font-display font-bold text-chocolate-600">Product Not Found</h2>
        <Link to="/shop" className="btn-primary mt-4">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-chocolate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm text-chocolate-400">
            <Link to="/" className="hover:text-chocolate-600 transition-colors">Home</Link>
            <FiChevronRight size={14} />
            <Link to="/shop" className="hover:text-chocolate-600 transition-colors">Shop</Link>
            <FiChevronRight size={14} />
            <span className="text-chocolate-600 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="card overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <div key={i} className="card overflow-hidden cursor-pointer hover:ring-2 ring-chocolate-400 transition-all">
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-20 object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-coral-400 font-semibold uppercase tracking-wider text-sm mb-2">{product.category}</p>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-chocolate-700">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-3">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-chocolate-500 font-medium">{product.rating}</span>
              <span className="text-chocolate-300">({product.numReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-chocolate-600">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-chocolate-300 line-through">₹{product.originalPrice}</span>
                  <span className="bg-coral-100 text-coral-500 text-sm font-bold px-3 py-1 rounded-full">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <p className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✕ Out of Stock'}
            </p>

            {/* Description */}
            <p className="text-chocolate-500 leading-relaxed">{product.description}</p>

            {/* Quantity & Actions */}
            {product.stock > 0 && (
              <div className="space-y-4 pt-4 border-t border-chocolate-100">
                <div className="flex items-center space-x-4">
                  <span className="text-chocolate-600 font-medium">Quantity:</span>
                  <div className="flex items-center border-2 border-chocolate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-chocolate-500 hover:bg-chocolate-50 transition-colors"
                    >
                      <FiMinus />
                    </button>
                    <span className="w-14 h-10 flex items-center justify-center font-semibold text-chocolate-700 border-x-2 border-chocolate-200">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center text-chocolate-500 hover:bg-chocolate-50 transition-colors"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2 py-4 text-lg"
                  >
                    <FiShoppingCart size={20} />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                      isInWishlist(product._id)
                        ? 'border-coral-400 bg-coral-400 text-white'
                        : 'border-chocolate-200 text-chocolate-400 hover:border-coral-400 hover:text-coral-400'
                    }`}
                  >
                    <FiHeart size={22} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {product.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-chocolate-50 text-chocolate-400 text-xs rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs: Reviews */}
        <div className="mt-16">
          <div className="flex space-x-1 border-b-2 border-chocolate-100 mb-8">
            {['description', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold capitalize transition-all border-b-2 -mb-0.5 ${
                  activeTab === tab
                    ? 'border-chocolate-500 text-chocolate-700'
                    : 'border-transparent text-chocolate-300 hover:text-chocolate-500'
                }`}
              >
                {tab} {tab === 'reviews' && `(${reviews.length})`}
              </button>
            ))}
          </div>

          {activeTab === 'description' ? (
            <div className="glass-card p-8">
              <p className="text-chocolate-500 leading-relaxed text-lg">{product.description}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Review Form */}
              {user && (
                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-xl text-chocolate-700 mb-4">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-chocolate-600 font-medium mb-2">Rating</label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                            className="transition-transform hover:scale-110"
                          >
                            <FaStar size={28} className={star <= reviewForm.rating ? 'text-gold-500' : 'text-gray-300'} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-chocolate-600 font-medium mb-2">Your Review</label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        className="input-field h-32 resize-none"
                        placeholder="Share your experience with this chocolate..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="glass-card p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chocolate-400 to-coral-400 flex items-center justify-center text-white font-bold">
                            {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-chocolate-700">{review.user?.name || 'Anonymous'}</p>
                            <div className="flex">{renderStars(review.rating, 14)}</div>
                          </div>
                        </div>
                        <span className="text-xs text-chocolate-300">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-chocolate-500">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl mb-3 block">💬</span>
                  <p className="text-chocolate-400">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-chocolate-700 mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
