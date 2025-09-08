"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Mail, 
  Phone, 
  MapPin,
  GraduationCap,
  Star,
  Calendar,
  User,
  X
} from "lucide-react"

interface Candidate {
  id: string
  applicationNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  program: string
  department: string
  faculty: string
  utmeScore: number
  screeningStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "APPROVED" | "REJECTED" | "SHORTLISTED"
  totalScore?: number
  state: string
  lga: string
  gender: string
  registeredAt: string
  lastUpdated: string
}

interface AdvancedSearchProps {
  candidates: Candidate[]
  onExport: (selectedCandidates: string[]) => void
  onView: (candidate: Candidate) => void
  onEdit: (candidate: Candidate) => void
  isLoading?: boolean
}

export function AdvancedSearch({ 
  candidates, 
  onExport, 
  onView, 
  onEdit, 
  isLoading = false 
}: AdvancedSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState({
    program: "",
    department: "",
    faculty: "",
    status: "",
    state: "",
    gender: "",
    utmeScoreMin: "",
    utmeScoreMax: "",
    dateFrom: "",
    dateTo: ""
  })
  const [showFilters, setShowFilters] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "APPROVED":
        return "bg-purple-100 text-purple-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      case "SHORTLISTED":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.phone.includes(searchTerm)

    const matchesProgram = !filters.program || candidate.program === filters.program
    const matchesDepartment = !filters.department || candidate.department === filters.department
    const matchesFaculty = !filters.faculty || candidate.faculty === filters.faculty
    const matchesStatus = !filters.status || candidate.screeningStatus === filters.status
    const matchesState = !filters.state || candidate.state === filters.state
    const matchesGender = !filters.gender || candidate.gender === filters.gender
    
    const matchesUtmeScore = 
      (!filters.utmeScoreMin || candidate.utmeScore >= Number(filters.utmeScoreMin)) &&
      (!filters.utmeScoreMax || candidate.utmeScore <= Number(filters.utmeScoreMax))
    
    const matchesDate = 
      (!filters.dateFrom || new Date(candidate.registeredAt) >= new Date(filters.dateFrom)) &&
      (!filters.dateTo || new Date(candidate.registeredAt) <= new Date(filters.dateTo))

    return matchesSearch && matchesProgram && matchesDepartment && matchesFaculty && 
           matchesStatus && matchesState && matchesGender && matchesUtmeScore && matchesDate
  })

  const handleSelectCandidate = (candidateId: string) => {
    const newSelected = new Set(selectedCandidates)
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId)
    } else {
      newSelected.add(candidateId)
    }
    setSelectedCandidates(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedCandidates.size === filteredCandidates.length) {
      setSelectedCandidates(new Set())
    } else {
      setSelectedCandidates(new Set(filteredCandidates.map(c => c.id)))
    }
  }

  const clearFilters = () => {
    setFilters({
      program: "",
      department: "",
      faculty: "",
      status: "",
      state: "",
      gender: "",
      utmeScoreMin: "",
      utmeScoreMax: "",
      dateFrom: "",
      dateTo: ""
    })
    setSearchTerm("")
  }

  const uniquePrograms = Array.from(new Set(candidates.map(c => c.program)))
  const uniqueDepartments = Array.from(new Set(candidates.map(c => c.department)))
  const uniqueFaculties = Array.from(new Set(candidates.map(c => c.faculty)))
  const uniqueStates = Array.from(new Set(candidates.map(c => c.state)))

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Advanced Candidate Search
          </CardTitle>
          <CardDescription>
            Search and filter candidates with advanced criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, application number, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Filter Options</h4>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium">Program</Label>
                  <Select value={filters.program} onValueChange={(value) => setFilters({...filters, program: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Programs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Programs</SelectItem>
                      {uniquePrograms.map(program => (
                        <SelectItem key={program} value={program}>{program}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <Select value={filters.department} onValueChange={(value) => setFilters({...filters, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Departments</SelectItem>
                      {uniqueDepartments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Faculty</Label>
                  <Select value={filters.faculty} onValueChange={(value) => setFilters({...filters, faculty: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Faculties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Faculties</SelectItem>
                      {uniqueFaculties.map(faculty => (
                        <SelectItem key={faculty} value={faculty}>{faculty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">State</Label>
                  <Select value={filters.state} onValueChange={(value) => setFilters({...filters, state: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All States" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All States</SelectItem>
                      {uniqueStates.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Gender</Label>
                  <Select value={filters.gender} onValueChange={(value) => setFilters({...filters, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Genders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Genders</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">UTME Score Min</Label>
                  <Input
                    type="number"
                    placeholder="Min score"
                    value={filters.utmeScoreMin}
                    onChange={(e) => setFilters({...filters, utmeScoreMin: e.target.value})}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">UTME Score Max</Label>
                  <Input
                    type="number"
                    placeholder="Max score"
                    value={filters.utmeScoreMax}
                    onChange={(e) => setFilters({...filters, utmeScoreMax: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Found {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {selectedCandidates.size > 0 && (
                <Button
                  variant="outline"
                  onClick={() => onExport(Array.from(selectedCandidates))}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Selected ({selectedCandidates.size})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Select All Checkbox */}
          {filteredCandidates.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
              <Checkbox
                id="select-all"
                checked={selectedCandidates.size === filteredCandidates.length}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="text-sm font-medium">
                Select all {filteredCandidates.length} candidates
              </Label>
            </div>
          )}

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="text-gray-500">Loading candidates...</div>
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <div className="text-gray-500">
                  No candidates found matching your search criteria
                </div>
              </div>
            ) : (
              filteredCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedCandidates.has(candidate.id)}
                      onCheckedChange={() => handleSelectCandidate(candidate.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={`/placeholder-${candidate.id}.jpg`} />
                            <AvatarFallback>
                              {candidate.firstName[0]}{candidate.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {candidate.firstName} {candidate.lastName}
                            </h4>
                            <p className="text-xs text-gray-600">{candidate.applicationNumber}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(candidate.screeningStatus)}>
                          {candidate.screeningStatus.replace("_", " ")}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {candidate.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {candidate.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {candidate.program}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          UTME: {candidate.utmeScore}/400
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {candidate.state}, {candidate.lga}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Registered: {new Date(candidate.registeredAt).toLocaleDateString()}
                        </div>
                      </div>

                      {candidate.totalScore && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Total Score:</span>
                            <span className="text-sm font-bold text-green-600">
                              {candidate.totalScore.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onView(candidate)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(candidate)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}