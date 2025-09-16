import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { hasPermission } from "@/lib/rbac"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = session.user.role as string

    // Get statistics based on user role
    let stats = {}

    switch (userRole) {
      case "SUPER_ADMIN":
      case "ADMIN":
        // Admins can see all statistics
        const [totalCandidates, activeScreenings, totalQuestions, totalUsers] = await Promise.all([
          db.candidate.count(),
          db.screening.count({ where: { status: "ACTIVE" } }),
          db.question.count({ where: { isActive: true } }),
          db.user.count({ where: { isActive: true } })
        ])
        
        stats = {
          totalCandidates,
          activeScreenings,
          totalQuestions,
          totalUsers
        }
        break

      case "STAFF":
        // Staff can see candidate and screening statistics
        const [staffCandidates, staffScreenings] = await Promise.all([
          db.candidate.count(),
          db.screening.count({ where: { status: "ACTIVE" } })
        ])
        
        stats = {
          totalCandidates: staffCandidates,
          activeScreenings: staffScreenings
        }
        break

      case "EXAMINER":
        // Examiners can see question and screening statistics
        const [examinerQuestions, examinerScreenings] = await Promise.all([
          db.question.count({ where: { isActive: true } }),
          db.screening.count({ where: { status: "ACTIVE" } })
        ])
        
        stats = {
          totalQuestions: examinerQuestions,
          activeScreenings: examinerScreenings
        }
        break

      default:
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Failed to fetch dashboard statistics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}