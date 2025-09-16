"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Upload } from "lucide-react"
import { candidateRegistrationSchema, type CandidateRegistrationInput } from "@/lib/validations"
import { toast } from "sonner"

interface OLevelResult {
  subject: string
  grade: string
  examType: string
  year: number
}

interface Program {
  id: string
  name: string
  code: string
  level: string
  department: {
    name: string
  }
}

interface Screening {
  id: string
  name: string
  status: string
  startDate: string
  endDate: string
}

export default function CandidateRegistrationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [programs, setPrograms] = useState<Program[]>([])
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [olevelResults, setOlevelResults] = useState<OLevelResult[]>([
    { subject: "", grade: "", examType: "WAEC", year: new Date().getFullYear() }
  ])

  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CandidateRegistrationInput>({
    resolver: zodResolver(candidateRegistrationSchema),
  })

  const watchedProgramId = watch("programId")
  const watchedScreeningId = watch("screeningId")

  useState(() => {
    fetchPrograms()
    fetchScreenings()
  })

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/programs")
      if (response.ok) {
        const data = await response.json()
        setPrograms(data.filter((p: Program) => p.isActive))
      }
    } catch (error) {
      console.error("Failed to fetch programs:", error)
    }
  }

  const fetchScreenings = async () => {
    try {
      const response = await fetch("/api/screenings/active")
      if (response.ok) {
        const data = await response.json()
        setScreenings(data)
      }
    } catch (error) {
      console.error("Failed to fetch screenings:", error)
    }
  }

  const addOlevelResult = () => {
    setOlevelResults([
      ...olevelResults,
      { subject: "", grade: "", examType: "WAEC", year: new Date().getFullYear() }
    ])
  }

  const removeOlevelResult = (index: number) => {
    if (olevelResults.length > 1) {
      setOlevelResults(olevelResults.filter((_, i) => i !== index))
    }
  }

  const updateOlevelResult = (index: number, field: keyof OLevelResult, value: string | number) => {
    const updatedResults = [...olevelResults]
    updatedResults[index] = { ...updatedResults[index], [field]: value }
    setOlevelResults(updatedResults)
  }

  const onSubmit = async (data: CandidateRegistrationInput) => {
    setIsLoading(true)
    setError("")

    try {
      // Add O'Level results to form data
      const formData = {
        ...data,
        olevelResults,
      }

      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        
        // Store registration data in sessionStorage for success page
        sessionStorage.setItem('registrationData', JSON.stringify(result))
        
        toast.success("Registration successful! Your registration number is: " + result.registrationNumber)
        router.push("/candidate/success")
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Registration failed")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError("An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  const grades = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"]
  const examTypes = ["WAEC", "NECO", "NABTEB"]
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Candidate Registration
          </h1>
          <p className="text-gray-600">
            Adeseun Ogundoyin Polytechnic Eruwa - Admission Screening
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Please fill in your personal details accurately
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    {...register("middleName")}
                    placeholder="Middle name (optional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="08012345678"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth", { valueAsDate: true })}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select onValueChange={(value) => setValue("gender", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-sm text-red-600">{errors.gender.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">State of Origin *</Label>
                  <Input
                    id="stateOfOrigin"
                    {...register("stateOfOrigin")}
                    placeholder="State of origin"
                  />
                  {errors.stateOfOrigin && (
                    <p className="text-sm text-red-600">{errors.stateOfOrigin.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lga">Local Government Area *</Label>
                <Input
                  id="lga"
                  {...register("lga")}
                  placeholder="Local Government Area"
                />
                {errors.lga && (
                  <p className="text-sm text-red-600">{errors.lga.message}</p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>
              Provide your academic background and O'Level results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name *</Label>
                <Input
                  id="schoolName"
                  {...register("schoolName")}
                  placeholder="Name of your secondary school"
                />
                {errors.schoolName && (
                  <p className="text-sm text-red-600">{errors.schoolName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year *</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  {...register("graduationYear", { valueAsNumber: true })}
                  placeholder="2023"
                />
                {errors.graduationYear && (
                  <p className="text-sm text-red-600">{errors.graduationYear.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-semibold">O'Level Results *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOlevelResult}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </div>
              
              <div className="space-y-4">
                {olevelResults.map((result, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label className="text-sm">Subject</Label>
                      <Input
                        value={result.subject}
                        onChange={(e) => updateOlevelResult(index, "subject", e.target.value)}
                        placeholder="e.g., Mathematics"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Grade</Label>
                      <Select
                        value={result.grade}
                        onValueChange={(value) => updateOlevelResult(index, "grade", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {grades.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Exam Type</Label>
                      <Select
                        value={result.examType}
                        onValueChange={(value) => updateOlevelResult(index, "examType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {examTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Year</Label>
                      <Select
                        value={result.year.toString()}
                        onValueChange={(value) => updateOlevelResult(index, "year", parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOlevelResult(index)}
                        disabled={olevelResults.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Program Selection</CardTitle>
            <CardDescription>
              Choose your preferred program and screening
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="programId">Program *</Label>
              <Select onValueChange={(value) => setValue("programId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your preferred program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name} ({program.level}) - {program.department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.programId && (
                <p className="text-sm text-red-600">{errors.programId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="screeningId">Screening *</Label>
              <Select onValueChange={(value) => setValue("screeningId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select screening session" />
                </SelectTrigger>
                <SelectContent>
                  {screenings.map((screening) => (
                    <SelectItem key={screening.id} value={screening.id}>
                      {screening.name} ({new Date(screening.startDate).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.screeningId && (
                <p className="text-sm text-red-600">{errors.screeningId.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? "Registering..." : "Complete Registration"}
          </Button>
        </div>
      </div>
    </div>
  )
}