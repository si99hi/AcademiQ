"use client";

import { useEffect, useState, useMemo, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, RefreshCcw, CheckCircle, XCircle } from "lucide-react";
import { getQuizById } from "@/lib/quiz-data";
import { 
  saveProgress, 
  loadProgress, 
  clearProgress, 
  shuffle, 
  shuffleOptions, 
  computeScore
} from "@/lib/quiz-store";

import OptionButton from "@/components/quiz/OptionButton";
import ProgressBar from "@/components/quiz/ProgressBar";
import QuizTimer from "@/components/quiz/QuizTimer";

type PageState = "intro" | "playing" | "results";

export default function QuizPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const quiz = useMemo(() => getQuizById(id), [id]);

  const [state, setState] = useState<PageState>("intro");
  
  // Progress tracking
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]); // stores original option indices
  const [shuffledQuestionIds, setShuffledQuestionIds] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  // Per-question state to ensure we don't re-shuffle on re-renders
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [currentCorrectIndex, setCurrentCorrectIndex] = useState(0); // index in currentOptions
  
  // Check local storage on mount
  useEffect(() => {
    if (!quiz) return;
    const existing = loadProgress(quiz.id);
    if (existing) {
      if (!existing.completed) {
        if (confirm("You have an incomplete quiz. Do you want to resume?")) {
          setShuffledQuestionIds(existing.shuffledQuestionIds);
          setSelectedAnswers(existing.selectedAnswers);
          setCurrentIndex(existing.currentIndex);
          setTimeRemaining(existing.timeRemaining);
          setState("playing");
        } else {
          clearProgress(quiz.id);
        }
      } else {
        // Option to view last results
        if (confirm("You have already completed this quiz. Do you want to view your last results?")) {
          setShuffledQuestionIds(existing.shuffledQuestionIds);
          setSelectedAnswers(existing.selectedAnswers);
          setCurrentIndex(existing.currentIndex);
          setTimeRemaining(existing.timeRemaining);
          setState("results");
        } else {
          clearProgress(quiz.id);
        }
      }
    }
  }, [quiz]);

  // Handle current question setup
  useEffect(() => {
    if (state !== "playing" || !quiz || shuffledQuestionIds.length === 0) return;

    const currentQuestionId = shuffledQuestionIds[currentIndex];
    const q = quiz.questions.find((x) => x.id === currentQuestionId);
    if (!q) return;

    // Shuffle options anew for this question
    const { options, answer } = shuffleOptions(q.options, q.answer);
    setCurrentOptions(options);
    setCurrentCorrectIndex(answer);
  }, [currentIndex, state, shuffledQuestionIds, quiz]);

  if (!quiz) {
    return notFound();
  }

  const handleStart = () => {
    const sQs = shuffle([...quiz.questions]).map((q) => q.id);
    setShuffledQuestionIds(sQs);
    setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    setCurrentIndex(0);
    setTimeRemaining(quiz.duration * 60);
    setState("playing");
  };

  const currentOriginalAnswer = selectedAnswers[currentIndex];
  const hasAnswered = currentOriginalAnswer !== null && currentOriginalAnswer !== undefined;

  const handleSelectOption = (shuffledIndex: number) => {
    if (hasAnswered) return;
    
    // Map shuffledIndex back to original index in q.options
    const currentQuestionId = shuffledQuestionIds[currentIndex];
    const q = quiz.questions.find((x) => x.id === currentQuestionId);
    if (!q) return;
    
    const selectedText = currentOptions[shuffledIndex];
    const originalIndex = q.options.findIndex(o => o === selectedText);

    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = originalIndex;
    setSelectedAnswers(newAnswers);

    // Auto update progress payload
    saveProgress({
      quizId: quiz.id,
      currentIndex,
      selectedAnswers: newAnswers,
      shuffledQuestionIds,
      startedAt: Date.now(),
      timeRemaining,
      completed: false,
    });
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      saveProgress({
        quizId: quiz.id,
        currentIndex: nextIndex,
        selectedAnswers,
        shuffledQuestionIds,
        startedAt: Date.now(),
        timeRemaining,
        completed: false,
      });
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setState("results");
    saveProgress({
      quizId: quiz.id,
      currentIndex,
      selectedAnswers,
      shuffledQuestionIds,
      startedAt: Date.now(),
      timeRemaining,
      completed: true,
    });
  };

  // 1. Intro UI
  if (state === "intro") {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: "80px", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", background: "#fff", padding: "48px", borderRadius: "16px", boxShadow: "0 10px 40px rgba(13,27,62,0.06)", border: "1px solid #e2e8f0" }}>
          <Link href="/quizzes" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#6b7280", textDecoration: "none", fontSize: "0.95rem", fontWeight: 500, marginBottom: "32px", transition: "color 0.2s" }} onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#0d1b3e")} onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#6b7280")}>
            <ArrowLeft size={16} /> Back to Quizzes
          </Link>
          
          <div style={{ display: "inline-flex", background: "#fef3c7", color: "#d97706", padding: "6px 14px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "20px" }}>
            {quiz.subject}
          </div>
          
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "3.2rem", fontWeight: 800, color: "#0d1b3e", marginTop: 0, marginBottom: "20px", lineHeight: 1.1 }}>
            {quiz.title}
          </h1>
          
          <p style={{ color: "#4b5563", fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "40px" }}>
            {quiz.description}
          </p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            <div style={{ padding: "24px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
              <span style={{ display: "block", fontSize: "0.85rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Questions</span>
              <span style={{ display: "block", fontSize: "1.8rem", color: "#0d1b3e", fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif" }}>{quiz.questions.length}</span>
            </div>
            <div style={{ padding: "24px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
              <span style={{ display: "block", fontSize: "0.85rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Duration</span>
              <span style={{ display: "block", fontSize: "1.8rem", color: "#0d1b3e", fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif" }}>{quiz.duration} Min</span>
            </div>
          </div>
          
          <button
            onClick={handleStart}
            style={{ width: "100%", padding: "20px", background: "#f5c518", color: "#0d1b3e", border: "none", borderRadius: "10px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.3rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 4px 14px rgba(245,197,24,0.3)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#fbbf24";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(245,197,24,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#f5c518";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(245,197,24,0.3)";
            }}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // 2. Playing UI
  if (state === "playing" && shuffledQuestionIds.length > 0) {
    const q = quiz.questions.find((x) => x.id === shuffledQuestionIds[currentIndex]);
    if (!q) return null;

    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: "40px", paddingBottom: "60px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
          
          {/* Header Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <Link href="/quizzes" onClick={(e) => { if(!confirm("Are you sure you want to leave? Your progress will be saved.")) e.preventDefault(); }} style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>
              <ArrowLeft size={16} /> Exit
            </Link>
            <QuizTimer 
              timeRemaining={timeRemaining} 
              onTick={setTimeRemaining} 
              onExpire={finishQuiz} 
              running={!hasAnswered} 
            />
          </div>

          <div style={{ background: "#fff", borderRadius: "16px", padding: "48px", boxShadow: "0 10px 40px rgba(13,27,62,0.05)", border: "1px solid #e2e8f0" }}>
            <ProgressBar current={currentIndex + 1} total={quiz.questions.length} />
            
            <div style={{ marginTop: "40px", marginBottom: "40px" }}>
              <h3 style={{ fontSize: "1.4rem", color: "#0d1b3e", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
                {q.question}
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {currentOptions.map((opt, i) => {
                let btnState: "idle" | "selected" | "correct" | "incorrect" = "idle";
                
                if (hasAnswered) {
                  // If we have answered, we know what the correct index in this shuffled array is
                  const selectedOriginal = selectedAnswers[currentIndex];
                  const qAnsStr = q.options[q.answer]; // string of correct answer
                  
                  if (opt === qAnsStr) {
                    btnState = "correct"; // Always show correct answer
                  } else if (q.options.findIndex(x => x === opt) === selectedOriginal) {
                    btnState = "incorrect"; // This was the wrong option they clicked
                  }
                } else {
                  // Not strictly possible to be 'selected' without 'hasAnswered' being true right away,
                  // because we lock the board as soon as an answer is clicked.
                }

                return (
                  <OptionButton
                    key={i}
                    label={["A", "B", "C", "D"][i]}
                    text={opt}
                    state={btnState}
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(i)}
                  />
                );
              })}
            </div>

            {hasAnswered && (
              <div style={{ marginTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", animation: "fade-in 0.4s ease forwards" }}>
                {q.explanation ? (
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#4b5563", background: "#f1f5f9", padding: "12px 16px", borderRadius: "8px", flex: 1, marginRight: "24px" }}>
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                ) : <div />}
                <button
                  onClick={handleNext}
                  style={{ padding: "14px 32px", background: "#0d1b3e", color: "#f5c518", border: "none", borderRadius: "8px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s ease", flexShrink: 0 }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#1a2d5a")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#0d1b3e")}
                  onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.96)")}
                  onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
                >
                  {currentIndex === quiz.questions.length - 1 ? "Finish Summary →" : "Next Question →"}
                </button>
              </div>
            )}
          </div>
        </div>
        <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    );
  }

  // 3. Results UI
  if (state === "results") {
    // Generate an array of the *original* correct answer indices corresponding to the order of `shuffledQuestionIds`.
    const correctAnswers = shuffledQuestionIds.map((id) => {
      const q = quiz.questions.find((x) => x.id === id);
      return q!.answer;
    });

    const { score, total, percentage } = computeScore(selectedAnswers, correctAnswers);
    const passed = percentage >= 60;

    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: "80px", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "48px", boxShadow: "0 10px 40px rgba(13,27,62,0.06)", border: "1px solid #e2e8f0", textAlign: "center" }}>
            
            <div style={{ display: "inline-flex", padding: "24px", borderRadius: "50%", background: passed ? "#dcfce7" : "#fee2e2", marginBottom: "24px" }}>
              {passed ? <CheckCircle size={48} color="#16a34a" /> : <XCircle size={48} color="#dc2626" />}
            </div>

            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "3rem", fontWeight: 800, color: "#0d1b3e", margin: "0 0 12px 0", lineHeight: 1 }}>
              {passed ? "Great Job!" : "Keep Practicing!"}
            </h1>
            <p style={{ color: "#64748b", fontSize: "1.1rem", marginBottom: "40px" }}>
              You have completed the <strong>{quiz.title}</strong> quiz.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "48px" }}>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Final Score</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ fontSize: "3.5rem", fontWeight: 800, color: "#0d1b3e", fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>{score}</span>
                  <span style={{ fontSize: "1.5rem", fontWeight: 600, color: "#94a3b8" }}>/{total}</span>
                </div>
              </div>
              
              <div style={{ background: "#0d1b3e", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Accuracy</span>
                <span style={{ fontSize: "3.5rem", fontWeight: 800, color: "#f5c518", fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1 }}>{percentage}%</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              <button
                onClick={() => {
                  clearProgress(quiz.id);
                  handleStart();
                }}
                style={{ padding: "16px 32px", background: "#f1f5f9", color: "#0d1b3e", border: "1px solid #e2e8f0", borderRadius: "8px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "8px" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#e2e8f0")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#f1f5f9")}
              >
                <RefreshCcw size={16} /> Retake Quiz
              </button>
              
              <Link
                href="/quizzes"
                style={{ padding: "16px 32px", background: "#f5c518", color: "#0d1b3e", border: "none", borderRadius: "8px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", textDecoration: "none", cursor: "pointer", transition: "all 0.2s ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#fbbf24")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#f5c518")}
              >
                Back to Dashboard
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return null;
}
