import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, Truck, Shield, RefreshCw, ChevronRight, Heart } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Titanium');
  const [selectedStorage, setSelectedStorage] = useState('256GB');

  // Mock product data
  const product = {
    id: 1,
    name: "iPhone 15 Pro",
    price: 999,
    discountPrice: 899,
    description: "The iPhone 15 Pro features a titanium design, the A17 Pro chip for next-level performance, and an advanced camera system for incredible photography.",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
      "https://images.unsplash.com/photo-1695048132980-2079d4c2a3ee?w=800",
      "https://images.unsplash.com/photo-1695048132957-5e2ae56eac57?w=800"
    ],
    colors: [
      { name: 'Titanium', code: '#8B7355' },
      { name: 'Blue Titanium', code: '#3B82F6' },
      { name: 'White Titanium', code: '#F3F4F6' },
      { name: 'Black Titanium', code: '#1F2937' }
    ],
    storageOptions: ['128GB', '256GB', '512GB', '1TB'],
    specifications: {
      display: '6.1-inch Super Retina XDR',
      processor: 'A17 Pro chip',
      ram: '8GB',
      camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
      battery: '3274 mAh',
      os: 'iOS 17'
    },
    rating: 4.8,
    reviews: 124,
    inStock: true,
    brand: 'Apple',
    category: 'Smartphones'
  };

  const features = [
    { icon: <Truck size={24} />, title: 'Free Shipping', desc: 'Free delivery on all orders' },
    { icon: <Shield size={24} />, title: '2-Year Warranty', desc: 'Comprehensive coverage' },
    { icon: <RefreshCw size={24} />, title: '30-Day Returns', desc: 'Easy return policy' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 text-sm text-gray-500">
        <a href="/user/home" className="hover:text-blue-600">Home</a>
        <ChevronRight className="inline mx-2" size={16} />
        <a href="/user/products" className="hover:text-blue-600">Products</a>
        <ChevronRight className="inline mx-2" size={16} />
        <a href="/user/categories" className="hover:text-blue-600">Smartphones</a>
        <ChevronRight className="inline mx-2" size={16} />
        <span className="text-gray-800">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-contain"
            />
          </div>
          <div className="flex space-x-4">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'}`}
              >
                <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {product.brand}
            </span>
            <h1 className="text-3xl font-bold mt-2 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                ))}
                <span className="ml-2 text-gray-600">{product.rating} ({product.reviews} reviews)</span>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold">${product.discountPrice}</span>
                {product.discountPrice < product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">${product.price}</span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      Save ${product.price - product.discountPrice}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Color: {selectedColor}</h3>
            <div className="flex space-x-3">
              {product.colors.map(color => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-10 h-10 rounded-full border-2 ${selectedColor === color.name ? 'border-blue-500' : 'border-gray-300'}`}
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Storage Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Storage</h3>
            <div className="flex flex-wrap gap-2">
              {product.storageOptions.map(storage => (
                <button
                  key={storage}
                  onClick={() => setSelectedStorage(storage)}
                  className={`px-4 py-2 rounded-lg border ${selectedStorage === storage ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  {storage}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <span className="text-gray-600">{product.inStock ? `${product.stock} available` : 'Out of stock'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-8">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center">
              <ShoppingCart className="mr-2" size={20} />
              Add to Cart
            </button>
            <button className="px-6 border border-gray-300 hover:bg-gray-50 rounded-lg">
              <Heart size={24} />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-blue-600 mt-1">{feature.icon}</div>
                <div>
                  <h4 className="font-semibold">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Specifications</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="border-b pb-3">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="font-medium ml-2">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;