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
    const { candidateId, answers, timeTaken } = body

    // Validate input
    if (!candidateId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      )
    }

    // Get candidate with screening details
    const candidate = await db.candidate.findUnique({
      where: { id: candidateId },
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
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      )
    }

    if (!candidate.screening.questions || candidate.screening.questions.length === 0) {
      return NextResponse.json(
        { error: "No questions found for this screening" },
        { status: 400 }
      )
    }

    // Calculate score
    const scoreResult = await ScoringEngine.calculateScore(
      candidateId,
      answers,
      candidate.screening.questions,
      timeTaken || 0
    )

    // Save score to database
    await ScoringEngine.saveTestScore(candidateId, scoreResult, session.user.id)

    return NextResponse.json({
      message: "Test scored successfully",
      result: scoreResult
    })

  } catch (error) {
    console.error("Failed to score test:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const screeningId = searchParams.get("screeningId")
    const candidateId = searchParams.get("candidateId")

    if (candidateId) {
      // Get specific candidate report
      if (!hasPermission(session.user.role as any, "score_tests")) {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }

      const report = await ScoringEngine.generateCandidateReport(candidateId)
      return NextResponse.json(report)
    }

    if (screeningId) {
      // Get screening statistics
      if (!hasPermission(session.user.role as any, "view_reports")) {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }

      const statistics = await ScoringEngine.getScreeningStatistics(screeningId)
      return NextResponse.json(statistics)
    }

    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    )

  } catch (error) {
    console.error("Failed to fetch scoring data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}