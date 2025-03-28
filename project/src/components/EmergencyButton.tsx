import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';
import { sendEmergencyEmail } from '../services/apiService';
import { Alert } from '../types/alert';
import { 
  BellAlertIcon, 
  XMarkIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

interface TrustedContact {
  id: string;
  name: string;
  type: 'email' | 'phone';
  value: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

interface EmergencyButtonProps {
  userLocation: UserLocation | null;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ userLocation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<{[id: string]: boolean}>({});

  // Fetch trusted contacts
  useEffect(() => {
    if (isModalOpen) {
      const contactsRef = collection(db, 'trustedContacts');
      const unsubscribe = onSnapshot(contactsRef, (snapshot) => {
        const contactsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as TrustedContact[];
        
        setContacts(contactsData);
        
        // Initialize all contacts as selected
        const initialSelected = contactsData.reduce((acc, contact) => {
          acc[contact.id] = true;
          return acc;
        }, {} as {[id: string]: boolean});
        
        setSelectedContacts(initialSelected);
      });

      return () => unsubscribe();
    }
  }, [isModalOpen]);

  const handleEmergency = async () => {
    if (!userLocation) {
      setStatus({
        type: 'error',
        message: 'Cannot send emergency alert without location information'
      });
      return;
    }

    const selectedContactsList = contacts.filter(contact => selectedContacts[contact.id]);
    
    if (selectedContactsList.length === 0) {
      setStatus({
        type: 'error',
        message: 'Please select at least one contact'
      });
      return;
    }

    setIsSending(true);
    setStatus(null);

    try {
      // Prepare location URL for Google Maps
      const mapsUrl = `https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}`;
      
      // Get current date and time
      const timestamp = new Date().toLocaleString();
      
      // Use only email contacts
      const emailContacts = selectedContactsList.filter(contact => contact.type === 'email');
      
      for (const contact of emailContacts) {
        // Prepare alert data
        const alertData: Alert = {
          id: `emergency-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          type: 'other',
          severity: 'critical',
          location: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            address: userLocation.address || 'Unknown location'
          },
          description: message || 'Emergency alert! I need help immediately.',
          timestamp: new Date(),
          status: 'active',
          reportedBy: 'emergency-button',
          responders: []
        };
        
        // Send the alert using the API service
        const result = await sendEmergencyEmail(contact.value, alertData);
        
        if (!result.success) {
          throw new Error(`Failed to send email to ${contact.name}`);
        }
      }
      
      setStatus({
        type: 'success',
        message: 'Emergency alert sent successfully to your trusted contacts!'
      });
      
      // Close modal after a delay if successful
      setTimeout(() => {
        setIsModalOpen(false);
        setStatus(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      setStatus({
        type: 'error',
        message: 'Failed to send emergency alert. Please try again.'
      });
    } finally {
      setIsSending(false);
    }
  };

  const toggleContact = (id: string) => {
    setSelectedContacts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-16 h-16 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center hover:bg-red-700 transition-colors"
      >
        <BellAlertIcon className="w-8 h-8" />
      </motion.button>

      {/* Emergency Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect p-6 rounded-lg max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <BellAlertIcon className="w-8 h-8 text-red-500 mr-3" />
                <h2 className="text-2xl font-bold text-white">Emergency Alert</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-white/90 mb-4">
                This will send an emergency alert with your current location to your trusted contacts.
              </p>
              
              {userLocation ? (
                <div className="bg-white/10 p-3 rounded-lg mb-4">
                  <h3 className="text-white font-semibold mb-1">Your Current Location:</h3>
                  <p className="text-white/80 text-sm">
                    {userLocation.address || `Lat: ${userLocation.latitude}, Lng: ${userLocation.longitude}`}
                  </p>
                </div>
              ) : (
                <div className="bg-red-500/20 p-3 rounded-lg mb-4">
                  <p className="text-red-300 text-sm">
                    Unable to get your location. Please enable location services.
                  </p>
                </div>
              )}

              <textarea
                placeholder="Add details about your emergency (optional)"
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white resize-none h-24 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Contacts Selection */}
            {contacts.length > 0 ? (
              <div className="mb-4">
                <h3 className="text-white font-semibold mb-2">Send Alert To:</h3>
                <div className="max-h-40 overflow-y-auto">
                  {contacts.map(contact => (
                    <div 
                      key={contact.id} 
                      className="flex items-center justify-between p-2 bg-white/5 rounded-lg mb-2"
                    >
                      <div>
                        <span className="text-white">{contact.name}</span>
                        <span className="ml-2 text-white/60 text-sm">
                          {contact.type === 'email' ? contact.value : `+${contact.value}`}
                        </span>
                      </div>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-red-500"
                          checked={!!selectedContacts[contact.id]}
                          onChange={() => toggleContact(contact.id)}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-500/20 p-3 rounded-lg mb-4">
                <p className="text-yellow-300 text-sm">
                  No trusted contacts found. Please add contacts in the Trusted Contacts section.
                </p>
              </div>
            )}

            {/* Status Message */}
            {status && (
              <div className={`p-3 ${status.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'} rounded-lg mb-4 flex items-center`}>
                {status.type === 'success' ? (
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                ) : (
                  <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleEmergency}
                disabled={isSending || !userLocation}
                className={`px-6 py-3 bg-red-600 text-white rounded-lg flex items-center ${
                  isSending || !userLocation ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-700'
                } transition-colors`}
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Emergency Alert'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}; 