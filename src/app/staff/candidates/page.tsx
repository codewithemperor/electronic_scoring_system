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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, Download, Search, Filter } from "lucide-react"
import { toast } from "sonner"

interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  registrationNumber: string
  status: string
  hasWritten: boolean
  totalScore: number | null
  percentage: number | null
  createdAt: string
  screening: {
    name: string
    startDate: string
    endDate: string
  }
  program: {
    name: string
    code: string
    department: {
      name: string
    }
  }
}

interface Screening {
  id: string
  name: string
}

export default function CandidatesPage() {
  const { data: session } = useSession()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedScreening, setSelectedScreening] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchCandidates()
    fetchScreenings()
  }, [currentPage, selectedScreening, selectedStatus])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCandidates()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      })

      if (searchTerm) params.append("search", searchTerm)
      if (selectedScreening) params.append("screeningId", selectedScreening)
      if (selectedStatus) params.append("status", selectedStatus)

      const response = await fetch(`/api/candidates?${params}`)
      if (response.ok) {
        const data = await response.json()
        setCandidates(data.candidates)
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error("Failed to fetch candidates:", error)
      toast.error("Failed to load candidates")
    } finally {
      setLoading(false)
    }
  }

  const fetchScreenings = async () => {
    try {
      const response = await fetch("/api/screenings")
      if (response.ok) {
        const data = await response.json()
        setScreenings(data)
      }
    } catch (error) {
      console.error("Failed to fetch screenings:", error)
    }
  }

  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setIsDetailDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REGISTERED":
        return "bg-blue-100 text-blue-800"
      case "WRITTEN":
        return "bg-yellow-100 text-yellow-800"
      case "PASSED":
        return "bg-green-100 text-green-800"
      case "FAILED":
        return "bg-red-100 text-red-800"
      case "ADMITTED":
        return "bg-purple-100 text-purple-800"
      case "REJECTED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const exportCandidates = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedScreening) params.append("screeningId", selectedScreening)
      if (selectedStatus) params.append("status", selectedStatus)

      const response = await fetch(`/api/candidates/export?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `candidates-${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success("Candidates exported successfully")
      }
    } catch (error) {
      console.error("Failed to export candidates:", error)
      toast.error("Failed to export candidates")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Candidate Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              View and manage registered candidates
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={exportCandidates}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, or reg number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Screening</label>
                <Select value={selectedScreening} onValueChange={setSelectedScreening}>
                  <SelectTrigger>
                    <SelectValue placeholder="All screenings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All screenings</SelectItem>
                    {screenings.map((screening) => (
                      <SelectItem key={screening.id} value={screening.id}>
                        {screening.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="REGISTERED">Registered</SelectItem>
                    <SelectItem value="WRITTEN">Written</SelectItem>
                    <SelectItem value="PASSED">Passed</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="ADMITTED">Admitted</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Actions</label>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedScreening("")
                      setSelectedStatus("")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidates Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Candidates</CardTitle>
            <CardDescription>
              List of all registered candidates and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Registration Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Screening</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">
                          {candidate.registrationNumber}
                        </TableCell>
                        <TableCell>
                          {candidate.firstName} {candidate.lastName}
                        </TableCell>
                        <TableCell>{candidate.email}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{candidate.program.name}</div>
                            <div className="text-sm text-gray-500">
                              {candidate.program.department.name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{candidate.screening.name}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(candidate.status)}>
                            {candidate.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {candidate.totalScore !== null ? (
                            <div>
                              <div className="font-medium">{candidate.totalScore}</div>
                              <div className="text-sm text-gray-500">
                                {candidate.percentage?.toFixed(1)}%
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(candidate)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-700">
                    Showing {candidates.length} candidates
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Candidate Details Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Candidate Details</DialogTitle>
              <DialogDescription>
                Detailed information about the selected candidate
              </DialogDescription>
            </DialogHeader>
            {selectedCandidate && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Registration Number</h4>
                    <p className="font-medium">{selectedCandidate.registrationNumber}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Status</h4>
                    <Badge className={getStatusColor(selectedCandidate.status)}>
                      {selectedCandidate.status}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Full Name</h4>
                    <p className="font-medium">
                      {selectedCandidate.firstName} {selectedCandidate.lastName}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Email</h4>
                    <p className="font-medium">{selectedCandidate.email}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Phone</h4>
                    <p className="font-medium">{selectedCandidate.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Test Written</h4>
                    <p className="font-medium">
                      {selectedCandidate.hasWritten ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Academic Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">Program</h4>
                      <p className="font-medium">{selectedCandidate.program.name}</p>
                      <p className="text-sm text-gray-600">
                        {selectedCandidate.program.department.name}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">Screening</h4>
                      <p className="font-medium">{selectedCandidate.screening.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedCandidate.screening.startDate).toLocaleDateString()} -{" "}
                        {new Date(selectedCandidate.screening.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedCandidate.totalScore !== null && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm text-gray-500 mb-2">Test Results</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-500">Total Score</h4>
                        <p className="font-medium text-lg">{selectedCandidate.totalScore}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-500">Percentage</h4>
                        <p className="font-medium text-lg">
                          {selectedCandidate.percentage?.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsDetailDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}