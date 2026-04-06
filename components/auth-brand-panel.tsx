import { BookOpen } from "lucide-react";

/** Left column for auth pages — matches /signin (navy + gold). */
export function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: "#0d1b3e" }}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      />
      <div className="absolute inset-0" style={{ background: "rgba(13,27,62,0.72)" }} />

      <svg className="absolute top-12 right-12 opacity-20 z-10" width="120" height="120" viewBox="0 0 120 120">
        {Array.from({ length: 36 }).map((_, i) => (
          <circle key={i} cx={(i % 6) * 20 + 10} cy={Math.floor(i / 6) * 20 + 10} r="2" fill="#f5c518" />
        ))}
      </svg>
      <svg className="absolute bottom-24 left-8 opacity-20 z-10" width="80" height="80" viewBox="0 0 80 80">
        {Array.from({ length: 16 }).map((_, i) => (
          <circle key={i} cx={(i % 4) * 20 + 10} cy={Math.floor(i / 4) * 20 + 10} r="2" fill="#f5c518" />
        ))}
      </svg>

      <svg className="absolute bottom-40 left-0 w-full opacity-30 z-10" viewBox="0 0 600 40" preserveAspectRatio="none">
        <path d="M0,20 Q150,0 300,20 T600,20" stroke="#f5c518" strokeWidth="3" fill="none" />
        <path d="M0,30 Q150,10 300,30 T600,30" stroke="#f5c518" strokeWidth="2" fill="none" />
      </svg>

      <div className="relative z-10 flex flex-col justify-between w-full p-12">
        <div className="flex items-center gap-3">
          <div className="p-2" style={{ background: "#f5c518" }}>
            <BookOpen className="w-6 h-6" style={{ color: "#0d1b3e" }} />
          </div>
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: "1.5rem",
              color: "#fff",
              letterSpacing: "0.06em",
            }}
          >
            ACADEMIQ
          </span>
        </div>

        <div className="mb-16">
          <p className="section-label mb-4">PLACE TO GROW</p>
          <h1
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: "3.2rem",
              lineHeight: 1.05,
              color: "#fff",
            }}
          >
            WE CREATING
            <br />
            LEADERS FOR
            <br />
            TOMORROW
          </h1>
          <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-xs">
            Master Physics, Chemistry &amp; Mathematics with expert-curated content built for JEE success.
          </p>

          <div className="flex gap-3 mt-8">
            {["10k+ Problems", "Expert Faculty", "AI Analytics"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-white/80 text-xs">
                <div className="w-1.5 h-1.5 flex-shrink-0" style={{ background: "#f5c518" }} />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthSubjectsStrip() {
  return (
    <div className="mt-6 grid grid-cols-3 gap-2">
      {[
        { label: "Physics", icon: "⚡" },
        { label: "Chemistry", icon: "⚗️" },
        { label: "Mathematics", icon: "∑" },
      ].map(({ label, icon }) => (
        <div key={label} className="text-center py-3" style={{ background: "#0d1b3e" }}>
          <div className="text-lg">{icon}</div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

export function AuthMobileLogo() {
  return (
    <div className="lg:hidden flex items-center gap-2 mb-8">
      <div className="p-1.5" style={{ background: "#f5c518" }}>
        <BookOpen className="w-5 h-5" style={{ color: "#0d1b3e" }} />
      </div>
      <span
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: "1.3rem",
          color: "#0d1b3e",
        }}
      >
        ACADEMIQ
      </span>
    </div>
  );
}
