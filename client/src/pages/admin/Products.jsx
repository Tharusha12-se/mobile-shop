import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Search, Filter } from 'lucide-react';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      sku: 'APP-IP15P-256',
      category: 'Smartphones',
      price: 999,
      stock: 45,
      status: 'Active',
      sales: 234
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24',
      sku: 'SAM-GS24-512',
      category: 'Smartphones',
      price: 899,
      stock: 32,
      status: 'Active',
      sales: 189
    },
    {
      id: 3,
      name: 'Google Pixel 8',
      sku: 'GOO-PX8-128',
      category: 'Smartphones',
      price: 799,
      stock: 28,
      status: 'Active',
      sales: 156
    },
    {
      id: 4,
      name: 'OnePlus 12',
      sku: 'OPL-OP12-256',
      category: 'Smartphones',
      price: 699,
      stock: 15,
      status: 'Low Stock',
      sales: 143
    },
    {
      id: 5,
      name: 'AirPods Pro',
      sku: 'APP-APPS2',
      category: 'Accessories',
      price: 249,
      stock: 0,
      status: 'Out of Stock',
      sales: 89
    },
    {
      id: 6,
      name: 'Samsung Galaxy Tab S9',
      sku: 'SAM-GTS9-256',
      category: 'Tablets',
      price: 849,
      stock: 22,
      status: 'Active',
      sales: 67
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center">
          <Plus size={20} className="mr-2" />
          Add New Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Categories</option>
              <option value="smartphones">Smartphones</option>
              <option value="tablets">Tablets</option>
              <option value="accessories">Accessories</option>
            </select>
            
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
            
            <button className="flex items-center border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg">
              <Filter size={18} className="mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold">Product</th>
                <th className="text-left py-3 font-semibold">SKU</th>
                <th className="text-left py-3 font-semibold">Category</th>
                <th className="text-left py-3 font-semibold">Price</th>
                <th className="text-left py-3 font-semibold">Stock</th>
                <th className="text-left py-3 font-semibold">Status</th>
                <th className="text-left py-3 font-semibold">Sales</th>
                <th className="text-left py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded mr-3"></div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">{product.sku}</td>
                  <td className="py-4">{product.category}</td>
                  <td className="py-4 font-semibold">${product.price}</td>
                  <td className="py-4">{product.stock}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4">{product.sales}</td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-700">
                        <Eye size={18} />
                      </button>
                      <button className="p-1 text-green-600 hover:text-green-700">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-gray-600">
            Showing 1-{products.length} of 124 products
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">Previous</button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">3</button>
            <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 mb-2">Total Products</p>
          <p className="text-3xl font-bold">124</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 mb-2">Out of Stock</p>
          <p className="text-3xl font-bold text-red-600">8</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 mb-2">Low Stock</p>
          <p className="text-3xl font-bold text-yellow-600">15</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 mb-2">Total Value</p>
          <p className="text-3xl font-bold">$89,432</p>
        </div>
      </div>
    </div>
  );
};

export default Products;