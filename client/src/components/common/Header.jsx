import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search } from 'lucide-react';

const Header = ({ onLogout, userType = 'user' }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={userType === 'user' ? '/user/home' : '/admin/dashboard'} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">MobileShop</span>
          </Link>

          {/* Search Bar - Only for user */}
          {userType === 'user' && (
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for mobiles, brands, accessories..."
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            {userType === 'user' ? (
              <>
                <Link to="/user/home" className="text-gray-700 hover:text-blue-600 font-medium">
                  Home
                </Link>
                <Link to="/user/products" className="text-gray-700 hover:text-blue-600 font-medium">
                  Products
                </Link>
                <Link to="/user/categories" className="text-gray-700 hover:text-blue-600 font-medium">
                  Categories
                </Link>
                <Link to="/user/about" className="text-gray-700 hover:text-blue-600 font-medium">
                  About
                </Link>
                <Link to="/user/contact" className="text-gray-700 hover:text-blue-600 font-medium">
                  Contact
                </Link>
                
                <div className="flex items-center space-x-4">
                  <Link to="/user/cart" className="relative">
                    <ShoppingCart className="text-gray-700 hover:text-blue-600" size={24} />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      3
                    </span>
                  </Link>
                  
                  <Link to="/user/profile" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                    <User size={24} />
                    <span className="font-medium">John</span>
                  </Link>
                  
                  <button
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                  Dashboard
                </Link>
                <Link to="/admin/products" className="text-gray-700 hover:text-blue-600 font-medium">
                  Products
                </Link>
                <Link to="/admin/orders" className="text-gray-700 hover:text-blue-600 font-medium">
                  Orders
                </Link>
                <Link to="/admin/users" className="text-gray-700 hover:text-blue-600 font-medium">
                  Users
                </Link>
                <Link to="/admin/categories" className="text-gray-700 hover:text-blue-600 font-medium">
                  Categories
                </Link>
                
                <button
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Logout Admin
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;