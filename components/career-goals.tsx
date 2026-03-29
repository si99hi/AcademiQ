import { Sparkles, ArrowRight } from "lucide-react"

export default function CareerGoals() {
  return (
    <div className="bg-white shadow-sm overflow-hidden">
      {/* Navy header */}
      <div className="px-5 py-4" style={{ background: "#0d1b3e" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "#f5c518", fontFamily: "'Barlow Condensed', sans-serif" }}>
          AI POWERED
        </p>
        <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "#fff" }}>
          Career Goals
        </h3>
      </div>

      {/* Gold bar */}
      <div className="h-0.5" style={{ background: "#f5c518" }} />

      <div className="p-6 flex flex-col items-center text-center">
        {/* Icon */}
        <div
          className="w-16 h-16 flex items-center justify-center mb-4"
          style={{ background: "#0d1b3e" }}
        >
          <Sparkles size={28} style={{ color: "#f5c518" }} />
        </div>

        <h4
          className="text-base font-bold mb-2"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#0d1b3e", fontSize: "1.1rem" }}
        >
          PERSONALISED CAREER PATH
        </h4>
        <p className="text-sm text-gray-500 leading-relaxed mb-5">
          Set your preferences to get AI-powered career path suggestions tailored for JEE.
        </p>

        <button
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all hover:opacity-90 w-full justify-center"
          style={{ background: "#f5c518", color: "#0d1b3e", fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Set Preferences <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
