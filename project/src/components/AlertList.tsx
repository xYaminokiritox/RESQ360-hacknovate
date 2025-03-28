import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert } from '../types/alert';
import { MapPinIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { useVirtualizer } from '@tanstack/react-virtual';

interface AlertListProps {
  alerts: Alert[];
  selectedAlert: Alert | null;
  onAlertSelect: (alert: Alert) => void;
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

// Memoized alert item component
const AlertItem = React.memo<{
  alert: Alert;
  isSelected: boolean;
  onSelect: () => void;
  style?: React.CSSProperties;
}>(({ alert, isSelected, onSelect, style }) => {
  const severityColor = severityColors[alert.severity];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={style}
      className={`p-4 rounded-lg glass-effect cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold capitalize text-white">
            {alert.type}
          </h3>
          <p className="text-sm text-gray-300 mt-1">{alert.description}</p>
          <p className="text-xs text-gray-400 mt-2">
            {alert.location.address}
          </p>
          <p className="text-xs text-gray-400">
            {alert.timestamp.toLocaleString()}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium text-white ${severityColor}`}
        >
          {alert.severity}
        </span>
      </div>
    </motion.div>
  );
});

AlertItem.displayName = 'AlertItem';

export const AlertList: React.FC<AlertListProps> = React.memo(({ alerts, selectedAlert, onAlertSelect }) => {
  // Memoize sorted alerts
  const sortedAlerts = useMemo(() => {
    return [...alerts].sort((a, b) => {
      // Sort by severity
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      
      // Then by timestamp
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  }, [alerts]);

  // Set up virtualization
  const parentRef = React.useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: sortedAlerts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated height of each alert item
    overscan: 5
  });

  if (alerts.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No alerts to display
      </div>
    );
  }

  return (
    <div 
      ref={parentRef}
      className="h-[600px] overflow-y-auto custom-scrollbar"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        <AnimatePresence>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const alert = sortedAlerts[virtualRow.index];
            return (
              <AlertItem
                key={alert.id}
                alert={alert}
                isSelected={selectedAlert?.id === alert.id}
                onSelect={() => onAlertSelect(alert)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}); 