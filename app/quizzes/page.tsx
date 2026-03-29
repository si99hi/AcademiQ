"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { quizzes } from "@/lib/quiz-data";
import QuizCard from "@/components/quiz/QuizCard";

export default function QuizzesPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", paddingBottom: "60px" }}>
      {/* Navy Header */}
      <div style={{ background: "#0d1b3e", color: "#fff", paddingTop: "60px", paddingBottom: "60px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#9ca3af",
              fontSize: "0.85rem",
              textDecoration: "none",
              marginBottom: "24px",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#9ca3af")}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div
              style={{
                background: "#f5c518",
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              <BookOpen color="#0d1b3e" size={24} />
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: "2.5rem",
                  margin: 0,
                  lineHeight: 1.1,
                  letterSpacing: "0.02em",
                }}
              >
                Assessments & Quizzes
              </h1>
              <p style={{ color: "#9ca3af", margin: "4px 0 0 0", fontSize: "0.95rem" }}>
                Test your knowledge across Physics, Chemistry, and Mathematics.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gold Accent Strip */}
      <div style={{ height: "4px", background: "#f5c518" }} />

      {/* Quiz Grid */}
      <div style={{ maxWidth: "1200px", margin: "-30px auto 0", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {quizzes.map((quiz, idx) => (
            <QuizCard key={quiz.id} quiz={quiz} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
