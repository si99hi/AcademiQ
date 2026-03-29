"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

const announcements = [
  "⚡ Physics Quiz on Mechanics scheduled for 15th May",
  "⚗️ New study materials uploaded for Organic Chemistry",
  "📅 Live doubt-solving session tomorrow at 6 PM",
  "✏️ JEE Main mock test available in the Test section",
]

export default function AnnouncementBar() {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!visible) return null

  return (
    <div className="relative py-2.5 px-4" style={{ background: "#f5c518" }}>
      <div className="container mx-auto flex items-center justify-center">
        <p
          className="text-center text-sm font-bold animate-fade-in-out"
          style={{ color: "#0d1b3e", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em", fontSize: "0.9rem" }}
        >
          {announcements[currentAnnouncement]}
        </p>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
          style={{ color: "#0d1b3e" }}
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
