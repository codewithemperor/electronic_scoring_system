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
  FileText, 
  Users, 
  Search, 
  Filter, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  TrendingUp,
  Award,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"

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
  screening: {
    name: string
    totalMarks: number
    passMarks: number
  }
  program: {
    name: string
    code: string
  }
  testScores: TestScore[]
}

interface TestScore {
  id: string
  questionId: string
  selectedAnswer: string | null
  isCorrect: boolean | null
  marks: number
  timeTaken: number | null
  question: {
    question: string
    options: string[]
    correctAnswer: string
    marks: number
    subject: {
      name: string
    }
  }
}

interface Screening {
  id: string
  name: string
  status: string
  _count: {
    candidates: number
  }
}

interface ScoringStats {
  totalCandidates: number
  scoredCandidates: number
  averageScore: number
  passRate: number
  byStatus: {
    REGISTERED: number
    WRITTEN: number
    PASSED: number
    FAILED: number
    ADMITTED: number
    REJECTED: number
  }
}

export default function ExaminerScoringPage() {
  const { data: session } = useSession()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [stats, setStats] = useState<ScoringStats>({
    totalCandidates: 0,
    scoredCandidates: 0,
    averageScore: 0,
    passRate: 0,
    byStatus: { REGISTERED: 0, WRITTEN: 0, PASSED: 0, FAILED: 0, ADMITTED: 0, REJECTED: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [selectedScreening, setSelectedScreening] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    fetchCandidates()
    fetchScreenings()
    fetchStats()
  }, [])

  const fetchCandidates = async () => {
    try {
      const response = await fetch("/api/candidates?includeScores=true")
      if (response.ok) {
        const data = await response.json()
        setCandidates(data)
      }
    } catch (error) {
      console.error("Failed to fetch candidates:", error)
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

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/scoring/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch scoring stats:", error)
    }
  }

  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
  }

  const handleManualScore = async (candidateId: string, scoreData: any) => {
    try {
      const response = await fetch(`/api/scoring/manual-score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateId,
          scores: scoreData
        }),
      })

      if (response.ok) {
        toast.success("Score updated successfully")
        fetchCandidates()
        fetchStats()
      } else {
        toast.error("Failed to update score")
      }
    } catch (error) {
      console.error("Failed to update score:", error)
      toast.error("An error occurred")
    }
  }

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesScreening = !selectedScreening || candidate.screening.id === selectedScreening
    const matchesStatus = !statusFilter || candidate.status === statusFilter
    return matchesSearch && matchesScreening && matchesStatus
  })

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PASSED":
        return <CheckCircle className="h-4 w-4" />
      case "FAILED":
        return <XCircle className="h-4 w-4" />
      case "WRITTEN":
        return <Clock className="h-4 w-4" />
      case "ADMITTED":
        return <Award className="h-4 w-4" />
      case "REJECTED":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
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
            <h1 className="text-2xl font-semibold text-gray-900">Candidate Scoring</h1>
            <p className="mt-1 text-sm text-gray-600">
              Review and score candidate examination results
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <CardTitle className="text-sm font-medium">Scored Candidates</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scoredCandidates}</div>
              <p className="text-xs text-muted-foreground">
                Results processed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Overall performance
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.passRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Success rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Candidate Status Distribution</CardTitle>
            <CardDescription>
              Current status of all candidates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="text-center">
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-gray-500 flex items-center justify-center">
                    {getStatusIcon(status)}
                    <span className="ml-1">{status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Candidates</CardTitle>
            <CardDescription>
              View and score candidate examination results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedScreening} onValueChange={setSelectedScreening}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Screenings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Screenings</SelectItem>
                  {screenings.map((screening) => (
                    <SelectItem key={screening.id} value={screening.id}>
                      {screening.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="REGISTERED">Registered</SelectItem>
                  <SelectItem value="WRITTEN">Written</SelectItem>
                  <SelectItem value="PASSED">Passed</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="ADMITTED">Admitted</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Registration No.</TableHead>
                  <TableHead>Screening</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => (
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
                        <div className="font-medium">{candidate.screening.name}</div>
                        <div className="text-sm text-gray-500">
                          {candidate.screening.totalMarks} marks ({candidate.screening.passMarks} to pass)
                        </div>
                      </div>
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
                            {candidate.totalScore}/{candidate.screening.totalMarks}
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
                      <Badge className={getStatusColor(candidate.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(candidate.status)}
                          <span>{candidate.status}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(candidate)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredCandidates.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
                <p className="text-gray-500">No candidates match your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Candidate Details Dialog */}
        <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Candidate Details</DialogTitle>
              <DialogDescription>
                Detailed information and test results for the candidate
              </DialogDescription>
            </DialogHeader>
            {selectedCandidate && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                      <div className="text-sm">
                        {selectedCandidate.firstName} {selectedCandidate.lastName}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email</Label>
                      <div className="text-sm">{selectedCandidate.email}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Registration Number</Label>
                      <div className="text-sm font-mono">{selectedCandidate.registrationNumber}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      <Badge className={getStatusColor(selectedCandidate.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(selectedCandidate.status)}
                          <span>{selectedCandidate.status}</span>
                        </div>
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Academic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Screening</Label>
                      <div className="text-sm">{selectedCandidate.screening.name}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Program</Label>
                      <div className="text-sm">
                        {selectedCandidate.program.name} ({selectedCandidate.program.code})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Results */}
                {selectedCandidate.hasWritten && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Test Results</h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedCandidate.totalScore}
                        </div>
                        <div className="text-sm text-blue-600">Total Score</div>
                        <div className="text-xs text-gray-500">
                          out of {selectedCandidate.screening.totalMarks}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedCandidate.percentage?.toFixed(1)}%
                        </div>
                        <div className="text-sm text-green-600">Percentage</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedCandidate.testScores.length}
                        </div>
                        <div className="text-sm text-purple-600">Questions</div>
                        <div className="text-xs text-gray-500">Attempted</div>
                      </div>
                    </div>

                    {/* Detailed Question Results */}
                    <div>
                      <h4 className="font-medium mb-2">Question-wise Results</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {selectedCandidate.testScores.map((score, index) => (
                          <div key={score.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-medium">
                                Question {index + 1} - {score.question.subject.name}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant={score.isCorrect ? "default" : "secondary"}>
                                  {score.isCorrect ? "Correct" : "Incorrect"}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {score.marks}/{score.question.marks} marks
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {score.question.question}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="font-medium">Options:</span>
                                <ul className="mt-1 space-y-1">
                                  {score.question.options.map((option, i) => (
                                    <li key={i} className={`${
                                      option === score.question.correctAnswer ? 'text-green-600 font-medium' : ''
                                    }`}>
                                      {String.fromCharCode(65 + i)}) {option}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <span className="font-medium">Selected:</span>
                                <div className="mt-1">
                                  {score.selectedAnswer ? (
                                    <span className={`${
                                      score.selectedAnswer === score.question.correctAnswer 
                                        ? 'text-green-600' 
                                        : 'text-red-600'
                                    }`}>
                                      {score.selectedAnswer}
                                    </span>
                                  ) : (
                                    <span className="text-gray-500">Not answered</span>
                                  )}
                                </div>
                                {score.timeTaken && (
                                  <div className="mt-1 text-gray-500">
                                    Time: {score.timeTaken}s
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!selectedCandidate.hasWritten && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Test Not Taken</h3>
                    <p className="text-gray-500">This candidate has not yet taken the examination.</p>
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