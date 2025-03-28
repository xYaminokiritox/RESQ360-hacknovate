import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Alert } from '../types/alert';
import MarkerClusterGroup from 'react-leaflet-cluster';

interface AlertMapProps {
  alerts: Alert[];
  selectedAlert?: Alert | null;
  onAlertSelect: (alert: Alert) => void;
}

// Move icon creation outside component to prevent recreation
const createCustomIcon = (type: Alert['type']) => {
  // Define a mapping for all possible alert types to icon paths
  const iconUrl = {
    fire: '/icons/fire.svg',
    flood: '/icons/flood.svg',
    accident: '/icons/accident.svg',
    medical: '/icons/medical.svg',
    harassment: '/icons/harassment.svg',
    violence: '/icons/violence.svg',
    suspicious: '/icons/suspicious.svg',
    other: '/icons/other.svg',
    // Add fallback for any unknown type
  }[type] || '/icons/alert.svg'; // Use a default icon if type not found

  return L.icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Cache icons
const iconCache: Record<string, L.Icon> = {};
const getCustomIcon = (type: Alert['type']) => {
  if (!iconCache[type]) {
    iconCache[type] = createCustomIcon(type);
  }
  return iconCache[type];
};

// Memoized MapUpdater component
const MapUpdater = React.memo<{ selectedAlert: Alert | null }>(({ selectedAlert }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedAlert && selectedAlert.location) {
      console.log("Centering map on alert:", selectedAlert.id, selectedAlert.location);
      map.setView(
        [selectedAlert.location.latitude, selectedAlert.location.longitude],
        15
      );
    }
  }, [selectedAlert, map]);

  return null;
});

MapUpdater.displayName = 'MapUpdater';

// Memoized Marker component
const AlertMarker = React.memo<{
  alert: Alert;
  onSelect: (alert: Alert) => void;
}>(({ alert, onSelect }) => {
  console.log("Rendering marker for alert:", alert.id, alert.location);
  return (
    <Marker
      position={[alert.location.latitude, alert.location.longitude]}
      icon={getCustomIcon(alert.type)}
      eventHandlers={{
        click: () => onSelect(alert)
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-bold capitalize">{alert.type}</h3>
          <p className="text-sm">{alert.description}</p>
          <p className="text-xs text-gray-500 mt-1">
            {alert.timestamp.toLocaleString()}
          </p>
        </div>
      </Popup>
    </Marker>
  );
});

AlertMarker.displayName = 'AlertMarker';

export const AlertMap: React.FC<AlertMapProps> = React.memo(({ alerts, selectedAlert, onAlertSelect }) => {
  const defaultCenter: [number, number] = [28.6, 77.2]; // Delhi area as default
  const defaultZoom = 10;
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Memoize event handler
  const handleMarkerClick = useCallback((alert: Alert) => {
    console.log("Alert clicked:", alert.id);
    onAlertSelect(alert);
  }, [onAlertSelect]);

  // Memoize markers with validation
  const visibleMarkers = useMemo(() => {
    if (!isMapLoaded) return [];
    
    console.log("Preparing markers for alerts:", alerts.length);
    
    // Filter out any alerts without valid lat/lng coordinates
    return alerts
      .filter(alert => {
        const isValid = 
          alert && 
          alert.location && 
          typeof alert.location.latitude === 'number' && 
          typeof alert.location.longitude === 'number' &&
          !isNaN(alert.location.latitude) &&
          !isNaN(alert.location.longitude);
          
        if (!isValid) {
          console.warn("Invalid alert location:", alert);
        }
        
        return isValid;
      })
      .slice(0, 50); // Only show first 50 markers initially
  }, [alerts, isMapLoaded]);

  // Use the first valid alert's location as center if available
  const initialCenter = useMemo(() => {
    if (selectedAlert && selectedAlert.location) {
      return [selectedAlert.location.latitude, selectedAlert.location.longitude] as [number, number];
    }
    
    if (visibleMarkers.length > 0) {
      return [visibleMarkers[0].location.latitude, visibleMarkers[0].location.longitude] as [number, number];
    }
    
    return defaultCenter;
  }, [selectedAlert, visibleMarkers, defaultCenter]);

  // Debug output
  useEffect(() => {
    console.log("Map component rendering with:", {
      alertCount: alerts.length,
      visibleMarkers: visibleMarkers.length,
      selectedAlert: selectedAlert?.id,
      initialCenter
    });
  }, [alerts.length, visibleMarkers.length, selectedAlert, initialCenter]);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden">
      <MapContainer
        center={initialCenter}
        zoom={selectedAlert ? 13 : defaultZoom}
        className="w-full h-full"
        scrollWheelZoom={true}
        minZoom={2}
        maxBoundsViscosity={1.0}
        whenReady={() => {
          console.log("Map is ready");
          setIsMapLoaded(true);
        }}
      >
        <MapUpdater selectedAlert={selectedAlert || null} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
          disableClusteringAtZoom={15}
        >
          {visibleMarkers.map((alert) => (
            <AlertMarker
              key={alert.id}
              alert={alert}
              onSelect={handleMarkerClick}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}); 