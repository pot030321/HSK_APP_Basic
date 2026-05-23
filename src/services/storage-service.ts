import AsyncStorage from "@react-native-async-storage/async-storage";
import { VocabularyItem } from "@/types/vocabulary";

const VOCABULARY_KEY = "hsk-vocabulary-items-v1";

export async function loadVocabulary() {
  const raw = await AsyncStorage.getItem(VOCABULARY_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as VocabularyItem[];
}

export async function saveVocabulary(items: VocabularyItem[]) {
  await AsyncStorage.setItem(VOCABULARY_KEY, JSON.stringify(items));
}

export async function clearVocabulary() {
  await AsyncStorage.removeItem(VOCABULARY_KEY);
}
