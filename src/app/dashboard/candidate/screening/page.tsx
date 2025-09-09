'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Target,
  TrendingUp,
  Calendar,
  FileText,
  UserCheck,
  BarChart3,
  BookOpen,
  Award,
  MessageSquare
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export default function CandidateScreeningPage() {
  const { user } = useAuth()

  // Mock screening data
  const screeningStatus = {
    overallStatus: 'IN_PROGRESS',
    overallProgress: 65,
    stages: [
      {
        name: 'Document Verification',
        status: 'COMPLETED',
        progress: 100,
        completedDate: '2025-01-10',
        details: 'All required documents have been verified and approved'
      },
      {
        name: 'Academic Evaluation',
        status: 'IN_PROGRESS',
        progress: 80,
        completedDate: null,
        details: 'UTME and O\'Level scores under evaluation'
      },
      {
        name: 'Post-UTME Assessment',
        status: 'PENDING',
        progress: 0,
        completedDate: null,
        details: 'Awaiting Post-UTME examination schedule'
      },
      {
        name: 'Interview Session',
        status: 'PENDING',
        progress: 0,
        completedDate: null,
        details: 'Interview to be scheduled if required'
      },
      {
        name: 'Final Decision',
        status: 'PENDING',
        progress: 0,
        completedDate: null,
        details: 'Final admission decision pending completion of all stages'
      }
    ]
  }

  const screeningScores = {
    utmeScore: 245,
    utmeWeight: 40,
    utmeWeightedScore: 98,
    oLevelScore: 28,
    oLevelWeight: 30,
    oLevelWeightedScore: 28,
    postUtmeScore: null,
    postUtmeWeight: 20,
    postUtmeWeightedScore: 0,
    interviewScore: null,
    interviewWeight: 10,
    interviewWeightedScore: 0,
    totalScore: 126,
    maxTotalScore: 200,
    percentage: 63
  }

  const upcomingActivities = [
    {
      id: 1,
      title: 'Post-UTME Examination',
      date: '2025-02-01',
      time: '9:00 AM',
      location: 'Computer Science Laboratory',
      type: 'examination',
      status: 'scheduled',
      description: 'Computer-based Post-UTME examination for all applicants'
    },
    {
      id: 2,
      title: 'Document Verification Follow-up',
      date: '2025-01-25',
      time: '2:00 PM',
      location: 'Admission Office',
      type: 'meeting',
      status: 'scheduled',
      description: 'Additional document verification if required'
    }
  ]

  const screeningHistory = [
    {
      id: 1,
      activity: 'Document Upload Completed',
      date: '2025-01-08',
      status: 'completed',
      details: 'All required documents successfully uploaded'
    },
    {
      id: 2,
      activity: 'Document Verification Started',
      date: '2025-01-09',
      status: 'completed',
      details: 'Admission office began document verification process'
    },
    {
      id: 3,
      activity: 'Document Verification Completed',
      date: '2025-01-10',
      status: 'completed',
      details: 'All documents verified and approved'
    },
    {
      id: 4,
      activity: 'Academic Evaluation Started',
      date: '2025-01-12',
      status: 'in_progress',
      details: 'Evaluation of UTME and O\'Level scores in progress'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'IN_PROGRESS':
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case 'PENDING':
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
      case 'scheduled':
        return <Badge className="bg-purple-100 text-purple-800">Scheduled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'IN_PROGRESS':
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'PENDING':
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      case 'scheduled':
        return <Calendar className="h-5 w-5 text-purple-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Screening Status</h1>
          <p className="text-muted-foreground">
            Track your screening progress and view your evaluation results
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(screeningStatus.overallStatus)}
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {screeningStatus.overallProgress}% Complete
          </Badge>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Overall Screening Progress
          </CardTitle>
          <CardDescription>
            Your current status in the screening process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-500">{screeningStatus.overallProgress}%</span>
              </div>
              <Progress value={screeningStatus.overallProgress} className="h-3" />
            </div>
            
            <div className="grid gap-4 md:grid-cols-5">
              {screeningStatus.stages.map((stage, index) => (
                <div key={stage.name} className="text-center">
                  <div className="flex justify-center mb-2">
                    {getStatusIcon(stage.status)}
                  </div>
                  <h4 className="text-sm font-medium mb-1">{stage.name}</h4>
                  <div className="text-xs text-gray-500 mb-2">{stage.progress}%</div>
                  <Progress value={stage.progress} className="h-2" />
                  {stage.completedDate && (
                    <div className="text-xs text-green-600 mt-1">
                      Completed: {stage.completedDate}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scores" className="space-y-6">
        <TabsList>
          <TabsTrigger value="scores">Screening Scores</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="scores">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Screening Scores Breakdown
              </CardTitle>
              <CardDescription>
                Detailed breakdown of your screening evaluation scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Score Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{screeningScores.totalScore}</div>
                    <div className="text-sm text-gray-500">Total Score</div>
                    <div className="text-xs text-gray-400">out of {screeningScores.maxTotalScore}</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{screeningScores.percentage}%</div>
                    <div className="text-sm text-gray-500">Percentage</div>
                    <div className="flex items-center justify-center mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-500 ml-1">Good</span>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">
                      {screeningScores.stages.filter(s => s.status === 'COMPLETED').length}/
                      {screeningScores.stages.length}
                    </div>
                    <div className="text-sm text-gray-500">Stages Completed</div>
                  </div>
                </div>

                {/* Detailed Scores */}
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">UTME Score</h4>
                        <Badge variant="outline">{screeningScores.utmeWeight}% weight</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Raw Score:</span>
                          <span className="font-medium">{screeningScores.utmeScore}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Weighted Score:</span>
                          <span className="font-medium">{screeningScores.utmeWeightedScore}</span>
                        </div>
                        <Progress value={(screeningScores.utmeWeightedScore / screeningScores.utmeWeight) * 100} className="h-2" />
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">O'Level Results</h4>
                        <Badge variant="outline">{screeningScores.oLevelWeight}% weight</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Raw Score:</span>
                          <span className="font-medium">{screeningScores.oLevelScore}/30</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Weighted Score:</span>
                          <span className="font-medium">{screeningScores.oLevelWeightedScore}</span>
                        </div>
                        <Progress value={(screeningScores.oLevelWeightedScore / screeningScores.oLevelWeight) * 100} className="h-2" />
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg opacity-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Post-UTME Score</h4>
                        <Badge variant="outline">{screeningScores.postUtmeWeight}% weight</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Raw Score:</span>
                          <span className="font-medium">Pending</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Weighted Score:</span>
                          <span className="font-medium">{screeningScores.postUtmeWeightedScore}</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg opacity-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Interview Score</h4>
                        <Badge variant="outline">{screeningScores.interviewWeight}% weight</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Raw Score:</span>
                          <span className="font-medium">Pending</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Weighted Score:</span>
                          <span className="font-medium">{screeningScores.interviewWeightedScore}</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Screening Schedule
              </CardTitle>
              <CardDescription>
                Upcoming screening activities and important dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(activity.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{activity.title}</h4>
                        {getStatusBadge(activity.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{activity.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{activity.time}</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{activity.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {upcomingActivities.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming activities scheduled</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Screening History
              </CardTitle>
              <CardDescription>
                Timeline of your screening process activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {screeningHistory.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(activity.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{activity.activity}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{activity.date}</span>
                          {getStatusBadge(activity.status)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}