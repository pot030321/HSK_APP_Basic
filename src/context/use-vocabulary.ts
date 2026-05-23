import { useContext } from "react";
import { VocabularyContext } from "@/context/vocabulary-context";

export function useVocabulary() {
  const value = useContext(VocabularyContext);
  if (!value) throw new Error("useVocabulary must be used inside VocabularyProvider");
  return value;
}
