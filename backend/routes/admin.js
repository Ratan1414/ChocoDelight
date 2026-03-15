const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getAnalytics,
  getAllUsers, deleteUser, toggleBlockUser,
  getAllCoupons, updateCoupon, deleteCoupon,
  cancelOrder
} = require('../controllers/adminController');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { createCoupon } = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin
router.use(protect, authorize('admin'));

// Dashboard & Analytics
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);

// Users
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/block', toggleBlockUser);

// Products (reuse existing controllers)
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/cancel', cancelOrder);

// Coupons
router.get('/coupons', getAllCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

module.exports = router;
