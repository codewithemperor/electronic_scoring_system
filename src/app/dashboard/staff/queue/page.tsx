'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  Search, 
  Filter, 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  UserCheck,
  FileText,
  Calendar,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Eye,
  MoreHorizontal,
  Timer
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export default function StaffQueuePage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  // Mock screening queue data
  const screeningQueue = [
    {
      id: 'SCR001',
      candidate: {
        firstName: 'Amina',
        lastName: 'Bello',
        jambNumber: 'JAMB2024001',
        email: 'amina.bello@email.com',
        phone: '+234 801 234 5678'
      },
      program: 'Computer Science',
      scheduledTime: '2024-01-16 09:00',
      status: 'pending',
      priority: 'high',
      estimatedDuration: 30,
      utmeScore: 265,
      oLevelScore: 28,
      documentsVerified: true,
      screeningStage: 'Document Verification'
    },
    {
      id: 'SCR002',
      candidate: {
        firstName: 'Chukwu',
        lastName: 'Emeka',
        jambNumber: 'JAMB2024002',
        email: 'chukwu.emeka@email.com',
        phone: '+234 802 345 6789'
      },
      program: 'Computer Science',
      scheduledTime: '2024-01-16 09:30',
      status: 'in_progress',
      priority: 'medium',
      estimatedDuration: 45,
      utmeScore: 245,
      oLevelScore: 26,
      documentsVerified: true,
      screeningStage: 'Academic Evaluation',
      startTime: '2024-01-16 09:35',
      elapsedTime: 15
    },
    {
      id: 'SCR003',
      candidate: {
        firstName: 'Fatima',
        lastName: 'Ibrahim',
        jambNumber: 'JAMB2024003',
        email: 'fatima.ibrahim@email.com',
        phone: '+234 803 456 7890'
      },
      program: 'Computer Science',
      scheduledTime: '2024-01-16 10:00',
      status: 'pending',
      priority: 'high',
      estimatedDuration: 30,
      utmeScore: 280,
      oLevelScore: 30,
      documentsVerified: true,
      screeningStage: 'Document Verification'
    },
    {
      id: 'SCR004',
      candidate: {
        firstName: 'David',
        lastName: 'Okafor',
        jambNumber: 'JAMB2024004',
        email: 'david.okafor@email.com',
        phone: '+234 804 567 8901'
      },
      program: 'Computer Science',
      scheduledTime: '2024-01-16 10:30',
      status: 'pending',
      priority: 'low',
      estimatedDuration: 30,
      utmeScore: 220,
      oLevelScore: 24,
      documentsVerified: false,
      screeningStage: 'Document Verification'
    },
    {
      id: 'SCR005',
      candidate: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        jambNumber: 'JAMB2024005',
        email: 'sarah.johnson@email.com',
        phone: '+234 805 678 9012'
      },
      program: 'Computer Science',
      scheduledTime: '2024-01-16 11:00',
      status: 'completed',
      priority: 'medium',
      estimatedDuration: 40,
      utmeScore: 290,
      oLevelScore: 28,
      documentsVerified: true,
      screeningStage: 'Completed',
      completedAt: '2024-01-16 08:45',
      totalScore: 85,
      screeningOfficer: 'John Doe'
    }
  ]

  const filteredQueue = screeningQueue.filter(item => {
    const matchesSearch = item.candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.candidate.jambNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{priority}</Badge>
    }
  }

  const handleStartScreening = (screeningId: string) => {
    console.log('Starting screening for:', screeningId)
  }

  const handlePauseScreening = (screeningId: string) => {
    console.log('Pausing screening for:', screeningId)
  }

  const handleCompleteScreening = (screeningId: string) => {
    console.log('Completing screening for:', screeningId)
  }

  const todayStats = {
    total: screeningQueue.length,
    completed: screeningQueue.filter(item => item.status === 'completed').length,
    inProgress: screeningQueue.filter(item => item.status === 'in_progress').length,
    pending: screeningQueue.filter(item => item.status === 'pending').length,
    averageTime: 32 // minutes
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Screening Queue</h1>
          <p className="text-muted-foreground">
            Manage and track candidate screening sessions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button>
            <UserCheck className="w-4 h-4 mr-2" />
            Quick Start
          </Button>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{todayStats.total}</p>
                <p className="text-xs text-muted-foreground">Total Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{todayStats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{todayStats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Timer className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{todayStats.averageTime}</p>
                <p className="text-xs text-muted-foreground">Avg Time (min)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {todayStats.total > 0 ? Math.round((todayStats.completed / todayStats.total) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue Management */}
      <Card>
        <CardHeader>
          <CardTitle>Screening Queue</CardTitle>
          <CardDescription>
            Current screening queue and session management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="space-y-4">
            {filteredQueue.map((item) => (
              <div key={item.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {item.candidate.firstName} {item.candidate.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{item.candidate.jambNumber}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(item.status)}
                        {getPriorityBadge(item.priority)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Program</p>
                        <p className="font-medium">{item.program}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Scheduled Time</p>
                        <p className="font-medium">{item.scheduledTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">{item.estimatedDuration} min</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Stage</p>
                        <p className="font-medium">{item.screeningStage}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">UTME Score</p>
                        <p className="font-medium">{item.utmeScore}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">O'Level Score</p>
                        <p className="font-medium">{item.oLevelScore}/30</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Documents</p>
                        <p className="font-medium">
                          {item.documentsVerified ? (
                            <span className="text-green-600">Verified</span>
                          ) : (
                            <span className="text-red-600">Pending</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium text-sm">{item.candidate.phone}</p>
                      </div>
                    </div>

                    {item.status === 'in_progress' && item.elapsedTime && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-yellow-800">Session in Progress</span>
                          <span className="text-sm text-yellow-600">
                            {item.elapsedTime} min elapsed
                          </span>
                        </div>
                        <Progress 
                          value={(item.elapsedTime / item.estimatedDuration) * 100} 
                          className="h-2 mt-2" 
                        />
                      </div>
                    )}

                    {item.status === 'completed' && item.totalScore && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-800">Screening Completed</span>
                          <span className="text-lg font-bold text-green-600">{item.totalScore}%</span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          Completed by {item.screeningOfficer} at {item.completedAt}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {item.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStartScreening(item.id)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                    )}
                    
                    {item.status === 'in_progress' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handlePauseScreening(item.id)}
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleCompleteScreening(item.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete
                        </Button>
                      </>
                    )}
                    
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Today's Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Efficiency Rate</span>
                <span className="font-medium">94%</span>
              </div>
              <Progress value={94} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Handling Time</span>
                <span className="font-medium">{todayStats.averageTime} min</span>
              </div>
              <Progress value={75} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Quality Score</span>
                <span className="font-medium">4.8/5.0</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Daily Targets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Screenings Completed</span>
                <span className="font-medium">{todayStats.completed}/15</span>
              </div>
              <Progress value={(todayStats.completed / 15) * 100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Score Target</span>
                <span className="font-medium">75% Achieved</span>
              </div>
              <Progress value={75} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Time Efficiency</span>
                <span className="font-medium">On Track</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}