const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryHierarchy,
  getFeaturedCategories
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getCategories);
router.get('/hierarchy', getCategoryHierarchy);
router.get('/featured', getFeaturedCategories);
router.get('/:id', getCategory);
router.get('/slug/:slug', getCategoryBySlug);

// Admin routes
router.post('/', protect, authorize('admin', 'super_admin'), createCategory);
router.put('/:id', protect, authorize('admin', 'super_admin'), updateCategory);
router.delete('/:id', protect, authorize('admin', 'super_admin'), deleteCategory);

module.exports = router;