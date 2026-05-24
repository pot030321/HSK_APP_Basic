import * as Speech from "expo-speech";
import { Alert, Platform } from "react-native";

type SpeakAttempt = {
  language?: string;
  voice?: string;
};

let cachedChineseVoice: Speech.Voice | null | undefined;
let warnedAboutSpeech = false;

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

function speakOnce(text: string, attempt: SpeakAttempt, timeoutMs = Platform.OS === "android" ? 2400 : 1200) {
  return new Promise<boolean>((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      Speech.stop().catch(() => undefined);
      resolve(false);
    }, timeoutMs);

    const finish = (started: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(started);
    };

    try {
      Speech.speak(text, {
        language: attempt.language,
        voice: attempt.voice,
        rate: Platform.OS === "android" ? 0.72 : 0.82,
        pitch: 1,
        volume: 1,
        onStart: () => finish(true),
        onDone: () => finish(true),
        onStopped: () => finish(false),
        onError: () => finish(false)
      });
    } catch {
      finish(false);
    }
  });
}

function showSpeechHelp() {
  if (warnedAboutSpeech) return;
  warnedAboutSpeech = true;
  Alert.alert(
    "Chưa phát được âm thanh",
    "Máy Android này có thể chưa bật Text-to-speech hoặc chưa có giọng tiếng Trung. Vào Settings > Text-to-speech, chọn Google Speech Services và tải Chinese voice."
  );
}

export async function speakText(text?: string, language = "zh-CN") {
  const value = text?.trim();
  if (!value) return false;

  const speechText = normalizeSpeechText(value);
  if (!speechText) return false;

  const voice = await getChineseVoice();
  const clippedText = speechText.slice(0, Speech.maxSpeechInputLength);
  const attempts: SpeakAttempt[] =
    Platform.OS === "android"
      ? [
          { language: "zh-CN", voice: voice?.identifier },
          { language: "zh", voice: voice?.identifier },
          { language: "cmn-Hans-CN", voice: voice?.identifier },
          { language: "zh-CN" },
          { language: "zh" },
          {}
        ]
      : [{ language, voice: voice?.identifier }, { language }, {}];

  for (const attempt of attempts) {
    await Speech.stop();
    const started = await speakOnce(clippedText, attempt);
    if (started) return true;
  }

  showSpeechHelp();
  return false;
}

export async function stopSpeech() {
  await Speech.stop();
}
