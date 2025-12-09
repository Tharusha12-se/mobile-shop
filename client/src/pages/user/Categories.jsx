import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Tablet, Watch, Headphones, Battery, Camera } from 'lucide-react';

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: 'Smartphones',
      icon: <Smartphone size={32} />,
      count: 45,
      description: 'Latest smartphones from top brands',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
      subcategories: ['Flagship', 'Mid-range', 'Budget', 'Gaming']
    },
    {
      id: 2,
      name: 'Tablets',
      icon: <Tablet size={32} />,
      count: 23,
      description: 'Tablets for work and entertainment',
      image: 'https://images.unsplash.com/photo-1546054451-aa229c1efd5f?w=800',
      subcategories: ['iPad', 'Android', 'Windows', 'Gaming']
    },
    {
      id: 3,
      name: 'Wearables',
      icon: <Watch size={32} />,
      count: 18,
      description: 'Smart watches and fitness trackers',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      subcategories: ['Smart Watches', 'Fitness Bands', 'Wireless Earbuds']
    },
    {
      id: 4,
      name: 'Accessories',
      icon: <Headphones size={32} />,
      count: 67,
      description: 'Cases, chargers, and more',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      subcategories: ['Cases', 'Chargers', 'Headphones', 'Screen Protectors']
    },
    {
      id: 5,
      name: 'Power Banks',
      icon: <Battery size={32} />,
      count: 32,
      description: 'Portable power solutions',
      image: 'https://images.unsplash.com/photo-1601524909163-991bd9a5f7f4?w=800',
      subcategories: ['Wireless', 'Fast Charging', 'High Capacity']
    },
    {
      id: 6,
      name: 'Camera Accessories',
      icon: <Camera size={32} />,
      count: 28,
      description: 'Lenses, tripods, and camera gear',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
      subcategories: ['Lenses', 'Tripods', 'Memory Cards', 'Batteries']
    }
  ];

  const brands = [
    { name: 'Apple', count: 23, logo: '🍎' },
    { name: 'Samsung', count: 18, logo: '📱' },
    { name: 'Google', count: 12, logo: '🔍' },
    { name: 'OnePlus', count: 15, logo: '1+' },
    { name: 'Xiaomi', count: 20, logo: '📶' },
    { name: 'Sony', count: 14, logo: '🎮' },
    { name: 'Asus', count: 10, logo: '💻' },
    { name: 'Motorola', count: 8, logo: 'M' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
        <p className="text-gray-600 text-lg">Browse our extensive collection of mobile products and accessories</p>
      </div>

      {/* Featured Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {categories.map(category => (
          <Link
            key={category.id}
            to={`/user/products?category=${category.name.toLowerCase()}`}
            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative h-64">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count} products</p>
                  </div>
                </div>
                <p className="text-sm opacity-90">{category.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Brands Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Brands</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {brands.map(brand => (
            <Link
              key={brand.name}
              to={`/user/products?brand=${brand.name}`}
              className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-2">{brand.logo}</div>
              <h3 className="font-semibold mb-1">{brand.name}</h3>
              <p className="text-sm text-gray-600">{brand.count} products</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Category Details */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Explore All Categories</h2>
        
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category.id} className="border-b last:border-b-0 pb-6 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-3">{category.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map(sub => (
                        <span
                          key={sub}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Link
                  to={`/user/products?category=${category.name.toLowerCase()}`}
                  className="text-blue-600 hover:text-blue-700 font-semibold whitespace-nowrap"
                >
                  Shop All ({category.count})
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Shop With Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="font-semibold mb-2">Free Shipping</h3>
            <p className="text-gray-600">On orders over $99</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="font-semibold mb-2">Easy Returns</h3>
            <p className="text-gray-600">30-day return policy</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="font-semibold mb-2">Warranty</h3>
            <p className="text-gray-600">2-year warranty on all products</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-4">💯</div>
            <h3 className="font-semibold mb-2">Authentic Products</h3>
            <p className="text-gray-600">100% genuine products</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;