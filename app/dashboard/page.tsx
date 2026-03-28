"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardTabs from "@/components/dashboard-tabs";
import AnnouncementBar from "@/components/announcement-bar";
import QuizSection from "@/components/quiz-section";
import MiniLeaderboard from "@/components/mini-leaderboard";
import CareerGoals from "@/components/career-goals";
import EventCalendar from "@/components/event-calendar";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut, User } from "lucide-react";
import Link from "next/link";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  enrolledCourses?: string[];
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/signin");
      return;
    }
    try {
      setUser(JSON.parse(stored));
    } catch {
      router.push("/signin");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/signin");
  };

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "Loading…";

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">ACADEMIQ</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors group"
            >
              <UserCircle className="text-primary w-5 h-5 group-hover:text-blue-700" />
              <span className="font-medium text-gray-800 group-hover:text-blue-700">
                {fullName}
              </span>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <LogOut size={15} />
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
  );
}
