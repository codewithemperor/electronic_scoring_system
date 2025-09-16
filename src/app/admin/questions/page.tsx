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
import { Plus, Edit, Trash2, Upload, Download, Search } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { questionSchema, type QuestionInput } from "@/lib/validations"
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

export default function QuestionsPage() {
  const { data: session } = useSession()
  const [questions, setQuestions] = useState<Question[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [screenings, setScreenings] = useState<Screening[]>([])
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
  } = useForm<QuestionInput>({
    resolver: zodResolver(questionSchema),
  })

  const watchedOptions = watch("options", ["", "", "", ""])

  useEffect(() => {
    fetchQuestions()
    fetchSubjects()
    fetchScreenings()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchQuestions()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedSubject, selectedDifficulty])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (selectedSubject) params.append("subjectId", selectedSubject)
      if (selectedDifficulty) params.append("difficulty", selectedDifficulty)

      const response = await fetch(`/api/questions?${params}`)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data)
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error)
      toast.error("Failed to load questions")
    } finally {
      setLoading(false)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/subjects")
      if (response.ok) {
        const data = await response.json()
        setSubjects(data.filter((s: Subject) => s.isActive))
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
        setScreenings(data.filter((s: Screening) => s.status === "ACTIVE"))
      }
    } catch (error) {
      console.error("Failed to fetch screenings:", error)
    }
  }

  const onSubmit = async (data: QuestionInput) => {
    try {
      const url = editingQuestion ? `/api/questions/${editingQuestion.id}` : "/api/questions"
      const method = editingQuestion ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(`Question ${editingQuestion ? "updated" : "created"} successfully`)
        setIsDialogOpen(false)
        reset()
        setEditingQuestion(null)
        fetchQuestions()
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
    setValue("options", question.options)
    setValue("correctAnswer", question.correctAnswer)
    setValue("subjectId", question.subject.id)
    setValue("marks", question.marks)
    setValue("difficulty", question.difficulty as any)
    setValue("screeningId", question.screening?.id || "")
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
      } else {
        toast.error("Failed to delete question")
      }
    } catch (error) {
      console.error("Failed to delete question:", error)
      toast.error("An error occurred")
    }
  }

  const handleToggleStatus = async (questionId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/questions/${questionId}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        toast.success(`Question ${!isActive ? "activated" : "deactivated"} successfully`)
        fetchQuestions()
      } else {
        toast.error("Failed to update question status")
      }
    } catch (error) {
      console.error("Failed to update question status:", error)
      toast.error("An error occurred")
    }
  }

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
    setValue("options", ["", "", "", ""])
    setIsDialogOpen(true)
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...watchedOptions]
    newOptions[index] = value
    setValue("options", newOptions)
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
              Manage test questions for screenings
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="All subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All difficulties</SelectItem>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Actions</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedSubject("")
                    setSelectedDifficulty("")
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
            <CardDescription>
              All questions in the question bank
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Screening</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={question.question}>
                        {question.question}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{question.subject.name}</div>
                        <div className="text-sm text-gray-500">
                          {question.subject.code}
                        </div>
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
                      {question.screening ? (
                        <span className="text-sm">{question.screening.name}</span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
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
                          {question.isActive ? (
                            <span className="text-red-500">●</span>
                          ) : (
                            <span className="text-green-500">●</span>
                          )}
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
          </CardContent>
        </Card>

        {/* Question Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? "Edit Question" : "Add New Question"}
              </DialogTitle>
              <DialogDescription>
                {editingQuestion
                  ? "Update question details and options"
                  : "Create a new multiple choice question"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question *</Label>
                  <Textarea
                    id="question"
                    {...register("question")}
                    placeholder="Enter your question here..."
                    rows={3}
                  />
                  {errors.question && (
                    <p className="text-sm text-red-600">{errors.question.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Options *</Label>
                  <div className="space-y-2">
                    {watchedOptions.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        />
                      </div>
                    ))}
                  </div>
                  {errors.options && (
                    <p className="text-sm text-red-600">{errors.options.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="correctAnswer">Correct Answer *</Label>
                    <Select onValueChange={(value) => setValue("correctAnswer", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
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
                    <Label htmlFor="marks">Marks *</Label>
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
                    <Label htmlFor="difficulty">Difficulty *</Label>
                    <Select onValueChange={(value) => setValue("difficulty", value as any)}>
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subjectId">Subject *</Label>
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
                        <SelectItem value="">General Question Bank</SelectItem>
                        {screenings.map((screening) => (
                          <SelectItem key={screening.id} value={screening.id}>
                            {screening.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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