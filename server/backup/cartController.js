const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { ErrorResponse } = require('../middleware/error');

// @desc    Get user's cart
// @route   GET /api/v1/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name price discountPrice images slug stock brand specifications'
      });

    if (!cart) {
      // Create empty cart if not exists
      cart = await Cart.create({ 
        user: req.user.id, 
        items: [] 
      });
    }

    // Filter out products that are no longer active
    const validItems = cart.items.filter(item => 
      item.product && item.product.stock > 0
    );

    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/v1/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, color, storage } = req.body;

    // Get product
    const product = await Product.findById(productId);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    if (!product.isActive) {
      return next(new ErrorResponse('Product is not available', 400));
    }

    // Check stock
    if (product.stock < quantity) {
      return next(new ErrorResponse(
        `Only ${product.stock} items available in stock`,
        400
      ));
    }

    let cart = await Cart.findOne({ user: req.user.id });

    // If cart doesn't exist, create one
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }

    // Check if item already in cart
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId &&
        item.color === color &&
        item.storage === storage
    );

    if (itemIndex > -1) {
      // Update quantity if item exists
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      
      // Check stock for updated quantity
      if (product.stock < newQuantity) {
        return next(new ErrorResponse(
          `Only ${product.stock} items available in stock`,
          400
        ));
      }
      
      cart.items[itemIndex].quantity = newQuantity;
      cart.items[itemIndex].addedAt = new Date();
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.discountPrice || product.price,
        discountPrice: product.discountPrice,
        color,
        storage,
        specifications: product.specifications
      });
    }

    await cart.save();
    
    // Populate product details
    await cart.populate({
      path: 'items.product',
      select: 'name price discountPrice images slug stock brand'
    });

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return next(new ErrorResponse('Quantity must be at least 1', 400));
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    // Find item index
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return next(new ErrorResponse('Item not found in cart', 404));
    }

    // Get product to check stock
    const product = await Product.findById(cart.items[itemIndex].product);

    if (!product || !product.isActive) {
      // Remove item if product no longer exists
      cart.items.splice(itemIndex, 1);
      await cart.save();
      return next(new ErrorResponse('Product is no longer available', 400));
    }

    if (quantity > product.stock) {
      return next(new ErrorResponse(
        `Only ${product.stock} items available in stock`,
        400
      ));
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].addedAt = new Date();

    await cart.save();
    
    // Populate product details
    await cart.populate({
      path: 'items.product',
      select: 'name price discountPrice images slug stock brand'
    });

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    // Filter out the item
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );

    if (cart.items.length === initialLength) {
      return next(new ErrorResponse('Item not found in cart', 404));
    }

    await cart.save();
    
    // Populate product details
    await cart.populate({
      path: 'items.product',
      select: 'name price discountPrice images slug stock brand'
    });

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Item removed from cart'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/v1/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    cart.items = [];
    cart.coupon = undefined;
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply coupon
// @route   POST /api/v1/cart/coupon
// @access  Private
exports.applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return next(new ErrorResponse('Please provide coupon code', 400));
    }

    // TODO: Validate coupon from database
    // For now, using static coupons
    const validCoupons = {
      'WELCOME10': { discount: 10, type: 'percentage', minPurchase: 50 },
      'SUMMER20': { discount: 20, type: 'percentage', minPurchase: 100 },
      'BLACKFRIDAY30': { discount: 30, type: 'percentage', minPurchase: 200 },
      'FREESHIP': { discount: 10, type: 'fixed', minPurchase: 50 } // $10 off shipping
    };

    const coupon = validCoupons[code];

    if (!coupon) {
      return next(new ErrorResponse('Invalid coupon code', 400));
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    // Check minimum purchase
    if (cart.subtotal < coupon.minPurchase) {
      return next(new ErrorResponse(
        `Minimum purchase of $${coupon.minPurchase} required for this coupon`,
        400
      ));
    }

    cart.coupon = {
      code,
      discount: coupon.discount,
      type: coupon.type,
      minPurchase: coupon.minPurchase,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };

    await cart.save();
    
    // Populate product details
    await cart.populate({
      path: 'items.product',
      select: 'name price discountPrice images slug stock brand'
    });

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Coupon applied successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove coupon
// @route   DELETE /api/v1/cart/coupon
// @access  Private
exports.removeCoupon = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return next(new ErrorResponse('Cart not found', 404));
    }

    if (!cart.coupon) {
      return next(new ErrorResponse('No coupon applied', 400));
    }

    cart.coupon = undefined;
    await cart.save();
    
    // Populate product details
    await cart.populate({
      path: 'items.product',
      select: 'name price discountPrice images slug stock brand'
    });

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Coupon removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Merge guest cart with user cart
// @route   POST /api/v1/cart/merge
// @access  Private
exports.mergeCart = async (req, res, next) => {
  try {
    const { guestItems } = req.body;

    if (!guestItems || !Array.isArray(guestItems)) {
      return next(new ErrorResponse('Invalid guest cart data', 400));
    }

    let cart = await Cart.findOne({ user: req.user.id });

    // If cart doesn't exist, create one
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }

    // Merge guest items
    for (const guestItem of guestItems) {
      const product = await Product.findById(guestItem.productId);
      
      if (!product || !product.isActive || product.stock < 1) {
        continue; // Skip unavailable products
      }

      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === guestItem.productId &&
          item.color === guestItem.color &&
          item.storage === guestItem.storage
      );

      if (existingItemIndex > -1) {
        // Update quantity
        const newQuantity = cart.items[existingItemIndex].quantity + guestItem.quantity;
        if (newQuantity <= product.stock) {
          cart.items[existingItemIndex].quantity = newQuantity;
        } else {
          cart.items[existingItemIndex].quantity = product.stock;
        }
      } else {
        // Add new item
        cart.items.push({
          product: guestItem.productId,
          quantity: Math.min(guestItem.quantity, product.stock),
          price: product.discountPrice || product.price,
          discountPrice: product.discountPrice,
          color: guestItem.color,
          storage: guestItem.storage,
          specifications: product.specifications
        });
      }
    }

    await cart.save();
    
    // Populate product details
    await cart.populate({
      path: 'items.product',
      select: 'name price discountPrice images slug stock brand'
    });

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Cart merged successfully'
    });
  } catch (error) {
    next(error);
  }
};