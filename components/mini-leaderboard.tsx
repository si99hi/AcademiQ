import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"

const topStudents = [
  { id: 1, name: "Aarav Sharma", score: 985, rank: 1 },
  { id: 2, name: "Priya Patel", score: 970, rank: 2 },
  { id: 3, name: "Vikram Singh", score: 965, rank: 3 },
]

export default function MiniLeaderboard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary text-white pb-3">
        <CardTitle className="text-lg flex items-center">
          <Trophy className="mr-2" size={18} />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {topStudents.map((student) => (
            <div key={student.id} className="flex items-center p-3 hover:bg-secondary/50 transition-colors">
              <div className="w-8 h-8 flex items-center justify-center mr-3">
                {student.rank === 1 ? (
                  <Trophy className="text-yellow-500" size={20} />
                ) : student.rank === 2 ? (
                  <Medal className="text-gray-400" size={20} />
                ) : (
                  <Award className="text-amber-700" size={20} />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{student.name}</p>
                <p className="text-xs text-muted-foreground">Score: {student.score}</p>
              </div>
              <div className="text-sm font-bold text-primary">#{student.rank}</div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-secondary/50 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Your Rank</p>
              <p className="text-xs text-muted-foreground">Score: 820</p>
            </div>
            <div className="text-sm font-bold text-primary">#42</div>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary/80" style={{ width: "79%" }}></div>
          </div>
          <p className="text-xs text-right mt-1 text-muted-foreground">Top 21%</p>
        </div>
      </CardContent>
    </Card>
  )
}

