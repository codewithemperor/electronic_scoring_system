'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Upload, 
  Edit, 
  Save,
  Camera,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export default function CandidateProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Mock profile data
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+234 801 234 5678',
    jambNumber: 'JAMB2025001',
    utmeScore: 245,
    birthDate: '2000-05-15',
    gender: 'Male',
    stateOfOrigin: 'Lagos',
    lga: 'Ikeja',
    address: '123, Adeola Odeku Street, Victoria Island, Lagos',
    passportPhoto: '/placeholder-avatar.jpg',
    profileCompletion: 75
  })

  const documents = [
    {
      id: 1,
      name: 'JAMB Result Slip',
      type: 'PDF',
      size: '245 KB',
      uploadDate: '2025-01-08',
      status: 'uploaded',
      url: '/documents/jamb-slip.pdf'
    },
    {
      id: 2,
      name: 'O\'Level Results',
      type: 'PDF',
      size: '1.2 MB',
      uploadDate: '2025-01-08',
      status: 'uploaded',
      url: '/documents/olevel-results.pdf'
    },
    {
      id: 3,
      name: 'Birth Certificate',
      type: 'PDF',
      size: '156 KB',
      uploadDate: null,
      status: 'pending',
      url: null
    },
    {
      id: 4,
      name: 'Local Government Certificate',
      type: 'PDF',
      size: '89 KB',
      uploadDate: null,
      status: 'pending',
      url: null
    },
    {
      id: 5,
      name: 'Passport Photograph',
      type: 'JPG',
      size: '45 KB',
      uploadDate: '2025-01-09',
      status: 'uploaded',
      url: '/documents/passport.jpg'
    }
  ]

  const states = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 
    'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 
    'Yobe', 'Zamfara'
  ]

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Save profile logic here
    setIsEditing(false)
    // Show success message
  }

  const handleFileUpload = (documentId: number, file: File) => {
    // Simulate file upload
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <Badge className="bg-green-100 text-green-800">Uploaded</Badge>
      case 'uploading':
        return <Badge className="bg-yellow-100 text-yellow-800">Uploading</Badge>
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and documents
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Profile Completion: {profile.profileCompletion}%
          </Badge>
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="academic">Academic Information</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Photo */}
                <div className="md:col-span-2 flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile.passportPhoto} alt="Profile" />
                      <AvatarFallback className="text-lg">
                        {profile.firstName[0]}{profile.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Profile Photo</h3>
                    <p className="text-sm text-gray-500">
                      Upload a recent passport photograph
                    </p>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="birthDate">Date of Birth</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={profile.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => handleInputChange('gender', value)} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue placeholder={profile.gender} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="stateOfOrigin">State of Origin</Label>
                    <Select onValueChange={(value) => handleInputChange('stateOfOrigin', value)} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue placeholder={profile.stateOfOrigin} />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="lga">Local Government Area</Label>
                    <Input
                      id="lga"
                      value={profile.lga}
                      onChange={(e) => handleInputChange('lga', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <Label htmlFor="address">Residential Address</Label>
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
              <CardDescription>
                Your academic details and examination information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="jambNumber">JAMB Registration Number</Label>
                    <Input
                      id="jambNumber"
                      value={profile.jambNumber}
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">JAMB number cannot be changed</p>
                  </div>
                  <div>
                    <Label htmlFor="utmeScore">UTME Score</Label>
                    <Input
                      id="utmeScore"
                      type="number"
                      value={profile.utmeScore}
                      onChange={(e) => handleInputChange('utmeScore', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-medium mb-2">Profile Completion</h4>
                    <Progress value={profile.profileCompletion} className="h-2 mb-2" />
                    <p className="text-sm text-gray-600">
                      {profile.profileCompletion}% complete
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>Personal Information</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>Academic Details</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                        <span>Document Upload (2 pending)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>
                Upload all required documents for your screening process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{doc.type}</span>
                          <span>{doc.size}</span>
                          {doc.uploadDate && (
                            <span>Uploaded: {doc.uploadDate}</span>
                          )}
                        </div>
                        {uploadProgress > 0 && doc.status === 'uploading' && (
                          <div className="mt-2">
                            <Progress value={uploadProgress} className="h-2 w-48" />
                            <span className="text-xs text-gray-500">{uploadProgress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(doc.status)}
                      {doc.status === 'uploaded' ? (
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      ) : (
                        <Button size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 border rounded-lg bg-blue-50">
                <h4 className="font-medium text-blue-900 mb-2">Document Requirements</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• All documents must be in PDF or JPG format</li>
                  <li>• Maximum file size: 5MB per document</li>
                  <li>• Ensure all documents are clear and legible</li>
                  <li>• Passport photo must be recent and on white background</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}