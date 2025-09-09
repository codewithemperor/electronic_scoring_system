'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Mail, 
  Phone,
  Calendar,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  BarChart3,
  MoreHorizontal
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export default function AdminCandidatesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [programFilter, setProgramFilter] = useState('all')

  // Mock candidates data
  const candidates = [
    {
      id: 'CAND001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+234 801 234 5678',
      jambNumber: 'JAMB2024001',
      utmeScore: 265,
      program: 'Computer Science',
      status: 'Under Review',
      appliedDate: '2024-01-10',
      screeningScore: 78,
      profileCompletion: 85,
      documentsUploaded: 4,
      lastActive: '2024-01-15'
    },
    {
      id: 'CAND002',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@email.com',
      phone: '+234 802 345 6789',
      jambNumber: 'JAMB2024002',
      utmeScore: 245,
      program: 'Electrical Engineering',
      status: 'Approved',
      appliedDate: '2024-01-08',
      screeningScore: 82,
      profileCompletion: 100,
      documentsUploaded: 5,
      lastActive: '2024-01-14'
    },
    {
      id: 'CAND003',
      firstName: 'Emma',
      lastName: 'Williams',
      email: 'emma.williams@email.com',
      phone: '+234 803 456 7890',
      jambNumber: 'JAMB2024003',
      utmeScore: 280,
      program: 'Business Administration',
      status: 'Pending',
      appliedDate: '2024-01-12',
      screeningScore: null,
      profileCompletion: 60,
      documentsUploaded: 3,
      lastActive: '2024-01-13'
    },
    {
      id: 'CAND004',
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@email.com',
      phone: '+234 804 567 8901',
      jambNumber: 'JAMB2024004',
      utmeScore: 220,
      program: 'Mass Communication',
      status: 'Under Review',
      appliedDate: '2024-01-09',
      screeningScore: 65,
      profileCompletion: 75,
      documentsUploaded: 4,
      lastActive: '2024-01-12'
    },
    {
      id: 'CAND005',
      firstName: 'Amina',
      lastName: 'Bello',
      email: 'amina.bello@email.com',
      phone: '+234 805 678 9012',
      jambNumber: 'JAMB2024005',
      utmeScore: 290,
      program: 'Computer Science',
      status: 'Rejected',
      appliedDate: '2024-01-07',
      screeningScore: 45,
      profileCompletion: 90,
      documentsUploaded: 5,
      lastActive: '2024-01-11'
    }
  ]

  const programs = ['Computer Science', 'Electrical Engineering', 'Business Administration', 'Mass Communication']

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.jambNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || candidate.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesProgram = programFilter === 'all' || candidate.program === programFilter
    return matchesSearch && matchesStatus && matchesProgram
  })

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

  const getProfileCompletionBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge className="bg-green-100 text-green-800">Complete</Badge>
    if (percentage >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
    if (percentage >= 50) return <Badge className="bg-orange-100 text-orange-800">Fair</Badge>
    return <Badge className="bg-red-100 text-red-800">Incomplete</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidate Management</h1>
          <p className="text-muted-foreground">
            Manage candidate applications and track screening progress
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <UserCheck className="w-4 h-4 mr-2" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{candidates.length}</p>
                <p className="text-xs text-muted-foreground">Total Candidates</p>
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
                  {candidates.filter(c => c.status === 'Approved').length}
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
                  {candidates.filter(c => c.status === 'Under Review').length}
                </p>
                <p className="text-xs text-muted-foreground">Under Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(candidates.reduce((sum, c) => sum + (c.utmeScore || 0), 0) / candidates.length)}
                </p>
                <p className="text-xs text-muted-foreground">Avg UTME Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Applications</CardTitle>
          <CardDescription>
            View and manage all candidate applications
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
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {programs.map(program => (
                  <SelectItem key={program} value={program}>{program}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Candidates Table */}
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {candidate.firstName} {candidate.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{candidate.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(candidate.status)}
                        {getProfileCompletionBadge(candidate.profileCompletion)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">JAMB Number</p>
                        <p className="font-medium">{candidate.jambNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">UTME Score</p>
                        <p className="font-medium">{candidate.utmeScore}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Program</p>
                        <p className="font-medium">{candidate.program}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Applied Date</p>
                        <p className="font-medium">{candidate.appliedDate}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Screening Score</p>
                        <p className="font-medium">
                          {candidate.screeningScore ? `${candidate.screeningScore}%` : 'Pending'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Profile Complete</p>
                        <p className="font-medium">{candidate.profileCompletion}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Documents</p>
                        <p className="font-medium">{candidate.documentsUploaded}/5</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Active</p>
                        <p className="font-medium">{candidate.lastActive}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        <span>{candidate.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        <span>{candidate.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Program Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Application Distribution by Program</CardTitle>
          <CardDescription>
            Overview of candidate distribution across programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {programs.map(program => {
              const programCandidates = candidates.filter(c => c.program === program)
              const approvedCount = programCandidates.filter(c => c.status === 'Approved').length
              const totalCount = programCandidates.length
              
              return (
                <div key={program} className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{program}</h4>
                  <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
                  <div className="text-sm text-gray-500 mb-2">Total Applications</div>
                  <div className="text-sm text-green-600">{approvedCount} Approved</div>
                  <div className="text-xs text-gray-500">
                    {totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0}% approval rate
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}