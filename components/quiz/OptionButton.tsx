// components/quiz/OptionButton.tsx
"use client";

interface OptionButtonProps {
  label: string;
  text: string;
  state: "idle" | "selected" | "correct" | "incorrect";
  disabled: boolean;
  onClick: () => void;
}

export default function OptionButton({
  label,
  text,
  state,
  disabled,
  onClick,
}: OptionButtonProps) {
  const styles: Record<string, React.CSSProperties> = {
    idle: {
      background: "#fff",
      color: "#0d1b3e",
      border: "2px solid #d1d9ef",
    },
    selected: {
      background: "#0d1b3e",
      color: "#f5c518",
      border: "2px solid #0d1b3e",
    },
    correct: {
      background: "#16a34a",
      color: "#fff",
      border: "2px solid #16a34a",
    },
    incorrect: {
      background: "#dc2626",
      color: "#fff",
      border: "2px solid #dc2626",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[state],
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "14px 18px",
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.95rem",
        fontWeight: 500,
        textAlign: "left",
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.18s ease",
        outline: "none",
        opacity: disabled && state === "idle" ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled && state === "idle") {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#f5c518";
          (e.currentTarget as HTMLButtonElement).style.background = "#fffbea";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && state === "idle") {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d9ef";
          (e.currentTarget as HTMLButtonElement).style.background = "#fff";
        }
      }}
    >
      {/* Option label badge */}
      <span
        style={{
          flexShrink: 0,
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: "0.9rem",
          background:
            state === "idle"
              ? "#f0f2f5"
              : state === "selected"
              ? "#f5c518"
              : "rgba(255,255,255,0.25)",
          color:
            state === "idle"
              ? "#0d1b3e"
              : state === "selected"
              ? "#0d1b3e"
              : "#fff",
        }}
      >
        {label}
      </span>
      <span style={{ flex: 1 }}>{text}</span>

      {/* State icon */}
      {state === "correct" && <span style={{ fontSize: "1.1rem" }}>✓</span>}
      {state === "incorrect" && <span style={{ fontSize: "1.1rem" }}>✗</span>}
    </button>
  );
}
