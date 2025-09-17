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

    // Check if user is staff
    if (session.user.role !== "STAFF") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get("type")
    const screeningId = searchParams.get("screeningId")
    const programId = searchParams.get("programId")

    let reportData

    switch (reportType) {
      case "candidate-performance":
        // Get candidate performance data for staff
        const candidates = await db.candidate.findMany({
          include: {
            program: {
              include: {
                department: true
              }
            },
            screening: true,
            testScores: {
              include: {
                question: {
                  include: {
                    subject: true
                  }
                }
              }
            }
          },
          where: {
            ...(screeningId && { screeningId }),
            ...(programId && { programId }),
            // Staff can see all candidates
          },
          orderBy: {
            totalScore: 'desc'
          }
        })

        reportData = candidates.map(candidate => ({
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
          testScores: candidate.testScores.map(score => ({
            id: score.id,
            question: score.question.question,
            subject: score.question.subject.name,
            selectedAnswer: score.selectedAnswer,
            correctAnswer: score.question.correctAnswer,
            isCorrect: score.isCorrect,
            marks: score.marks,
            timeTaken: score.timeTaken
          }))
        }))
        break

      case "screening-summary":
        // Get screening summary for staff
        const screenings = await db.screening.findMany({
          include: {
            academicSession: true,
            candidates: {
              include: {
                program: true
              }
            },
            questions: {
              include: {
                subject: true
              }
            },
            _count: {
              select: {
                candidates: true,
                questions: true
              }
            }
          },
          where: {
            // Staff can see all screenings
          }
        })

        reportData = screenings.map(screening => ({
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
            totalScore: candidate.totalScore,
            status: candidate.status
          })),
          questions: screening.questions.map(question => ({
            id: question.id,
            question: question.question,
            subject: question.subject.name,
            marks: question.marks,
            difficulty: question.difficulty
          }))
        }))
        break

      case "program-summary":
        // Get program summary for staff
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
            // Staff can see all programs
          }
        })

        reportData = programs.map(program => ({
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
        break

      case "department-performance":
        // Get department performance for staff
        const departments = await db.department.findMany({
          include: {
            programs: {
              include: {
                candidates: {
                  include: {
                    screening: true
                  }
                }
              }
            }
          },
          where: {
            // Staff can see all departments
          }
        })

        reportData = departments.map(department => ({
          id: department.id,
          name: department.name,
          totalPrograms: department.programs.length,
          totalCandidates: department.programs.reduce((sum, program) => sum + program.candidates.length, 0),
          programs: department.programs.map(program => ({
            id: program.id,
            name: program.name,
            code: program.code,
            candidatesCount: program.candidates.length,
            averageScore: program.candidates.length > 0 
              ? program.candidates.reduce((sum, candidate) => sum + (candidate.totalScore || 0), 0) / program.candidates.length 
              : 0,
            passedCandidates: program.candidates.filter(candidate => candidate.status === "PASSED").length,
            failedCandidates: program.candidates.filter(candidate => candidate.status === "FAILED").length
          }))
        }))
        break

      case "attendance-report":
        // Get attendance report for staff
        const attendanceData = await db.candidate.groupBy({
          by: ["hasWritten", "status"],
          _count: {
            id: true
          },
          where: {
            ...(screeningId && { screeningId }),
            ...(programId && { programId })
          }
        })

        const totalCandidatesAttendance = await db.candidate.count({
          where: {
            ...(screeningId && { screeningId }),
            ...(programId && { programId })
          }
        })

        const writtenCandidates = attendanceData.find(item => item.hasWritten === true)?._count.id || 0
        const notWrittenCandidates = attendanceData.find(item => item.hasWritten === false)?._count.id || 0
        const attendanceRate = totalCandidatesAttendance > 0 ? (writtenCandidates / totalCandidatesAttendance) * 100 : 0

        reportData = {
          totalCandidates: totalCandidatesAttendance,
          writtenCandidates,
          notWrittenCandidates,
          attendanceRate,
          breakdown: attendanceData
        }
        break

      case "scoring-stats":
        // Get scoring statistics for staff
        const [totalCandidates, scoredCandidates, totalTestScores] = await Promise.all([
          db.candidate.count({
            where: {
              ...(screeningId && { screeningId }),
              ...(programId && { programId })
            }
          }),
          db.candidate.count({
            where: {
              hasWritten: true,
              ...(screeningId && { screeningId }),
              ...(programId && { programId })
            }
          }),
          db.testScore.count({
            where: {
              ...(screeningId && {
                candidate: {
                  screeningId: screeningId
                }
              }),
              ...(programId && {
                candidate: {
                  programId: programId
                }
              })
            }
          })
        ])

        const averageScore = await db.testScore.aggregate({
          _avg: {
            marks: true
          },
          where: {
            ...(screeningId && {
              candidate: {
                screeningId: screeningId
              }
            }),
            ...(programId && {
              candidate: {
                programId: programId
              }
            })
          }
        })

        const passRateData = await db.candidate.groupBy({
          by: ["status"],
          _count: {
            id: true
          },
          where: {
            status: {
              in: ["PASSED", "FAILED"]
            },
            ...(screeningId && { screeningId }),
            ...(programId && { programId })
          }
        })

        const passed = passRateData.find(item => item.status === "PASSED")?._count.id || 0
        const failed = passRateData.find(item => item.status === "FAILED")?._count.id || 0
        const passRate = (passed + failed) > 0 ? (passed / (passed + failed)) * 100 : 0

        reportData = {
          totalCandidates,
          scoredCandidates,
          averageScore: averageScore._avg.marks || 0,
          passRate,
          totalTestScores,
          byStatus: passRateData.reduce((acc, item) => {
            acc[item.status] = item._count.id
            return acc
          }, {} as Record<string, number>)
        }
        break

      default:
        // General overview for staff
        const [candidatesCount, screeningsCount, programsCount, departmentsCount] = await Promise.all([
          db.candidate.count(),
          db.screening.count(),
          db.program.count(),
          db.department.count()
        ])

        reportData = {
          overview: {
            totalCandidates: candidatesCount,
            totalScreenings: screeningsCount,
            totalPrograms: programsCount,
            totalDepartments: departmentsCount
          },
          reportType: "staff-overview"
        }
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error("Failed to generate staff report:", error)
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

    // Check if user is staff
    if (session.user.role !== "STAFF") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { reportType, format, filters } = body

    // Generate different types of reports based on the request
    let reportData

    switch (reportType) {
      case "candidate-performance":
        reportData = await generateStaffCandidatePerformanceReport(filters)
        break
      case "screening-analysis":
        reportData = await generateStaffScreeningAnalysisReport(filters)
        break
      case "program-summary":
        reportData = await generateStaffProgramSummaryReport(filters)
        break
      case "department-performance":
        reportData = await generateStaffDepartmentPerformanceReport(filters)
        break
      case "attendance-report":
        reportData = await generateStaffAttendanceReport(filters)
        break
      case "scoring-summary":
        reportData = await generateStaffScoringSummaryReport(filters)
        break
      default:
        reportData = await generateStaffGeneralReport(filters)
    }

    return NextResponse.json({
      data: reportData,
      reportType,
      generatedAt: new Date().toISOString(),
      format: format || "json"
    })
  } catch (error) {
    console.error("Failed to generate staff report:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Helper functions for staff report generation
async function generateStaffCandidatePerformanceReport(filters: any) {
  const candidates = await db.candidate.findMany({
    include: {
      program: {
        include: {
          department: true
        }
      },
      screening: true,
      testScores: {
        include: {
          question: {
            include: {
              subject: true
            }
          }
        }
      }
    },
    where: {
      ...(filters.screeningId && { screeningId: filters.screeningId }),
      ...(filters.programId && { programId: filters.programId }),
      ...(filters.departmentId && {
        program: {
          departmentId: filters.departmentId
        }
      }),
      ...(filters.startDate && filters.endDate && {
        createdAt: {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate)
        }
      })
    },
    orderBy: {
      totalScore: 'desc'
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
    testScores: candidate.testScores.map(score => ({
      id: score.id,
      question: score.question.question,
      subject: score.question.subject.name,
      selectedAnswer: score.selectedAnswer,
      correctAnswer: score.question.correctAnswer,
      isCorrect: score.isCorrect,
      marks: score.marks,
      timeTaken: score.timeTaken
    }))
  }))
}

async function generateStaffScreeningAnalysisReport(filters: any) {
  const screenings = await db.screening.findMany({
    include: {
      academicSession: true,
      candidates: {
        include: {
          program: true
        }
      },
      questions: {
        include: {
          subject: true
        }
      },
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
      totalScore: candidate.totalScore,
      status: candidate.status
    })),
    questions: screening.questions.map(question => ({
      id: question.id,
      question: question.question,
      subject: question.subject.name,
      marks: question.marks,
      difficulty: question.difficulty
    }))
  }))
}

