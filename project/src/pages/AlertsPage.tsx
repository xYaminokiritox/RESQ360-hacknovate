import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Alert, AlertFilterType } from '../types/alert';
import { EmergencyAlert } from '../components/EmergencyAlert';
import { AlertMap } from '../components/AlertMap';
import { AlertList } from '../components/AlertList';
import { AlertFilters } from '../components/AlertFilters';
import { addSampleAlerts } from '../utils/testData';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { resetInitializedData } from '../components/DataInitializer';
import { loadAllDefaultData } from '../utils/autoloadData';

const PAGE_SIZE = 20;

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedType, setSelectedType] = useState<AlertFilterType>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<Alert['severity'] | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  // Memoize the initial query
  const initialQuery = useMemo(() => {
    const alertsRef = collection(db, 'alerts');
    return query(
      alertsRef,
      orderBy('timestamp', 'desc'),
      limit(PAGE_SIZE)
    );
  }, []);

  // Load initial data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      const unsubscribe = onSnapshot(initialQuery, 
        (snapshot) => {
          try {
            const alertsData = snapshot.docs.map(doc => {
              const data = doc.data();
              // Convert Firestore timestamp to JavaScript Date
              const timestamp = data.timestamp?.toDate ? 
                data.timestamp.toDate() : 
                (data.timestamp || new Date());
                
              // Make sure the location structure matches our Alert type
              let location = {
                latitude: 0,
                longitude: 0,
                address: 'Unknown location'
              };
              
              if (data.location) {
                location = {
                  latitude: data.location.latitude || data.location.lat || 0,
                  longitude: data.location.longitude || data.location.lng || 0,
                  address: data.location.address || 'Unknown location'
                };
              }

              // Create a properly typed Alert object
              const alert: Alert = {
                id: doc.id,
                type: data.type || 'other',
                severity: data.severity || 'medium',
                location: location,
                description: data.description || '',
                timestamp: timestamp,
                status: data.status || 'active',
                reportedBy: data.reportedBy || 'anonymous',
                responders: data.responders || [],
                updates: data.updates || []
              };
              
              return alert;
            });
            
            console.log('Alerts loaded:', alertsData);
            setAlerts(alertsData);
            if (alertsData.length > 0 && !selectedAlert) {
              setSelectedAlert(alertsData[0]);
            }
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
            setHasMore(snapshot.docs.length === PAGE_SIZE);
            setIsLoading(false);
          } catch (err) {
            console.error("Error processing alerts data:", err);
            setError("Failed to process alerts data");
            setIsLoading(false);
          }
        },
        (err) => {
          console.error("Error fetching alerts:", err);
          setError("Failed to fetch alerts");
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up alerts listener:", err);
      setError("Failed to connect to alerts service");
      setIsLoading(false);
    }
  }, [initialQuery]);

  // Load more data
  const loadMore = useCallback(async () => {
    if (!lastVisible || !hasMore || isLoading) return;

    try {
      setIsLoading(true);
      const alertsRef = collection(db, 'alerts');
      const nextQuery = query(
        alertsRef,
        orderBy('timestamp', 'desc'),
        startAfter(lastVisible),
        limit(PAGE_SIZE)
      );

      const snapshot = await getDocs(nextQuery);
      const newAlerts = snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Firestore timestamp to JavaScript Date
        const timestamp = data.timestamp?.toDate ? 
          data.timestamp.toDate() : 
          (data.timestamp || new Date());
        
        // Make sure the location structure matches our Alert type
        let location = {
          latitude: 0,
          longitude: 0,
          address: 'Unknown location'
        };
        
        if (data.location) {
          location = {
            latitude: data.location.latitude || data.location.lat || 0,
            longitude: data.location.longitude || data.location.lng || 0,
            address: data.location.address || 'Unknown location'
          };
        }

        // Create a properly typed Alert object
        const alert: Alert = {
          id: doc.id,
          type: data.type || 'other',
          severity: data.severity || 'medium',
          location: location,
          description: data.description || '',
          timestamp: timestamp,
          status: data.status || 'active',
          reportedBy: data.reportedBy || 'anonymous',
          responders: data.responders || [],
          updates: data.updates || []
        };
        
        return alert;
      });

      setAlerts(prev => [...prev, ...newAlerts]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error('Error loading more alerts:', error);
      setError('Failed to load more alerts');
    } finally {
      setIsLoading(false);
    }
  }, [lastVisible, hasMore, isLoading]);

  // Memoize filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      // Check if Ghaziabad filter is selected
      if (selectedType === 'ghaziabad') {
        const isInGhaziabad = alert.location.address.toLowerCase().includes('ghaziabad');
        const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
        return isInGhaziabad && matchesSeverity;
      }
      
      // Otherwise use regular type/severity filtering
      const matchesType = selectedType === 'all' || alert.type === selectedType;
      const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
      return matchesType && matchesSeverity;
    });
  }, [alerts, selectedType, selectedSeverity]);

  // Memoize handlers
  const handleAddSampleAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      await addSampleAlerts();
      console.log('Sample alerts added successfully');
    } catch (error) {
      console.error('Error adding sample alerts:', error);
      setError('Failed to add sample alerts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAlertSelect = useCallback((alert: Alert) => {
    setSelectedAlert(alert);
  }, []);

  const handleTypeChange = useCallback((type: AlertFilterType) => {
    setSelectedType(type);
  }, []);

  const handleSeverityChange = useCallback((severity: Alert['severity'] | 'all') => {
    setSelectedSeverity(severity);
  }, []);

  // Add Ghaziabad filter to existing filter options
  const filterOptions = [
    { id: 'all', label: 'All Alerts' },
    { id: 'ghaziabad', label: 'Ghaziabad Alerts' },
    { id: 'fire', label: 'Fire' },
    { id: 'medical', label: 'Medical' },
    { id: 'harassment', label: 'Harassment' },
    { id: 'suspicious', label: 'Suspicious' },
    { id: 'other', label: 'Other' }
  ];

  // Function to reload the page data
  const handleReloadData = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setAlerts([]);
    // Force reload by setting a new "key" for the component 
    // by re-fetching the initial data
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(initialQuery);
        const alertsData = snapshot.docs.map(doc => {
          const data = doc.data();
          // Convert Firestore timestamp to JavaScript Date
          const timestamp = data.timestamp?.toDate ? 
            data.timestamp.toDate() : 
            (data.timestamp || new Date());
          
          // Make sure the location structure matches our Alert type
          let location = {
            latitude: 0,
            longitude: 0,
            address: 'Unknown location'
          };
          
          if (data.location) {
            location = {
              latitude: data.location.latitude || data.location.lat || 0,
              longitude: data.location.longitude || data.location.lng || 0,
              address: data.location.address || 'Unknown location'
            };
          }

          // Create a properly typed Alert object
          const alert: Alert = {
            id: doc.id,
            type: data.type || 'other',
            severity: data.severity || 'medium',
            location: location,
            description: data.description || '',
            timestamp: timestamp,
            status: data.status || 'active',
            reportedBy: data.reportedBy || 'anonymous',
            responders: data.responders || [],
            updates: data.updates || []
          };
          
          return alert;
        });
        
        console.log('Manual reload - Alerts loaded:', alertsData);
        setAlerts(alertsData);
        if (alertsData.length > 0) {
          setSelectedAlert(alertsData[0]);
        }
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === PAGE_SIZE);
      } catch (err) {
        console.error("Error reloading alerts data:", err);
        setError("Failed to reload alerts data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [initialQuery]);

  // Add a function to reset and reload default data
  const handleResetData = useCallback(async () => {
    const confirmed = window.confirm(
      'This will reset all initialization data and reload default alerts. Continue?'
    );
    
    if (confirmed) {
      setIsLoading(true);
      try {
        // Reset the initialization flag
        resetInitializedData();
        
        // Load the default data again
        const result = await loadAllDefaultData();
        console.log('Default data reloaded:', result);
        
        // Then reload the alerts
        handleReloadData();
      } catch (error) {
        console.error('Error resetting data:', error);
        setError('Failed to reset data. Please try again.');
        setIsLoading(false);
      }
    }
  }, [handleReloadData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Emergency Alerts</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleReloadData}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Reload Alerts'}
          </button>
          <button
            onClick={handleAddSampleAlerts}
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding Alerts...' : 'Add Sample Alerts'}
          </button>
          <button
            onClick={handleResetData}
            disabled={isLoading}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Default Data
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-start">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-500 font-medium">{error}</p>
            <p className="text-red-400 text-sm mt-1">
              There might be an issue with loading the alerts data. You can try to reload or add sample alerts.
            </p>
          </div>
          <button
            onClick={handleReloadData}
            className="ml-4 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors"
          >
            Reload Data
          </button>
        </div>
      )}
      
      {!isLoading && alerts.length === 0 && !error && (
        <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500 rounded-lg text-blue-300">
          No alerts found. Click 'Add Sample Alerts' to create test data.
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Map */}
        <div className="lg:col-span-2">
          <div className="glass-effect rounded-lg overflow-hidden h-[600px]">
            <AlertMap
              alerts={filteredAlerts}
              selectedAlert={selectedAlert}
              onAlertSelect={handleAlertSelect}
            />
          </div>
        </div>

        {/* Right Column - Filters and List */}
        <div className="space-y-6">
          <AlertFilters
            selectedType={selectedType}
            selectedSeverity={selectedSeverity}
            onTypeChange={handleTypeChange}
            onSeverityChange={handleSeverityChange}
          />
          
          <AlertList
            alerts={filteredAlerts}
            selectedAlert={selectedAlert}
            onAlertSelect={handleAlertSelect}
          />
          
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-primary/20 text-white rounded-lg hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      </div>

      {/* Emergency Alert Component */}
      <EmergencyAlert />
    </div>
  );
}; 