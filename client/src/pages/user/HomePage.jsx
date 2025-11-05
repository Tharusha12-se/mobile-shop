// client/src/pages/user/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar, FaShippingFast, FaShieldAlt, FaHeadset } from 'react-icons/fa';

const HomePage = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: 999,
      originalPrice: 1199,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
      rating: 4.8,
      brand: "Apple"
    },
    {
      id: 2,
      name: "Samsung Galaxy S24",
      price: 849,
      originalPrice: 999,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
      rating: 4.6,
      brand: "Samsung"
    },
    {
      id: 3,
      name: "Google Pixel 8",
      price: 699,
      originalPrice: 799,
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400",
      rating: 4.5,
      brand: "Google"
    },
    {
      id: 4,
      name: "OnePlus 12",
      price: 749,
      originalPrice: 849,
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
      rating: 4.4,
      brand: "OnePlus"
    }
  ];

  const categories = [
    { name: "Smartphones", count: "120+ Products", image: "📱" },
    { name: "Tablets", count: "45+ Products", image: "📟" },
    { name: "Accessories", count: "80+ Products", image: "🎧" },
    { name: "Wearables", count: "35+ Products", image: "⌚" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Latest Mobile Phones
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover the best smartphones at amazing prices with exclusive deals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-300 flex items-center justify-center space-x-2"
              >
                <span>Shop Now</span>
                <FaArrowRight />
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition duration-300">
                View Deals
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShippingFast className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free delivery on orders above $500</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1 Year Warranty</h3>
              <p className="text-gray-600">Comprehensive warranty on all products</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeadset className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-6 text-center cursor-pointer hover:transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{category.image}</div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-2"
            >
              <span>View All</span>
              <FaArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{product.brand}</span>
                    <div className="flex items-center space-x-1">
                      <FaStar className="text-yellow-400" />
                      <span className="text-sm font-semibold">{product.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl font-bold text-gray-800">${product.price}</span>
                    <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-300 font-semibold">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe to our newsletter and get the latest updates on new products and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;