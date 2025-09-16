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

    const userRole = session.user.role as string

    // Get recent screenings based on user role
    let screenings = []

    switch (userRole) {
      case "SUPER_ADMIN":
      case "ADMIN":
        // Admins can see all screenings
        screenings = await db.screening.findMany({
          include: {
            academicSession: true,
            _count: {
              select: { candidates: true }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 5
        })
        break

      case "STAFF":
      case "EXAMINER":
        // Staff and Examiners can see active and scheduled screenings
        screenings = await db.screening.findMany({
          where: {
            status: { in: ["ACTIVE", "SCHEDULED"] }
          },
          include: {
            academicSession: true,
            _count: {
              select: { candidates: true }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 5
        })
        break

      default:
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Format the response
    const formattedScreenings = screenings.map(screening => ({
      id: screening.id,
      name: screening.name,
      status: screening.status,
      candidates: screening._count.candidates,
      startDate: screening.startDate,
      endDate: screening.endDate,
      academicSession: screening.academicSession?.name
    }))

    return NextResponse.json(formattedScreenings)
  } catch (error) {
    console.error("Failed to fetch recent screenings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}