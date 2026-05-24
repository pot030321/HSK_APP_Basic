import { ScrollView, Text, View } from "react-native";
import { ActionButton } from "@/components/action-button";
import { RadicalItem, ToneItem, radicalItems, toneItems } from "@/data/learning-aids";
import { speakText } from "@/services/speech-service";
import { colors, radius } from "@/theme";
import { useVocabulary } from "@/context/use-vocabulary";

const chartWidth = 170;
const chartHeight = 104;
const chartPadding = 16;
const levelGap = (chartHeight - chartPadding * 2) / 4;

export default function LearningScreen() {
  const { recordStudyEvent } = useVocabulary();

  async function hear(text: string) {
    const played = await speakText(text);
    if (played) recordStudyEvent({ heard: 1 });
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 16, gap: 18 }}>
      <View style={{ gap: 8 }}>
        <Text selectable style={{ color: colors.text, fontSize: 26, fontWeight: "900" }}>
          Dấu thanh tiếng Trung
        </Text>
        <View style={{ backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 12 }}>
          <Text selectable style={{ color: colors.text, fontSize: 17, fontWeight: "900" }}>
            Nhìn dấu trước, đọc giọng sau
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {toneItems.map((tone) => (
              <View
                key={`mark-${tone.id}`}
                style={{
                  flexGrow: 1,
                  minWidth: 92,
                  borderRadius: radius.sm,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: "#fafafa",
                  padding: 10,
                  alignItems: "center",
                  gap: 4
                }}
              >
                <Text selectable style={{ color: tone.color, fontSize: 30, fontWeight: "900" }}>
                  {tone.mark}
                </Text>
                <Text selectable style={{ color: colors.muted, fontSize: 12, fontWeight: "800" }}>
                  {tone.name}
                </Text>
              </View>
            ))}
          </View>
          <Text selectable style={{ color: colors.muted, lineHeight: 21 }}>
            Cùng một âm "ma", đổi dấu là đổi giọng và đổi nghĩa. Cho bé bấm nghe từng thẻ, nhìn đường giọng rồi bắt chước.
          </Text>
        </View>

        <View style={{ gap: 12 }}>
          {toneItems.map((tone) => (
            <ToneCard key={tone.id} tone={tone} onHear={() => hear(tone.hanzi)} />
          ))}
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Text selectable style={{ color: colors.text, fontSize: 26, fontWeight: "900" }}>
          Bộ thủ cơ bản
        </Text>
        <Text selectable style={{ color: colors.muted, lineHeight: 21 }}>
          Bộ thủ giống mảnh ghép của chữ Hán. Nhìn quen bộ thủ thì đoán nghĩa và nhớ chữ nhanh hơn.
        </Text>
        <View style={{ gap: 10 }}>
          {radicalItems.map((radical) => (
            <RadicalCard key={radical.id} radical={radical} onHear={() => hear(radical.examples.map((example) => example.word).join("，"))} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function ToneCard({ tone, onHear }: { tone: ToneItem; onHear: () => void }) {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 14,
        gap: 12
      }}
    >
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        <View
          style={{
            width: 82,
            aspectRatio: 1,
            borderRadius: radius.md,
            backgroundColor: `${tone.color}18`,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: `${tone.color}55`
          }}
        >
          <Text selectable style={{ color: tone.color, fontSize: 36, fontWeight: "900" }}>
            {tone.mark}
          </Text>
          <Text selectable style={{ color: colors.muted, fontSize: 12, fontWeight: "800" }}>
            {tone.hanzi}
          </Text>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text selectable style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>
            {tone.name}: {tone.pattern}
          </Text>
          <Text selectable style={{ color: colors.muted, lineHeight: 20 }}>
            {tone.motion}. {tone.childHint}
          </Text>
          <Text selectable style={{ color: colors.text, fontWeight: "800" }}>
            {tone.hanzi} · {tone.mark} · {tone.meaning}
          </Text>
        </View>
      </View>

      <ToneChart tone={tone} />
      <ActionButton title="Nghe rồi đọc theo" variant="secondary" onPress={onHear} />
    </View>
  );
}

