"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Play, BookOpen, Users, Clock } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface Program {
  id: string
  name: string
  code: string
  level: string
  cutOffMark: number
  maxCapacity: number
  isActive: boolean
  department: {
    name: string
  }
  _count: {
    candidates: number
  }
}

interface Screening {
  id: string
  name: string
  duration: number
  totalMarks: number
  passMarks: number
  status: string
  academicSession: {
    name: string
  }
  _count: {
    questions: number
    candidates: number
  }
}

interface Question {
  id: string
  question: string
  subject: {
    name: string
    code: string
  }
  marks: number
  difficulty: string
  isActive: boolean
}

interface ProgramTest {
  id: string
  programId: string
  screeningId: string
  program: Program
  screening: Screening
  isActive: boolean
  createdAt: string
}

export default function ExaminerProgramTestsPage() {
  const { data: session } = useSession()
  const [programTests, setProgramTests] = useState<ProgramTest[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false)
  const [editingProgramTest, setEditingProgramTest] = useState<ProgramTest | null>(null)
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [selectedProgram, setSelectedProgram] = useState("")
  const [selectedScreening, setSelectedScreening] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    fetchProgramTests()
    fetchPrograms()
    fetchScreenings()
  }, [])

  const fetchProgramTests = async () => {
    try {
      const response = await fetch("/api/program-tests")
      if (response.ok) {
        const data = await response.json()
        setProgramTests(data)
      }
    } catch (error) {
      console.error("Failed to fetch program tests:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/programs")
      if (response.ok) {
        const data = await response.json()
        setPrograms(data.filter((p: Program) => p.isActive))
      }
    } catch (error) {
      console.error("Failed to fetch programs:", error)
    }
  }

  const fetchScreenings = async () => {
    try {
      const response = await fetch("/api/screenings")
      if (response.ok) {
        const data = await response.json()
        setScreenings(data.filter((s: Screening) => s.status === "ACTIVE"))
      }
    } catch (error) {
      console.error("Failed to fetch screenings:", error)
    }
  }

  const fetchQuestions = async (screeningId?: string) => {
    try {
      const url = screeningId ? `/api/questions?screeningId=${screeningId}` : "/api/questions"
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.filter((q: Question) => q.isActive))
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error)
    }
  }

  const onSubmit = async (data: any) => {
    try {
      const url = editingProgramTest ? `/api/program-tests/${editingProgramTest.id}` : "/api/program-tests"
      const method = editingProgramTest ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          questions: selectedQuestions
        }),
      })

      if (response.ok) {
        toast.success(`Program test ${editingProgramTest ? "updated" : "created"} successfully`)
        setIsDialogOpen(false)
        reset()
        setEditingProgramTest(null)
        setSelectedQuestions([])
        fetchProgramTests()
      } else {
        toast.error("Failed to save program test")
      }
    } catch (error) {
      console.error("Failed to save program test:", error)
      toast.error("An error occurred")
    }
  }

  const handleEdit = (programTest: ProgramTest) => {
    setEditingProgramTest(programTest)
    setValue("programId", programTest.programId)
    setValue("screeningId", programTest.screeningId)
    setIsDialogOpen(true)
  }

  const handleDelete = async (programTestId: string) => {
    if (!confirm("Are you sure you want to delete this program test?")) {
      return
    }

    try {
      const response = await fetch(`/api/program-tests/${programTestId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Program test deleted successfully")
        fetchProgramTests()
      } else {
        toast.error("Failed to delete program test")
      }
    } catch (error) {
      console.error("Failed to delete program test:", error)
      toast.error("An error occurred")
    }
  }

  const handleToggleStatus = async (programTestId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/program-tests/${programTestId}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        toast.success(`Program test ${!isActive ? "activated" : "deactivated"} successfully`)
        fetchProgramTests()
      } else {
        toast.error("Failed to update program test status")
      }
    } catch (error) {
      console.error("Failed to update program test status:", error)
      toast.error("An error occurred")
    }
  }

  const openCreateDialog = () => {
    setEditingProgramTest(null)
    reset()
    setSelectedQuestions([])
    setIsDialogOpen(true)
  }

  const openQuestionDialog = () => {
    setIsQuestionDialogOpen(true)
    if (selectedScreening) {
      fetchQuestions(selectedScreening)
    }
  }

  const handleQuestionSelect = (questionId: string, checked: boolean) => {
    if (checked) {
      setSelectedQuestions([...selectedQuestions, questionId])
    } else {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800"
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Program Tests</h1>
            <p className="mt-1 text-sm text-gray-600">
              Assign tests to programs and manage candidate assessments
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Assign Test to Program
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Program Test Assignments</CardTitle>
            <CardDescription>
              View and manage test assignments for each program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Test</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Candidates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programTests.map((programTest) => (
                  <TableRow key={programTest.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{programTest.program.name}</div>
                        <div className="text-sm text-gray-500">{programTest.program.code}</div>
                      </div>
                    </TableCell>
                    <TableCell>{programTest.program.department.name}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{programTest.screening.name}</div>
                        <div className="text-sm text-gray-500">{programTest.screening.academicSession.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{programTest.screening.duration} min</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{programTest.screening._count.questions}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{programTest.screening._count.candidates}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(programTest.screening.status)}>
                        {programTest.screening.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(programTest)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(programTest.id, programTest.isActive)}
                        >
                          {programTest.isActive ? (
                            <span className="text-red-500">●</span>
                          ) : (
                            <span className="text-green-500">●</span>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(programTest.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {programTests.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No program tests found</h3>
                <p className="text-gray-500 mb-4">Assign tests to programs to get started</p>
                <Button onClick={openCreateDialog}>
                  Assign Test to Program
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Program Test Assignment Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingProgramTest ? "Edit Program Test" : "Assign Test to Program"}
              </DialogTitle>
              <DialogDescription>
                {editingProgramTest
                  ? "Update program test assignment"
                  : "Assign a screening test to a specific program"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="programId">Program *</Label>
                  <Select onValueChange={(value) => {
                    setValue("programId", value)
                    setSelectedProgram(value)
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name} ({program.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.programId && (
                    <p className="text-sm text-red-600">{errors.programId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screeningId">Screening Test *</Label>
                  <Select onValueChange={(value) => {
                    setValue("screeningId", value)
                    setSelectedScreening(value)
                    fetchQuestions(value)
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select screening test" />
                    </SelectTrigger>
                    <SelectContent>
                      {screenings.map((screening) => (
                        <SelectItem key={screening.id} value={screening.id}>
                          {screening.name} ({screening.duration} min, {screening._count.questions} questions)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.screeningId && (
                    <p className="text-sm text-red-600">{errors.screeningId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Selected Questions ({selectedQuestions.length})</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={openQuestionDialog}
                    className="w-full"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Manage Questions
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingProgramTest ? "Update Assignment" : "Assign Test"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Question Selection Dialog */}
        <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Select Questions</DialogTitle>
              <DialogDescription>
                Choose questions to include in this program test
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {questions.map((question) => (
                  <div key={question.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={question.id}
                      checked={selectedQuestions.includes(question.id)}
                      onCheckedChange={(checked) => handleQuestionSelect(question.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={question.id} className="text-sm font-medium cursor-pointer">
                        {question.question}
                      </Label>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{question.subject.name}</span>
                        <span>{question.marks} marks</span>
                        <Badge variant="outline" className="text-xs">
                          {question.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsQuestionDialogOpen(false)}>
                Done ({selectedQuestions.length} selected)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}