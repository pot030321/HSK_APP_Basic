import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { ActionButton } from "@/components/action-button";
import { StatTile } from "@/components/stat-tile";
import { parseExcelUri } from "@/services/excel-import-service";
import { colors } from "@/theme";
import { useVocabulary } from "@/context/use-vocabulary";

export default function HomeScreen() {
  const { stats, loading, error, setImportedVocabulary } = useVocabulary();
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<string>();

  async function importExcel() {
    setImporting(true);
    setMessage(undefined);
    try {
      const picked = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel"
        ],
        copyToCacheDirectory: true
      });
      if (picked.canceled) return;
      const asset = picked.assets[0];
      const result = await parseExcelUri(asset.uri, asset.name);
      if (!result.items.length) {
        setMessage(result.warnings.join(" ") || "Không import được dữ liệu.");
        return;
      }
      await setImportedVocabulary(result.items);
      setMessage(`Đã import ${result.items.length} từ từ sheet "${result.sheetName}".`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Import Excel thất bại.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 18, gap: 18 }}>
      <View style={{ gap: 6 }}>
        <Text selectable style={{ fontSize: 28, fontWeight: "900", color: colors.text }}>
          Học từ vựng mỗi ngày
        </Text>
        <Text selectable style={{ fontSize: 15, color: colors.muted, lineHeight: 21 }}>
          Dữ liệu hiện tại được chuẩn hóa từ file HSK1 Leyi. Có thể import Excel khác khi cần.
        </Text>
      </View>

      {loading ? <ActivityIndicator color={colors.primary} /> : null}
      {error ? <Text selectable style={{ color: colors.danger }}>{error}</Text> : null}

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <StatTile label="Tổng số từ" value={stats.total} />
        <StatTile label="Từ mới" value={stats.new} />
        <StatTile label="Đang học" value={stats.learning} />
        <StatTile label="Đã thuộc" value={stats.mastered} />
      </View>

      <View style={{ gap: 10 }}>
        <ActionButton title="Bắt đầu học flashcard" onPress={() => router.push("/flashcards")} />
        <ActionButton title="Luyện quiz" variant="secondary" onPress={() => router.push("/quiz")} />
        <ActionButton title="Xem danh sách từ" variant="secondary" onPress={() => router.push("/vocabulary")} />
        <ActionButton title="Import Excel" variant="secondary" onPress={importExcel} loading={importing} />
      </View>

      {message ? (
        <Text selectable style={{ color: message.startsWith("Đã") ? colors.success : colors.danger, lineHeight: 20 }}>
          {message}
        </Text>
      ) : null}
    </ScrollView>
  );
}
