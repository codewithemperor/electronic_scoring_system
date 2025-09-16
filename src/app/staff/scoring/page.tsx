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
import { Eye, CheckCircle, XCircle, Clock, Search, Filter } from "lucide-react"
import { toast } from "sonner"

interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  registrationNumber: string
  status: string
  hasWritten: boolean
  totalScore: number | null
  percentage: number | null
  createdAt: string
  screening: {
    id: string
    name: string
    status: string
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
  status: string
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  marks: number
  subject: {
    name: string
    code: string
  }
}

export default function ScoringPage() {
  const { data: session } = useSession()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [selectedScreening, setSelectedScreening] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isScoringDialogOpen, setIsScoringDialogOpen] = useState(false)
  const [scoringQuestions, setScoringQuestions] = useState<Question[]>([])
  const [scoringLoading, setScoringLoading] = useState(false)

  useEffect(() => {
    fetchCandidates()
    fetchScreenings()
  }, [selectedScreening, selectedStatus])

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
        page: "1",
        limit: "50",
      })

      if (searchTerm) params.append("search", searchTerm)
      if (selectedScreening) params.append("screeningId", selectedScreening)
      if (selectedStatus) params.append("status", selectedStatus)

      const response = await fetch(`/api/candidates?${params}`)
      if (response.ok) {
        const data = await response.json()
        setCandidates(data.candidates)
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

  const fetchScoringQuestions = async (candidateId: string) => {
    try {
      const response = await fetch(`/api/candidates/${candidateId}/questions`)
      if (response.ok) {
        const data = await response.json()
        setScoringQuestions(data)
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error)
      toast.error("Failed to load questions")
    }
  }

  const handleScoreCandidate = async (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    await fetchScoringQuestions(candidate.id)
    setIsScoringDialogOpen(true)
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

  const getScoreColor = (percentage: number | null) => {
    if (percentage === null) return "text-gray-500"
    if (percentage >= 70) return "text-green-600"
    if (percentage >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const writtenCandidates = candidates.filter(c => c.hasWritten)
  const unWrittenCandidates = candidates.filter(c => !c.hasWritten)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Test Scoring</h1>
            <p className="mt-1 text-sm text-gray-600">
              Score and manage candidate test results
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{candidates.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Written</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{writtenCandidates.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Scoring</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unWrittenCandidates.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {writtenCandidates.length > 0 
                  ? Math.round((writtenCandidates.filter(c => c.status === 'PASSED').length / writtenCandidates.length) * 100)
                  : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
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
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Actions</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedScreening("")
                    setSelectedStatus("")
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidates Table */}
        <Card>
          <CardHeader>
            <CardTitle>Candidates for Scoring</CardTitle>
            <CardDescription>
              Candidates who need to be scored or have been scored
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registration Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Screening</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Test Status</TableHead>
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
                            <div className={`font-medium ${getScoreColor(candidate.percentage)}`}>
                              {candidate.totalScore}
                            </div>
                            <div className="text-sm text-gray-500">
                              {candidate.percentage?.toFixed(1)}%
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {candidate.hasWritten ? (
                          <Badge variant="default">Written</Badge>
                        ) : (
                          <Badge variant="secondary">Not Written</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleScoreCandidate(candidate)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!candidate.hasWritten && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Navigate to test interface
                                window.open(`/candidate/take-test/${candidate.id}`, '_blank')
                              }}
                            >
                              Start Test
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Scoring Dialog */}
        <Dialog open={isScoringDialogOpen} onOpenChange={setIsScoringDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Score Test - {selectedCandidate?.firstName} {selectedCandidate?.lastName}
              </DialogTitle>
              <DialogDescription>
                Review and score candidate's test answers
              </DialogDescription>
            </DialogHeader>
            {selectedCandidate && (
              <div className="space-y-4">
                {/* Candidate Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Registration Number</h4>
                    <p className="font-medium">{selectedCandidate.registrationNumber}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Program</h4>
                    <p className="font-medium">{selectedCandidate.program.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Current Score</h4>
                    <p className="font-medium">
                      {selectedCandidate.totalScore !== null ? selectedCandidate.totalScore : "Not scored"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Status</h4>
                    <Badge className={getStatusColor(selectedCandidate.status)}>
                      {selectedCandidate.status}
                    </Badge>
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  <h4 className="font-medium">Test Questions</h4>
                  {scoringQuestions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium">
                          {index + 1}. {question.question}
                        </h5>
                        <Badge variant="outline">
                          {question.marks} marks
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 border rounded text-sm ${
                              option.startsWith(question.correctAnswer)
                                ? "bg-green-50 border-green-200"
                                : "border-gray-200"
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Subject: {question.subject.name} ({question.subject.code})</span>
                        <span>Correct Answer: {question.correctAnswer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsScoringDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}