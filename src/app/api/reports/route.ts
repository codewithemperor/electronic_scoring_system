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
    const reportType = searchParams.get("type")
    const programId = searchParams.get("programId")
    const screeningId = searchParams.get("screeningId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let reportData

    switch (reportType) {
      case "candidates":
        // Get candidate statistics
        const candidateStats = await db.candidate.groupBy({
          by: ["status"],
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
        })

        const totalCandidates = await db.candidate.count({
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
        })

        reportData = {
          totalCandidates,
          statusBreakdown: candidateStats,
          reportType: "candidates"
        }
        break

      case "scores":
        // Get score statistics
        const scoreStats = await db.testScore.groupBy({
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

        const averageScore = await db.testScore.aggregate({
          _avg: {
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

        reportData = {
          averageScore: averageScore._avg.marks || 0,
          correctAnswers: scoreStats.find(s => s.isCorrect === true)?._count.id || 0,
          incorrectAnswers: scoreStats.find(s => s.isCorrect === false)?._count.id || 0,
          totalMarks: scoreStats.reduce((sum, stat) => sum + (stat._sum.marks || 0), 0),
          reportType: "scores"
        }
        break

      case "screenings":
        // Get screening statistics
        const screeningStats = await db.screening.groupBy({
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
        })

        const totalScreenings = await db.screening.count({
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
        })

        reportData = {
          totalScreenings,
          statusBreakdown: screeningStats,
          reportType: "screenings"
        }
        break

      default:
        // General overview report
        const [candidatesCount, screeningsCount, testScoresCount] = await Promise.all([
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
          db.screening.count({
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
          db.testScore.count({
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

        reportData = {
          overview: {
            totalCandidates: candidatesCount,
            totalScreenings: screeningsCount,
            totalTestScores: testScoresCount
          },
          reportType: "overview"
        }
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error("Failed to generate report:", error)
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
    const { reportType, format, filters } = body

    // Generate different types of reports based on the request
    let reportData

    switch (reportType) {
      case "candidate-performance":
        reportData = await generateCandidatePerformanceReport(filters)
        break
      case "screening-analysis":
        reportData = await generateScreeningAnalysisReport(filters)
        break
      case "program-summary":
        reportData = await generateProgramSummaryReport(filters)
        break
      default:
        reportData = await generateGeneralReport(filters)
    }

    return NextResponse.json({
      data: reportData,
      reportType,
      generatedAt: new Date().toISOString(),
      format: format || "json"
    })
  } catch (error) {
    console.error("Failed to generate report:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Helper functions for report generation
async function generateCandidatePerformanceReport(filters: any) {
  const candidates = await db.candidate.findMany({
    include: {
      program: {
        include: {
          department: true
        }
      },
      screening: true,
      testScores: true
    },
    where: {
      ...(filters.programId && { programId: filters.programId }),
      ...(filters.screeningId && { screeningId: filters.screeningId }),
      ...(filters.startDate && filters.endDate && {
        createdAt: {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate)
        }
      })
    }
  })

  return candidates.map(candidate => ({
    id: candidate.id,
    name: `${candidate.firstName} ${candidate.lastName}`,
    registrationNumber: candidate.registrationNumber,
    program: candidate.program.name,
    department: candidate.program.department.name,
    screening: candidate.screening.name,
    hasWritten: candidate.hasWritten,
    totalScore: candidate.totalScore,
    percentage: candidate.percentage,
    status: candidate.status,
    testScoresCount: candidate.testScores.length,
    averageScore: candidate.testScores.length > 0 
      ? candidate.testScores.reduce((sum, score) => sum + (score.marks || 0), 0) / candidate.testScores.length 
      : 0
  }))
}

async function generateScreeningAnalysisReport(filters: any) {
  const screenings = await db.screening.findMany({
    include: {
      academicSession: true,
      candidates: {
        include: {
          program: true
        }
      },
      questions: true,
      _count: {
        select: {
          candidates: true,
          questions: true
        }
      }
    },
    where: {
      ...(filters.academicSessionId && { academicSessionId: filters.academicSessionId }),
      ...(filters.startDate && filters.endDate && {
        startDate: {
          gte: new Date(filters.startDate)
        },
        endDate: {
          lte: new Date(filters.endDate)
        }
      })
    }
  })

  return screenings.map(screening => ({
    id: screening.id,
    name: screening.name,
    academicSession: screening.academicSession.name,
    status: screening.status,
    duration: screening.duration,
    totalMarks: screening.totalMarks,
    passMarks: screening.passMarks,
    totalCandidates: screening._count.candidates,
    totalQuestions: screening._count.questions,
    candidates: screening.candidates.map(candidate => ({
      id: candidate.id,
      name: `${candidate.firstName} ${candidate.lastName}`,
      program: candidate.program.name,
      hasWritten: candidate.hasWritten,
      totalScore: candidate.totalScore
    }))
  }))
}

async function generateProgramSummaryReport(filters: any) {
  const programs = await db.program.findMany({
    include: {
      department: true,
      candidates: {
        include: {
          screening: true
        }
      },
      _count: {
        select: {
          candidates: true
        }
      }
    },
    where: {
      ...(filters.departmentId && { departmentId: filters.departmentId }),
      ...(filters.startDate && filters.endDate && {
        candidates: {
          some: {
            createdAt: {
              gte: new Date(filters.startDate),
              lte: new Date(filters.endDate)
            }
          }
        }
      })
    }
  })

  return programs.map(program => ({
    id: program.id,
    name: program.name,
    code: program.code,
    level: program.level,
    department: program.department.name,
    cutOffMark: program.cutOffMark,
    maxCapacity: program.maxCapacity,
    totalCandidates: program._count.candidates,
    candidates: program.candidates.map(candidate => ({
      id: candidate.id,
      name: `${candidate.firstName} ${candidate.lastName}`,
      registrationNumber: candidate.registrationNumber,
      hasWritten: candidate.hasWritten,
      totalScore: candidate.totalScore,
      screening: candidate.screening.name
    }))
  }))
}

async function generateGeneralReport(filters: any) {
  const [totalCandidates, totalScreenings, totalQuestions, totalTestScores] = await Promise.all([
    db.candidate.count({
      where: {
        ...(filters.startDate && filters.endDate && {
          createdAt: {
            gte: new Date(filters.startDate),
            lte: new Date(filters.endDate)
          }
        })
      }
    }),
    db.screening.count({
      where: {
        ...(filters.startDate && filters.endDate && {
          startDate: {
            gte: new Date(filters.startDate)
          },
          endDate: {
            lte: new Date(filters.endDate)
          }
        })
      }
    }),
    db.question.count({
      where: {
        isActive: true,
        ...(filters.startDate && filters.endDate && {
          createdAt: {
            gte: new Date(filters.startDate),
            lte: new Date(filters.endDate)
          }
        })
      }
    }),
    db.testScore.count({
      where: {
        ...(filters.startDate && filters.endDate && {
          createdAt: {
            gte: new Date(filters.startDate),
            lte: new Date(filters.endDate)
          }
        })
      }
    })
  ])

  return {
    summary: {
      totalCandidates,
      totalScreenings,
      totalQuestions,
      totalTestScores
    },
    generatedAt: new Date().toISOString()
  }
}