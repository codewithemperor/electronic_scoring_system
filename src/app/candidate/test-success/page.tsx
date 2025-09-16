"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Home, Eye } from "lucide-react"
import { toast } from "sonner"

interface TestResult {
  candidateId: string
  totalScore: number
  maxScore: number
  percentage: number
  correctAnswers: number
  wrongAnswers: number
  unansweredQuestions: number
  timeTaken: number
  subjectBreakdown: Array<{
    subjectId: string
    subjectName: string
    subjectCode: string
    totalQuestions: number
    correctAnswers: number
    score: number
    percentage: number
  }>
  grade: string
  status: 'PASSED' | 'FAILED'
}

export default function TestSuccessPage() {
  const router = useRouter()
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get test result from sessionStorage (set during test submission)
    const data = sessionStorage.getItem('testResult')
    if (data) {
      try {
        const parsedData = JSON.parse(data)
        setTestResult(parsedData)
        sessionStorage.removeItem('testResult') // Clean up
      } catch (error) {
        console.error('Failed to parse test result:', error)
      }
    }
    setLoading(false)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-50 border-green-200'
      case 'B': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'C': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'D': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'E': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'F': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'PASSED' 
      ? 'text-green-600 bg-green-50 border-green-200' 
      : 'text-red-600 bg-red-50 border-red-200'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!testResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-yellow-500 text-6xl mb-4">⚠</div>
              <h2 className="text-xl font-semibold mb-2">Test Result Not Found</h2>
              <p className="text-gray-600 mb-4">
                Unable to find your test results. Please contact support.
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-green-500 text-6xl mb-4">
            <CheckCircle className="w-full h-full" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Test Completed Successfully!
          </h1>
          <p className="text-gray-600">
            Your test has been submitted and scored. Here are your results:
          </p>
        </div>

        {/* Main Result Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Overall Score */}
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {testResult.totalScore}
                </div>
                <div className="text-sm text-blue-600">Total Score</div>
                <div className="text-xs text-blue-500 mt-1">
                  out of {testResult.maxScore}
                </div>
              </div>

              {/* Percentage */}
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {testResult.percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-green-600">Percentage</div>
              </div>

              {/* Grade */}
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className={`text-4xl font-bold mb-2 ${getGradeColor(testResult.grade).split(' ')[0]}`}>
                  {testResult.grade}
                </div>
                <div className="text-sm text-purple-600">Grade</div>
              </div>
            </div>

            {/* Status */}
            <div className="text-center mb-6">
              <Badge 
                variant="outline" 
                className={`text-lg px-6 py-2 ${getStatusColor(testResult.status)}`}
              >
                {testResult.status === 'PASSED' ? '🎉 PASSED' : '❌ FAILED'}
              </Badge>
            </div>

            {/* Performance Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-700 mb-1">
                  {testResult.correctAnswers}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-700 mb-1">
                  {testResult.wrongAnswers}
                </div>
                <div className="text-sm text-gray-600">Wrong</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-700 mb-1">
                  {testResult.unansweredQuestions}
                </div>
                <div className="text-sm text-gray-600">Unanswered</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-700 mb-1">
                  {formatTime(testResult.timeTaken)}
                </div>
                <div className="text-sm text-gray-600">Time Taken</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Subject-wise Performance</CardTitle>
            <CardDescription>
              Your performance breakdown by subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResult.subjectBreakdown.map((subject, index) => (
                <div key={subject.subjectId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{subject.subjectName}</h4>
                      <p className="text-sm text-gray-500">{subject.subjectCode}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {subject.score} marks
                      </div>
                      <div className="text-sm text-gray-500">
                        {subject.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${subject.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{subject.correctAnswers}/{subject.totalQuestions} correct</span>
                    <span>{subject.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testResult.status === 'PASSED' ? (
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-3">🎉 Congratulations!</h3>
                  <ul className="text-sm text-green-700 space-y-2">
                    <li>• You have successfully passed the screening test</li>
                    <li> Your results will be reviewed by the admission committee</li>
                    <li>• Check your email regularly for admission updates</li>
                    <li>• Keep your registration number safe for future reference</li>
                    <li>• Prepare for any additional screening processes if required</li>
                  </ul>
                </div>
              ) : (
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-3">Important Notice</h3>
                  <ul className="text-sm text-red-700 space-y-2">
                    <li>• Unfortunately, you did not meet the pass mark</li>
                    <li>• You may be eligible for consideration in other programs</li>
                    <li>• Check your email for alternative options</li>
                    <li>• Contact the admission office for guidance</li>
                    <li>• Consider retaking the test if available</li>
                  </ul>
                </div>
              )}
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3">Contact Information</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>📧 Email: admissions@polytechnic.edu.ng</p>
                  <p>📞 Phone: +234 XXX XXX XXXX</p>
                  <p>🏢 Address: Adeseun Ogundoyin Polytechnic, Eruwa, Oyo State</p>
                  <p>🌐 Website: www.polytechnic.edu.ng</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => {
              // Print results
              window.print()
            }}
            variant="outline"
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            Print Results
          </Button>
          
          <Button 
            onClick={() => router.push("/")}
            className="flex-1"
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  )
}