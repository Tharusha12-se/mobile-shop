import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Eye, Truck, CheckCircle } from 'lucide-react';

const Orders = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const orders = [
    {
      id: 'ORD-2024-001',
      customer: 'John Smith',
      date: '2024-01-15',
      items: 2,
      total: 1899.98,
      status: 'Processing',
      payment: 'Paid'
    },
    {
      id: 'ORD-2024-002',
      customer: 'Emma Johnson',
      date: '2024-01-15',
      items: 1,
      total: 899.99,
      status: 'Shipped',
      payment: 'Paid'
    },
    {
      id: 'ORD-2024-003',
      customer: 'Michael Brown',
      date: '2024-01-14',
      items: 3,
      total: 2497.97,
      status: 'Delivered',
      payment: 'Paid'
    },
    {
      id: 'ORD-2024-004',
      customer: 'Sarah Davis',
      date: '2024-01-14',
      items: 1,
      total: 249.99,
      status: 'Pending',
      payment: 'Pending'
    },
    {
      id: 'ORD-2024-005',
      customer: 'Robert Wilson',
      date: '2024-01-13',
      items: 2,
      total: 1599.98,
      status: 'Processing',
      payment: 'Paid'
    },
    {
      id: 'ORD-2024-006',
      customer: 'Lisa Anderson',
      date: '2024-01-13',
      items: 1,
      total: 799.99,
      status: 'Cancelled',
      payment: 'Refunded'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Orders', count: 124 },
    { value: 'pending', label: 'Pending', count: 8 },
    { value: 'processing', label: 'Processing', count: 15 },
    { value: 'shipped', label: 'Shipped', count: 23 },
    { value: 'delivered', label: 'Delivered', count: 78 },
    { value: 'cancelled', label: 'Cancelled', count: 5 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (status) => {
    return status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === selectedStatus);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-gray-600">Manage customer orders and shipments</p>
      </div>

      {/* Status Tabs */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                selectedStatus === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{option.label}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                selectedStatus === option.value
                  ? 'bg-white/20'
                  : 'bg-gray-200'
              }`}>
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search orders by ID, customer, or product..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="flex items-center border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg">
              <Filter size={18} className="mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold">Order ID</th>
                <th className="text-left py-3 font-semibold">Customer</th>
                <th className="text-left py-3 font-semibold">Date</th>
                <th className="text-left py-3 font-semibold">Items</th>
                <th className="text-left py-3 font-semibold">Total</th>
                <th className="text-left py-3 font-semibold">Status</th>
                <th className="text-left py-3 font-semibold">Payment</th>
                <th className="text-left py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 font-medium">
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      {order.id}
                    </a>
                  </td>
                  <td className="py-4">{order.customer}</td>
                  <td className="py-4">{order.date}</td>
                  <td className="py-4">{order.items} item(s)</td>
                  <td className="py-4 font-semibold">${order.total.toFixed(2)}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getPaymentColor(order.payment)}`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-700" title="View Details">
                        <Eye size={18} />
                      </button>
                      {order.status === 'Processing' && (
                        <button className="p-1 text-green-600 hover:text-green-700" title="Mark as Shipped">
                          <Truck size={18} />
                        </button>
                      )}
                      {order.status === 'Shipped' && (
                        <button className="p-1 text-green-600 hover:text-green-700" title="Mark as Delivered">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button className="p-1 text-gray-600 hover:text-gray-700">
                        <MoreVertical size={18} />
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
            Showing {filteredOrders.length} of {orders.length} orders
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold mb-4">Today's Orders</h3>
          <p className="text-3xl font-bold">8</p>
          <p className="text-sm text-gray-600 mt-2">+2 from yesterday</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold mb-4">Revenue Today</h3>
          <p className="text-3xl font-bold">$4,892.94</p>
          <p className="text-sm text-gray-600 mt-2">+12.5% from yesterday</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold mb-4">Avg. Order Value</h3>
          <p className="text-3xl font-bold">$612</p>
          <p className="text-sm text-gray-600 mt-2">+8.2% from last month</p>
        </div>
      </div>
    </div>
  );
};

export default Orders;