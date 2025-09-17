import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get candidate profile from database
    const candidate = await prisma.candidate.findFirst({
      where: {
        email: session.user.email
      },
      include: {
        screening: true,
        program: true
      }
    })

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    // Format the response
    const profile = {
      id: candidate.id,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      middleName: candidate.middleName,
      email: candidate.email,
      phone: candidate.phone,
      dateOfBirth: candidate.dateOfBirth.toISOString(),
      gender: candidate.gender,
      stateOfOrigin: candidate.stateOfOrigin,
      lga: candidate.lga,
      schoolName: candidate.schoolName,
      graduationYear: candidate.graduationYear,
      olevelResults: candidate.olevelResults,
      registrationNumber: candidate.registrationNumber,
      hasWritten: candidate.hasWritten,
      totalScore: candidate.totalScore,
      percentage: candidate.percentage,
      status: candidate.status
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching candidate profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { phone, stateOfOrigin, lga } = body

    // Update candidate profile
    const updatedCandidate = await prisma.candidate.updateMany({
      where: {
        email: session.user.email
      },
      data: {
        phone,
        stateOfOrigin,
        lga
      }
    })

    if (updatedCandidate.count === 0) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    // Get the updated candidate
    const candidate = await prisma.candidate.findFirst({
      where: {
        email: session.user.email
      }
    })

    return NextResponse.json(candidate)
  } catch (error) {
    console.error('Error updating candidate profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}