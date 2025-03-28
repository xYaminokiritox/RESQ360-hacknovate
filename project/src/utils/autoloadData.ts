import { collection, addDoc, getDocs, Timestamp, query, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Alert } from '../types/alert';

// Default alerts around Ghaziabad
const defaultAlerts: Omit<Alert, 'id'>[] = [
  {
    type: "fire",
    severity: "high",
    location: {
      latitude: 28.6822552,
      longitude: 77.4842057,
      address: "ABESIT Campus, NH-24, Vijay Nagar, Ghaziabad, Uttar Pradesh 201009"
    },
    description: "Fire reported in the computer lab building. Smoke visible from third floor. Fire department notified. All students and staff advised to evacuate immediately using emergency exits.",
    timestamp: new Date(),
    status: "active",
    reportedBy: "security-staff",
    responders: ["fire-dept-ghaziabad", "campus-security"]
  },
  {
    type: "medical",
    severity: "medium",
    location: {
      latitude: 28.6732415,
      longitude: 77.4551254,
      address: "MMH College, Ghaziabad, Uttar Pradesh"
    },
    description: "Student injured during sports event. Medical assistance required. First aid being administered.",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    status: "active",
    reportedBy: "sports-teacher",
    responders: ["medical-team"]
  },
  {
    type: "suspicious",
    severity: "low",
    location: {
      latitude: 28.6639865,
      longitude: 77.4382341,
      address: "Raj Nagar Extension, Ghaziabad, Uttar Pradesh"
    },
    description: "Suspicious person loitering around residential area. Wearing black hoodie and mask.",
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    status: "pending",
    reportedBy: "resident",
    responders: []
  }
];

// Default trusted contacts with specified email
const defaultContacts = [
  {
    name: "Aryan",
    type: "email",
    value: "aryansaini2004feb@gmail.com"
  },
  {
    name: "Ghaziabad Police",
    type: "phone",
    value: "0120-2829783"
  },
  {
    name: "Emergency Contact",
    type: "phone",
    value: "9876543210"
  }
];

/**
 * Adds default alerts to Firestore if none exist
 */
export const loadDefaultAlerts = async () => {
  try {
    // Check if there are any existing alerts
    const alertsQuery = query(collection(db, 'alerts'), limit(1));
    const alertSnapshot = await getDocs(alertsQuery);
    
    // Only add default alerts if none exist
    if (alertSnapshot.empty) {
      const alertsRef = collection(db, 'alerts');
      
      for (const alert of defaultAlerts) {
        // Ensure the location structure is preserved exactly as expected by the Alert type
        // Convert JavaScript Date to Firestore Timestamp
        const firestoreAlert = {
          ...alert,
          timestamp: Timestamp.fromDate(alert.timestamp),
          // Explicitly construct the location object with the correct field names
          location: {
            latitude: alert.location.latitude,
            longitude: alert.location.longitude,
            address: alert.location.address
          }
        };
        
        await addDoc(alertsRef, firestoreAlert);
        console.log(`Added default alert: ${alert.type} at ${alert.location.address}`);
      }
      
      console.log('Default alerts added successfully');
      return true;
    } else {
      console.log('Alerts already exist, not adding defaults');
      return false;
    }
  } catch (error) {
    console.error('Error adding default alerts:', error);
    return false;
  }
};

/**
 * Adds default trusted contacts to Firestore if none exist
 */
export const loadDefaultContacts = async () => {
  try {
    // Check if there are any existing contacts
    const contactsQuery = query(collection(db, 'trustedContacts'), limit(1));
    const contactSnapshot = await getDocs(contactsQuery);
    
    // Only add default contacts if none exist
    if (contactSnapshot.empty) {
      const contactsRef = collection(db, 'trustedContacts');
      
      for (const contact of defaultContacts) {
        await addDoc(contactsRef, contact);
        console.log(`Added default contact: ${contact.name}`);
      }
      
      console.log('Default contacts added successfully');
      return true;
    } else {
      console.log('Contacts already exist, not adding defaults');
      return false;
    }
  } catch (error) {
    console.error('Error adding default contacts:', error);
    return false;
  }
};

/**
 * Loads all default data when the app starts
 */
export const loadAllDefaultData = async () => {
  try {
    const alertsAdded = await loadDefaultAlerts();
    const contactsAdded = await loadDefaultContacts();
    
    return {
      success: true,
      alertsAdded,
      contactsAdded,
      message: 'Default data loaded successfully'
    };
  } catch (error) {
    console.error('Error loading default data:', error);
    return {
      success: false,
      alertsAdded: false,
      contactsAdded: false,
      error
    };
  }
}; 