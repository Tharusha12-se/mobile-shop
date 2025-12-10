const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getAdminProducts,
  getAdminOrders,
  getSalesReport,
  getProductAnalytics,
  getUserAnalytics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require admin role
router.use(protect);
router.use(authorize('admin', 'super_admin'));

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// User management
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Product management
router.get('/products', getAdminProducts);

// Order management
router.get('/orders', getAdminOrders);

// Reports and analytics
router.get('/reports/sales', getSalesReport);
router.get('/analytics/products', getProductAnalytics);
router.get('/analytics/users', getUserAnalytics);

module.exports = router;