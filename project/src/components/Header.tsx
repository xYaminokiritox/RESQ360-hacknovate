import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white">
            ResQ360
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-primary' : 'text-white/80 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/alerts"
              className={`text-sm font-medium transition-colors ${
                isActive('/alerts') ? 'text-primary' : 'text-white/80 hover:text-white'
              }`}
            >
              Alerts
            </Link>
            <Link
              to="/login"
              className={`text-sm font-medium transition-colors ${
                isActive('/login') ? 'text-primary' : 'text-white/80 hover:text-white'
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}; 