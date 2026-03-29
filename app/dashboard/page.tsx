"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardTabs from "@/components/dashboard-tabs";
import AnnouncementBar from "@/components/announcement-bar";
import QuizSection from "@/components/quiz-section";
import MiniLeaderboard from "@/components/mini-leaderboard";
import CareerGoals from "@/components/career-goals";
import EventCalendar from "@/components/event-calendar";
import { BookOpen, LogOut, UserCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.push("/signin"); return; }
    try { setUser(JSON.parse(stored)); } catch { router.push("/signin"); }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/signin");
  };

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "Loading…";

  return (
    <div className="min-h-screen" style={{ background: "#f0f2f5" }}>

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 shadow-md" style={{ background: "#0d1b3e" }}>
        <div className="container mx-auto px-4 py-0 flex items-center" style={{ height: "64px" }}>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 mr-10">
            <div className="p-1.5" style={{ background: "#f5c518" }}>
              <BookOpen className="w-5 h-5" style={{ color: "#0d1b3e" }} />
            </div>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#fff", letterSpacing: "0.06em" }}>
              ACADEMIQ
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 flex-1">
            {["Dashboard", "Physics", "Chemistry", "Mathematics"].map((item) => (
              <a key={item}
                href={item === "Dashboard" ? "/dashboard" : `/subjects/${item.toLowerCase()}`}
                className="text-sm font-semibold text-white/70 hover:text-white uppercase tracking-wider transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}>
                {item}
              </a>
            ))}
          </nav>

          {/* User area */}
          <div className="flex items-center gap-3 ml-auto">
            <Link href="/profile"
              className="flex items-center gap-2 px-3 py-1.5 text-white/80 hover:text-white transition-colors">
              <UserCircle className="w-5 h-5" />
              <span className="text-sm font-semibold hidden sm:block" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {fullName}
              </span>
            </Link>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all hover:opacity-90"
              style={{ background: "#f5c518", color: "#0d1b3e", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.06em" }}>
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── ANNOUNCEMENT BAR ── */}
      <AnnouncementBar />

      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden" style={{ background: "#0d1b3e", minHeight: "180px" }}>
        {/* Hardcoded background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        {/* Subtle blue overlay */}
        <div className="absolute inset-0" style={{ background: "rgba(13,27,62,0.60)" }} />

        {/* Overlay content */}
        <div className="relative z-10 container mx-auto px-4 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="section-label mb-2">DISCOVER &amp; GROW</p>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "2.4rem", color: "#fff", lineHeight: 1.1 }}>
              WELCOME BACK, <span style={{ color: "#f5c518" }}>{user?.firstName?.toUpperCase() || "STUDENT"}</span>
            </h1>
            <p className="text-white/60 text-sm mt-1">Continue your preparation — every day counts.</p>
          </div>
          <Link href="/subjects/physics"
            className="flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wider transition-all hover:opacity-90 flex-shrink-0"
            style={{ background: "#f5c518", color: "#0d1b3e", fontFamily: "'Barlow Condensed', sans-serif" }}>
            Start Studying <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="container mx-auto px-4 py-8">

        {/* Subject cards */}
        <div className="mb-8">
          <p className="section-label mb-4">YOUR SUBJECTS</p>
          <DashboardTabs />
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
