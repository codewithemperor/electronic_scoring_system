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

    const question = await db.question.findUnique({
      where: { id: params.id },
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

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    return NextResponse.json(question)
  } catch (error) {
    console.error("Failed to fetch question:", error)
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

    if (!hasPermission(session.user.role as any, "manage_questions")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { question, options, correctAnswer, subjectId, marks, difficulty, screeningId } = body

    const questionData = await db.question.update({
      where: { id: params.id },
      data: {
        question,
        options,
        correctAnswer,
        subjectId,
        marks,
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

    return NextResponse.json(questionData)
  } catch (error) {
    console.error("Failed to update question:", error)
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

    if (!hasPermission(session.user.role as any, "manage_questions")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    await db.question.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Question deleted successfully" })
  } catch (error) {
    console.error("Failed to delete question:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}