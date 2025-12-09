import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye } from 'lucide-react';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="md:w-1/4">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-48 object-contain rounded-lg"
            />
          </div>
          <div className="md:w-3/4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                      />
                    ))}
                    <span className="ml-2 text-gray-600">{product.rating}</span>
                  </div>
                  <span className="text-gray-500">• {product.brand}</span>
                  <span className="text-gray-500">• {product.storage}</span>
                  <span className="text-gray-500">• {product.color}</span>
                </div>
                <p className="text-gray-600 mb-4">
                  Latest model with advanced features including 5G connectivity, 
                  professional camera system, and all-day battery life.
                </p>
              </div>
              <div className="text-right">
                {product.discount && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-2xl font-bold">${product.price}</span>
                {product.discount && (
                  <span className="ml-2 text-gray-500 line-through">
                    ${(product.price * 100 / (100 - product.discount)).toFixed(0)}
                  </span>
                )}
              </div>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>
                <Link 
                  to={`/user/product/${product.id}`}
                  className="flex items-center space-x-2 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium"
                >
                  <Eye size={18} />
                  <span>View Details</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-contain p-4"
        />
        {product.discount && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {product.discount}% OFF
          </div>
        )}
        <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
          <Eye size={20} />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg truncate">{product.name}</h3>
          <span className="text-gray-500 text-sm">{product.brand}</span>
        </div>
        
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold">${product.price}</span>
            {product.discount && (
              <span className="ml-2 text-gray-500 line-through text-sm">
                ${(product.price * 100 / (100 - product.discount)).toFixed(0)}
              </span>
            )}
          </div>
          <div className="text-gray-600 text-sm">
            {product.storage}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center">
            <ShoppingCart size={18} className="mr-2" />
            Add to Cart
          </button>
          <Link 
            to={`/user/product/${product.id}`}
            className="border border-gray-300 hover:bg-gray-50 py-2 rounded-lg font-medium text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;