"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CandidateDashboard } from "@/components/candidate/candidate-dashboard"
import { useAlerts } from "@/hooks/use-alerts"

interface CandidateProfile {
  id: string
  applicationNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  lga: string
  state: string
  country: string
  program: string
  department: string
  faculty: string
  utmeScore: number
  olevelResults: string
  passportPhoto?: string
  screeningStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "APPROVED" | "REJECTED" | "SHORTLISTED"
  totalScore?: number
  createdAt: string
  lastUpdated: string
}

interface ScreeningResult {
  id: string
  criteriaName: string
  score: number
  maxScore: number
  weight: number
  remarks?: string
  screenedAt: string
  screenedBy: string
}

export default function CandidatePage() {
  const router = useRouter()
  const { showError } = useAlerts()
  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [screeningResults, setScreeningResults] = useState<ScreeningResult[]>([])

  useEffect(() => {
    // Check if user is logged in and is a candidate
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/auth/login')
      return
    }

    const user = JSON.parse(userStr)
    if (user.role !== 'CANDIDATE') {
      showError({
        title: 'Access Denied!',
        text: 'This page is only accessible to candidates.',
        timer: 3000
      })
      router.push('/auth/login')
      return
    }

    // Load candidate profile (mock data for now)
    const mockProfile: CandidateProfile = {
      id: "1",
      applicationNumber: "AOPESS/2024/001",
      firstName: "John",
      lastName: "Candidate",
      email: "candidate@aopess.edu.ng",
      phone: "08012345678",
      dateOfBirth: "2000-05-15",
      gender: "Male",
      address: "123 Example Street, Lagos",
      lga: "Ikeja",
      state: "Lagos",
      country: "Nigeria",
      program: "Computer Science",
      department: "Computer Science",
      faculty: "Computing",
      utmeScore: 280,
      olevelResults: "Mathematics: B2, English: B3, Physics: A1, Chemistry: B2, Biology: C4",
      passportPhoto: "/placeholder-avatar.jpg",
      screeningStatus: "COMPLETED",
      totalScore: 85.5,
      createdAt: "2024-01-15",
      lastUpdated: "2024-01-20"
    }

    const mockScreeningResults: ScreeningResult[] = [
      {
        id: "1",
        criteriaName: "Academic Performance",
        score: 35,
        maxScore: 40,
        weight: 0.4,
        remarks: "Excellent UTME score and good O'level results",
        screenedAt: "2024-01-18",
        screenedBy: "Screening Officer"
      },
      {
        id: "2",
        criteriaName: "Communication Skills",
        score: 22,
        maxScore: 25,
        weight: 0.25,
        remarks: "Good verbal and written communication skills",
        screenedAt: "2024-01-18",
        screenedBy: "Screening Officer"
      },
      {
        id: "3",
        criteriaName: "Technical Knowledge",
        score: 18,
        maxScore: 20,
        weight: 0.2,
        remarks: "Strong technical aptitude for computer science",
        screenedAt: "2024-01-18",
        screenedBy: "Screening Officer"
      },
      {
        id: "4",
        criteriaName: "Personal Qualities",
        score: 14,
        maxScore: 15,
        weight: 0.15,
        remarks: "Confident and well-presented",
        screenedAt: "2024-01-18",
        screenedBy: "Screening Officer"
      }
    ]

    setProfile(mockProfile)
    setScreeningResults(mockScreeningResults)
  }, [router, showError])

  const handleEditProfile = () => {
    // Navigate to profile edit page
    console.log("Edit profile")
  }

  const handleViewReport = () => {
    // Navigate to detailed report view
    console.log("View report")
  }

  const handleDownloadReport = () => {
    // Download report as PDF
    console.log("Download report")
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <CandidateDashboard
          profile={profile}
          screeningResults={screeningResults}
          onEditProfile={handleEditProfile}
          onViewReport={handleViewReport}
          onDownloadReport={handleDownloadReport}
        />
      </div>
    </div>
  )
}