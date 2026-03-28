import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight } from "lucide-react"

const upcomingQuizzes = [
  {
    id: 1,
    title: "Mechanics - Newton's Laws",
    subject: "Physics",
    duration: "45 min",
    date: "May 15, 2023",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Organic Chemistry - Alcohols",
    subject: "Chemistry",
    duration: "30 min",
    date: "May 18, 2023",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Calculus - Integration",
    subject: "Mathematics",
    duration: "60 min",
    date: "May 20, 2023",
    status: "upcoming",
  },
]

export default function QuizSection() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-primary">Upcoming Quizzes</CardTitle>
            <CardDescription>Prepare for these assessments</CardDescription>
          </div>
          <Link href="/quizzes" className="text-primary text-sm flex items-center hover:underline">
            View all <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 transition-colors"
            >
              <div>
                <h3 className="font-medium">{quiz.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <Badge variant="outline" className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    {quiz.subject}
                  </Badge>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {quiz.duration}
                  </div>
                  <span>{quiz.date}</span>
                </div>
              </div>
              <Link
                href={`/quizzes/${quiz.id}`}
                className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                Prepare
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

