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
  Activity
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

interface ReportStats {
  totalReports: number
  totalDownloads: number
  recentReports: number
  popularReport: string
  screeningsCompleted: number
  averageScore: number
  passRate: number
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

export default function StaffReportsPage() {
  const { data: session } = useSession()
  const [reports, setReports] = useState<Report[]>([])
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [candidatePerformance, setCandidatePerformance] = useState<CandidatePerformance[]>([])
  const [stats, setStats] = useState<ReportStats>({
    totalReports: 0,
    totalDownloads: 0,
    recentReports: 0,
    popularReport: "",
    screeningsCompleted: 0,
    averageScore: 0,
    passRate: 0
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
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports")
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
      const response = await fetch("/api/reports/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch report stats:", error)
    }
  }

  const fetchCandidatePerformance = async () => {
    try {
      const response = await fetch("/api/reports/candidate-performance")
      if (response.ok) {
        const data = await response.json()
        setCandidatePerformance(data)
      }
    } catch (error) {
      console.error("Failed to fetch candidate performance:", error)
    }
  }

  const handleGenerateReport = async () => {
    if (!selectedScreening || !reportType) {
      toast.error("Please select a screening and report type")
      return
    }

    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          screeningId: selectedScreening,
          reportType: reportType
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
      const response = await fetch(`/api/reports/${reportId}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report-${reportId}.pdf`
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
      case "SCREENING_SUMMARY":
        return "bg-blue-100 text-blue-800"
      case "CANDIDATE_PERFORMANCE":
        return "bg-green-100 text-green-800"
      case "QUESTION_ANALYSIS":
        return "bg-purple-100 text-purple-800"
      case "DEPARTMENT_PERFORMANCE":
        return "bg-orange-100 text-orange-800"
      case "ATTENDANCE_REPORT":
        return "bg-indigo-100 text-indigo-800"
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
            <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
            <p className="mt-1 text-sm text-gray-600">
              Generate and view comprehensive screening reports and analytics
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
                      <SelectItem value="SCREENING_SUMMARY">Screening Summary</SelectItem>
                      <SelectItem value="CANDIDATE_PERFORMANCE">Candidate Performance</SelectItem>
                      <SelectItem value="QUESTION_ANALYSIS">Question Analysis</SelectItem>
                      <SelectItem value="DEPARTMENT_PERFORMANCE">Department Performance</SelectItem>
                      <SelectItem value="ATTENDANCE_REPORT">Attendance Report</SelectItem>
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
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReports}</div>
              <p className="text-xs text-muted-foreground">
                Generated reports
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDownloads}</div>
              <p className="text-xs text-muted-foreground">
                Report downloads
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

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Latest reports and system activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">New report generated</div>
                    <div className="text-xs text-gray-500">Screening Summary Report</div>
                  </div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full">
                    <Download className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Report downloaded</div>
                    <div className="text-xs text-gray-500">Candidate Performance Report</div>
                  </div>
                  <div className="text-xs text-gray-500">5 hours ago</div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Analytics updated</div>
                    <div className="text-xs text-gray-500">Performance metrics refreshed</div>
                  </div>
                  <div className="text-xs text-gray-500">1 day ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                  <TableHead>Screening</TableHead>
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
                      {report.screening ? (
                        <div className="font-medium">{report.screening.name}</div>
                      ) : (
                        <div className="text-gray-500">General</div>
                      )}
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