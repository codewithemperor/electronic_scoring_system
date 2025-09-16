import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const candidate = await db.candidate.findUnique({
      where: { id: params.id },
      include: {
        screening: {
          include: {
            questions: {
              include: {
                subject: {
                  select: {
                    id: true,
                    name: true,
                    code: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    if (!candidate.screening.questions || candidate.screening.questions.length === 0) {
      return NextResponse.json({ error: "No questions found for this screening" }, { status: 404 })
    }

    return NextResponse.json(candidate.screening.questions)
  } catch (error) {
    console.error("Failed to fetch candidate questions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}