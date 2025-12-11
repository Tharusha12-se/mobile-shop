// middleware/upload.js - SIMPLE VERSION

// Upload middleware
exports.uploadProductImages = (req, res, next) => {
  console.log('Upload middleware called');
  next();
};