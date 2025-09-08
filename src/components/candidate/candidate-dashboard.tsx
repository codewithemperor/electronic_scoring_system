"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  FileText, 
  ClipboardCheck, 
  Eye, 
  Edit, 
  Calendar,
  MapPin,
  GraduationCap,
  Star,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react"

interface Candidate {
  id: string
  applicationNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  program: string
  department: string
  faculty: string
  utmeScore: number
  olevelResults: string
  screeningStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "APPROVED" | "REJECTED" | "SHORTLISTED"
  totalScore?: number
  state: string
  lga: string
  gender: string
  dateOfBirth: string
  address: string
  passportPhoto?: string
  createdAt: string
  lastUpdated: string
}

interface CandidateDashboardProps {
  candidate: Candidate
  onStartScreening: () => void
  onViewProfile: () => void
  onEditProfile: () => void
  onViewReport: () => void
}

export function CandidateDashboard({ 
  candidate, 
  onStartScreening, 
  onViewProfile, 
  onEditProfile, 
  onViewReport 
}: CandidateDashboardProps) {
  const [timeUntilScreening, setTimeUntilScreening] = useState("")

  useEffect(() => {
    // Calculate time until next screening (mock)
    const screeningDate = new Date()
    screeningDate.setDate(screeningDate.getDate() + 3) // 3 days from now
    
    const updateCountdown = () => {
      const now = new Date()
      const diff = screeningDate.getTime() - now.getTime()
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        setTimeUntilScreening(`${days} days, ${hours} hours`)
      } else {
        setTimeUntilScreening("Screening available now")
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "APPROVED":
        return "bg-purple-100 text-purple-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      case "SHORTLISTED":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "IN_PROGRESS":
        return <AlertCircle className="h-4 w-4" />
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />
      case "APPROVED":
        return <CheckCircle className="h-4 w-4" />
      case "REJECTED":
        return <AlertCircle className="h-4 w-4" />
      case "SHORTLISTED":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getScreeningProgress = () => {
    switch (candidate.screeningStatus) {
      case "PENDING":
        return 0
      case "IN_PROGRESS":
        return 50
      case "COMPLETED":
        return 100
      case "APPROVED":
        return 100
      case "REJECTED":
        return 100
      case "SHORTLISTED":
        return 100
      default:
        return 0
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Welcome, {candidate.firstName}! 👋
              </CardTitle>
              <CardDescription className="text-blue-100">
                Application Number: {candidate.applicationNumber}
              </CardDescription>
            </div>
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarImage src={candidate.passportPhoto} />
              <AvatarFallback className="text-lg">
                {candidate.firstName[0]}{candidate.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(candidate.screeningStatus)}>
              {getStatusIcon(candidate.screeningStatus)}
              <span className="ml-1">{candidate.screeningStatus.replace("_", " ")}</span>
            </Badge>
            {candidate.totalScore && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>Score: {candidate.totalScore.toFixed(1)}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={onViewProfile}>
          <CardContent className="p-6 text-center">
            <User className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">View Profile</h3>
            <p className="text-sm text-gray-600 mt-1">See your personal information</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={onEditProfile}>
          <CardContent className="p-6 text-center">
            <Edit className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Edit Profile</h3>
            <p className="text-sm text-gray-600 mt-1">Update your information</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={onStartScreening}>
          <CardContent className="p-6 text-center">
            <ClipboardCheck className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Start Screening</h3>
            <p className="text-sm text-gray-600 mt-1">Begin your assessment</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={onViewReport}>
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">View Report</h3>
            <p className="text-sm text-gray-600 mt-1">Check your results</p>
          </CardContent>
        </Card>
      </div>

      {/* Application Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-blue-600" />
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Screening Progress</span>
              <Badge className={getStatusColor(candidate.screeningStatus)}>
                {candidate.screeningStatus.replace("_", " ")}
              </Badge>
            </div>
            
            <Progress value={getScreeningProgress()} className="h-2" />
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Application Date</p>
                  <p className="text-sm text-gray-600">{new Date(candidate.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Program</p>
                  <p className="text-sm text-gray-600">{candidate.program}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">UTME Score</p>
                  <p className="text-sm text-gray-600">{candidate.utmeScore}/400</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {candidate.screeningStatus === "PENDING" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Screening Available In</span>
                </div>
                <p className="text-sm text-yellow-700">{timeUntilScreening}</p>
                <Button 
                  onClick={onStartScreening}
                  className="w-full mt-3"
                  disabled
                >
                  Screening Not Available Yet
                </Button>
              </div>
            )}
            
            {candidate.screeningStatus === "IN_PROGRESS" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Screening in Progress</span>
                </div>
                <p className="text-sm text-blue-700">Complete your screening assessment</p>
                <Button 
                  onClick={onStartScreening}
                  className="w-full mt-3"
                >
                  Continue Screening
                </Button>
              </div>
            )}
            
            {candidate.screeningStatus === "COMPLETED" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Screening Completed</span>
                </div>
                <p className="text-sm text-green-700">
                  Your screening has been completed. Awaiting final decision.
                </p>
                <Button 
                  onClick={onViewReport}
                  className="w-full mt-3"
                >
                  View Results
                </Button>
              </div>
            )}
            
            {candidate.screeningStatus === "APPROVED" && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-800">Application Approved!</span>
                </div>
                <p className="text-sm text-purple-700">
                  Congratulations! Your application has been approved.
                </p>
                <Button 
                  onClick={onViewReport}
                  className="w-full mt-3"
                >
                  View Admission Letter
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Personal Information Summary */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-600" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-sm text-gray-900">{candidate.firstName} {candidate.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-sm text-gray-900">{candidate.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-sm text-gray-900">{candidate.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Program</label>
              <p className="text-sm text-gray-900">{candidate.program}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Department</label>
              <p className="text-sm text-gray-900">{candidate.department}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Faculty</label>
              <p className="text-sm text-gray-900">{candidate.faculty}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}