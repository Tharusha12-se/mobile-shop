// controllers/productController.js - ULTRA SIMPLE VERSION

// Get all products
exports.getProducts = (req, res) => {
  console.log('GetProducts called');
  res.json({ 
    success: true, 
    message: 'Products endpoint working',
    products: [
      { id: 1, name: 'iPhone 15', price: 999 },
      { id: 2, name: 'Samsung S24', price: 899 }
    ]
  });
};

// Get single product
exports.getProduct = (req, res) => {
  console.log('GetProduct called for:', req.params.id);
  res.json({ 
    success: true, 
    message: 'Get product endpoint working',
    product: { id: req.params.id, name: 'Sample Product', price: 999 }
  });
};

// Get product by slug
exports.getProductBySlug = (req, res) => {
  res.json({ success: true, message: 'Get by slug working' });
};

// Create product
exports.createProduct = (req, res) => {
  res.json({ success: true, message: 'Create product working' });
};

// Update product
exports.updateProduct = (req, res) => {
  res.json({ success: true, message: 'Update product working' });
};

// Delete product
exports.deleteProduct = (req, res) => {
  res.json({ success: true, message: 'Delete product working' });
};

// Upload images
exports.uploadProductImages = (req, res) => {
  res.json({ success: true, message: 'Upload images working' });
};

// Delete image
exports.deleteProductImage = (req, res) => {
  res.json({ success: true, message: 'Delete image working' });
};

// Create review
exports.createProductReview = (req, res) => {
  res.json({ success: true, message: 'Create review working' });
};

// Get reviews
exports.getProductReviews = (req, res) => {
  res.json({ success: true, message: 'Get reviews working' });
};

// Get related
exports.getRelatedProducts = (req, res) => {
  res.json({ success: true, message: 'Get related working' });
};

// Get featured
exports.getFeaturedProducts = (req, res) => {
  res.json({ success: true, message: 'Get featured working' });
};

// Get best sellers
exports.getBestSellers = (req, res) => {
  res.json({ success: true, message: 'Get best sellers working' });
};

// Get new arrivals
exports.getNewArrivals = (req, res) => {
  res.json({ success: true, message: 'Get new arrivals working' });
};

// Update stock
exports.updateStock = (req, res) => {
  res.json({ success: true, message: 'Update stock working' });
};

// Get by category
exports.getProductsByCategory = (req, res) => {
  res.json({ success: true, message: 'Get by category working' });
};