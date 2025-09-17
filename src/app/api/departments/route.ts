import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const departments = await db.department.findMany({
      include: {
        programs: {
          select: {
            id: true,
            name: true,
            code: true,
            isActive: true,
          },
        },
      },
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(departments)
  } catch (error) {
    console.error("Failed to fetch departments:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, code, description } = body

    if (!name || !code) {
      return NextResponse.json(
        { error: "Name and code are required" },
        { status: 400 }
      )
    }

    // Check if department with same code already exists
    const existingDepartment = await db.department.findUnique({
      where: { code }
    })

    if (existingDepartment) {
      return NextResponse.json(
        { error: "Department with this code already exists" },
        { status: 400 }
      )
    }

    const department = await db.department.create({
      data: {
        name,
        code,
        description: description || null,
      },
      include: {
        programs: true,
      },
    })

    return NextResponse.json(department)
  } catch (error) {
    console.error("Failed to create department:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}