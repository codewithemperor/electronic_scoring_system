"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  BookOpen,
  Calendar,
  Award,
  Loader2,
  Play
} from "lucide-react"
import Link from "next/link"
import { CandidateLayout } from "@/components/layout/candidate-sidebar"

interface CandidateStats {
  registeredScreenings: number
  completedTests: number
  pendingTests: number
  averageScore: string
}

interface UpcomingTest {
  id: string
  title: string
  date: string
  time: string
  duration: string
  status: string
}

interface CompletedTest {
  id: string
  title: string
  date: string
  score: number
  totalMarks: number
  status: string
  percentage: string
}

export default function CandidateDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<CandidateStats | null>(null)
  const [upcomingTests, setUpcomingTests] = useState<UpcomingTest[]>([])
  const [completedTests, setCompletedTests] = useState<CompletedTest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/candidate/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetchDashboardData()
    }
  }, [status])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch statistics
      const [statsResponse, upcomingResponse, completedResponse] = await Promise.all([
        fetch("/api/candidate/dashboard/statistics"),
        fetch("/api/candidate/dashboard/upcoming-tests"),
        fetch("/api/candidate/dashboard/completed-tests")
      ])

      if (!statsResponse.ok) throw new Error("Failed to fetch statistics")
      if (!upcomingResponse.ok) throw new Error("Failed to fetch upcoming tests")
      if (!completedResponse.ok) throw new Error("Failed to fetch completed tests")

      const [statsData, upcomingData, completedData] = await Promise.all([
        statsResponse.json(),
        upcomingResponse.json(),
        completedResponse.json()
      ])

      // Validate and set stats data with fallbacks
      setStats({
        registeredScreenings: Number(statsData.registeredScreenings) || 0,
        completedTests: Number(statsData.completedTests) || 0,
        pendingTests: Number(statsData.pendingTests) || 0,
        averageScore: String(statsData.averageScore) || "0.0"
      })
      setUpcomingTests(Array.isArray(upcomingData) ? upcomingData : [])
      setCompletedTests(Array.isArray(completedData) ? completedData : [])

    } catch (err) {
      console.error("Dashboard data fetch error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
      // Set fallback data
      setStats({
        registeredScreenings: 0,
        completedTests: 0,
        pendingTests: 0,
        averageScore: "0.0"
      })
      setUpcomingTests([])
      setCompletedTests([])
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <CandidateLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </CandidateLayout>
    )
  }

  if (!session) {
    return null
  }

  const userName = `${session.user.firstName} ${session.user.lastName}`

  // Get candidate stats from API data with proper null checks
  const candidateStats = stats ? [
    { name: "Registered Screenings", value: (stats.registeredScreenings || 0).toString(), icon: Calendar, color: "text-blue-600" },
    { name: "Completed Tests", value: (stats.completedTests || 0).toString(), icon: CheckCircle, color: "text-green-600" },
    { name: "Pending Tests", value: (stats.pendingTests || 0).toString(), icon: Clock, color: "text-orange-600" },
    { name: "Average Score", value: stats.averageScore || "0.0", icon: Award, color: "text-purple-600" },
  ] : [
    { name: "Registered Screenings", value: "0", icon: Calendar, color: "text-blue-600" },
    { name: "Completed Tests", value: "0", icon: CheckCircle, color: "text-green-600" },
    { name: "Pending Tests", value: "0", icon: Clock, color: "text-orange-600" },
    { name: "Average Score", value: "0.0", icon: Award, color: "text-purple-600" },
  ]

  return (
    <CandidateLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userName}!
              </h1>
              <p className="text-gray-600 mt-2">
                Here's an overview of your academic progress and available tests.
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              Candidate Portal
            </Badge>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchDashboardData}
                className="ml-auto"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            candidateStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2 text-blue-600" />
                Available Tests
              </CardTitle>
              <CardDescription>
                Tests available for your program
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : upcomingTests.length > 0 ? (
                <div className="space-y-4">
                  {upcomingTests.map((test) => (
                    <div key={test.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{test.title}</h3>
                        <Badge variant={test.status === "AVAILABLE" ? "default" : "secondary"}>
                          {test.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {test.date} at {test.time}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Duration: {test.duration}
                        </div>
                      </div>
                      <div className="mt-3">
                        <Link href={`/candidate/take-test/${session.user.id}`}>
                          <Button size="sm" className="w-full">
                            <Play className="h-4 w-4 mr-2" />
                            Start Test
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No tests available at the moment</p>
                  <p className="text-sm">Check back later for new test assignments</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Completed Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Completed Tests
              </CardTitle>
              <CardDescription>
                Tests you have already taken
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : completedTests.length > 0 ? (
                <div className="space-y-4">
                  {completedTests.map((test) => (
                    <div key={test.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{test.title}</h3>
                        <Badge variant="outline">{test.status}</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Completed on {test.date}
                        </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-2" />
                          Score: {test.score}/{test.totalMarks} ({test.percentage}%)
                        </div>
                      </div>
                      <div className="mt-3">
                        <Link href={`/candidate/test-result/${session.user.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Result
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No completed tests yet</p>
                  <p className="text-sm">Start with your available tests when ready</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you might want to perform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/candidate/profile">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <User className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Update Profile</div>
                    <div className="text-sm text-gray-500">Edit your information</div>
                  </div>
                </Button>
              </Link>
              <Link href="/candidate/test-results">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <TrendingUp className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">View All Results</div>
                    <div className="text-sm text-gray-500">Check your performance</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </CandidateLayout>
  )
}