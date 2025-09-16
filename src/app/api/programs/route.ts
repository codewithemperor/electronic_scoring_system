import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const programs = await db.program.findMany({
      include: {
        department: {
          select: {
            name: true,
            code: true,
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

    return NextResponse.json(programs)
  } catch (error) {
    console.error("Failed to fetch programs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}