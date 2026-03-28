import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"

export default function Home() {
  // In a real app, you would check if the user is already logged in
  // and redirect them to the dashboard if they are
  const isLoggedIn = false

  if (isLoggedIn) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-sm">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">ACADEMIQ</h1>
          <p className="mt-2 text-muted-foreground">Your JEE Learning Partner</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

