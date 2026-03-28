import DashboardTabs from "@/components/dashboard-tabs"
import AnnouncementBar from "@/components/announcement-bar"
import QuizSection from "@/components/quiz-section"
import MiniLeaderboard from "@/components/mini-leaderboard"
import CareerGoals from "@/components/career-goals"
import EventCalendar from "@/components/event-calendar"
import { Button } from "@/components/ui/button"
import { UserCircle, LogOut } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">ACADEMIQ</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UserCircle className="text-primary" />
              <span className="font-medium">Rahul Singh</span>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <AnnouncementBar />

      <main className="container mx-auto px-4 py-6">
        <DashboardTabs />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2 space-y-6">
            <QuizSection />
            <EventCalendar />
          </div>
          <div className="space-y-6">
            <MiniLeaderboard />
            <CareerGoals />
          </div>
        </div>
      </main>
    </div>
  )
}

