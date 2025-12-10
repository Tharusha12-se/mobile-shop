const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  refreshToken,
  logout
} = require('../controllers/authController');
const { protect, loginLimiter } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/verifyemail/:token', verifyEmail);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/resendverification', protect, resendVerification);
router.get('/logout', protect, logout);

module.exports = router;