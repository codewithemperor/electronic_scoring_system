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
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Users, 
  TrendingUp,
  Filter,
  Search,
  Target,
  Award,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  BookOpen,
  CheckCircle,
  XCircle
} from "lucide-react"
import { toast } from "sonner"

interface Report {
  id: string
  title: string
  type: string
  generatedAt: string
  fileSize: string
  status: string
  description: string
  screening?: {
    name: string
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

interface ExaminerReportStats {
  totalReports: number
  totalDownloads: number
  recentReports: number
  popularReport: string
  screeningsCompleted: number
  averageScore: number
  passRate: number
  totalCandidates: number
  scoredCandidates: number
  byStatus: {
    REGISTERED: number
    WRITTEN: number
    PASSED: number
    FAILED: number
    ADMITTED: number
    REJECTED: number
  }
}

interface CandidatePerformance {
  id: string
  firstName: string
  lastName: string
  registrationNumber: string
  totalScore: number
  percentage: number
  status: string
  program: {
    name: string
    code: string
  }
  screening: {
    name: string
  }
}

interface QuestionAnalysis {
  id: string
  question: string
  subject: string
  screening?: string
  marks: number
  difficulty: string
  isActive: boolean
  totalAttempts: number
  correctAttempts: number
  incorrectAttempts: number
  successRate: number
  averageTime: number
}

export default function ExaminerReportsPage() {
  const { data: session } = useSession()
  const [reports, setReports] = useState<Report[]>([])
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [candidatePerformance, setCandidatePerformance] = useState<CandidatePerformance[]>([])
  const [questionAnalysis, setQuestionAnalysis] = useState<QuestionAnalysis[]>([])
  const [stats, setStats] = useState<ExaminerReportStats>({
    totalReports: 0,
    totalDownloads: 0,
    recentReports: 0,
    popularReport: "",
    screeningsCompleted: 0,
    averageScore: 0,
    passRate: 0,
    totalCandidates: 0,
    scoredCandidates: 0,
    byStatus: { REGISTERED: 0, WRITTEN: 0, PASSED: 0, FAILED: 0, ADMITTED: 0, REJECTED: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [selectedScreening, setSelectedScreening] = useState("")
  const [reportType, setReportType] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchReports()
    fetchScreenings()
    fetchStats()
    fetchCandidatePerformance()
    fetchQuestionAnalysis()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/examiner/reports")
      if (response.ok) {
        const data = await response.json()
        setReports(data)
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error)
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
      const response = await fetch("/api/examiner/reports?type=scoring-stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch examiner report stats:", error)
    }
  }

  const fetchCandidatePerformance = async () => {
    try {
      const response = await fetch("/api/examiner/reports?type=candidate-performance")
      if (response.ok) {
        const data = await response.json()
        setCandidatePerformance(data)
      }
    } catch (error) {
      console.error("Failed to fetch candidate performance:", error)
    }
  }

  const fetchQuestionAnalysis = async () => {
    try {
      const response = await fetch("/api/examiner/reports?type=question-analysis")
      if (response.ok) {
        const data = await response.json()
        setQuestionAnalysis(data)
      }
    } catch (error) {
      console.error("Failed to fetch question analysis:", error)
    }
  }

  const handleGenerateReport = async () => {
    if (!selectedScreening || !reportType) {
      toast.error("Please select a screening and report type")
      return
    }

    try {
      const response = await fetch("/api/examiner/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType: reportType,
          format: "json",
          filters: {
            screeningId: selectedScreening
          }
        }),
      })

      if (response.ok) {
        toast.success("Report generated successfully")
        setIsGenerateDialogOpen(false)
        fetchReports()
        fetchStats()
      } else {
        toast.error("Failed to generate report")
      }
    } catch (error) {
      console.error("Failed to generate report:", error)
      toast.error("An error occurred")
    }
  }

  const handleDownload = async (reportId: string) => {
    try {
      const response = await fetch(`/api/examiner/reports/${reportId}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `examiner-report-${reportId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success("Report downloaded successfully")
      } else {
        toast.error("Failed to download report")
      }
    } catch (error) {
      console.error("Failed to download report:", error)
      toast.error("An error occurred")
    }
  }

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.screening && report.screening.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case "CANDIDATE_PERFORMANCE":
        return "bg-green-100 text-green-800"
      case "SCREENING_ANALYSIS":
        return "bg-blue-100 text-blue-800"
      case "QUESTION_ANALYSIS":
        return "bg-purple-100 text-purple-800"
      case "SCORING_SUMMARY":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800"
      case "HARD":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
            <h1 className="text-2xl font-semibold text-gray-900">Examiner Reports & Analytics</h1>
            <p className="mt-1 text-sm text-gray-600">
              Generate and view comprehensive examination reports and analytics
            </p>
          </div>
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>
                  Select a screening and report type to generate a comprehensive report
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="screening">Screening</Label>
                  <Select value={selectedScreening} onValueChange={setSelectedScreening}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select screening" />
                    </SelectTrigger>
                    <SelectContent>
                      {screenings.map((screening) => (
                        <SelectItem key={screening.id} value={screening.id}>
                          {screening.name} ({screening._count.candidates} candidates)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="candidate-performance">Candidate Performance</SelectItem>
                      <SelectItem value="screening-analysis">Screening Analysis</SelectItem>
                      <SelectItem value="question-analysis">Question Analysis</SelectItem>
                      <SelectItem value="scoring-summary">Scoring Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleGenerateReport}>Generate Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Top Performers</span>
              </CardTitle>
              <CardDescription>
                Candidates with the highest scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {candidatePerformance
                  .sort((a, b) => b.percentage - a.percentage)
                  .slice(0, 5)
                  .map((candidate, index) => (
                    <div key={candidate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">
                            {candidate.firstName} {candidate.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {candidate.registrationNumber}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{candidate.percentage.toFixed(1)}%</div>
                        <div className="text-sm text-gray-500">
                          {candidate.totalScore} marks
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Question Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Question Analysis</span>
              </CardTitle>
              <CardDescription>
                Performance analysis by question
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {questionAnalysis
                  .sort((a, b) => b.successRate - a.successRate)
                  .slice(0, 5)
                  .map((question, index) => (
                    <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm truncate">
                          {question.question}
                        </div>
                        <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                          <span>{question.subject}</span>
                          <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-lg">{question.successRate.toFixed(1)}%</div>
                        <div className="text-sm text-gray-500">
                          {question.correctAttempts}/{question.totalAttempts}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
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
                    {status === "PASSED" && <CheckCircle className="h-4 w-4 mr-1" />}
                    {status === "FAILED" && <XCircle className="h-4 w-4 mr-1" />}
                    {status === "WRITTEN" && <Clock className="h-4 w-4 mr-1" />}
                    {status === "ADMITTED" && <Award className="h-4 w-4 mr-1" />}
                    {status === "REJECTED" && <XCircle className="h-4 w-4 mr-1" />}
                    {status === "REGISTERED" && <Target className="h-4 w-4 mr-1" />}
                    <span>{status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
            <CardDescription>
              View and download your generated reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{report.title}</div>
                        <div className="text-sm text-gray-500">{report.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getReportTypeColor(report.type)}>
                        {report.type.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(report.generatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{report.fileSize}</TableCell>
                    <TableCell>
                      <Badge variant={report.status === "READY" ? "default" : "secondary"}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(report.id)}
                          disabled={report.status !== "READY"}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredReports.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-500 mb-4">Generate your first report to get started</p>
                <Button onClick={() => setIsGenerateDialogOpen(true)}>
                  Generate Report
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}