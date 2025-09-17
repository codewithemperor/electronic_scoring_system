"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  ClipboardList,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Loader2
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalCandidates?: number
  activeScreenings?: number
  totalQuestions?: number
  totalUsers?: number
}

interface RecentScreening {
  id: string
  name: string
  status: string
  candidates: number
  startDate: string
  endDate: string
  academicSession?: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({})
  const [recentScreenings, setRecentScreenings] = useState<RecentScreening[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
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
      const statsResponse = await fetch("/api/dashboard/statistics")
      if (!statsResponse.ok) {
        throw new Error("Failed to fetch statistics")
      }
      const statsData = await statsResponse.json()
      setStats(statsData)

      // Fetch recent screenings
      const screeningsResponse = await fetch("/api/dashboard/recent-screenings")
      if (!screeningsResponse.ok) {
        throw new Error("Failed to fetch screenings")
      }
      const screeningsData = await screeningsResponse.json()
      setRecentScreenings(screeningsData)

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const userRole = session.user.role
  const userName = `${session.user.firstName} ${session.user.lastName}`

  // Role-based navigation items
  const getNavigationItems = () => {
    const baseItems = [
      { name: "Dashboard", href: "/dashboard", icon: TrendingUp },
    ]

    switch (userRole) {
      case "SUPER_ADMIN":
        return [
          ...baseItems,
          { name: "Users", href: "/admin/users", icon: Users },
          { name: "Screenings", href: "/admin/screenings", icon: ClipboardList },
          { name: "Questions", href: "/admin/questions", icon: BookOpen },
          { name: "Tests", href: "/admin/program-tests", icon: Badge },
          { name: "Reports", href: "/admin/reports", icon: TrendingUp },
        ]
      case "ADMIN":
        return [
          ...baseItems,
          { name: "Screenings", href: "/admin/screenings", icon: ClipboardList },
          { name: "Questions", href: "/admin/questions", icon: BookOpen },
          { name: "Reports", href: "/admin/reports", icon: TrendingUp },
        ]
      case "STAFF":
        return [
          ...baseItems,
          { name: "Candidates", href: "/staff/candidates", icon: Users },
          { name: "Screenings", href: "/staff/screenings", icon: ClipboardList },
          { name: "Scoring", href: "/staff/scoring", icon: CheckCircle },
          { name: "Reports", href: "/staff/reports", icon: TrendingUp },
        ]
      case "EXAMINER":
        return [
          ...baseItems,
          { name: "Questions", href: "/examiner/questions", icon: BookOpen },
          { name: "Tests", href: "/examiner/program-tests", icon: Badge },
          { name: "Screenings", href: "/examiner/screenings", icon: ClipboardList },
          { name: "Scoring", href: "/examiner/scoring", icon: CheckCircle },
        ]
      default:
        return baseItems
    }
  }

  const getDashboardTitle = () => {
    switch (userRole) {
      case "SUPER_ADMIN":
        return "Super Admin Dashboard"
      case "ADMIN":
        return "Administrator Dashboard"
      case "STAFF":
        return "Staff Dashboard"
      case "EXAMINER":
        return "Examiner Dashboard"
      default:
        return "Dashboard"
    }
  }

  const getWelcomeMessage = () => {
    switch (userRole) {
      case "SUPER_ADMIN":
        return "Welcome to the Super Admin dashboard. You have full system access."
      case "ADMIN":
        return "Welcome to the Administrator dashboard. Manage screenings and system configuration."
      case "STAFF":
        return "Welcome to the Staff dashboard. Manage candidates and scoring."
      case "EXAMINER":
        return "Welcome to the Examiner dashboard. Manage questions and scoring."
      default:
        return "Welcome to your dashboard."
    }
  }

  const getQuickActions = () => {
    switch (userRole) {
      case "SUPER_ADMIN":
        return [
          { name: "Add User", href: "/admin/users", icon: Users },
          { name: "Create Screening", href: "/admin/screenings", icon: ClipboardList },
          { name: "Add Questions", href: "/admin/questions", icon: BookOpen },
        ]
      case "ADMIN":
        return [
          { name: "Create Screening", href: "/admin/screenings", icon: ClipboardList },
          { name: "Manage Questions", href: "/admin/questions", icon: BookOpen },
          { name: "View Reports", href: "/admin/reports", icon: TrendingUp },
        ]
      case "STAFF":
        return [
          { name: "Register Candidate", href: "/staff/candidates", icon: Users },
          { name: "Score Tests", href: "/staff/scoring", icon: CheckCircle },
          { name: "View Reports", href: "/staff/reports", icon: TrendingUp },
        ]
      case "EXAMINER":
        return [
          { name: "Add Questions", href: "/examiner/questions", icon: BookOpen },
          { name: "Score Tests", href: "/examiner/scoring", icon: CheckCircle },
          { name: "View Screenings", href: "/examiner/screenings", icon: ClipboardList },
        ]
      default:
        return []
    }
  }

  const getStatsCards = () => {
    const statsCards = []
    
    if (stats.totalCandidates !== undefined) {
      statsCards.push({ 
        name: "Total Candidates", 
        value: stats.totalCandidates.toLocaleString(), 
        change: "+12%", 
        icon: Users 
      })
    }
    
    if (stats.activeScreenings !== undefined) {
      statsCards.push({ 
        name: "Active Screenings", 
        value: stats.activeScreenings.toString(), 
        change: "+2", 
        icon: ClipboardList 
      })
    }
    
    if (stats.totalQuestions !== undefined) {
      statsCards.push({ 
        name: "Questions in Bank", 
        value: stats.totalQuestions.toLocaleString(), 
        change: "+23%", 
        icon: BookOpen 
      })
    }
    
    if (stats.totalUsers !== undefined) {
      statsCards.push({ 
        name: "Total Users", 
        value: stats.totalUsers.toLocaleString(), 
        change: "+5%", 
        icon: Users 
      })
    }

    return statsCards
  }

  const navigationItems = getNavigationItems()
  const quickActions = getQuickActions()
  const statsCards = getStatsCards()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {getDashboardTitle()}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, {userName}! {getWelcomeMessage()}
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {userRole}
          </Badge>
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
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-24 mt-2"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            statsCards.map((stat) => (
              <Card key={stat.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            ))
          )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Button variant="outline" className="w-full justify-start h-auto p-4">
                    <action.icon className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{action.name}</div>
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Screenings</CardTitle>
              <CardDescription>
                Latest screening activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                  ))
                ) : recentScreenings.length > 0 ? (
                  recentScreenings.map((screening, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{screening.name}</h4>
                        <p className="text-sm text-gray-500">{screening.candidates} candidates</p>
                      </div>
                      <Badge 
                        variant={
                          screening.status === "ACTIVE" ? "default" :
                          screening.status === "SCHEDULED" ? "secondary" :
                          screening.status === "COMPLETED" ? "outline" : "destructive"
                        }
                      >
                        {screening.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ClipboardList className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No recent screenings found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Current system health and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Database</h3>
                    <p className="text-sm text-gray-500">All systems operational</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">API Services</h3>
                    <p className="text-sm text-gray-500">Normal response times</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Backup</h3>
                    <p className="text-sm text-gray-500">Last backup: 2 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}