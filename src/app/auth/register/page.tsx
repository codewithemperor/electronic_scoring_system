"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CandidateRegisterForm } from "@/components/auth/candidate-register-form"
import { useAlerts } from "@/hooks/use-alerts"

interface CandidateRegisterFormData {
  firstName: string
  lastName: string
  middleName?: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  lga: string
  state: string
  country: string
  utmeScore: number
  programId: string
  olevelResults: string
  password: string
  confirmPassword: string
}

interface Program {
  id: string
  name: string
  code: string
  department: string
  faculty: string
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [programs, setPrograms] = useState<Program[]>([])
  const router = useRouter()
  const { showSuccess, showError, showLoading, closeAlert } = useAlerts()

  useEffect(() => {
    // Fetch programs from API (mock for now)
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
    setPrograms(mockPrograms)
  }, [])

  const handleRegister = async (data: CandidateRegisterFormData) => {
    try {
      showLoading('Creating account...')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.2 // 80% success rate
      
      closeAlert()
      
      if (isSuccess) {
        await showSuccess({
          title: 'Registration Successful!',
          text: `Your account has been created successfully. Please login to continue.`,
          timer: 3000
        })
        
        // Redirect to login page
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      } else {
        await showError({
          title: 'Registration Failed!',
          text: 'Failed to create account. Please try again.',
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Create Your Candidate Account
          </h2>
          <p className="mt-2 text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-800">
              Sign in here
            </Link>
          </p>
        </div>
        
        <CandidateRegisterForm
          programs={programs}
          onSubmit={handleRegister}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}