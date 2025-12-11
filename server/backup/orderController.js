const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { ErrorResponse } = require('../middleware/error');
const { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } = require('../utils/emailSender');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
      contactInfo
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price discountPrice images stock sku brand specifications');

    if (!cart || cart.items.length === 0) {
      return next(new ErrorResponse('No items in cart', 400));
    }

    // Check stock for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      
      if (!product || !product.isActive) {
        return next(new ErrorResponse(
          `Product "${item.product.name}" is no longer available`,
          400
        ));
      }

      if (product.stock < item.quantity) {
        return next(new ErrorResponse(
          `Product "${product.name}" has only ${product.stock} items available`,
          400
        ));
      }
    }

    // Prepare order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      sku: item.product.sku,
      quantity: item.quantity,
      price: item.product.discountPrice || item.product.price,
      discountPrice: item.product.discountPrice,
      image: item.product.images[0]?.url || '',
      color: item.color,
      storage: item.storage,
      specifications: item.product.specifications
    }));

    // Calculate prices
    const subtotal = orderItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );
    
    // Apply coupon discount if exists
    let discount = 0;
    if (cart.coupon && cart.coupon.discount) {
      if (cart.coupon.type === 'percentage') {
        discount = (subtotal * cart.coupon.discount) / 100;
      } else {
        discount = cart.coupon.discount;
      }
    }
    
    const totalAfterDiscount = Math.max(0, subtotal - discount);
    const shippingPrice = totalAfterDiscount > 100 ? 0 : 10;
    const taxPrice = totalAfterDiscount * 0.08;
    const totalPrice = totalAfterDiscount + shippingPrice + taxPrice;

    // Create order
    const orderData = {
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || { sameAsShipping: true },
      contactInfo: contactInfo || {},
      paymentMethod,
      subtotal,
      discount,
      coupon: cart.coupon,
      taxPrice,
      shippingPrice,
      totalPrice,
      notes,
      currency: 'USD'
    };

    // Handle Stripe payment
    if (paymentMethod === 'stripe') {
      try {
        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(totalPrice * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            userId: req.user.id.toString(),
            orderNumber: `temp-${Date.now()}`
          }
        });

        orderData.paymentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status
        };
      } catch (stripeError) {
        return next(new ErrorResponse(`Stripe error: ${stripeError.message}`, 400));
      }
    }

    const order = await Order.create(orderData);

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    cart.items = [];
    cart.coupon = undefined;
    await cart.save();

    // Send confirmation email
    const user = await User.findById(req.user.id);
    await sendOrderConfirmationEmail(user, order);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('items.product', 'name images slug');

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Make sure user owns the order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this order', 401));
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort('-createdAt')
      .populate('items.product', 'name images');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/v1/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check if already paid
    if (order.isPaid) {
      return next(new ErrorResponse('Order is already paid', 400));
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer?.email_address || req.user.email,
      receipt_url: req.body.receipt_url
    };

    // Update order status based on payment
    if (order.paymentMethod === 'cod') {
      order.status = 'confirmed';
    } else {
      order.status = 'processing';
    }

    const updatedOrder = await order.save();

    // Send status update email
    const user = await User.findById(order.user);
    await sendOrderStatusUpdateEmail(user, updatedOrder);

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    if (!order.isPaid) {
      return next(new ErrorResponse('Order is not paid', 400));
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';

    const updatedOrder = await order.save();

    // Send status update email
    const user = await User.findById(order.user);
    await sendOrderStatusUpdateEmail(user, updatedOrder);

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, carrier, adminNotes } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['processing', 'cancelled'],
      'processing': ['shipped', 'cancelled'],
      'shipped': ['delivered'],
      'delivered': ['refunded'],
      'cancelled': [],
      'refunded': []
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return next(new ErrorResponse(
        `Cannot change status from ${order.status} to ${status}`,
        400
      ));
    }

    // Update order
    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;
    if (adminNotes) order.adminNotes = adminNotes;

    // Update delivered status if applicable
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    // Handle cancellation
    if (status === 'cancelled') {
      // Restore product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity, sold: -item.quantity } }
        );
      }
    }

    // Handle refund
    if (status === 'refunded') {
      order.refundedAt = Date.now();
      order.refundAmount = order.totalPrice;
      
      // Restore product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity, sold: -item.quantity } }
        );
      }
    }

    const updatedOrder = await order.save();

    // Send status update email
    const user = await User.findById(order.user);
    await sendOrderStatusUpdateEmail(user, updatedOrder);

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to cancel this order', 401));
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      return next(new ErrorResponse(
        'Order cannot be cancelled at this stage',
        400
      ));
    }

    order.status = 'cancelled';
    order.cancellationReason = reason;

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity, sold: -item.quantity } }
      );
    }

    const updatedOrder = await order.save();

    // Send status update email
    const user = await User.findById(order.user);
    await sendOrderStatusUpdateEmail(user, updatedOrder);

    res.status(200).json({
      success: true,
      data: updatedOrder,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Stripe payment intent
// @route   POST /api/v1/orders/create-payment-intent
// @access  Private
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount || amount <= 0) {
      return next(new ErrorResponse('Invalid amount', 400));
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId: req.user.id.toString()
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order statistics
// @route   GET /api/v1/orders/stats
// @access  Private/Admin
exports.getOrderStats = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Today's orders
    const todaysOrders = await Order.countDocuments({
      createdAt: { $gte: startOfToday }
    });

    // This week's orders
    const weeklyOrders = await Order.countDocuments({
      createdAt: { $gte: startOfWeek }
    });

    // This month's orders
    const monthlyOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // This year's orders
    const yearlyOrders = await Order.countDocuments({
      createdAt: { $gte: startOfYear }
    });

    // Revenue statistics
    const revenueStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          dailyRevenue: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', startOfToday] },
                '$totalPrice',
                0
              ]
            }
          },
          weeklyRevenue: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', startOfWeek] },
                '$totalPrice',
                0
              ]
            }
          },
          monthlyRevenue: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', startOfMonth] },
                '$totalPrice',
                0
              ]
            }
          },
          yearlyRevenue: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', startOfYear] },
                '$totalPrice',
                0
              ]
            }
          },
          averageOrderValue: { $avg: '$totalPrice' }
        }
      }
    ]);

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Monthly revenue for chart
    const monthlyRevenueChart = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(today.getFullYear(), 0, 1) }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Top products by sales
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          productName: { $first: '$items.name' },
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $sort: { quantity: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          total: totalOrders,
          today: todaysOrders,
          week: weeklyOrders,
          month: monthlyOrders,
          year: yearlyOrders
        },
        revenue: revenueStats[0] || {
          totalRevenue: 0,
          dailyRevenue: 0,
          weeklyRevenue: 0,
          monthlyRevenue: 0,
          yearlyRevenue: 0,
          averageOrderValue: 0
        },
        ordersByStatus,
        monthlyRevenueChart,
        topProducts
      }
    });
  } catch (error) {
    next(error);
  }
};