"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { useAlerts } from "@/hooks/use-alerts"

interface LoginFormData {
  email: string
  password: string
  role: string
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { showSuccess, showError, showLoading, closeAlert } = useAlerts()

  const handleLogin = async (data: LoginFormData) => {
    try {
      showLoading('Signing in...')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate authentication
      const isValidUser = true // In real app, this would be actual authentication
      
      closeAlert()
      
      if (isValidUser) {
        // Store user info in localStorage (in real app, use proper auth)
        localStorage.setItem('user', JSON.stringify({
          email: data.email,
          role: data.role,
          isLoggedIn: true
        }))
        
        await showSuccess({
          title: 'Login Successful!',
          text: `Welcome back! Redirecting to your dashboard...`,
          timer: 2000
        })
        
        // Redirect based on role
        setTimeout(() => {
          switch (data.role) {
            case 'CANDIDATE':
              router.push('/candidate/dashboard')
              break
            case 'ADMIN':
              router.push('/admin/dashboard')
              break
            case 'OFFICER':
              router.push('/officer/dashboard')
              break
            case 'HOD':
              router.push('/hod/dashboard')
              break
            default:
              router.push('/')
          }
        }, 2000)
      } else {
        await showError({
          title: 'Login Failed!',
          text: 'Invalid email or password. Please try again.',
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
      <div className="max-w-md w-full space-y-8">
        <LoginForm onLogin={handleLogin} isLoading={isLoading} />
      </div>
    </div>
  )
}