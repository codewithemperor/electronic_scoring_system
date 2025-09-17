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

    const { searchParams } = new URL(request.url)
    const programId = searchParams.get("programId")
    const screeningId = searchParams.get("screeningId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Get comprehensive statistics
    const [
      totalCandidates,
      activeCandidates,
      completedTests,
      pendingTests,
      averageScore,
      passRate,
      screeningsByStatus,
      candidatesByProgram,
      scoresDistribution
    ] = await Promise.all([
      // Total candidates
      db.candidate.count({
        where: {
          ...(programId && { programId }),
          ...(screeningId && { screeningId }),
          ...(startDate && endDate && {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          })
        }
      }),

      // Active candidates (registered but not necessarily completed)
      db.candidate.count({
        where: {
          status: "REGISTERED",
          ...(programId && { programId }),
          ...(screeningId && { screeningId }),
          ...(startDate && endDate && {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          })
        }
      }),

      // Completed tests
      db.candidate.count({
        where: {
          hasWritten: true,
          ...(programId && { programId }),
          ...(screeningId && { screeningId }),
          ...(startDate && endDate && {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          })
        }
      }),

      // Pending tests (registered but not written)
      db.candidate.count({
        where: {
          hasWritten: false,
          ...(programId && { programId }),
          ...(screeningId && { screeningId }),
          ...(startDate && endDate && {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          })
        }
      }),

      // Average score
      db.candidate.aggregate({
        _avg: {
          totalScore: true
        },
        where: {
          hasWritten: true,
          ...(programId && { programId }),
          ...(screeningId && { screeningId }),
          ...(startDate && endDate && {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          })
        }
      }),

      // Pass rate (candidates with score >= pass marks)
      db.candidate.count({
        where: {
          hasWritten: true,
          totalScore: {
            gte: db.screening.fields.passMarks
          },
          ...(programId && { programId }),
          ...(screeningId && { screeningId }),
          ...(startDate && endDate && {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          })
        }
      }),

      // Screenings by status
      db.screening.groupBy({
        by: ["status"],
        _count: {
          id: true
        },
        where: {
          ...(startDate && endDate && {
            startDate: {
              gte: new Date(startDate)
            },
            endDate: {
              lte: new Date(endDate)
            }
          })
        }
      }),

      // Candidates by program
      db.candidate.groupBy({
        by: ["programId"],
        _count: {
          id: true
        },
        where: {
          ...(programId && { programId }),
          ...(screeningId && { screeningId }),
          ...(startDate && endDate && {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          })
        }
      }),

      // Score distribution
      db.testScore.groupBy({
        by: ["isCorrect"],
        _count: {
          id: true
        },
        _sum: {
          marks: true
        },
        where: {
          ...(startDate && endDate && {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          })
        }
      })
    ])

    // Calculate pass rate percentage
    const totalCompleted = completedTests
    const passRateCount = await db.candidate.count({
      where: {
        hasWritten: true,
        totalScore: {
          gte: db.screening.fields.passMarks
        },
        ...(programId && { programId }),
        ...(screeningId && { screeningId }),
        ...(startDate && endDate && {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        })
      }
    })

    const passRatePercentage = totalCompleted > 0 ? (passRateCount / totalCompleted) * 100 : 0

    // Get program details if programId is provided
    let programDetails = null
    if (programId) {
      programDetails = await db.program.findUnique({
        where: { id: programId },
        include: {
          department: true
        }
      })
    }

    // Get screening details if screeningId is provided
    let screeningDetails = null
    if (screeningId) {
      screeningDetails = await db.screening.findUnique({
        where: { id: screeningId },
        include: {
          academicSession: true
        }
      })
    }

    const stats = {
      overview: {
        totalCandidates,
        activeCandidates,
        completedTests,
        pendingTests,
        averageScore: averageScore._avg.totalScore || 0,
        passRate: Math.round(passRatePercentage * 100) / 100
      },
      screenings: {
        byStatus: screeningsByStatus.map(stat => ({
          status: stat.status,
          count: stat._count.id
        }))
      },
      programs: {
        byProgram: await Promise.all(
          candidatesByProgram.map(async (stat) => {
            const program = await db.program.findUnique({
              where: { id: stat.programId },
              select: { name: true, code: true }
            })
            return {
              program: program,
              count: stat._count.id
            }
          })
        )
      },
      scores: {
        distribution: scoresDistribution.map(stat => ({
          isCorrect: stat.isCorrect,
          count: stat._count.id,
          totalMarks: stat._sum.marks || 0
        })),
        correctAnswers: scoresDistribution.find(s => s.isCorrect === true)?._count.id || 0,
        incorrectAnswers: scoresDistribution.find(s => s.isCorrect === false)?._count.id || 0
      },
      filters: {
        program: programDetails,
        screening: screeningDetails,
        dateRange: startDate && endDate ? {
          start: startDate,
          end: endDate
        } : null
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Failed to fetch statistics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}