import { Stack } from "expo-router/stack";
import { VocabularyProvider } from "@/context/vocabulary-context";
import { colors } from "@/theme";

export default function RootLayout() {
  return (
    <VocabularyProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text
        }}
      >
        <Stack.Screen name="index" options={{ title: "HSK Vocabulary" }} />
        <Stack.Screen name="vocabulary" options={{ title: "Danh sách từ" }} />
        <Stack.Screen name="flashcards" options={{ title: "Flashcard" }} />
        <Stack.Screen name="quiz" options={{ title: "Quiz" }} />
        <Stack.Screen name="word/[id]" options={{ title: "Chi tiết từ" }} />
      </Stack>
    </VocabularyProvider>
  );
}
