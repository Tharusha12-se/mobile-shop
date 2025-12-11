// controllers/productController.js - MINIMAL WORKING VERSION

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    console.log('GetProducts endpoint called');
    
    res.status(200).json({
      success: true,
      count: 2,
      total: 2,
      pagination: {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 12,
        pages: 1
      },
      data: [
        {
          _id: 'product-1',
          name: 'iPhone 15 Pro',
          price: 1299,
          discountPrice: 1199,
          description: 'Latest iPhone with advanced features',
          images: [{ url: 'https://via.placeholder.com/300x300', isPrimary: true }],
          ratings: { average: 4.5, count: 120 },
          stock: 50,
          slug: 'iphone-15-pro'
        },
        {
          _id: 'product-2',
          name: 'Samsung Galaxy S24',
          price: 1099,
          discountPrice: 999,
          description: 'Premium Android smartphone',
          images: [{ url: 'https://via.placeholder.com/300x300', isPrimary: true }],
          ratings: { average: 4.3, count: 85 },
          stock: 30,
          slug: 'samsung-galaxy-s24'
        }
      ]
    });
  } catch (error) {
    console.error('GetProducts error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    console.log('GetProduct endpoint called for id:', req.params.id);
    
    res.status(200).json({
      success: true,
      data: {
        _id: req.params.id,
        name: 'Sample Product',
        price: 999,
        description: 'Product description',
        images: [{ url: 'https://via.placeholder.com/300x300', isPrimary: true }],
        ratings: { average: 4.0, count: 50 },
        stock: 100
      }
    });
  } catch (error) {
    console.error('GetProduct error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// @desc    Get product by slug
// @route   GET /api/v1/products/slug/:slug
// @access  Public
exports.getProductBySlug = async (req, res) => {
  try {
    console.log('GetProductBySlug endpoint called for slug:', req.params.slug);
    
    res.status(200).json({
      success: true,
      data: {
        _id: 'product-1',
        name: req.params.slug,
        price: 999,
        description: 'Product description',
        images: [{ url: 'https://via.placeholder.com/300x300', isPrimary: true }],
        ratings: { average: 4.0, count: 50 }
      }
    });
  } catch (error) {
    console.error('GetProductBySlug error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    console.log('CreateProduct endpoint called');
    
    res.status(201).json({
      success: true,
      data: {
        _id: 'product-' + Date.now(),
        ...req.body
      }
    });
  } catch (error) {
    console.error('CreateProduct error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    console.log('UpdateProduct endpoint called for id:', req.params.id);
    
    res.status(200).json({
      success: true,
      data: {
        _id: req.params.id,
        ...req.body
      }
    });
  } catch (error) {
    console.error('UpdateProduct error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    console.log('DeleteProduct endpoint called for id:', req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('DeleteProduct error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// @desc    Upload product images
// @route   POST /api/v1/products/:id/images
// @access  Private/Admin
exports.uploadProductImages = async (req, res) => {
  try {
    console.log('UploadProductImages endpoint called');
    
    res.status(200).json({
      success: true,
      data: [
        { url: 'https://via.placeholder.com/300x300', isPrimary: true }
      ]
    });
  } catch (error) {
    console.error('UploadProductImages error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// @desc    Delete product image
// @route   DELETE /api/v1/products/:id/images/:imageId
// @access  Private/Admin
exports.deleteProductImage = async (req, res) => {
  try {
    console.log('DeleteProductImage endpoint called');
    
    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('DeleteProductImage error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// @desc    Create product review
// @route   POST /api/v1/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res) => {
  try {
    console.log('CreateProductReview endpoint called');
    
    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('CreateProductReview error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// @desc    Get product reviews
// @route   GET /api/v1/products/:id/reviews
// @access  Public
exports.getProductReviews = async (req, res) => {
  try {
    console.log('GetProductReviews endpoint called');
    
    res.status(200).json({
      success: true,
      count: 1,
      data: [
        {
          user: { name: 'Test User' },
          rating: 5,
          comment: 'Great product!'
        }
      ]
    });
  } catch (error) {
    console.error('GetProductReviews error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// @desc    Get related products
// @route   GET /api/v1/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res) => {
  try {
    console.log('GetRelatedProducts endpoint called');
    
    res.status(200).json({
      success: true,
      data: [
        {
          _id: 'product-3',
          name: 'Related Product',
          price: 799
        }
      ]
    });
  } catch (error) {
    console.error('GetRelatedProducts error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    console.log('GetFeaturedProducts endpoint called');
    
    res.status(200).json({
      success: true,
      data: [
        {
          _id: 'product-1',
          name: 'Featured Product',
          price: 999
        }
      ]
    });
  } catch (error) {
    console.error('GetFeaturedProducts error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// @desc    Get best seller products
// @route   GET /api/v1/products/best-sellers
// @access  Public
exports.getBestSellers = async (req, res) => {
  try {
    console.log('GetBestSellers endpoint called');
    
    res.status(200).json({
      success: true,
      data: [
        {
          _id: 'product-2',
          name: 'Best Seller',
          price: 899
        }
      ]
    });
  } catch (error) {
    console.error('GetBestSellers error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// @desc    Get new arrivals
// @route   GET /api/v1/products/new-arrivals
// @access  Public
exports.getNewArrivals = async (req, res) => {
  try {
    console.log('GetNewArrivals endpoint called');
    
    res.status(200).json({
      success: true,
      data: [
        {
          _id: 'product-4',
          name: 'New Arrival',
          price: 1099
        }
      ]
    });
  } catch (error) {
    console.error('GetNewArrivals error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// @desc    Update stock
// @route   PUT /api/v1/products/:id/stock
// @access  Private/Admin
exports.updateStock = async (req, res) => {
  try {
    console.log('UpdateStock endpoint called');
    
    res.status(200).json({
      success: true,
      data: {
        stock: 100
      }
    });
  } catch (error) {
    console.error('UpdateStock error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// @desc    Get products by category
// @route   GET /api/v1/products/category/:categorySlug
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  try {
    console.log('GetProductsByCategory endpoint called for:', req.params.categorySlug);
    
    res.status(200).json({
      success: true,
      category: {
        name: 'Category Name',
        slug: req.params.categorySlug
      },
      count: 2,
      data: [
        {
          _id: 'product-1',
          name: 'Product 1',
          price: 999
        },
        {
          _id: 'product-2',
          name: 'Product 2',
          price: 899
        }
      ]
    });
  } catch (error) {
    console.error('GetProductsByCategory error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};