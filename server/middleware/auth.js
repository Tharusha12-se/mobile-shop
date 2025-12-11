// middleware/auth.js - SIMPLE VERSION

// Protect middleware
exports.protect = (req, res, next) => {
  console.log('Protect middleware called');
  req.user = { id: 1, name: 'Test User', role: 'user' };
  next();
};

// Authorize middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Authorize middleware called with roles:', roles);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized' 
      });
    }
    next();
  };
};

// Login limiter
exports.loginLimiter = (req, res, next) => {
  console.log('Login limiter called');
  next();
};