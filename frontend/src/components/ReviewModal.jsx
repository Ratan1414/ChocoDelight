import { useState } from 'react';
import { FiStar, FiX, FiUpload } from 'react-icons/fi';
import { createReview, updateReview } from '../services/api';
import toast from 'react-hot-toast';

const ReviewModal = ({ isOpen, onClose, orderId, product, existingReview = null, onReviewSubmitted }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [images, setImages] = useState(existingReview?.images || []);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setLoading(true);
    try {
      const reviewData = {
        orderId,
        productId: product._id,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        images
      };

      if (existingReview) {
        await updateReview(existingReview._id, reviewData);
        toast.success('Review updated successfully!');
      } else {
        await createReview(reviewData);
        toast.success('Review submitted successfully!');
      }

      onReviewSubmitted();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you'd upload these to a server
    // For now, we'll just create object URLs
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-chocolate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-chocolate-700">
              {existingReview ? 'Edit Review' : 'Write a Review'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-chocolate-50 rounded-full transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
          <div className="flex items-center space-x-3 mt-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-medium text-chocolate-700">{product.name}</h3>
              <p className="text-sm text-chocolate-400">Order #{orderId.slice(-8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-chocolate-600 mb-2">
              Rating *
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1"
                >
                  <FiStar
                    size={24}
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-chocolate-400">
                {rating > 0 && `${rating} star${rating > 1 ? 's' : ''}`}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-chocolate-600 mb-2">
              Review Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Sum up your experience in a few words"
              maxLength={100}
              required
            />
            <p className="text-xs text-chocolate-400 mt-1">{title.length}/100 characters</p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-chocolate-600 mb-2">
              Your Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input-field resize-none"
              rows={4}
              placeholder="Share your experience with this product..."
              maxLength={500}
              required
            />
            <p className="text-xs text-chocolate-400 mt-1">{comment.length}/500 characters</p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-chocolate-600 mb-2">
              Photos (Optional)
            </label>
            <div className="flex flex-wrap gap-3 mb-3">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Review ${index + 1}`}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
            {images.length < 5 && (
              <label className="inline-flex items-center space-x-2 cursor-pointer bg-chocolate-50 hover:bg-chocolate-100 px-4 py-2 rounded-lg transition-colors">
                <FiUpload size={16} />
                <span className="text-sm">Add Photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
            <p className="text-xs text-chocolate-400 mt-1">Upload up to 5 photos</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-chocolate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-chocolate-200 text-chocolate-600 rounded-lg hover:bg-chocolate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-chocolate-500 text-white rounded-lg hover:bg-chocolate-600 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;