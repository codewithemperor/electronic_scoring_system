import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "CANDIDATE") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Get candidate information with test scores
    const candidate = await db.candidate.findFirst({
      where: {
        email: session.user.email
      },
      include: {
        screening: true,
        testScores: {
          include: {
            question: true
          }
        }
      }
    })

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    // Get completed tests
    const completedTests = []
    
    if (candidate.hasWritten && candidate.screening) {
      // Calculate total score
      const totalScore = candidate.testScores.reduce((sum, score) => sum + (score.marks || 0), 0)
      const totalQuestions = candidate.testScores.length
      const percentage = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0

      completedTests.push({
        id: candidate.screening.id,
        title: candidate.screening.name,
        date: new Date().toISOString().split('T')[0], // Use completion date or current date
        score: totalScore,
        totalMarks: totalQuestions,
        status: "COMPLETED",
        percentage: `${percentage}%`
      })
    }

    return NextResponse.json(completedTests)
  } catch (error) {
    console.error("Failed to fetch candidate completed tests:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}