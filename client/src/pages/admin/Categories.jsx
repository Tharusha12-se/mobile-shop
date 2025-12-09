import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronRight, Folder, File } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Smartphones',
      slug: 'smartphones',
      products: 45,
      subcategories: [
        { id: 11, name: 'Flagship', products: 15 },
        { id: 12, name: 'Mid-range', products: 20 },
        { id: 13, name: 'Budget', products: 10 }
      ],
      featured: true
    },
    {
      id: 2,
      name: 'Tablets',
      slug: 'tablets',
      products: 23,
      subcategories: [
        { id: 21, name: 'iPad', products: 8 },
        { id: 22, name: 'Android', products: 12 },
        { id: 23, name: 'Windows', products: 3 }
      ],
      featured: true
    },
    {
      id: 3,
      name: 'Wearables',
      slug: 'wearables',
      products: 18,
      subcategories: [
        { id: 31, name: 'Smart Watches', products: 10 },
        { id: 32, name: 'Fitness Bands', products: 5 },
        { id: 33, name: 'Wireless Earbuds', products: 3 }
      ],
      featured: false
    },
    {
      id: 4,
      name: 'Accessories',
      slug: 'accessories',
      products: 67,
      subcategories: [
        { id: 41, name: 'Cases', products: 25 },
        { id: 42, name: 'Chargers', products: 18 },
        { id: 43, name: 'Headphones', products: 24 }
      ],
      featured: true
    },
    {
      id: 5,
      name: 'Power Banks',
      slug: 'power-banks',
      products: 32,
      subcategories: [
        { id: 51, name: 'Wireless', products: 12 },
        { id: 52, name: 'Fast Charging', products: 15 },
        { id: 53, name: 'High Capacity', products: 5 }
      ],
      featured: false
    }
  ]);

  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
  };

  const handleDeleteSubcategory = (categoryId, subcategoryId) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      setCategories(categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId)
          };
        }
        return cat;
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-600">Organize your products into categories</p>
        </div>
        
        <div className="flex space-x-3">
          <button className="border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold">
            Import/Export
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center">
            <Plus size={20} className="mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 mb-2">Total Categories</p>
          <p className="text-3xl font-bold">{categories.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 mb-2">Total Products</p>
          <p className="text-3xl font-bold">
            {categories.reduce((sum, cat) => sum + cat.products, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 mb-2">Featured Categories</p>
          <p className="text-3xl font-bold">
            {categories.filter(cat => cat.featured).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 mb-2">Total Subcategories</p>
          <p className="text-3xl font-bold">
            {categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}
          </p>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">All Categories</h2>
          
          <div className="space-y-4">
            {categories.map(category => (
              <div key={category.id} className="border rounded-lg overflow-hidden">
                {/* Main Category */}
                <div className="p-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <ChevronRight 
                        size={20} 
                        className={`transition-transform ${expandedCategory === category.id ? 'rotate-90' : ''}`}
                      />
                    </button>
                    <Folder className="text-blue-600" size={24} />
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Slug: {category.slug}</span>
                        <span>•</span>
                        <span>{category.products} products</span>
                        <span>•</span>
                        <span>{category.subcategories.length} subcategories</span>
                        {category.featured && (
                          <>
                            <span>•</span>
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                              Featured
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded">
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Subcategories */}
                {expandedCategory === category.id && (
                  <div className="bg-white border-t">
                    <div className="p-4">
                      <h4 className="font-semibold mb-3 text-gray-700">Subcategories</h4>
                      <div className="space-y-2">
                        {category.subcategories.map(subcategory => (
                          <div key={subcategory.id} className="flex items-center justify-between pl-8 py-2 hover:bg-gray-50 rounded">
                            <div className="flex items-center space-x-3">
                              <File className="text-gray-400" size={18} />
                              <div>
                                <p className="font-medium">{subcategory.name}</p>
                                <p className="text-sm text-gray-600">{subcategory.products} products</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-blue-600 hover:text-blue-700">
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                                className="p-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Add Subcategory Form */}
                      <div className="mt-4 pl-8">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="Enter new subcategory name"
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg">
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add Category Form */}
        <div className="border-t p-6 bg-gray-50">
          <h3 className="font-semibold mb-4">Add New Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Category Name"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Slug (auto-generated)"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="md:col-span-2">
              <textarea
                placeholder="Description"
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Featured Category</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Active</span>
              </label>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold">
                Create Category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;