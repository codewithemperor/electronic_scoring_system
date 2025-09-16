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

    // Get upcoming tests (screenings that are active and candidate hasn't completed)
    const upcomingTests = []
    
    if (candidate.screening && candidate.screening.status === "ACTIVE" && !candidate.hasWritten) {
      upcomingTests.push({
        id: candidate.screening.id,
        title: candidate.screening.name,
        date: candidate.screening.startDate.toISOString().split('T')[0],
        time: "10:00 AM", // Default time, could be stored in screening
        duration: `${candidate.screening.duration} minutes`,
        status: "SCHEDULED"
      })
    }

    return NextResponse.json(upcomingTests)
  } catch (error) {
    console.error("Failed to fetch candidate upcoming tests:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}