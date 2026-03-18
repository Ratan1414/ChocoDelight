const express = require('express');
const router = express.Router();
const {
  getAllProducts, getProduct, getFeaturedProducts,
  getCategories, createProduct, updateProduct, deleteProduct, getRelatedProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id/related', getRelatedProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
