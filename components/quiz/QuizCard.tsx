// components/quiz/QuizCard.tsx
"use client";

import Link from "next/link";
import { Clock, BookOpen, CheckCircle, ChevronRight } from "lucide-react";
import type { Quiz } from "@/lib/quiz-data";

const subjectColors: Record<string, { bg: string; text: string }> = {
  Physics: { bg: "#1a2d5a", text: "#f5c518" },
  Chemistry: { bg: "#162040", text: "#f5c518" },
  Mathematics: { bg: "#0d2240", text: "#f5c518" },
};

interface QuizCardProps {
  quiz: Quiz;
  index: number;
}

export default function QuizCard({ quiz, index }: QuizCardProps) {
  const colors = subjectColors[quiz.subject] || { bg: "#0d1b3e", text: "#f5c518" };

  return (
    <div
      className="quiz-card-enter"
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 12px rgba(13,27,62,0.07)",
        animationDelay: `${index * 80}ms`,
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 32px rgba(13,27,62,0.14)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 2px 12px rgba(13,27,62,0.07)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Gold top border accent */}
      <div style={{ height: "4px", background: "#f5c518", flexShrink: 0 }} />

      {/* Header */}
      <div
        style={{
          padding: "20px 24px 16px",
          background: colors.bg,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(255,255,255,0.12)",
            padding: "3px 10px",
            marginBottom: "10px",
          }}
        >
          <BookOpen size={11} color={colors.text} />
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: colors.text,
            }}
          >
            {quiz.subject}
          </span>
        </div>
        <h3
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: "1.35rem",
            color: "#fff",
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          {quiz.title}
        </h3>
      </div>

      {/* Body */}
      <div style={{ padding: "18px 24px", flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
        <p
          style={{
            color: "#6b7280",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {quiz.description}
        </p>

        {/* Meta row */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            paddingTop: "4px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle size={13} color="#0d1b3e" />
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#374151",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {quiz.questions.length} Questions
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Clock size={13} color="#0d1b3e" />
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "#374151",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {quiz.duration} Min
            </span>
          </div>
        </div>

        {/* Difficulty dots */}
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {[1, 2, 3, 4, 5].map((dot) => (
            <div
              key={dot}
              style={{
                width: "8px",
                height: "8px",
                background: dot <= 3 ? "#0d1b3e" : "#e2e8f0",
              }}
            />
          ))}
          <span
            style={{
              marginLeft: "6px",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Medium
          </span>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "0 24px 24px", flexShrink: 0 }}>
        <Link
          href={`/quizzes/${quiz.id}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "13px 0",
            background: "#f5c518",
            color: "#0d1b3e",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: "0.95rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "background 0.18s ease",
            width: "100%",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "#fbbf24";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "#f5c518";
          }}
        >
          Start Quiz <ChevronRight size={16} />
        </Link>
      </div>

      <style>{`
        .quiz-card-enter {
          animation: quiz-card-slide 0.5s ease-out both;
        }
        @keyframes quiz-card-slide {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
