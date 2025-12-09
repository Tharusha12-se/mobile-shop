import React from 'react';
import { TrendingUp, Users, DollarSign, Package, ShoppingCart, BarChart3, Activity } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Total Revenue', value: '$54,231', change: '+12.5%', icon: <DollarSign size={24} />, color: 'bg-green-500' },
    { title: 'Total Orders', value: '3,456', change: '+8.2%', icon: <ShoppingCart size={24} />, color: 'bg-blue-500' },
    { title: 'Active Users', value: '2,345', change: '+15.3%', icon: <Users size={24} />, color: 'bg-purple-500' },
    { title: 'Products', value: '1,234', change: '+5.7%', icon: <Package size={24} />, color: 'bg-orange-500' },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Smith', date: '2024-01-15', amount: '$999', status: 'Delivered' },
    { id: '#ORD-002', customer: 'Emma Johnson', date: '2024-01-15', amount: '$1,299', status: 'Processing' },
    { id: '#ORD-003', customer: 'Michael Brown', date: '2024-01-14', amount: '$799', status: 'Shipped' },
    { id: '#ORD-004', customer: 'Sarah Davis', date: '2024-01-14', amount: '$599', status: 'Pending' },
    { id: '#ORD-005', customer: 'Robert Wilson', date: '2024-01-13', amount: '$1,099', status: 'Delivered' },
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 234, revenue: '$233,766' },
    { name: 'Samsung Galaxy S24', sales: 189, revenue: '$169,911' },
    { name: 'Google Pixel 8', sales: 156, revenue: '$124,644' },
    { name: 'OnePlus 12', sales: 143, revenue: '$99,957' },
    { name: 'Xiaomi 14 Pro', sales: 98, revenue: '$83,202' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Admin! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <div className="text-white">{stat.icon}</div>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp size={16} />
                <span className="ml-1 text-sm font-medium">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Revenue Overview</h2>
            <BarChart3 className="text-gray-400" size={24} />
          </div>
          <div className="h-64 flex items-end space-x-2">
            {[40, 60, 75, 55, 85, 65, 90, 70, 80, 65, 75, 85].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 text-gray-600 font-medium">Order ID</th>
                  <th className="text-left py-3 text-gray-600 font-medium">Customer</th>
                  <th className="text-left py-3 text-gray-600 font-medium">Date</th>
                  <th className="text-left py-3 text-gray-600 font-medium">Amount</th>
                  <th className="text-left py-3 text-gray-600 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{order.id}</td>
                    <td className="py-3">{order.customer}</td>
                    <td className="py-3 text-gray-600">{order.date}</td>
                    <td className="py-3 font-medium">{order.amount}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="w-full mt-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium">
            View All Orders
          </button>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Top Selling Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 text-gray-600 font-medium">Product</th>
                <th className="text-left py-3 text-gray-600 font-medium">Sales</th>
                <th className="text-left py-3 text-gray-600 font-medium">Revenue</th>
                <th className="text-left py-3 text-gray-600 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.name} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium">{product.name}</td>
                  <td className="py-3">{product.sales} units</td>
                  <td className="py-3 font-medium">{product.revenue}</td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <Activity className="text-green-500 mr-2" size={16} />
                      <span className="text-green-600">+12.5%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;