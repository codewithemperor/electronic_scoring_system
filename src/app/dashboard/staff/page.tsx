'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  UserCheck, 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  BookOpen,
  Calendar,
  Target,
  Users
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export default function StaffDashboard() {
  const { user } = useAuth()

  // Mock data for demonstration
  const stats = [
    {
      title: 'Today\'s Screenings',
      value: '12',
      change: '+3',
      icon: UserCheck,
      description: 'Candidates to screen today'
    },
    {
      title: 'Completed',
      value: '8',
      change: '+2',
      icon: CheckCircle,
      description: 'Screenings completed today'
    },
    {
      title: 'Pending',
      value: '4',
      change: '-1',
      icon: Clock,
      description: 'Awaiting evaluation'
    },
    {
      title: 'Average Score',
      value: '76%',
      change: '+5%',
      icon: TrendingUp,
      description: 'Today\'s average'
    }
  ]

  const todayScreenings = [
    {
      id: 'SCR001',
      candidate: 'Amina Bello',
      jambNumber: 'JAMB2024001',
      program: 'Computer Science',
      time: '9:00 AM',
      status: 'Completed',
      score: 82
    },
    {
      id: 'SCR002',
      candidate: 'Chukwu Emeka',
      jambNumber: 'JAMB2024002',
      program: 'Computer Science',
      time: '9:30 AM',
      status: 'In Progress',
      score: null
    },
    {
      id: 'SCR003',
      candidate: 'Fatima Ibrahim',
      jambNumber: 'JAMB2024003',
      program: 'Computer Science',
      time: '10:00 AM',
      status: 'Pending',
      score: null
    },
    {
      id: 'SCR004',
      candidate: 'David Okafor',
      jambNumber: 'JAMB2024004',
      program: 'Computer Science',
      time: '10:30 AM',
      status: 'Pending',
      score: null
    }
  ]

  const screeningCriteria = [
    {
      name: 'UTME Score',
      weight: 40,
      minScore: 180,
      maxScore: 400
    },
    {
      name: 'O\'Level Results',
      weight: 30,
      minScore: 0,
      maxScore: 30
    },
    {
      name: 'Post-UTME Score',
      weight: 20,
      minScore: 0,
      maxScore: 20
    },
    {
      name: 'Interview Performance',
      weight: 10,
      minScore: 0,
      maxScore: 10
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'In Progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case 'Pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}! Here's your screening overview for today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Target className="w-3 h-3 mr-1" />
            On Track
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
                  {stat.change} from yesterday
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's Screenings */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Screening Schedule</CardTitle>
            <CardDescription>
              Candidates scheduled for screening today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayScreenings.map((screening) => (
                <div key={screening.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{screening.candidate}</span>
                      {getStatusBadge(screening.status)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {screening.jambNumber} • {screening.program}
                    </div>
                    <div className="text-sm text-gray-500">
                      {screening.time}
                    </div>
                  </div>
                  <div className="text-right">
                    {screening.score && (
                      <div className="text-lg font-bold text-green-600">{screening.score}%</div>
                    )}
                    <Button 
                      size="sm" 
                      variant={screening.status === 'Pending' ? 'default' : 'outline'}
                      className="mt-1"
                    >
                      {screening.status === 'Pending' ? 'Start' : 'View'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Screening Criteria */}
        <Card>
          <CardHeader>
            <CardTitle>Screening Criteria</CardTitle>
            <CardDescription>
              Evaluation criteria and scoring weights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {screeningCriteria.map((criteria) => (
                <div key={criteria.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{criteria.name}</span>
                    <span className="text-sm text-gray-500">{criteria.weight}%</span>
                  </div>
                  <Progress value={criteria.weight} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Min: {criteria.minScore}</span>
                    <span>Max: {criteria.maxScore}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Weight</span>
                <span className="font-bold">100%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance Overview</CardTitle>
          <CardDescription>
            Your screening performance this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">45</div>
              <div className="text-sm text-gray-500">Total Screenings</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500 ml-1">+12%</span>
              </div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">78%</div>
              <div className="text-sm text-gray-500">Average Score</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500 ml-1">+5%</span>
              </div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">4.8</div>
              <div className="text-sm text-gray-500">Efficiency Rating</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-500 ml-1">+0.3</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-auto p-4 flex-col space-y-2">
              <UserCheck className="h-6 w-6" />
              <span>Start Screening</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <ClipboardList className="h-6 w-6" />
              <span>View Queue</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <BookOpen className="h-6 w-6" />
              <span>Examinations</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Schedule</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your recent screening activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Completed screening for Amina Bello</p>
                <p className="text-xs text-gray-500">Computer Science • Score: 82% • 2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Started screening for Chukwu Emeka</p>
                <p className="text-xs text-gray-500">Computer Science • In Progress • 30 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Submitted weekly report</p>
                <p className="text-xs text-gray-500">45 screenings completed • 5 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}