async function generateStaffProgramSummaryReport(filters: any) {
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

async function generateStaffDepartmentPerformanceReport(filters: any) {
  const departments = await db.department.findMany({
    include: {
      programs: {
        include: {
          candidates: {
            include: {
              screening: true
            }
          }
        }
      }
    },
    where: {
      ...(filters.startDate && filters.endDate && {
        programs: {
          some: {
            candidates: {
              some: {
                createdAt: {
                  gte: new Date(filters.startDate),
                  lte: new Date(filters.endDate)
                }
              }
            }
          }
        }
      })
    }
  })

  return departments.map(department => ({
    id: department.id,
    name: department.name,
    totalPrograms: department.programs.length,
    totalCandidates: department.programs.reduce((sum, program) => sum + program.candidates.length, 0),
    programs: department.programs.map(program => ({
      id: program.id,
      name: program.name,
      code: program.code,
      candidatesCount: program.candidates.length,
      averageScore: program.candidates.length > 0 
        ? program.candidates.reduce((sum, candidate) => sum + (candidate.totalScore || 0), 0) / program.candidates.length 
        : 0,
      passedCandidates: program.candidates.filter(candidate => candidate.status === "PASSED").length,
      failedCandidates: program.candidates.filter(candidate => candidate.status === "FAILED").length
    }))
  }))
}

async function generateStaffAttendanceReport(filters: any) {
  const attendanceData = await db.candidate.groupBy({
    by: ["hasWritten", "status"],
    _count: {
      id: true
    },
    where: {
      ...(filters.screeningId && { screeningId: filters.screeningId }),
      ...(filters.programId && { programId: filters.programId }),
      ...(filters.departmentId && {
        program: {
          departmentId: filters.departmentId
        }
      }),
      ...(filters.startDate && filters.endDate && {
        createdAt: {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate)
        }
      })
    }
  })

  const totalCandidatesAttendance = await db.candidate.count({
    where: {
      ...(filters.screeningId && { screeningId: filters.screeningId }),
      ...(filters.programId && { programId: filters.programId }),
      ...(filters.departmentId && {
        program: {
          departmentId: filters.departmentId
        }
      }),
      ...(filters.startDate && filters.endDate && {
        createdAt: {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate)
        }
      })
    }
  })

  const writtenCandidates = attendanceData.find(item => item.hasWritten === true)?._count.id || 0
  const notWrittenCandidates = attendanceData.find(item => item.hasWritten === false)?._count.id || 0
  const attendanceRate = totalCandidatesAttendance > 0 ? (writtenCandidates / totalCandidatesAttendance) * 100 : 0

  return {
    totalCandidates: totalCandidatesAttendance,
    writtenCandidates,
    notWrittenCandidates,
    attendanceRate,
    breakdown: attendanceData
  }
}

