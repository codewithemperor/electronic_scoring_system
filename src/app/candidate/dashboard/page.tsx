"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CandidateDashboard } from "@/components/candidate/candidate-dashboard"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LogOut } from "lucide-react"

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

export default function CandidateDashboardPage() {
  const router = useRouter()
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in and is a candidate
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    if (!user.isLoggedIn || user.role !== 'CANDIDATE') {
      router.push('/auth/login')
      return
    }

    // Fetch candidate data (mock for now)
    const mockCandidate: Candidate = {
      id: "1",
      applicationNumber: "AOPESS/2024/001",
      firstName: "John",
      lastName: "Doe",
      email: user.email,
      phone: "08012345678",
      program: "Computer Science",
      department: "Computer Science",
      faculty: "Computing",
      utmeScore: 280,
      olevelResults: "Mathematics: B2, English: B3, Physics: A1, Chemistry: B2, Biology: C4",
      screeningStatus: "PENDING",
      totalScore: undefined,
      state: "Lagos",
      lga: "Ikeja",
      gender: "Male",
      dateOfBirth: "2000-01-15",
      address: "123 Lagos Street, Ikeja",
      passportPhoto: undefined,
      createdAt: "2024-01-15",
      lastUpdated: "2024-01-15"
    }

    // Simulate API call
    setTimeout(() => {
      setCandidate(mockCandidate)
      setIsLoading(false)
    }, 1000)
  }, [router])

  const handleStartScreening = () => {
    router.push('/candidate/screening')
  }

  const handleViewProfile = () => {
    router.push('/candidate/profile')
  }

  const handleEditProfile = () => {
    router.push('/candidate/profile/edit')
  }

  const handleViewReport = () => {
    router.push('/candidate/report')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/auth/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load candidate data</p>
          <Button onClick={() => router.push('/auth/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/auth/login')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Candidate Portal
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <CandidateDashboard
            candidate={candidate}
            onStartScreening={handleStartScreening}
            onViewProfile={handleViewProfile}
            onEditProfile={handleEditProfile}
            onViewReport={handleViewReport}
          />
        </div>
      </main>
    </div>
  )
}