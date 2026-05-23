import { Text, View } from "react-native";
import { colors } from "@/theme";

export function EmptyState({ title, detail }: { title: string; detail?: string }) {
  return (
    <View style={{ padding: 24, alignItems: "center", gap: 8 }}>
      <Text selectable style={{ fontSize: 18, fontWeight: "800", color: colors.text, textAlign: "center" }}>
        {title}
      </Text>
      {detail ? (
        <Text selectable style={{ fontSize: 14, color: colors.muted, textAlign: "center", lineHeight: 20 }}>
          {detail}
        </Text>
      ) : null}
    </View>
  );
}