async function generateStaffScoringSummaryReport(filters: any) {
  const [totalCandidates, scoredCandidates, totalTestScores] = await Promise.all([
    db.candidate.count({
      where: {
        ...(filters.screeningId && { screeningId: filters.screeningId }),
        ...(filters.programId && { programId: filters.programId }),
        ...(filters.departmentId && {
          program: {
            departmentId: filters.departmentId
          }
        })
      }
    }),
    db.candidate.count({
      where: {
        hasWritten: true,
        ...(filters.screeningId && { screeningId: filters.screeningId }),
        ...(filters.programId && { programId: filters.programId }),
        ...(filters.departmentId && {
          program: {
            departmentId: filters.departmentId
          }
        })
      }
    }),
    db.testScore.count({
      where: {
        ...(filters.screeningId && {
          candidate: {
            screeningId: filters.screeningId
          }
        }),
        ...(filters.programId && {
          candidate: {
            programId: filters.programId
          }
        }),
        ...(filters.departmentId && {
          candidate: {
            program: {
              departmentId: filters.departmentId
            }
          }
        })
      }
    })
  ])

  const averageScore = await db.testScore.aggregate({
    _avg: {
      marks: true
    },
    where: {
      ...(filters.screeningId && {
        candidate: {
          screeningId: filters.screeningId
        }
      }),
      ...(filters.programId && {
        candidate: {
          programId: filters.programId
        }
      }),
      ...(filters.departmentId && {
        candidate: {
          program: {
            departmentId: filters.departmentId
          }
        }
      })
    }
  })

  const passRateData = await db.candidate.groupBy({
    by: ["status"],
    _count: {
      id: true
    },
    where: {
      status: {
        in: ["PASSED", "FAILED"]
      },
      ...(filters.screeningId && { screeningId: filters.screeningId }),
      ...(filters.programId && { programId: filters.programId }),
      ...(filters.departmentId && {
        program: {
          departmentId: filters.departmentId
        }
      })
    }
  })

  const passed = passRateData.find(item => item.status === "PASSED")?._count.id || 0
  const failed = passRateData.find(item => item.status === "FAILED")?._count.id || 0
  const passRate = (passed + failed) > 0 ? (passed / (passed + failed)) * 100 : 0

  return {
    totalCandidates,
    scoredCandidates,
    averageScore: averageScore._avg.marks || 0,
    passRate,
    totalTestScores,
    byStatus: passRateData.reduce((acc, item) => {
      acc[item.status] = item._count.id
      return acc
    }, {} as Record<string, number>)
  }
}

async function generateStaffGeneralReport(filters: any) {
  const [candidatesCount, screeningsCount, programsCount, departmentsCount] = await Promise.all([
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
    db.program.count(),
    db.department.count()
  ])

  return {
    summary: {
      totalCandidates: candidatesCount,
      totalScreenings: screeningsCount,
      totalPrograms: programsCount,
      totalDepartments: departmentsCount
    },
    generatedAt: new Date().toISOString()
  }
}