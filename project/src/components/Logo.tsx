import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <ShieldCheckIcon className="h-8 w-8 text-primary animate-pulse" />
      <span className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
        ResQ360
      </span>
    </div>
  );
};

export default Logo; 