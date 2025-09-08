"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  FileText, 
  Download, 
  Filter, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Award,
  Calendar,
  Eye
} from "lucide-react"

interface ReportData {
  totalCandidates: number
  pendingScreening: number
  completedScreening: number
  approvedCandidates: number
  rejectedCandidates: number
  shortlistedCandidates: number
  averageScore: number
  topPrograms: Array<{
    name: string
    candidates: number
    averageScore: number
  }>
  dailyStats: Array<{
    date: string
    registrations: number
    screenings: number
    approvals: number
  }>
}

interface ReportsDashboardProps {
  onGenerateReport: (reportType: string, filters: any) => void
  onViewReport: (reportId: string) => void
  isLoading?: boolean
}

export function ReportsDashboard({ 
  onGenerateReport, 
  onViewReport, 
  isLoading = false 
}: ReportsDashboardProps) {
  const [selectedReportType, setSelectedReportType] = useState<string>("")
  const [dateRange, setDateRange] = useState<string>("this-month")

  // Mock data for demonstration
  const mockReportData: ReportData = {
    totalCandidates: 1247,
    pendingScreening: 324,
    completedScreening: 923,
    approvedCandidates: 456,
    rejectedCandidates: 189,
    shortlistedCandidates: 278,
    averageScore: 72.5,
    topPrograms: [
      { name: "Computer Science", candidates: 156, averageScore: 78.2 },
      { name: "Electrical Engineering", candidates: 134, averageScore: 75.8 },
      { name: "Business Administration", candidates: 128, averageScore: 71.5 },
      { name: "Accountancy", candidates: 112, averageScore: 73.1 },
      { name: "Mass Communication", candidates: 98, averageScore: 69.8 }
    ],
    dailyStats: [
      { date: "2024-01-15", registrations: 23, screenings: 45, approvals: 12 },
      { date: "2024-01-16", registrations: 31, screenings: 52, approvals: 18 },
      { date: "2024-01-17", registrations: 28, screenings: 48, approvals: 15 },
      { date: "2024-01-18", registrations: 35, screenings: 61, approvals: 22 },
      { date: "2024-01-19", registrations: 29, screenings: 55, approvals: 19 },
      { date: "2024-01-20", registrations: 33, screenings: 58, approvals: 21 },
      { date: "2024-01-21", registrations: 27, screenings: 51, approvals: 17 }
    ]
  }

  const reportTypes = [
    {
      id: "summary",
      name: "Summary Report",
      description: "Overall screening statistics and summary",
      icon: BarChart3,
      color: "text-blue-600"
    },
    {
      id: "candidates",
      name: "Candidate List",
      description: "Complete list of all candidates with details",
      icon: Users,
      color: "text-green-600"
    },
    {
      id: "screening",
      name: "Screening Results",
      description: "Detailed screening results and scores",
      icon: CheckCircle,
      color: "text-purple-600"
    },
    {
      id: "shortlist",
      name: "Shortlist Report",
      description: "Shortlisted candidates for admission",
      icon: Award,
      color: "text-yellow-600"
    },
    {
      id: "analytics",
      name: "Analytics Report",
      description: "Advanced analytics and trends",
      icon: TrendingUp,
      color: "text-red-600"
    },
    {
      id: "audit",
      name: "Audit Trail",
      description: "System activity and audit logs",
      icon: FileText,
      color: "text-gray-600"
    }
  ]

  const completionRate = (mockReportData.completedScreening / mockReportData.totalCandidates) * 100
  const approvalRate = (mockReportData.approvedCandidates / mockReportData.completedScreening) * 100

  const handleGenerateReport = () => {
    if (selectedReportType) {
      onGenerateReport(selectedReportType, { dateRange })
    }
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold text-gray-900">{mockReportData.totalCandidates.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Registered this period</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Screening Progress</p>
                <p className="text-2xl font-bold text-green-600">{completionRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">{mockReportData.completedScreening} completed</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approval Rate</p>
                <p className="text-2xl font-bold text-purple-600">{approvalRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">{mockReportData.approvedCandidates} approved</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-blue-600">{mockReportData.averageScore.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">Overall performance</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Generate Reports
          </CardTitle>
          <CardDescription>
            Create and download various screening reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {reportTypes.map((report) => (
              <div
                key={report.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedReportType === report.id 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedReportType(report.id)}
              >
                <div className="flex items-start gap-3">
                  <report.icon className={`h-5 w-5 ${report.color}`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{report.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Date Range:</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleGenerateReport}
              disabled={!selectedReportType || isLoading}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isLoading ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Top Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Top Programs by Candidate Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReportData.topPrograms.map((program, index) => (
                <div key={program.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{program.name}</p>
                      <p className="text-sm text-gray-600">{program.candidates} candidates</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{program.averageScore.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">avg score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Daily Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Registrations</TableHead>
                  <TableHead>Screenings</TableHead>
                  <TableHead>Approvals</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReportData.dailyStats.map((stat) => (
                  <TableRow key={stat.date}>
                    <TableCell className="font-medium">{new Date(stat.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{stat.registrations}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{stat.screenings}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">{stat.approvals}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-orange-600" />
            Screening Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-600">{mockReportData.pendingScreening}</p>
              <p className="text-sm text-yellow-800">Pending</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{mockReportData.completedScreening}</p>
              <p className="text-sm text-blue-800">Completed</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{mockReportData.approvedCandidates}</p>
              <p className="text-sm text-purple-800">Approved</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{mockReportData.rejectedCandidates}</p>
              <p className="text-sm text-red-800">Rejected</p>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <Award className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-indigo-600">{mockReportData.shortlistedCandidates}</p>
              <p className="text-sm text-indigo-800">Shortlisted</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}