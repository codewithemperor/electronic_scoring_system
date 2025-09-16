"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  ClipboardList, 
  Users, 
  BookOpen, 
  Play, 
  Pause, 
  Eye,
  Search,
  Filter,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  UserPlus,
  FileText
} from "lucide-react"
import { toast } from "sonner"

interface Screening {
  id: string
  name: string
  startDate: string
  endDate: string
  duration: number
  totalMarks: number
  passMarks: number
  status: string
  instructions: string | null
  academicSession: {
    name: string
  }
  createdBy: {
    firstName: string
    lastName: string
  }
  _count: {
    candidates: number
    questions: number
  }
}

interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  registrationNumber: string
  hasWritten: boolean
  totalScore: number | null
  percentage: number | null
  status: string
  program: {
    name: string
    code: string
  }
}

interface ScreeningStats {
  totalScreenings: number
  activeScreenings: number
  totalCandidates: number
  completionRate: number
  byStatus: {
    DRAFT: number
    SCHEDULED: number
    ACTIVE: number
    COMPLETED: number
    CANCELLED: number
  }
}

export default function StaffScreeningsPage() {
  const { data: session } = useSession()
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [stats, setStats] = useState<ScreeningStats>({
    totalScreenings: 0,
    activeScreenings: 0,
    totalCandidates: 0,
    completionRate: 0,
    byStatus: { DRAFT: 0, SCHEDULED: 0, ACTIVE: 0, COMPLETED: 0, CANCELLED: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [selectedScreening, setSelectedScreening] = useState<Screening | null>(null)
  const [selectedScreeningForCandidates, setSelectedScreeningForCandidates] = useState<Screening | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    fetchScreenings()
    fetchStats()
  }, [])

  const fetchScreenings = async () => {
    try {
      const response = await fetch("/api/screenings")
      if (response.ok) {
        const data = await response.json()
        setScreenings(data)
      }
    } catch (error) {
      console.error("Failed to fetch screenings:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCandidates = async (screeningId: string) => {
    try {
      const response = await fetch(`/api/candidates?screeningId=${screeningId}`)
      if (response.ok) {
        const data = await response.json()
        setCandidates(data)
      }
    } catch (error) {
      console.error("Failed to fetch candidates:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/screenings/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch screening stats:", error)
    }
  }

  const handleViewDetails = (screening: Screening) => {
    setSelectedScreening(screening)
  }

  const handleViewCandidates = (screening: Screening) => {
    setSelectedScreeningForCandidates(screening)
    fetchCandidates(screening.id)
  }

  const filteredScreenings = screenings.filter(screening => {
    const matchesSearch = screening.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         screening.academicSession.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || screening.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800"
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-gray-100 text-gray-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCandidateStatusColor = (status: string) => {
    switch (status) {
      case "PASSED":
        return "bg-green-100 text-green-800"
      case "FAILED":
        return "bg-red-100 text-red-800"
      case "WRITTEN":
        return "bg-blue-100 text-blue-800"
      case "ADMITTED":
        return "bg-purple-100 text-purple-800"
      case "REJECTED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Screening Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              View and manage examination screenings and candidates
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Screenings</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalScreenings}</div>
              <p className="text-xs text-muted-foreground">
                Available screenings
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Screenings</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeScreenings}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCandidates}</div>
              <p className="text-xs text-muted-foreground">
                Registered candidates
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Test completion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Status Overview</CardTitle>
            <CardDescription>
              Current status distribution of all screenings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="text-center">
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-gray-500">{status}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Screenings</CardTitle>
            <CardDescription>
              View and manage examination screenings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search screenings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Academic Session</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Candidates</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScreenings.map((screening) => (
                  <TableRow key={screening.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{screening.name}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(screening.startDate)} - {formatDate(screening.endDate)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{screening.academicSession.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{screening.duration} min</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{screening._count.candidates}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{screening._count.questions}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(screening.status)}>
                        {screening.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(screening)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewCandidates(screening)}
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredScreenings.length === 0 && (
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No screenings found</h3>
                <p className="text-gray-500">No screenings match your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Screening Details Dialog */}
        <Dialog open={!!selectedScreening} onOpenChange={() => setSelectedScreening(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Screening Details</DialogTitle>
              <DialogDescription>
                Detailed information about the screening
              </DialogDescription>
            </DialogHeader>
            {selectedScreening && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Name</Label>
                    <div className="text-sm">{selectedScreening.name}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <Badge className={getStatusColor(selectedScreening.status)}>
                      {selectedScreening.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Academic Session</Label>
                    <div className="text-sm">{selectedScreening.academicSession.name}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Duration</Label>
                    <div className="text-sm">{selectedScreening.duration} minutes</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Start Date</Label>
                    <div className="text-sm">{formatDate(selectedScreening.startDate)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">End Date</Label>
                    <div className="text-sm">{formatDate(selectedScreening.endDate)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Total Marks</Label>
                    <div className="text-sm">{selectedScreening.totalMarks}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Pass Marks</Label>
                    <div className="text-sm">{selectedScreening.passMarks}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Candidates</Label>
                    <div className="text-sm">{selectedScreening._count.candidates}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Questions</Label>
                    <div className="text-sm">{selectedScreening._count.questions}</div>
                  </div>
                </div>
                
                {selectedScreening.instructions && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Instructions</Label>
                    <div className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                      {selectedScreening.instructions}
                    </div>
                  </div>
                )}
                
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created By</Label>
                  <div className="text-sm">
                    {selectedScreening.createdBy.firstName} {selectedScreening.createdBy.lastName}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Candidates Dialog */}
        <Dialog open={!!selectedScreeningForCandidates} onOpenChange={() => setSelectedScreeningForCandidates(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Candidates - {selectedScreeningForCandidates?.name}</DialogTitle>
              <DialogDescription>
                View and manage candidates for this screening
              </DialogDescription>
            </DialogHeader>
            {selectedScreeningForCandidates && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedScreeningForCandidates._count.candidates}
                    </div>
                    <div className="text-sm text-blue-600">Total Candidates</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {candidates.filter(c => c.hasWritten).length}
                    </div>
                    <div className="text-sm text-green-600">Tests Taken</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {candidates.filter(c => c.status === 'PASSED').length}
                    </div>
                    <div className="text-sm text-purple-600">Passed</div>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Registration No.</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">
                              {candidate.firstName} {candidate.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{candidate.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-sm">{candidate.registrationNumber}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{candidate.program.name}</div>
                            <div className="text-sm text-gray-500">{candidate.program.code}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {candidate.hasWritten ? (
                            <div>
                              <div className="font-bold">
                                {candidate.totalScore}/{selectedScreeningForCandidates.totalMarks}
                              </div>
                              <div className="text-sm text-gray-500">
                                {candidate.percentage?.toFixed(1)}%
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-500">Not written</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getCandidateStatusColor(candidate.status)}>
                            {candidate.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {candidates.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
                    <p className="text-gray-500">No candidates registered for this screening</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}