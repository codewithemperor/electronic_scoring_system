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
import { Textarea } from "@/components/ui/textarea"
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
  TrendingUp
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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

interface AcademicSession {
  id: string
  name: string
  isActive: boolean
}

interface ScreeningStats {
  totalScreenings: number
  activeScreenings: number
  totalCandidates: number
  averageQuestions: number
  byStatus: {
    DRAFT: number
    SCHEDULED: number
    ACTIVE: number
    COMPLETED: number
    CANCELLED: number
  }
}

interface ScreeningFormData {
  name: string
  academicSessionId: string
  startDate: string
  endDate: string
  duration: number
  totalMarks: number
  passMarks: number
  instructions: string
}

const screeningSchema = {
  name: (value: string) => {
    if (!value || value.trim().length < 3) {
      return "Screening name must be at least 3 characters long"
    }
    return true
  },
  academicSessionId: (value: string) => {
    if (!value) {
      return "Academic session is required"
    }
    return true
  },
  startDate: (value: string) => {
    if (!value) {
      return "Start date is required"
    }
    return true
  },
  endDate: (value: string) => {
    if (!value) {
      return "End date is required"
    }
    return true
  },
  duration: (value: number) => {
    if (!value || value < 30) {
      return "Duration must be at least 30 minutes"
    }
    return true
  },
  totalMarks: (value: number) => {
    if (!value || value < 1) {
      return "Total marks must be at least 1"
    }
    return true
  },
  passMarks: (value: number) => {
    if (!value || value < 0) {
      return "Pass marks must be at least 0"
    }
    return true
  }
}

export default function ExaminerScreeningsPage() {
  const { data: session } = useSession()
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [academicSessions, setAcademicSessions] = useState<AcademicSession[]>([])
  const [stats, setStats] = useState<ScreeningStats>({
    totalScreenings: 0,
    activeScreenings: 0,
    totalCandidates: 0,
    averageQuestions: 0,
    byStatus: { DRAFT: 0, SCHEDULED: 0, ACTIVE: 0, COMPLETED: 0, CANCELLED: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedScreening, setSelectedScreening] = useState<Screening | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ScreeningFormData>()

  useEffect(() => {
    fetchScreenings()
    fetchAcademicSessions()
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

  const fetchAcademicSessions = async () => {
    try {
      const response = await fetch("/api/academic-sessions")
      if (response.ok) {
        const data = await response.json()
        setAcademicSessions(data)
      }
    } catch (error) {
      console.error("Failed to fetch academic sessions:", error)
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
              View and manage examination screenings
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
                All screenings
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
                Across all screenings
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Questions</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageQuestions}</div>
              <p className="text-xs text-muted-foreground">
                Per screening
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
      </div>
    </DashboardLayout>
  )
}