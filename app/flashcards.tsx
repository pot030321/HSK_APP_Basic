import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { ActionButton } from "@/components/action-button";
import { EmptyState } from "@/components/empty-state";
import { speakText } from "@/services/speech-service";
import { colors, radius } from "@/theme";
import { useVocabulary } from "@/context/use-vocabulary";
import { VocabularyStatus } from "@/types/vocabulary";

export default function FlashcardsScreen() {
  const { items, rateItem, recordStudyEvent } = useVocabulary();
  const deck = useMemo(() => {
    const active = items.filter((item) => item.status !== "mastered");
    return active.length ? active : items;
  }, [items]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const item = deck[index % Math.max(deck.length, 1)];

  async function rate(status: VocabularyStatus) {
    if (!item) return;
    await rateItem(item.id, status);
    setFlipped(false);
    setIndex((current) => (current + 1) % deck.length);
  }

  async function hear(text?: string) {
    const played = await speakText(text);
    if (played) recordStudyEvent({ heard: 1 });
  }

  if (!item) return <EmptyState title="Chưa có từ vựng" detail="Import Excel hoặc dùng bộ dữ liệu mặc định." />;

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 18, gap: 16 }}>
      <Text selectable style={{ color: colors.muted, fontVariant: ["tabular-nums"] }}>
        Thẻ {index + 1} / {deck.length}
      </Text>

      <Pressable
        onPress={() => setFlipped((value) => !value)}
        style={({ pressed }) => ({
          minHeight: 330,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          padding: 22,
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          opacity: pressed ? 0.9 : 1
        })}
      >
        {!flipped ? (
          <>
            <Text selectable style={{ color: colors.text, fontSize: 56, fontWeight: "900", textAlign: "center" }}>
              {item.word}
            </Text>
            <Text selectable style={{ color: colors.muted, fontSize: 20, textAlign: "center" }}>
              {item.ipa || "Chưa có phiên âm"}
            </Text>
            <Text selectable style={{ color: colors.primary, fontWeight: "700" }}>
              Chạm để xem nghĩa
            </Text>
          </>
        ) : (
          <>
            <Text selectable style={{ color: colors.text, fontSize: 30, fontWeight: "900", textAlign: "center" }}>
              {item.meaning || "Chưa có nghĩa"}
            </Text>
            <Text selectable style={{ color: colors.muted, fontSize: 16, textAlign: "center", lineHeight: 23 }}>
              {item.example || "Chưa có câu ví dụ"}
            </Text>
            <Text selectable style={{ color: colors.muted }}>
              {[item.partOfSpeech, item.lesson].filter(Boolean).join(" · ")}
            </Text>
          </>
        )}
      </Pressable>

      <ActionButton title="Nghe phát âm" onPress={() => hear(item.word)} />
      {flipped && item.example ? (
        <ActionButton title="Nghe câu ví dụ" variant="secondary" onPress={() => hear(item.example)} />
      ) : null}

      <View style={{ gap: 10 }}>
        <ActionButton title="Chưa nhớ" variant="danger" onPress={() => rate("new")} />
        <ActionButton title="Đang học" variant="secondary" onPress={() => rate("learning")} />
        <ActionButton title="Đã thuộc" onPress={() => rate("mastered")} />
      </View>
    </ScrollView>
  );
}
