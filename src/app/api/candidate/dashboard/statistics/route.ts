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

    // Get candidate information
    const candidate = await db.candidate.findFirst({
      where: {
        email: session.user.email
      },
      include: {
        screening: true,
        testScores: true
      }
    })

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    // Calculate statistics
    const registeredScreenings = candidate.screening ? 1 : 0
    const completedTests = candidate.hasWritten ? 1 : 0
    const pendingTests = candidate.screening && !candidate.hasWritten ? 1 : 0
    
    // Calculate average score from test scores
    const totalScore = candidate.testScores.reduce((sum, score) => sum + (score.marks || 0), 0)
    const totalPossibleScore = candidate.testScores.length * 1 // Assuming each question is worth 1 mark
    const averageScore = totalPossibleScore > 0 ? ((totalScore / totalPossibleScore) * 100).toFixed(1) : "0.0"

    const statistics = {
      registeredScreenings,
      completedTests,
      pendingTests,
      averageScore
    }

    return NextResponse.json(statistics)
  } catch (error) {
    console.error("Failed to fetch candidate statistics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}