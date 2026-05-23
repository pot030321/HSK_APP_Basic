export type VocabularyStatus = "new" | "learning" | "mastered";

export type VocabularyItem = {
  id: string;
  word: string;
  meaning: string;
  example?: string;
  ipa?: string;
  partOfSpeech?: string;
  topic?: string;
  lesson?: string;
  isFavorite: boolean;
  status: VocabularyStatus;
  reviewCount: number;
  lastReviewedAt?: string;
};

export type VocabularyStats = {
  total: number;
  new: number;
  learning: number;
  mastered: number;
};
