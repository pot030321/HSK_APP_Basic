import { StudyDay, StudyEvent, StudyStats } from "@/types/study";

export const DAILY_GOAL_SECONDS = 20 * 60;

export function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return getDateKey(date);
}

function createDay(date: string): StudyDay {
  return {
    date,
    seconds: 0,
    reviews: 0,
    heard: 0,
    quizAnswered: 0,
    quizCorrect: 0
  };
}

export function createInitialStudyStats(): StudyStats {
  return {
    totalSeconds: 0,
    sessionCount: 0,
    currentStreak: 0,
    bestStreak: 0,
    days: []
  };
}

export function applyStudyEvent(stats: StudyStats, event: StudyEvent, now = new Date()): StudyStats {
  const today = getDateKey(now);
  const seconds = Math.max(0, Math.floor(event.seconds ?? 0));
  const meaningfulActivity =
    seconds > 0 || Boolean(event.reviews) || Boolean(event.heard) || Boolean(event.quizAnswered) || Boolean(event.quizCorrect);
  if (!meaningfulActivity) return stats;

  const existingDays = stats.days.length ? stats.days : [];
  const dayIndex = existingDays.findIndex((day) => day.date === today);
  const todayStats = dayIndex >= 0 ? existingDays[dayIndex] : createDay(today);
  const nextToday: StudyDay = {
    ...todayStats,
    seconds: todayStats.seconds + seconds,
    reviews: todayStats.reviews + Math.max(0, event.reviews ?? 0),
    heard: todayStats.heard + Math.max(0, event.heard ?? 0),
    quizAnswered: todayStats.quizAnswered + Math.max(0, event.quizAnswered ?? 0),
    quizCorrect: todayStats.quizCorrect + Math.max(0, event.quizCorrect ?? 0)
  };

  const days = dayIndex >= 0 ? existingDays.map((day, index) => (index === dayIndex ? nextToday : day)) : [...existingDays, nextToday];
  const trimmedDays = days.sort((a, b) => a.date.localeCompare(b.date)).slice(-90);
  const lastStudiedDate = stats.lastStudiedDate;
  const startsNewDay = lastStudiedDate !== today;
  const yesterday = addDays(today, -1);
  const currentStreak = startsNewDay
    ? lastStudiedDate === yesterday
      ? stats.currentStreak + 1
      : 1
    : Math.max(1, stats.currentStreak);

  return {
    totalSeconds: stats.totalSeconds + seconds,
    sessionCount: stats.sessionCount + (startsNewDay || seconds > 0 ? 1 : 0),
    currentStreak,
    bestStreak: Math.max(stats.bestStreak, currentStreak),
    lastStudiedDate: today,
    days: trimmedDays,
    updatedAt: now.toISOString()
  };
}

export function getTodayStudy(stats: StudyStats, now = new Date()) {
  return stats.days.find((day) => day.date === getDateKey(now)) ?? createDay(getDateKey(now));
}

export function getWeekSeconds(stats: StudyStats, now = new Date()) {
  const today = getDateKey(now);
  const weekStart = addDays(today, -6);
  return stats.days.filter((day) => day.date >= weekStart && day.date <= today).reduce((sum, day) => sum + day.seconds, 0);
}

export function formatStudyDuration(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  if (hours > 0 && minutes > 0) return `${hours}g ${minutes}p`;
  if (hours > 0) return `${hours}g`;
  if (minutes > 0) return `${minutes}p`;
  return `${safeSeconds}s`;
}

export function formatGoalProgress(seconds: number, goalSeconds = DAILY_GOAL_SECONDS) {
  return Math.min(100, Math.round((seconds / Math.max(60, goalSeconds)) * 100));
}
