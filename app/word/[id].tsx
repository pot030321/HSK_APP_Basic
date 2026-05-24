import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { ActionButton } from "@/components/action-button";
import { EmptyState } from "@/components/empty-state";
import { speakText } from "@/services/speech-service";
import { colors, radius } from "@/theme";
import { useVocabulary } from "@/context/use-vocabulary";
import { VocabularyStatus } from "@/types/vocabulary";
import { statusLabel } from "@/utils/status";

const statuses: VocabularyStatus[] = ["new", "learning", "mastered"];

export default function WordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, rateItem, toggleFavorite, recordStudyEvent } = useVocabulary();
  const item = items.find((candidate) => candidate.id === id);

  async function hear(text?: string) {
    const played = await speakText(text);
    if (played) recordStudyEvent({ heard: 1 });
  }

  if (!item) return <EmptyState title="Không tìm thấy từ" detail="Từ này không còn trong bộ dữ liệu hiện tại." />;

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 18, gap: 14 }}>
      <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 22, gap: 10 }}>
        <Text selectable style={{ color: colors.text, fontSize: 56, fontWeight: "900" }}>
          {item.word}
        </Text>
        <Text selectable style={{ color: colors.muted, fontSize: 20 }}>
          {item.ipa || "Chưa có phiên âm"}
        </Text>
        <Text selectable style={{ color: colors.text, fontSize: 22, fontWeight: "800", lineHeight: 30 }}>
          {item.meaning || "Chưa có nghĩa"}
        </Text>
      </View>

      <ActionButton title="Nghe từ" onPress={() => hear(item.word)} />
      {item.example ? <ActionButton title="Nghe câu ví dụ" variant="secondary" onPress={() => hear(item.example)} /> : null}
      <ActionButton title={item.isFavorite ? "Bỏ favorite" : "Favorite"} variant="secondary" onPress={() => toggleFavorite(item.id)} />

      <View style={{ backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 10 }}>
        <Info label="Câu ví dụ" value={item.example || "Chưa có câu ví dụ"} />
        <Info label="Từ loại" value={item.partOfSpeech || "Chưa có từ loại"} />
        <Info label="Topic" value={item.topic || "Chưa có topic"} />
        <Info label="Lesson" value={item.lesson || "Chưa có lesson"} />
        <Info label="Trạng thái" value={statusLabel(item.status)} />
        <Info label="Số lần ôn" value={String(item.reviewCount)} />
      </View>

      <View style={{ gap: 10 }}>
        {statuses.map((status) => (
          <ActionButton
            key={status}
            title={`Đổi sang: ${statusLabel(status)}`}
            variant={status === "mastered" ? "primary" : status === "new" ? "danger" : "secondary"}
            onPress={() => rateItem(item.id, status)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 3 }}>
      <Text selectable style={{ color: colors.muted, fontSize: 13, fontWeight: "700" }}>
        {label}
      </Text>
      <Text selectable style={{ color: colors.text, fontSize: 16, lineHeight: 23 }}>
        {value}
      </Text>
    </View>
  );
}
