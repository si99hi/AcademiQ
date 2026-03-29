// components/quiz/ProgressBar.tsx
"use client";

interface ProgressBarProps {
  current: number; // 1-based
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "6px",
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "0.8rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "#6b7280",
          textTransform: "uppercase",
        }}
      >
        <span>
          Question {current} of {total}
        </span>
        <span style={{ color: "#f5c518" }}>{pct}%</span>
      </div>
      <div
        style={{
          height: "6px",
          background: "#e5e9f0",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "linear-gradient(90deg, #0d1b3e 0%, #f5c518 100%)",
            transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
    </div>
  );
}
