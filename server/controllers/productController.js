const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const { ErrorResponse } = require('../middleware/error');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('../config/cloudinary');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const features = new APIFeatures(
      Product.find({ isActive: true })
        .populate('category', 'name slug')
        .populate('reviews.user', 'name avatar'),
      req.query
    )
      .filterProducts()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query;
    const total = await Product.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        page: features.page || 1,
        limit: features.limit || 12,
        pages: Math.ceil(total / (features.limit || 12))
      },
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug description')
      .populate('reviews.user', 'name avatar')
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name');

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Increment view count
    product.views += 1;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by slug
// @route   GET /api/v1/products/slug/:slug
// @access  Public
exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug description')
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Increment view count
    product.views += 1;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    // Add createdBy field
    req.body.createdBy = req.user.id;

    // If images are provided in base64 or URLs
    if (req.body.images && Array.isArray(req.body.images)) {
      const imageUploadPromises = req.body.images.map(async (image, index) => {
        if (image.url) {
          return {
            public_id: image.public_id || `product-${Date.now()}-${index}`,
            url: image.url,
            isPrimary: index === 0
          };
        }
        
        // Upload to Cloudinary if base64
        const result = await cloudinary.uploader.upload(image, {
          folder: 'mobile-shop/products'
        });
        
        return {
          public_id: result.public_id,
          url: result.secure_url,
          isPrimary: index === 0
        };
      });

      req.body.images = await Promise.all(imageUploadPromises);
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    // Add updatedBy field
    req.body.updatedBy = req.user.id;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Handle image updates
    if (req.body.images && Array.isArray(req.body.images)) {
      // Delete old images from Cloudinary
      for (const image of product.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }

      // Upload new images
      const imageUploadPromises = req.body.images.map(async (image, index) => {
        if (image.url) {
          return {
            public_id: image.public_id || `product-${Date.now()}-${index}`,
            url: image.url,
            isPrimary: index === 0
          };
        }
        
        const result = await cloudinary.uploader.upload(image, {
          folder: 'mobile-shop/products'
        });
        
        return {
          public_id: result.public_id,
          url: result.secure_url,
          isPrimary: index === 0
        };
      });

      req.body.images = await Promise.all(imageUploadPromises);
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    // Soft delete
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product images
// @route   POST /api/v1/products/:id/images
// @access  Private/Admin
exports.uploadProductImages = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    if (!req.files || req.files.length === 0) {
      return next(new ErrorResponse('Please upload images', 400));
    }

    const imageUploadPromises = req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'mobile-shop/products'
      });
      
      return {
        public_id: result.public_id,
        url: result.secure_url,
        isPrimary: product.images.length === 0
      };
    });

    const images = await Promise.all(imageUploadPromises);

    // Add new images to product
    product.images = [...product.images, ...images];
    await product.save();

    res.status(200).json({
      success: true,
      data: product.images
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product image
// @route   DELETE /api/v1/products/:id/images/:imageId
// @access  Private/Admin
exports.deleteProductImage = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Find image
    const image = product.images.find(
      img => img.public_id === req.params.imageId
    );

    if (!image) {
      return next(new ErrorResponse('Image not found', 404));
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(req.params.imageId);

    // Remove image from array
    product.images = product.images.filter(
      img => img.public_id !== req.params.imageId
    );

    // If primary image was deleted, set new primary
    if (image.isPrimary && product.images.length > 0) {
      product.images[0].isPrimary = true;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product review
// @route   POST /api/v1/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, title } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      return next(new ErrorResponse('Product already reviewed', 400));
    }

    // Check if user purchased the product (for verified purchase badge)
    const Order = require('../models/Order');
    const hasPurchased = await Order.findOne({
      user: req.user.id,
      'items.product': product._id,
      status: 'delivered'
    });

    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      title: title || '',
      comment,
      verifiedPurchase: !!hasPurchased
    };

    product.reviews.push(review);
    await product.updateAverageRating();

    // Also save to Review collection
    await Review.create({
      product: product._id,
      user: req.user.id,
      rating: Number(rating),
      title: title || '',
      comment,
      verifiedPurchase: !!hasPurchased
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product reviews
// @route   GET /api/v1/products/:id/reviews
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('reviews')
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      count: product.reviews.length,
      data: product.reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/v1/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    })
    .limit(4)
    .select('name price discountPrice images slug ratings');

    res.status(200).json({
      success: true,
      data: relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const featuredProducts = await Product.find({
      featured: true,
      isActive: true
    })
    .limit(8)
    .select('name price discountPrice images slug ratings brand')
    .populate('category', 'name slug');

    res.status(200).json({
      success: true,
      data: featuredProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get best seller products
// @route   GET /api/v1/products/best-sellers
// @access  Public
exports.getBestSellers = async (req, res, next) => {
  try {
    const bestSellers = await Product.find({
      bestSeller: true,
      isActive: true
    })
    .sort('-sold')
    .limit(8)
    .select('name price discountPrice images slug ratings sold brand')
    .populate('category', 'name slug');

    res.status(200).json({
      success: true,
      data: bestSellers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get new arrivals
// @route   GET /api/v1/products/new-arrivals
// @access  Public
exports.getNewArrivals = async (req, res, next) => {
  try {
    const newArrivals = await Product.find({
      newArrival: true,
      isActive: true
    })
    .sort('-createdAt')
    .limit(8)
    .select('name price discountPrice images slug ratings createdAt brand')
    .populate('category', 'name slug');

    res.status(200).json({
      success: true,
      data: newArrivals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update stock
// @route   PUT /api/v1/products/:id/stock
// @access  Private/Admin
exports.updateStock = async (req, res, next) => {
  try {
    const { quantity, action } = req.body; // action: 'add' or 'subtract'
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    if (action === 'add') {
      product.stock += quantity;
    } else if (action === 'subtract') {
      if (product.stock < quantity) {
        return next(new ErrorResponse('Insufficient stock', 400));
      }
      product.stock -= quantity;
    } else {
      product.stock = quantity;
    }

    await product.save();

    res.status(200).json({
      success: true,
      data: {
        stock: product.stock
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category
// @route   GET /api/v1/products/category/:categorySlug
// @access  Public
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.categorySlug });

    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }

    const features = new APIFeatures(
      Product.find({ 
        category: category._id,
        isActive: true 
      })
      .populate('category', 'name slug'),
      req.query
    )
      .filterProducts()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query;
    const total = await Product.countDocuments({ 
      category: category._id,
      isActive: true 
    });

    res.status(200).json({
      success: true,
      category: {
        id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description
      },
      count: products.length,
      total,
      pagination: {
        page: features.page || 1,
        limit: features.limit || 12,
        pages: Math.ceil(total / (features.limit || 12))
      },
      data: products
    });
  } catch (error) {
    next(error);
  }
};