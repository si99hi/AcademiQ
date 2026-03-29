"use client"

import { useRouter } from "next/navigation"

const subjects = [
  {
    slug: "physics",
    label: "PHYSICS",
    desc: "Explore the laws of nature",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
        <circle cx="32" cy="32" r="10" stroke="#f5c518" strokeWidth="3" />
        <ellipse cx="32" cy="32" rx="28" ry="11" stroke="#f5c518" strokeWidth="2.5" />
        <ellipse cx="32" cy="32" rx="28" ry="11" stroke="#f5c518" strokeWidth="2.5" transform="rotate(60 32 32)" />
        <ellipse cx="32" cy="32" rx="28" ry="11" stroke="#f5c518" strokeWidth="2.5" transform="rotate(120 32 32)" />
        <circle cx="32" cy="32" r="3.5" fill="#f5c518" />
      </svg>
    ),
    color: "#1a2d5a",
    accent: "#f5c518",
  },
  {
    slug: "chemistry",
    label: "CHEMISTRY",
    desc: "Dive into chemical reactions",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
        <path d="M22 8h20M26 8v18L14 50h36L38 26V8" stroke="#f5c518" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="42" r="3" fill="#f5c518" />
        <circle cx="34" cy="46" r="2" fill="#f5c518" opacity="0.7" />
        <circle cx="40" cy="38" r="2.5" fill="#f5c518" opacity="0.5" />
      </svg>
    ),
    color: "#0d2240",
    accent: "#f5c518",
  },
  {
    slug: "mathematics",
    label: "MATHEMATICS",
    desc: "Understand numbers and logic",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14">
        <text x="8" y="44" fontSize="42" fontWeight="800" fill="#f5c518" fontFamily="Barlow Condensed, sans-serif">∑</text>
      </svg>
    ),
    color: "#162040",
    accent: "#f5c518",
  },
]

export default function DashboardTabs() {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {subjects.map(({ slug, label, desc, icon, color }) => (
        <div
          key={slug}
          onClick={() => router.push(`/subjects/${slug}`)}
          className="group cursor-pointer relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          style={{ background: color, borderLeft: "4px solid #f5c518" }}
        >
          {/* Background pattern */}
          <svg className="absolute -right-6 -bottom-6 opacity-5 w-32 h-32" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#f5c518" strokeWidth="8" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="#f5c518" strokeWidth="5" fill="none" />
          </svg>

          <div className="relative z-10 p-8 flex flex-col items-start">
            {/* Icon circle */}
            <div
              className="flex items-center justify-center w-20 h-20 mb-6 transition-transform duration-300 group-hover:scale-110"
              style={{ background: "rgba(245,197,24,0.12)", border: "2px solid rgba(245,197,24,0.3)" }}
            >
              {icon}
            </div>

            <h2
              className="text-2xl font-extrabold text-white mb-1"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}
            >
              {label}
            </h2>
            <p className="text-sm text-white/60 mb-6">{desc}</p>

            {/* Arrow CTA */}
            <div
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 group-hover:gap-3"
              style={{ color: "#f5c518", fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Explore
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 8h14M9 2l6 6-6 6" stroke="#f5c518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
