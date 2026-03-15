const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.createReview = async (req, res) => {
  try {
    const { orderId, productId, rating, title, comment, images } = req.body;

    // Check if order exists and belongs to user
    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if order is delivered
    // Temporarily disabled for testing
    // if (order.status !== 'Delivered') {
    //   return res.status(400).json({ success: false, message: 'You can only review delivered orders' });
    // }

    // Check if product is in the order
    const orderItem = order.items.find(item => item.product.toString() === productId);
    if (!orderItem) {
      return res.status(400).json({ success: false, message: 'Product not found in this order' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ order: orderId, product: productId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You already reviewed this product from this order' });
    }

    const review = await Review.create({
      user: req.user._id,
      order: orderId,
      product: productId,
      rating: Number(rating),
      title,
      comment,
      images: images || []
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name')
      .populate('product', 'name image');

    res.status(201).json({ success: true, review: populatedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, title, comment, images } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    review.images = images || review.images;

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name')
      .populate('product', 'name image');

    res.status(200).json({ success: true, review: populatedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .populate('order', 'status')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ order: req.params.orderId })
      .populate('product', 'name image')
      .populate('user', 'name');
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'name image')
      .populate('order', 'status invoiceNumber')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin functions
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('product', 'name')
      .populate('order', 'invoiceNumber status')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.respondToReview = async (req, res) => {
  try {
    const { comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.adminResponse = {
      comment,
      respondedAt: new Date(),
      respondedBy: req.user._id
    };

    await review.save();

    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleReviewReport = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.reported = !review.reported;
    await review.save();

    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
