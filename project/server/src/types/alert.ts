export interface Alert {
  id: string;
  type: 'fire' | 'flood' | 'earthquake' | 'medical' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  description: string;
  timestamp: Date;
  status: 'active' | 'resolved' | 'in_progress';
  reportedBy: string;
  responders: string[];
  updates?: Array<{
    timestamp: Date;
    message: string;
    updater: string;
  }>;
} 