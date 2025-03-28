import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { emergencyService, EmergencyNumber } from '../services/emergencyService';

export const EmergencyNumbers: React.FC = () => {
  const [numbers, setNumbers] = useState<EmergencyNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const loadNumbers = async () => {
      try {
        const emergencyNumbers = await emergencyService.getEmergencyNumbers();
        setNumbers(emergencyNumbers);
      } catch (error) {
        console.error('Failed to load emergency numbers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNumbers();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const searchNumbers = async () => {
      if (searchQuery.trim()) {
        const results = await emergencyService.searchEmergencyNumbers(searchQuery);
        setNumbers(results);
      } else {
        const allNumbers = await emergencyService.getEmergencyNumbers();
        setNumbers(allNumbers);
      }
    };

    const timeoutId = setTimeout(searchNumbers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const filteredNumbers = selectedCategory === 'all'
    ? numbers
    : numbers.filter(number => number.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Emergency Numbers</h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Quick access to emergency contacts and helplines. Save these numbers for immediate assistance.
        </p>
      </motion.div>

      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-yellow-500 mb-6"
          >
            You're offline. Showing cached emergency numbers.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Search emergency numbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
        >
          <option value="all">All Categories</option>
          <option value="emergency">Emergency Services</option>
          <option value="helpline">Helplines</option>
        </select>
      </div>

      {/* Emergency Numbers Grid */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNumbers.map((number, index) => (
            <motion.div
              key={number.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.2,
                delay: index * 0.05,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.02 }}
              className="glass-effect p-6 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{number.name}</h3>
                  <a
                    href={`tel:${number.number}`}
                    className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors block"
                  >
                    {number.number}
                  </a>
                  {number.description && (
                    <p className="text-sm text-white/70 mt-2">{number.description}</p>
                  )}
                  <span className="inline-block px-2 py-1 text-xs bg-primary/20 text-primary rounded-full mt-2">
                    {number.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <AnimatePresence>
        {filteredNumbers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center py-8 text-white/50"
          >
            No emergency numbers found matching your search.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 