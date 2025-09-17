import { db } from "@/lib/db"

export interface ScoreResult {
  candidateId: string
  totalScore: number
  maxScore: number
  percentage: number
  correctAnswers: number
  wrongAnswers: number
  unansweredQuestions: number
  timeTaken: number // in seconds
  subjectBreakdown: SubjectScore[]
  grade: string
  status: 'PASSED' | 'FAILED'
}

export interface SubjectScore {
  subjectId: string
  subjectName: string
  subjectCode: string
  totalQuestions: number
  correctAnswers: number
  score: number
  percentage: number
}

export interface TestAnswer {
  questionId: string
  selectedAnswer: string
  timeTaken?: number // in seconds
}

export interface QuestionWithDetails {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  marks: number
  subject: {
    id: string
    name: string
    code: string
  }
}

// Grading System
const GRADING_SYSTEM = {
  'A': { min: 80, max: 100, description: 'Excellent' },
  'B': { min: 70, max: 79, description: 'Very Good' },
  'C': { min: 60, max: 69, description: 'Good' },
  'D': { min: 50, max: 59, description: 'Fair' },
  'E': { min: 40, max: 49, description: 'Pass' },
  'F': { min: 0, max: 39, description: 'Fail' }
} as const

export class ScoringEngine {
  /**
   * Calculate score for a candidate's test submission
   */
  static async calculateScore(
    candidateId: string,
    answers: TestAnswer[],
    questions: QuestionWithDetails[],
    timeTaken: number
  ): Promise<ScoreResult> {
    let totalScore = 0
    let correctAnswers = 0
    let wrongAnswers = 0
    let unansweredQuestions = 0
    const maxScore = questions.reduce((sum, q) => sum + q.marks, 0)

    // Group by subject for breakdown
    const subjectGroups = new Map<string, {
      subjectId: string
      subjectName: string
      subjectCode: string
      questions: QuestionWithDetails[]
      correctAnswers: number
    }>()

    // Initialize subject groups
    questions.forEach(question => {
      const subjectKey = question.subject.id
      if (!subjectGroups.has(subjectKey)) {
        subjectGroups.set(subjectKey, {
          subjectId: question.subject.id,
          subjectName: question.subject.name,
          subjectCode: question.subject.code,
          questions: [],
          correctAnswers: 0
        })
      }
      subjectGroups.get(subjectKey)!.questions.push(question)
    })

    // Process each answer
    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId)
      if (!question) return

      const subjectKey = question.subject.id
      const subjectGroup = subjectGroups.get(subjectKey)!

