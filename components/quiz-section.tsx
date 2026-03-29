import Link from "next/link"
import { Clock, ArrowRight } from "lucide-react"

const upcomingQuizzes = [
  {
    id: 1,
    title: "Mechanics — Newton's Laws",
    subject: "Physics",
    subjectColor: "#1a2d5a",
    duration: "45 min",
    date: "May 15, 2026",
  },
  {
    id: 2,
    title: "Organic Chemistry — Alcohols",
    subject: "Chemistry",
    subjectColor: "#162040",
    duration: "30 min",
    date: "May 18, 2026",
  },
  {
    id: 3,
    title: "Calculus — Integration",
    subject: "Mathematics",
    subjectColor: "#0d2240",
    duration: "60 min",
    date: "May 20, 2026",
  },
]

export default function QuizSection() {
  return (
    <div className="bg-white shadow-sm overflow-hidden">
      {/* Navy header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ background: "#0d1b3e" }}>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "#f5c518", fontFamily: "'Barlow Condensed', sans-serif" }}>
            ASSESSMENTS
          </p>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff" }}>
            Upcoming Quizzes
          </h3>
        </div>
        <Link
          href="/quizzes"
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-70"
          style={{ color: "#f5c518", fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          View all <ArrowRight size={13} />
        </Link>
      </div>

      {/* Gold separator */}
      <div className="h-0.5" style={{ background: "#f5c518" }} />

      {/* Quiz list */}
      <div className="divide-y divide-gray-100">
        {upcomingQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Subject tag */}
              <div
                className="flex-shrink-0 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ background: quiz.subjectColor, fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {quiz.subject}
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-900">{quiz.title}</h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {quiz.duration}
                  </span>
                  <span>{quiz.date}</span>
                </div>
              </div>
            </div>
            <Link
              href={`/quizzes/${quiz.id}`}
              className="flex-shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-80"
              style={{ background: "#f5c518", color: "#0d1b3e", fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Prepare →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
