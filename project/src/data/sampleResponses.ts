// Define types for emergency response data
export interface ResponseTeam {
  id: string;
  name: string;
  status: 'dispatched' | 'on-scene' | 'standby' | 'en-route';
  eta?: string;
  contact: string;
}

export interface EvacuationStatus {
  inProgress: boolean;
  evacuationRoutes: string[];
  assemblyPoints: string[];
}

export interface StatusUpdate {
  timestamp: Date;
  message: string;
  updater: string;
}

export interface EmergencyResponse {
  alertId: string;
  responseTeams: ResponseTeam[];
  evacuationStatus: EvacuationStatus;
  updates: StatusUpdate[];
}

// Sample emergency response for the fire at ABESIT
export const sampleFireResponse: EmergencyResponse = {
  alertId: "fire-20241303-765498",
  responseTeams: [
    {
      id: "fire-dept-ghaziabad",
      name: "Ghaziabad Fire Department",
      status: "dispatched",
      eta: "5 minutes",
      contact: "112"
    },
    {
      id: "campus-security",
      name: "ABESIT Campus Security",
      status: "on-scene",
      contact: "1800123456"
    },
    {
      id: "medical-team",
      name: "Emergency Medical Services",
      status: "standby",
      eta: "8 minutes",
      contact: "108"
    }
  ],
  evacuationStatus: {
    inProgress: true,
    evacuationRoutes: ["North Exit", "West Emergency Stairwell"],
    assemblyPoints: ["Main Parking Lot", "Sports Field"]
  },
  updates: [
    {
      timestamp: new Date("2024-03-28T14:26:45Z"),
      message: "Evacuation in progress. All students and staff are requested to remain calm and proceed to the nearest exit.",
      updater: "campus-security"
    },
    {
      timestamp: new Date("2024-03-28T14:30:12Z"),
      message: "Fire department arrived on scene. Fire contained to single lab room on third floor.",
      updater: "fire-dept-ghaziabad"
    },
    {
      timestamp: new Date("2024-03-28T14:35:00Z"),
      message: "Initial headcount at assembly points complete. All students and staff accounted for. No injuries reported.",
      updater: "campus-security"
    },
    {
      timestamp: new Date("2024-03-28T14:42:15Z"),
      message: "Fire fully extinguished. Cause appears to be electrical short in computer equipment. Building remains evacuated for smoke clearance.",
      updater: "fire-dept-ghaziabad"
    }
  ]
};

// Sample emergency response for medical emergency
export const sampleMedicalResponse: EmergencyResponse = {
  alertId: "medical-20241303-765499",
  responseTeams: [
    {
      id: "medical-team",
      name: "Emergency Medical Services",
      status: "on-scene",
      contact: "108"
    },
    {
      id: "campus-medical",
      name: "Campus Medical Center",
      status: "on-scene",
      contact: "1800789456"
    }
  ],
  evacuationStatus: {
    inProgress: false,
    evacuationRoutes: [],
    assemblyPoints: []
  },
  updates: [
    {
      timestamp: new Date("2024-03-28T15:12:30Z"),
      message: "Campus nurse on scene administering first aid. Student is conscious but experiencing chest pain.",
      updater: "campus-medical"
    },
    {
      timestamp: new Date("2024-03-28T15:18:45Z"),
      message: "Ambulance arrived. Paramedics providing assessment and treatment.",
      updater: "medical-team"
    },
    {
      timestamp: new Date("2024-03-28T15:25:10Z"),
      message: "Student being transported to City Hospital for further evaluation. Initial assessment suggests anxiety attack, not cardiac event.",
      updater: "medical-team"
    }
  ]
}; 