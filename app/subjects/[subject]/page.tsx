import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Video, FileText, PenTool } from "lucide-react"



// Define the subject data
// ──────────────────────────────────────────────────────────────────────────────
// TO ADD PDFs: put your PDF files inside  public/pdfs/<subject>/<filename>.pdf
// then update the `pdf` field below to match the filename.
// Example: public/pdfs/physics/mechanics.pdf  →  pdf: "/pdfs/physics/mechanics.pdf"
// ──────────────────────────────────────────────────────────────────────────────
const subjects = {
  physics: {
    name: "Physics",
    description: "Master the fundamental laws of the physical world",
    chapters: [
      { id: 1, title: "Mechanics",         completed: true,  pdf: "/pdfs/physics/mechanics.pdf" },
      { id: 2, title: "Thermodynamics",    completed: true,  pdf: "/pdfs/physics/thermodynamics.pdf" },
      { id: 3, title: "Electrostatics",    completed: false, pdf: "/pdfs/physics/electrostatics.pdf" },
      { id: 4, title: "Current Electricity", completed: false, pdf: "/pdfs/physics/current-electricity.pdf" },
      { id: 5, title: "Magnetism",         completed: false, pdf: "/pdfs/physics/magnetism.pdf" },
      { id: 6, title: "Optics",            completed: false, pdf: "/pdfs/physics/optics.pdf" },
      { id: 7, title: "Modern Physics",    completed: false, pdf: "/pdfs/physics/modern-physics.pdf" },
    ],
  },
  chemistry: {
    name: "Chemistry",
    description: "Explore the composition, structure, and properties of matter",
    chapters: [
      { id: 1, title: "Atomic Structure",    completed: true,  pdf: "/pdfs/chemistry/atomic-structure.pdf" },
      { id: 2, title: "Chemical Bonding",    completed: true,  pdf: "/pdfs/chemistry/chemical-bonding.pdf" },
      { id: 3, title: "States of Matter",    completed: false, pdf: "/pdfs/chemistry/states-of-matter.pdf" },
      { id: 4, title: "Thermodynamics",      completed: false, pdf: "/pdfs/chemistry/thermodynamics.pdf" },
      { id: 5, title: "Equilibrium",         completed: false, pdf: "/pdfs/chemistry/equilibrium.pdf" },
      { id: 6, title: "Organic Chemistry",   completed: false, pdf: "/pdfs/chemistry/organic-chemistry.pdf" },
      { id: 7, title: "Inorganic Chemistry", completed: false, pdf: "/pdfs/chemistry/inorganic-chemistry.pdf" },
    ],
  },
  mathematics: {
    name: "Mathematics",
    description: "Develop problem-solving skills with advanced mathematical concepts",
    chapters: [
      { id: 1, title: "Algebra",              completed: true,  pdf: "/pdfs/mathematics/algebra.pdf" },
      { id: 2, title: "Calculus",             completed: true,  pdf: "/pdfs/mathematics/calculus.pdf" },
      { id: 3, title: "Coordinate Geometry",  completed: false, pdf: "/pdfs/mathematics/coordinate-geometry.pdf" },
      { id: 4, title: "Trigonometry",         completed: false, pdf: "/pdfs/mathematics/trigonometry.pdf" },
      { id: 5, title: "Vectors",              completed: false, pdf: "/pdfs/mathematics/vectors.pdf" },
      { id: 6, title: "Probability",          completed: false, pdf: "/pdfs/mathematics/probability.pdf" },
      { id: 7, title: "Statistics",           completed: false, pdf: "/pdfs/mathematics/statistics.pdf" },
    ],
  },
}

export default function SubjectPage({ params }: { params: { subject: string } }) {
  const subject = subjects[params.subject as keyof typeof subjects]

  if (!subject) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80">
            <ChevronLeft size={16} className="mr-1" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">{subject.name}</h1>
          <p className="text-muted-foreground">{subject.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-primary">Chapters</CardTitle>
                <CardDescription>Track your progress</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {subject.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="flex items-center justify-between p-3 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-3 ${chapter.completed ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                        <span>{chapter.title}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary h-8">
                        Study
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-primary">Learning Resources</CardTitle>
                <CardDescription>Access study materials for {subject.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="notes" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger
                      value="notes"
                      className="data-[state=active]:bg-secondary data-[state=active]:text-primary flex items-center gap-1"
                    >
                      <FileText size={16} />
                      <span>Notes</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="videos"
                      className="data-[state=active]:bg-secondary data-[state=active]:text-primary flex items-center gap-1"
                    >
                      <Video size={16} />
                      <span>Videos</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="quizzes"
                      className="data-[state=active]:bg-secondary data-[state=active]:text-primary flex items-center gap-1"
                    >
                      <PenTool size={16} />
                      <span>Quizzes</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="notes" className="space-y-4">
                    {subject.chapters.map((chapter) => (
                      <div key={chapter.id} className="p-3 rounded-lg border hover:bg-secondary/50 transition-colors">
                        <h3 className="font-medium flex items-center">
                          <FileText size={16} className="mr-2 text-primary" />
                          {chapter.title} Notes
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Comprehensive study material with examples and practice problems
                        </p>
                        <div className="flex gap-2 mt-2">
                          {/* VIEW — opens PDF in browser */}
                          <a
                            href={chapter.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 transition-all hover:opacity-80"
                            style={{ borderColor: "#f5c518", color: "#0d1b3e", fontFamily: "'Barlow Condensed', sans-serif" }}
                          >
                            View
                          </a>
                          {/* DOWNLOAD — forces browser to download the file */}
                          <a
                            href={chapter.pdf}
                            download
                            className="inline-flex items-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-80"
                            style={{ background: "#f5c518", color: "#0d1b3e", fontFamily: "'Barlow Condensed', sans-serif" }}
                          >
                            Download PDF ↓
                          </a>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="videos" className="space-y-4">
                    {subject.chapters.slice(0, 4).map((chapter) => (
                      <div key={chapter.id} className="p-3 rounded-lg border hover:bg-secondary/50 transition-colors">
                        <h3 className="font-medium flex items-center">
                          <Video size={16} className="mr-2 text-primary" />
                          {chapter.title} Video Lectures
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Video explanations with visual demonstrations
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-primary border-primary/30 hover:bg-secondary"
                          >
                            Watch
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="quizzes" className="space-y-4">
                    {subject.chapters.slice(0, 3).map((chapter) => (
                      <div key={chapter.id} className="p-3 rounded-lg border hover:bg-secondary/50 transition-colors">
                        <h3 className="font-medium flex items-center">
                          <PenTool size={16} className="mr-2 text-primary" />
                          {chapter.title} Quiz
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Test your knowledge with practice questions
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-muted-foreground">30 questions • 45 minutes</div>
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            Start Quiz
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>



  )
}

