import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = ({ userType = 'user' }) => {
  const footerLinks = userType === 'user' ? {
    Shop: ['Smartphones', 'Accessories', 'Tablets', 'Wearables'],
    Help: ['Contact Us', 'Shipping Policy', 'Returns & Exchanges', 'FAQs'],
    Company: ['About Us', 'Careers', 'Terms of Service', 'Privacy Policy']
  } : {
    Admin: ['Dashboard', 'Products', 'Orders', 'Users'],
    Reports: ['Sales', 'Inventory', 'Customers', 'Analytics'],
    Settings: ['Profile', 'Store', 'Payment', 'Shipping']
  };

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-2xl font-bold">MobileShop</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your one-stop destination for the latest smartphones and accessories at the best prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone size={18} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail size={18} />
                <span>support@mobileshop.com</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-400">
                <MapPin size={18} className="mt-1" />
                <span>123 Tech Street, Silicon Valley, CA 94000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MobileShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;