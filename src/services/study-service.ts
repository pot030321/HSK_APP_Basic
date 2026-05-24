import AsyncStorage from "@react-native-async-storage/async-storage";
import { AdminSettings, StudyStats } from "@/types/study";
import { createInitialStudyStats } from "@/utils/study";

const STUDY_STATS_KEY = "hsk-study-stats-v1";
const ADMIN_SETTINGS_KEY = "hsk-admin-settings-v1";
const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  dailyGoalMinutes: 20
};

export async function loadStudyStats() {
  const raw = await AsyncStorage.getItem(STUDY_STATS_KEY);
  if (!raw) return createInitialStudyStats();
  return { ...createInitialStudyStats(), ...(JSON.parse(raw) as StudyStats) };
}

export async function saveStudyStats(stats: StudyStats) {
  await AsyncStorage.setItem(STUDY_STATS_KEY, JSON.stringify(stats));
}

export async function clearStudyStats() {
  await AsyncStorage.removeItem(STUDY_STATS_KEY);
}

export async function loadAdminSettings() {
  const raw = await AsyncStorage.getItem(ADMIN_SETTINGS_KEY);
  if (!raw) return DEFAULT_ADMIN_SETTINGS;
  return { ...DEFAULT_ADMIN_SETTINGS, ...(JSON.parse(raw) as AdminSettings) };
}

export async function saveAdminSettings(settings: AdminSettings) {
  await AsyncStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
}
