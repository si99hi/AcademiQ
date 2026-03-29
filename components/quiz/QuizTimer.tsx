// components/quiz/QuizTimer.tsx
"use client";

import { useEffect, useRef } from "react";
import { formatTime } from "@/lib/quiz-store";
import { Clock } from "lucide-react";

interface QuizTimerProps {
  timeRemaining: number; // seconds
  onTick: (newTime: number) => void;
  onExpire: () => void;
  running: boolean;
}

export default function QuizTimer({
  timeRemaining,
  onTick,
  onExpire,
  running,
}: QuizTimerProps) {
  const timeRef = useRef(timeRemaining);
  timeRef.current = timeRemaining;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const next = timeRef.current - 1;
      if (next <= 0) {
        clearInterval(id);
        onTick(0);
        onExpire();
      } else {
        onTick(next);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [running, onTick, onExpire]);

  const isUrgent = timeRemaining <= 60;
  const isWarning = timeRemaining <= 120;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        background: isUrgent
          ? "#dc2626"
          : isWarning
          ? "#f59e0b"
          : "#0d1b3e",
        color: "#fff",
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 700,
        fontSize: "1.15rem",
        letterSpacing: "0.04em",
        transition: "background 0.4s ease",
        animation: isUrgent ? "pulse-urgent 1s ease-in-out infinite" : "none",
      }}
    >
      <Clock size={16} />
      <span>{formatTime(timeRemaining)}</span>

      <style>{`
        @keyframes pulse-urgent {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
