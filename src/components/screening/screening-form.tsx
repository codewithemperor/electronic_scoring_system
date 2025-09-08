"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ClipboardCheck, 
  User, 
  Star, 
  AlertCircle, 
  CheckCircle,
  Award,
  FileText
} from "lucide-react"

const screeningResultSchema = z.object({
  scores: z.array(z.object({
    criteriaId: z.string(),
    score: z.number().min(0),
    remarks: z.string().optional()
  })),
  overallRemarks: z.string().optional()
})

type ScreeningFormData = z.infer<typeof screeningResultSchema>

interface ScreeningCriteria {
  id: string
  name: string
  description: string
  maxScore: number
  weight: number
}

interface Candidate {
  id: string
  applicationNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  program: string
  utmeScore: number
  olevelResults: string
  passportPhoto?: string
}

interface ScreeningFormProps {
  candidate: Candidate
  criteria: ScreeningCriteria[]
  onSubmit: (data: ScreeningFormData) => void
  isLoading?: boolean
}

export function ScreeningForm({ candidate, criteria, onSubmit, isLoading = false }: ScreeningFormProps) {
  const [currentScores, setCurrentScores] = useState<Record<string, number>>({})
  const [totalScore, setTotalScore] = useState(0)
  const [totalWeightedScore, setTotalWeightedScore] = useState(0)

  const form = useForm<ScreeningFormData>({
    resolver: zodResolver(screeningResultSchema),
    defaultValues: {
      scores: criteria.map(c => ({
        criteriaId: c.id,
        score: 0,
        remarks: ""
      })),
      overallRemarks: ""
    },
  })

  const handleScoreChange = (criteriaId: string, score: number) => {
    const criteria = criteria.find(c => c.id === criteriaId)
    if (!criteria) return

    // Validate score doesn't exceed max
    const validatedScore = Math.min(Math.max(score, 0), criteria.maxScore)
    
    setCurrentScores(prev => ({
      ...prev,
      [criteriaId]: validatedScore
    }))

    // Update form values
    const currentScoresArray = form.getValues("scores")
    const updatedScores = currentScoresArray.map(s => 
      s.criteriaId === criteriaId 
        ? { ...s, score: validatedScore }
        : s
    )
    form.setValue("scores", updatedScores)

    // Calculate totals
    const newTotalScore = Object.values({ ...currentScores, [criteriaId]: validatedScore })
      .reduce((sum, score, index) => {
        const weight = criteria[index]?.weight || 0
        return sum + (score * weight)
      }, 0)
    
    setTotalWeightedScore(newTotalScore)
    setTotalScore(Object.values({ ...currentScores, [criteriaId]: validatedScore })
      .reduce((sum, score) => sum + score, 0))
  }

  const getMaxPossibleScore = () => {
    return criteria.reduce((sum, c) => sum + (c.maxScore * c.weight), 0)
  }

  const getScorePercentage = () => {
    const maxPossible = getMaxPossibleScore()
    return maxPossible > 0 ? (totalWeightedScore / maxPossible) * 100 : 0
  }

  return (
    <div className="space-y-6">
      {/* Candidate Information */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Candidate Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src={candidate.passportPhoto} />
              <AvatarFallback>
                {candidate.firstName[0]}{candidate.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {candidate.firstName} {candidate.lastName}
                </h3>
                <p className="text-sm text-gray-600">{candidate.applicationNumber}</p>
                <p className="text-sm text-gray-600">{candidate.email}</p>
                <p className="text-sm text-gray-600">{candidate.phone}</p>
              </div>
              <div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">Program:</span>
                    <span className="text-sm">{candidate.program}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">UTME Score:</span>
                    <span className="text-sm">{candidate.utmeScore}/400</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">O'level Results</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">{candidate.olevelResults}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scoring Form */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-green-600" />
            Screening Evaluation
          </CardTitle>
          <CardDescription>
            Evaluate the candidate based on the following criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Scoring Criteria */}
              <div className="space-y-4">
                {criteria.map((criterion, index) => (
                  <div key={criterion.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{criterion.name}</h4>
                        <p className="text-sm text-gray-600">{criterion.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline">
                            Max: {criterion.maxScore}
                          </Badge>
                          <Badge variant="outline">
                            Weight: {(criterion.weight * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <FormLabel className="text-sm font-medium">Score (0-{criterion.maxScore})</FormLabel>
                        <div className="flex items-center gap-3 mt-1">
                          <Input
                            type="number"
                            min="0"
                            max={criterion.maxScore}
                            value={currentScores[criterion.id] || 0}
                            onChange={(e) => handleScoreChange(criterion.id, Number(e.target.value))}
                            className="w-20"
                          />
                          <Progress 
                            value={(currentScores[criterion.id] || 0) / criterion.maxScore * 100} 
                            className="flex-1 h-2"
                          />
                          <span className="text-sm text-gray-600 w-12">
                            {currentScores[criterion.id] || 0}/{criterion.maxScore}
                          </span>
                        </div>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name={`scores.${index}.remarks`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Remarks (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Add any comments or observations for this criterion..."
                                className="text-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall Score Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Score Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {totalScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Total Raw Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {totalWeightedScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Weighted Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {getScorePercentage().toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Overall Percentage</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">
                      {totalWeightedScore.toFixed(1)} / {getMaxPossibleScore().toFixed(1)}
                    </span>
                  </div>
                  <Progress 
                    value={getScorePercentage()} 
                    className="h-3"
                  />
                </div>
              </div>

              {/* Overall Remarks */}
              <FormField
                control={form.control}
                name="overallRemarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Overall Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide overall assessment and recommendation for this candidate..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be included in the final screening report
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <Button type="button" variant="outline" disabled={isLoading}>
                  Save as Draft
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Screening"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}