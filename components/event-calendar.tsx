"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Event = {
  id: number
  date: Date
  title: string
  type: string
}

export default function EventCalendar() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(response => response.json())
      .then(data => {
        const formattedEvents = data.map((event: any, index: number) => ({
          id: index + 1,
          date: new Date(event.start),
          title: event.title,
          type: event.type || 'quiz',
        }))
        setEvents(formattedEvents)
      })
      .catch(error => console.error('Error fetching events:', error))
  }, [])

  const getDayEvents = (day: Date) => {
    return events.filter(event => 
      event.date.toDateString() === day.toDateString()
    )
  }

  const selectedDayEvents = selectedDate ? getDayEvents(selectedDate) : []

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center text-primary">
          <CalendarIcon className="mr-2" size={20} />
          Academic Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border w-full"
            modifiers={{
              hasEvent: (date) => getDayEvents(date).length > 0
            }}
            modifiersStyles={{
              hasEvent: { color: "var(--primary)", fontWeight: "bold" }
            }}
          />
          {selectedDayEvents.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Events for {selectedDate?.toLocaleDateString()}</h3>
              <div className="space-y-2">
                {selectedDayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center p-3 rounded-lg border hover:bg-secondary/50 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge
                        variant="outline"
                        className={
                          event.type === "quiz"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : event.type === "test"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                        }
                      >
                        {event.type === "quiz" ? "Quiz" : event.type === "test" ? "Test" : "Holiday"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

