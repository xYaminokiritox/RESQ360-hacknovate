import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { 
  MapPinIcon, 
  ArrowDownTrayIcon, 
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Add declaration for Leaflet.Routing namespace
declare module 'leaflet' {
  namespace Routing {
    function control(options: any): any;
  }
}

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface SavedArea {
  id: string;
  name: string;
  center: [number, number];
  radius: number;
  tiles?: string[];
}

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// Component to update map view when location changes
function SetViewOnLocationFound({ userLocation }: { userLocation: UserLocation | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.latitude, userLocation.longitude], 15);
    }
  }, [userLocation, map]);
  
  return null;
}

// Component for routing between points
function Routing({ start, end }: { start: L.LatLng, end: L.LatLng }) {
  const map = useMap();
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !start || !end) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    // Create routing control
    routingControlRef.current = L.Routing.control({
      waypoints: [start, end],
      routeWhileDragging: false,
      show: false, // Don't show the instructions panel
      createMarker: function() { return null; }, // Don't create markers for waypoints
      lineOptions: {
        styles: [{ color: '#6366F1', weight: 4 }], // Indigo color for the route
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      fitSelectedRoutes: true
    }).addTo(map);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, start, end]);

  return null;
}

export const OfflineMap: React.FC = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [savedAreas, setSavedAreas] = useState<SavedArea[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [newAreaName, setNewAreaName] = useState('');
  const [radius, setRadius] = useState(1000); // 1km default radius
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedArea, setSelectedArea] = useState<SavedArea | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [showAreaList, setShowAreaList] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check network status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load saved areas from localStorage on component mount
  useEffect(() => {
    const loadSavedAreas = () => {
      const savedAreasData = localStorage.getItem('offlineMapAreas');
      if (savedAreasData) {
        try {
          setSavedAreas(JSON.parse(savedAreasData));
        } catch (e) {
          console.error('Error loading saved areas:', e);
        }
      }
    };

    loadSavedAreas();
  }, []);

  // Get user location
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            });
          },
          (error) => {
            console.error('Error getting location:', error);
            setErrorMessage('Unable to get your current location. Please enable location services.');
            setTimeout(() => setErrorMessage(''), 5000);
          },
          { enableHighAccuracy: true }
        );
      } else {
        setErrorMessage('Geolocation is not supported by your browser');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    };

    getUserLocation();
    
    // Set up watchPosition for continuous location updates
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        console.error('Error watching location:', error);
      },
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Function to simulate downloading map tiles for offline use
  const downloadMapArea = (area: SavedArea) => {
    if (isOffline) {
      setErrorMessage('You need to be online to download map areas.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate download completion
    setTimeout(() => {
      clearInterval(interval);
      setDownloadProgress(100);
      
      // Mark area as downloaded by adding placeholder tiles
      const updatedAreas = savedAreas.map(savedArea => 
        savedArea.id === area.id 
          ? { ...savedArea, tiles: ['downloaded'] } 
          : savedArea
      );
      
      setSavedAreas(updatedAreas);
      localStorage.setItem('offlineMapAreas', JSON.stringify(updatedAreas));
      
      setIsDownloading(false);
      setSuccessMessage(`${area.name} has been downloaded for offline use!`);
      setTimeout(() => setSuccessMessage(''), 5000);
    }, 3000);
  };

  // Function to save a new area
  const saveNewArea = () => {
    if (!userLocation) {
      setErrorMessage('Unable to save area. Your location is not available.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    
    if (!newAreaName.trim()) {
      setErrorMessage('Please enter a name for this area.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    
    const newArea: SavedArea = {
      id: Date.now().toString(),
      name: newAreaName,
      center: [userLocation.latitude, userLocation.longitude],
      radius: radius
    };
    
    const updatedAreas = [...savedAreas, newArea];
    setSavedAreas(updatedAreas);
    localStorage.setItem('offlineMapAreas', JSON.stringify(updatedAreas));
    
    setNewAreaName('');
    setShowSaveForm(false);
    setSuccessMessage(`${newArea.name} has been saved!`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  // Function to search for a destination
  const searchLocation = async () => {
    if (!searchQuery.trim()) {
      setErrorMessage('Please enter a location to search for.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    if (isOffline) {
      // When offline, search through downloaded areas
      const matchingAreas = savedAreas.filter(area => 
        area.tiles && // Only search through downloaded areas
        area.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (matchingAreas.length > 0) {
        setSearchResults(matchingAreas);
      } else {
        setErrorMessage('No matching saved areas found. Please download areas when online.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
      return;
    }
    
    // When online, use Nominatim for geocoding
    try {
      setIsSearching(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
      setIsSearching(false);
      
      if (data.length === 0) {
        setErrorMessage('No locations found. Try a different search term.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error searching for location:', error);
      setIsSearching(false);
      setErrorMessage('Error searching for location. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  // Function to set destination from search results
  const setDestinationFromSearch = (result: any) => {
    if (isOffline) {
      // If the result is a saved area
      setDestination([result.center[0], result.center[1]]);
      setSelectedArea(result);
    } else {
      // If the result is from Nominatim
      setDestination([parseFloat(result.lat), parseFloat(result.lon)]);
      setSelectedArea(null);
    }
    setSearchResults([]);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Search and Controls */}
      <div className="glass-effect p-4 z-10 mb-4 rounded-lg">
        <div className="flex flex-col space-y-4">
          {/* Search Bar */}
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search for a location..."
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
                      onClick={() => setDestinationFromSearch(result)}
                    >
                      {isOffline ? result.name : result.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={searchLocation}
              className={`px-4 py-2 ${isSearching ? 'bg-gray-600' : 'bg-primary'} text-white rounded-lg flex items-center space-x-2`}
              disabled={isSearching}
            >
              {isSearching ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <MagnifyingGlassIcon className="w-5 h-5" />
              )}
              <span>Search</span>
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowSaveForm(!showSaveForm)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center space-x-2"
            >
              <MapPinIcon className="w-5 h-5" />
              <span>Save Current Area</span>
            </button>
            
            <button
              onClick={() => setShowAreaList(!showAreaList)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span>Manage Saved Areas</span>
            </button>
            
            {destination && (
              <button
                onClick={() => setDestination(null)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Clear Route
              </button>
            )}

            {isOffline && (
              <div className="px-4 py-2 bg-yellow-600 text-white rounded-lg flex items-center space-x-2">
                <ExclamationCircleIcon className="w-5 h-5" />
                <span>Offline Mode</span>
              </div>
            )}
          </div>

          {/* Save Area Form */}
          {showSaveForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-white/5 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Save Current Area</h3>
              <div className="flex flex-col space-y-4">
                <input
                  type="text"
                  placeholder="Area Name (e.g. ABES Institute of Technology)"
                  className="w-full px-4 py-2 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                />
                
                <div className="flex items-center space-x-4">
                  <label className="text-white">Radius (m):</label>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="100"
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-white w-12 text-right">{radius}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={saveNewArea}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg flex-1"
                  >
                    Save Area
                  </button>
                  <button
                    onClick={() => setShowSaveForm(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Saved Areas List */}
          {showAreaList && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-white/5 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Saved Areas</h3>
              {savedAreas.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {savedAreas.map((area) => (
                    <div key={area.id} className="flex items-center justify-between p-2 bg-white/10 rounded-lg">
                      <div>
                        <span className="text-white font-medium">{area.name}</span>
                        <span className="ml-2 text-sm text-white/60">{area.radius}m radius</span>
                      </div>
                      <div className="flex space-x-2">
                        {!area.tiles && (
                          <button
                            onClick={() => downloadMapArea(area)}
                            className={`px-2 py-1 ${isDownloading ? 'bg-gray-600' : 'bg-blue-600'} text-white rounded-lg text-sm flex items-center space-x-1`}
                            disabled={isDownloading}
                          >
                            {isDownloading ? (
                              <ArrowPathIcon className="w-4 h-4 animate-spin" />
                            ) : (
                              <ArrowDownTrayIcon className="w-4 h-4" />
                            )}
                            <span>Download</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setDestination(area.center);
                            setSelectedArea(area);
                          }}
                          className="px-2 py-1 bg-green-600 text-white rounded-lg text-sm"
                        >
                          Navigate
                        </button>
                        <button
                          onClick={() => {
                            const updatedAreas = savedAreas.filter(a => a.id !== area.id);
                            setSavedAreas(updatedAreas);
                            localStorage.setItem('offlineMapAreas', JSON.stringify(updatedAreas));
                          }}
                          className="px-2 py-1 bg-red-600 text-white rounded-lg text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/70">No areas saved yet. Use the "Save Current Area" button to add one.</p>
              )}
              {isDownloading && (
                <div className="mt-4">
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                  <p className="text-white/70 text-sm mt-1">Downloading map data: {downloadProgress}%</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Status Messages */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-lg flex items-center space-x-2"
            >
              <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-green-500/20 border border-green-500 text-green-200 rounded-lg flex items-center space-x-2"
            >
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {userLocation ? (
          <MapContainer
            center={[userLocation.latitude, userLocation.longitude]}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
            className="rounded-lg overflow-hidden z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <SetViewOnLocationFound userLocation={userLocation} />
            
            {/* User's current location */}
            <Marker position={[userLocation.latitude, userLocation.longitude]}>
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold">Your Location</h3>
                  <p className="text-sm">Lat: {userLocation.latitude.toFixed(6)}</p>
                  <p className="text-sm">Lng: {userLocation.longitude.toFixed(6)}</p>
                  {userLocation.accuracy && (
                    <p className="text-sm">Accuracy: ±{Math.round(userLocation.accuracy)}m</p>
                  )}
                </div>
              </Popup>
            </Marker>
            
            {/* Show all saved areas */}
            {savedAreas.map((area) => (
              <Circle
                key={area.id}
                center={area.center}
                radius={area.radius}
                pathOptions={{
                  color: area.tiles ? '#22c55e' : '#6366F1',
                  fillColor: area.tiles ? '#22c55e' : '#6366F1',
                  fillOpacity: 0.2
                }}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold">{area.name}</h3>
                    <p className="text-sm">Radius: {area.radius}m</p>
                    {area.tiles ? (
                      <p className="text-sm text-green-600">✓ Available offline</p>
                    ) : (
                      <button
                        onClick={() => downloadMapArea(area)}
                        className="mt-2 px-2 py-1 bg-blue-600 text-white rounded-lg text-sm"
                      >
                        Download for offline use
                      </button>
                    )}
                  </div>
                </Popup>
              </Circle>
            ))}
            
            {/* Destination marker */}
            {destination && (
              <Marker position={destination}>
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold">Destination</h3>
                    {selectedArea && <p>{selectedArea.name}</p>}
                    <p className="text-sm">Lat: {destination[0].toFixed(6)}</p>
                    <p className="text-sm">Lng: {destination[1].toFixed(6)}</p>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Routing between current location and destination */}
            {userLocation && destination && (
              <Routing
                start={L.latLng(userLocation.latitude, userLocation.longitude)}
                end={L.latLng(destination[0], destination[1])}
              />
            )}
          </MapContainer>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-800/50 rounded-lg">
            <div className="text-center">
              <MapPinIcon className="h-12 w-12 text-gray-500 mx-auto animate-bounce" />
              <p className="text-gray-400 mt-4">Getting your location...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 