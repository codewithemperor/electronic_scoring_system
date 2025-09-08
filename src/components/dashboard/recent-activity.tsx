"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  MoreHorizontal
} from "lucide-react"

interface RecentActivityProps {
  activities: Array<{
    id: string
    candidateName: string
    applicationNumber: string
    action: string
    status: "COMPLETED" | "PENDING" | "IN_PROGRESS" | "APPROVED" | "REJECTED"
    timestamp: string
    performedBy: string
  }>
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "APPROVED":
        return "bg-purple-100 text-purple-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "IN_PROGRESS":
        return <AlertTriangle className="h-4 w-4" />
      case "APPROVED":
        return <CheckCircle className="h-4 w-4" />
      case "REJECTED":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Recent Screening Activity
        </CardTitle>
        <CardDescription>
          Latest candidate screening updates and actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar>
                    <AvatarImage src={`/placeholder-${activity.id}.jpg`} />
                    <AvatarFallback>
                      {activity.candidateName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {activity.candidateName}
                      </h4>
                      <span className="text-xs text-gray-500">
                        ({activity.applicationNumber})
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {activity.action}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={getStatusColor(activity.status)}>
                        {getStatusIcon(activity.status)}
                        <span className="ml-1">{activity.status}</span>
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {activities.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button variant="outline" className="w-full">
              View All Activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}