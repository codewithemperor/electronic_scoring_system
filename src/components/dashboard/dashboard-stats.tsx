"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  AlertCircle 
} from "lucide-react"

interface DashboardStatsProps {
  stats: {
    totalCandidates: number
    pendingScreening: number
    completedScreening: number
    approvedCandidates: number
    averageScore: number
    todayRegistrations: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Total Candidates",
      value: stats.totalCandidates,
      description: "Registered candidates",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Screening",
      value: stats.pendingScreening,
      description: "Awaiting evaluation",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Completed Screening",
      value: stats.completedScreening,
      description: "Evaluation finished",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Approved Candidates",
      value: stats.approvedCandidates,
      description: "Ready for admission",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress and Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Screening Progress */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Screening Progress Overview
            </CardTitle>
            <CardDescription>
              Current status of candidate screening process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completed</span>
                <span className="text-sm text-gray-600">
                  {stats.completedScreening} / {stats.totalCandidates}
                </span>
              </div>
              <Progress 
                value={(stats.completedScreening / stats.totalCandidates) * 100} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending</span>
                <span className="text-sm text-gray-600">
                  {stats.pendingScreening} / {stats.totalCandidates}
                </span>
              </div>
              <Progress 
                value={(stats.pendingScreening / stats.totalCandidates) * 100} 
                className="h-2"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Completion Rate</span>
              </div>
              <Badge variant="secondary">
                {Math.round((stats.completedScreening / stats.totalCandidates) * 100)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Today's Activity */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Today's Activity
            </CardTitle>
            <CardDescription>
              Real-time statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New Registrations</span>
              <span className="font-semibold text-blue-600">
                +{stats.todayRegistrations}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Score</span>
              <span className="font-semibold text-green-600">
                {stats.averageScore.toFixed(1)}%
              </span>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500 text-center">
                Last updated: Just now
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}