      if (answer.selectedAnswer && answer.selectedAnswer.trim() !== '') {
        const isCorrect = answer.selectedAnswer.toUpperCase() === question.correctAnswer.toUpperCase()
        
        if (isCorrect) {
          totalScore += question.marks
          correctAnswers++
          subjectGroup.correctAnswers++
        } else {
          wrongAnswers++
        }
      } else {
        unansweredQuestions++
      }
    })

    // Calculate subject breakdowns
    const subjectBreakdown: SubjectScore[] = Array.from(subjectGroups.values()).map(group => {
      const subjectTotalMarks = group.questions.reduce((sum, q) => sum + q.marks, 0)
      const subjectScore = group.questions.reduce((sum, q) => {
        const answer = answers.find(a => a.questionId === q.id)
        if (!answer || !answer.selectedAnswer || answer.selectedAnswer.trim() === '') {
          return sum
        }
        const isCorrect = answer.selectedAnswer.toUpperCase() === q.correctAnswer.toUpperCase()
        return isCorrect ? sum + q.marks : sum
      }, 0)

      return {
        subjectId: group.subjectId,
        subjectName: group.subjectName,
        subjectCode: group.subjectCode,
        totalQuestions: group.questions.length,
        correctAnswers: group.correctAnswers,
        score: subjectScore,
        percentage: subjectTotalMarks > 0 ? (subjectScore / subjectTotalMarks) * 100 : 0
      }
    })

    // Calculate overall percentage
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0

    // Determine grade and status
    const grade = this.determineGrade(percentage)
    const status = percentage >= 40 ? 'PASSED' : 'FAILED'

    return {
      candidateId,
      totalScore,
      maxScore,
      percentage,
      correctAnswers,
      wrongAnswers,
      unansweredQuestions,
      timeTaken,
      subjectBreakdown,
      grade,
      status
    }
  }

  /**
   * Determine grade based on percentage
   */
  static determineGrade(percentage: number): string {
    for (const [grade, range] of Object.entries(GRADING_SYSTEM)) {
      if (percentage >= range.min && percentage <= range.max) {
        return grade
      }
    }
    return 'F'
  }

  /**
   * Get grade description
   */
  static getGradeDescription(grade: string): string {
    return GRADING_SYSTEM[grade as keyof typeof GRADING_SYSTEM]?.description || 'Unknown'
  }

  /**
   * Calculate batch scores for multiple candidates
   */
  static async calculateBatchScores(submissions: Array<{
    candidateId: string
    answers: TestAnswer[]
    questions: QuestionWithDetails[]
    timeTaken: number
  }>): Promise<ScoreResult[]> {
    const results: ScoreResult[] = []

    for (const submission of submissions) {
      const result = await this.calculateScore(
        submission.candidateId,
        submission.answers,
        submission.questions,
        submission.timeTaken
      )
      results.push(result)
    }

    return results
  }

  /**
   * Save test score to database
   */
  static async saveTestScore(
    candidateId: string,
    scoreResult: ScoreResult,
    scoredById?: string
  ): Promise<void> {
    // Update candidate with score and status
    await db.candidate.update({
      where: { id: candidateId },
      data: {
        totalScore: scoreResult.totalScore,
        percentage: scoreResult.percentage,
        status: scoreResult.status as any,
        hasWritten: true,
      }
    })

    // Note: Individual question scores should be saved when processing each answer
    // This method now only updates the candidate's overall score
    // The individual question scores are saved separately during test submission
  }

  /**
   * Get screening statistics
   */
  static async getScreeningStatistics(screeningId: string) {
    const candidates = await db.candidate.findMany({
      where: { screeningId },
      include: {
        testScores: true,
        program: {
          select: {
            name: true,
            department: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    const totalCandidates = candidates.length
    const writtenCandidates = candidates.filter(c => c.hasWritten).length
    const passedCandidates = candidates.filter(c => c.status === 'PASSED').length
    const failedCandidates = candidates.filter(c => c.status === 'FAILED').length

    const averageScore = candidates
      .filter(c => c.totalScore !== null)
      .reduce((sum, c) => sum + (c.totalScore || 0), 0) / writtenCandidates || 0

    const passRate = writtenCandidates > 0 ? (passedCandidates / writtenCandidates) * 100 : 0

    // Program-wise breakdown
    const programStats = new Map<string, {
      programName: string
      departmentName: string
      total: number
      passed: number
      averageScore: number
    }>()

    candidates.forEach(candidate => {
      const programKey = candidate.programId
      if (!programStats.has(programKey)) {
        programStats.set(programKey, {
          programName: candidate.program.name,
          departmentName: candidate.program.department.name,
          total: 0,
          passed: 0,
          averageScore: 0
        })
      }

      const stats = programStats.get(programKey)!
      stats.total++
      if (candidate.status === 'PASSED') {
        stats.passed++
      }
    })

    // Calculate average scores per program
    programStats.forEach((stats, programId) => {
      const programCandidates = candidates.filter(c => c.programId === programId && c.totalScore !== null)
      const totalScore = programCandidates.reduce((sum, c) => sum + (c.totalScore || 0), 0)
      stats.averageScore = programCandidates.length > 0 ? totalScore / programCandidates.length : 0
    })

    return {
      totalCandidates,
      writtenCandidates,
      passedCandidates,
      failedCandidates,
      averageScore: Math.round(averageScore * 100) / 100,
      passRate: Math.round(passRate * 100) / 100,
      programStats: Array.from(programStats.entries()).map(([id, stats]) => ({
        programId: id,
        ...stats
      }))
    }
  }

  /**
   * Generate performance report for a candidate
   */
  static async generateCandidateReport(candidateId: string) {
    const candidate = await db.candidate.findUnique({
      where: { id: candidateId },
      include: {
        screening: {
          select: {
            name: true,
            totalMarks: true,
            passMarks: true
          }
        },
        program: {
          select: {
            name: true,
            code: true,
            department: {
              select: {
                name: true
              }
            }
          }
        },
        testScores: true
      }
    })

    if (!candidate) {
      throw new Error('Candidate not found')
    }

    const grade = candidate.percentage ? this.determineGrade(candidate.percentage) : 'F'
    const gradeDescription = this.getGradeDescription(grade)

    return {
      candidate: {
        id: candidate.id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        registrationNumber: candidate.registrationNumber,
        phone: candidate.phone
      },
      screening: {
        name: candidate.screening.name,
        totalMarks: candidate.screening.totalMarks,
        passMarks: candidate.screening.passMarks
      },
      program: {
        name: candidate.program.name,
        code: candidate.program.code,
        department: candidate.program.department.name
      },
      performance: {
        totalScore: candidate.totalScore,
        percentage: candidate.percentage,
        grade,
        gradeDescription,
        status: candidate.status,
        hasWritten: candidate.hasWritten
      },
      testScores: candidate.testScores.map(score => ({
        marks: score.marks,
        createdAt: score.createdAt
      }))
    }
  }
}