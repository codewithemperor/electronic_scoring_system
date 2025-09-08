"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AdvancedSearch } from "@/components/search/advanced-search"

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
  screeningStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "APPROVED" | "REJECTED" | "SHORTLISTED"
  totalScore?: number
  state: string
  lga: string
  gender: string
  registeredAt: string
  lastUpdated: string
}

export default function SearchPage() {
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
      department: "Computer Science",
      faculty: "Computing",
      utmeScore: 280,
      screeningStatus: "COMPLETED",
      totalScore: 85.5,
      state: "Lagos",
      lga: "Ikeja",
      gender: "Male",
      registeredAt: "2024-01-15",
      lastUpdated: "2024-01-20"
    },
    {
      id: "2",
      applicationNumber: "AOPESS/2024/002",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@email.com",
      phone: "08023456789",
      program: "Electrical Engineering",
      department: "Electrical Engineering",
      faculty: "Engineering",
      utmeScore: 265,
      screeningStatus: "APPROVED",
      totalScore: 78.2,
      state: "Oyo",
      lga: "Ibadan",
      gender: "Female",
      registeredAt: "2024-01-16",
      lastUpdated: "2024-01-21"
    },
    {
      id: "3",
      applicationNumber: "AOPESS/2024/003",
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.johnson@email.com",
      phone: "08034567890",
      program: "Business Administration",
      department: "Business Administration",
      faculty: "Management",
      utmeScore: 240,
      screeningStatus: "IN_PROGRESS",
      state: "Lagos",
      lga: "Surulere",
      gender: "Male",
      registeredAt: "2024-01-17",
      lastUpdated: "2024-01-22"
    },
    {
      id: "4",
      applicationNumber: "AOPESS/2024/004",
      firstName: "Sarah",
      lastName: "Williams",
      email: "sarah.williams@email.com",
      phone: "08045678901",
      program: "Accountancy",
      department: "Accountancy",
      faculty: "Management",
      utmeScore: 255,
      screeningStatus: "PENDING",
      state: "Ogun",
      lga: "Abeokuta",
      gender: "Female",
      registeredAt: "2024-01-18",
      lastUpdated: "2024-01-18"
    },
    {
      id: "5",
      applicationNumber: "AOPESS/2024/005",
      firstName: "David",
      lastName: "Brown",
      email: "david.brown@email.com",
      phone: "08056789012",
      program: "Mass Communication",
      department: "Mass Communication",
      faculty: "Communication",
      utmeScore: 230,
      screeningStatus: "REJECTED",
      state: "Oyo",
      lga: "Oyo",
      gender: "Male",
      registeredAt: "2024-01-19",
      lastUpdated: "2024-01-19"
    },
    {
      id: "6",
      applicationNumber: "AOPESS/2024/006",
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.davis@email.com",
      phone: "08067890123",
      program: "Computer Science",
      department: "Computer Science",
      faculty: "Computing",
      utmeScore: 290,
      screeningStatus: "SHORTLISTED",
      totalScore: 92.1,
      state: "Lagos",
      lga: "Lekki",
      gender: "Female",
      registeredAt: "2024-01-20",
      lastUpdated: "2024-01-23"
    },
    {
      id: "7",
      applicationNumber: "AOPESS/2024/007",
      firstName: "James",
      lastName: "Wilson",
      email: "james.wilson@email.com",
      phone: "08078901234",
      program: "Electrical Engineering",
      department: "Electrical Engineering",
      faculty: "Engineering",
      utmeScore: 275,
      screeningStatus: "COMPLETED",
      totalScore: 81.7,
      state: "Ogun",
      lga: "Sagamu",
      gender: "Male",
      registeredAt: "2024-01-21",
      lastUpdated: "2024-01-24"
    },
    {
      id: "8",
      applicationNumber: "AOPESS/2024/008",
      firstName: "Lisa",
      lastName: "Anderson",
      email: "lisa.anderson@email.com",
      phone: "08089012345",
      program: "Business Administration",
      department: "Business Administration",
      faculty: "Management",
      utmeScore: 250,
      screeningStatus: "APPROVED",
      totalScore: 76.3,
      state: "Lagos",
      lga: "Ikoyi",
      gender: "Female",
      registeredAt: "2024-01-22",
      lastUpdated: "2024-01-25"
    }
  ]

  const handleExport = (selectedCandidateIds: string[]) => {
    console.log("Exporting candidates:", selectedCandidateIds)
    // Implement export functionality
    // This could generate CSV, PDF, or Excel files
  }

  const handleViewCandidate = (candidate: Candidate) => {
    console.log("Viewing candidate:", candidate)
    // Implement view functionality
  }

  const handleEditCandidate = (candidate: Candidate) => {
    console.log("Editing candidate:", candidate)
    // Implement edit functionality
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Search Candidates</h1>
            <p className="text-gray-600 mt-1">
              Advanced search and filtering for candidate records
            </p>
          </div>
        </div>

        {/* Main Content */}
        <AdvancedSearch
          candidates={mockCandidates}
          onExport={handleExport}
          onView={handleViewCandidate}
          onEdit={handleEditCandidate}
          isLoading={false}
        />
      </div>
    </DashboardLayout>
  )
}