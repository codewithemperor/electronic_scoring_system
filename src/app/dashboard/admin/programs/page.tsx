'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  BookOpen, 
  Building2,
  Calendar,
  Target,
  TrendingUp,
  Filter,
  MoreHorizontal,
  Settings
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export default function AdminProgramsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState(null)

  // Mock programs data
  const programs = [
    {
      id: 'PROG001',
      name: 'Computer Science',
      code: 'CS',
      department: 'Computing & Information Technology',
      duration: 4,
      capacity: 120,
      currentApplicants: 156,
      description: 'Bachelor of Technology in Computer Science',
      requirements: 'UTME: 200, O\'Level: 5 credits including Maths & English',
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: 'PROG002',
      name: 'Electrical Engineering',
      code: 'EE',
      department: 'Engineering Technology',
      duration: 4,
      capacity: 80,
      currentApplicants: 98,
      description: 'Bachelor of Engineering in Electrical Engineering',
      requirements: 'UTME: 200, O\'Level: 5 credits including Maths, Physics & English',
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: 'PROG003',
      name: 'Business Administration',
      code: 'BA',
      department: 'Management Sciences',
      duration: 4,
      capacity: 150,
      currentApplicants: 189,
      description: 'Bachelor of Science in Business Administration',
      requirements: 'UTME: 180, O\'Level: 5 credits including Maths & English',
      isActive: true,
      createdAt: '2025-01-01'
    },
    {
      id: 'PROG004',
      name: 'Mass Communication',
      code: 'MC',
      department: 'Communication & Media Studies',
      duration: 4,
      capacity: 100,
      currentApplicants: 87,
      description: 'Bachelor of Science in Mass Communication',
      requirements: 'UTME: 180, O\'Level: 5 credits including English & Literature',
      isActive: true,
      createdAt: '2025-01-01'
    }
  ]

  const departments = [
    'Computing & Information Technology',
    'Engineering Technology',
    'Management Sciences',
    'Communication & Media Studies'
  ]

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getUtilizationRate = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100)
  }

  const getUtilizationBadge = (rate: number) => {
    if (rate >= 90) return <Badge className="bg-red-100 text-red-800">High Demand</Badge>
    if (rate >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Moderate</Badge>
    return <Badge className="bg-green-100 text-green-800">Available</Badge>
  }

  const handleAddProgram = (programData: any) => {
    // Handle add program logic
    console.log('Adding program:', programData)
    setIsAddDialogOpen(false)
  }

  const handleEditProgram = (program: any) => {
    setEditingProgram(program)
    setIsAddDialogOpen(true)
  }

  const handleDeleteProgram = (programId: string) => {
    // Handle delete program logic
    console.log('Deleting program:', programId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Program Management</h1>
          <p className="text-muted-foreground">
            Manage academic programs and track application statistics
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? 'Edit Program' : 'Add New Program'}
              </DialogTitle>
              <DialogDescription>
                {editingProgram 
                  ? 'Update program information and settings'
                  : 'Create a new academic program'
                }
              </DialogDescription>
            </DialogHeader>
            <ProgramForm 
              onSubmit={handleAddProgram} 
              initialData={editingProgram}
              departments={departments}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{programs.length}</p>
                <p className="text-xs text-muted-foreground">Total Programs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {programs.reduce((sum, prog) => sum + prog.currentApplicants, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Applicants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Target className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {programs.reduce((sum, prog) => sum + prog.capacity, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Capacity</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(programs.reduce((sum, prog) => sum + getUtilizationRate(prog.currentApplicants, prog.capacity), 0) / programs.length)}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Utilization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Programs List */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Programs</CardTitle>
          <CardDescription>
            View and manage all academic programs in your department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="space-y-4">
            {filteredPrograms.map((program) => {
              const utilizationRate = getUtilizationRate(program.currentApplicants, program.capacity)
              
              return (
                <div key={program.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{program.name}</h3>
                        <Badge variant="outline">{program.code}</Badge>
                        {program.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                      <p className="text-sm text-gray-600 mb-4">
                        <Building2 className="w-4 h-4 inline mr-1" />
                        {program.department}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium">{program.duration} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Capacity</p>
                          <p className="font-medium">{program.capacity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Applicants</p>
                          <p className="font-medium">{program.currentApplicants}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Utilization</p>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{utilizationRate}%</span>
                            {getUtilizationBadge(utilizationRate)}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="font-medium mb-1">Requirements:</h4>
                        <p className="text-sm text-gray-600">{program.requirements}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleEditProgram(program)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteProgram(program.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Program Form Component
function ProgramForm({ onSubmit, initialData, departments }: any) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    code: initialData?.code || '',
    department: initialData?.department || '',
    duration: initialData?.duration || 4,
    capacity: initialData?.capacity || 100,
    description: initialData?.description || '',
    requirements: initialData?.requirements || '',
    isActive: initialData?.isActive ?? true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Program Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="code">Program Code</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => handleInputChange('code', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="department">Department</Label>
        <Select onValueChange={(value) => handleInputChange('department', value)} value={formData.department}>
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept: string) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duration (years)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            max="10"
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
            required
          />
        </div>
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          required
        />
      </div>

      <div>
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          value={formData.requirements}
          onChange={(e) => handleInputChange('requirements', e.target.value)}
          rows={2}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
        />
        <Label htmlFor="isActive">Program is active</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => onSubmit(null)}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Program' : 'Create Program'}
        </Button>
      </div>
    </form>
  )
}