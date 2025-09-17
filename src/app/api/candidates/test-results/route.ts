import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get candidate from database
    const candidate = await db.candidate.findFirst({
      where: {
        email: session.user.email
      }
    })

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    // Get test scores for the candidate
    const testScores = await db.testScore.findMany({
      where: {
        candidateId: candidate.id
      },
      include: {
        question: {
          include: {
            subject: true,
            screening: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Group test scores by screening
    const screeningResults = new Map()
    
    for (const score of testScores) {
      const screeningId = score.question.screening?.id
      if (!screeningId) continue

      if (!screeningResults.has(screeningId)) {
        screeningResults.set(screeningId, {
          id: screeningId,
          screeningName: score.question.screening?.name || 'Unknown Test',
          date: score.createdAt.toISOString(),
          totalScore: 0,
          maxScore: 0,
          questionsAnswered: 0,
          totalQuestions: 0,
          testScores: []
        })
      }

      const result = screeningResults.get(screeningId)
      result.testScores.push(score)
      result.totalScore += score.marks || 0
      result.maxScore += score.question.marks || 0
      result.questionsAnswered += score.selectedAnswer ? 1 : 0
      result.totalQuestions += 1
    }

    // Calculate percentages and determine status
    const results = Array.from(screeningResults.values()).map(result => {
      const percentage = result.maxScore > 0 ? Math.round((result.totalScore / result.maxScore) * 100) : 0
      let status = 'PENDING'
      
      if (result.questionsAnswered === result.totalQuestions) {
        status = percentage >= 50 ? 'PASSED' : 'FAILED'
      }

      return {
        ...result,
        percentage,
        status
      }
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error fetching candidate test results:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}