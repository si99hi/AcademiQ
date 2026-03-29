import { Trophy, Medal, Award } from "lucide-react"

const topStudents = [
  { id: 1, name: "Aarav Sharma", score: 985, rank: 1 },
  { id: 2, name: "Priya Patel", score: 970, rank: 2 },
  { id: 3, name: "Vikram Singh", score: 965, rank: 3 },
]

const rankIcons = [
  <Trophy key={1} size={18} style={{ color: "#f5c518" }} />,
  <Medal key={2} size={18} style={{ color: "#adb5bd" }} />,
  <Award key={3} size={18} style={{ color: "#cd7f32" }} />,
]

export default function MiniLeaderboard() {
  return (
    <div className="bg-white shadow-sm overflow-hidden">
      {/* Navy header */}
      <div className="px-5 py-4" style={{ background: "#0d1b3e" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "#f5c518", fontFamily: "'Barlow Condensed', sans-serif" }}>
          TOP PERFORMERS
        </p>
        <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "#fff" }}>
          Leaderboard
        </h3>
      </div>

      {/* Gold bar */}
      <div className="h-0.5" style={{ background: "#f5c518" }} />

      {/* Students */}
      <div className="divide-y divide-gray-100">
        {topStudents.map((student, i) => (
          <div key={student.id} className="flex items-center px-5 py-3.5 hover:bg-gray-50 transition-colors">
            {/* Rank icon */}
            <div className="w-8 flex-shrink-0 flex items-center justify-center">
              {rankIcons[i]}
            </div>

            {/* Avatar initial */}
            <div
              className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mr-3"
              style={{ background: "#1a2d5a", fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {student.name.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{student.name}</p>
              <p className="text-xs text-gray-400">Score: {student.score}</p>
            </div>

            <div
              className="text-sm font-extrabold"
              style={{ color: "#f5c518", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1rem" }}
            >
              #{student.rank}
            </div>
          </div>
        ))}
      </div>

      {/* Your rank */}
      <div className="px-5 py-4" style={{ background: "#f5f6f8", borderTop: "2px solid #0d1b3e" }}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Your Rank</p>
            <p className="text-xs text-gray-400">Score: 820</p>
          </div>
          <div
            className="text-lg font-extrabold"
            style={{ color: "#0d1b3e", fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            #42
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-gray-200 overflow-hidden">
          <div className="h-full transition-all duration-700" style={{ width: "79%", background: "#f5c518" }} />
        </div>
        <p className="text-[10px] text-right mt-1 text-gray-400 font-semibold uppercase tracking-wider">Top 21%</p>
      </div>
    </div>
  )
}
