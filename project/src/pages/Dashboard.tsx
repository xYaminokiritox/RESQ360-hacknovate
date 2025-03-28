import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Alert } from '../types/alert';
import { Link, useLocation } from 'react-router-dom';
import { TrustedList } from '../components/TrustedList';
import { GeminiChatbot } from '../components/GeminiChatbot';
import { InternetStatusCheck } from '../components/InternetStatusCheck';
import { EmergencyButton } from '../components/EmergencyButton';
import { 
  FireIcon, 
  ExclamationTriangleIcon, 
  MapIcon, 
  BellIcon,
  ChartBarIcon,
  UserGroupIcon,
  ArrowRightIcon,
  UserIcon,
  MapPinIcon,
  SparklesIcon,
  WifiIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  AcademicCapIcon,
  CubeIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';

interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export const Dashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [showAlertPrompt, setShowAlertPrompt] = useState(false);
  const [showInternetStatus, setShowInternetStatus] = useState(false);
  const [showPreloadedNotice, setShowPreloadedNotice] = useState(true);
  const location = useLocation();

  // Handle location detection
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });

        // Get address from coordinates using reverse geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        );
        const data = await response.json();
        
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: data.display_name
        });
        
        // Show alert prompt after getting location
        setShowAlertPrompt(true);
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    if (showLocationPrompt) {
      detectLocation();
    }
  }, [showLocationPrompt]);

  // Handle hash navigation
  useEffect(() => {
    if (location.hash === '#trusted-contacts') {
      const element = document.getElementById('trusted-contacts');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]);

  // Fetch active alerts
  useEffect(() => {
    const alertsRef = collection(db, 'alerts');
    const q = query(
      alertsRef,
      where('status', '==', 'active'),
      where('severity', 'in', ['high', 'critical'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alertsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as Alert[];
      
      setAlerts(alertsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
    const highAlerts = alerts.filter(a => a.severity === 'high').length;
    const totalAlerts = alerts.length;

    return {
      criticalAlerts,
      highAlerts,
      totalAlerts
    };
  }, [alerts]);

  const quickActions = [
    {
      title: 'Emergency SOS',
      description: 'Send emergency alert to trusted contacts',
      icon: <BellAlertIcon className="w-6 h-6" />,
      link: '#',
      color: 'bg-red-600',
      onClick: () => document.getElementById('emergency-sos-button')?.click()
    },
    {
      title: 'View Alerts',
      description: 'See all emergency alerts and their locations',
      icon: <MapIcon className="w-6 h-6" />,
      link: '/alerts',
      color: 'bg-blue-500'
    },
    {
      title: 'Create Alert',
      description: 'Report a new emergency situation',
      icon: <ExclamationTriangleIcon className="w-6 h-6" />,
      link: '/alerts/new',
      color: 'bg-red-500'
    },
    {
      title: 'Community Forum',
      description: 'Discuss & share anonymously with others',
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      link: '/forum',
      color: 'bg-indigo-500'
    },
    {
      title: 'AI Assistant',
      description: 'Get help from our Gemini-powered AI',
      icon: <SparklesIcon className="w-6 h-6" />,
      link: '#',
      color: 'bg-purple-500',
      onClick: () => document.getElementById('gemini-chat-button')?.click()
    },
    {
      title: 'About ResQ360',
      description: 'Learn about all app features and functionality',
      icon: <InformationCircleIcon className="w-6 h-6" />,
      link: '/about',
      color: 'bg-emerald-500'
    },
    {
      title: 'Our Goals',
      description: 'Explore our mission, innovation, and solutions',
      icon: <AcademicCapIcon className="w-6 h-6" />,
      link: '/our-goals',
      color: 'bg-indigo-500'
    },
    {
      title: 'Tech Stack',
      description: 'Discover the technologies powering our platform',
      icon: <CubeIcon className="w-6 h-6" />,
      link: '/tech-stack',
      color: 'bg-purple-500'
    },
    {
      title: 'Statistics',
      description: 'View emergency response analytics',
      icon: <ChartBarIcon className="w-6 h-6" />,
      link: '/stats',
      color: 'bg-green-500'
    },
    {
      title: 'Trusted Contacts',
      description: 'Manage trusted emergency contacts',
      icon: <UserIcon className="w-6 h-6" />,
      link: '/dashboard#trusted-contacts',
      color: 'bg-yellow-500'
    }
  ];

  const handleLocationPermission = (allowed: boolean) => {
    setShowLocationPrompt(false);
    if (allowed) {
      // Location permission was granted, location detection will continue
      setShowAlertPrompt(true);
    }
  };

  const handleCreateAlert = () => {
    // Navigate to create alert page with location data
    const locationData = encodeURIComponent(JSON.stringify(userLocation));
    window.location.href = `/alerts/new?location=${locationData}`;
  };

  // Add useEffect to hide notification after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloadedNotice(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900/50">
      {/* Location Permission Prompt */}
      {showLocationPrompt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="glass-effect p-8 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-6">
              <MapPinIcon className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-white">Enable Location Services</h2>
            </div>
            <p className="text-gray-300 mb-6">
              To provide you with relevant emergency alerts and services, we need access to your location.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleLocationPermission(true)}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Allow Location
              </button>
              <button
                onClick={() => handleLocationPermission(false)}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Prompt */}
      {showAlertPrompt && userLocation && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="glass-effect p-6 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-center space-x-3 mb-4">
              <MapPinIcon className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-white">Your Location</h3>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              {userLocation.address}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleCreateAlert}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Alert
              </button>
              <button
                onClick={() => setShowAlertPrompt(false)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Monitor and manage emergency alerts</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              onClick={() => setShowInternetStatus(!showInternetStatus)}
            >
              <WifiIcon className="w-5 h-5 mr-2" />
              Internet Status
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              <BellIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Internet Status Check */}
        {showInternetStatus && (
          <div className="mb-8">
            <InternetStatusCheck />
          </div>
        )}

        {/* Emergency Alert Banner */}
        {stats.criticalAlerts > 0 && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FireIcon className="w-6 h-6 text-red-500" />
                <span className="text-red-500 font-semibold">
                  {stats.criticalAlerts} Critical Alert{stats.criticalAlerts > 1 ? 's' : ''} Active
                </span>
              </div>
              <Link to="/alerts" className="text-red-500 hover:text-red-400 flex items-center space-x-1">
                <span>View Alerts</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-effect p-6 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <FireIcon className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Critical Alerts</h3>
                <p className="text-2xl font-bold text-red-500">{stats.criticalAlerts}</p>
              </div>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">High Priority</h3>
                <p className="text-2xl font-bold text-orange-500">{stats.highAlerts}</p>
              </div>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <MapIcon className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Total Alerts</h3>
                <p className="text-2xl font-bold text-blue-500">{stats.totalAlerts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {quickActions.map((action) => (
            <div
              key={action.title}
              className="glass-effect p-6 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => {
                if (action.onClick) {
                  action.onClick();
                } else if (action.link) {
                  window.location.href = action.link;
                }
              }}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 ${action.color}/20 rounded-lg`}>
                  {action.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{action.title}</h3>
                  <p className="text-sm text-gray-400">{action.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trusted Contacts Section */}
        <div id="trusted-contacts" className="mb-8">
          <TrustedList />
        </div>

        {/* Recent Critical Alerts */}
        {stats.criticalAlerts > 0 && (
          <div className="glass-effect p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Recent Critical Alerts</h2>
              <Link to="/alerts" className="text-primary hover:text-primary/80 flex items-center space-x-1">
                <span>View All</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {alerts
                .filter(alert => alert.severity === 'critical')
                .slice(0, 3)
                .map(alert => (
                  <div key={alert.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white capitalize">{alert.type}</h3>
                        <p className="text-sm text-gray-400">{alert.location.address}</p>
                      </div>
                      <span className="px-2 py-1 bg-red-500/20 text-red-500 text-xs font-medium rounded">
                        Critical
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-2">{alert.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {alert.timestamp.toLocaleString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Preloaded data notification */}
        {showPreloadedNotice && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-start">
            <div className="flex-shrink-0 text-green-400 mt-0.5 mr-3">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-green-300 font-medium">Sample data loaded</p>
              <p className="text-green-300/80 text-sm mt-1">
                We've preloaded some sample alerts around Ghaziabad and added a trusted contact (aryansaini2004feb@gmail.com) for demonstration purposes.
              </p>
            </div>
            <button 
              onClick={() => setShowPreloadedNotice(false)}
              className="ml-auto flex-shrink-0 text-green-400 hover:text-green-300"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Add Gemini Chatbot component */}
      <GeminiChatbot />
      
      {/* Add Emergency Button */}
      <div id="emergency-sos-button">
        <EmergencyButton userLocation={userLocation} />
      </div>
    </div>
  );
}; 