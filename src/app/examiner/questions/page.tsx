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
import { Textarea } from "@/components/ui/textarea"
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  Search, 
  Filter,
  Upload,
  Download,
  Eye,
  Target
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  marks: number
  difficulty: string
  isActive: boolean
  subject: {
    name: string
    code: string
  }
  screening?: {
    name: string
  }
  createdAt: string
}

interface Subject {
  id: string
  name: string
  code: string
  isActive: boolean
}

interface Screening {
  id: string
  name: string
  status: string
}

interface QuestionStats {
  totalQuestions: number
  activeQuestions: number
  byDifficulty: {
    EASY: number
    MEDIUM: number
    HARD: number
  }
  bySubject: Record<string, number>
}

interface QuestionFormData {
  question: string
  subjectId: string
  screeningId?: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  marks: number
  difficulty: string
}

const questionSchema = {
  question: (value: string) => {
    if (!value || value.trim().length < 10) {
      return "Question must be at least 10 characters long"
    }
    return true
  },
  subjectId: (value: string) => {
    if (!value) {
      return "Subject is required"
    }
    return true
  },
  optionA: (value: string) => {
    if (!value || value.trim().length === 0) {
      return "Option A is required"
    }
    return true
  },
  optionB: (value: string) => {
    if (!value || value.trim().length === 0) {
      return "Option B is required"
    }
    return true
  },
  optionC: (value: string) => {
    if (!value || value.trim().length === 0) {
      return "Option C is required"
    }
    return true
  },
  optionD: (value: string) => {
    if (!value || value.trim().length === 0) {
      return "Option D is required"
    }
    return true
  },
  correctAnswer: (value: string) => {
    if (!value || !['A', 'B', 'C', 'D'].includes(value)) {
      return "Correct answer must be A, B, C, or D"
    }
    return true
  },
  marks: (value: number) => {
    if (!value || value < 1) {
      return "Marks must be at least 1"
    }
    return true
  },
  difficulty: (value: string) => {
    if (!value || !['EASY', 'MEDIUM', 'HARD'].includes(value)) {
      return "Difficulty is required"
    }
    return true
  }
}

