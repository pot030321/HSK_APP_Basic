import * as XLSX from "xlsx";
import { VocabularyItem } from "@/types/vocabulary";

type ParsedWorkbook = {
  items: VocabularyItem[];
  sheetName: string;
  warnings: string[];
};

const WORD_HEADERS = ["english word", "vocabulary", "word", "term", "từ vựng", "tu vung", "汉字", "chinese"];
const MEANING_HEADERS = ["vietnamese meaning", "meaning", "definition", "nghĩa tiếng việt", "nghia tieng viet", "nghĩa", "nghia"];
const EXAMPLE_HEADERS = ["example", "example sentence", "câu ví dụ", "vi du", "ví dụ"];
const IPA_HEADERS = ["pronunciation", "ipa", "pinyin", "phiên âm"];
const POS_HEADERS = ["part of speech", "từ loại", "tu loai", "pos"];
const TOPIC_HEADERS = ["topic", "unit", "chủ đề", "chu de"];
const LESSON_HEADERS = ["lesson", "bài", "bai"];
const ID_HEADERS = ["stt", "id", "mã", "ma"];

function normalize(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function text(value: unknown) {
  return String(value ?? "").trim();
}

function hasChinese(value: unknown) {
  return /[\u3400-\u9fff]/.test(text(value));
}

function headerMatches(header: string, candidates: string[]) {
  const normalized = normalize(header);
  return candidates.some((candidate) => normalized.includes(normalize(candidate)));
}

function scoreHeaderRow(row: unknown[]) {
  return row.reduce<number>((score, cell) => {
    const value = text(cell);
    if (!value) return score;
    if (headerMatches(value, WORD_HEADERS)) return score + 4;
    if (headerMatches(value, MEANING_HEADERS)) return score + 4;
    if (headerMatches(value, IPA_HEADERS)) return score + 2;
    if (headerMatches(value, POS_HEADERS)) return score + 2;
    if (headerMatches(value, TOPIC_HEADERS) || headerMatches(value, LESSON_HEADERS)) return score + 1;
    return score;
  }, 0);
}

function detectHeaderRow(rows: unknown[][]) {
  let bestIndex = 0;
  let bestScore = -1;
  rows.slice(0, 20).forEach((row, index) => {
    const score = scoreHeaderRow(row);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });
  return bestScore > 0 ? bestIndex : 0;
}

function findColumn(headers: string[], candidates: string[]) {
  return headers.findIndex((header) => headerMatches(header, candidates));
}

function scoreContentColumn(rows: unknown[][], index: number, kind: "word" | "meaning" | "ipa") {
  const sample = rows.slice(0, 30).map((row) => row[index]);
  if (kind === "word") {
    return sample.filter((value) => hasChinese(value) || /^[a-zA-Z][a-zA-Z -]{1,24}$/.test(text(value))).length;
  }
  if (kind === "ipa") {
    return sample.filter((value) => /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i.test(text(value))).length;
  }
  return sample.filter((value) => {
    const v = text(value);
    return v.length > 1 && !hasChinese(v) && /[a-zA-ZÀ-ỹ]/.test(v);
  }).length;
}

function bestContentColumn(rows: unknown[][], kind: "word" | "meaning" | "ipa", exclude: number[] = []) {
  const width = Math.max(...rows.map((row) => row.length), 0);
  let best = -1;
  let bestScore = -1;
  for (let index = 0; index < width; index += 1) {
    if (exclude.includes(index)) continue;
    const score = scoreContentColumn(rows, index, kind);
    if (score > bestScore) {
      best = index;
      bestScore = score;
    }
  }
  return bestScore > 0 ? best : -1;
}

function lessonFromId(id: string) {
  const match = id.match(/H(\d+)\.B(\d+)/i);
  return {
    topic: match ? `HSK ${Number(match[1])}` : undefined,
    lesson: match ? `Bài ${Number(match[2])}` : undefined
  };
}

function parseRows(rows: unknown[][], sheetName: string): ParsedWorkbook {
  const warnings: string[] = [];
  if (rows.length === 0) return { items: [], sheetName, warnings: ["Sheet không có dữ liệu."] };

  const headerIndex = detectHeaderRow(rows);
  const headers = rows[headerIndex].map(text);
  const dataRows = rows.slice(headerIndex + 1).filter((row) => row.some((cell) => text(cell)));

  let wordCol = findColumn(headers, WORD_HEADERS);
  let meaningCol = findColumn(headers, MEANING_HEADERS);
  let ipaCol = findColumn(headers, IPA_HEADERS);
  const exampleCol = findColumn(headers, EXAMPLE_HEADERS);
  const posCol = findColumn(headers, POS_HEADERS);
  const topicCol = findColumn(headers, TOPIC_HEADERS);
  const lessonCol = findColumn(headers, LESSON_HEADERS);
  const idCol = findColumn(headers, ID_HEADERS);

  if (wordCol < 0) wordCol = bestContentColumn(dataRows, "word");
  if (meaningCol < 0) meaningCol = bestContentColumn(dataRows, "meaning", [wordCol]);
  if (ipaCol < 0) ipaCol = bestContentColumn(dataRows, "ipa", [wordCol, meaningCol]);

  if (wordCol < 0) warnings.push("Không nhận diện được cột từ vựng, đã bỏ qua sheet này.");
  if (meaningCol < 0) warnings.push("Không nhận diện được cột nghĩa, các dòng thiếu nghĩa sẽ dùng fallback.");

  const seen = new Set<string>();
  const items = dataRows
    .map((row, index): VocabularyItem | null => {
      const word = text(row[wordCol]);
      if (!word || /ấn vào đây|ô nhập chữ|lần\s+\d/i.test(word)) return null;

      const idRaw = idCol >= 0 ? text(row[idCol]) : "";
      const inferred = lessonFromId(idRaw);
      const id = idRaw || `${sheetName}-${index + 1}-${word}`;
      if (seen.has(id)) return null;
      seen.add(id);

      return {
        id,
        word,
        meaning: meaningCol >= 0 ? text(row[meaningCol]) || "Chưa có nghĩa" : "Chưa có nghĩa",
        example: exampleCol >= 0 ? text(row[exampleCol]) : "",
        ipa: ipaCol >= 0 ? text(row[ipaCol]) : "",
        partOfSpeech: posCol >= 0 ? text(row[posCol]).replace("-", "") : "",
        topic: topicCol >= 0 ? text(row[topicCol]) || inferred.topic : inferred.topic,
        lesson: lessonCol >= 0 ? text(row[lessonCol]) || inferred.lesson : inferred.lesson,
        isFavorite: false,
        status: "new",
        reviewCount: 0
      };
    })
    .filter(Boolean) as VocabularyItem[];

  return { items, sheetName, warnings };
}

export async function parseExcelUri(uri: string, fileName = "workbook.xlsx"): Promise<ParsedWorkbook> {
  const response = await fetch(uri);
  const buffer = await response.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  const parsedSheets = workbook.SheetNames.map((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" });
    return parseRows(rows, sheetName);
  }).sort((a, b) => b.items.length - a.items.length);

  const best = parsedSheets[0] ?? { items: [], sheetName: fileName, warnings: ["Không đọc được workbook."] };
  if (best.items.length === 0) {
    best.warnings.push("Không tìm thấy dòng từ vựng hợp lệ trong file.");
  }
  return best;
}
