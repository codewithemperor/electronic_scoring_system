"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  marks: number
  subject: {
    name: string
    code: string
  }
}

interface Candidate {
  id: string
  firstName: string
  lastName: string
  registrationNumber: string
  screening: {
    id: string
    name: string
    duration: number
    totalMarks: number
    passMarks: number
    instructions: string
  }
  program: {
    name: string
    code: string
  }
}

interface TestAnswer {
  questionId: string
  selectedAnswer: string
  timeTaken?: number
}

export default function TakeTestPage() {
  const params = useParams()
  const router = useRouter()
  const candidateId = params.id as string

  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null)

  useEffect(() => {
    fetchTestData()
  }, [candidateId])

  useEffect(() => {
    if (testStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitTest() // Auto-submit when time runs out
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [testStarted, timeRemaining])

  useEffect(() => {
    if (testStarted && !testCompleted) {
      setQuestionStartTime(Date.now())
    }
  }, [currentQuestionIndex, testStarted, testCompleted])

  const fetchTestData = async () => {
    try {
      setLoading(true)
      
      // Fetch candidate details
      const candidateResponse = await fetch(`/api/candidates/${candidateId}`)
      if (!candidateResponse.ok) {
        toast.error("Candidate not found")
        router.push("/")
        return
      }
      const candidateData = await candidateResponse.json()
      setCandidate(candidateData)

      // Check if candidate has already written the test
      if (candidateData.hasWritten) {
        toast.error("You have already completed this test")
        router.push("/candidate/check-result")
        return
      }

      // Fetch questions
      const questionsResponse = await fetch(`/api/candidates/${candidateId}/questions`)
      if (!questionsResponse.ok) {
        toast.error("Failed to load questions")
        return
      }
      const questionsData = await questionsResponse.json()
      setQuestions(questionsData)

      // Set test duration
      setTimeRemaining(candidateData.screening.duration * 60) // Convert minutes to seconds

    } catch (error) {
      console.error("Failed to fetch test data:", error)
      toast.error("Failed to load test")
    } finally {
      setLoading(false)
    }
  }

  const startTest = () => {
    setTestStarted(true)
    setStartTime(Date.now())
    toast.success("Test started! Good luck!")
  }

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmitTest = async () => {
    if (!confirm("Are you sure you want to submit your test? You cannot change your answers after submission.")) {
      return
    }

    setSubmitting(true)
    setIsSubmitDialogOpen(false)

    try {
      // Calculate time taken
      const totalTimeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0

      // Prepare answers array
      const answersArray: TestAnswer[] = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer
      }))

      // Submit test for scoring
      const response = await fetch("/api/scoring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateId,
          answers: answersArray,
          timeTaken: totalTimeTaken
        }),
      })

      if (response.ok) {
        const result = await response.json()
        
        // Store test result in sessionStorage for success page
        sessionStorage.setItem('testResult', JSON.stringify(result.result))
        
        setTestCompleted(true)
        toast.success("Test submitted successfully!")
        
        // Show result summary
        setTimeout(() => {
          router.push("/candidate/test-success")
        }, 3000)
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to submit test")
      }
    } catch (error) {
      console.error("Failed to submit test:", error)
      toast.error("Failed to submit test")
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  const getProgressPercentage = () => {
    return (getAnsweredCount() / questions.length) * 100
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const isFirstQuestion = currentQuestionIndex === 0
  const answeredCount = getAnsweredCount()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    )
  }

  if (!candidate || !questions.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">Test Not Available</h2>
              <p className="text-gray-600 mb-4">
                Unable to load the test. Please contact support.
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

  if (testCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-semibold mb-2">Test Completed!</h2>
              <p className="text-gray-600 mb-4">
                Your test has been submitted successfully. You will be redirected to view your results.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {candidate.screening.name}
            </CardTitle>
            <CardDescription className="text-center">
              Read the instructions carefully before starting the test
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Test Instructions</h3>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                {candidate.screening.instructions || `Please read the following instructions carefully:

1. You have ${candidate.screening.duration} minutes to complete the test.
2. The test contains ${questions.length} questions.
3. Each question has multiple choice options.
4. Select the best answer for each question.
5. You can navigate between questions using the Previous/Next buttons.
6. Your progress will be saved automatically.
7. Click Submit when you have completed all questions.
8. Once submitted, you cannot change your answers.

Good luck!`}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm text-gray-500">Candidate</h4>
                <p className="font-medium">{candidate.firstName} {candidate.lastName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm text-gray-500">Registration Number</h4>
                <p className="font-medium">{candidate.registrationNumber}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm text-gray-500">Program</h4>
                <p className="font-medium">{candidate.program.name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm text-gray-500">Duration</h4>
                <p className="font-medium">{candidate.screening.duration} minutes</p>
              </div>
            </div>

            <div className="text-center">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Make sure you have a stable internet connection before starting the test.
                  The timer will start immediately when you click "Start Test".
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex justify-center">
              <Button onClick={startTest} size="lg" className="px-8">
                Start Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{candidate.screening.name}</h1>
              <p className="text-sm text-gray-600">
                {candidate.firstName} {candidate.lastName} - {candidate.registrationNumber}
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-xs text-gray-500">Time Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {answeredCount}/{questions.length}
                </div>
                <div className="text-xs text-gray-500">Answered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Progress</span>
            <div className="flex-1">
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
            <span className="text-sm text-gray-600">
              {Math.round(getProgressPercentage())}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((question, index) => (
                    <button
                      key={question.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                        index === currentQuestionIndex
                          ? "border-primary bg-primary text-primary-foreground"
                          : answers[question.id]
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </CardTitle>
                    <CardDescription>
                      {currentQuestion.subject.name} ({currentQuestion.subject.code})
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    {currentQuestion.marks} marks
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg font-medium">
                  {currentQuestion.question}
                </div>

                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={isFirstQuestion}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex space-x-2">
                    {isLastQuestion ? (
                      <Button
                        onClick={() => setIsSubmitDialogOpen(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Submit Test
                      </Button>
                    ) : (
                      <Button onClick={handleNextQuestion}>
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Test</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your test? Please review your answers before submitting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{answeredCount}</div>
                <div className="text-sm text-gray-600">Questions Answered</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {questions.length - answeredCount}
                </div>
                <div className="text-sm text-gray-600">Questions Unanswered</div>
              </div>
            </div>
            {questions.length - answeredCount > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You have {questions.length - answeredCount} unanswered questions. 
                  Unanswered questions will be marked as incorrect.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Review Answers
            </Button>
            <Button 
              onClick={handleSubmitTest} 
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? "Submitting..." : "Submit Test"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}