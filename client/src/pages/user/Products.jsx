import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Filter, Grid, List, ChevronDown } from 'lucide-react';

const Products = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');

  const products = [
    { id: 1, name: "iPhone 15 Pro", price: 999, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400", rating: 4.8, discount: 10, brand: "Apple", storage: "256GB", color: "Titanium" },
    { id: 2, name: "Samsung Galaxy S24", price: 899, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400", rating: 4.7, discount: 15, brand: "Samsung", storage: "512GB", color: "Phantom Black" },
    { id: 3, name: "Google Pixel 8", price: 799, image: "https://images.unsplash.com/photo-1598327105854-c8674faddf74?w=400", rating: 4.6, brand: "Google", storage: "128GB", color: "Obsidian" },
    { id: 4, name: "OnePlus 12", price: 699, image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400", rating: 4.5, discount: 20, brand: "OnePlus", storage: "256GB", color: "Emerald Green" },
    { id: 5, name: "Xiaomi 14 Pro", price: 849, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400", rating: 4.4, brand: "Xiaomi", storage: "512GB", color: "Black" },
    { id: 6, name: "Nothing Phone 2", price: 599, image: "https://images.unsplash.com/photo-1696256683563-caf6e6f8c3bd?w=400", rating: 4.3, discount: 5, brand: "Nothing", storage: "256GB", color: "White" },
    { id: 7, name: "Asus ROG Phone 8", price: 1099, image: "https://images.unsplash.com/photo-1595941069915-4ebc5197c14a?w=400", rating: 4.9, brand: "Asus", storage: "1TB", color: "Storm Grey" },
    { id: 8, name: "Motorola Edge 40", price: 549, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400", rating: 4.2, discount: 12, brand: "Motorola", storage: "256GB", color: "Nebula Green" },
  ];

  const brands = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Nothing', 'Asus', 'Motorola'];
  const priceRanges = ['Under $300', '$300 - $600', '$600 - $900', '$900 - $1200', 'Above $1200'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">All Products</h1>
        <p className="text-gray-600">Discover our wide range of mobile phones and accessories</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center">
                <Filter className="mr-2" size={20} /> Filters
              </h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm">
                Clear All
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map(range => (
                  <label key={range} className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" />
                    <span>{range}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Brands</h3>
              <div className="space-y-2">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Storage */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Storage</h3>
              <div className="space-y-2">
                {['64GB', '128GB', '256GB', '512GB', '1TB'].map(storage => (
                  <label key={storage} className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" />
                    <span>{storage}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          {/* Controls */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <span className="text-gray-600">Showing {products.length} products</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                  >
                    <Grid size={20} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-6"
          }>
            {products.map(product => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 rounded-lg border hover:bg-gray-50">Previous</button>
              <button className="px-3 py-2 rounded-lg bg-blue-600 text-white">1</button>
              <button className="px-3 py-2 rounded-lg border hover:bg-gray-50">2</button>
              <button className="px-3 py-2 rounded-lg border hover:bg-gray-50">3</button>
              <button className="px-3 py-2 rounded-lg border hover:bg-gray-50">Next</button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;