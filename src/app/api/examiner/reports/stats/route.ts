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

    // Get examiner-specific statistics
    const [
      totalCandidates,
      scoredCandidates,
      totalScreenings,
      totalQuestions,
      totalTestScores,
      averageScore,
      passRateData,
      recentReports
    ] = await Promise.all([
      // Total candidates from examiner's screenings
      db.candidate.count({
        where: {
          screening: {
            questions: {
              some: {
                // This would need to be adjusted based on your actual examiner-question relationship
                // For now, we'll include all candidates
              }
            }
          }
        }
      }),

      // Candidates who have written tests
      db.candidate.count({
        where: {
          hasWritten: true,
          screening: {
            questions: {
              some: {
                // This would need to be adjusted based on your actual examiner-question relationship
              }
            }
          }
        }
      }),

      // Total screenings with examiner's questions
      db.screening.count({
        where: {
          questions: {
            some: {
              // This would need to be adjusted based on your actual examiner-question relationship
            }
          }
        }
      }),

      // Total questions by examiner
      db.question.count({
        where: {
          isActive: true
          // This would need to be adjusted based on your actual examiner-question relationship
        }
      }),

      // Total test scores
      db.testScore.count({
        where: {
          question: {
            // This would need to be adjusted based on your actual examiner-question relationship
          }
        }
      }),

      // Average score
      db.testScore.aggregate({
        _avg: {
          marks: true
        },
        where: {
          question: {
            // This would need to be adjusted based on your actual examiner-question relationship
          }
        }
      }),

      // Pass rate data
      db.candidate.groupBy({
        by: ["status"],
        _count: {
          id: true
        },
        where: {
          status: {
            in: ["PASSED", "FAILED"]
          },
          screening: {
            questions: {
              some: {
                // This would need to be adjusted based on your actual examiner-question relationship
              }
            }
          }
        }
      }),

      // Recent reports (mock data for now)
      // In a real implementation, you would query a reports table
      Promise.resolve(5)
    ])

    const passed = passRateData.find(item => item.status === "PASSED")?._count.id || 0
    const failed = passRateData.find(item => item.status === "FAILED")?._count.id || 0
    const passRate = (passed + failed) > 0 ? (passed / (passed + failed)) * 100 : 0

    const stats = {
      totalReports: recentReports,
      totalDownloads: Math.floor(recentReports * 0.8), // Mock calculation
      recentReports,
      popularReport: "Candidate Performance Report",
      screeningsCompleted: totalScreenings,
      averageScore: averageScore._avg.marks || 0,
      passRate
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Failed to fetch examiner report stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}