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

    // Check if user is an examiner
    if (session.user.role !== "EXAMINER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get("type")
    const screeningId = searchParams.get("screeningId")

    let reportData

    switch (reportType) {
      case "candidate-performance":
        // Get candidate performance data for examiner's screenings
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
            // Only show candidates from screenings that have questions created by this examiner
            screening: {
              questions: {
                some: {
                  // This would need to be adjusted based on your actual examiner-question relationship
                  // For now, we'll include all screenings
                }
              }
            }
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
        // Get screening summary for examiner
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
            // Only show screenings that have questions created by this examiner
            // This would need to be adjusted based on your actual examiner-question relationship
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

      case "question-analysis":
        // Get question analysis for examiner's questions
        const questions = await db.question.findMany({
          include: {
            subject: true,
            screening: true,
            testScores: {
              include: {
                candidate: true
              }
            }
          },
          where: {
            // Only show questions created by this examiner
            // This would need to be adjusted based on your actual examiner-question relationship
          }
        })

        reportData = questions.map(question => ({
          id: question.id,
          question: question.question,
          subject: question.subject.name,
          screening: question.screening?.name,
          marks: question.marks,
          difficulty: question.difficulty,
          isActive: question.isActive,
          totalAttempts: question.testScores.length,
          correctAttempts: question.testScores.filter(score => score.isCorrect).length,
          incorrectAttempts: question.testScores.filter(score => score.isCorrect === false).length,
          successRate: question.testScores.length > 0 
            ? (question.testScores.filter(score => score.isCorrect).length / question.testScores.length) * 100 
            : 0,
          averageTime: question.testScores.length > 0 
            ? question.testScores.reduce((sum, score) => sum + (score.timeTaken || 0), 0) / question.testScores.length 
            : 0
        }))
        break

      case "scoring-stats":
        // Get scoring statistics for examiner
        const [totalCandidates, scoredCandidates, totalTestScores] = await Promise.all([
          db.candidate.count({
            where: {
              // Only count candidates from examiner's screenings
              screening: {
                questions: {
                  some: {
                    // This would need to be adjusted based on your actual examiner-question relationship
                  }
                }
              }
            }
          }),
          db.candidate.count({
            where: {
              hasWritten: true,
              // Only count candidates from examiner's screenings
              screening: {
                questions: {
                  some: {
                    // This would need to be adjusted based on your actual examiner-question relationship
                  }
                }
              }
            }
          }),
          db.testScore.count({
            where: {
              // Only count test scores from examiner's questions
              question: {
                // This would need to be adjusted based on your actual examiner-question relationship
              }
            }
          })
        ])

        const averageScore = await db.testScore.aggregate({
          _avg: {
            marks: true
          },
          where: {
            // Only average test scores from examiner's questions
            question: {
              // This would need to be adjusted based on your actual examiner-question relationship
            }
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
            // Only count candidates from examiner's screenings
            screening: {
              questions: {
                some: {
                  // This would need to be adjusted based on your actual examiner-question relationship
                }
              }
            }
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
        // General overview for examiner
        const [candidatesCount, screeningsCount, questionsCount] = await Promise.all([
          db.candidate.count({
            where: {
              // Only count candidates from examiner's screenings
              screening: {
                questions: {
                  some: {
                    // This would need to be adjusted based on your actual examiner-question relationship
                  }
                }
              }
            }
          }),
          db.screening.count({
            where: {
              // Only count screenings with examiner's questions
              questions: {
                some: {
                  // This would need to be adjusted based on your actual examiner-question relationship
                }
              }
            }
          }),
          db.question.count({
            where: {
              isActive: true,
              // Only count examiner's questions
              // This would need to be adjusted based on your actual examiner-question relationship
            }
          })
        ])

        reportData = {
          overview: {
            totalCandidates: candidatesCount,
            totalScreenings: screeningsCount,
            totalQuestions: questionsCount
          },
          reportType: "examiner-overview"
        }
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error("Failed to generate examiner report:", error)
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

    // Check if user is an examiner
    if (session.user.role !== "EXAMINER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { reportType, format, filters } = body

    // Generate different types of reports based on the request
    let reportData

    switch (reportType) {
      case "candidate-performance":
        reportData = await generateExaminerCandidatePerformanceReport(filters)
        break
      case "screening-analysis":
        reportData = await generateExaminerScreeningAnalysisReport(filters)
        break
      case "question-analysis":
        reportData = await generateExaminerQuestionAnalysisReport(filters)
        break
      case "scoring-summary":
        reportData = await generateExaminerScoringSummaryReport(filters)
        break
      default:
        reportData = await generateExaminerGeneralReport(filters)
    }

    return NextResponse.json({
      data: reportData,
      reportType,
      generatedAt: new Date().toISOString(),
      format: format || "json"
    })
  } catch (error) {
    console.error("Failed to generate examiner report:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Helper functions for examiner report generation
async function generateExaminerCandidatePerformanceReport(filters: any) {
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
      // Only show candidates from screenings that have questions created by examiner
      screening: {
        questions: {
          some: {
            // This would need to be adjusted based on your actual examiner-question relationship
          }
        }
      },
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

async function generateExaminerScreeningAnalysisReport(filters: any) {
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
      // Only show screenings that have questions created by examiner
      questions: {
        some: {
          // This would need to be adjusted based on your actual examiner-question relationship
        }
      },
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

async function generateExaminerQuestionAnalysisReport(filters: any) {
  const questions = await db.question.findMany({
    include: {
      subject: true,
      screening: true,
      testScores: {
        include: {
          candidate: true
        }
      }
    },
    where: {
      ...(filters.subjectId && { subjectId: filters.subjectId }),
      ...(filters.screeningId && { screeningId: filters.screeningId }),
      // Only show questions created by this examiner
      // This would need to be adjusted based on your actual examiner-question relationship
      ...(filters.startDate && filters.endDate && {
        createdAt: {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate)
        }
      })
    }
  })

  return questions.map(question => ({
    id: question.id,
    question: question.question,
    subject: question.subject.name,
    screening: question.screening?.name,
    marks: question.marks,
    difficulty: question.difficulty,
    isActive: question.isActive,
    totalAttempts: question.testScores.length,
    correctAttempts: question.testScores.filter(score => score.isCorrect).length,
    incorrectAttempts: question.testScores.filter(score => score.isCorrect === false).length,
    successRate: question.testScores.length > 0 
      ? (question.testScores.filter(score => score.isCorrect).length / question.testScores.length) * 100 
      : 0,
    averageTime: question.testScores.length > 0 
      ? question.testScores.reduce((sum, score) => sum + (score.timeTaken || 0), 0) / question.testScores.length 
      : 0
  }))
}

async function generateExaminerScoringSummaryReport(filters: any) {
  const [totalCandidates, scoredCandidates, totalTestScores] = await Promise.all([
    db.candidate.count({
      where: {
        ...(filters.screeningId && { screeningId: filters.screeningId }),
        // Only count candidates from examiner's screenings
        screening: {
          questions: {
            some: {
              // This would need to be adjusted based on your actual examiner-question relationship
            }
          }
        }
      }
    }),
    db.candidate.count({
      where: {
        hasWritten: true,
        ...(filters.screeningId && { screeningId: filters.screeningId }),
        // Only count candidates from examiner's screenings
        screening: {
          questions: {
            some: {
              // This would need to be adjusted based on your actual examiner-question relationship
            }
          }
        }
      }
    }),
    db.testScore.count({
      where: {
        // Only count test scores from examiner's questions
        question: {
          // This would need to be adjusted based on your actual examiner-question relationship
        }
      }
    })
  ])

  const averageScore = await db.testScore.aggregate({
    _avg: {
      marks: true
    },
    where: {
      // Only average test scores from examiner's questions
      question: {
        // This would need to be adjusted based on your actual examiner-question relationship
      }
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
      // Only count candidates from examiner's screenings
      screening: {
        questions: {
          some: {
            // This would need to be adjusted based on your actual examiner-question relationship
          }
        }
      }
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

async function generateExaminerGeneralReport(filters: any) {
  const [candidatesCount, screeningsCount, questionsCount] = await Promise.all([
    db.candidate.count({
      where: {
        ...(filters.screeningId && { screeningId: filters.screeningId }),
        // Only count candidates from examiner's screenings
        screening: {
          questions: {
            some: {
              // This would need to be adjusted based on your actual examiner-question relationship
            }
          }
        }
      }
    }),
    db.screening.count({
      where: {
        // Only count screenings with examiner's questions
        questions: {
          some: {
            // This would need to be adjusted based on your actual examiner-question relationship
          }
        }
      }
    }),
    db.question.count({
      where: {
        isActive: true,
        // Only count examiner's questions
        // This would need to be adjusted based on your actual examiner-question relationship
      }
    })
  ])

  return {
    summary: {
      totalCandidates: candidatesCount,
      totalScreenings: screeningsCount,
      totalQuestions: questionsCount
    },
    generatedAt: new Date().toISOString()
  }
}