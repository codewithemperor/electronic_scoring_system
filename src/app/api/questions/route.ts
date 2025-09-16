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

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const subjectId = searchParams.get("subjectId")
    const difficulty = searchParams.get("difficulty")

    const where: any = {
      isActive: true,
    }
    
    if (search) {
      where.OR = [
        { question: { contains: search, mode: "insensitive" } },
      ]
    }

    if (subjectId) {
      where.subjectId = subjectId
    }

    if (difficulty) {
      where.difficulty = difficulty
    }

    const questions = await db.question.findMany({
      where,
      include: {
        subject: {
          select: {
            name: true,
            code: true,
          },
        },
        screening: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error("Failed to fetch questions:", error)
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

    if (!hasPermission(session.user.role as any, "manage_questions")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { question, options, correctAnswer, subjectId, marks, difficulty, screeningId } = body

    const questionData = await db.question.create({
      data: {
        question,
        options,
        correctAnswer,
        subjectId,
        marks: marks || 1,
        difficulty,
        screeningId: screeningId || null,
      },
      include: {
        subject: {
          select: {
            name: true,
            code: true,
          },
        },
        screening: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(questionData, { status: 201 })
  } catch (error) {
    console.error("Failed to create question:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}