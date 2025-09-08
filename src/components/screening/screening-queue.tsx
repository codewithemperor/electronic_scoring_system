"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  Clock, 
  Play, 
  CheckCircle, 
  AlertTriangle,
  User,
  GraduationCap,
  Star
} from "lucide-react"

interface Candidate {
  id: string
  applicationNumber: string
  firstName: string
  lastName: string
  email: string
  program: string
  utmeScore: number
  screeningStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "APPROVED" | "REJECTED"
  registeredAt: string
  priority?: "HIGH" | "MEDIUM" | "LOW"
}

interface ScreeningQueueProps {
  candidates: Candidate[]
  onStartScreening: (candidate: Candidate) => void
  onViewCandidate: (candidate: Candidate) => void
  isLoading?: boolean
}

export function ScreeningQueue({ 
  candidates, 
  onStartScreening, 
  onViewCandidate, 
  isLoading = false 
}: ScreeningQueueProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("PENDING")
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL")

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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800"
      case "LOW":
        return "bg-green-100 text-green-800"
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
    const matchesPriority = priorityFilter === "ALL" || candidate.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getQueueStats = () => {
    const total = candidates.length
    const pending = candidates.filter(c => c.screeningStatus === "PENDING").length
    const inProgress = candidates.filter(c => c.screeningStatus === "IN_PROGRESS").length
    const completed = candidates.filter(c => c.screeningStatus === "COMPLETED").length
    
    return { total, pending, inProgress, completed }
  }

  const stats = getQueueStats()

  return (
    <div className="space-y-6">
      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Queue</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Play className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Screening Queue
          </CardTitle>
          <CardDescription>
            Candidates waiting for screening evaluation
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Priority</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Candidates List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading candidates...</div>
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <div className="text-gray-500">
                  {searchTerm || statusFilter !== "ALL" || priorityFilter !== "ALL" 
                    ? "No candidates found matching your filters" 
                    : "No candidates in queue"
                  }
                </div>
              </div>
            ) : (
              filteredCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar>
                      <AvatarImage src={`/placeholder-${candidate.id}.jpg`} />
                      <AvatarFallback>
                        {candidate.firstName[0]}{candidate.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {candidate.firstName} {candidate.lastName}
                        </h4>
                        <Badge className={getStatusColor(candidate.screeningStatus)}>
                          {candidate.screeningStatus.replace("_", " ")}
                        </Badge>
                        {candidate.priority && (
                          <Badge className={getPriorityColor(candidate.priority)}>
                            {candidate.priority}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {candidate.applicationNumber}
                        </span>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {candidate.program}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {candidate.utmeScore}/400
                        </div>
                        <span>•</span>
                        <span>{new Date(candidate.registeredAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewCandidate(candidate)}
                      className="flex items-center gap-1"
                    >
                      <User className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onStartScreening(candidate)}
                      className="flex items-center gap-1"
                      disabled={candidate.screeningStatus === "IN_PROGRESS"}
                    >
                      <Play className="h-4 w-4" />
                      {candidate.screeningStatus === "IN_PROGRESS" ? "Screening..." : "Start Screening"}
                    </Button>
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