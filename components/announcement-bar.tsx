"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const announcements = [
  "Physics Quiz on Mechanics scheduled for 15th May",
  "New study materials uploaded for Organic Chemistry",
  "Live doubt-solving session tomorrow at 6 PM",
  "JEE Main mock test available in the Test section",
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
    <div className="bg-primary/90 text-white py-2 px-4 relative">
      <div className="container mx-auto flex items-center justify-center">
        <p className="text-center text-sm md:text-base animate-fade-in-out">{announcements[currentAnnouncement]}</p>
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 p-1 h-auto"
          onClick={() => setVisible(false)}
        >
          <X size={16} />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </div>
  )
}

