import { Pressable, Text, ActivityIndicator, ViewStyle } from "react-native";
import { colors, radius } from "@/theme";

type Props = {
  title: string;
  onPress?: () => void | Promise<void>;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export function ActionButton({ title, onPress, variant = "primary", disabled, loading, style }: Props) {
  const backgroundColor =
    variant === "primary" ? colors.primary : variant === "danger" ? colors.danger : colors.surface;
  const color = variant === "secondary" ? colors.text : "#ffffff";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          minHeight: 48,
          opacity: disabled ? 0.5 : pressed ? 0.82 : 1,
          borderRadius: radius.md,
          borderWidth: variant === "secondary" ? 1 : 0,
          borderColor: colors.border,
          backgroundColor,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 16,
          flexDirection: "row",
          gap: 8
        },
        style
      ]}
    >
      {loading ? <ActivityIndicator color={color} /> : null}
      <Text selectable style={{ color, fontSize: 16, fontWeight: "700" }}>
        {title}
      </Text>
    </Pressable>
  );
}
