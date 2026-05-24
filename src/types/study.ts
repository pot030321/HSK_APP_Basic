export type StudyDay = {
  date: string;
  seconds: number;
  reviews: number;
  heard: number;
  quizAnswered: number;
  quizCorrect: number;
};

export type StudyStats = {
  totalSeconds: number;
  sessionCount: number;
  currentStreak: number;
  bestStreak: number;
  lastStudiedDate?: string;
  days: StudyDay[];
  updatedAt?: string;
};

export type StudyEvent = {
  seconds?: number;
  reviews?: number;
  heard?: number;
  quizAnswered?: number;
  quizCorrect?: number;
};

export type AdminSettings = {
  pin?: string;
  dailyGoalMinutes: number;
};
