const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');

dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Order.deleteMany();

    console.log('🗑️  Database cleared');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@mobileshop.com',
      password: adminPassword,
      role: 'admin',
      emailVerified: true,
      phone: '+1 (555) 123-4567'
    });

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      emailVerified: true,
      phone: '+1 (555) 987-6543'
    });

    // Create categories
    const categories = await Category.create([
      {
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Latest smartphones from top brands',
        featured: true,
        displayOrder: 1
      },
      {
        name: 'Tablets',
        slug: 'tablets',
        description: 'Tablets for work and entertainment',
        featured: true,
        displayOrder: 2
      },
      {
        name: 'Wearables',
        slug: 'wearables',
        description: 'Smart watches and fitness trackers',
        featured: false,
        displayOrder: 3
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Cases, chargers, and more',
        featured: true,
        displayOrder: 4
      }
    ]);

    // Create products
    const products = await Product.create([
      {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'The iPhone 15 Pro features a titanium design, the A17 Pro chip for next-level performance, and an advanced camera system for incredible photography.',
        shortDescription: 'Latest iPhone with titanium design and advanced camera',
        price: 999,
        discountPrice: 899,
        category: categories[0]._id,
        brand: 'Apple',
        sku: 'APP-IP15P-256',
        stock: 45,
        images: [
          {
            public_id: 'iphone-15-pro-1',
            url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569',
            isPrimary: true
          }
        ],
        specifications: {
          display: '6.1-inch Super Retina XDR',
          processor: 'A17 Pro chip',
          ram: '8GB',
          storage: '256GB',
          camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
          battery: '3274 mAh',
          os: 'iOS 17',
          colors: ['Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium']
        },
        features: ['5G', 'Face ID', 'Wireless Charging', 'Water Resistant'],
        featured: true,
        bestSeller: true,
        newArrival: true,
        createdBy: admin._id
      },
      {
        name: 'Samsung Galaxy S24',
        slug: 'samsung-galaxy-s24',
        description: 'Samsung Galaxy S24 with advanced AI features, powerful processor, and stunning display.',
        shortDescription: 'Flagship Samsung with AI features',
        price: 899,
        discountPrice: 799,
        category: categories[0]._id,
        brand: 'Samsung',
        sku: 'SAM-GS24-512',
        stock: 32,
        images: [
          {
            public_id: 'galaxy-s24-1',
            url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf',
            isPrimary: true
          }
        ],
        specifications: {
          display: '6.2-inch Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 3',
          ram: '8GB',
          storage: '512GB',
          camera: '50MP + 12MP + 10MP',
          battery: '4000 mAh',
          os: 'Android 14',
          colors: ['Phantom Black', 'Marble Gray', 'Cobalt Violet']
        },
        features: ['5G', 'AI Features', 'Wireless Charging', 'IP68 Water Resistance'],
        featured: true,
        bestSeller: true,
        newArrival: true,
        createdBy: admin._id
      },
      // Add more products...
    ]);

    // Create sample orders
    await Order.create([
      {
        user: user._id,
        orderNumber: 'ORD2401010001',
        items: [
          {
            product: products[0]._id,
            name: 'iPhone 15 Pro',
            sku: 'APP-IP15P-256',
            quantity: 1,
            price: 899,
            image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569',
            color: 'Titanium',
            storage: '256GB'
          }
        ],
        shippingAddress: {
          type: 'home',
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          country: 'United States',
          zipCode: '10001',
          phone: '+1 (555) 987-6543'
        },
        paymentMethod: 'card',
        subtotal: 899,
        taxPrice: 71.92,
        shippingPrice: 0,
        totalPrice: 970.92,
        isPaid: true,
        paidAt: new Date('2024-01-15'),
        status: 'delivered',
        isDelivered: true,
        deliveredAt: new Date('2024-01-20')
      }
    ]);

    console.log('✅ Database seeded successfully');
    console.log(`👤 Admin: admin@mobileshop.com / admin123`);
    console.log(`👤 User: john@example.com / user123`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();