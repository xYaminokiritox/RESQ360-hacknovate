import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Alert } from '../types/alert';
import { sampleAlerts } from '../data/sampleAlerts';
import { sampleTrustedContacts } from '../data/sampleContacts';
import { sampleForumPosts } from '../data/sampleForumPosts';
import { sampleFireResponse, sampleMedicalResponse } from '../data/sampleResponses';

export const addTestAlert = async (alert: Omit<Alert, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'alerts'), {
      ...alert,
      timestamp: new Date(),
      status: 'active',
      responders: []
    });
    console.log('Test alert added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding test alert:', error);
    throw error;
  }
};

/**
 * Add sample alerts to Firestore for testing
 * @returns Promise that resolves when all alerts are added
 */
export const addSampleAlerts = async () => {
  const alertsRef = collection(db, 'alerts');
  
  for (const alert of sampleAlerts) {
    // Ensure location structure is correct and convert JavaScript Date to Firestore Timestamp
    const firestoreAlert = {
      ...alert,
      timestamp: Timestamp.fromDate(alert.timestamp),
      // Explicitly ensure location has proper structure
      location: {
        latitude: alert.location.latitude,
        longitude: alert.location.longitude,
        address: alert.location.address
      }
    };
    
    try {
      await addDoc(alertsRef, firestoreAlert);
      console.log(`Added alert: ${alert.id}`);
    } catch (error) {
      console.error(`Error adding alert ${alert.id}:`, error);
    }
  }
  
  return { success: true, message: `Added ${sampleAlerts.length} sample alerts` };
};

/**
 * Add sample trusted contacts to Firestore for testing
 * @returns Promise that resolves when all contacts are added
 */
export const addSampleContacts = async () => {
  const contactsRef = collection(db, 'trustedContacts');
  
  for (const contact of sampleTrustedContacts) {
    try {
      await addDoc(contactsRef, contact);
      console.log(`Added contact: ${contact.name}`);
    } catch (error) {
      console.error(`Error adding contact ${contact.name}:`, error);
    }
  }
  
  return { success: true, message: `Added ${sampleTrustedContacts.length} sample contacts` };
};

/**
 * Add sample forum posts to Firestore for testing
 * @returns Promise that resolves when all posts are added
 */
export const addSampleForumPosts = async () => {
  const postsRef = collection(db, 'forumPosts');
  
  for (const post of sampleForumPosts) {
    // Ensure location structure is correct if it exists
    const firestorePost = {
      ...post,
      timestamp: Timestamp.fromDate(post.timestamp),
      comments: post.comments.map(comment => ({
        ...comment,
        timestamp: Timestamp.fromDate(comment.timestamp)
      })),
      // If location exists, make sure it has the right structure
      location: post.location ? {
        latitude: post.location.latitude,
        longitude: post.location.longitude,
        address: post.location.address
      } : undefined
    };
    
    try {
      await addDoc(postsRef, firestorePost);
      console.log(`Added forum post: ${post.title}`);
    } catch (error) {
      console.error(`Error adding forum post ${post.title}:`, error);
    }
  }
  
  return { success: true, message: `Added ${sampleForumPosts.length} sample forum posts` };
};

/**
 * Add sample emergency responses to Firestore for testing
 * @returns Promise that resolves when all responses are added
 */
export const addSampleResponses = async () => {
  const responsesRef = collection(db, 'emergencyResponses');
  
  const responses = [sampleFireResponse, sampleMedicalResponse];
  
  for (const response of responses) {
    // Convert JavaScript Dates to Firestore Timestamps
    const firestoreResponse = {
      ...response,
      updates: response.updates.map(update => ({
        ...update,
        timestamp: Timestamp.fromDate(update.timestamp)
      }))
    };
    
    try {
      await addDoc(responsesRef, firestoreResponse);
      console.log(`Added emergency response for alert: ${response.alertId}`);
    } catch (error) {
      console.error(`Error adding emergency response for ${response.alertId}:`, error);
    }
  }
  
  return { success: true, message: `Added ${responses.length} sample emergency responses` };
};

/**
 * Add all sample data to Firestore for testing
 * @returns Promise that resolves when all data is added
 */
export const addAllSampleData = async () => {
  try {
    await addSampleAlerts();
    await addSampleContacts();
    await addSampleForumPosts();
    await addSampleResponses();
    return { success: true, message: 'All sample data added successfully' };
  } catch (error) {
    console.error('Error adding sample data:', error);
    return { success: false, error };
  }
}; 