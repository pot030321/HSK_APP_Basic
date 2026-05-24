import * as Speech from "expo-speech";
import { Platform } from "react-native";

let cachedChineseVoice: Speech.Voice | null | undefined;

async function getChineseVoice() {
  if (cachedChineseVoice !== undefined) return cachedChineseVoice;

  try {
    const voices = await Speech.getAvailableVoicesAsync();
    cachedChineseVoice =
      voices.find((voice) => voice.language.toLowerCase().startsWith("zh-cn")) ??
      voices.find((voice) => voice.language.toLowerCase().startsWith("zh")) ??
      voices.find((voice) => voice.language.toLowerCase().includes("cmn")) ??
      null;
  } catch {
    cachedChineseVoice = null;
  }

  return cachedChineseVoice;
}

function normalizeSpeechText(value: string) {
  return value.replace(/[（(][^）)]*[）)]/g, "").replace(/\s+/g, " ").trim();
}

export async function speakText(text?: string, language = "zh-CN") {
  const value = text?.trim();
  if (!value) return false;

  const speechText = normalizeSpeechText(value);
  if (!speechText) return false;

  const voice = await getChineseVoice();
  await Speech.stop();

  Speech.speak(speechText.slice(0, Speech.maxSpeechInputLength), {
    language: Platform.OS === "android" && language === "zh-CN" ? "zh" : language,
    voice: voice?.identifier,
    rate: Platform.OS === "android" ? 0.72 : 0.82,
    pitch: 1,
    volume: 1
  });

  return true;
}

export async function stopSpeech() {
  await Speech.stop();
}
