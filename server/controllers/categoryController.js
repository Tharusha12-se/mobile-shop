const Category = require('../models/Category');
const Product = require('../models/Product');
const { ErrorResponse } = require('../middleware/error');
const cloudinary = require('../config/cloudinary');

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parentCategory', 'name slug')
      .sort('displayOrder');

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parentCategory', 'name slug')
      .populate('subcategories', 'name slug image');

    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by slug
// @route   GET /api/v1/categories/slug/:slug
// @access  Public
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true })
      .populate('parentCategory', 'name slug')
      .populate('subcategories', 'name slug image');

    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    // Add createdBy field
    req.body.createdBy = req.user.id;

    // Handle image upload
    if (req.body.image) {
      if (req.body.image.url) {
        // Image URL provided
        req.body.image = {
          public_id: req.body.image.public_id || `category-${Date.now()}`,
          url: req.body.image.url
        };
      } else {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.body.image, {
          folder: 'mobile-shop/categories'
        });
        
        req.body.image = {
          public_id: result.public_id,
          url: result.secure_url
        };
      }
    }

    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res, next) => {
  try {
    // Add updatedBy field
    req.body.updatedBy = req.user.id;

    let category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }

    // Handle image update
    if (req.body.image) {
      // Delete old image if exists
      if (category.image && category.image.public_id) {
        await cloudinary.uploader.destroy(category.image.public_id);
      }

      if (req.body.image.url) {
        // Image URL provided
        req.body.image = {
          public_id: req.body.image.public_id || `category-${Date.now()}`,
          url: req.body.image.url
        };
      } else {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.body.image, {
          folder: 'mobile-shop/categories'
        });
        
        req.body.image = {
          public_id: result.public_id,
          url: result.secure_url
        };
      }
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return next(new ErrorResponse(
        `Cannot delete category with ${productCount} products. Please reassign products first.`,
        400
      ));
    }

    // Check if category has subcategories
    const subcategoryCount = await Category.countDocuments({ parentCategory: category._id });
    if (subcategoryCount > 0) {
      return next(new ErrorResponse(
        `Cannot delete category with ${subcategoryCount} subcategories. Please delete subcategories first.`,
        400
      ));
    }

    // Delete image from Cloudinary
    if (category.image && category.image.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }

    // Soft delete
    category.isActive = false;
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category hierarchy
// @route   GET /api/v1/categories/hierarchy
// @access  Public
exports.getCategoryHierarchy = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate({
        path: 'subcategories',
        match: { isActive: true },
        select: 'name slug image'
      })
      .sort('displayOrder');

    // Build hierarchy
    const hierarchy = categories
      .filter(cat => !cat.parentCategory)
      .map(parent => {
        const children = categories.filter(cat => 
          cat.parentCategory && cat.parentCategory.toString() === parent._id.toString()
        );
        return {
          ...parent.toObject(),
          children
        };
      });

    res.status(200).json({
      success: true,
      count: hierarchy.length,
      data: hierarchy
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured categories
// @route   GET /api/v1/categories/featured
// @access  Public
exports.getFeaturedCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ 
      featured: true,
      isActive: true 
    })
    .populate('parentCategory', 'name slug')
    .sort('displayOrder')
    .limit(6);

    // Get product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ 
          category: category._id,
          isActive: true 
        });
        
        return {
          ...category.toObject(),
          productCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
};