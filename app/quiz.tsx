import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { ActionButton } from "@/components/action-button";
import { EmptyState } from "@/components/empty-state";
import { speakText } from "@/services/speech-service";
import { colors, radius } from "@/theme";
import { useVocabulary } from "@/context/use-vocabulary";
import { VocabularyItem } from "@/types/vocabulary";

type Question = {
  item: VocabularyItem;
  options: QuizOption[];
};

type QuizOption = {
  id: string;
  label: string;
  isCorrect: boolean;
};

function shuffle<T>(values: T[]) {
  return [...values].sort(() => Math.random() - 0.5);
}

function buildQuestions(items: VocabularyItem[]) {
  const source = shuffle(items).slice(0, Math.min(10, items.length));
  return source.map((item) => {
    const correctLabel = item.meaning || "Chưa có nghĩa";
    const wrong = shuffle(items.filter((candidate) => candidate.id !== item.id && candidate.meaning !== item.meaning))
      .slice(0, 3)
      .map((candidate) => ({
        id: candidate.id,
        label: candidate.meaning || "Chưa có nghĩa",
        isCorrect: false
      }));
    return {
      item,
      options: shuffle([{ id: item.id, label: correctLabel, isCorrect: true }, ...wrong])
    };
  });
}

export default function QuizScreen() {
  const { items, rateItem, recordStudyEvent } = useVocabulary();
  const [questions, setQuestions] = useState<Question[]>(() => buildQuestions(items));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<QuizOption>();
  const [score, setScore] = useState(0);
  const question: Question | undefined = questions[index];
  const done = index >= questions.length;

  async function choose(option: QuizOption) {
    if (!question || selected) return;
    setSelected(option);
    recordStudyEvent({ quizAnswered: 1, quizCorrect: option.isCorrect ? 1 : 0 });
    if (option.isCorrect) {
      setScore((value) => value + 1);
      await rateItem(question.item.id, "learning");
    }
  }

  async function hear(text?: string) {
    const played = await speakText(text);
    if (played) recordStudyEvent({ heard: 1 });
  }

  function next() {
    setSelected(undefined);
    setIndex((value) => value + 1);
  }

  function restart() {
    setQuestions(buildQuestions(items));
    setIndex(0);
    setScore(0);
    setSelected(undefined);
  }

  if (items.length < 4) return <EmptyState title="Cần ít nhất 4 từ" detail="Quiz cần đủ lựa chọn để tạo câu hỏi." />;

  if (done) {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 18, gap: 16 }}>
        <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: 24, gap: 12, alignItems: "center" }}>
          <Text selectable style={{ fontSize: 22, fontWeight: "900", color: colors.text }}>
            Hoàn thành quiz
          </Text>
          <Text selectable style={{ fontSize: 46, fontWeight: "900", color: colors.primary, fontVariant: ["tabular-nums"] }}>
            {score}/{questions.length}
          </Text>
        </View>
        <ActionButton title="Làm lại" onPress={restart} />
      </ScrollView>
    );
  }

  if (!question) return null;

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 18, gap: 16 }}>
      <Text selectable style={{ color: colors.muted, fontVariant: ["tabular-nums"] }}>
        Câu {index + 1} / {questions.length}
      </Text>
      <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 22, gap: 14 }}>
        <Text selectable style={{ color: colors.muted, fontWeight: "700" }}>
          Chọn nghĩa đúng
        </Text>
        <Text selectable style={{ color: colors.text, fontSize: 48, fontWeight: "900" }}>
          {question.item.word}
        </Text>
        <Text selectable style={{ color: colors.muted, fontSize: 18 }}>
          {question.item.ipa || "Chưa có phiên âm"}
        </Text>
      </View>
      <ActionButton title="Nghe phát âm" variant="secondary" onPress={() => hear(question.item.word)} />
      <View style={{ gap: 10 }}>
        {question.options.map((option) => {
          const isCorrect = option.isCorrect;
          const isSelected = option.id === selected?.id;
          const backgroundColor = selected
            ? isCorrect
              ? colors.success
              : isSelected
                ? colors.danger
                : colors.surface
            : colors.surface;
          const color = selected && (isCorrect || isSelected) ? "#fff" : colors.text;
          return (
            <Text
              selectable
              key={option.id}
              onPress={() => choose(option)}
              style={{
                overflow: "hidden",
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor,
                color,
                padding: 15,
                fontSize: 16,
                lineHeight: 22,
                fontWeight: "700"
              }}
            >
              {option.label}
            </Text>
          );
        })}
      </View>
      {selected ? (
        <>
          <Text selectable style={{ color: selected.isCorrect ? colors.success : colors.danger, fontWeight: "800" }}>
            {selected.isCorrect ? "Đúng" : `Sai. Đáp án: ${question.item.meaning}`}
          </Text>
          <ActionButton title="Câu tiếp theo" onPress={next} />
        </>
      ) : null}
    </ScrollView>
  );
}
