'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Download,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  BookOpen,
  Users,
  TrendingUp
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export default function CandidateApplicationsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock applications data
  const applications = [
    {
      id: 'APP001',
      program: 'Computer Science',
      department: 'Computing & Information Technology',
      status: 'Under Review',
      appliedDate: '2025-01-10',
      screeningScore: null,
      utmeScore: 245,
      oLevelScore: 28,
      postUtmeScore: null,
      interviewScore: null,
      totalScore: null,
      capacity: 120,
      applicants: 156
    },
    {
      id: 'APP002',
      program: 'Electrical Engineering',
      department: 'Engineering Technology',
      status: 'Pending',
      appliedDate: '2025-01-12',
      screeningScore: null,
      utmeScore: 245,
      oLevelScore: 28,
      postUtmeScore: null,
      interviewScore: null,
      totalScore: null,
      capacity: 80,
      applicants: 98
    },
    {
      id: 'APP003',
      program: 'Business Administration',
      department: 'Management Sciences',
      status: 'Approved',
      appliedDate: '2025-01-08',
      screeningScore: 85,
      utmeScore: 245,
      oLevelScore: 28,
      postUtmeScore: 18,
      interviewScore: 8,
      totalScore: 85,
      capacity: 150,
      applicants: 189
    }
  ]

  const availablePrograms = [
    {
      id: 'PROG001',
      name: 'Computer Science',
      department: 'Computing & Information Technology',
      duration: '4 years',
      capacity: 120,
      requirements: 'UTME: 200, O\'Level: 5 credits including Maths & English',
      deadline: '2025-02-15'
    },
    {
      id: 'PROG002',
      name: 'Electrical Engineering',
      department: 'Engineering Technology',
      duration: '4 years',
      capacity: 80,
      requirements: 'UTME: 200, O\'Level: 5 credits including Maths, Physics & English',
      deadline: '2025-02-15'
    },
    {
      id: 'PROG003',
      name: 'Business Administration',
      department: 'Management Sciences',
      duration: '4 years',
      capacity: 150,
      requirements: 'UTME: 180, O\'Level: 5 credits including Maths & English',
      deadline: '2025-02-15'
    },
    {
      id: 'PROG004',
      name: 'Mass Communication',
      department: 'Communication & Media Studies',
      duration: '4 years',
      capacity: 100,
      requirements: 'UTME: 180, O\'Level: 5 credits including English & Literature',
      deadline: '2025-02-15'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'Under Review':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'Pending':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'Rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const handleApply = (programId: string) => {
    // Handle application logic
    console.log('Applying for program:', programId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
          <p className="text-muted-foreground">
            Manage your program applications and track their status
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{applications.length}</p>
                <p className="text-xs text-muted-foreground">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {applications.filter(app => app.status === 'Approved').length}
                </p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">
                  {applications.filter(app => app.status === 'Under Review').length}
                </p>
                <p className="text-xs text-muted-foreground">Under Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {applications.filter(app => app.totalScore).length > 0 
                    ? Math.round(applications.filter(app => app.totalScore).reduce((sum, app) => sum + (app.totalScore || 0), 0) / applications.filter(app => app.totalScore).length)
                    : 0}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Current Applications</CardTitle>
          <CardDescription>
            Track the status of your submitted applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{application.program}</h3>
                      {getStatusBadge(application.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{application.department}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Applied Date</p>
                        <p className="font-medium">{application.appliedDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">UTME Score</p>
                        <p className="font-medium">{application.utmeScore}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Competition</p>
                        <p className="font-medium">{application.applicants}/{application.capacity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Score</p>
                        <p className="font-medium">
                          {application.totalScore ? `${application.totalScore}%` : 'Pending'}
                        </p>
                      </div>
                    </div>

                    {application.totalScore && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-3">Score Breakdown</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">UTME (40%)</p>
                            <p className="font-medium">{Math.round(application.utmeScore * 0.4)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">O'Level (30%)</p>
                            <p className="font-medium">{Math.round(application.oLevelScore * 0.3)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Post-UTME (20%)</p>
                            <p className="font-medium">{application.postUtmeScore || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Interview (10%)</p>
                            <p className="font-medium">{application.interviewScore || 0}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {application.status === 'Approved' && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Programs */}
      <Card>
        <CardHeader>
          <CardTitle>Available Programs</CardTitle>
          <CardDescription>
            Browse and apply for available programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {availablePrograms.map((program) => (
              <div key={program.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{program.name}</h3>
                    <p className="text-sm text-gray-600">{program.department}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{program.capacity} capacity</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Duration: {program.duration}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Deadline: {program.deadline}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-blue-900 mb-1">Requirements:</p>
                  <p className="text-sm text-blue-800">{program.requirements}</p>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => handleApply(program.id)}
                  disabled={applications.some(app => app.program === program.name)}
                >
                  {applications.some(app => app.program === program.name) ? 'Already Applied' : 'Apply Now'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}