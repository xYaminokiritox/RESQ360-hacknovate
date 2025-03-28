import { openDB } from 'idb';

const DB_NAME = 'resq360-offline';
const DB_VERSION = 2;

export interface LegalInfo {
  id: string;
  title: string;
  description: string;
  category: string;
  details: string;
  source?: string;
}

const DEFAULT_LEGAL_INFO: LegalInfo[] = [
  {
    id: '1',
    title: 'Right to File Zero FIR',
    description: 'You can file an FIR at any police station regardless of jurisdiction',
    category: 'police',
    details: 'A Zero FIR can be filed at any police station regardless of where the incident occurred. The police station will then forward it to the appropriate jurisdiction. This is particularly helpful in cases of emergency or when the crime location is uncertain. The police cannot refuse to file a Zero FIR, and doing so is punishable under law.',
    source: 'Section 154 of CrPC'
  },
  {
    id: '2',
    title: 'Protection Against Workplace Harassment',
    description: 'Legal safeguards against sexual harassment at workplace',
    category: 'workplace',
    details: 'Every organization must have an Internal Complaints Committee (ICC). Employers must provide a safe working environment and display consequences of sexual harassment prominently. Complaints must be resolved within 90 days. The ICC should have a presiding officer who is a woman and at least 50% women members.',
    source: 'Sexual Harassment of Women at Workplace Act, 2013'
  },
  {
    id: '3',
    title: 'Right to Privacy in Examination',
    description: 'Right to be examined by a female doctor',
    category: 'medical',
    details: 'A woman has the right to be examined by a female doctor. In case a female doctor is not available, examination should be done in presence of a female attendant. This applies to all medical examinations, including those required for legal purposes.',
    source: 'Medical Council of India Guidelines'
  },
  {
    id: '4',
    title: 'Right Against Domestic Violence',
    description: 'Protection against physical, emotional, verbal, economic abuse',
    category: 'domestic',
    details: 'Women have the right to protection against any form of domestic violence, including physical, emotional, verbal, economic, and sexual abuse. This includes the right to reside in the shared household, seek protection orders, and claim compensation. The law also provides for immediate relief through Protection Officers.',
    source: 'Protection of Women from Domestic Violence Act, 2005'
  },
  {
    id: '5',
    title: 'Right to Equal Pay',
    description: 'Equal remuneration for equal work',
    category: 'workplace',
    details: 'Employers cannot discriminate in payment of remuneration between men and women workers for the same work or work of similar nature. Any violation can be reported to the labor department. This includes basic pay, allowances, and other monetary benefits.',
    source: 'Equal Remuneration Act, 1976'
  },
  {
    id: '6',
    title: 'Right to Dignity at Police Station',
    description: 'Cannot be called to police station after sunset',
    category: 'police',
    details: 'Women cannot be arrested after sunset and before sunrise. Women also have the right to not be physically present at the police station for interrogation. Police must interrogate women at their residence. A woman police officer must be present during interrogation.',
    source: 'Section 46(4) CrPC'
  },
  {
    id: '7',
    title: 'Maternity Benefits',
    description: 'Right to paid maternity leave and related benefits',
    category: 'workplace',
    details: 'Women are entitled to 26 weeks of paid maternity leave for first two children, and 12 weeks for subsequent children. Additional benefits include work from home options, crèche facilities in establishments with 50+ employees, and protection from dismissal during pregnancy.',
    source: 'Maternity Benefit (Amendment) Act, 2017'
  },
  {
    id: '8',
    title: 'Right to Free Legal Aid',
    description: 'Access to free legal services for protection of rights',
    category: 'legal',
    details: 'Women have the right to free legal aid regardless of their financial status. This includes representation in court, legal advice, and assistance in filing cases. Legal Services Authorities must provide quality legal representation and support.',
    source: 'Legal Services Authorities Act, 1987'
  },
  {
    id: '9',
    title: 'Protection from Cyber Harassment',
    description: 'Legal protection against online harassment and crimes',
    category: 'cyber',
    details: 'Women have legal protection against cyber stalking, harassment, bullying, and non-consensual sharing of private images. Perpetrators can face imprisonment and fines. Victims can report to cyber crime cells or file complaints online.',
    source: 'Information Technology Act, 2000 (Amended 2008)'
  },
  {
    id: '10',
    title: 'Right to Property',
    description: 'Equal rights in ancestral property',
    category: 'property',
    details: 'Women have equal rights in ancestral property as male heirs. They cannot be denied their share in ancestral property and have the right to sell or transfer their share. This applies to both married and unmarried women.',
    source: 'Hindu Succession (Amendment) Act, 2005'
  },
  {
    id: '11',
    title: 'Protection from Dowry',
    description: 'Legal safeguards against dowry demands',
    category: 'domestic',
    details: 'Demanding or giving dowry is a punishable offense. Women can file complaints against dowry demands or harassment. The law provides for imprisonment and fines for offenders. Protection officers must assist in filing complaints.',
    source: 'Dowry Prohibition Act, 1961'
  },
  {
    id: '12',
    title: 'Right to Maintenance',
    description: 'Right to financial support from spouse',
    category: 'domestic',
    details: 'Women have the right to claim maintenance from their spouse during and after marriage. This includes adequate financial support for basic needs and children\'s education. The amount is decided based on the spouse\'s income and standard of living.',
    source: 'Section 125 CrPC'
  },
  {
    id: '13',
    title: 'Medical Termination Rights',
    description: 'Right to safe and legal abortion',
    category: 'medical',
    details: 'Women have the right to safe and legal abortion up to 20 weeks of pregnancy, and up to 24 weeks in special cases. The decision requires consent only from the woman. Medical practitioners must maintain confidentiality.',
    source: 'Medical Termination of Pregnancy Act, 1971 (Amended 2021)'
  },
  {
    id: '14',
    title: 'Protection at Night Workplace',
    description: 'Special provisions for night shift workers',
    category: 'workplace',
    details: 'Women working night shifts must be provided with adequate security, transportation, and other facilities. Employers must ensure safe working conditions and obtain consent for night work. Regular safety audits are mandatory.',
    source: 'Factories Act, 1948'
  },
  {
    id: '15',
    title: 'Right to Dignity in Media',
    description: 'Protection against indecent representation',
    category: 'cyber',
    details: 'Women have protection against indecent representation in any form of media, including digital platforms. This covers advertisements, publications, and social media. Violations are punishable with imprisonment and fines.',
    source: 'Indecent Representation of Women Act, 1986'
  }
];