function ToneChart({ tone }: { tone: ToneItem }) {
  const points = tone.contour.map((level, index) => {
    const x = chartPadding + (index * (chartWidth - chartPadding * 2)) / Math.max(1, tone.contour.length - 1);
    const y = chartPadding + (5 - level) * levelGap;
    return { x, y };
  });

  return (
    <View
      style={{
        height: chartHeight,
        borderRadius: radius.sm,
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
        alignItems: "center"
      }}
    >
      <View style={{ width: chartWidth, height: chartHeight }}>
        {[1, 2, 3, 4, 5].map((level) => (
          <View
            key={level}
            style={{
              position: "absolute",
              left: chartPadding,
              right: chartPadding,
              top: chartPadding + (5 - level) * levelGap,
              height: 1,
              backgroundColor: level === 1 || level === 5 ? "#cbd5e1" : "#e2e8f0"
            }}
          />
        ))}
        <Text selectable style={{ position: "absolute", left: 0, top: 4, color: colors.muted, fontSize: 11, fontWeight: "800" }}>
          cao
        </Text>
        <Text selectable style={{ position: "absolute", left: 0, bottom: 4, color: colors.muted, fontSize: 11, fontWeight: "800" }}>
          thấp
        </Text>
        {points.slice(0, -1).map((point, index) => {
          const next = points[index + 1];
          const dx = next.x - point.x;
          const dy = next.y - point.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          return (
            <View
              key={`${tone.id}-line-${index}`}
              style={{
                position: "absolute",
                left: point.x + dx / 2 - length / 2,
                top: point.y + dy / 2 - 2,
                width: length,
                height: 4,
                borderRadius: 999,
                backgroundColor: tone.color,
                transform: [{ rotate: `${angle}deg` }]
              }}
            />
          );
        })}
        {points.map((point, index) => (
          <View
            key={`${tone.id}-dot-${index}`}
            style={{
              position: "absolute",
              left: point.x - 6,
              top: point.y - 6,
              width: 12,
              height: 12,
              borderRadius: 999,
              backgroundColor: tone.color,
              borderWidth: 2,
              borderColor: "#fff"
            }}
          />
        ))}
      </View>
    </View>
  );
}

function RadicalCard({ radical, onHear }: { radical: RadicalItem; onHear: () => void }) {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 14,
        gap: 12
      }}
    >
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        <View
          style={{
            width: 90,
            minHeight: 90,
            borderRadius: radius.md,
            backgroundColor: colors.primarySoft,
            alignItems: "center",
            justifyContent: "center",
            padding: 8
          }}
        >
          <Text selectable style={{ color: colors.ink, fontSize: 32, fontWeight: "900", textAlign: "center" }}>
            {radical.radical}
          </Text>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text selectable style={{ color: colors.primary, fontSize: 17, fontWeight: "900" }}>
            {radical.pinyin} · {radical.meaning}
          </Text>
          <Text selectable style={{ color: colors.muted, lineHeight: 20 }}>
            {radical.hint}
          </Text>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        {radical.examples.map((example) => (
          <View
            key={`${radical.id}-${example.word}`}
            style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#fafafa", borderRadius: radius.sm, padding: 10 }}
          >
            <Text selectable style={{ color: colors.text, fontSize: 24, fontWeight: "900", minWidth: 62 }}>
              {example.word}
            </Text>
            <Text selectable style={{ color: colors.muted, flex: 1, lineHeight: 20 }}>
              {example.pinyin} · {example.meaning}
            </Text>
          </View>
        ))}
      </View>

      <ActionButton title="Nghe ví dụ" variant="secondary" onPress={onHear} />
    </View>
  );
}
