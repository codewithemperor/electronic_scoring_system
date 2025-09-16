import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { hasPermission } from "@/lib/rbac"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const screening = await db.screening.findUnique({
      where: { id: params.id },
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

    if (!screening) {
      return NextResponse.json({ error: "Screening not found" }, { status: 404 })
    }

    return NextResponse.json(screening)
  } catch (error) {
    console.error("Failed to fetch screening:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const screening = await db.screening.update({
      where: { id: params.id },
      data: {
        name,
        academicSessionId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        duration,
        totalMarks,
        passMarks,
        instructions,
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

    return NextResponse.json(screening)
  } catch (error) {
    console.error("Failed to update screening:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!hasPermission(session.user.role as any, "manage_screenings")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    await db.screening.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Screening deleted successfully" })
  } catch (error) {
    console.error("Failed to delete screening:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}