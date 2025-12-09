import React, { useState } from 'react';
import { User, MapPin, ShoppingBag, Heart, Settings, LogOut, Edit2, Check } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={18} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  const orders = [
    { id: 'ORD-2024-001', date: '2024-01-15', total: 899.99, status: 'Delivered', items: 1 },
    { id: 'ORD-2024-002', date: '2024-01-10', total: 1599.98, status: 'Processing', items: 2 },
    { id: 'ORD-2023-012', date: '2023-12-20', total: 249.99, status: 'Delivered', items: 1 },
    { id: 'ORD-2023-011', date: '2023-12-05', total: 1099.99, status: 'Delivered', items: 1 }
  ];

  const addresses = [
    { type: 'Home', street: '123 Main Street', city: 'New York', state: 'NY', zip: '10001', isDefault: true },
    { type: 'Work', street: '456 Business Ave', city: 'New York', state: 'NY', zip: '10002', isDefault: false }
  ];

  const wishlistItems = [
    { id: 1, name: 'iPhone 15 Pro', price: 899, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400' },
    { id: 2, name: 'Samsung Galaxy Tab S9', price: 799, image: 'https://images.unsplash.com/photo-1546054451-aa229c1efd5f?w=400' },
    { id: 3, name: 'Apple Watch Series 9', price: 399, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                {isEditing ? <Check size={18} className="mr-1" /> : <Edit2 size={18} className="mr-1" />}
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6 mb-8">
              <div className="relative">
                <img
                  src={userData.avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full">
                    <Edit2 size={16} />
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-gray-600 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  ) : (
                    <p className="text-lg font-semibold">{userData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  ) : (
                    <p className="text-lg">{userData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  ) : (
                    <p className="text-lg">{userData.phone}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">$3,849.95</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-2xl font-bold">2023</p>
              </div>
            </div>
          </div>
        );

      case 'addresses':
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">My Addresses</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {addresses.map((address, index) => (
                <div key={index} className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-semibold">{address.type}</span>
                      {address.isDefault && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                  </div>
                  <p className="text-gray-600">{address.street}</p>
                  <p className="text-gray-600">{address.city}, {address.state} {address.zip}</p>
                </div>
              ))}
            </div>

            <button className="w-full border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-lg p-6 text-gray-600 hover:text-blue-600 transition-colors">
              + Add New Address
            </button>
          </div>
        );

      case 'orders':
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Order History</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-semibold">Order ID</th>
                    <th className="text-left py-3 font-semibold">Date</th>
                    <th className="text-left py-3 font-semibold">Items</th>
                    <th className="text-left py-3 font-semibold">Total</th>
                    <th className="text-left py-3 font-semibold">Status</th>
                    <th className="text-left py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 font-medium">{order.id}</td>
                      <td className="py-4">{order.date}</td>
                      <td className="py-4">{order.items} item(s)</td>
                      <td className="py-4 font-semibold">${order.total.toFixed(2)}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className="text-blue-600 hover:text-blue-700 text-sm">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'wishlist':
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">My Wishlist</h2>
            
            {wishlistItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💝</div>
                <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-6">Save items you love for later</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map(item => (
                  <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-contain p-4"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{item.name}</h3>
                      <p className="text-xl font-bold mb-4">${item.price}</p>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold">
                          Add to Cart
                        </button>
                        <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg">
                          ❤️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Account Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span>Order updates</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span>Promotional emails</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" />
                    <span>Newsletter</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Change Password</h3>
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3 text-red-600">Danger Zone</h3>
                <button className="bg-red-50 text-red-600 hover:bg-red-100 px-6 py-3 rounded-lg font-semibold">
                  Delete Account
                </button>
                <p className="text-sm text-gray-600 mt-2">This action cannot be undone</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={userData.avatar}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="font-bold">{userData.name}</h2>
                <p className="text-sm text-gray-600">{userData.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 mt-6">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;