import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { hasPermission } from "@/lib/rbac"
import { ScoringEngine } from "@/lib/scoring"

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

    const results: any[] = []
    const errors: any[] = []

    for (const submission of submissions) {
      try {
        // Get candidate with screening details
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

        if (!candidate.screening.questions || candidate.screening.questions.length === 0) {
          errors.push({
            candidateId: submission.candidateId,
            error: "No questions found for this screening"
          })
          continue
        }

        // Calculate score
        const scoreResult = await ScoringEngine.calculateScore(
          submission.candidateId,
          submission.answers,
          candidate.screening.questions,
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
          error: error instanceof Error ? error.message : "Unknown error"
        })
      }
    }

    return NextResponse.json({
      message: "Batch scoring completed",
      summary: {
        total: submissions.length,
        successful: results.length,
        failed: errors.length
      },
      results,
      errors
    })

  } catch (error) {
    console.error("Failed to perform batch scoring:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}