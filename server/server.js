const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('path');

// Add this at the very beginning, after imports
process.on('uncaughtException', (error) => {
  console.error('\n🔴 CRITICAL ERROR:');
  console.error('Message:', error.message);
  console.error('Stack:', error.stack);
  console.error('File causing error:', error.stack.split('\n')[1]);
});

// ==================== CONFIGURATION ====================
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`🚀 Starting Mobile Shop API in ${NODE_ENV} mode...`);

// ==================== EARLY ERROR HANDLERS ====================
// Catch uncaught exceptions at the process level
process.on('uncaughtException', (error) => {
  console.error('\n🔴 UNCAUGHT EXCEPTION! 🔴');
  console.error('Error Name:', error.name);
  console.error('Error Message:', error.message);
  console.error('Error Stack:', error.stack ? error.stack.split('\n').slice(0, 5).join('\n') : 'No stack');
  console.error('Timestamp:', new Date().toISOString());
  
  if (NODE_ENV === 'production') {
    setTimeout(() => {
      console.log('💀 Force exiting process...');
      process.exit(1);
    }, 1000);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n🔴 UNHANDLED REJECTION! 🔴');
  console.error('Reason:', reason);
  console.error('Promise:', promise);
  
  if (NODE_ENV === 'production') {
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  }
});

// ==================== SAFE MODULE LOADER ====================
const safeRequire = (path, moduleName) => {
  try {
    const module = require(path);
    console.log(`✅ ${moduleName} loaded`);
    return { success: true, module };
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log(`⚠️  ${moduleName} not found at ${path}`);
    } else {
      console.error(`❌ Error loading ${moduleName}:`, error.message);
    }
    return { success: false, error };
  }
};

// ==================== TEST CONTROLLERS ====================
console.log('\n🔍 Testing controllers...');

// Test each controller file
// Test each controller file
const testControllers = async () => {
  const controllers = [
    { path: './controllers/authController', name: 'authController' },
    { path: './controllers/productController', name: 'productController' },
    { path: './middleware/auth', name: 'authMiddleware' },
    { path: './middleware/upload', name: 'uploadMiddleware' }
  ];
  // ... rest of the code

  for (const controller of controllers) {
    try {
      const module = require(controller.path);
      console.log(`✅ ${controller.name} loaded`);
      
      // Check for undefined exports
      for (const key in module) {
        if (module[key] === undefined) {
          console.log(`   ⚠️  ${key} is undefined`);
        }
      }
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        console.log(`⚠️  ${controller.name} not found`);
      } else {
        console.log(`❌ ${controller.name} error: ${error.message}`);
      }
    }
  }
};

testControllers();

// ==================== LOAD ROUTES SAFELY ====================
console.log('\n📦 Loading modules...');

// Define all route paths
const routeDefinitions = [
  { path: './routes/auth', name: 'Auth Routes' },
  { path: './routes/products', name: 'Product Routes' },
  { path: './routes/categories', name: 'Category Routes' },
  { path: './routes/carts', name: 'Cart Routes' },
  { path: './routes/orders', name: 'Order Routes' },
  { path: './routes/users', name: 'User Routes' },
  { path: './routes/admin', name: 'Admin Routes' },
  { path: './middleware/error', name: 'Error Middleware' },
  { path: './config/database', name: 'Database Config' }
];

// Load all modules
const loadedModules = {};
routeDefinitions.forEach(({ path: modulePath, name }) => {
  const result = safeRequire(modulePath, name);
  if (result.success) {
    // Extract just the filename as key
    const key = modulePath.split('/').pop().replace('.js', '');
    loadedModules[key] = result.module;
  }
});

// Extract modules with safe defaults
const {
  auth,
  products,
  categories,
  carts,
  orders,
  users,
  admin,
  error: errorModule,
  database: connectDBModule
} = loadedModules;

