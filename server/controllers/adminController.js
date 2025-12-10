const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const { ErrorResponse } = require('../middleware/error');
const mongoose = require('mongoose');

// @desc    Get dashboard statistics
// @route   GET /api/v1/admin/dashboard/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Total statistics
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Category.countDocuments({ isActive: true })
    ]);

    // Today's statistics
    const [
      todaysUsers,
      todaysOrders,
      todaysRevenue
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfToday },
            isPaid: true
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalPrice' }
          }
        }
      ])
    ]);

    // Monthly statistics
    const [
      monthlyOrders,
      monthlyRevenue,
      monthlyNewUsers
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth },
            isPaid: true
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalPrice' }
          }
        }
      ]),
      User.countDocuments({ createdAt: { $gte: startOfMonth } })
    ]);

    // Yearly statistics
    const [
      yearlyRevenue,
      yearlyOrders
    ] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfYear },
            isPaid: true
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalPrice' }
          }
        }
      ]),
      Order.countDocuments({ createdAt: { $gte: startOfYear } })
    ]);

    // Low stock products
    const lowStockProducts = await Product.countDocuments({
      stock: { $lt: 10 },
      isActive: true
    });

    // Out of stock products
    const outOfStockProducts = await Product.countDocuments({
      stock: 0,
      isActive: true
    });

    // Pending orders
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    // Recent orders
    const recentOrders = await Order.find()
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'name email')
      .select('orderNumber totalPrice status createdAt');

    // Top selling products
    const topSellingProducts = await Order.aggregate([
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
        $limit: 5
      }
    ]);

    // Sales chart data (last 7 days)
    const salesChartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const dailySales = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            isPaid: true
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalPrice' },
            count: { $sum: 1 }
          }
        }
      ]);

      salesChartData.push({
        date: startOfDay.toISOString().split('T')[0],
        revenue: dailySales[0]?.total || 0,
        orders: dailySales[0]?.count || 0
      });
    }

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalCategories,
          lowStockProducts,
          outOfStockProducts,
          pendingOrders
        },
        today: {
          users: todaysUsers,
          orders: todaysOrders,
          revenue: todaysRevenue[0]?.total || 0
        },
        thisMonth: {
          orders: monthlyOrders,
          revenue: monthlyRevenue[0]?.total || 0,
          newUsers: monthlyNewUsers
        },
        thisYear: {
          orders: yearlyOrders,
          revenue: yearlyRevenue[0]?.total || 0
        },
        recentOrders,
        topSellingProducts,
        salesChartData
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password -loginAttempts -lockUntil')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID (admin)
// @route   GET /api/v1/admin/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -loginAttempts -lockUntil')
      .populate('addresses');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Get user orders
    const orders = await Order.find({ user: user._id })
      .sort('-createdAt')
      .limit(10);

    // Get user reviews
    const reviews = await Review.find({ user: user._id })
      .populate('product', 'name')
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        user,
        recentOrders: orders,
        recentReviews: reviews
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (admin)
// @route   PUT /api/v1/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const { role, isActive, ...updateData } = req.body;

    // Prevent updating super_admin
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (user.role === 'super_admin' && req.user.role !== 'super_admin') {
      return next(new ErrorResponse('Cannot modify super admin', 403));
    }

    // Update user
    if (role && ['user', 'admin'].includes(role)) {
      updateData.role = role;
    }
    
    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Prevent deleting super_admin
    if (user.role === 'super_admin') {
      return next(new ErrorResponse('Cannot delete super admin', 403));
    }

    // Check if user has orders
    const orderCount = await Order.countDocuments({ user: user._id });
    if (orderCount > 0) {
      // Soft delete
      user.isActive = false;
      await user.save();
      
      return res.status(200).json({
        success: true,
        message: 'User deactivated (has existing orders)'
      });
    }

    // Hard delete
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products (admin)
// @route   GET /api/v1/admin/products
// @access  Private/Admin
exports.getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('category', 'name slug')
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/v1/admin/orders
// @access  Private/Admin
exports.getAdminOrders = async (req, res, next) => {
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

// @desc    Get sales report
// @route   GET /api/v1/admin/reports/sales
// @access  Private/Admin
exports.getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const matchStage = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    let groupStage;
    switch (groupBy) {
      case 'day':
        groupStage = {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            date: { $first: '$createdAt' },
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 },
            items: { $sum: { $size: '$items' } }
          }
        };
        break;
      case 'month':
        groupStage = {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            date: { $first: '$createdAt' },
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 },
            items: { $sum: { $size: '$items' } }
          }
        };
        break;
      case 'year':
        groupStage = {
          $group: {
            _id: { year: { $year: '$createdAt' } },
            date: { $first: '$createdAt' },
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 },
            items: { $sum: { $size: '$items' } }
          }
        };
        break;
    }

    const report = await Order.aggregate([
      { $match: matchStage },
      groupStage,
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Format dates
    const formattedReport = report.map(item => ({
      ...item,
      date: item.date.toISOString().split('T')[0]
    }));

    res.status(200).json({
      success: true,
      data: formattedReport
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product analytics
// @route   GET /api/v1/admin/analytics/products
// @access  Private/Admin
exports.getProductAnalytics = async (req, res, next) => {
  try {
    // Top viewed products
    const topViewed = await Product.find({ isActive: true })
      .sort('-views')
      .limit(10)
      .select('name views ratings stock');

    // Top selling products
    const topSelling = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
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

    // Low stock products
    const lowStock = await Product.find({
      stock: { $lt: 10 },
      isActive: true
    })
    .sort('stock')
    .limit(10)
    .select('name stock price');

    // Products with no sales
    const noSales = await Product.find({
      sold: 0,
      isActive: true,
      createdAt: { $lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Older than 30 days
    })
    .sort('-createdAt')
    .limit(10)
    .select('name createdAt price stock');

    res.status(200).json({
      success: true,
      data: {
        topViewed,
        topSelling,
        lowStock,
        noSales
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user analytics
// @route   GET /api/v1/admin/analytics/users
// @access  Private/Admin
exports.getUserAnalytics = async (req, res, next) => {
  try {
    // User growth
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $limit: 12
      }
    ]);

    // Top customers by spending
    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalSpent: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$user.name',
          email: '$user.email',
          totalSpent: 1,
          orderCount: 1
        }
      }
    ]);

    // User activity
    const userActivity = await Order.aggregate([
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          activeUsers: { $addToSet: '$user' }
        }
      },
      {
        $project: {
          date: '$_id.date',
          activeUsers: { $size: '$activeUsers' }
        }
      },
      {
        $sort: { date: -1 }
      },
      {
        $limit: 30
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        userGrowth,
        topCustomers,
        userActivity
      }
    });
  } catch (error) {
    next(error);
  }
};