# RESQ360: Emergency Response Application

## Overview

RESQ360 is a comprehensive safety and emergency response application designed to provide real-time emergency alerts, community support, and safety resources. The platform aims to bridge the gap between traditional emergency services and modern technology, creating an ecosystem where community members can look out for each other and access vital information during critical situations.

## Mission

At ResQ360, we believe that safety is a fundamental right that should be accessible to everyone. Our mission is to empower communities by providing comprehensive safety resources, real-time emergency alerts, and a supportive platform for sharing concerns and seeking help.

## Key Features

### Emergency Alerts
- Create and receive real-time alerts about incidents in your area
- Support for multiple emergency types: fire, flood, accident, medical, harassment, violence, suspicious activity, and others
- Severity levels: low, medium, high, critical
- Includes location data, descriptions, and timestamps
- Real-time notifications to trusted contacts

### Interactive Alert Map
- Visual representation of active alerts on an interactive map
- Custom markers based on alert type
- Filtering by alert type and severity
- Detailed view of selected alerts

### Community Forum
- Anonymous platform for sharing concerns and seeking advice
- Optional location sharing
- Post tagging system
- Comments and likes functionality

### Gemini AI Assistant
- Personalized safety advice using Google Gemini API
- Information about legal rights
- Guidance during emergencies
- Works with limited connectivity

### Trusted Contacts
- Manage emergency contacts (email, phone)
- Quick notification during crisis situations
- Location sharing with trusted contacts

### Offline Functionality
- Access to critical safety information without internet connection
- Client-side caching for essential resources

### Emergency Numbers
- Directory of local emergency services and helplines
- Organized by category and location

### Legal Rights Information
- Access to vital information about legal rights in various emergency situations
- Protection laws and legal procedures during crises

### Safe Zones
- Find nearby safe locations and emergency services
- Directions to police stations, hospitals, shelters, and other safe havens

## Sample Data

### Sample Fire Alert at ABESIT Ghaziabad
```json
{
  "id": "fire-20241303-765498",
  "type": "fire",
  "severity": "high",
  "location": {
    "latitude": 28.6822552,
    "longitude": 77.4842057,
    "address": "ABESIT Campus, NH-24, Vijay Nagar, Ghaziabad, Uttar Pradesh 201009"
  },
  "description": "Fire reported in the computer lab building. Smoke visible from third floor. Fire department notified. All students and staff advised to evacuate immediately using emergency exits.",
  "timestamp": "2024-03-28T14:25:30Z",
  "status": "active",
  "reportedBy": "security-staff",
  "responders": ["fire-dept-ghaziabad", "campus-security"]
}
```

### Sample Trusted Contacts
```json
[
  {
    "id": "contact-001",
    "name": "Aryan",
    "type": "email",
    "value": "aryansaini2004feb@gmail.com"
  },
  {
    "id": "contact-002",
    "name": "Ravi Kumar",
    "type": "phone",
    "value": "9876543210"
  },
  {
    "id": "contact-003",
    "name": "Priya Sharma",
    "type": "email",
    "value": "priya.sharma@gmail.com"
  },
  {
    "id": "contact-004",
    "name": "Campus Security",
    "type": "phone",
    "value": "1800123456"
  }
]
```

### Sample Forum Posts
```json
[
  {
    "id": "post-20240327-001",
    "title": "Safety concerns around ABESIT campus at night",
    "content": "I've noticed the street lights near the south entrance of campus aren't working for the past week. This creates a safety hazard for students leaving late after evening classes. Has anyone else noticed this issue? Who should we contact to get this fixed?",
    "authorId": "user-578",
    "authorName": "Anonymous",
    "isAnonymous": true,
    "timestamp": "2024-03-27T19:45:12Z",
    "location": {
      "latitude": 28.6815,
      "longitude": 77.4835,
      "address": "South Gate, ABESIT Campus, Ghaziabad"
    },
    "tags": ["campus", "infrastructure", "lighting", "night-safety"],
    "likes": 15,
    "comments": [
      {
        "id": "comment-001",
        "content": "Yes, I've noticed this too. It's very dark and feels unsafe. We should report this to the administration office.",
        "authorId": "user-423",
        "authorName": "Neha",
        "isAnonymous": false,
        "timestamp": "2024-03-27T20:12:45Z",
        "likes": 5
      },
      {
        "id": "comment-002",
        "content": "I've already emailed the facilities department at facilities@abesit.in - they said they'll fix it by next week.",
        "authorId": "user-189",
        "authorName": "Campus Representative",
        "isAnonymous": false,
        "timestamp": "2024-03-27T21:30:22Z",
        "likes": 8
      }
    ]
  },
  {
    "id": "post-20240326-002",
    "title": "Self-defense workshop announcement",
    "content": "Hello everyone! I'm organizing a free self-defense workshop this Saturday (March 30) from 10AM-12PM at the campus gymnasium. The workshop will be conducted by certified trainers and will cover basic techniques that could be useful in emergency situations. All students and staff are welcome to join. Please register by sending an email to selfdefense@student.org with your name and student ID.",
    "authorId": "user-752",
    "authorName": "Student Welfare Committee",
    "isAnonymous": false,
    "timestamp": "2024-03-26T14:20:05Z",
    "tags": ["workshop", "self-defense", "campus-event", "safety-training"],
    "likes": 42,
    "comments": [
      {
        "id": "comment-003",
        "content": "This is a great initiative! Will there be separate sessions for beginners?",
        "authorId": "user-631",
        "authorName": "FirstYearStudent",
        "isAnonymous": false,
        "timestamp": "2024-03-26T15:05:10Z",
        "likes": 3
      },
      {
        "id": "comment-004",
        "content": "Yes, we'll have groups based on experience level. The first hour will focus on beginners.",
        "authorId": "user-752",
        "authorName": "Student Welfare Committee",
        "isAnonymous": false,
        "timestamp": "2024-03-26T15:18:41Z",
        "likes": 5
      }
    ]
  }
]
```

