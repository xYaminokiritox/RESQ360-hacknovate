import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, ScaleIcon, InformationCircleIcon, BookOpenIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { legalInfoService, LegalInfo } from '../services/legalInfoService';

export const LegalInformation = () => {
  const [legalInfo, setLegalInfo] = useState<LegalInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const loadLegalInfo = async () => {
      try {
        const info = await legalInfoService.getLegalInfo();
        setLegalInfo(info);
      } catch (error) {
        console.error('Failed to load legal information:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLegalInfo();

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
    const searchLegalInfo = async () => {
      if (searchQuery.trim()) {
        const results = await legalInfoService.searchLegalInfo(searchQuery);
        setLegalInfo(results);
      } else {
        const allInfo = await legalInfoService.getLegalInfo();
        setLegalInfo(allInfo);
      }
    };

    const timeoutId = setTimeout(searchLegalInfo, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const filteredInfo = selectedCategory === 'all'
    ? legalInfo
    : legalInfo.filter(info => info.category === selectedCategory);

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
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Legal Rights & Information</h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Know your rights and access important legal information to protect yourself.
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
            You're offline. Showing cached legal information.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Search legal rights and information..."
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
          <option value="police">Police Related</option>
          <option value="workplace">Workplace Rights</option>
          <option value="medical">Medical Rights</option>
          <option value="domestic">Domestic Rights</option>
          <option value="legal">Legal Aid</option>
          <option value="cyber">Cyber Protection</option>
          <option value="property">Property Rights</option>
        </select>
      </div>

      {/* Legal Information Grid */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 gap-6">
          {filteredInfo.map((info, index) => (
            <motion.div
              key={info.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.2,
                delay: index * 0.05,
                ease: "easeOut"
              }}
              className="glass-effect p-6 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ScaleIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {info.title}
                    {info.source && (
                      <span className="inline-flex items-center text-xs bg-primary/20 text-primary rounded-full px-2 py-1">
                        <InformationCircleIcon className="w-4 h-4 mr-1" />
                        {info.source}
                      </span>
                    )}
                  </h3>
                  <p className="text-white/70 mt-1">{info.description}</p>
                  
                  <AnimatePresence>
                    {expandedId === info.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-white/90 bg-white/5 p-4 rounded-lg">
                          {info.details}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => setExpandedId(expandedId === info.id ? null : info.id)}
                    className="mt-4 text-sm text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                  >
                    {expandedId === info.id ? 'Show less' : 'Learn more'}
                  </button>

                  <span className="inline-block px-2 py-1 text-xs bg-primary/20 text-primary rounded-full mt-2">
                    {info.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <AnimatePresence>
        {filteredInfo.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center py-8 text-white/50"
          >
            No legal information found matching your search.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 