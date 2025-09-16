import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { hasPermission } from "@/lib/rbac"
import { ScoringEngine } from "@/lib/scoring"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!hasPermission(session.user.role as any, "view_reports")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const screeningId = searchParams.get("screeningId")

    if (!screeningId) {
      return NextResponse.json(
        { error: "Screening ID is required" },
        { status: 400 }
      )
    }

    const statistics = await ScoringEngine.getScreeningStatistics(screeningId)

    return NextResponse.json(statistics)
  } catch (error) {
    console.error("Failed to fetch screening statistics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}