// ==================== SETUP DEFAULT HANDLERS ====================
// Default error handler
const errorHandler = errorModule?.errorHandler || ((err, req, res, next) => {
  console.error('\n💥 ERROR:', {
    message: err.message,
    stack: err.stack ? err.stack.split('\n')[0] : 'No stack',
    path: req.path,
    method: req.method
  });
  
  const statusCode = err.statusCode || 500;
  const message = NODE_ENV === 'production' && statusCode === 500 
    ? 'Internal server error' 
    : err.message;
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(NODE_ENV === 'development' && { stack: err.stack, fullError: err.message })
  });
});

// Default database connector
const connectDB = connectDBModule || (async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('📊 Using in-memory database (no MONGODB_URI set)');
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    if (NODE_ENV === 'production') {
      throw error;
    }
  }
});

// ==================== MIDDLEWARE SETUP ====================
console.log('\n⚙️  Setting up middleware...');

// Security
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Compression
app.use(compression());

// Logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('tiny'));
}

// Rate limiting - more lenient in development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: NODE_ENV === 'production' ? 100 : 10000,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// File upload
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  safeFileNames: true,
  preserveExtension: true
}));

// Data sanitization
app.use(mongoSanitize());
app.use(hpp());

// XSS Protection (with fallback)
try {
  const { xss } = require('express-xss-sanitizer');
  app.use(xss());
  console.log('✅ XSS protection enabled');
} catch {
  console.log('⚠️  XSS protection skipped (express-xss-sanitizer not installed)');
  app.use((req, res, next) => {
    // Basic sanitization
    const sanitizeString = (str) => {
      if (typeof str !== 'string') return str;
      return str.replace(/[<>]/g, '');
    };
    
    const sanitizeObject = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = sanitizeString(obj[key]);
        } else if (typeof obj[key] === 'object') {
          sanitizeObject(obj[key]);
        }
      }
      return obj;
    };
    
    if (req.body) sanitizeObject(req.body);
    if (req.query) sanitizeObject(req.query);
    if (req.params) sanitizeObject(req.params);
    
    next();
  });
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Request logger
app.use((req, res, next) => {
  req.startTime = Date.now();
  req.requestId = Math.random().toString(36).substr(2, 9);
  
  console.log(`[${req.requestId}] ${req.method} ${req.originalUrl}`);
  
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    console.log(`[${req.requestId}] Completed in ${duration}ms with status ${res.statusCode}`);
  });
  
  next();
});

// ==================== ROUTE REGISTRATION ====================
console.log('\n🔗 Registering routes...');

// Helper to safely wrap route handlers
const safeRouteHandler = (handler, routeName) => {
  return async (req, res, next) => {
    try {
      console.log(`🔄 Executing: ${routeName}`);
      await handler(req, res, next);
    } catch (error) {
      console.error(`💥 Error in ${routeName}:`, error.message);
      error.route = routeName;
      next(error);
    }
  };
};

// Register routes with safety wrappers
const registerSafeRoute = (router, basePath, routeName) => {
  if (!router || typeof router !== 'function') {
    console.log(`⏭️  Skipping ${routeName} - invalid router`);
    return;
  }
  
  try {
    // Create a wrapper router
    const safeRouter = express.Router();
    
    // Apply all routes from the original router
    router.stack?.forEach(layer => {
      if (layer.route) {
        const routePath = layer.route.path;
        const methods = layer.route.methods;
        
        Object.keys(methods).forEach(method => {
          const originalHandler = layer.route.stack[0].handle;
          const fullRouteName = `${routeName} ${method.toUpperCase()} ${routePath}`;
          
          // Wrap the handler
          safeRouter[method](routePath, safeRouteHandler(originalHandler, fullRouteName));
        });
      }
    });
    
    app.use(basePath, safeRouter);
    console.log(`✅ ${routeName} registered at ${basePath}`);
    
  } catch (error) {
    console.error(`❌ Failed to register ${routeName}:`, error.message);
  }
};

// Core test routes (always available)
app.get('/api/v1/test', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
    environment: NODE_ENV
  });
});

app.get('/api/v1/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const dbStatusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
      },
      database: {
        status: dbStatusMap[dbStatus] || 'unknown',
        connected: dbStatus === 1
      },
      environment: NODE_ENV,
      nodeVersion: process.version
    };
    
    res.json(healthData);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Register all available routes
