import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  Tag, BarChart3, Settings, ChevronLeft, ChevronRight,
  DollarSign, TrendingUp, Bell
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/products', icon: <Package size={20} />, label: 'Products' },
    { path: '/admin/orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/admin/categories', icon: <Tag size={20} />, label: 'Categories' },
    { path: '/admin/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const stats = [
    { label: 'Total Revenue', value: '$45,231', change: '+20.1%', icon: <DollarSign size={16} /> },
    { label: 'Total Orders', value: '1,234', change: '+12.5%', icon: <ShoppingCart size={16} /> },
    { label: 'Active Users', value: '3,456', change: '+8.2%', icon: <Users size={16} /> },
  ];

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
      <div className="h-full overflow-y-auto">
        {isOpen && (
          <>
            {/* Quick Stats */}
            <div className="p-4 border-b">
              <div className="space-y-3">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{stat.label}</span>
                      {stat.icon}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{stat.value}</span>
                      <span className="text-xs text-green-600 flex items-center">
                        <TrendingUp size={12} className="mr-1" />
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="p-4">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Notifications */}
            <div className="p-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center">
                  <Bell size={16} className="mr-2" />
                  Notifications
                </h3>
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </div>
              <div className="space-y-2">
                <div className="text-sm p-2 bg-blue-50 rounded">
                  <p className="font-medium">New order #1234</p>
                  <p className="text-gray-600 text-xs">2 minutes ago</p>
                </div>
                <div className="text-sm p-2 bg-yellow-50 rounded">
                  <p className="font-medium">Low stock alert</p>
                  <p className="text-gray-600 text-xs">1 hour ago</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 bg-white border rounded-full p-1 shadow-md"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </aside>
  );
};

export default AdminSidebar;