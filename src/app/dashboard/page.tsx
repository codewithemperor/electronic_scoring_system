"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
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
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

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

  const navigationItems = getNavigationItems()
  const quickActions = getQuickActions()

  // Mock statistics - in real app, these would come from API
  const stats = [
    { name: "Total Candidates", value: "1,234", change: "+12%", icon: Users },
    { name: "Active Screenings", value: "8", change: "+2", icon: ClipboardList },
    { name: "Questions in Bank", value: "456", change: "+23%", icon: BookOpen },
    { name: "Completion Rate", value: "87%", change: "+5%", icon: TrendingUp },
  ]

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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
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
          ))}
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
                {[
                  { name: "ND Admission Screening 2024/2025", status: "ACTIVE", candidates: 234 },
                  { name: "HND Admission Screening 2024/2025", status: "SCHEDULED", candidates: 156 },
                  { name: "ND Part-time Screening 2024/2025", status: "COMPLETED", candidates: 89 },
                ].map((screening, index) => (
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
                ))}
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