class LegalInfoService {
  private static instance: LegalInfoService;
  private isOnline: boolean = navigator.onLine;
  private db: any;

  private constructor() {
    this.initializeDB();
    this.setupOnlineOfflineListeners();
  }

  public static getInstance(): LegalInfoService {
    if (!LegalInfoService.instance) {
      LegalInfoService.instance = new LegalInfoService();
    }
    return LegalInfoService.instance;
  }

  private async initializeDB() {
    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('legalInfo')) {
            db.createObjectStore('legalInfo', { keyPath: 'id' });
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
        const tx = this.db.transaction('legalInfo', 'readwrite');
        const store = tx.objectStore('legalInfo');
        
        await Promise.all(DEFAULT_LEGAL_INFO.map(info => store.put(info)));
        await tx.done;
      } catch (error) {
        console.error('Failed to sync data:', error);
      }
    }
  }

  public async getLegalInfo(): Promise<LegalInfo[]> {
    try {
      const tx = this.db.transaction('legalInfo', 'readonly');
      const store = tx.objectStore('legalInfo');
      const info = await store.getAll();
      await tx.done;
      
      if (info.length === 0) {
        return DEFAULT_LEGAL_INFO;
      }
      return info;
    } catch (error) {
      console.error('Failed to get legal information:', error);
      return DEFAULT_LEGAL_INFO;
    }
  }

  public async getLegalInfoByCategory(category: string): Promise<LegalInfo[]> {
    const info = await this.getLegalInfo();
    return info.filter(item => item.category === category);
  }

  public isAppOnline(): boolean {
    return this.isOnline;
  }

  public async searchLegalInfo(query: string): Promise<LegalInfo[]> {
    const info = await this.getLegalInfo();
    const searchQuery = query.toLowerCase();
    return info.filter(item => 
      item.title.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery) ||
      item.details.toLowerCase().includes(searchQuery) ||
      item.category.toLowerCase().includes(searchQuery)
    );
  }
}

export const legalInfoService = LegalInfoService.getInstance(); 