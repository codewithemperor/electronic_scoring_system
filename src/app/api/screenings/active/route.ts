import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const screenings = await db.screening.findMany({
      where: {
        status: {
          in: ["ACTIVE", "SCHEDULED"],
        },
        endDate: {
          gte: new Date(),
        },
      },
      include: {
        academicSession: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    })

    return NextResponse.json(screenings)
  } catch (error) {
    console.error("Failed to fetch active screenings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}