import { Alert } from '../types/alert';

export const sampleAlerts: Alert[] = [
  {
    id: "fire-20241303-765498",
    type: "fire",
    severity: "high",
    location: {
      latitude: 28.6822552,
      longitude: 77.4842057,
      address: "ABESIT Campus, NH-24, Vijay Nagar, Ghaziabad, Uttar Pradesh 201009"
    },
    description: "Fire reported in the computer lab building. Smoke visible from third floor. Fire department notified. All students and staff advised to evacuate immediately using emergency exits.",
    timestamp: new Date("2024-03-28T14:25:30Z"),
    status: "active",
    reportedBy: "security-staff",
    responders: ["fire-dept-ghaziabad", "campus-security"]
  },
  {
    id: "medical-20241303-765499",
    type: "medical",
    severity: "critical",
    location: {
      latitude: 28.6820521,
      longitude: 77.4845032,
      address: "ABESIT Campus, Library Building, NH-24, Vijay Nagar, Ghaziabad"
    },
    description: "Student collapsed in library. Possible cardiac event. Emergency medical services requested. First aid administered by campus nurse.",
    timestamp: new Date("2024-03-28T15:10:45Z"),
    status: "active",
    reportedBy: "library-staff",
    responders: ["medical-team", "campus-security"]
  },
  {
    id: "flood-20241302-765500",
    type: "flood",
    severity: "medium",
    location: {
      latitude: 28.6818934,
      longitude: 77.4839871,
      address: "ABESIT Campus, Hostel Block, NH-24, Vijay Nagar, Ghaziabad"
    },
    description: "Water pipe burst in ground floor of hostel building. Flooding in corridors and some rooms. Maintenance team notified. Students moving to upper floors.",
    timestamp: new Date("2024-03-27T08:45:22Z"),
    status: "active",
    reportedBy: "hostel-warden",
    responders: ["maintenance-team"]
  },
  {
    id: "harassment-20241301-765501",
    type: "harassment",
    severity: "high",
    location: {
      latitude: 28.6825178,
      longitude: 77.4846123,
      address: "ABESIT Campus, Main Gate, NH-24, Vijay Nagar, Ghaziabad"
    },
    description: "Group of outsiders harassing students near main gate. Security alerted. Police notified. Students advised to use alternate entrance.",
    timestamp: new Date("2024-03-26T18:20:15Z"),
    status: "resolved",
    reportedBy: "student",
    responders: ["campus-security", "police"]
  },
  {
    id: "suspicious-20241301-765502",
    type: "suspicious",
    severity: "low",
    location: {
      latitude: 28.6819765,
      longitude: 77.4850432,
      address: "ABESIT Campus, Parking Area, NH-24, Vijay Nagar, Ghaziabad"
    },
    description: "Suspicious vehicle parked in faculty parking for over 24 hours. No identification visible. Security monitoring situation.",
    timestamp: new Date("2024-03-26T10:15:33Z"),
    status: "pending",
    reportedBy: "faculty-member",
    responders: ["campus-security"]
  }
]; 