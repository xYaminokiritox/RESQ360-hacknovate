export interface Alert {
  id: string;
  type: 'fire' | 'flood' | 'accident' | 'medical' | 'other' | 'harassment' | 'violence' | 'suspicious';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  description: string;
  timestamp: Date;
  status: 'active' | 'resolved' | 'pending';
  reportedBy: string;
  responders: string[];
  updates?: {
    timestamp: Date;
    message: string;
    updatedBy: string;
  }[];
}

// Custom filter type that includes location-based filters
export type AlertFilterType = Alert['type'] | 'all' | 'ghaziabad';

export interface TrustedContact {
  id: string;
  name: string;
  type: 'email' | 'phone';
  value: string;
}

// Forum post type definition
export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string; // Will be anonymous if user chooses
  authorName: string; // Can be "Anonymous"
  isAnonymous: boolean;
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  tags: string[];
  likes: number;
  comments: ForumComment[];
}

export interface ForumComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string; // Can be "Anonymous"
  isAnonymous: boolean;
  timestamp: Date;
  likes: number;
} 