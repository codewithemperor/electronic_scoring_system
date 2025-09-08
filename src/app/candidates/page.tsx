"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CandidateForm } from "@/components/candidates/candidate-form"
import { CandidatesList } from "@/components/candidates/candidates-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, UserPlus } from "lucide-react"
import { useAlerts } from "@/hooks/use-alerts"

interface Candidate {
  id: string
  applicationNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  program: string
  utmeScore: number
  screeningStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "APPROVED" | "REJECTED" | "SHORTLISTED"
  totalScore?: number
  createdAt: string
}

interface Program {
  id: string
  name: string
  code: string
  department: string
  faculty: string
}

export default function CandidatesPage() {
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { showSuccess, showError, showLoading, closeAlert } = useAlerts()

  // Mock data for demonstration
  const mockPrograms: Program[] = [
    {
      id: "1",
      name: "Computer Science",
      code: "CS",
      department: "Computer Science",
      faculty: "Computing"
    },
    {
      id: "2",
      name: "Electrical Engineering",
      code: "EE",
      department: "Electrical Engineering",
      faculty: "Engineering"
    },
    {
      id: "3",
      name: "Business Administration",
      code: "BA",
      department: "Business Administration",
      faculty: "Management"
    },
    {
      id: "4",
      name: "Accountancy",
      code: "ACC",
      department: "Accountancy",
      faculty: "Management"
    },
    {
      id: "5",
      name: "Mass Communication",
      code: "MC",
      department: "Mass Communication",
      faculty: "Communication"
    }
  ]

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
      screeningStatus: "COMPLETED",
      totalScore: 85.5,
      createdAt: "2024-01-15"
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
      screeningStatus: "APPROVED",
      totalScore: 78.2,
      createdAt: "2024-01-16"
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
      screeningStatus: "IN_PROGRESS",
      createdAt: "2024-01-17"
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
      screeningStatus: "PENDING",
      createdAt: "2024-01-18"
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
      screeningStatus: "REJECTED",
      createdAt: "2024-01-19"
    }
  ]

  const handleFormSubmit = async (data: any) => {
    try {
      showLoading('Registering candidate...')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.2 // 80% success rate
      
      closeAlert()
      
      if (isSuccess) {
        await showSuccess({
          title: 'Registration Successful!',
          text: `Candidate ${data.firstName} ${data.lastName} has been registered successfully.`,
          timer: 3000
        })
        setShowForm(false)
        // Here you would typically refresh the candidates list
      } else {
        await showError({
          title: 'Registration Failed!',
          text: 'Failed to register candidate. Please try again.',
          timer: 3000
        })
      }
    } catch (error) {
      closeAlert()
      await showError({
        title: 'Error!',
        text: 'An unexpected error occurred. Please try again.',
        timer: 3000
      })
    }
  }

  const handleViewCandidate = (candidate: Candidate) => {
    console.log("View candidate:", candidate)
    // Implement view functionality
  }

  const handleEditCandidate = (candidate: Candidate) => {
    console.log("Edit candidate:", candidate)
    // Implement edit functionality
  }

  const handleDeleteCandidate = async (candidateId: string) => {
    try {
      const result = await showConfirm({
        title: 'Are you sure?',
        text: 'This action cannot be undone. This candidate will be permanently deleted.',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      })

      if (result.isConfirmed) {
        showLoading('Deleting candidate...')
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        closeAlert()
        
        await showSuccess({
          title: 'Deleted!',
          text: 'Candidate has been deleted successfully.',
          timer: 2000
        })
        // Here you would typically refresh the candidates list
      }
    } catch (error) {
      closeAlert()
      await showError({
        title: 'Error!',
        text: 'Failed to delete candidate. Please try again.',
        timer: 3000
      })
    }
  }

  const handleAddNew = () => {
    setShowForm(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
            <p className="text-gray-600 mt-1">
              Manage candidate registrations and screening information
            </p>
          </div>
        </div>

        {/* Main Content */}
        {showForm ? (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={() => setShowForm(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Candidates List
            </Button>
            <CandidateForm
              programs={mockPrograms}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <CandidatesList
            candidates={mockCandidates}
            onView={handleViewCandidate}
            onEdit={handleEditCandidate}
            onDelete={handleDeleteCandidate}
            onAddNew={handleAddNew}
            isLoading={false}
          />
        )}
      </div>
    </DashboardLayout>
  )
}