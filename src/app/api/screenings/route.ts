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

    const screenings = await db.screening.findMany({
      include: {
        academicSession: true,
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            candidates: true,
            questions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(screenings)
  } catch (error) {
    console.error("Failed to fetch screenings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!hasPermission(session.user.role as any, "manage_screenings")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { name, academicSessionId, startDate, endDate, duration, totalMarks, passMarks, instructions } = body

    const screening = await db.screening.create({
      data: {
        name,
        academicSessionId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        duration,
        totalMarks,
        passMarks,
        instructions,
        createdById: session.user.id,
      },
      include: {
        academicSession: true,
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            candidates: true,
            questions: true,
          },
        },
      },
    })

    return NextResponse.json(screening, { status: 201 })
  } catch (error) {
    console.error("Failed to create screening:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}