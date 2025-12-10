const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { ErrorResponse } = require('./error');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary storage for product images
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mobile-shop/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    resource_type: 'image'
  }
});

// Cloudinary storage for user avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mobile-shop/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'thumb', gravity: 'face' }],
    resource_type: 'image'
  }
});

// Cloudinary storage for category images
const categoryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mobile-shop/categories',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'fill' }],
    resource_type: 'image'
  }
});

// File filter for images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ErrorResponse('Please upload only images', 400), false);
  }
};

// File size limit (5MB)
const limits = {
  fileSize: 5 * 1024 * 1024 // 5MB
};

// Multer instances
exports.uploadProductImages = multer({
  storage: productStorage,
  fileFilter: imageFilter,
  limits
}).array('images', 10); // Max 10 images

exports.uploadSingleProductImage = multer({
  storage: productStorage,
  fileFilter: imageFilter,
  limits
}).single('image');

exports.uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFilter,
  limits
}).single('avatar');

exports.uploadCategoryImage = multer({
  storage: categoryStorage,
  fileFilter: imageFilter,
  limits
}).single('image');

// Delete image from Cloudinary
exports.deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new ErrorResponse('Error deleting image', 500);
  }
};

// Upload buffer to Cloudinary
exports.uploadBuffer = async (buffer, folder = 'mobile-shop/uploads') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    
    uploadStream.end(buffer);
  });
};