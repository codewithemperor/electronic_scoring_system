import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, generateToken } from '@/lib/auth'
import { UserRole, UserStatus } from '@prisma/client'
import { z } from 'zod'

// Validation schema for candidate registration
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  jambNumber: z.string().min(1, 'JAMB number is required'),
  utmeScore: z.number().min(0).max(400).optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  stateOfOrigin: z.string().optional(),
  lga: z.string().optional(),
  address: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Check if JAMB number already exists
    const existingCandidate = await db.candidate.findUnique({
      where: { jambNumber: validatedData.jambNumber }
    })

    if (existingCandidate) {
      return NextResponse.json(
        { error: 'Candidate with this JAMB number already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create user and candidate profile in a transaction
    const result = await db.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          phone: validatedData.phone,
          role: UserRole.CANDIDATE,
          status: UserStatus.PENDING,
          emailVerified: false
        }
      })

      // Create candidate profile
      const candidate = await prisma.candidate.create({
        data: {
          userId: user.id,
          jambNumber: validatedData.jambNumber,
          utmeScore: validatedData.utmeScore,
          birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : null,
          gender: validatedData.gender,
          stateOfOrigin: validatedData.stateOfOrigin,
          lga: validatedData.lga,
          address: validatedData.address,
          screeningStatus: 'NOT_STARTED'
        }
      })

      return { user, candidate }
    })

    // Generate JWT token
    const token = generateToken({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role
    })

    // Create session record
    await db.session.create({
      data: {
        userId: result.user.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    // Log the registration action
    await db.auditLog.create({
      data: {
        userId: result.user.id,
        action: 'REGISTER',
        entityType: 'Candidate',
        entityId: result.candidate.id,
        newValues: { email: validatedData.email, jambNumber: validatedData.jambNumber },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    // Prepare response data
    const userData = {
      id: result.user.id,
      email: result.user.email,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      role: result.user.role,
      status: result.user.status,
      profile: result.candidate
    }

    return NextResponse.json({
      message: 'Registration successful. Please complete your profile.',
      token,
      user: userData
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}