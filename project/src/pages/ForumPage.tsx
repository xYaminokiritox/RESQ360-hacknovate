import React from 'react';
import { Forum } from '../components/Forum';

export const ForumPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900/50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Community Forum</h1>
          <p className="text-gray-400 mt-1">
            Share your concerns, report incidents, or seek advice from the community
          </p>
        </div>
        
        <div className="glass-effect p-6 rounded-lg">
          <Forum />
        </div>
      </div>
    </div>
  );
}; 