import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, Tag } from 'lucide-react';

const Cart = () => {
  // Mock cart items
  const cartItems = [
    {
      id: 1,
      productId: 1,
      name: "iPhone 15 Pro",
      price: 899,
      originalPrice: 999,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
      color: "Titanium",
      storage: "256GB",
      quantity: 1,
      inStock: true
    },
    {
      id: 2,
      productId: 2,
      name: "Samsung Galaxy S24",
      price: 799,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
      color: "Phantom Black",
      storage: "512GB",
      quantity: 2,
      inStock: true
    },
    {
      id: 3,
      productId: 3,
      name: "AirPods Pro",
      price: 249,
      image: "https://images.unsplash.com/photo-1591370264374-9a5aef8df17a?w=400",
      color: "White",
      quantity: 1,
      inStock: true
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/user/products" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {cartItems.map(item => (
                <div key={item.id} className="border-b last:border-b-0">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center">
                      {/* Product Image */}
                      <div className="md:w-1/4 mb-4 md:mb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 md:h-32 object-contain"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="md:w-3/4 md:pl-6">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                            {item.color && (
                              <p className="text-gray-600 mb-1">Color: {item.color}</p>
                            )}
                            {item.storage && (
                              <p className="text-gray-600 mb-1">Storage: {item.storage}</p>
                            )}
                            <p className={`text-sm ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                              {item.inStock ? 'In Stock' : 'Out of Stock'}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-xl font-bold mb-2">${item.price}</p>
                            {item.originalPrice && (
                              <p className="text-gray-500 line-through text-sm">${item.originalPrice}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center border rounded-lg">
                              <button className="px-3 py-1 hover:bg-gray-100">
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-1 border-x">{item.quantity}</span>
                              <button className="px-3 py-1 hover:bg-gray-100">
                                <Plus size={16} />
                              </button>
                            </div>
                            <button className="text-red-600 hover:text-red-700 flex items-center">
                              <Trash2 size={18} className="mr-1" />
                              Remove
                            </button>
                          </div>
                          <div className="font-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link to="/user/products" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center">
                <ArrowRight className="mr-2 rotate-180" size={20} />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Tag size={18} className="text-gray-500 mr-2" />
                  <span className="text-gray-700">Have a coupon code?</span>
                </div>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-r-lg">
                    Apply
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/user/checkout"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold mb-4"
              >
                Proceed to Checkout
              </Link>

              {/* Security Info */}
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">🔒 Secure checkout</p>
                <p>Your payment information is encrypted</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold mb-4">We Accept</h3>
              <div className="flex space-x-4">
                <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">VISA</div>
                <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">MC</div>
                <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">PP</div>
                <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">AP</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;