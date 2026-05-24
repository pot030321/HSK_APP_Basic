import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";
import { initialVocabulary } from "@/data/vocabulary";
import { loadVocabulary, saveVocabulary } from "@/services/storage-service";
import { loadStudyStats, saveStudyStats } from "@/services/study-service";
import { StudyEvent, StudyStats } from "@/types/study";
import { VocabularyItem, VocabularyStatus } from "@/types/vocabulary";
import { nextReviewCount } from "@/utils/status";
import { applyStudyEvent, createInitialStudyStats, getTodayStudy, getWeekSeconds } from "@/utils/study";

type VocabularyContextValue = {
  items: VocabularyItem[];
  loading: boolean;
  error?: string;
  stats: {
    total: number;
    new: number;
    learning: number;
    mastered: number;
  };
  study: {
    stats: StudyStats;
    todaySeconds: number;
    weekSeconds: number;
    todayReviews: number;
    todayHeard: number;
    todayQuizAnswered: number;
    todayQuizCorrect: number;
  };
  setImportedVocabulary: (items: VocabularyItem[]) => Promise<void>;
  updateItem: (id: string, patch: Partial<VocabularyItem>) => Promise<void>;
  rateItem: (id: string, status: VocabularyStatus) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  recordStudyEvent: (event: StudyEvent) => void;
};

export const VocabularyContext = createContext<VocabularyContextValue | null>(null);

export function VocabularyProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<VocabularyItem[]>(initialVocabulary);
  const [studyStats, setStudyStats] = useState<StudyStats>(() => createInitialStudyStats());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const activeSinceRef = useRef(Date.now());

  useEffect(() => {
    let mounted = true;
    loadVocabulary()
      .then((saved) => {
        if (mounted && saved?.length) setItems(saved);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Không đọc được dữ liệu đã lưu."))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    loadStudyStats()
      .then((saved) => {
        if (mounted) setStudyStats(saved);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback(async (nextItems: VocabularyItem[]) => {
    setItems(nextItems);
    await saveVocabulary(nextItems);
  }, []);

  const recordStudyEvent = useCallback((event: StudyEvent) => {
    setStudyStats((current) => {
      const next = applyStudyEvent(current, event);
      if (next === current) return current;
      saveStudyStats(next).catch(() => undefined);
      return next;
    });
  }, []);

  const flushStudyTime = useCallback(() => {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - activeSinceRef.current) / 1000);
    if (elapsedSeconds >= 5) {
      recordStudyEvent({ seconds: Math.min(elapsedSeconds, 5 * 60) });
      activeSinceRef.current = now;
    }
  }, [recordStudyEvent]);

  useEffect(() => {
    const interval = setInterval(flushStudyTime, 30000);
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        activeSinceRef.current = Date.now();
      } else {
        flushStudyTime();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [flushStudyTime]);

  const setImportedVocabulary = useCallback(
    async (nextItems: VocabularyItem[]) => {
      await persist(nextItems);
    },
    [persist]
  );

  const updateItem = useCallback(
    async (id: string, patch: Partial<VocabularyItem>) => {
      await persist(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    },
    [items, persist]
  );

  const rateItem = useCallback(
    async (id: string, status: VocabularyStatus) => {
      const now = new Date().toISOString();
      await persist(
        items.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
                reviewCount: nextReviewCount(status, item.reviewCount),
                lastReviewedAt: now
              }
            : item
        )
      );
      recordStudyEvent({ reviews: 1 });
    },
    [items, persist, recordStudyEvent]
  );

  const toggleFavorite = useCallback(
    async (id: string) => {
      await persist(items.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)));
    },
    [items, persist]
  );

  const stats = useMemo(
    () => ({
      total: items.length,
      new: items.filter((item) => item.status === "new").length,
      learning: items.filter((item) => item.status === "learning").length,
      mastered: items.filter((item) => item.status === "mastered").length
    }),
    [items]
  );

  const study = useMemo(() => {
    const today = getTodayStudy(studyStats);
    return {
      stats: studyStats,
      todaySeconds: today.seconds,
      weekSeconds: getWeekSeconds(studyStats),
      todayReviews: today.reviews,
      todayHeard: today.heard,
      todayQuizAnswered: today.quizAnswered,
      todayQuizCorrect: today.quizCorrect
    };
  }, [studyStats]);

  const value = useMemo(
    () => ({ items, loading, error, stats, study, setImportedVocabulary, updateItem, rateItem, toggleFavorite, recordStudyEvent }),
    [items, loading, error, stats, study, setImportedVocabulary, updateItem, rateItem, toggleFavorite, recordStudyEvent]
  );

  return <VocabularyContext.Provider value={value}>{children}</VocabularyContext.Provider>;
}
