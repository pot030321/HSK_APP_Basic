import { VocabularyStatus } from "@/types/vocabulary";

export function statusLabel(status: VocabularyStatus) {
  if (status === "mastered") return "Đã thuộc";
  if (status === "learning") return "Đang học";
  return "Từ mới";
}

export function nextReviewCount(status: VocabularyStatus, current: number) {
  if (status === "new") return Math.max(0, current);
  if (status === "learning") return Math.max(1, current + 1);
  return Math.max(5, current + 1);
}
