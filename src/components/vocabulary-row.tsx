import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { colors, radius } from "@/theme";
import { VocabularyItem } from "@/types/vocabulary";
import { statusLabel } from "@/utils/status";

export function VocabularyRow({ item }: { item: VocabularyItem }) {
  return (
    <Link href={`/word/${encodeURIComponent(item.id)}`} asChild>
      <Pressable
        style={({ pressed }) => ({
          opacity: pressed ? 0.75 : 1,
          backgroundColor: colors.surface,
          borderRadius: radius.sm,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 14,
          gap: 8
        })}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text selectable style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>
              {item.word}
            </Text>
            <Text selectable style={{ color: colors.muted, fontSize: 14 }}>
              {[item.ipa, item.partOfSpeech].filter(Boolean).join(" · ") || "Chưa có phiên âm"}
            </Text>
          </View>
          <Text selectable style={{ color: colors.primary, fontSize: 13, fontWeight: "700" }}>
            {statusLabel(item.status)}
          </Text>
        </View>
        <Text selectable numberOfLines={2} style={{ color: colors.text, fontSize: 15, lineHeight: 21 }}>
          {item.meaning || "Chưa có nghĩa"}
        </Text>
      </Pressable>
    </Link>
  );
}
