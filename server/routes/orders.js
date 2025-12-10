const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrder,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  cancelOrder,
  createPaymentIntent,
  getOrderStats
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// Protected routes
router.use(protect);

router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/pay', updateOrderToPaid);
router.put('/:id/cancel', cancelOrder);
router.post('/create-payment-intent', createPaymentIntent);

// Admin routes
router.get('/', authorize('admin', 'super_admin'), getOrders);
router.get('/stats', authorize('admin', 'super_admin'), getOrderStats);
router.put('/:id/deliver', authorize('admin', 'super_admin'), updateOrderToDelivered);
router.put('/:id/status', authorize('admin', 'super_admin'), updateOrderStatus);

module.exports = router;