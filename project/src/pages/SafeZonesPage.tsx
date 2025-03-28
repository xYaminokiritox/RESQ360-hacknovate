import React from 'react';
import { motion } from 'framer-motion';
import { OfflineMap } from '../components/OfflineMap';
import { MapPinIcon, WifiIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export const SafeZonesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Offline Safe Zones</h1>
          <p className="text-white/80 max-w-3xl">
            Save areas around important locations like ABES Institute of Technology for offline navigation. 
            Even without internet, you can find your way to safety.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-effect p-6 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <MapPinIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Save Locations</h3>
                <p className="text-sm text-white/70">Mark important areas for quick access later</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-effect p-6 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <ArrowDownTrayIcon className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Download Maps</h3>
                <p className="text-sm text-white/70">Store map data for offline navigation</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-effect p-6 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <WifiIcon className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Offline Routing</h3>
                <p className="text-sm text-white/70">Find routes without internet connection</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-effect rounded-xl overflow-hidden"
          style={{ height: "calc(100vh - 300px)", minHeight: "500px" }}
        >
          <OfflineMap />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-2">How to use offline maps:</h3>
          <ol className="list-decimal list-inside text-white/80 space-y-2 ml-4">
            <li>Save areas around important locations like your campus or neighborhood</li>
            <li>Download map data for those areas while you have internet connection</li>
            <li>When offline, you can search saved locations and get directions</li>
            <li>The routing will work without internet using pre-downloaded map data</li>
          </ol>
        </motion.div>
      </div>
    </div>
  );
}; 