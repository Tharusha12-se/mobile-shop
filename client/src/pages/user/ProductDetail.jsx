// client/src/pages/user/ProductDetail.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaHeart, FaShare, FaShoppingCart, FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedStorage, setSelectedStorage] = useState('128gb');

  const product = {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 1199,
    originalPrice: 1399,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500",
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500",
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500",
    ],
    rating: 4.8,
    reviews: 124,
    brand: "Apple",
    category: "Smartphone",
    inStock: true,
    description: "The iPhone 15 Pro Max features a durable titanium design, the A17 Pro chip for next-level performance, and an advanced camera system for incredible low-light photos and video.",
    features: [
      "6.7-inch Super Retina XDR display",
      "A17 Pro chip with 6-core CPU",
      "Pro camera system with 48MP Main",
      "Titanium design with textured matte glass back",
      "USB-C connector for charging and data transfer"
    ],
    specifications: {
      display: "6.7-inch Super Retina XDR display",
      chip: "A17 Pro chip",
      storage: "256GB, 512GB, 1TB",
      camera: "Pro camera system: 48MP Main, 12MP Ultra Wide, 12MP 5x Telephoto",
      battery: "Up to 29 hours video playback"
    },
    colors: [
      { name: 'Black Titanium', value: 'black' },
      { name: 'White Titanium', value: 'white' },
      { name: 'Blue Titanium', value: 'blue' },
      { name: 'Natural Titanium', value: 'natural' }
    ],
    storage: [
      { size: '128GB', price: 1199 },
      { size: '256GB', price: 1299 },
      { size: '512GB', price: 1499 },
      { size: '1TB', price: 1699 }
    ]
  };

  const relatedProducts = [
    // Add related products here
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-blue-600">Home</a></li>
            <li>/</li>
            <li><a href="/products" className="hover:text-blue-600">Products</a></li>
            <li>/</li>
            <li><a href="#" className="hover:text-blue-600">{product.brand}</a></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg p-4 mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-contain rounded-lg"
              />
            </div>
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`bg-white border-2 rounded-lg p-2 ${
                    selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-16 h-16 object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {product.brand}
              </span>
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded-full transition duration-300">
                  <FaHeart className="text-gray-400 hover:text-red-500 text-xl" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition duration-300">
                  <FaShare className="text-gray-400 hover:text-blue-500 text-xl" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-1">
                <FaStar className="text-yellow-400 text-xl" />
                <span className="text-lg font-semibold">{product.rating}</span>
                <span className="text-gray-500">({product.reviews} reviews)</span>
              </div>
              <span className={`px-2 py-1 rounded text-sm font-semibold ${
                product.inStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-2">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                  Save ${product.originalPrice - product.price}
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Color: {product.colors.find(c => c.value === selectedColor)?.name}</h3>
              <div className="flex space-x-3">
                {product.colors.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color.value ? 'border-blue-600' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Storage Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Storage</h3>
              <div className="flex space-x-3">
                {product.storage.map(option => (
                  <button
                    key={option.size}
                    onClick={() => setSelectedStorage(option.size.toLowerCase())}
                    className={`px-4 py-2 border-2 rounded-lg font-semibold transition duration-300 ${
                      selectedStorage === option.size.toLowerCase()
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {option.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition duration-300"
                >
                  -
                </button>
                <span className="px-4 py-2 border-l border-r border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition duration-300"
                >
                  +
                </button>
              </div>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-300 flex items-center justify-center space-x-2">
                <FaShoppingCart />
                <span>Add to Cart</span>
              </button>
              <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-300">
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center space-x-3 text-gray-600">
                <FaTruck className="text-green-600 text-xl" />
                <div>
                  <p className="font-semibold">Free Shipping</p>
                  <p className="text-sm">On orders over $500</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <FaUndo className="text-blue-600 text-xl" />
                <div>
                  <p className="font-semibold">30-Day Returns</p>
                  <p className="text-sm">Money back guarantee</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <FaShieldAlt className="text-purple-600 text-xl" />
                <div>
                  <p className="font-semibold">2-Year Warranty</p>
                  <p className="text-sm">Extended protection</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['Description', 'Specifications', 'Reviews (124)'].map(tab => (
                <button
                  key={tab}
                  className="py-4 px-1 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 transition duration-300 font-medium text-gray-500"
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-8">
            <h3 className="text-xl font-semibold mb-4">Product Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <h3 className="text-xl font-semibold mb-4">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600 capitalize">{key}:</span>
                  <span className="text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;