export default function ExaminerQuestionsPage() {
  const { data: session } = useSession()
  const [questions, setQuestions] = useState<Question[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [stats, setStats] = useState<QuestionStats>({
    totalQuestions: 0,
    activeQuestions: 0,
    byDifficulty: { EASY: 0, MEDIUM: 0, HARD: 0 },
    bySubject: {}
  })
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<QuestionFormData>()

  useEffect(() => {
    fetchQuestions()
    fetchSubjects()
    fetchScreenings()
    fetchStats()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/questions")
      if (response.ok) {
        const data = await response.json()
        setQuestions(data)
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/subjects")
      if (response.ok) {
        const data = await response.json()
        setSubjects(data)
      }
    } catch (error) {
      console.error("Failed to fetch subjects:", error)
    }
  }

  const fetchScreenings = async () => {
    try {
      const response = await fetch("/api/screenings")
      if (response.ok) {
        const data = await response.json()
        setScreenings(data)
      }
    } catch (error) {
      console.error("Failed to fetch screenings:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/questions/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch question stats:", error)
    }
  }

  const onSubmit = async (data: QuestionFormData) => {
    try {
      const questionData = {
        question: data.question,
        subjectId: data.subjectId,
        screeningId: data.screeningId || null,
        options: [data.optionA, data.optionB, data.optionC, data.optionD],
        correctAnswer: data.correctAnswer,
        marks: data.marks,
        difficulty: data.difficulty
      }

      const url = editingQuestion ? `/api/questions/${editingQuestion.id}` : "/api/questions"
      const method = editingQuestion ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      })

      if (response.ok) {
        toast.success(`Question ${editingQuestion ? "updated" : "created"} successfully`)
        setIsDialogOpen(false)
        reset()
        setEditingQuestion(null)
        fetchQuestions()
        fetchStats()
      } else {
        toast.error("Failed to save question")
      }
    } catch (error) {
      console.error("Failed to save question:", error)
      toast.error("An error occurred")
    }
  }

  const handleEdit = (question: Question) => {
    setEditingQuestion(question)
    setValue("question", question.question)
    setValue("subjectId", question.subject.id)
    setValue("screeningId", question.screening?.id || "")
    setValue("optionA", question.options[0])
    setValue("optionB", question.options[1])
    setValue("optionC", question.options[2])
    setValue("optionD", question.options[3])
    setValue("correctAnswer", question.correctAnswer)
    setValue("marks", question.marks)
    setValue("difficulty", question.difficulty)
    setIsDialogOpen(true)
  }

  const handleDelete = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) {
      return
    }

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Question deleted successfully")
        fetchQuestions()
        fetchStats()
      } else {
        toast.error("Failed to delete question")
      }
    } catch (error) {
      console.error("Failed to delete question:", error)
      toast.error("An error occurred")
    }
  }

  const handleToggleStatus = async (questionId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/questions/${questionId}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        toast.success(`Question ${!currentStatus ? "activated" : "deactivated"} successfully`)
        fetchQuestions()
        fetchStats()
      } else {
        toast.error("Failed to update question status")
      }
    } catch (error) {
      console.error("Failed to update question status:", error)
      toast.error("An error occurred")
    }
  }

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || question.subject.id === selectedSubject
    const matchesDifficulty = !selectedDifficulty || question.difficulty === selectedDifficulty
    return matchesSearch && matchesSubject && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800"
      case "HARD":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const openCreateDialog = () => {
    setEditingQuestion(null)
    reset()
    setIsDialogOpen(true)
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
            <h1 className="text-2xl font-semibold text-gray-900">Question Bank</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage and organize examination questions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              New Question
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuestions}</div>
              <p className="text-xs text-muted-foreground">
                In question bank
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Questions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeQuestions}</div>
              <p className="text-xs text-muted-foreground">
                Available for use
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Easy Questions</CardTitle>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byDifficulty.EASY}</div>
              <p className="text-xs text-muted-foreground">
                Basic difficulty
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hard Questions</CardTitle>
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byDifficulty.HARD}</div>
              <p className="text-xs text-muted-foreground">
                Advanced difficulty
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
            <CardDescription>
              Browse and manage your question bank
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium">
                      <div className="max-w-xs">
                        <div className="truncate">{question.question}</div>
                        {question.screening && (
                          <div className="text-sm text-gray-500">
                            {question.screening.name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{question.subject.name}</div>
                        <div className="text-sm text-gray-500">{question.subject.code}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{question.marks}</TableCell>
                    <TableCell>
                      <Badge variant={question.isActive ? "default" : "secondary"}>
                        {question.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(question)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(question.id, question.isActive)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredQuestions.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-500 mb-4">Create your first question to get started</p>
                <Button onClick={openCreateDialog}>
                  Create Question
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Question Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? "Edit Question" : "Create New Question"}
              </DialogTitle>
              <DialogDescription>
                {editingQuestion
                  ? "Update question details and options"
                  : "Add a new question to the question bank"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    {...register("question")}
                    placeholder="Enter the question..."
                    rows={3}
                  />
                  {errors.question && (
                    <p className="text-sm text-red-600">{errors.question.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subjectId">Subject</Label>
                    <Select onValueChange={(value) => setValue("subjectId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subjectId && (
                      <p className="text-sm text-red-600">{errors.subjectId.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="screeningId">Screening (Optional)</Label>
                    <Select onValueChange={(value) => setValue("screeningId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select screening" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No specific screening</SelectItem>
                        {screenings.map((screening) => (
                          <SelectItem key={screening.id} value={screening.id}>
                            {screening.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="optionA">Option A</Label>
                    <Input
                      id="optionA"
                      {...register("optionA")}
                      placeholder="Enter option A"
                    />
                    {errors.optionA && (
                      <p className="text-sm text-red-600">{errors.optionA.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="optionB">Option B</Label>
                    <Input
                      id="optionB"
                      {...register("optionB")}
                      placeholder="Enter option B"
                    />
                    {errors.optionB && (
                      <p className="text-sm text-red-600">{errors.optionB.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="optionC">Option C</Label>
                    <Input
                      id="optionC"
                      {...register("optionC")}
                      placeholder="Enter option C"
                    />
                    {errors.optionC && (
                      <p className="text-sm text-red-600">{errors.optionC.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="optionD">Option D</Label>
                    <Input
                      id="optionD"
                      {...register("optionD")}
                      placeholder="Enter option D"
                    />
                    {errors.optionD && (
                      <p className="text-sm text-red-600">{errors.optionD.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="correctAnswer">Correct Answer</Label>
                    <Select onValueChange={(value) => setValue("correctAnswer", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.correctAnswer && (
                      <p className="text-sm text-red-600">{errors.correctAnswer.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marks">Marks</Label>
                    <Input
                      id="marks"
                      type="number"
                      {...register("marks", { valueAsNumber: true })}
                      placeholder="1"
                    />
                    {errors.marks && (
                      <p className="text-sm text-red-600">{errors.marks.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select onValueChange={(value) => setValue("difficulty", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EASY">Easy</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HARD">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.difficulty && (
                      <p className="text-sm text-red-600">{errors.difficulty.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingQuestion ? "Update Question" : "Create Question"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}