import { ForumPost, ForumComment } from '../types/alert';

export const sampleForumPosts: ForumPost[] = [
  {
    id: "post-20240327-001",
    title: "Safety concerns around ABESIT campus at night",
    content: "I've noticed the street lights near the south entrance of campus aren't working for the past week. This creates a safety hazard for students leaving late after evening classes. Has anyone else noticed this issue? Who should we contact to get this fixed?",
    authorId: "user-578",
    authorName: "Anonymous",
    isAnonymous: true,
    timestamp: new Date("2024-03-27T19:45:12Z"),
    location: {
      latitude: 28.6815,
      longitude: 77.4835,
      address: "South Gate, ABESIT Campus, Ghaziabad"
    },
    tags: ["campus", "infrastructure", "lighting", "night-safety"],
    likes: 15,
    comments: [
      {
        id: "comment-001",
        content: "Yes, I've noticed this too. It's very dark and feels unsafe. We should report this to the administration office.",
        authorId: "user-423",
        authorName: "Neha",
        isAnonymous: false,
        timestamp: new Date("2024-03-27T20:12:45Z"),
        likes: 5
      },
      {
        id: "comment-002",
        content: "I've already emailed the facilities department at facilities@abesit.in - they said they'll fix it by next week.",
        authorId: "user-189",
        authorName: "Campus Representative",
        isAnonymous: false,
        timestamp: new Date("2024-03-27T21:30:22Z"),
        likes: 8
      }
    ]
  },
  {
    id: "post-20240326-002",
    title: "Self-defense workshop announcement",
    content: "Hello everyone! I'm organizing a free self-defense workshop this Saturday (March 30) from 10AM-12PM at the campus gymnasium. The workshop will be conducted by certified trainers and will cover basic techniques that could be useful in emergency situations. All students and staff are welcome to join. Please register by sending an email to selfdefense@student.org with your name and student ID.",
    authorId: "user-752",
    authorName: "Student Welfare Committee",
    isAnonymous: false,
    timestamp: new Date("2024-03-26T14:20:05Z"),
    tags: ["workshop", "self-defense", "campus-event", "safety-training"],
    likes: 42,
    comments: [
      {
        id: "comment-003",
        content: "This is a great initiative! Will there be separate sessions for beginners?",
        authorId: "user-631",
        authorName: "FirstYearStudent",
        isAnonymous: false,
        timestamp: new Date("2024-03-26T15:05:10Z"),
        likes: 3
      },
      {
        id: "comment-004",
        content: "Yes, we'll have groups based on experience level. The first hour will focus on beginners.",
        authorId: "user-752",
        authorName: "Student Welfare Committee",
        isAnonymous: false,
        timestamp: new Date("2024-03-26T15:18:41Z"),
        likes: 5
      }
    ]
  },
  {
    id: "post-20240325-003",
    title: "Suspicious activity near hostel area",
    content: "Last night around 11 PM, I noticed two individuals loitering around the back gate of the women's hostel. They seemed to be watching the building and taking photos. I reported this to the security guard, but I wanted to alert others to be vigilant when returning to hostels late at night.",
    authorId: "user-389",
    authorName: "Anonymous",
    isAnonymous: true,
    timestamp: new Date("2024-03-25T09:15:23Z"),
    location: {
      latitude: 28.6823,
      longitude: 77.4839,
      address: "Women's Hostel, ABESIT Campus, Ghaziabad"
    },
    tags: ["suspicious-activity", "hostel", "security", "night-safety"],
    likes: 28,
    comments: [
      {
        id: "comment-005",
        content: "Thank you for reporting this. As the hostel warden, I've increased security patrols in this area and we're reviewing CCTV footage. Please report any similar incidents immediately to security at 1800123456.",
        authorId: "user-112",
        authorName: "Hostel Warden",
        isAnonymous: false,
        timestamp: new Date("2024-03-25T10:30:15Z"),
        likes: 15
      },
      {
        id: "comment-006",
        content: "I saw them too! They ran away when I approached with some friends. Has anyone else noticed strangers around campus lately?",
        authorId: "user-452",
        authorName: "Anonymous",
        isAnonymous: true,
        timestamp: new Date("2024-03-25T11:45:32Z"),
        likes: 7
      }
    ]
  }
]; 