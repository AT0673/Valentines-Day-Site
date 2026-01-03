// TypeScript interfaces for Firestore data structures

export interface Settings {
  relationshipStartDate: Date;
  countdownTargetDate: Date;
  countdownEventName: string;
  galleryDescription: string;
  spotifyPlaylistUrl: string;
  letterContent: string;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  date: Date;
  thumbnailUrl: string;
  category: 'gallery' | 'timeline';
  order?: number;
  createdAt: Date;
}

export interface Reason {
  id: string;
  text: string;
  order: number;
  createdAt: Date;
}

export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  photoId?: string;
  photoUrl?: string;
  order: number;
  createdAt: Date;
}

export interface Dream {
  id: string;
  title: string;
  description: string;
  iconUrl?: string;
  imageUrl?: string;
  order: number;
  createdAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[]; // Array of 4 options
  correctAnswer: number; // Index of correct option (0-3)
  hint: string;
  storyChapter: string;
  order: number;
  createdAt: Date;
}

export interface Wish {
  id: string;
  text: string;
  createdAt: Date;
  position: {
    x: number;
    y: number;
  };
}

// Admin authentication
export interface AdminUser {
  uid: string;
  email?: string;
  authenticated: boolean;
}

// Progress tracking for quiz
export interface QuizProgress {
  currentQuestion: number;
  unlockedChapters: number[];
  completed: boolean;
}
