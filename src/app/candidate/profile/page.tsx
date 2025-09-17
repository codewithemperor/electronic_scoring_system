"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  GraduationCap,
  Edit,
  Save,
  X,
  Loader2
} from "lucide-react"
import { CandidateLayout } from "@/components/layout/candidate-sidebar"

interface CandidateProfile {
  id: string
  firstName: string
  lastName: string
  middleName?: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  stateOfOrigin: string
  lga: string
  schoolName: string
  graduationYear: number
  olevelResults: any[]
  registrationNumber: string
  hasWritten: boolean
  totalScore?: number
  percentage?: number
  status: string
}

export default function CandidateProfile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    phone: "",
    stateOfOrigin: "",
    lga: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/candidate/login")
    }
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile()
    }
  }, [status])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/candidates/profile")
      
      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }
      
      const data = await response.json()
      setProfile(data)
      setFormData({
        phone: data.phone || "",
        stateOfOrigin: data.stateOfOrigin || "",
        lga: data.lga || ""
      })
    } catch (err) {
      console.error("Profile fetch error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch("/api/candidates/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
      setEditing(false)
    } catch (err) {
      console.error("Profile update error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading") {
    return (
      <CandidateLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </CandidateLayout>
    )
  }

  if (!session) {
    return null
  }

  if (loading) {
    return (
      <CandidateLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </CandidateLayout>
    )
  }

  if (!profile) {
    return (
      <CandidateLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Profile not found</p>
        </div>
      </CandidateLayout>
    )
  }

  return (
    <CandidateLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Profile
              </h1>
              <p className="text-gray-600 mt-2">
                View and manage your personal information
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-sm">
                {profile.registrationNumber}
              </Badge>
              <Badge variant={profile.status === "REGISTERED" ? "default" : "secondary"}>
                {profile.status}
              </Badge>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <X className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList>
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="academic">Academic Information</TabsTrigger>
            <TabsTrigger value="screening">Screening Status</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Your basic personal details
                    </CardDescription>
                  </div>
                  {!editing && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {editing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={profile.firstName} 
                          disabled 
                          className="bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={profile.lastName} 
                          disabled 
                          className="bg-gray-50"
                        />
                      </div>
                      {profile.middleName && (
                        <div>
                          <Label htmlFor="middleName">Middle Name</Label>
                          <Input 
                            id="middleName" 
                            value={profile.middleName} 
                            disabled 
                            className="bg-gray-50"
                          />
                        </div>
                      )}
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          value={profile.email} 
                          disabled 
                          className="bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input 
                          id="dateOfBirth" 
                          value={new Date(profile.dateOfBirth).toLocaleDateString()} 
                          disabled 
                          className="bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Input 
                          id="gender" 
                          value={profile.gender} 
                          disabled 
                          className="bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stateOfOrigin">State of Origin</Label>
                        <Input 
                          id="stateOfOrigin" 
                          value={formData.stateOfOrigin}
                          onChange={(e) => setFormData({...formData, stateOfOrigin: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lga">Local Government Area</Label>
                        <Input 
                          id="lga" 
                          value={formData.lga}
                          onChange={(e) => setFormData({...formData, lga: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">
                            {profile.firstName} {profile.middleName} {profile.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{profile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{profile.phone || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Date of Birth</p>
                          <p className="font-medium">
                            {new Date(profile.dateOfBirth).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">
                            {profile.stateOfOrigin}, {profile.lga}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="h-5 w-5 text-gray-400 flex items-center justify-center">
                          {profile.gender === "MALE" ? "M" : "F"}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="font-medium">{profile.gender}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic">
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>
                  Your educational background and qualifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">School Name</p>
                      <p className="font-medium">{profile.schoolName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Graduation Year</p>
                      <p className="font-medium">{profile.graduationYear}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">O'Level Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profile.olevelResults && profile.olevelResults.length > 0 ? (
                      profile.olevelResults.map((result: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3">
                          <p className="font-medium">{result.subject}</p>
                          <p className="text-sm text-gray-500">Grade: {result.grade}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No O'Level results available</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="screening">
            <Card>
              <CardHeader>
                <CardTitle>Screening Status</CardTitle>
                <CardDescription>
                  Your current screening status and performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Registration Number</p>
                      <p className="font-medium">{profile.registrationNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge variant={profile.status === "REGISTERED" ? "default" : "secondary"}>
                        {profile.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Test Taken</p>
                      <Badge variant={profile.hasWritten ? "default" : "secondary"}>
                        {profile.hasWritten ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {profile.hasWritten && profile.totalScore !== undefined && (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Total Score</p>
                          <p className="font-medium">{profile.totalScore}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Percentage</p>
                          <p className="font-medium">{profile.percentage}%</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CandidateLayout>
  )
}