import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { hasPermission } from "@/lib/rbac"
import { ScoringEngine, type TestAnswer, type QuestionWithDetails } from "@/lib/scoring"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!hasPermission(session.user.role as any, "score_tests")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { submissions } = body

    if (!submissions || !Array.isArray(submissions)) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      )
    }

    const results = []
    const errors = []

    for (const submission of submissions) {
      try {
        // Get candidate details with screening
        const candidate = await db.candidate.findUnique({
          where: { id: submission.candidateId },
          include: {
            screening: {
              include: {
                questions: {
                  include: {
                    subject: {
                      select: {
                        id: true,
                        name: true,
                        code: true
                      }
                    }
                  }
                }
              }
            }
          }
        })

        if (!candidate) {
          errors.push({
            candidateId: submission.candidateId,
            error: "Candidate not found"
          })
          continue
        }

        if (candidate.hasWritten) {
          errors.push({
            candidateId: submission.candidateId,
            error: "Candidate has already taken this test"
          })
          continue
        }

        // Prepare questions for scoring
        const questions: QuestionWithDetails[] = candidate.screening.questions.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options as string[],
          correctAnswer: q.correctAnswer,
          marks: q.marks,
          subject: {
            id: q.subject.id,
            name: q.subject.name,
            code: q.subject.code
          }
        }))

        // Calculate score
        const scoreResult = await ScoringEngine.calculateScore(
          submission.candidateId,
          submission.answers as TestAnswer[],
          questions,
          submission.timeTaken || 0
        )

        // Save score to database
        await ScoringEngine.saveTestScore(submission.candidateId, scoreResult, session.user.id)

        results.push({
          candidateId: submission.candidateId,
          result: scoreResult
        })
      } catch (error) {
        console.error(`Failed to score candidate ${submission.candidateId}:`, error)
        errors.push({
          candidateId: submission.candidateId,
          error: "Internal server error"
        })
      }
    }

    return NextResponse.json({
      message: "Batch scoring completed",
      results,
      errors,
      summary: {
        total: submissions.length,
        successful: results.length,
        failed: errors.length
      }
    })
  } catch (error) {
    console.error("Failed to perform batch scoring:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}