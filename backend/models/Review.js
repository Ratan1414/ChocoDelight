const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    maxLength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
    maxLength: [500, 'Comment cannot exceed 500 characters']
  },
  images: [{
    type: String // URLs to review images
  }],
  isVerified: {
    type: Boolean,
    default: true // Reviews from completed orders are verified
  },
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reported: {
    type: Boolean,
    default: false
  },
  adminResponse: {
    comment: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews for same order-product combination
reviewSchema.index({ order: 1, product: 1 }, { unique: true });

// Update product's average rating when review is saved
reviewSchema.post('save', async function() {
  try {
    const Product = mongoose.model('Product');
    const reviews = await mongoose.model('Review').find({ product: this.product });
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(this.product, {
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      numReviews: reviews.length
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
});

// Update product's average rating when review is removed
reviewSchema.post('remove', async function() {
  try {
    const Product = mongoose.model('Product');
    const reviews = await mongoose.model('Review').find({ product: this.product });
    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(this.product, {
        rating: 0,
        numReviews: 0
      });
    } else {
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      await Product.findByIdAndUpdate(this.product, {
        rating: Math.round(avgRating * 10) / 10,
        numReviews: reviews.length
      });
    }
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
