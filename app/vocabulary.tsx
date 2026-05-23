import { useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { EmptyState } from "@/components/empty-state";
import { VocabularyRow } from "@/components/vocabulary-row";
import { colors, radius } from "@/theme";
import { useVocabulary } from "@/context/use-vocabulary";
import { VocabularyStatus } from "@/types/vocabulary";
import { statusLabel } from "@/utils/status";

const statusOptions: Array<VocabularyStatus | "all"> = ["all", "new", "learning", "mastered"];

export default function VocabularyScreen() {
  const { items } = useVocabulary();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<VocabularyStatus | "all">("all");
  const [lesson, setLesson] = useState("all");

  const lessons = useMemo(
    () => ["all", ...Array.from(new Set(items.map((item) => item.lesson).filter((value): value is string => Boolean(value))))],
    [items]
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery =
        !q ||
        item.word.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.ipa?.toLowerCase().includes(q);
      return matchesQuery && (status === "all" || item.status === status) && (lesson === "all" || item.lesson === lesson);
    });
  }, [items, lesson, query, status]);

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={filtered}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16, gap: 10 }}
      ListHeaderComponent={
        <View style={{ gap: 12, paddingBottom: 4 }}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm từ, pinyin hoặc nghĩa..."
            placeholderTextColor={colors.muted}
            style={{
              minHeight: 48,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.surface,
              paddingHorizontal: 14,
              color: colors.text,
              fontSize: 16
            }}
          />
          <FlatList
            horizontal
            data={statusOptions}
            keyExtractor={(item) => item}
            contentContainerStyle={{ gap: 8 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Text
                selectable
                onPress={() => setStatus(item)}
                style={{
                  overflow: "hidden",
                  borderRadius: radius.sm,
                  paddingVertical: 9,
                  paddingHorizontal: 12,
                  color: status === item ? "#fff" : colors.text,
                  backgroundColor: status === item ? colors.primary : colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  fontWeight: "700"
                }}
              >
                {item === "all" ? "Tất cả" : statusLabel(item)}
              </Text>
            )}
          />
          <FlatList
            horizontal
            data={lessons}
            keyExtractor={(item) => item}
            contentContainerStyle={{ gap: 8 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Text
                selectable
                onPress={() => setLesson(item)}
                style={{
                  overflow: "hidden",
                  borderRadius: radius.sm,
                  paddingVertical: 9,
                  paddingHorizontal: 12,
                  color: lesson === item ? "#fff" : colors.text,
                  backgroundColor: lesson === item ? colors.primary : colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  fontWeight: "700"
                }}
              >
                {item === "all" ? "Mọi bài" : item}
              </Text>
            )}
          />
          <Text selectable style={{ color: colors.muted, fontVariant: ["tabular-nums"] }}>
            {filtered.length} từ
          </Text>
        </View>
      }
      ListEmptyComponent={<EmptyState title="Không có từ phù hợp" detail="Thử đổi bộ lọc hoặc từ khóa tìm kiếm." />}
      renderItem={({ item }) => <VocabularyRow item={item} />}
    />
  );
}
