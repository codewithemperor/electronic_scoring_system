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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  Building, 
  BookOpen,
  Users,
  ToggleLeft,
  ToggleRight,
  Save,
  X
} from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface Department {
  id: string
  name: string
  code: string
  description: string | null
  isActive: boolean
  programs: Program[]
}

interface Program {
  id: string
  name: string
  code: string
  level: string
  cutOffMark: number
  maxCapacity: number
  isActive: boolean
  departmentId: string
}

interface SystemConfig {
  id: string
  key: string
  value: string
  description: string | null
}

interface AcademicSession {
  id: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
}

export default function AdminSettingsPage() {
  const { data: session } = useSession()
  const [departments, setDepartments] = useState<Department[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [systemConfigs, setSystemConfigs] = useState<SystemConfig[]>([])
  const [academicSessions, setAcademicSessions] = useState<AcademicSession[]>([])
  const [loading, setLoading] = useState(true)
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false)
  const [isProgramDialogOpen, setIsProgramDialogOpen] = useState(false)
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [editingSession, setEditingSession] = useState<AcademicSession | null>(null)

  const {
    register: registerDepartment,
    handleSubmit: handleDepartmentSubmit,
    reset: resetDepartment,
    setValue: setDepartmentValue,
    formState: { errors: departmentErrors },
  } = useForm()

  const {
    register: registerProgram,
    handleSubmit: handleProgramSubmit,
    reset: resetProgram,
    setValue: setProgramValue,
    formState: { errors: programErrors },
  } = useForm()

  const {
    register: registerSession,
    handleSubmit: handleSessionSubmit,
    reset: resetSession,
    setValue: setSessionValue,
    formState: { errors: sessionErrors },
  } = useForm()

  useEffect(() => {
    fetchDepartments()
    fetchPrograms()
    fetchSystemConfigs()
    fetchAcademicSessions()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments")
      if (response.ok) {
        const data = await response.json()
        setDepartments(data)
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/programs")
      if (response.ok) {
        const data = await response.json()
        setPrograms(data)
      }
    } catch (error) {
      console.error("Failed to fetch programs:", error)
    }
  }

  const fetchSystemConfigs = async () => {
    try {
      const response = await fetch("/api/system-configs")
      if (response.ok) {
        const data = await response.json()
        setSystemConfigs(data)
      }
    } catch (error) {
      console.error("Failed to fetch system configs:", error)
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

  const onDepartmentSubmit = async (data: any) => {
    try {
      const url = editingDepartment ? `/api/departments/${editingDepartment.id}` : "/api/departments"
      const method = editingDepartment ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(`Department ${editingDepartment ? "updated" : "created"} successfully`)
        setIsDepartmentDialogOpen(false)
        resetDepartment()
        setEditingDepartment(null)
        fetchDepartments()
      } else {
        toast.error("Failed to save department")
      }
    } catch (error) {
      console.error("Failed to save department:", error)
      toast.error("An error occurred")
    }
  }

  const onProgramSubmit = async (data: any) => {
    try {
      const url = editingProgram ? `/api/programs/${editingProgram.id}` : "/api/programs"
      const method = editingProgram ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(`Program ${editingProgram ? "updated" : "created"} successfully`)
        setIsProgramDialogOpen(false)
        resetProgram()
        setEditingProgram(null)
        fetchPrograms()
      } else {
        toast.error("Failed to save program")
      }
    } catch (error) {
      console.error("Failed to save program:", error)
      toast.error("An error occurred")
    }
  }

  const onSessionSubmit = async (data: any) => {
    try {
      const url = editingSession ? `/api/academic-sessions/${editingSession.id}` : "/api/academic-sessions"
      const method = editingSession ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(`Academic session ${editingSession ? "updated" : "created"} successfully`)
        setIsSessionDialogOpen(false)
        resetSession()
        setEditingSession(null)
        fetchAcademicSessions()
      } else {
        toast.error("Failed to save academic session")
      }
    } catch (error) {
      console.error("Failed to save academic session:", error)
      toast.error("An error occurred")
    }
  }

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department)
    setDepartmentValue("name", department.name)
    setDepartmentValue("code", department.code)
    setDepartmentValue("description", department.description || "")
    setIsDepartmentDialogOpen(true)
  }

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program)
    setProgramValue("name", program.name)
    setProgramValue("code", program.code)
    setProgramValue("level", program.level)
    setProgramValue("departmentId", program.departmentId)
    setProgramValue("cutOffMark", program.cutOffMark)
    setProgramValue("maxCapacity", program.maxCapacity)
    setIsProgramDialogOpen(true)
  }

  const handleEditSession = (session: AcademicSession) => {
    setEditingSession(session)
    setSessionValue("name", session.name)
    setSessionValue("startDate", session.startDate.split('T')[0])
    setSessionValue("endDate", session.endDate.split('T')[0])
    setIsSessionDialogOpen(true)
  }

  const handleToggleDepartmentStatus = async (departmentId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/departments/${departmentId}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        toast.success(`Department ${!currentStatus ? "activated" : "deactivated"} successfully`)
        fetchDepartments()
      } else {
        toast.error("Failed to update department status")
      }
    } catch (error) {
      console.error("Failed to update department status:", error)
      toast.error("An error occurred")
    }
  }

  const handleToggleProgramStatus = async (programId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/programs/${programId}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        toast.success(`Program ${!currentStatus ? "activated" : "deactivated"} successfully`)
        fetchPrograms()
      } else {
        toast.error("Failed to update program status")
      }
    } catch (error) {
      console.error("Failed to update program status:", error)
      toast.error("An error occurred")
    }
  }

  const handleToggleSessionStatus = async (sessionId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/academic-sessions/${sessionId}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        toast.success(`Academic session ${!currentStatus ? "activated" : "deactivated"} successfully`)
        fetchAcademicSessions()
      } else {
        toast.error("Failed to update academic session status")
      }
    } catch (error) {
      console.error("Failed to update academic session status:", error)
      toast.error("An error occurred")
    }
  }

  const openDepartmentDialog = () => {
    setEditingDepartment(null)
    resetDepartment()
    setIsDepartmentDialogOpen(true)
  }

  const openProgramDialog = () => {
    setEditingProgram(null)
    resetProgram()
    setIsProgramDialogOpen(true)
  }

  const openSessionDialog = () => {
    setEditingSession(null)
    resetSession()
    setIsSessionDialogOpen(true)
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
            <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage departments, programs, and system configuration
            </p>
          </div>
        </div>

        <Tabs defaultValue="departments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="sessions">Academic Sessions</TabsTrigger>
            <TabsTrigger value="system">System Config</TabsTrigger>
          </TabsList>

          <TabsContent value="departments" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5" />
                      <span>Departments</span>
                    </CardTitle>
                    <CardDescription>
                      Manage academic departments and their programs
                    </CardDescription>
                  </div>
                  <Button onClick={openDepartmentDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Department
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Programs</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((department) => (
                      <TableRow key={department.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{department.name}</div>
                            {department.description && (
                              <div className="text-sm text-gray-500">{department.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{department.code}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{department.programs.length}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={department.isActive ? "default" : "secondary"}>
                            <div className="flex items-center space-x-1">
                              {department.isActive ? (
                                <ToggleRight className="h-4 w-4" />
                              ) : (
                                <ToggleLeft className="h-4 w-4" />
                              )}
                              <span>{department.isActive ? "Active" : "Inactive"}</span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditDepartment(department)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleDepartmentStatus(department.id, department.isActive)}
                            >
                              {department.isActive ? (
                                <ToggleRight className="h-4 w-4" />
                              ) : (
                                <ToggleLeft className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {departments.length === 0 && (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
                    <p className="text-gray-500 mb-4">Create your first department to get started</p>
                    <Button onClick={openDepartmentDialog}>
                      Add Department
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>Programs</span>
                    </CardTitle>
                    <CardDescription>
                      Manage academic programs and their settings
                    </CardDescription>
                  </div>
                  <Button onClick={openProgramDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Program
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Cut-off Mark</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programs.map((program) => (
                      <TableRow key={program.id}>
                        <TableCell className="font-medium">{program.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{program.code}</Badge>
                        </TableCell>
                        <TableCell>{program.level}</TableCell>
                        <TableCell>{program.cutOffMark}</TableCell>
                        <TableCell>{program.maxCapacity}</TableCell>
                        <TableCell>
                          <Badge variant={program.isActive ? "default" : "secondary"}>
                            <div className="flex items-center space-x-1">
                              {program.isActive ? (
                                <ToggleRight className="h-4 w-4" />
                              ) : (
                                <ToggleLeft className="h-4 w-4" />
                              )}
                              <span>{program.isActive ? "Active" : "Inactive"}</span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditProgram(program)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleProgramStatus(program.id, program.isActive)}
                            >
                              {program.isActive ? (
                                <ToggleRight className="h-4 w-4" />
                              ) : (
                                <ToggleLeft className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {programs.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
                    <p className="text-gray-500 mb-4">Create your first program to get started</p>
                    <Button onClick={openProgramDialog}>
                      Add Program
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>Academic Sessions</span>
                    </CardTitle>
                    <CardDescription>
                      Manage academic sessions and their time periods
                    </CardDescription>
                  </div>
                  <Button onClick={openSessionDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Session
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {academicSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.name}</TableCell>
                        <TableCell>{new Date(session.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(session.endDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={session.isActive ? "default" : "secondary"}>
                            <div className="flex items-center space-x-1">
                              {session.isActive ? (
                                <ToggleRight className="h-4 w-4" />
                              ) : (
                                <ToggleLeft className="h-4 w-4" />
                              )}
                              <span>{session.isActive ? "Active" : "Inactive"}</span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditSession(session)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleSessionStatus(session.id, session.isActive)}
                            >
                              {session.isActive ? (
                                <ToggleRight className="h-4 w-4" />
                              ) : (
                                <ToggleLeft className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {academicSessions.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No academic sessions found</h3>
                    <p className="text-gray-500 mb-4">Create your first academic session to get started</p>
                    <Button onClick={openSessionDialog}>
                      Add Session
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>System Configuration</span>
                </CardTitle>
                <CardDescription>
                  Manage system-wide settings and configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemConfigs.map((config) => (
                    <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{config.key}</div>
                        {config.description && (
                          <div className="text-sm text-gray-500">{config.description}</div>
                        )}
                        <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                          {config.value}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {systemConfigs.length === 0 && (
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No system configurations found</h3>
                      <p className="text-gray-500">System configurations will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Department Dialog */}
        <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? "Edit Department" : "Add New Department"}
              </DialogTitle>
              <DialogDescription>
                {editingDepartment
                  ? "Update department information"
                  : "Create a new academic department"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleDepartmentSubmit(onDepartmentSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name *</Label>
                  <Input
                    id="name"
                    {...registerDepartment("name", { required: "Department name is required" })}
                    placeholder="e.g., Computer Science"
                  />
                  {departmentErrors.name && (
                    <p className="text-sm text-red-600">{departmentErrors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Department Code *</Label>
                  <Input
                    id="code"
                    {...registerDepartment("code", { required: "Department code is required" })}
                    placeholder="e.g., CST"
                  />
                  {departmentErrors.code && (
                    <p className="text-sm text-red-600">{departmentErrors.code.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...registerDepartment("description")}
                    placeholder="Department description (optional)"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDepartmentDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingDepartment ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Program Dialog */}
        <Dialog open={isProgramDialogOpen} onOpenChange={setIsProgramDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? "Edit Program" : "Add New Program"}
              </DialogTitle>
              <DialogDescription>
                {editingProgram
                  ? "Update program information"
                  : "Create a new academic program"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleProgramSubmit(onProgramSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Program Name *</Label>
                  <Input
                    id="name"
                    {...registerProgram("name", { required: "Program name is required" })}
                    placeholder="e.g., Computer Science Technology"
                  />
                  {programErrors.name && (
                    <p className="text-sm text-red-600">{programErrors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Program Code *</Label>
                  <Input
                    id="code"
                    {...registerProgram("code", { required: "Program code is required" })}
                    placeholder="e.g., CST"
                  />
                  {programErrors.code && (
                    <p className="text-sm text-red-600">{programErrors.code.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Level *</Label>
                    <select
                      id="level"
                      {...registerProgram("level", { required: "Level is required" })}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="">Select level</option>
                      <option value="ND">National Diploma</option>
                      <option value="HND">Higher National Diploma</option>
                    </select>
                    {programErrors.level && (
                      <p className="text-sm text-red-600">{programErrors.level.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departmentId">Department *</Label>
                    <select
                      id="departmentId"
                      {...registerProgram("departmentId", { required: "Department is required" })}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    {programErrors.departmentId && (
                      <p className="text-sm text-red-600">{programErrors.departmentId.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cutOffMark">Cut-off Mark *</Label>
                    <Input
                      id="cutOffMark"
                      type="number"
                      {...registerProgram("cutOffMark", { 
                        required: "Cut-off mark is required",
                        min: { value: 0, message: "Cut-off mark must be at least 0" },
                        max: { value: 100, message: "Cut-off mark must be at most 100" }
                      })}
                      placeholder="40"
                    />
                    {programErrors.cutOffMark && (
                      <p className="text-sm text-red-600">{programErrors.cutOffMark.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxCapacity">Max Capacity *</Label>
                    <Input
                      id="maxCapacity"
                      type="number"
                      {...registerProgram("maxCapacity", { 
                        required: "Max capacity is required",
                        min: { value: 1, message: "Max capacity must be at least 1" }
                      })}
                      placeholder="50"
                    />
                    {programErrors.maxCapacity && (
                      <p className="text-sm text-red-600">{programErrors.maxCapacity.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsProgramDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingProgram ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Session Dialog */}
        <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingSession ? "Edit Academic Session" : "Add New Academic Session"}
              </DialogTitle>
              <DialogDescription>
                {editingSession 
                  ? "Update the academic session information"
                  : "Create a new academic session"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSessionSubmit(onSessionSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Session Name *</Label>
                  <Input
                    id="name"
                    {...registerSession("name", { required: "Session name is required" })}
                    placeholder="e.g., 2024/2025"
                  />
                  {sessionErrors.name && (
                    <p className="text-sm text-red-600">{sessionErrors.name.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      {...registerSession("startDate", { required: "Start date is required" })}
                    />
                    {sessionErrors.startDate && (
                      <p className="text-sm text-red-600">{sessionErrors.startDate.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      {...registerSession("endDate", { required: "End date is required" })}
                    />
                    {sessionErrors.endDate && (
                      <p className="text-sm text-red-600">{sessionErrors.endDate.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsSessionDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingSession ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}