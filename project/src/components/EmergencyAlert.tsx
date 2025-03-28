import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationTriangleIcon, MapPinIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

interface Alert {
  id: string;
  type: 'fire' | 'flood' | 'accident' | 'medical' | 'harassment' | 'violence' | 'suspicious' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
  timestamp: Date;
  status: 'active' | 'resolved' | 'pending';
  reportedBy: string;
  responders: string[];
}

const severityColors = {
  low: 'bg-yellow-500',
  medium: 'bg-orange-500',
  high: 'bg-red-500',
  critical: 'bg-purple-500'
};

const typeIcons = {
  fire: '🔥',
  flood: '🌊',
  accident: '🚗',
  medical: '🏥',
  harassment: '🚫',
  violence: '⚔️',
  suspicious: '👁️',
  other: '⚠️'
};

export const EmergencyAlert: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const alertsRef = collection(db, 'alerts');
    const q = query(
      alertsRef,
      where('status', '==', 'active'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alertsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })) as Alert[];
      setAlerts(alertsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-gray-900 rounded-lg shadow-xl p-4 max-w-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Active Alerts</h3>
              <span className="text-red-500 animate-pulse">
                <ExclamationTriangleIcon className="h-6 w-6" />
              </span>
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`glass-effect p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors ${
                    selectedAlert?.id === alert.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{typeIcons[alert.type]}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white capitalize">{alert.type}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors[alert.severity]}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm mt-1">{alert.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-white/60 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{alert.location.address}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{alert.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 