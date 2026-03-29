"use client"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"

type CalEvent = {
  id: number
  date: Date
  title: string
  type: string
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export default function EventCalendar() {
  const [events, setEvents] = useState<CalEvent[]>([])
  const [today] = useState(new Date())
  const [viewDate, setViewDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((r) => r.json())
      .then((data) => {
        setEvents(
          data.map((ev: any, i: number) => ({
            id: i + 1,
            date: new Date(ev.start),
            title: ev.title,
            type: ev.type || "quiz",
          }))
        )
      })
      .catch(() => {})
  }, [])

  // Build calendar grid
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const cells: { date: Date; outside: boolean }[] = []
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, daysInPrev - i), outside: true })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), outside: false })
  }
  while (cells.length % 7 !== 0) {
    cells.push({ date: new Date(year, month + 1, cells.length - daysInMonth - firstDay + 1), outside: true })
  }

  const getDayEvents = (date: Date) => events.filter((e) => sameDay(e.date, date))
  const selectedEvents = getDayEvents(selectedDate)

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const typeColor: Record<string, string> = { quiz: "#1a2d5a", test: "#0d2240", holiday: "#162040" }

  return (
    <div className="bg-white shadow-sm overflow-hidden">
      {/* Navy header */}
      <div className="px-5 py-4 flex items-center gap-3" style={{ background: "#0d1b3e" }}>
        <CalendarIcon size={18} style={{ color: "#f5c518" }} />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#f5c518", fontFamily: "'Barlow Condensed', sans-serif" }}>
            ACADEMIC CALENDAR
          </p>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff" }}>
            Events &amp; Schedules
          </h3>
        </div>
      </div>
      <div className="h-0.5" style={{ background: "#f5c518" }} />

      <div className="p-4">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 transition-colors">
            <ChevronLeft size={16} style={{ color: "#0d1b3e" }} />
          </button>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#0d1b3e" }}>
            {MONTHS[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 transition-colors">
            <ChevronRight size={16} style={{ color: "#0d1b3e" }} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[11px] font-bold uppercase py-1"
              style={{ color: "#0d1b3e", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.05em" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-100">
          {cells.map((cell, idx) => {
            const hasEvent = getDayEvents(cell.date).length > 0
            const isToday = sameDay(cell.date, today)
            const isSelected = sameDay(cell.date, selectedDate)

            return (
              <button
                key={idx}
                onClick={() => { setSelectedDate(cell.date); setViewDate(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1)) }}
                className="relative bg-white flex flex-col items-center justify-center py-2 transition-all hover:bg-yellow-50 focus:outline-none"
                style={{
                  background: isSelected ? "#0d1b3e" : isToday ? "#f5c518" : "white",
                  color: isSelected ? "#f5c518" : isToday ? "#0d1b3e" : cell.outside ? "#ccc" : "#0d1b3e",
                }}
              >
                <span className="text-sm font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {cell.date.getDate()}
                </span>
                {hasEvent && (
                  <div className="w-1.5 h-1.5 mt-0.5" style={{ background: isSelected ? "#f5c518" : "#f5c518" }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Selected day events */}
        {selectedEvents.length > 0 && (
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2"
              style={{ color: "#0d1b3e", fontFamily: "'Barlow Condensed', sans-serif" }}>
              Events — {selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </p>
            <div className="space-y-2">
              {selectedEvents.map((ev) => (
                <div key={ev.id} className="flex items-center gap-3 p-2.5" style={{ borderLeft: "3px solid #f5c518", background: "#f5f6f8" }}>
                  <div className="px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                    style={{ background: typeColor[ev.type] || "#0d1b3e", fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {ev.type}
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{ev.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
