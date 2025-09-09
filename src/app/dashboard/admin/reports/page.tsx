'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Download, 
  FileText, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar,
  Users,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  RefreshCw,
  Printer,
  Mail,
  Database
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export default function AdminReportsPage() {
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState('last_30_days')
  const [reportType, setReportType] = useState('applications')
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock report data
  const reportStats = {
    applications: {
      total: 1234,
      approved: 456,
      pending: 345,
      rejected: 234,
      underReview: 199,
      completionRate: 78
    },
    screening: {
      totalScreened: 892,
      averageScore: 76,
      averageTime: 25,
      completionRate: 85,
      staffEfficiency: 92
    },
    programs: {
      totalPrograms: 12,
      averageApplicants: 103,
      topProgram: 'Computer Science',
      utilizationRate: 73
    },
    performance: {
      processingTime: 3.2,
      satisfactionRate: 94,
      errorRate: 2.1,
      systemUptime: 99.8
    }
  }

  const recentReports = [
    {
      id: 'RPT001',
      name: 'Monthly Applications Summary',
      type: 'applications',
      generatedDate: '2024-01-15',
      generatedBy: 'John Doe',
      size: '2.4 MB',
      format: 'PDF'
    },
    {
      id: 'RPT002',
      name: 'Screening Performance Report',
      type: 'screening',
      generatedDate: '2024-01-14',
      generatedBy: 'Jane Smith',
      size: '1.8 MB',
      format: 'Excel'
    },
    {
      id: 'RPT003',
      name: 'Program Analytics Q4 2023',
      type: 'programs',
      generatedDate: '2024-01-10',
      generatedBy: 'Mike Johnson',
      size: '3.1 MB',
      format: 'PDF'
    }
  ]

  const reportTemplates = [
    {
      id: 'app_summary',
      name: 'Application Summary Report',
      description: 'Comprehensive overview of all applications and their status',
      type: 'applications',
      formats: ['PDF', 'Excel'],
      estimatedTime: '2-3 minutes'
    },
    {
      id: 'screening_perf',
      name: 'Screening Performance Report',
      description: 'Detailed analysis of screening efficiency and staff performance',
      type: 'screening',
      formats: ['PDF', 'Excel'],
      estimatedTime: '3-5 minutes'
    },
    {
      id: 'program_analytics',
      name: 'Program Analytics Report',
      description: 'In-depth analysis of program performance and applicant distribution',
      type: 'programs',
      formats: ['PDF', 'Excel'],
      estimatedTime: '4-6 minutes'
    },
    {
      id: 'admission_stats',
      name: 'Admission Statistics Report',
      description: 'Complete admission statistics and trends analysis',
      type: 'admissions',
      formats: ['PDF', 'Excel'],
      estimatedTime: '5-7 minutes'
    }
  ]

  const handleGenerateReport = (templateId: string, format: string) => {
    setIsGenerating(true)
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      console.log(`Generating report ${templateId} in ${format} format`)
    }, 3000)
  }

  const handleDownloadReport = (reportId: string) => {
    console.log(`Downloading report ${reportId}`)
  }

  const handleEmailReport = (reportId: string) => {
    console.log(`Emailing report ${reportId}`)
  }

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />
      case 'excel':
        return <Database className="h-4 w-4 text-green-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate comprehensive reports and analyze system performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Quick Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{reportStats.applications.total}</p>
                <p className="text-xs text-muted-foreground">Total Applications</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500 ml-1">+12%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{reportStats.applications.approved}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500 ml-1">+8%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Target className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{reportStats.screening.averageScore}%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500 ml-1">+5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{reportStats.screening.averageTime}m</p>
                <p className="text-xs text-muted-foreground">Avg Time</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-red-500 ml-1">-2m</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Report Generation */}
            <Card>
              <CardHeader>
                <CardTitle>Generate New Report</CardTitle>
                <CardDescription>
                  Create custom reports with various filters and formats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Date Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                      <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                      <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                      <SelectItem value="this_year">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Report Type</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="applications">Applications</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="programs">Programs</SelectItem>
                      <SelectItem value="admissions">Admissions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <Button 
                    className="w-full" 
                    onClick={() => handleGenerateReport('custom', 'PDF')}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate PDF Report
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleGenerateReport('custom', 'Excel')}
                    disabled={isGenerating}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Excel
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleGenerateReport('custom', 'CSV')}
                    disabled={isGenerating}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Report Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Report Templates</CardTitle>
                <CardDescription>
                  Quick access to pre-configured report templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </div>
                        <Badge variant="outline">{template.type}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>~{template.estimatedTime}</span>
                          <div className="flex items-center space-x-1">
                            {template.formats.map((format) => (
                              <span key={format} className="flex items-center">
                                {getFormatIcon(format)}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {template.formats.map((format) => (
                            <Button
                              key={format}
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateReport(template.id, format)}
                              disabled={isGenerating}
                            >
                              {format}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recently Generated Reports</CardTitle>
              <CardDescription>
                Access and manage your previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getFormatIcon(report.format)}
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Generated: {report.generatedDate}</span>
                          <span>By: {report.generatedBy}</span>
                          <span>Size: {report.size}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleDownloadReport(report.id)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEmailReport(report.id)}>
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                      <Button size="sm" variant="outline">
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Performance Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Processing Time</span>
                    <span className="font-medium">{reportStats.performance.processingTime} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Satisfaction Rate</span>
                    <span className="font-medium">{reportStats.performance.satisfactionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Error Rate</span>
                    <span className="font-medium">{reportStats.performance.errorRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">System Uptime</span>
                    <span className="font-medium">{reportStats.performance.systemUptime}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Application Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completion Rate</span>
                    <span className="font-medium">{reportStats.applications.completionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Approval Rate</span>
                    <span className="font-medium">
                      {Math.round((reportStats.applications.approved / reportStats.applications.total) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Under Review</span>
                    <span className="font-medium">{reportStats.applications.underReview}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Review</span>
                    <span className="font-medium">{reportStats.applications.pending}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Screening Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Screening Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Screened</span>
                    <span className="font-medium">{reportStats.screening.totalScreened}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Score</span>
                    <span className="font-medium">{reportStats.screening.averageScore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Time</span>
                    <span className="font-medium">{reportStats.screening.averageTime} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Staff Efficiency</span>
                    <span className="font-medium">{reportStats.screening.staffEfficiency}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Program Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Program Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Programs</span>
                    <span className="font-medium">{reportStats.programs.totalPrograms}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg Applicants</span>
                    <span className="font-medium">{reportStats.programs.averageApplicants}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Top Program</span>
                    <span className="font-medium">{reportStats.programs.topProgram}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Utilization Rate</span>
                    <span className="font-medium">{reportStats.programs.utilizationRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}