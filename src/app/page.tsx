"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home } from "lucide-react"
import { useSession } from "next-auth/react"

export default function UnauthorizedPage() {
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!session) {
      router.push("/")
    }
  }, [session, router])

  const handleGoHome = () => {
    router.push("/dashboard")
  }

  const handleLogout = () => {
    // This will be handled by NextAuth logout
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-red-500 text-6xl mb-4">
            <AlertTriangle className="w-full h-full" />
          </div>
          <CardTitle className="text-2xl text-red-600">Unauthorized Access</CardTitle>
          <CardDescription>
            You don't have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-700">
              This area requires specific permissions that your account doesn't have. 
              Please contact your administrator if you believe this is an error.
            </p>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={handleGoHome}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleLogout}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}