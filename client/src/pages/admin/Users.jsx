import React, { useState } from 'react';
import { Search, Mail, Phone, Calendar, Shield, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const Users = () => {
  const [userType, setUserType] = useState('all');

  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2023-01-15',
      orders: 12,
      totalSpent: 3849.95,
      status: 'Active',
      role: 'Customer'
    },
    {
      id: 2,
      name: 'Emma Johnson',
      email: 'emma.j@example.com',
      phone: '+1 (555) 987-6543',
      joinDate: '2023-02-20',
      orders: 8,
      totalSpent: 2199.92,
      status: 'Active',
      role: 'Customer'
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      phone: '+1 (555) 456-7890',
      joinDate: '2023-03-10',
      orders: 23,
      totalSpent: 7899.77,
      status: 'Active',
      role: 'VIP Customer'
    },
    {
      id: 4,
      name: 'Sarah Davis',
      email: 'sarah.d@example.com',
      phone: '+1 (555) 321-0987',
      joinDate: '2023-04-05',
      orders: 3,
      totalSpent: 749.97,
      status: 'Inactive',
      role: 'Customer'
    },
    {
      id: 5,
      name: 'Admin User',
      email: 'admin@mobileshop.com',
      phone: '+1 (555) 111-2222',
      joinDate: '2023-01-01',
      orders: 0,
      totalSpent: 0,
      status: 'Active',
      role: 'Administrator'
    }
  ];

  const userStats = [
    { label: 'Total Users', value: '1,234', change: '+12.5%' },
    { label: 'New This Month', value: '89', change: '+8.2%' },
    { label: 'Active Users', value: '1,089', change: '+15.3%' },
    { label: 'VIP Customers', value: '45', change: '+23.1%' }
  ];

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Administrator': return 'bg-red-100 text-red-800';
      case 'VIP Customer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const filteredUsers = userType === 'all' 
    ? users 
    : users.filter(user => user.role.toLowerCase().includes(userType.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-gray-600">Manage your customers and administrators</p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {userStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600 mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold">{stat.value}</p>
              <span className="text-green-600 text-sm font-medium">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* User Type Tabs */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setUserType('all')}
            className={`px-4 py-2 rounded-lg ${userType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            All Users
          </button>
          <button
            onClick={() => setUserType('customer')}
            className={`px-4 py-2 rounded-lg ${userType === 'customer' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Customers
          </button>
          <button
            onClick={() => setUserType('vip')}
            className={`px-4 py-2 rounded-lg ${userType === 'vip' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            VIP Customers
          </button>
          <button
            onClick={() => setUserType('administrator')}
            className={`px-4 py-2 rounded-lg ${userType === 'administrator' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            Administrators
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Sort by: Newest</option>
              <option value="name">Name</option>
              <option value="orders">Most Orders</option>
              <option value="spent">Total Spent</option>
            </select>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
              Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold">User</th>
                <th className="text-left py-3 font-semibold">Contact</th>
                <th className="text-left py-3 font-semibold">Join Date</th>
                <th className="text-left py-3 font-semibold">Orders</th>
                <th className="text-left py-3 font-semibold">Total Spent</th>
                <th className="text-left py-3 font-semibold">Status</th>
                <th className="text-left py-3 font-semibold">Role</th>
                <th className="text-left py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail size={14} className="mr-2 text-gray-500" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone size={14} className="mr-2 text-gray-500" />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2 text-gray-500" />
                      {user.joinDate}
                    </div>
                  </td>
                  <td className="py-4 font-semibold">{user.orders}</td>
                  <td className="py-4 font-semibold">${user.totalSpent.toFixed(2)}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-700" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-700" title="Delete">
                        <Trash2 size={18} />
                      </button>
                      {user.role === 'Customer' && (
                        <button className="p-1 text-purple-600 hover:text-purple-700" title="Make VIP">
                          <Shield size={18} />
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
            Showing {filteredUsers.length} of {users.length} users
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
    </div>
  );
};

export default Users;