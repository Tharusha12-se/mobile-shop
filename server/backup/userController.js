const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');
const { ErrorResponse } = require('../middleware/error');
const cloudinary = require('../config/cloudinary');

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -loginAttempts -lockUntil')
      .populate('addresses');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, avatar } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;

    // Handle avatar update
    if (avatar) {
      // Delete old avatar if exists
      const user = await User.findById(req.user.id);
      if (user.avatar && user.avatar.public_id !== 'avatars/default') {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      if (avatar.url) {
        // Avatar URL provided
        updateData.avatar = {
          public_id: avatar.public_id || `avatar-${Date.now()}`,
          url: avatar.url
        };
      } else {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(avatar, {
          folder: 'mobile-shop/avatars'
        });
        
        updateData.avatar = {
          public_id: result.public_id,
          url: result.secure_url
        };
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user addresses
// @route   GET /api/v1/users/addresses
// @access  Private
exports.getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('addresses');
    
    res.status(200).json({
      success: true,
      data: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new address
// @route   POST /api/v1/users/addresses
// @access  Private
exports.addAddress = async (req, res, next) => {
  try {
    const { type, street, city, state, country, zipCode, phone, isDefault } = req.body;

    const address = {
      type,
      street,
      city,
      state,
      country: country || 'United States',
      zipCode,
      phone,
      isDefault: isDefault || false
    };

    const user = await User.findById(req.user.id);

    // If this is set as default, unset other defaults
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(address);
    await user.save();

    res.status(201).json({
      success: true,
      data: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update address
// @route   PUT /api/v1/users/addresses/:addressId
// @access  Private
exports.updateAddress = async (req, res, next) => {
  try {
    const { type, street, city, state, country, zipCode, phone, isDefault } = req.body;

    const user = await User.findById(req.user.id);
    const addressIndex = user.addresses.findIndex(
      addr => addr._id.toString() === req.params.addressId
    );

    if (addressIndex === -1) {
      return next(new ErrorResponse('Address not found', 404));
    }

    // Update address
    if (type) user.addresses[addressIndex].type = type;
    if (street) user.addresses[addressIndex].street = street;
    if (city) user.addresses[addressIndex].city = city;
    if (state) user.addresses[addressIndex].state = state;
    if (country) user.addresses[addressIndex].country = country;
    if (zipCode) user.addresses[addressIndex].zipCode = zipCode;
    if (phone) user.addresses[addressIndex].phone = phone;
    
    // Handle default address
    if (isDefault) {
      user.addresses.forEach((addr, index) => {
        addr.isDefault = index === addressIndex;
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete address
// @route   DELETE /api/v1/users/addresses/:addressId
// @access  Private
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    const initialLength = user.addresses.length;
    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== req.params.addressId
    );

    if (user.addresses.length === initialLength) {
      return next(new ErrorResponse('Address not found', 404));
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user.addresses,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/v1/users/orders
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort('-createdAt')
      .populate('items.product', 'name images slug');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user reviews
// @route   GET /api/v1/users/reviews
// @access  Private
exports.getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('product', 'name images slug')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user wishlist
// @route   GET /api/v1/users/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    
    res.status(200).json({
      success: true,
      data: user.wishlist || []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add to wishlist
// @route   POST /api/v1/users/wishlist
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user.id);

    // Check if already in wishlist
    if (user.wishlist.includes(productId)) {
      return next(new ErrorResponse('Product already in wishlist', 400));
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.wishlist,
      message: 'Product added to wishlist'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/v1/users/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const initialLength = user.wishlist.length;
    user.wishlist = user.wishlist.filter(
      id => id.toString() !== req.params.productId
    );

    if (user.wishlist.length === initialLength) {
      return next(new ErrorResponse('Product not found in wishlist', 404));
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user.wishlist,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/v1/users/stats
// @access  Private
exports.getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // Get order statistics
    const orderStats = await Order.aggregate([
      {
        $match: { user: user._id }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
          averageOrderValue: { $avg: '$totalPrice' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get review count
    const reviewCount = await Review.countDocuments({ user: user._id });

    // Get wishlist count
    const wishlistCount = user.wishlist.length;

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          joinDate: user.createdAt,
          emailVerified: user.emailVerified
        },
        orders: orderStats[0] || {
          totalOrders: 0,
          totalSpent: 0,
          averageOrderValue: 0,
          pendingOrders: 0,
          deliveredOrders: 0
        },
        reviews: reviewCount,
        wishlist: wishlistCount
      }
    });
  } catch (error) {
    next(error);
  }
};