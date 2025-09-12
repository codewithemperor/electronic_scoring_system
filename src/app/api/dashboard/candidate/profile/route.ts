import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    // Get user info from headers (set by middleware)
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId || userRole !== UserRole.CANDIDATE) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get candidate profile with user data
    const candidate = await db.candidate.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            status: true
          }
        },
        applications: {
          include: {
            program: {
              select: {
                name: true,
                code: true,
                department: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate profile not found' },
        { status: 404 }
      )
    }

    // Calculate profile completion percentage
    const profileFields = [
      candidate.utmeScore,
      candidate.birthDate,
      candidate.gender,
      candidate.stateOfOrigin,
      candidate.lga,
      candidate.address,
      candidate.passportPhoto
    ]
    
    const completedFields = profileFields.filter(field => field !== null && field !== undefined).length
    const profileCompletion = Math.round((completedFields / profileFields.length) * 100)

    // Get screening records for scores
    const screeningRecords = await db.screeningRecord.findMany({
      where: { candidateId: candidate.id },
      include: {
        criteria: {
          select: {
            name: true,
            weight: true
          }
        }
      }
    })

    // Calculate total screening score
    let totalScore = 0
    let maxScore = 0
    screeningRecords.forEach(record => {
      totalScore += record.score
      maxScore += record.criteria.weight * 10 // Assuming max score per criteria is 10 * weight
    })

    const screeningPercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

    // Format applications
    const applications = candidate.applications.map(app => ({
      id: `APP${app.id.slice(-6).toUpperCase()}`,
      program: app.program.name,
      status: app.status.replace('_', ' '),
      appliedDate: app.createdAt.toLocaleDateString(),
      screeningScore: app.totalScore
    }))

    // Format screening progress
    const screeningProgress = [
      {
        step: 'Profile Completion',
        status: profileCompletion === 100 ? 'completed' : profileCompletion > 0 ? 'in_progress' : 'pending',
        description: 'Basic information and documents'
      },
      {
        step: 'Application Submission',
        status: applications.length > 0 ? 'completed' : 'pending',
        description: 'Program applications submitted'
      },
      {
        step: 'Document Verification',
        status: candidate.screeningStatus === 'IN_PROGRESS' ? 'in_progress' : 
                candidate.screeningStatus === 'COMPLETED' ? 'completed' : 'pending',
        description: 'Academic documents under review'
      },
      {
        step: 'Screening Evaluation',
        status: screeningRecords.length > 0 ? 'in_progress' : 'pending',
        description: 'Awaiting screening assessment'
      },
      {
        step: 'Final Decision',
        status: candidate.screeningStatus === 'PASSED' || candidate.screeningStatus === 'FAILED' ? 'completed' : 'pending',
        description: 'Admission decision pending'
      }
    ]

    // Required documents (mock data - in real app this would come from database)
    const requiredDocuments = [
      {
        name: 'JAMB Result Slip',
        status: candidate.utmeScore ? 'uploaded' : 'pending',
        uploadDate: candidate.utmeScore ? new Date().toLocaleDateString() : null
      },
      {
        name: 'O\'Level Results',
        status: candidate.oLevelResults ? 'uploaded' : 'pending',
        uploadDate: candidate.oLevelResults ? new Date().toLocaleDateString() : null
      },
      {
        name: 'Birth Certificate',
        status: candidate.birthDate ? 'uploaded' : 'pending',
        uploadDate: candidate.birthDate ? new Date().toLocaleDateString() : null
      },
      {
        name: 'Local Government Certificate',
        status: candidate.lga ? 'uploaded' : 'pending',
        uploadDate: candidate.lga ? new Date().toLocaleDateString() : null
      },
      {
        name: 'Passport Photograph',
        status: candidate.passportPhoto ? 'uploaded' : 'pending',
        uploadDate: candidate.passportPhoto ? new Date().toLocaleDateString() : null
      }
    ]

    return NextResponse.json({
      profile: {
        firstName: candidate.user.firstName,
        lastName: candidate.user.lastName,
        jambNumber: candidate.jambNumber,
        utmeScore: candidate.utmeScore || 0,
        screeningStatus: candidate.screeningStatus,
        profileCompletion
      },
      applications,
      screeningProgress,
      requiredDocuments,
      totalScore: screeningPercentage
    })

  } catch (error) {
    console.error('Error fetching candidate profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}