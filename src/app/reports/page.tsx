"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ReportsDashboard } from "@/components/reports/reports-dashboard"

export default function ReportsPage() {
  const handleGenerateReport = (reportType: string, filters: any) => {
    console.log("Generating report:", reportType, filters)
    // Implement report generation logic
    // This would typically call an API endpoint to generate and download the report
  }

  const handleViewReport = (reportId: string) => {
    console.log("Viewing report:", reportId)
    // Implement report viewing logic
    // This could open a modal or navigate to a detailed report view
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">
              Generate comprehensive reports and view screening analytics
            </p>
          </div>
        </div>

        {/* Main Content */}
        <ReportsDashboard
          onGenerateReport={handleGenerateReport}
          onViewReport={handleViewReport}
          isLoading={false}
        />
      </div>
    </DashboardLayout>
  )
}