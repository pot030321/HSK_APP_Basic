import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { initialVocabulary } from "@/data/vocabulary";
import { loadVocabulary, saveVocabulary } from "@/services/storage-service";
import { VocabularyItem, VocabularyStatus } from "@/types/vocabulary";
import { nextReviewCount } from "@/utils/status";

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
  setImportedVocabulary: (items: VocabularyItem[]) => Promise<void>;
  updateItem: (id: string, patch: Partial<VocabularyItem>) => Promise<void>;
  rateItem: (id: string, status: VocabularyStatus) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
};

export const VocabularyContext = createContext<VocabularyContextValue | null>(null);

export function VocabularyProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<VocabularyItem[]>(initialVocabulary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

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

  const persist = useCallback(async (nextItems: VocabularyItem[]) => {
    setItems(nextItems);
    await saveVocabulary(nextItems);
  }, []);

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
    },
    [items, persist]
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

  const value = useMemo(
    () => ({ items, loading, error, stats, setImportedVocabulary, updateItem, rateItem, toggleFavorite }),
    [items, loading, error, stats, setImportedVocabulary, updateItem, rateItem, toggleFavorite]
  );

  return <VocabularyContext.Provider value={value}>{children}</VocabularyContext.Provider>;
}
