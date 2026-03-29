// ─────────────────────────────────────────────────────────────
//  lib/quiz-store.ts  —  LocalStorage helpers + utilities
// ─────────────────────────────────────────────────────────────
"use client";

export interface QuizProgress {
  quizId: string;
  currentIndex: number;
  selectedAnswers: (number | null)[];
  shuffledQuestionIds: number[];
  startedAt: number; // timestamp ms
  timeRemaining: number; // seconds
  completed: boolean;
}

const STORAGE_PREFIX = "academiq_quiz_";

export function saveProgress(progress: QuizProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    `${STORAGE_PREFIX}${progress.quizId}`,
    JSON.stringify(progress)
  );
}

export function loadProgress(quizId: string): QuizProgress | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(`${STORAGE_PREFIX}${quizId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizProgress;
  } catch {
    return null;
  }
}

export function clearProgress(quizId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${STORAGE_PREFIX}${quizId}`);
}

/** Fisher-Yates shuffle — returns a NEW shuffled array */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Shuffle options but keep the correct answer index updated */
export function shuffleOptions(
  options: string[],
  correctIndex: number
): { options: string[]; answer: number } {
  const indexed = options.map((o, i) => ({ text: o, original: i }));
  const shuffled = shuffle(indexed);
  return {
    options: shuffled.map((o) => o.text),
    answer: shuffled.findIndex((o) => o.original === correctIndex),
  };
}

/** Compute score from answers vs correct answers */
export function computeScore(
  selectedAnswers: (number | null)[],
  correctAnswers: number[]
): { score: number; total: number; percentage: number } {
  const total = correctAnswers.length;
  const score = selectedAnswers.reduce<number>((acc, ans, i) => {
    return acc + (ans === correctAnswers[i] ? 1 : 0);
  }, 0);
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100);
  return { score, total, percentage };
}

/** Format seconds → MM:SS */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
