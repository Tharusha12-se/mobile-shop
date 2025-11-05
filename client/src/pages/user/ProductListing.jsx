// client/src/pages/user/ProductListing.jsx
import React, { useState } from 'react';
import { FaFilter, FaSort, FaStar, FaHeart } from 'react-icons/fa';

const ProductListing = () => {
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    priceRange: '',
    rating: ''
  });

  const products = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      price: 1199,
      originalPrice: 1399,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
      rating: 4.8,
      reviews: 124,
      brand: "Apple",
      category: "Smartphone",
      inStock: true,
      features: ["5G", "256GB", "Titanium"]
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      price: 1299,
      originalPrice: 1499,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
      rating: 4.7,
      reviews: 89,
      brand: "Samsung",
      category: "Smartphone",
      inStock: true,
      features: ["S Pen", "512GB", "AI Features"]
    },
    // Add more products...
  ];

  const brands = ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Realme"];
  const categories = ["Smartphone", "Tablet", "Accessories", "Wearables"];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mobile Phones</h1>
          <p className="text-gray-600">Discover our wide range of smartphones</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 bg-white rounded-lg shadow-sm p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              <FaFilter className="text-gray-400" />
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Price Range</h3>
              <div className="space-y-2">
                {['Under $500', '$500 - $1000', '$1000 - $1500', 'Over $1500'].map(range => (
                  <label key={range} className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="price" className="text-blue-600" />
                    <span className="text-gray-700">{range}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Brands</h3>
              <div className="space-y-2">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="text-blue-600 rounded" />
                    <span className="text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="text-blue-600 rounded" />
                    <span className="text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ratings */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Customer Ratings</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="text-blue-600 rounded" />
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-sm ${
                            i < rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-gray-700">& Up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
              Apply Filters
            </button>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and Results Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-600 mb-4 sm:mb-0">Showing 1-12 of 48 products</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaSort className="text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
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
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition duration-300">
                      <FaHeart className="text-gray-400 hover:text-red-500" />
                    </button>
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">{product.brand}</span>
                      <div className="flex items-center space-x-1">
                        <FaStar className="text-yellow-400" />
                        <span className="text-sm font-semibold">{product.rating}</span>
                        <span className="text-sm text-gray-500">({product.reviews})</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 cursor-pointer">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-2xl font-bold text-gray-800">${product.price}</span>
                      <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.features.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <button
                      className={`w-full py-2 rounded-lg font-semibold transition duration-300 ${
                        product.inStock
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300">
                Previous
              </button>
              {[1, 2, 3, 4, 5].map(page => (
                <button
                  key={page}
                  className={`px-4 py-2 border rounded-lg transition duration-300 ${
                    page === 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;