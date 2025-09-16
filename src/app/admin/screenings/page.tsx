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
import { Plus, Edit, Trash2, Play, Pause, Users } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { screeningSchema, type ScreeningInput } from "@/lib/validations"
import { toast } from "sonner"

interface Screening {
  id: string
  name: string
  startDate: string
  endDate: string
  duration: number
  totalMarks: number
  passMarks: number
  status: string
  instructions: string | null
  academicSession: {
    name: string
  }
  createdBy: {
    firstName: string
    lastName: string
  }
  _count: {
    candidates: number
    questions: number
  }
}

interface AcademicSession {
  id: string
  name: string
  isActive: boolean
}

export default function ScreeningsPage() {
  const { data: session } = useSession()
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [academicSessions, setAcademicSessions] = useState<AcademicSession[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingScreening, setEditingScreening] = useState<Screening | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ScreeningInput>({
    resolver: zodResolver(screeningSchema),
  })

  useEffect(() => {
    fetchScreenings()
    fetchAcademicSessions()
  }, [])

  const fetchScreenings = async () => {
    try {
      const response = await fetch("/api/screenings")
      if (response.ok) {
        const data = await response.json()
        setScreenings(data)
      }
    } catch (error) {
      console.error("Failed to fetch screenings:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAcademicSessions = async () => {
    try {
      const response = await fetch("/api/academic-sessions")
      if (response.ok) {
        const data = await response.json()
        setAcademicSessions(data)
      }
    } catch (error) {
      console.error("Failed to fetch academic sessions:", error)
    }
  }

  const onSubmit = async (data: ScreeningInput) => {
    try {
      const url = editingScreening ? `/api/screenings/${editingScreening.id}` : "/api/screenings"
      const method = editingScreening ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(`Screening ${editingScreening ? "updated" : "created"} successfully`)
        setIsDialogOpen(false)
        reset()
        setEditingScreening(null)
        fetchScreenings()
      } else {
        toast.error("Failed to save screening")
      }
    } catch (error) {
      console.error("Failed to save screening:", error)
      toast.error("An error occurred")
    }
  }

  const handleEdit = (screening: Screening) => {
    setEditingScreening(screening)
    setValue("name", screening.name)
    setValue("academicSessionId", screening.academicSession.name)
    setValue("startDate", new Date(screening.startDate).toISOString().split('T')[0])
    setValue("endDate", new Date(screening.endDate).toISOString().split('T')[0])
    setValue("duration", screening.duration)
    setValue("totalMarks", screening.totalMarks)
    setValue("passMarks", screening.passMarks)
    setValue("instructions", screening.instructions || "")
    setIsDialogOpen(true)
  }

  const handleDelete = async (screeningId: string) => {
    if (!confirm("Are you sure you want to delete this screening?")) {
      return
    }

    try {
      const response = await fetch(`/api/screenings/${screeningId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Screening deleted successfully")
        fetchScreenings()
      } else {
        toast.error("Failed to delete screening")
      }
    } catch (error) {
      console.error("Failed to delete screening:", error)
      toast.error("An error occurred")
    }
  }

  const handleToggleStatus = async (screeningId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "DRAFT" : "ACTIVE"
    
    try {
      const response = await fetch(`/api/screenings/${screeningId}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success(`Screening ${newStatus === "ACTIVE" ? "activated" : "deactivated"} successfully`)
        fetchScreenings()
      } else {
        toast.error("Failed to update screening status")
      }
    } catch (error) {
      console.error("Failed to update screening status:", error)
      toast.error("An error occurred")
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
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const openCreateDialog = () => {
    setEditingScreening(null)
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
            <h1 className="text-2xl font-semibold text-gray-900">Screening Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Create and manage admission screenings
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            New Screening
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Screenings</CardTitle>
            <CardDescription>
              Current and upcoming admission screenings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Academic Session</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Candidates</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {screenings.map((screening) => (
                  <TableRow key={screening.id}>
                    <TableCell className="font-medium">
                      {screening.name}
                    </TableCell>
                    <TableCell>{screening.academicSession.name}</TableCell>
                    <TableCell>{screening.duration} minutes</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{screening._count.candidates}</span>
                      </div>
                    </TableCell>
                    <TableCell>{screening._count.questions}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(screening.status)}>
                        {screening.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(screening)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(screening.id, screening.status)}
                        >
                          {screening.status === "ACTIVE" ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(screening.id)}
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingScreening ? "Edit Screening" : "Create New Screening"}
              </DialogTitle>
              <DialogDescription>
                {editingScreening
                  ? "Update screening details and settings"
                  : "Set up a new admission screening"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Screening Name</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="e.g., ND Admission Screening 2024/2025"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="academicSessionId">Academic Session</Label>
                  <Select onValueChange={(value) => setValue("academicSessionId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select academic session" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicSessions.map((session) => (
                        <SelectItem key={session.id} value={session.id}>
                          {session.name} {session.isActive && "(Active)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.academicSessionId && (
                    <p className="text-sm text-red-600">{errors.academicSessionId.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      {...register("startDate", { valueAsDate: true })}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-red-600">{errors.startDate.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      {...register("endDate", { valueAsDate: true })}
                    />
                    {errors.endDate && (
                      <p className="text-sm text-red-600">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      {...register("duration", { valueAsNumber: true })}
                      placeholder="120"
                    />
                    {errors.duration && (
                      <p className="text-sm text-red-600">{errors.duration.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalMarks">Total Marks</Label>
                    <Input
                      id="totalMarks"
                      type="number"
                      {...register("totalMarks", { valueAsNumber: true })}
                      placeholder="100"
                    />
                    {errors.totalMarks && (
                      <p className="text-sm text-red-600">{errors.totalMarks.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passMarks">Pass Marks</Label>
                    <Input
                      id="passMarks"
                      type="number"
                      {...register("passMarks", { valueAsNumber: true })}
                      placeholder="40"
                    />
                    {errors.passMarks && (
                      <p className="text-sm text-red-600">{errors.passMarks.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    {...register("instructions")}
                    placeholder="Enter screening instructions for candidates..."
                    rows={3}
                  />
                  {errors.instructions && (
                    <p className="text-sm text-red-600">{errors.instructions.message}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingScreening ? "Update Screening" : "Create Screening"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}