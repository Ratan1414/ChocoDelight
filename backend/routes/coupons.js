const express = require('express');
const router = express.Router();
const { validateCoupon, createCoupon } = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');

router.post('/validate', protect, validateCoupon);
router.post('/', protect, authorize('admin'), createCoupon);

module.exports = router;
