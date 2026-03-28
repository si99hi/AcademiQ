import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function CareerGoals() {
  return (
    <Card className="border-dashed border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-primary">Career Goals</CardTitle>
        <CardDescription>AI-powered career suggestions</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-6">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <Sparkles className="text-primary" size={24} />
          </div>
          <p className="text-sm text-muted-foreground">
            Set your preferences to get personalized career path suggestions
          </p>
          <Button variant="outline" className="mt-2 border-primary/30 text-primary hover:bg-secondary">
            Set Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

