import { legalInfoService } from './legalInfoService';
import { emergencyService } from './emergencyService';

interface ChatResponse {
  text: string;
  type: 'bot' | 'error' | 'suggestion';
  suggestions?: string[];
  links?: ServiceLink[];
}

interface ServiceLink {
  title: string;
  url: string;
  description: string;
  number?: string;
}

interface QuestionPattern {
  patterns: string[];
  response: string;
  suggestions?: string[];
  category: string;
  links?: ServiceLink[];
}

class ChatbotService {
  private static instance: ChatbotService;
  private questionPatterns: QuestionPattern[] = [
    // Safety Related Questions
    {
      patterns: ['what to do if', 'help me', 'unsafe', 'danger', 'scared', 'following', 'stalking'],
      response: "If you feel unsafe:\n1. Stay calm and move to a crowded area\n2. Call emergency number (100) or women\'s helpline (1091)\n3. Share your live location with trusted contacts\n4. Use the SOS feature in the app\n5. Record evidence if possible (photos, videos)\n6. Make noise and draw attention if threatened",
      suggestions: ['Show emergency numbers', 'How to use SOS', 'Safe zones near me'],
      category: 'safety'
    },
    // Harassment Questions
    {
      patterns: ['harassment', 'harassed', 'inappropriate', 'touching', 'molestation', 'eve teasing'],
      response: "For harassment cases:\n1. File an FIR at any police station (Zero FIR)\n2. Document evidence and witness details\n3. Contact Women\'s Helpline (1091)\n4. If at workplace, report to Internal Complaints Committee\n5. You can file complaint online at cybercrime.gov.in for cyber harassment",
      suggestions: ['Legal rights', 'File a complaint', 'Workplace harassment'],
      category: 'harassment'
    },
    // Domestic Violence
    {
      patterns: ['domestic violence', 'husband', 'beating', 'abuse', 'family violence', 'dowry'],
      response: "For domestic violence:\n1. Call Women\'s Helpline (181)\n2. Contact Protection Officer under PWDVA\n3. You have right to residence and protection\n4. File complaint under Section 498A IPC\n5. Seek help from registered NGOs\n6. Document injuries and incidents",
      suggestions: ['Get helpline numbers', 'Legal support', 'Find NGO help'],
      category: 'domestic',
      links: [
        {
          title: "National Commission for Women",
          url: "http://ncw.nic.in/",
          description: "Official government body for women's rights",
          number: "7827170170"
        },
        {
          title: 'Protection of Women from Domestic Violence Act',
          url: 'https://wcd.nic.in/act/protection-women-domestic-violence-act-2005',
          description: 'Official information about your legal rights'
        },
        {
          title: 'NALSA - Free Legal Services',
          url: 'https://nalsa.gov.in/',
          description: 'Get free legal aid',
          number: '15100'
        }
      ]
    },
    // Medical Emergency
    {
      patterns: ['medical', 'hospital', 'injured', 'accident', 'bleeding', 'pain'],
      response: "Medical Emergency Steps:\n1. Call Ambulance (102)\n2. If assault case, go to government hospital\n3. Request female doctor (it\'s your right)\n4. Preserve evidence if it\'s an assault\n5. Hospital cannot deny treatment\n6. Keep emergency contacts handy",
      suggestions: ['Call ambulance', 'Find hospitals', 'Medical rights'],
      category: 'medical',
      links: [
        {
          title: 'Emergency Ambulance Services',
          url: 'https://www.nhp.gov.in/emergency-medical-relief_pg',
          description: 'Government ambulance service',
          number: '102'
        },
        {
          title: 'National Health Portal',
          url: 'https://www.nhp.gov.in/',
          description: 'Find government hospitals near you'
        },
        {
          title: 'Medical Council of India',
          url: 'https://www.nmc.org.in/',
          description: 'Know your patient rights'
        }
      ]
    },
    // Workplace Safety
    {
      patterns: ['office', 'workplace', 'colleague', 'boss', 'work', 'job'],
      response: "Workplace Safety Rights:\n1. Right to ICC for harassment complaints\n2. Equal pay for equal work\n3. Safe working conditions\n4. Maternity benefits\n5. Night shift safety measures\n6. Transportation facility for late hours",
      suggestions: ['Workplace rights', 'ICC guidelines', 'Night shift rules'],
      category: 'workplace'
    },
    // Public Transport
    {
      patterns: ['bus', 'train', 'metro', 'taxi', 'auto', 'transport', 'travel'],
      response: "Travel Safety Tips:\n1. Share vehicle details with family\n2. Use women\'s special coaches\n3. Keep helpline numbers ready\n4. Track journey using maps\n5. Avoid empty buses/trains\n6. Use official taxi stands\n7. Railway Police: 1512",
      suggestions: ['Transport safety', 'Emergency numbers', 'Safe zones'],
      category: 'transport'
    },
    // Cyber Safety
    {
      patterns: ['online', 'internet', 'social media', 'cyber', 'digital', 'phone', 'whatsapp'],
      response: "Cyber Safety Guidelines:\n1. Report cyber crimes at cybercrime.gov.in\n2. Don't share personal info online\n3. Use strong privacy settings\n4. Save evidence of harassment\n5. Block abusive contacts\n6. Cyber Crime Helpline: 155620",
      suggestions: ['Report cyber crime', 'Online safety', 'Get helpline numbers'],
      category: 'cyber',
      links: [
        {
          title: 'National Cyber Crime Reporting Portal',
          url: 'https://cybercrime.gov.in/',
          description: 'Report cyber crimes online',
          number: '1930'
        },
        {
          title: 'Women Cyber Cell',
          url: 'https://cybercrime.gov.in/Webform/Crime_AuthorisedPerson.aspx',
          description: 'Special cell for women-related cyber crimes',
          number: '155620'
        },
        {
          title: 'Cyber Peace Foundation',
          url: 'https://www.cyberpeace.org/',
          description: 'NGO for cyber safety awareness and support'
        }
      ]
    },
    // Educational Institution
    {
      patterns: ['college', 'school', 'university', 'campus', 'teacher', 'professor'],
      response: "Campus Safety Rights:\n1. Internal complaints committee is mandatory\n2. Right to safe educational environment\n3. Anti-ragging helpline: 1800-180-5522\n4. UGC guidelines for women's safety\n5. Right to protest against discrimination",
      suggestions: ['Campus guidelines', 'Ragging help', 'Student rights'],
      category: 'education'
    },
    // Property Rights
    {
      patterns: ['property', 'inheritance', 'house', 'land', 'ownership', 'will'],
      response: "Property Rights:\n1. Equal rights in ancestral property\n2. Right to father\'s self-acquired property\n3. Cannot be denied inheritance\n4. Right to reside in marital home\n5. Seek legal aid for property disputes",
      suggestions: ['Property laws', 'Legal aid', 'Inheritance rights'],
      category: 'property'
    },
    // Legal Aid
    {
      patterns: ['legal', 'lawyer', 'court', 'rights', 'law'],
      response: "Legal Aid Services:\n1. You have right to free legal aid\n2. Contact NALSA for free legal services\n3. Visit nearest District Legal Services Authority\n4. Get help from women's rights organizations\n5. Document everything properly",
      suggestions: ['Get legal aid', 'Know your rights', 'Find lawyer'],
      category: 'legal',
      links: [
        {
          title: 'National Legal Services Authority',
          url: 'https://nalsa.gov.in/',
          description: 'Free legal services for women',
          number: '15100'
        },
        {
          title: 'District Legal Services Authority',
          url: 'https://dslsa.org/',
          description: 'Local legal aid services'
        },
        {
          title: 'Women\'s Rights Portal',
          url: 'https://wcd.nic.in/womendevelopment/legal-rights-women',
          description: 'Comprehensive guide to women\'s legal rights'
        }
      ]
    },
    // Police Assistance
    {
      patterns: ['police', 'fir', 'complaint', 'report', 'crime'],
      response: "Police Assistance:\n1. Call 100 for immediate help\n2. You can file Zero FIR at any police station\n3. Request female police officer\n4. Get complaint copy\n5. Note down officer details",
      suggestions: ['Call police', 'File complaint', 'Know your rights'],
      category: 'police',
      links: [
        {
          title: 'Emergency Police Help',
          url: 'https://www.digitalpolice.gov.in/',
          description: 'Online police services',
          number: '100'
        },
        {
          title: 'File Online FIR',
          url: 'https://digitalpolice.gov.in/ncr/State_Selection.aspx',
          description: 'Report crime online'
        },
        {
          title: 'Women\'s Safety App',
          url: 'https://play.google.com/store/apps/details?id=com.hamrapolice',
          description: 'Official police safety app for women'
        }
      ]
    },
    // Common Questions
    {
      patterns: ['hello', 'hi', 'hey'],
      response: "Hello! I'm your safety assistant. I can help you with:\n- Emergency situations\n- Legal rights and information\n- Safety guidelines\n- Filing complaints\nWhat would you like to know about?",
      suggestions: ['Emergency help', 'Legal rights', 'Safety tips'],
      category: 'greeting'
    },
    {
      patterns: ['thank', 'thanks', 'helpful'],
      response: "You're welcome! Remember, your safety is important. Don't hesitate to seek help when needed. Is there anything else you'd like to know?",
      suggestions: ['More safety tips', 'Emergency numbers', 'Legal rights'],
      category: 'thanks'
    },
    {
      patterns: ['bye', 'goodbye', 'see you'],
      response: "Take care and stay safe! Remember, help is always available 24/7 through emergency numbers. Close this chat window anytime and reopen when needed.",
      suggestions: ['Emergency numbers', 'Safety tips'],
      category: 'goodbye'
    }
  ];

