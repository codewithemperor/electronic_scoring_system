"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Home } from "lucide-react"
import { toast } from "sonner"

interface RegistrationData {
  message: string
  candidate: {
    firstName: string
    lastName: string
    registrationNumber: string
  }
  registrationNumber: string
}

export default function CandidateSuccessPage() {
  const router = useRouter()
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get registration data from sessionStorage (set during registration)
    const data = sessionStorage.getItem('registrationData')
    if (data) {
      try {
        const parsedData = JSON.parse(data)
        setRegistrationData(parsedData)
        sessionStorage.removeItem('registrationData') // Clean up
      } catch (error) {
        console.error('Failed to parse registration data:', error)
      }
    }
    setLoading(false)
  }, [])

  const handleDownloadReceipt = () => {
    if (!registrationData) return
    
    const receiptContent = `
REGISTRATION RECEIPT
=====================

Adeseun Ogundoyin Polytechnic Eruwa
Electronic Scoring and Screening System

Candidate Information:
----------------------
Name: ${registrationData.candidate.firstName} ${registrationData.candidate.lastName}
Registration Number: ${registrationData.registrationNumber}
Registration Date: ${new Date().toLocaleDateString()}

Status: Successfully Registered

Next Steps:
1. Keep your registration number safe
2. Login with your credentials to access your dashboard
3. Await further instructions about the test date
4. Contact support if you have any questions

Contact Information:
Email: support@polytechnic.edu.ng
Phone: +234 XXX XXX XXXX

Generated on: ${new Date().toLocaleString()}
    `.trim()

    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `registration-receipt-${registrationData.registrationNumber}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    toast.success("Receipt downloaded successfully")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!registrationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-yellow-500 text-6xl mb-4">⚠</div>
              <h2 className="text-xl font-semibold mb-2">Registration Data Not Found</h2>
              <p className="text-gray-600 mb-4">
                Unable to find your registration information. Please contact support.
              </p>
              <Button onClick={() => router.push("/")}>
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="text-green-500 text-6xl mb-4">
            <CheckCircle className="w-full h-full" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Registration Successful!
          </CardTitle>
          <CardDescription>
            Your registration has been completed successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-center">
              <h3 className="font-semibold text-green-800 mb-2">Registration Number</h3>
              <p className="text-2xl font-bold text-green-700">
                {registrationData.registrationNumber}
              </p>
              <p className="text-sm text-green-600 mt-2">
                Please save this number for future reference
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">
                  {registrationData.candidate.firstName} {registrationData.candidate.lastName}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Registration Date</p>
                <p className="font-medium">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Please login with your credentials to access your dashboard</li>
              <li>• Await test date notification</li>
              <li>• Keep your registration number safe</li>
              <li>• Prepare for the screening test</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handleDownloadReceipt}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            
            <Button 
              onClick={() => router.push("/")}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}