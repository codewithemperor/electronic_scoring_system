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

    const programTests = await db.programTest.findMany({
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
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(programTests)
  } catch (error) {
    console.error("Failed to fetch program tests:", error)
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

    const body = await request.json()
    const { programId, screeningId, questions } = body

    // Check if program test already exists
    const existingProgramTest = await db.programTest.findFirst({
      where: {
        programId,
        screeningId
      }
    })

    if (existingProgramTest) {
      return NextResponse.json({ error: "Test already assigned to this program" }, { status: 400 })
    }

    const programTest = await db.programTest.create({
      data: {
        programId,
        screeningId,
        isActive: true
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
    console.error("Failed to create program test:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}