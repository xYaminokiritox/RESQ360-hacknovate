import { useEffect, useState } from 'react';
import { loadAllDefaultData } from '../utils/autoloadData';

// Add this function at the module level to be accessible from anywhere
export const resetInitializedData = () => {
  localStorage.removeItem('resq360_data_initialized');
  console.log('RESQ360 data initialization has been reset');
  return true;
};

export const DataInitializer: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if data has been initialized before
    const hasDataBeenInitialized = localStorage.getItem('resq360_data_initialized');
    
    if (!hasDataBeenInitialized) {
      const initializeData = async () => {
        try {
          console.log('Starting default data initialization...');
          const result = await loadAllDefaultData();
          console.log('Default data initialization result:', result);
          
          // If successful, store in localStorage so we don't initialize again
          if (result.success) {
            localStorage.setItem('resq360_data_initialized', 'true');
            setIsInitialized(true);
          }
        } catch (error) {
          console.error('Error initializing default data:', error);
        }
      };
      
      initializeData();
    } else {
      console.log('Data was previously initialized, skipping initialization');
      setIsInitialized(true);
    }
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default DataInitializer; 