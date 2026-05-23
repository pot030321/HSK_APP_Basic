import * as Speech from "expo-speech";

export async function speakText(text?: string, language = "zh-CN") {
  const value = text?.trim();
  if (!value) return;
  await Speech.stop();
  Speech.speak(value, {
    language,
    rate: 0.82,
    pitch: 1
  });
}

export async function stopSpeech() {
  await Speech.stop();
}
