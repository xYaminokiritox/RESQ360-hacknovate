import { openDB } from 'idb';

const DB_NAME = 'resq360-offline';
const DB_VERSION = 1;

interface EmergencyNumber {
  id: string;
  name: string;
  number: string;
  category: string;
}

interface SafetyGuide {
  id: string;
  title: string;
  content: string;
  category: string;
}

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create emergency numbers store
      if (!db.objectStoreNames.contains('emergencyNumbers')) {
        db.createObjectStore('emergencyNumbers', { keyPath: 'id' });
      }
      
      // Create safety guides store
      if (!db.objectStoreNames.contains('safetyGuides')) {
        db.createObjectStore('safetyGuides', { keyPath: 'id' });
      }
    },
  });
};

export const offlineStorage = {
  async saveEmergencyNumbers(numbers: EmergencyNumber[]) {
    const db = await initDB();
    const tx = db.transaction('emergencyNumbers', 'readwrite');
    const store = tx.objectStore('emergencyNumbers');
    
    await Promise.all(numbers.map(number => store.put(number)));
    await tx.done;
  },

  async getEmergencyNumbers(): Promise<EmergencyNumber[]> {
    const db = await initDB();
    return db.getAll('emergencyNumbers');
  },

  async saveSafetyGuides(guides: SafetyGuide[]) {
    const db = await initDB();
    const tx = db.transaction('safetyGuides', 'readwrite');
    const store = tx.objectStore('safetyGuides');
    
    await Promise.all(guides.map(guide => store.put(guide)));
    await tx.done;
  },

  async getSafetyGuides(): Promise<SafetyGuide[]> {
    const db = await initDB();
    return db.getAll('safetyGuides');
  },

  async clearAll() {
    const db = await initDB();
    await db.clear('emergencyNumbers');
    await db.clear('safetyGuides');
  }
}; 