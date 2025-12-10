const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
  createProductReview,
  getProductReviews,
  getRelatedProducts,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  updateStock,
  getProductsByCategory
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { uploadProductImages: uploadMiddleware } = require('../middleware/upload');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/best-sellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/category/:categorySlug', getProductsByCategory);
router.get('/:id', getProduct);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id/reviews', getProductReviews);
router.get('/:id/related', getRelatedProducts);

// Protected routes
router.post('/:id/reviews', protect, createProductReview);

// Admin routes
router.post('/', protect, authorize('admin', 'super_admin'), createProduct);
router.put('/:id', protect, authorize('admin', 'super_admin'), updateProduct);
router.delete('/:id', protect, authorize('admin', 'super_admin'), deleteProduct);
router.put('/:id/stock', protect, authorize('admin', 'super_admin'), updateStock);

// Image upload routes (admin only)
router.post(
  '/:id/images',
  protect,
  authorize('admin', 'super_admin'),
  uploadMiddleware,
  uploadProductImages
);
router.delete(
  '/:id/images/:imageId',
  protect,
  authorize('admin', 'super_admin'),
  deleteProductImage
);

module.exports = router;