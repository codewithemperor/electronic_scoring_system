"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  UserPlus,
  Calendar,
  MapPin,
  GraduationCap
} from "lucide-react"

interface Candidate {
  id: string
  applicationNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  program: string
  utmeScore: number
  screeningStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "APPROVED" | "REJECTED" | "SHORTLISTED"
  totalScore?: number
  createdAt: string
}

interface CandidatesListProps {
  candidates: Candidate[]
  onView: (candidate: Candidate) => void
  onEdit: (candidate: Candidate) => void
  onDelete: (candidateId: string) => void
  onAddNew: () => void
  isLoading?: boolean
}

export function CandidatesList({ 
  candidates, 
  onView, 
  onEdit, 
  onDelete, 
  onAddNew, 
  isLoading = false 
}: CandidatesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [programFilter, setProgramFilter] = useState<string>("ALL")

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
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "ALL" || candidate.screeningStatus === statusFilter
    const matchesProgram = programFilter === "ALL" || candidate.program === programFilter
    
    return matchesSearch && matchesStatus && matchesProgram
  })

  const uniquePrograms = Array.from(new Set(candidates.map(c => c.program)))

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              Candidates Management
            </CardTitle>
            <CardDescription>
              Manage and view all registered candidates
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onAddNew} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Candidate
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Programs</SelectItem>
                {uniquePrograms.map(program => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Application No.</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>UTME Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-gray-500">Loading candidates...</div>
                  </TableCell>
                </TableRow>
              ) : filteredCandidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-gray-500">
                      {searchTerm || statusFilter !== "ALL" || programFilter !== "ALL" 
                        ? "No candidates found matching your filters" 
                        : "No candidates registered yet"
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`/placeholder-${candidate.id}.jpg`} />
                          <AvatarFallback>
                            {candidate.firstName[0]}{candidate.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {candidate.firstName} {candidate.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {candidate.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {candidate.applicationNumber}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{candidate.program}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{candidate.utmeScore}</span>
                        <span className="text-xs text-gray-500">/400</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(candidate.screeningStatus)}>
                        {candidate.screeningStatus.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(candidate.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(candidate)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(candidate)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(candidate.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Total Candidates:</span> {candidates.length}
            </div>
            <div>
              <span className="font-medium">Filtered:</span> {filteredCandidates.length}
            </div>
            <div>
              <span className="font-medium">Pending:</span> {candidates.filter(c => c.screeningStatus === "PENDING").length}
            </div>
            <div>
              <span className="font-medium">Completed:</span> {candidates.filter(c => c.screeningStatus === "COMPLETED").length}
            </div>
            <div>
              <span className="font-medium">Approved:</span> {candidates.filter(c => c.screeningStatus === "APPROVED").length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}