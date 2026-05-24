import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import { ActionButton } from "@/components/action-button";
import { StatTile } from "@/components/stat-tile";
import { loadAdminSettings, saveAdminSettings } from "@/services/study-service";
import { colors, radius } from "@/theme";
import { useVocabulary } from "@/context/use-vocabulary";
import { AdminSettings, StudyDay } from "@/types/study";
import { formatGoalProgress, formatStudyDuration, getDateKey } from "@/utils/study";

const PRIVATE_PAGE_PASSWORD = "031203zZ@";

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getLastSevenDays(days: StudyDay[]) {
  const byDate = new Map(days.map((day) => [day.date, day]));
  return Array.from({ length: 7 }, (_, index) => {
    const date = getDateKey(addDays(new Date(), index - 6));
    return (
      byDate.get(date) ?? {
        date,
        seconds: 0,
        reviews: 0,
        heard: 0,
        quizAnswered: 0,
        quizCorrect: 0
      }
    );
  });
}

export default function AdminScreen() {
  const { study } = useVocabulary();
  const [settings, setSettings] = useState<AdminSettings>({ dailyGoalMinutes: 20 });
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [goalMinutes, setGoalMinutes] = useState("20");

  useEffect(() => {
    let mounted = true;
    loadAdminSettings()
      .then((next) => {
        if (!mounted) return;
        setSettings(next);
        setGoalMinutes(String(next.dailyGoalMinutes));
      })
      .finally(() => {
        if (mounted) setSettingsLoaded(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const progress = formatGoalProgress(study.todaySeconds, Number(goalMinutes) * 60 || settings.dailyGoalMinutes * 60);
  const lastSevenDays = useMemo(() => getLastSevenDays(study.stats.days), [study.stats.days]);
  const maxDaySeconds = Math.max(60, ...lastSevenDays.map((day) => day.seconds));

  async function unlock() {
    if (pin === PRIVATE_PAGE_PASSWORD) {
      setUnlocked(true);
      setPin("");
      return;
    }
    Alert.alert("Không đúng", "Thử lại.");
  }

  async function saveSetup() {
    const normalizedGoal = Math.min(180, Math.max(5, Number(goalMinutes) || 20));

    const next = {
      dailyGoalMinutes: normalizedGoal
    };
    await saveAdminSettings(next);
    setSettings(next);
    setGoalMinutes(String(normalizedGoal));
    setUnlocked(true);
    Alert.alert("Đã lưu", "Thiết lập đã được cập nhật.");
  }

  if (!settingsLoaded) {
    return (
      <View style={{ padding: 18 }}>
        <Text selectable style={{ color: colors.muted }}>
          Đang tải...
        </Text>
      </View>
    );
  }

  if (!unlocked) {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 18, gap: 14 }}>
        <Text selectable style={{ color: colors.text, fontSize: 26, fontWeight: "900" }}>
          🙂
        </Text>
        <Text selectable style={{ color: colors.muted, lineHeight: 21 }}>
          Nhập đúng để mở.
        </Text>
        <TextInput
          value={pin}
          onChangeText={setPin}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          placeholder="..."
          placeholderTextColor={colors.muted}
          style={{
            minHeight: 50,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            paddingHorizontal: 14,
            color: colors.text,
            fontSize: 18
          }}
        />
        <ActionButton title="Mở" onPress={unlock} />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 18, gap: 16 }}>
      <View style={{ gap: 6 }}>
        <Text selectable style={{ color: colors.text, fontSize: 26, fontWeight: "900" }}>
          Theo dõi học tập
        </Text>
        <Text selectable style={{ color: colors.muted, lineHeight: 21 }}>
          Dữ liệu lưu trên máy này, dùng để kiểm tra thói quen học mỗi ngày.
        </Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <StatTile label="Hôm nay" value={formatStudyDuration(study.todaySeconds)} />
        <StatTile label="Tuần này" value={formatStudyDuration(study.weekSeconds)} />
        <StatTile label="Chuỗi hiện tại" value={`${study.stats.currentStreak} ngày`} />
        <StatTile label="Chuỗi tốt nhất" value={`${study.stats.bestStreak} ngày`} />
        <StatTile label="Lượt ôn" value={study.todayReviews} />
        <StatTile label="Lượt nghe" value={study.todayHeard} />
      </View>

      <View style={{ backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
          <Text selectable style={{ color: colors.text, fontWeight: "900", fontSize: 17 }}>
            Mục tiêu hôm nay
          </Text>
          <Text selectable style={{ color: colors.primary, fontWeight: "900", fontVariant: ["tabular-nums"] }}>
            {progress}%
          </Text>
        </View>
        <View style={{ height: 10, borderRadius: 999, backgroundColor: colors.primarySoft, overflow: "hidden" }}>
          <View style={{ width: `${progress}%`, height: "100%", backgroundColor: colors.primary }} />
        </View>
        <Text selectable style={{ color: colors.muted, lineHeight: 20 }}>
          {formatStudyDuration(study.todaySeconds)} / {formatStudyDuration((Number(goalMinutes) || settings.dailyGoalMinutes) * 60)}
        </Text>
      </View>

      <View style={{ backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 12 }}>
        <Text selectable style={{ color: colors.text, fontWeight: "900", fontSize: 17 }}>
          7 ngày gần nhất
        </Text>
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8, height: 120 }}>
          {lastSevenDays.map((day) => {
            const height = Math.max(8, Math.round((day.seconds / maxDaySeconds) * 90));
            return (
              <View key={day.date} style={{ flex: 1, alignItems: "center", gap: 6 }}>
                <View style={{ width: "100%", height, borderRadius: radius.sm, backgroundColor: day.seconds > 0 ? colors.primary : colors.border }} />
                <Text selectable style={{ color: colors.muted, fontSize: 11, fontWeight: "800" }}>
                  {day.date.slice(5)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={{ backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 12 }}>
        <Text selectable style={{ color: colors.text, fontWeight: "900", fontSize: 17 }}>
          Thiết lập
        </Text>
        <View style={{ gap: 6 }}>
          <Text selectable style={{ color: colors.muted, fontWeight: "800" }}>
            Mục tiêu mỗi ngày (phút)
          </Text>
          <TextInput
            value={goalMinutes}
            onChangeText={setGoalMinutes}
            keyboardType="number-pad"
            placeholder="20"
            placeholderTextColor={colors.muted}
            style={{
              minHeight: 48,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border,
              paddingHorizontal: 14,
              color: colors.text,
              fontSize: 16
            }}
          />
        </View>
        <ActionButton title="Lưu thiết lập" onPress={saveSetup} />
      </View>
    </ScrollView>
  );
}