### Sample Emergency Response
```json
{
  "alertId": "fire-20241303-765498",
  "responseTeams": [
    {
      "id": "fire-dept-ghaziabad",
      "name": "Ghaziabad Fire Department",
      "status": "dispatched",
      "eta": "5 minutes",
      "contact": "112"
    },
    {
      "id": "campus-security",
      "name": "ABESIT Campus Security",
      "status": "on-scene",
      "contact": "1800123456"
    },
    {
      "id": "medical-team",
      "name": "Emergency Medical Services",
      "status": "standby",
      "eta": "8 minutes",
      "contact": "108"
    }
  ],
  "evacuationStatus": {
    "inProgress": true,
    "evacuationRoutes": ["North Exit", "West Emergency Stairwell"],
    "assemblyPoints": ["Main Parking Lot", "Sports Field"]
  },
  "updates": [
    {
      "timestamp": "2024-03-28T14:26:45Z",
      "message": "Evacuation in progress. All students and staff are requested to remain calm and proceed to the nearest exit.",
      "updater": "campus-security"
    },
    {
      "timestamp": "2024-03-28T14:30:12Z",
      "message": "Fire department arrived on scene. Fire contained to single lab room on third floor.",
      "updater": "fire-dept-ghaziabad"
    },
    {
      "timestamp": "2024-03-28T14:35:00Z",
      "message": "Initial headcount at assembly points complete. All students and staff accounted for. No injuries reported.",
      "updater": "campus-security"
    }
  ]
}
```

## Tech Stack

### Frontend
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Strongly typed programming language that builds on JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: React library for animations and interactions
- **React Router**: Library for routing in React applications

### Backend & Database
- **Firebase**: Platform for building web and mobile applications
- **Firestore**: NoSQL document database
- **Firebase Authentication**: User authentication and identity management
- **Firebase Cloud Functions**: Serverless computing solution

### AI Technologies
- **Google Gemini API**: Multimodal AI model for generating text and analyzing data
- **Natural Language Processing**: For processing and understanding human language

### Deployment & Hosting
- **GitHub**: Version control and collaboration platform
- **Vercel**: Platform for deploying and hosting web applications
- **Progressive Web App (PWA)**: Technology for offline capabilities

### Development Tools
- **Visual Studio Code**: Source code editor
- **npm**: Package manager for JavaScript
- **ESLint**: Static code analysis tool

## Project Structure

```
project/
├── public/            # Public assets and icons
├── server/            # Server-side code
│   ├── src/           # Server source files
│   │   ├── types/     # Type definitions
│   │   └── utils/     # Utility functions
│   └── utils/         # Additional utilities
├── src/               # Client application source
│   ├── components/    # React components
│   ├── contexts/      # React contexts
│   ├── data/          # Static data files
│   ├── img/           # Image assets
│   ├── lib/           # Library code
│   ├── pages/         # Page components
│   ├── services/      # Service modules
│   ├── store/         # State management
│   ├── types/         # TypeScript type definitions
│   ├── ui/            # UI components
│   └── utils/         # Utility functions
├── .env               # Environment variables
└── ...                # Configuration files
```

## Installation

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Firebase account

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/RESQ360-hacknovate.git
   cd RESQ360-hacknovate
   ```

2. Install dependencies for the client:
   ```bash
   cd project
   npm install
   ```

3. Install dependencies for the server:
   ```bash
   cd server
   npm install
   ```

4. Configure environment variables:
   - Create a `.env` file in the project root based on `.env.example`
   - Add your Firebase configuration
   - Add your Google Gemini API key
   - Configure Nodemailer email settings

5. Start the development server:
   ```bash
   # In the project directory
   npm run dev

   # In a separate terminal, for the server
   cd server
   npm run dev
   ```

## Usage

### Creating an Alert
1. Navigate to the "Create Alert" page
2. Select the alert type and severity
3. Enter a description of the emergency
4. Provide your location (automatically detected or manually entered)
5. Submit the alert to notify nearby users and your trusted contacts

### Emergency Button
1. Access the emergency button from the bottom-right corner of any screen
2. Select your trusted contacts
3. Add optional details about your emergency
4. Send the alert to immediately notify your selected contacts with your location

### Viewing Alerts
1. Navigate to the "Alerts" page to see all active alerts
2. Use the map view to see alerts by location
3. Filter alerts by type and severity
4. Click on an alert for detailed information

### Using the AI Assistant
1. Navigate to the "Safety Assistant" page
2. Type your question or concern
3. Receive personalized safety advice and guidance

## Email Configuration

The application uses Nodemailer for sending email alerts. Configure your email settings in the server `.env` file:

```
NODEMAILER_GMAIL=your-email@gmail.com
NODEMAILER_PASS=your-app-password
```

For Gmail, you'll need to generate an app password rather than using your regular account password.

## Data Models

### Alert
```typescript
interface Alert {
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
```

### Trusted Contact
```typescript
interface TrustedContact {
  id: string;
  name: string;
  type: 'email' | 'phone';
  value: string;
}
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/alerts/notify` | POST | Send emergency alert notifications to trusted contacts |
| `/api/health` | GET | Health check endpoint to verify API status |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## About the Team

RESQ360 was developed as part of the Hacknovate 2025 hackathon. Our team is passionate about leveraging technology to create safer communities and provide accessible emergency resources to everyone. 