if (products) registerSafeRoute(products, '/api/v1/products', 'Products API');
if (auth) registerSafeRoute(auth, '/api/v1/auth', 'Auth API');
if (categories) registerSafeRoute(categories, '/api/v1/categories', 'Categories API');
if (carts) registerSafeRoute(carts, '/api/v1/cart', 'Cart API');
if (orders) registerSafeRoute(orders, '/api/v1/orders', 'Orders API');
if (users) registerSafeRoute(users, '/api/v1/users', 'Users API');
if (admin) registerSafeRoute(admin, '/api/v1/admin', 'Admin API');

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: '🛍️ Mobile Shop API',
    version: '1.0.0',
    status: 'operational',
    documentation: 'See /api/v1 endpoints',
    endpoints: [
      '/api/v1/test',
      '/api/v1/health',
      '/api/v1/products',
      '/api/v1/auth',
      '/api/v1/categories',
      '/api/v1/cart',
      '/api/v1/orders',
      '/api/v1/users',
      '/api/v1/admin'
    ].filter(endpoint => {
      const route = endpoint.split('/')[3];
      return route && app._router.stack.some(layer => 
        layer.regexp && layer.regexp.test(endpoint)
      );
    })
  });
});

// API documentation placeholder
app.get('/api/docs', (req, res) => {
  res.json({
    message: 'API Documentation',
    note: 'Add Swagger/OpenAPI documentation here',
    endpoints: {
      products: {
        GET: '/api/v1/products',
        GET_single: '/api/v1/products/:id',
        POST: '/api/v1/products (admin only)'
      },
      auth: {
        POST_login: '/api/v1/auth/login',
        POST_register: '/api/v1/auth/register',
        GET_me: '/api/v1/auth/me (protected)'
      }
    }
  });
});

// ==================== ERROR HANDLING ====================
// 404 handler
app.use('*', (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  error.isOperational = true;
  next(error);
});

// Global error handler
app.use(errorHandler);

// ==================== DATABASE CONNECTION ====================
const initializeDatabase = async () => {
  try {
    await connectDB();
    console.log('📊 Database initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    
    // In production, retry connection
    if (NODE_ENV === 'production') {
      console.log('🔄 Retrying database connection in 10 seconds...');
      setTimeout(initializeDatabase, 10000);
    }
  }
};

// ==================== SERVER STARTUP ====================
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log('\n🎉 ===========================================');
      console.log(`   Mobile Shop API Server Started!`);
      console.log(`   Port: ${PORT}`);
      console.log(`   Mode: ${NODE_ENV}`);
      console.log(`   URL: http://localhost:${PORT}`);
      console.log(`   Test: http://localhost:${PORT}/api/v1/test`);
      console.log(`   Health: http://localhost:${PORT}/api/v1/health`);
      console.log('===========================================\n');
      
      // List registered routes
      console.log('📋 Registered Routes:');
      app._router.stack.forEach(middleware => {
        if (middleware.route) {
          const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
          console.log(`   ${methods.padEnd(7)} ${middleware.route.path}`);
        } else if (middleware.name === 'router') {
          middleware.handle.stack.forEach(handler => {
            if (handler.route) {
              const methods = Object.keys(handler.route.methods).join(', ').toUpperCase();
              console.log(`   ${methods.padEnd(7)} ${handler.route.path}`);
            }
          });
        }
      });
      console.log('');
    });
    
    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received, shutting down gracefully...`);
      
      server.close(() => {
        console.log('✅ HTTP server closed');
        
        if (mongoose.connection.readyState === 1) {
          mongoose.connection.close(false, () => {
            console.log('✅ MongoDB connection closed');
            console.log('👋 Goodbye!');
            process.exit(0);
          });
        } else {
          console.log('👋 Goodbye!');
          process.exit(0);
        }
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⚠️  Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };
    
    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// ==================== START APPLICATION ====================
// Add a small delay to ensure all modules are loaded
setTimeout(startServer, 100);

// Export for testing
module.exports = app;