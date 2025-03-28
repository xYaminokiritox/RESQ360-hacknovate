import React, { useState, useEffect } from 'react';
import { WifiIcon } from '@heroicons/react/24/outline';

export const InternetStatusCheck: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [latency, setLatency] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Monitor online status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      setLastChecked(new Date());
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Initial check
    checkConnectionQuality();

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const checkConnectionQuality = async () => {
    setIsChecking(true);
    try {
      const startTime = Date.now();
      // Fetch a small resource to test connection quality
      const response = await fetch('https://www.google.com/favicon.ico', {
        mode: 'no-cors',
        cache: 'no-cache'
      });
      const endTime = Date.now();
      setLatency(endTime - startTime);
      setIsOnline(true);
    } catch (error) {
      console.error('Connection test failed:', error);
      setLatency(null);
      setIsOnline(navigator.onLine);
    } finally {
      setLastChecked(new Date());
      setIsChecking(false);
    }
  };

  const getLatencyQuality = () => {
    if (!latency) return 'Unknown';
    if (latency < 100) return 'Excellent';
    if (latency < 300) return 'Good';
    if (latency < 600) return 'Fair';
    return 'Poor';
  };

  const getLatencyColor = () => {
    if (!latency) return 'text-gray-400';
    if (latency < 100) return 'text-green-500';
    if (latency < 300) return 'text-green-400';
    if (latency < 600) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="p-6 glass-effect rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <WifiIcon className="w-6 h-6 mr-2" />
        Internet Connection Status
      </h2>

      {isChecking ? (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          <span className="ml-2">Testing connection...</span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${isOnline ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'}`}>
            <div className="flex items-center">
              <WifiIcon className={`w-5 h-5 mr-2 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
              <span className={isOnline ? 'text-green-500' : 'text-red-500'}>
                {isOnline ? 'Connected to Internet' : 'No Internet Connection'}
              </span>
            </div>
            <p className="mt-2 text-gray-200">
              {isOnline 
                ? `Your device is connected to the internet. Connection quality: ${getLatencyQuality()}.` 
                : 'Your device is currently offline. Please check your network connection.'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Connection Quality:</span>
              <span className={getLatencyColor()}>
                {latency ? `${getLatencyQuality()} (${latency}ms)` : 'Unknown'}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Last Checked:</span>
              <span className="text-white">
                {lastChecked.toLocaleTimeString()}
              </span>
            </div>

            <button 
              onClick={checkConnectionQuality}
              className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
            >
              <WifiIcon className="w-4 h-4 mr-2" />
              Test Connection
            </button>
          </div>

          {!isOnline && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
              <h3 className="font-semibold text-yellow-400">Offline Mode Active</h3>
              <p className="text-sm text-gray-300 mt-1">
                While offline, the AI assistant will use its built-in knowledge but won't have access to the latest information. Some features may be limited.
              </p>
              <div className="mt-3 space-y-1 text-sm text-gray-300">
                <p>Troubleshooting tips:</p>
                <ul className="list-disc list-inside">
                  <li>Check your WiFi or mobile data connection</li>
                  <li>Try moving to an area with better coverage</li>
                  <li>Restart your device's WiFi or mobile data</li>
                  <li>Check if other devices can connect to the internet</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 