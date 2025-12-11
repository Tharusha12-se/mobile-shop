// server-simple.js - ULTRA SIMPLE WORKING VERSION
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working! 🎉' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Try to load and use routes
try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.log('❌ Auth routes error:', error.message);
  // Create simple auth endpoint
  app.post('/api/auth/register', (req, res) => {
    res.json({ message: 'Register endpoint (routes/auth.js not working)' });
  });
}

try {
  const productRoutes = require('./routes/products');
  app.use('/api/products', productRoutes);
  console.log('✅ Product routes loaded');
} catch (error) {
  console.log('❌ Product routes error:', error.message);
  // Create simple products endpoint
  app.get('/api/products', (req, res) => {
    res.json({ message: 'Products endpoint (routes/products.js not working)' });
  });
}

// Welcome route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Mobile Shop API',
    endpoints: ['/api/test', '/api/health', '/api/auth', '/api/products']
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Endpoints:`);
  console.log(`   http://localhost:${PORT}/api/test`);
  console.log(`   http://localhost:${PORT}/api/health`);
  console.log(`   http://localhost:${PORT}/api/auth/register (POST)`);
  console.log(`   http://localhost:${PORT}/api/products`);
});