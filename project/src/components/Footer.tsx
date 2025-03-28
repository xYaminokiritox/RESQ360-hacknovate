import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, PhoneIcon, MapPinIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900/80 backdrop-blur-lg border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-8 w-8 text-primary animate-pulse" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                ResQ360
              </span>
            </div>
            <p className="text-white/70">
              Your personal safety companion, online or offline.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/emergency" className="text-white/70 hover:text-white transition-colors">
                  Emergency Numbers
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-white/70 hover:text-white transition-colors">
                  Legal Rights
                </Link>
              </li>
              <li>
                <Link to="/safe-zones" className="text-white/70 hover:text-white transition-colors">
                  Safe Zones
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="text-white/70 hover:text-white transition-colors">
                  Safety Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-white/70">
                <PhoneIcon className="h-5 w-5 text-primary" />
                <span>24/7 Helpline: 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-center space-x-2 text-white/70">
                <MapPinIcon className="h-5 w-5 text-primary" />
                <span>New Delhi, India</span>
              </li>
              <li className="flex items-center space-x-2 text-white/70">
                <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-primary" />
                <span>support@resq360.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-white/70 mb-4">
              Subscribe to our newsletter for safety tips and updates.
            </p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg text-white transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/70 text-sm">
              © 2024 ResQ360. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-white/70 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white/70 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 