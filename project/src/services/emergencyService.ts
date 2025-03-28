import { openDB } from 'idb';

const DB_NAME = 'resq360-offline';
const DB_VERSION = 1;

export interface EmergencyNumber {
  id: string;
  name: string;
  number: string;
  category: string;
  description?: string;
}

const DEFAULT_EMERGENCY_NUMBERS: EmergencyNumber[] = [
  {
    id: '1',
    name: 'Police Control Room',
    number: '100',
    description: 'For immediate police assistance and emergencies',
    category: 'police'
  },
  {
    id: '2',
    name: 'Women Helpline',
    number: '1091',
    description: 'National helpline for women in distress',
    category: 'women'
  },
  {
    id: '3',
    name: 'Ambulance',
    number: '102',
    description: 'Emergency medical services',
    category: 'medical'
  },
  {
    id: '4',
    name: 'Domestic Violence Helpline',
    number: '181',
    description: 'Support for victims of domestic violence',
    category: 'women'
  },
  {
    id: '5',
    name: 'Fire Emergency',
    number: '101',
    description: 'Fire brigade and rescue services',
    category: 'emergency'
  },
  {
    id: '6',
    name: 'National Emergency Number',
    number: '112',
    description: 'Unified emergency response system',
    category: 'emergency'
  },
  {
    id: '7',
    name: 'Women Police Helpline',
    number: '1090',
    description: 'Direct connection to women police officers',
    category: 'women'
  },
  {
    id: '8',
    name: 'Anti-Stalking Helpline',
    number: '1096',
    description: 'Report stalking and harassment cases',
    category: 'women'
  },
  {
    id: '9',
    name: 'Student/Child Helpline',
    number: '1098',
    description: 'Support for children in distress',
    category: 'children'
  },
  {
    id: '10',
    name: 'Senior Citizen Helpline',
    number: '1291',
    description: 'Emergency assistance for senior citizens',
    category: 'elderly'
  },
  {
    id: '11',
    name: 'Railway Protection',
    number: '1512',
    description: 'Security helpline for railway premises',
    category: 'transport'
  },
  {
    id: '12',
    name: 'Cyber Crime Helpline',
    number: '155620',
    description: 'Report cyber crimes and online harassment',
    category: 'cyber'
  },
  {
    id: '13',
    name: 'National Human Rights Commission',
    number: '1800-180-1571',
    description: 'Report human rights violations',
    category: 'rights'
  },
  {
    id: '14',
    name: 'Tourist Police',
    number: '1363',
    description: 'Emergency assistance for tourists',
    category: 'tourist'
  },
  {
    id: '15',
    name: 'Anti-Poison',
    number: '1066',
    description: 'Emergency poison control center',
    category: 'medical'
  },
  {
    id: '16',
    name: 'Road Accident Emergency',
    number: '1073',
    description: 'Highway patrol and accident response',
    category: 'transport'
  },
  {
    id: '17',
    name: 'AIDS Helpline',
    number: '1097',
    description: 'AIDS healthcare and counseling',
    category: 'medical'
  },
  {
    id: '18',
    name: 'Mental Health Helpline',
    number: '1800-599-0019',
    description: 'Mental health support and counseling',
    category: 'medical'
  },
  {
    id: '19',
    name: 'Missing Children and Women',
    number: '1094',
    description: 'Report missing persons cases',
    category: 'women'
  },
  {
    id: '20',
    name: 'National Investigation Agency',
    number: '1800-11-1363',
    description: 'Report terrorism and national security threats',
    category: 'security'
  }
];

class EmergencyService {
  private static instance: EmergencyService;
  private isOnline: boolean = navigator.onLine;
  private db: any;

  private constructor() {
    this.initializeDB();
    this.setupOnlineOfflineListeners();
  }

  public static getInstance(): EmergencyService {
    if (!EmergencyService.instance) {
      EmergencyService.instance = new EmergencyService();
    }
    return EmergencyService.instance;
  }

  private async initializeDB() {
    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('emergencyNumbers')) {
            db.createObjectStore('emergencyNumbers', { keyPath: 'id' });
          }
        },
      });
      await this.syncData();
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }

  private setupOnlineOfflineListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private async syncData() {
    if (this.isOnline) {
      try {
        const tx = this.db.transaction('emergencyNumbers', 'readwrite');
        const store = tx.objectStore('emergencyNumbers');
        
        await Promise.all(DEFAULT_EMERGENCY_NUMBERS.map(number => store.put(number)));
        await tx.done;
      } catch (error) {
        console.error('Failed to sync data:', error);
      }
    }
  }

  public async getEmergencyNumbers(): Promise<EmergencyNumber[]> {
    try {
      const tx = this.db.transaction('emergencyNumbers', 'readonly');
      const store = tx.objectStore('emergencyNumbers');
      const numbers = await store.getAll();
      await tx.done;
      
      if (numbers.length === 0) {
        return DEFAULT_EMERGENCY_NUMBERS;
      }
      return numbers;
    } catch (error) {
      console.error('Failed to get emergency numbers:', error);
      return DEFAULT_EMERGENCY_NUMBERS;
    }
  }

  public async getEmergencyNumbersByCategory(category: string): Promise<EmergencyNumber[]> {
    const numbers = await this.getEmergencyNumbers();
    return numbers.filter(number => number.category === category);
  }

  public isAppOnline(): boolean {
    return this.isOnline;
  }

  public async searchEmergencyNumbers(query: string): Promise<EmergencyNumber[]> {
    const numbers = await this.getEmergencyNumbers();
    const searchQuery = query.toLowerCase();
    return numbers.filter(number => 
      number.name.toLowerCase().includes(searchQuery) ||
      number.number.includes(searchQuery) ||
      number.description?.toLowerCase().includes(searchQuery)
    );
  }
}

export const emergencyService = EmergencyService.getInstance(); 