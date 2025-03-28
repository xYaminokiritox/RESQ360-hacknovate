import React from 'react';
import { Alert, AlertFilterType } from '../types/alert';

interface AlertFiltersProps {
  selectedType: AlertFilterType;
  selectedSeverity: Alert['severity'] | 'all';
  onTypeChange: (type: AlertFilterType) => void;
  onSeverityChange: (severity: Alert['severity'] | 'all') => void;
}

const alertTypes: AlertFilterType[] = ['all', 'ghaziabad', 'fire', 'flood', 'accident', 'medical', 'harassment', 'violence', 'suspicious', 'other'];
const severityLevels: (Alert['severity'] | 'all')[] = ['all', 'low', 'medium', 'high', 'critical'];

const typeLabels: Record<AlertFilterType, string> = {
  all: 'All Types',
  ghaziabad: 'Ghaziabad Alerts',
  fire: 'Fire',
  flood: 'Flood',
  accident: 'Accident',
  medical: 'Medical',
  harassment: 'Harassment',
  violence: 'Violence',
  suspicious: 'Suspicious',
  other: 'Other'
};

const severityLabels: Record<Alert['severity'] | 'all', string> = {
  all: 'All Severities',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical'
};

export const AlertFilters: React.FC<AlertFiltersProps> = ({
  selectedType,
  selectedSeverity,
  onTypeChange,
  onSeverityChange
}) => {
  return (
    <div className="glass-effect p-4 rounded-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Alert Type</label>
        <div className="flex flex-wrap gap-2">
          {alertTypes.map((type) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-primary text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {typeLabels[type]}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Severity Level</label>
        <div className="flex flex-wrap gap-2">
          {severityLevels.map((severity) => (
            <button
              key={severity}
              onClick={() => onSeverityChange(severity)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedSeverity === severity
                  ? 'bg-primary text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {severityLabels[severity]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 