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

    // Check if user is admin
    if (session.user.role !== "ADMIN" || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get("type")
    const screeningId = searchParams.get("screeningId")
    const programId = searchParams.get("programId")
    const departmentId = searchParams.get("departmentId")

    let reportData

    switch (reportType) {
      case "system-overview":
        // Get complete system overview for admin
        const [totalCandidates, totalScreenings, totalPrograms, totalDepartments, totalQuestions, totalUsers] = await Promise.all([
          db.candidate.count(),
          db.screening.count(),
          db.program.count(),
          db.department.count(),
          db.question.count({ where: { isActive: true } }),
          db.user.count()
        ])

        const [activeCandidates, activeScreenings, activePrograms, activeQuestions] = await Promise.all([
          db.candidate.count({ where: { status: "REGISTERED" } }),
          db.screening.count({ where: { status: "ACTIVE" } }),
          db.program.count({ where: { isActive: true } }),
          db.question.count({ where: { isActive: true } })
        ])

        const [writtenCandidates, passedCandidates, failedCandidates] = await Promise.all([
          db.candidate.count({ where: { hasWritten: true } }),
          db.candidate.count({ where: { status: "PASSED" } }),
          db.candidate.count({ where: { status: "FAILED" } })
        ])

        reportData = {
          system: {
            totalCandidates,
            totalScreenings,
            totalPrograms,
            totalDepartments,
            totalQuestions,
            totalUsers,
            activeCandidates,
            activeScreenings,
            activePrograms,
            activeQuestions,
            writtenCandidates,
            passedCandidates,
            failedCandidates
          },
          reportType: "system-overview"
        }
        break

      case "user-activity":
        // Get user activity report for admin
        const users = await db.user.findMany({
          include: {
            _count: {
              select: {
                sessions: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        })

        const userStats = await db.user.groupBy({
          by: ["role"],
          _count: {
            id: true
          }
        })

        reportData = {
          users: users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            sessionCount: user._count.sessions
          })),
          stats: userStats
        }
        break

      case "candidate-performance":
        // Get detailed candidate performance for admin
        const candidates = await db.candidate.findMany({
          include: {
            program: {
              include: {
                department: true
              }
            },
            screening: {
              include: {
                academicSession: true
              }
            },
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
            ...(departmentId && {
              program: {
                departmentId: departmentId
              }
            })
          },
          orderBy: {
            createdAt: 'desc'
          }
        })

        reportData = candidates.map(candidate => ({
          id: candidate.id,
          name: `${candidate.firstName} ${candidate.lastName}`,
          registrationNumber: candidate.registrationNumber,
          email: candidate.email,
          phone: candidate.phone,
          program: candidate.program.name,
          department: candidate.program.department.name,
          screening: candidate.screening.name,
          academicSession: candidate.screening.academicSession.name,
          hasWritten: candidate.hasWritten,
          totalScore: candidate.totalScore,
          percentage: candidate.percentage,
          status: candidate.status,
          createdAt: candidate.createdAt,
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

      case "screening-analysis":
        // Get comprehensive screening analysis for admin
        const screenings = await db.screening.findMany({
          include: {
            academicSession: true,
            candidates: {
              include: {
                program: {
                  include: {
                    department: true
                  }
                }
              }
            },
            questions: {
              include: {
                subject: true
              }
            },
            programTests: {
              include: {
                program: true
              }
            },
            _count: {
              select: {
                candidates: true,
                questions: true,
                programTests: true
              }
            }
          },
          orderBy: {
            startDate: 'desc'
          }
        })

        reportData = screenings.map(screening => ({
          id: screening.id,
          name: screening.name,
          description: screening.description,
          academicSession: screening.academicSession.name,
          status: screening.status,
          duration: screening.duration,
          totalMarks: screening.totalMarks,
          passMarks: screening.passMarks,
          startDate: screening.startDate,
          endDate: screening.endDate,
          totalCandidates: screening._count.candidates,
          totalQuestions: screening._count.questions,
          totalProgramTests: screening._count.programTests,
          candidates: screening.candidates.map(candidate => ({
            id: candidate.id,
            name: `${candidate.firstName} ${candidate.lastName}`,
            program: candidate.program.name,
            department: candidate.program.department.name,
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
          })),
          programTests: screening.programTests.map(programTest => ({
            id: programTest.id,
            program: programTest.program.name,
            isActive: programTest.isActive
          }))
        }))
        break

      case "program-analysis":
        // Get comprehensive program analysis for admin
        const programs = await db.program.findMany({
          include: {
            department: true,
            candidates: {
              include: {
                screening: true
              }
            },
            programTests: {
              include: {
                screening: true
              }
            },
            _count: {
              select: {
                candidates: true,
                programTests: true
              }
            }
          },
          orderBy: {
            name: 'asc'
          }
        })

        reportData = programs.map(program => ({
          id: program.id,
          name: program.name,
          code: program.code,
          level: program.level,
          description: program.description,
          department: program.department.name,
          cutOffMark: program.cutOffMark,
          maxCapacity: program.maxCapacity,
          isActive: program.isActive,
          totalCandidates: program._count.candidates,
          totalProgramTests: program._count.programTests,
          candidates: program.candidates.map(candidate => ({
            id: candidate.id,
            name: `${candidate.firstName} ${candidate.lastName}`,
            registrationNumber: candidate.registrationNumber,
            hasWritten: candidate.hasWritten,
            totalScore: candidate.totalScore,
            screening: candidate.screening.name,
            status: candidate.status
          })),
          programTests: program.programTests.map(programTest => ({
            id: programTest.id,
            screening: programTest.screening.name,
            isActive: programTest.isActive
          }))
        }))
        break

      case "department-analysis":
        // Get comprehensive department analysis for admin
        const departments = await db.department.findMany({
          include: {
            programs: {
              include: {
                candidates: {
                  include: {
                    screening: true
                  }
                },
                programTests: {
                  include: {
                    screening: true
                  }
                }
              }
            }
          },
          orderBy: {
            name: 'asc'
          }
        })

        reportData = departments.map(department => ({
          id: department.id,
          name: department.name,
          description: department.description,
          totalPrograms: department.programs.length,
          totalCandidates: department.programs.reduce((sum, program) => sum + program.candidates.length, 0),
          totalProgramTests: department.programs.reduce((sum, program) => sum + program.programTests.length, 0),
          programs: department.programs.map(program => ({
            id: program.id,
            name: program.name,
            code: program.code,
            level: program.level,
            candidatesCount: program.candidates.length,
            programTestsCount: program.programTests.length,
            averageScore: program.candidates.length > 0 
              ? program.candidates.reduce((sum, candidate) => sum + (candidate.totalScore || 0), 0) / program.candidates.length 
              : 0,
            passedCandidates: program.candidates.filter(candidate => candidate.status === "PASSED").length,
            failedCandidates: program.candidates.filter(candidate => candidate.status === "FAILED").length,
            admittedCandidates: program.candidates.filter(candidate => candidate.status === "ADMITTED").length,
            rejectedCandidates: program.candidates.filter(candidate => candidate.status === "REJECTED").length
          }))
        }))
        break

      case "financial-summary":
        // Get financial summary for admin
        const candidatePayments = await db.candidate.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
            registrationNumber: true,
            program: {
              select: {
                name: true,
                department: {
                  select: {
                    name: true
                  }
                }
              }
            },
            status: true,
            createdAt: true
          }
        })

        const paymentStats = {
          totalCandidates: candidatePayments.length,
          registeredCandidates: candidatePayments.filter(c => c.status === "REGISTERED").length,
          admittedCandidates: candidatePayments.filter(c => c.status === "ADMITTED").length,
          rejectedCandidates: candidatePayments.filter(c => c.status === "REJECTED").length,
          revenueByDepartment: candidatePayments.reduce((acc, candidate) => {
            const dept = candidate.program.department.name
            if (!acc[dept]) {
              acc[dept] = { count: 0, admitted: 0 }
            }
            acc[dept].count++
            if (candidate.status === "ADMITTED") {
              acc[dept].admitted++
            }
            return acc
          }, {} as Record<string, { count: number; admitted: number }>)
        }

        reportData = {
          candidates: candidatePayments,
          stats: paymentStats
        }
        break

      case "compliance-report":
        // Get compliance report for admin
        const complianceData = await db.candidate.findMany({
          include: {
            program: {
              include: {
                department: true
              }
            },
            screening: true
          },
          where: {
            status: {
              in: ["ADMITTED", "REJECTED"]
            }
          }
        })

        const complianceStats = {
          totalProcessed: complianceData.length,
          admitted: complianceData.filter(c => c.status === "ADMITTED").length,
          rejected: complianceData.filter(c => c.status === "REJECTED").length,
          byDepartment: complianceData.reduce((acc, candidate) => {
            const dept = candidate.program.department.name
            if (!acc[dept]) {
              acc[dept] = { admitted: 0, rejected: 0 }
            }
            if (candidate.status === "ADMITTED") {
              acc[dept].admitted++
            } else {
              acc[dept].rejected++
            }
            return acc
          }, {} as Record<string, { admitted: number; rejected: number }>)
        }

        reportData = {
          candidates: complianceData,
          stats: complianceStats
        }
        break

      default:
        // Default admin overview
        const [totalCandidatesAdmin, totalScreeningsAdmin, totalProgramsAdmin, totalDepartmentsAdmin] = await Promise.all([
          db.candidate.count(),
          db.screening.count(),
          db.program.count(),
          db.department.count()
        ])

        reportData = {
          overview: {
            totalCandidates: totalCandidatesAdmin,
            totalScreenings: totalScreeningsAdmin,
            totalPrograms: totalProgramsAdmin,
            totalDepartments: totalDepartmentsAdmin
          },
          reportType: "admin-overview"
        }
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error("Failed to generate admin report:", error)
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

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { reportType, format, filters } = body

    // Generate different types of reports based on the request
    let reportData

    switch (reportType) {
      case "system-overview":
        reportData = await generateAdminSystemOverviewReport(filters)
        break
      case "user-activity":
        reportData = await generateAdminUserActivityReport(filters)
        break
      case "candidate-performance":
        reportData = await generateAdminCandidatePerformanceReport(filters)
        break
      case "screening-analysis":
        reportData = await generateAdminScreeningAnalysisReport(filters)
        break
      case "program-analysis":
        reportData = await generateAdminProgramAnalysisReport(filters)
        break
      case "department-analysis":
        reportData = await generateAdminDepartmentAnalysisReport(filters)
        break
      case "financial-summary":
        reportData = await generateAdminFinancialSummaryReport(filters)
        break
      case "compliance-report":
        reportData = await generateAdminComplianceReport(filters)
        break
      default:
        reportData = await generateAdminGeneralReport(filters)
    }

    return NextResponse.json({
      data: reportData,
      reportType,
      generatedAt: new Date().toISOString(),
      format: format || "json"
    })
  } catch (error) {
    console.error("Failed to generate admin report:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Helper functions for admin report generation
async function generateAdminSystemOverviewReport(filters: any) {
  const [totalCandidates, totalScreenings, totalPrograms, totalDepartments, totalQuestions, totalUsers] = await Promise.all([
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
    db.department.count(),
    db.question.count({ where: { isActive: true } }),
    db.user.count()
  ])

  const [activeCandidates, activeScreenings, activePrograms, activeQuestions] = await Promise.all([
    db.candidate.count({ where: { status: "REGISTERED" } }),
    db.screening.count({ where: { status: "ACTIVE" } }),
    db.program.count({ where: { isActive: true } }),
    db.question.count({ where: { isActive: true } })
  ])

  const [writtenCandidates, passedCandidates, failedCandidates] = await Promise.all([
    db.candidate.count({ where: { hasWritten: true } }),
    db.candidate.count({ where: { status: "PASSED" } }),
    db.candidate.count({ where: { status: "FAILED" } })
  ])

  return {
    system: {
      totalCandidates,
      totalScreenings,
      totalPrograms,
      totalDepartments,
      totalQuestions,
      totalUsers,
      activeCandidates,
      activeScreenings,
      activePrograms,
      activeQuestions,
      writtenCandidates,
      passedCandidates,
      failedCandidates
    }
  }
}

async function generateAdminUserActivityReport(filters: any) {
  const users = await db.user.findMany({
    include: {
      _count: {
        select: {
          sessions: true
        }
      }
    },
    where: {
      ...(filters.role && { role: filters.role }),
      ...(filters.isActive !== undefined && { isActive: filters.isActive }),
      ...(filters.startDate && filters.endDate && {
        createdAt: {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate)
        }
      })
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const userStats = await db.user.groupBy({
    by: ["role"],
    _count: {
      id: true
    },
    where: {
      ...(filters.role && { role: filters.role }),
      ...(filters.isActive !== undefined && { isActive: filters.isActive })
    }
  })

  return {
    users: users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      sessionCount: user._count.sessions
    })),
    stats: userStats
  }
}

async function generateAdminCandidatePerformanceReport(filters: any) {
  const candidates = await db.candidate.findMany({
    include: {
      program: {
        include: {
          department: true
        }
      },
      screening: {
        include: {
          academicSession: true
        }
      },
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
      ...(filters.status && { status: filters.status }),
      ...(filters.startDate && filters.endDate && {
        createdAt: {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate)
        }
      })
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return candidates.map(candidate => ({
    id: candidate.id,
    name: `${candidate.firstName} ${candidate.lastName}`,
    registrationNumber: candidate.registrationNumber,
    email: candidate.email,
    phone: candidate.phone,
    program: candidate.program.name,
    department: candidate.program.department.name,
    screening: candidate.screening.name,
    academicSession: candidate.screening.academicSession.name,
    hasWritten: candidate.hasWritten,
    totalScore: candidate.totalScore,
    percentage: candidate.percentage,
    status: candidate.status,
    createdAt: candidate.createdAt,
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

async function generateAdminScreeningAnalysisReport(filters: any) {
  const screenings = await db.screening.findMany({
    include: {
      academicSession: true,
      candidates: {
        include: {
          program: {
            include: {
              department: true
            }
          }
        }
      },
      questions: {
        include: {
          subject: true
        }
      },
      programTests: {
        include: {
          program: true
        }
      },
      _count: {
        select: {
          candidates: true,
          questions: true,
          programTests: true
        }
      }
    },
    where: {
      ...(filters.academicSessionId && { academicSessionId: filters.academicSessionId }),
      ...(filters.status && { status: filters.status }),
      ...(filters.startDate && filters.endDate && {
        startDate: {
          gte: new Date(filters.startDate)
        },
        endDate: {
          lte: new Date(filters.endDate)
        }
      })
    },
    orderBy: {
      startDate: 'desc'
    }
  })

  return screenings.map(screening => ({
    id: screening.id,
    name: screening.name,
    description: screening.description,
    academicSession: screening.academicSession.name,
    status: screening.status,
    duration: screening.duration,
    totalMarks: screening.totalMarks,
    passMarks: screening.passMarks,
    startDate: screening.startDate,
    endDate: screening.endDate,
    totalCandidates: screening._count.candidates,
    totalQuestions: screening._count.questions,
    totalProgramTests: screening._count.programTests,
    candidates: screening.candidates.map(candidate => ({
      id: candidate.id,
      name: `${candidate.firstName} ${candidate.lastName}`,
      program: candidate.program.name,
      department: candidate.program.department.name,
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
    })),
    programTests: screening.programTests.map(programTest => ({
      id: programTest.id,
      program: programTest.program.name,
      isActive: programTest.isActive
    }))
  }))
}

async function generateAdminProgramAnalysisReport(filters: any) {
  const programs = await db.program.findMany({
    include: {
      department: true,
      candidates: {
        include: {
          screening: true
        }
      },
      programTests: {
        include: {
          screening: true
        }
      },
      _count: {
        select: {
          candidates: true,
          programTests: true
        }
      }
    },
    where: {
      ...(filters.departmentId && { departmentId: filters.departmentId }),
      ...(filters.isActive !== undefined && { isActive: filters.isActive }),
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
    },
    orderBy: {
      name: 'asc'
    }
  })

  return programs.map(program => ({
    id: program.id,
    name: program.name,
    code: program.code,
    level: program.level,
    description: program.description,
    department: program.department.name,
    cutOffMark: program.cutOffMark,
    maxCapacity: program.maxCapacity,
    isActive: program.isActive,
    totalCandidates: program._count.candidates,
    totalProgramTests: program._count.programTests,
    candidates: program.candidates.map(candidate => ({
      id: candidate.id,
      name: `${candidate.firstName} ${candidate.lastName}`,
      registrationNumber: candidate.registrationNumber,
      hasWritten: candidate.hasWritten,
      totalScore: candidate.totalScore,
      screening: candidate.screening.name,
      status: candidate.status
    })),
    programTests: program.programTests.map(programTest => ({
      id: programTest.id,
      screening: programTest.screening.name,
      isActive: programTest.isActive
    }))
  }))
}

async function generateAdminDepartmentAnalysisReport(filters: any) {
  const departments = await db.department.findMany({
    include: {
      programs: {
        include: {
          candidates: {
            include: {
              screening: true
            }
          },
          programTests: {
            include: {
              screening: true
            }
          }
        }
      }
    },
    where: {
      ...(filters.isActive !== undefined && { isActive: filters.isActive })
    },
    orderBy: {
      name: 'asc'
    }
  })

  return departments.map(department => ({
    id: department.id,
    name: department.name,
    description: department.description,
    totalPrograms: department.programs.length,
    totalCandidates: department.programs.reduce((sum, program) => sum + program.candidates.length, 0),
    totalProgramTests: department.programs.reduce((sum, program) => sum + program.programTests.length, 0),
    programs: department.programs.map(program => ({
      id: program.id,
      name: program.name,
      code: program.code,
      level: program.level,
      candidatesCount: program.candidates.length,
      programTestsCount: program.programTests.length,
      averageScore: program.candidates.length > 0 
        ? program.candidates.reduce((sum, candidate) => sum + (candidate.totalScore || 0), 0) / program.candidates.length 
        : 0,
      passedCandidates: program.candidates.filter(candidate => candidate.status === "PASSED").length,
      failedCandidates: program.candidates.filter(candidate => candidate.status === "FAILED").length,
      admittedCandidates: program.candidates.filter(candidate => candidate.status === "ADMITTED").length,
      rejectedCandidates: program.candidates.filter(candidate => candidate.status === "REJECTED").length
    }))
  }))
}

async function generateAdminFinancialSummaryReport(filters: any) {
  const candidatePayments = await db.candidate.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      registrationNumber: true,
      program: {
        select: {
          name: true,
          department: {
            select: {
              name: true
            }
          }
        }
      },
      status: true,
      createdAt: true
    },
    where: {
      ...(filters.departmentId && {
        program: {
          departmentId: filters.departmentId
        }
      }),
      ...(filters.status && { status: filters.status }),
      ...(filters.startDate && filters.endDate && {
        createdAt: {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate)
        }
      })
    }
  })

  const paymentStats = {
    totalCandidates: candidatePayments.length,
    registeredCandidates: candidatePayments.filter(c => c.status === "REGISTERED").length,
    admittedCandidates: candidatePayments.filter(c => c.status === "ADMITTED").length,
    rejectedCandidates: candidatePayments.filter(c => c.status === "REJECTED").length,
    revenueByDepartment: candidatePayments.reduce((acc, candidate) => {
      const dept = candidate.program.department.name
      if (!acc[dept]) {
        acc[dept] = { count: 0, admitted: 0 }
      }
      acc[dept].count++
      if (candidate.status === "ADMITTED") {
        acc[dept].admitted++
      }
      return acc
    }, {} as Record<string, { count: number; admitted: number }>)
  }

  return {
    candidates: candidatePayments,
    stats: paymentStats
  }
}

async function generateAdminComplianceReport(filters: any) {
  const complianceData = await db.candidate.findMany({
    include: {
      program: {
        include: {
          department: true
        }
      },
      screening: true
    },
    where: {
      status: {
        in: ["ADMITTED", "REJECTED"]
      },
      ...(filters.departmentId && {
        program: {
          departmentId: filters.departmentId
        }
      }),
      ...(filters.screeningId && { screeningId: filters.screeningId }),
      ...(filters.startDate && filters.endDate && {
        createdAt: {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate)
        }
      })
    }
  })

  const complianceStats = {
    totalProcessed: complianceData.length,
    admitted: complianceData.filter(c => c.status === "ADMITTED").length,
    rejected: complianceData.filter(c => c.status === "REJECTED").length,
    byDepartment: complianceData.reduce((acc, candidate) => {
      const dept = candidate.program.department.name
      if (!acc[dept]) {
        acc[dept] = { admitted: 0, rejected: 0 }
      }
      if (candidate.status === "ADMITTED") {
        acc[dept].admitted++
      } else {
        acc[dept].rejected++
      }
      return acc
    }, {} as Record<string, { admitted: number; rejected: number }>)
  }

  return {
    candidates: complianceData,
    stats: complianceStats
  }
}

async function generateAdminGeneralReport(filters: any) {
  const [totalCandidates, totalScreenings, totalPrograms, totalDepartments] = await Promise.all([
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
      totalCandidates,
      totalScreenings,
      totalPrograms,
      totalDepartments
    },
    generatedAt: new Date().toISOString()
  }
}