"use client"

import { useRouter } from "next/navigation"
import { Calculator, FlaskRoundIcon as Flask } from "lucide-react"

export default function DashboardTabs() {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(`/subjects/${path}`)
  }

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-10">
      {/* Physics Card */}
      <div
        onClick={() => handleNavigation("physics")}
        className="cursor-pointer bg-secondary rounded-2xl p-20 flex flex-col items-center justify-center shadow-md hover:shadow-xl transition-transform hover:-translate-y-1"
      >
        <Flask size={59} className="mb-12 text-primary" />
        <h2 className="text-2xl font-semibold text-center">Physics</h2>
        <p className="text-base text-muted-foreground text-center mt-3">Explore the laws of nature</p>
      </div>

      {/* Chemistry Card */}
      <div
        onClick={() => handleNavigation("chemistry")}
        className="cursor-pointer bg-secondary rounded-2xl p-20 flex flex-col items-center justify-center shadow-md hover:shadow-xl transition-transform hover:-translate-y-1"
      >
        <Flask size={59} className="mb-12 text-primary" />
        <h2 className="text-2xl font-semibold text-center">Chemistry</h2>
        <p className="text-base text-muted-foreground text-center mt-3">Dive into chemical reactions</p>
      </div>

      {/* Mathematics Card */}
      <div
        onClick={() => handleNavigation("mathematics")}
        className="cursor-pointer bg-secondary rounded-2xl p-20 flex flex-col items-center justify-center shadow-md hover:shadow-xl transition-transform hover:-translate-y-1"
      >
        <Calculator size={59} className="mb-12 text-primary" />
        <h2 className="text-2xl font-semibold text-center">Mathematics</h2>
        <p className="text-base text-muted-foreground text-center mt-3">Understand numbers and logic</p>
      </div>
    </div>
  )
}
