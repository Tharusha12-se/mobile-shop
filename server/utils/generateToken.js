const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id, role = 'user') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  
  return `ORD${year}${month}${day}${random}`;
};

const generateSKU = (brand, name) => {
  const brandPrefix = brand.substring(0, 3).toUpperCase();
  const namePrefix = name.substring(0, 3).toUpperCase();
  const random = Math.floor(100 + Math.random() * 900);
  
  return `${brandPrefix}-${namePrefix}-${random}`;
};

const generateCouponCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  generateRandomString,
  generateOrderNumber,
  generateSKU,
  generateCouponCode
};