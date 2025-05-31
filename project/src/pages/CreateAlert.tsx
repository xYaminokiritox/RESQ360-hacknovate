import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { 
 useAuth
  ExclamationTriangleIcon,
  MapPinIcon,
  FireIcon,
  BoltIcon,
  ShieldExclamationIcon,
  CloudIcon,
  UserGroupIcon,
  EyeIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  PencilIcon,
  HandRaisedIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface AlertForm {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: Location;
}

const alertTypes = [
  { id: 'fire', name: 'Fire', icon: FireIcon, color: 'text-red-500' },
  { id: 'medical', name: 'Medical Emergency', icon: ShieldExclamationIcon, color: 'text-blue-500' },
  { id: 'accident', name: 'Accident', icon: BoltIcon, color: 'text-yellow-500' },
  { id: 'flood', name: 'Weather Emergency', icon: CloudIcon, color: 'text-gray-500' },
  { id: 'harassment', name: 'Harassment', icon: HandRaisedIcon, color: 'text-pink-500' },
  { id: 'violence', name: 'Violence', icon: NoSymbolIcon, color: 'text-red-700' },
  { id: 'suspicious', name: 'Suspicious Activity', icon: EyeIcon, color: 'text-amber-500' },
  { id: 'other', name: 'Other Emergency', icon: UserGroupIcon, color: 'text-purple-500' },
];

export const CreateAlert: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<AlertForm>({
    type: '',
    severity: 'medium',
    description: '',
    location: {
      latitude: 0,
      longitude: 0,
      address: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [manualLocation, setManualLocation] = useState({
    latitude: '',
    longitude: '',
    address: ''
  });
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get location from URL params if available
    const locationParam = searchParams.get('location');
    if (locationParam) {
      try {
        const location = JSON.parse(decodeURIComponent(locationParam));
        setFormData(prev => ({ ...prev, location }));
      } catch (error) {
        console.error('Error parsing location:', error);
      }
    } else {
      // Get current location if not provided
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await response.json();
            setFormData(prev => ({
              ...prev,
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                address: data.display_name
              }
            }));
          } catch (error) {
            console.error('Error getting address:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.type) {
        throw new Error('Please select an alert type');
      }
      if (!formData.description) {
        throw new Error('Please provide a description');
      }
      if (!formData.location.latitude || !formData.location.longitude) {
        throw new Error('Please provide a valid location');
      }

      // Transform location format to match Alert interface
      const transformedLocation = {
        lat: formData.location.latitude,
        lng: formData.location.longitude,
        address: formData.location.address || 'Unknown location'
      };

      // Create the alert document with transformed data
      const alertData = {
        type: formData.type as 'fire' | 'flood' | 'accident' | 'medical' | 'other',
        severity: formData.severity,
        description: formData.description,
        location: transformedLocation,
        status: 'active',
        timestamp: new Date(),
        createdAt: new Date(),
        reportedBy: user ? user.uid : 'anonymous', // Use user UID if logged in, otherwise 'anonymous'
        responders: []
      };

      // Try to create alert with a single attempt
      try {
        const docRef = await addDoc(collection(db, 'alerts'), alertData);
        console.log('Alert created with ID:', docRef.id);
        navigate('/dashboard');
      } catch (firebaseError) {
        console.error('Firebase error:', firebaseError);
        throw new Error('Failed to connect to the server. Please check your internet connection and try again.');
      }
    } catch (error) {
      console.error('Error creating alert:', error);
      setError(
        error instanceof Error 
          ? error.message
          : 'Failed to create alert. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationEdit = () => {
    setManualLocation({
      latitude: formData.location.latitude.toString(),
      longitude: formData.location.longitude.toString(),
      address: formData.location.address || ''
    });
    setShowLocationModal(true);
  };

  const handleLocationUpdate = async () => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${manualLocation.latitude}&lon=${manualLocation.longitude}`
      );
      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        location: {
          latitude: parseFloat(manualLocation.latitude),
          longitude: parseFloat(manualLocation.longitude),
          address: data.display_name
        }
      }));
      setShowLocationModal(false);
    } catch (error) {
      console.error('Error updating location:', error);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900/50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-effect p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-6">
            <ExclamationTriangleIcon className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-white">Create Emergency Alert</h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Location Display with Edit Button */}
          {formData.location.address && (
            <div className="mb-6 p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-5 h-5 text-primary" />
                  <span className="text-gray-300">Location: {formData.location.address}</span>
                </div>
                <button
                  onClick={handleLocationEdit}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Location Edit Modal */}
          {showLocationModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="glass-effect p-6 rounded-lg max-w-md w-full mx-4">
                <h2 className="text-xl font-semibold text-white mb-4">Edit Location</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={manualLocation.latitude}
                      onChange={(e) => setManualLocation(prev => ({ ...prev, latitude: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter latitude..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={manualLocation.longitude}
                      onChange={(e) => setManualLocation(prev => ({ ...prev, longitude: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter longitude..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Address (Optional)
                    </label>
                    <input
                      type="text"
                      value={manualLocation.address}
                      onChange={(e) => setManualLocation(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter address..."
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowLocationModal(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLocationUpdate}
                    disabled={isLoadingAddress || !manualLocation.latitude || !manualLocation.longitude}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingAddress ? 'Updating...' : 'Update Location'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Alert Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Alert Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {alertTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        formData.type === type.id
                          ? 'border-primary bg-primary/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto ${type.color} mb-2`} />
                      <span className="text-sm text-white">{type.name}</span>
                    </button>
                  );
                })}
              </div>
              {!formData.type && (
                <p className="mt-2 text-sm text-red-500">Please select an alert type</p>
              )}
            </div>

            {/* Additional Details for Specific Alert Types */}
            {formData.type === 'suspicious' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description of Suspicious Activity
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="Describe the suspicious activity, including any identifying features..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of People Involved
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter number of people..."
                  />
                </div>
              </div>
            )}

            {formData.type === 'safety' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Safety Concern Details
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="Describe the safety concern and any immediate risks..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Immediate Action Required
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select urgency level</option>
                    <option value="immediate">Immediate Response Required</option>
                    <option value="urgent">Urgent - Within 30 minutes</option>
                    <option value="soon">Soon - Within 1 hour</option>
                  </select>
                </div>
              </div>
            )}

            {formData.type === 'harassment' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Incident Details
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="Describe the incident and any identifying information..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Support Required
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-white/20 text-primary focus:ring-primary" />
                      <span className="text-sm text-gray-300">Police assistance</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-white/20 text-primary focus:ring-primary" />
                      <span className="text-sm text-gray-300">Medical support</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-white/20 text-primary focus:ring-primary" />
                      <span className="text-sm text-gray-300">Counseling support</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Default Description Field for Other Types */}
            {!['suspicious', 'safety', 'harassment'].includes(formData.type) && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                  placeholder="Describe the emergency situation..."
                  required
                />
              </div>
            )}

            {/* Severity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Severity Level
              </label>
              <div className="grid grid-cols-4 gap-4">
                {['low', 'medium', 'high', 'critical'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, severity: level as AlertForm['severity'] }))}
                    className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                      formData.severity === level
                        ? 'border-primary bg-primary/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-sm text-white">{level}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.type || !formData.description}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Alert...
                  </span>
                ) : (
                  'Create Alert'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 