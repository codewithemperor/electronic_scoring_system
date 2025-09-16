import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { candidateRegistrationSchema } from "@/lib/validations"

function generateRegistrationNumber(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `AO${timestamp}${random}`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search")
    const screeningId = searchParams.get("screeningId")
    const status = searchParams.get("status")

    const skip = (page - 1) * limit

    const where: any = {}
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { registrationNumber: { contains: search, mode: "insensitive" } },
      ]
    }

    if (screeningId) {
      where.screeningId = screeningId
    }

    if (status) {
      where.status = status
    }

    const [candidates, total] = await Promise.all([
      db.candidate.findMany({
        where,
        include: {
          screening: {
            select: {
              name: true,
              startDate: true,
              endDate: true,
            },
          },
          program: {
            select: {
              name: true,
              code: true,
              department: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.candidate.count({ where }),
    ])

    return NextResponse.json({
      candidates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Failed to fetch candidates:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = candidateRegistrationSchema.parse(body)

    // Check if candidate already exists
    const existingCandidate = await db.candidate.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { phone: validatedData.phone },
        ],
        screeningId: validatedData.screeningId,
      },
    })

    if (existingCandidate) {
      return NextResponse.json(
        { error: "Candidate with this email or phone already registered for this screening" },
        { status: 400 }
      )
    }

    // Generate registration number
    const registrationNumber = generateRegistrationNumber()

    // Create candidate
    const candidate = await db.candidate.create({
      data: {
        ...validatedData,
        registrationNumber,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        olevelResults: validatedData.olevelResults,
      },
      include: {
        screening: {
          select: {
            name: true,
            startDate: true,
            endDate: true,
          },
        },
        program: {
          select: {
            name: true,
            code: true,
            department: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      message: "Candidate registered successfully",
      candidate,
      registrationNumber,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      )
    }

    console.error("Failed to create candidate:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}