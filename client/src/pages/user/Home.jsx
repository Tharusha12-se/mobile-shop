import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, RefreshCw, Star } from 'lucide-react';
import ProductCard from './ProductCard';

const Home = () => {
  const featuredProducts = [
    { id: 1, name: "iPhone 15 Pro", price: 999, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400", rating: 4.8, discount: 10 },
    { id: 2, name: "Samsung Galaxy S24", price: 899, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w-400", rating: 4.7, discount: 15 },
    { id: 3, name: "Google Pixel 8", price: 799, image: "https://images.unsplash.com/photo-1598327105854-c8674faddf74?w=400", rating: 4.6, discount: 5 },
    { id: 4, name: "OnePlus 12", price: 699, image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400", rating: 4.5, discount: 20 },
  ];

  const categories = [
    { name: "Smartphones", count: 45, image: "📱" },
    { name: "Tablets", count: 23, image: "💻" },
    { name: "Wearables", count: 18, image: "⌚" },
    { name: "Accessories", count: 67, image: "🎧" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Discover Amazing Mobiles</h1>
          <p className="text-xl mb-8">Latest smartphones with best prices and exclusive deals</p>
          <Link to="/user/products" className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Shop Now <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-blue-600" size={28} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over $99</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="text-green-600" size={28} />
              </div>
              <h3 className="font-semibold text-lg mb-2">30-Day Returns</h3>
              <p className="text-gray-600">Easy return policy</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-yellow-600" size={28} />
              </div>
              <h3 className="font-semibold text-lg mb-2">2-Year Warranty</h3>
              <p className="text-gray-600">On all products</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-purple-600" size={28} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Support</h3>
              <p className="text-gray-600">24/7 customer service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/user/products" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center">
              View All <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map(category => (
              <div key={category.name} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{category.image}</div>
                <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.count} products</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;