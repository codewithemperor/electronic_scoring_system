"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ScreeningQueue } from "@/components/screening/screening-queue"
import { ScreeningForm } from "@/components/screening/screening-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, ClipboardCheck } from "lucide-react"

interface Candidate {
  id: string
  applicationNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  program: string
  utmeScore: number
  olevelResults: string
  screeningStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "APPROVED" | "REJECTED"
  registeredAt: string
  passportPhoto?: string
  priority?: "HIGH" | "MEDIUM" | "LOW"
}

interface ScreeningCriteria {
  id: string
  name: string
  description: string
  maxScore: number
  weight: number
}

export default function ScreeningPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for demonstration
  const mockCandidates: Candidate[] = [
    {
      id: "1",
      applicationNumber: "AOPESS/2024/001",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phone: "08012345678",
      program: "Computer Science",
      utmeScore: 280,
      olevelResults: "Mathematics: B2, English: B3, Physics: A1, Chemistry: B2, Biology: C4",
      screeningStatus: "PENDING",
      registeredAt: "2024-01-15",
      priority: "HIGH"
    },
    {
      id: "2",
      applicationNumber: "AOPESS/2024/002",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@email.com",
      phone: "08023456789",
      program: "Electrical Engineering",
      utmeScore: 265,
      olevelResults: "Mathematics: A1, English: B2, Physics: B3, Chemistry: B2, Further Maths: C5",
      screeningStatus: "IN_PROGRESS",
      registeredAt: "2024-01-16",
      priority: "MEDIUM"
    },
    {
      id: "3",
      applicationNumber: "AOPESS/2024/003",
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.johnson@email.com",
      phone: "08034567890",
      program: "Business Administration",
      utmeScore: 240,
      olevelResults: "Mathematics: C4, English: B2, Economics: B3, Commerce: A1, Accounting: B2",
      screeningStatus: "PENDING",
      registeredAt: "2024-01-17",
      priority: "LOW"
    },
    {
      id: "4",
      applicationNumber: "AOPESS/2024/004",
      firstName: "Sarah",
      lastName: "Williams",
      email: "sarah.williams@email.com",
      phone: "08045678901",
      program: "Accountancy",
      utmeScore: 255,
      olevelResults: "Mathematics: B2, English: A1, Economics: B3, Commerce: B2, Accounting: A1",
      screeningStatus: "COMPLETED",
      registeredAt: "2024-01-18",
      priority: "MEDIUM"
    },
    {
      id: "5",
      applicationNumber: "AOPESS/2024/005",
      firstName: "David",
      lastName: "Brown",
      email: "david.brown@email.com",
      phone: "08056789012",
      program: "Mass Communication",
      utmeScore: 230,
      olevelResults: "Mathematics: C6, English: A1, Literature: B2, Government: B3, CRS: C4",
      screeningStatus: "REJECTED",
      registeredAt: "2024-01-19",
      priority: "LOW"
    }
  ]

  const mockCriteria: ScreeningCriteria[] = [
    {
      id: "1",
      name: "Academic Performance",
      description: "Evaluation of UTME score and O'level results",
      maxScore: 40,
      weight: 0.4
    },
    {
      id: "2",
      name: "Communication Skills",
      description: "Assessment of verbal and written communication abilities",
      maxScore: 25,
      weight: 0.25
    },
    {
      id: "3",
      name: "Technical Knowledge",
      description: "Knowledge relevant to the chosen program of study",
      maxScore: 20,
      weight: 0.2
    },
    {
      id: "4",
      name: "Personal Qualities",
      description: "Attitude, confidence, and personal presentation",
      maxScore: 15,
      weight: 0.15
    }
  ]

  const handleStartScreening = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
  }

  const handleViewCandidate = (candidate: Candidate) => {
    console.log("View candidate:", candidate)
    // Implement view functionality
  }

  const handleScreeningSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log("Screening submitted:", data)
      setSelectedCandidate(null)
      // Here you would typically refresh the candidates list
    } catch (error) {
      console.error("Error submitting screening:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToQueue = () => {
    setSelectedCandidate(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Screening</h1>
            <p className="text-gray-600 mt-1">
              Evaluate and score candidates for admission
            </p>
          </div>
        </div>

        {/* Main Content */}
        {selectedCandidate ? (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={handleBackToQueue}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Queue
            </Button>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleBackToQueue}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Queue
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleViewCandidate(selectedCandidate)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View Full Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <ClipboardCheck className="h-4 w-4 mr-2" />
                      Screening History
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-3">
                <ScreeningForm
                  candidate={selectedCandidate}
                  criteria={mockCriteria}
                  onSubmit={handleScreeningSubmit}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        ) : (
          <ScreeningQueue
            candidates={mockCandidates}
            onStartScreening={handleStartScreening}
            onViewCandidate={handleViewCandidate}
            isLoading={false}
          />
        )}
      </div>
    </DashboardLayout>
  )
}