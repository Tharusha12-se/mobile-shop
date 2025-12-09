import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Lock, Shield, Check } from 'lucide-react';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [saveAddress, setSaveAddress] = useState(true);

  const steps = [
    { number: 1, title: 'Shipping Address' },
    { number: 2, title: 'Payment Method' },
    { number: 3, title: 'Review Order' }
  ];

  const orderSummary = {
    items: [
      { name: 'iPhone 15 Pro', price: 899, quantity: 1 },
      { name: 'Samsung Galaxy S24', price: 799, quantity: 2 },
      { name: 'AirPods Pro', price: 249, quantity: 1 }
    ],
    subtotal: 2746,
    shipping: 0,
    tax: 219.68,
    total: 2965.68
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex justify-between">
          {steps.map((s) => (
            <div key={s.number} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= s.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {step > s.number ? <Check size={20} /> : s.number}
              </div>
              <span className={`mt-2 text-sm ${step >= s.number ? 'font-semibold' : 'text-gray-600'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-5">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200"></div>
          <div 
            className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-300"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">First Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Last Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Address</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">City</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">State</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">ZIP Code</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input type="tel" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <label className="flex items-center mb-6">
                <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="mr-2" />
                <span>Save this address for future orders</span>
              </label>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>
              
              <div className="space-y-4 mb-6">
                {['card', 'paypal', 'applepay'].map((method) => (
                  <label key={method} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      {method === 'card' && <CreditCard className="mr-3" size={24} />}
                      {method === 'paypal' && <span className="mr-3 text-blue-600 font-bold">PayPal</span>}
                      {method === 'applepay' && <span className="mr-3 text-black font-semibold">Apple Pay</span>}
                      <span className="capitalize">{method === 'card' ? 'Credit/Debit Card' : method}</span>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="1234 5678 9012 3456" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">CVV</label>
                      <input 
                        type="text" 
                        placeholder="123" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center text-gray-600 mb-6">
                <Lock size={16} className="mr-2" />
                <span>Your payment is secured with 256-bit SSL encryption</span>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 py-3 rounded-lg font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Review Your Order</h2>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>John Doe</p>
                  <p>123 Main Street</p>
                  <p>New York, NY 10001</p>
                  <p>United States</p>
                  <p>Phone: (555) 123-4567</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 mt-2">Edit</button>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Payment Method</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>Visa ending in 4242</p>
                  <p>John Doe</p>
                  <p>Expires 12/25</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 mt-2">Edit</button>
              </div>

              <div className="flex items-center text-green-600 mb-6">
                <Shield size={20} className="mr-2" />
                <span>Your order is protected by our Buyer Protection policy</span>
              </div>

              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold">
                Place Order
              </button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {orderSummary.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${orderSummary.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold">${orderSummary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p className="mb-2">By placing your order, you agree to our:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Return Policy</li>
              </ul>
            </div>
          </div>

          {/* Need Help */}
          <div className="mt-6 bg-blue-50 rounded-xl p-6">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">Our customer support team is available 24/7</p>
            <div className="space-y-2">
              <p className="font-medium">📞 (555) 123-4567</p>
              <p className="font-medium">✉️ support@mobileshop.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;