import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const programTest = await db.programTest.findUnique({
      where: { id },
      include: {
        program: {
          include: {
            department: true
          }
        },
        screening: {
          include: {
            academicSession: true,
            _count: {
              select: {
                questions: true,
                candidates: true
              }
            }
          }
        }
      }
    })

    if (!programTest) {
      return NextResponse.json({ error: "Program test not found" }, { status: 404 })
    }

    return NextResponse.json(programTest)
  } catch (error) {
    console.error("Failed to fetch program test:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { programId, screeningId, isActive } = body

    const { id } = await params

    const programTest = await db.programTest.update({
      where: { id },
      data: {
        programId,
        screeningId,
        isActive
      },
      include: {
        program: {
          include: {
            department: true
          }
        },
        screening: {
          include: {
            academicSession: true,
            _count: {
              select: {
                questions: true,
                candidates: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(programTest)
  } catch (error) {
    console.error("Failed to update program test:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await db.programTest.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Program test deleted successfully" })
  } catch (error) {
    console.error("Failed to delete program test:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}