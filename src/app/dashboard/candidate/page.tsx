'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  User, 
  FileText, 
  ClipboardList, 
  BarChart3, 
  CheckCircle, 
  Clock,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Calendar,
  MessageSquare,
  Upload,
  Eye
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface ProfileData {
  firstName: string
  lastName: string
  jambNumber: string
  utmeScore: number
  screeningStatus: string
  profileCompletion: number
}

interface Application {
  id: string
  program: string
  status: string
  appliedDate: string
  screeningScore: number | null
}

interface ScreeningProgress {
  step: string
  status: string
  description: string
}

interface RequiredDocument {
  name: string
  status: string
  uploadDate: string | null
}

export default function CandidateDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [screeningProgress, setScreeningProgress] = useState<ScreeningProgress[]>([])
  const [requiredDocuments, setRequiredDocuments] = useState<RequiredDocument[]>([])
  const [totalScore, setTotalScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/dashboard/candidate/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch profile data')
      }
      const data = await response.json()
      setProfile(data.profile)
      setApplications(data.applications)
      setScreeningProgress(data.screeningProgress)
      setRequiredDocuments(data.requiredDocuments)
      setTotalScore(data.totalScore)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'uploaded':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
      case 'Under Review':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'uploaded':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Candidate Dashboard</h1>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Candidate Dashboard</h1>
            <p className="text-red-600">Error loading profile data</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchProfileData} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Candidate Dashboard</h1>
            <p className="text-muted-foreground">Profile not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidate Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}! Track your application progress here.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            JAMB: {profile.jambNumber}
          </Badge>
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Profile Overview
          </CardTitle>
          <CardDescription>
            Your profile information and completion status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{profile.utmeScore}</div>
              <div className="text-sm text-gray-500">UTME Score</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{profile.profileCompletion}%</div>
              <div className="text-sm text-gray-500">Profile Complete</div>
              <Progress value={profile.profileCompletion} className="mt-2 h-2" />
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{applications.length}</div>
              <div className="text-sm text-gray-500">Applications</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              {getStatusBadge(profile.screeningStatus)}
              <div className="text-sm text-gray-500 mt-2">Screening Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Screening Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Screening Progress</CardTitle>
            <CardDescription>
              Track your application through each stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {screeningProgress.map((step, index) => (
                <div key={step.step} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(step.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{step.step}</p>
                      {getStatusBadge(step.status)}
                    </div>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Required Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
            <CardDescription>
              Upload all required documents for screening
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requiredDocuments.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(doc.status)}
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      {doc.uploadDate && (
                        <p className="text-xs text-gray-500">Uploaded: {doc.uploadDate}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc.status === 'uploaded' ? (
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    ) : (
                      <Button size="sm">
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            My Applications
          </CardTitle>
          <CardDescription>
            Programs you have applied for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{app.program}</span>
                    {getStatusBadge(app.status)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Applied: {app.appliedDate} • {app.id}
                  </div>
                </div>
                <div className="text-right">
                  {app.screeningScore && (
                    <div className="text-lg font-bold text-green-600">{app.screeningScore}%</div>
                  )}
                  <Button size="sm" variant="outline" className="mt-1">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
            {applications.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No applications yet</p>
                <Button className="mt-4">Apply for Programs</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-auto p-4 flex-col space-y-2">
              <User className="h-6 w-6" />
              <span>Complete Profile</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <BookOpen className="h-6 w-6" />
              <span>Apply for Program</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <ClipboardList className="h-6 w-6" />
              <span>Check Status</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <MessageSquare className="h-6 w-6" />
              <span>Support</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Important Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Important Dates
          </CardTitle>
          <CardDescription>
            Key dates and deadlines for your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Document Upload Deadline</p>
                  <p className="text-sm text-gray-500">All required documents must be uploaded</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-red-600">Jan 25</p>
                <p className="text-xs text-gray-500">5 days left</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Screening Period</p>
                  <p className="text-sm text-gray-500">Candidate screening and evaluation</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Feb 1-15</p>
                <p className="text-xs text-gray-500">12 days</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Admission Results</p>
                  <p className="text-sm text-gray-500">Final admission decisions released</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Mar 1</p>
                <p className="text-xs text-gray-500">1 month</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}