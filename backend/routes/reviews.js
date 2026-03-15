const express = require('express');
const router = express.Router();
const {
  createReview,
  updateReview,
  getProductReviews,
  getOrderReviews,
  getUserReviews,
  deleteReview,
  getAllReviews,
  respondToReview,
  toggleReviewReport
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected user routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.get('/user/my-reviews', protect, getUserReviews);
router.get('/order/:orderId', protect, getOrderReviews);
router.delete('/:id', protect, deleteReview);

// Admin routes
router.get('/admin/all', protect, getAllReviews);
router.put('/:id/respond', protect, respondToReview);
router.put('/:id/toggle-report', protect, toggleReviewReport);

module.exports = router;