  private constructor() {}

  public static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService();
    }
    return ChatbotService.instance;
  }

  private findMatchingPattern(query: string): QuestionPattern | null {
    const lowerQuery = query.toLowerCase();
    return this.questionPatterns.find(pattern => 
      pattern.patterns.some(p => lowerQuery.includes(p))
    ) || null;
  }

  private async searchAllData(query: string): Promise<ChatResponse> {
    const lowerQuery = query.toLowerCase();
    
    // First check for emergency-related queries
    if (lowerQuery.includes('emergency') || lowerQuery.includes('number') || lowerQuery.includes('contact')) {
      const emergencyNumbers = await emergencyService.searchEmergencyNumbers(query);
      if (emergencyNumbers.length > 0) {
        return {
          text: 'Here are some relevant emergency contacts:\n' +
            emergencyNumbers.map(num => `${num.name}: ${num.number} - ${num.description}`).join('\n'),
          type: 'bot',
          suggestions: ['More numbers', 'How to use', 'Safety tips']
        };
      }
    }

    // Check pattern-based responses
    const matchingPattern = this.findMatchingPattern(query);
    if (matchingPattern) {
      return {
        text: matchingPattern.response,
        type: 'bot',
        suggestions: matchingPattern.suggestions,
        links: matchingPattern.links
      };
    }

    // Check for legal information queries
    const legalInfo = await legalInfoService.searchLegalInfo(query);
    if (legalInfo.length > 0) {
      const response = legalInfo[0];
      return {
        text: `${response.title}\n\n${response.details}\n\nSource: ${response.source}`,
        type: 'bot',
        suggestions: ['Tell me more', 'How to file complaint', 'Emergency numbers']
      };
    }

    // Default response if no match found
    return {
      text: "I understand you need help. Could you please be more specific? I can assist with:\n- Emergency situations\n- Legal rights\n- Safety guidelines\n- Filing complaints\n- Workplace safety\n- Cyber security\n- Medical help",
      type: 'bot',
      suggestions: ['Emergency numbers', 'Legal rights', 'Safety tips', 'File complaint']
    };
  }

  public async getResponse(query: string): Promise<ChatResponse> {
    try {
      return await this.searchAllData(query);
    } catch (error) {
      return {
        text: "I\'m having trouble processing your request. For immediate help, please call emergency numbers: Police (100) or Women\'s Helpline (1091).",
        type: 'error',
        suggestions: ['Show emergency numbers', 'Show legal rights']
      };
    }
  }
}

export const chatbotService = ChatbotService.getInstance(); 