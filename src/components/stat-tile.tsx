import { Text, View } from "react-native";
import { colors, radius } from "@/theme";

type Props = {
  label: string;
  value: number;
};

export function StatTile({ label, value }: Props) {
  return (
    <View
      style={{
        flex: 1,
        minWidth: "45%",
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 14,
        gap: 6
      }}
    >
      <Text selectable style={{ color: colors.muted, fontSize: 13 }}>
        {label}
      </Text>
      <Text selectable style={{ color: colors.ink, fontSize: 28, fontWeight: "800", fontVariant: ["tabular-nums"] }}>
        {value}
      </Text>
    </View>
  );
}
