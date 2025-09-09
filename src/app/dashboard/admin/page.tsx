'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  MessageSquare
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export default function AdminDashboard() {
  const { user } = useAuth()

  // Mock data for demonstration
  const stats = [
    {
      title: 'Total Candidates',
      value: '856',
      change: '+15%',
      icon: Users,
      description: 'Registered candidates'
    },
    {
      title: 'Staff Members',
      value: '24',
      change: '+2',
      icon: UserCheck,
      description: 'Active staff'
    },
    {
      title: 'Programs',
      value: '8',
      change: '0',
      icon: BookOpen,
      description: 'Department programs'
    },
    {
      title: 'Applications',
      value: '1,234',
      change: '+28%',
      icon: FileText,
      description: 'This academic year'
    }
  ]

  const screeningProgress = [
    {
      program: 'Computer Science',
      total: 120,
      completed: 85,
      pending: 35,
      percentage: 71
    },
    {
      program: 'Electrical Engineering',
      total: 98,
      completed: 62,
      pending: 36,
      percentage: 63
    },
    {
      program: 'Business Administration',
      total: 156,
      completed: 142,
      pending: 14,
      percentage: 91
    },
    {
      program: 'Mass Communication',
      total: 87,
      completed: 45,
      pending: 42,
      percentage: 52
    }
  ]

  const recentApplications = [
    {
      id: 'APP001',
      candidate: 'Sarah Johnson',
      program: 'Computer Science',
      status: 'Under Review',
      date: '2025-01-15',
      score: 78
    },
    {
      id: 'APP002',
      candidate: 'Michael Chen',
      program: 'Electrical Engineering',
      status: 'Approved',
      date: '2025-01-14',
      score: 85
    },
    {
      id: 'APP003',
      candidate: 'Emma Williams',
      program: 'Business Administration',
      status: 'Pending',
      date: '2025-01-13',
      score: null
    },
    {
      id: 'APP004',
      candidate: 'David Brown',
      program: 'Mass Communication',
      status: 'Rejected',
      date: '2025-01-12',
      score: 45
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'Under Review':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
      case 'Pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}! Here's an overview of your department.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Department of Computer Science
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs ml-1 text-green-500">
                  {stat.change} from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Screening Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Screening Progress by Program</CardTitle>
            <CardDescription>
              Progress of candidate screening across programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {screeningProgress.map((program) => (
                <div key={program.program} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{program.program}</span>
                    <span className="text-sm text-gray-500">
                      {program.completed}/{program.total} ({program.percentage}%)
                    </span>
                  </div>
                  <Progress value={program.percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Completed: {program.completed}</span>
                    <span>Pending: {program.pending}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Latest candidate applications requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{app.candidate}</span>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {app.program} • {app.date}
                    </div>
                  </div>
                  <div className="text-right">
                    {app.score && (
                      <div className="text-sm font-medium">{app.score}%</div>
                    )}
                    <div className="text-xs text-gray-500">{app.id}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Applications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Alerts */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Quick Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-auto p-4 flex-col space-y-2">
                <UserCheck className="h-6 w-6" />
                <span>Review Applications</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span>Manage Staff</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                <BookOpen className="h-6 w-6" />
                <span>Program Settings</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span>View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Pending Reviews</p>
                  <p className="text-xs text-gray-500">12 applications awaiting review</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Screening Deadline</p>
                  <p className="text-xs text-gray-500">3 days remaining</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Staff Performance</p>
                  <p className="text-xs text-gray-500">All targets met this week</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Upcoming Events
          </CardTitle>
          <CardDescription>
            Scheduled screenings and important dates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Department Meeting</p>
                  <p className="text-sm text-gray-500">Weekly staff coordination</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Tomorrow</p>
                <p className="text-xs text-gray-500">10:00 AM</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Screening Session</p>
                  <p className="text-sm text-gray-500">Computer Science candidates</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Jan 20</p>
                <p className="text-xs text-gray-500">9:00 AM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}