import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole, UserStatus } from '@prisma/client'
import { hashPassword } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get user info from headers (set by middleware)
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId || userRole !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get all users with their profiles
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        lastLogin: true,
        superAdminProfile: {
          select: { id: true }
        },
        adminProfile: {
          select: { id: true }
        },
        staffProfile: {
          select: { id: true }
        },
        candidateProfile: {
          select: { id: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format user data
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.lastLogin?.toISOString()
    }))

    return NextResponse.json({
      users: formattedUsers
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user info from headers (set by middleware)
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId || userRole !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { firstName, lastName, email, phone, role, password } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !role || !password) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['ADMIN', 'STAFF'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Only ADMIN and STAFF roles can be created' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user and profile in a transaction
    const result = await db.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone: phone || null,
          role: role as UserRole,
          status: UserStatus.PENDING,
          emailVerified: false
        }
      })

      // Create role-specific profile
      let profile
      if (role === 'ADMIN') {
        profile = await prisma.admin.create({
          data: {
            userId: user.id
          }
        })
      } else if (role === 'STAFF') {
        // For staff, we need a department. Default to first department.
        const firstDepartment = await prisma.department.findFirst()
        if (!firstDepartment) {
          throw new Error('No departments found. Please create a department first.')
        }
        
        profile = await prisma.staff.create({
          data: {
            userId: user.id,
            departmentId: firstDepartment.id,
            employeeId: `EMP${Date.now().toString().slice(-6)}`
          }
        })
      }

      // Log the user creation action
      await prisma.auditLog.create({
        data: {
          userId: userId,
          action: 'CREATE_USER',
          entityType: 'User',
          entityId: user.id,
          newValues: { 
            email, 
            firstName, 
            lastName, 
            role,
            createdBy: userId
          },
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      })

      return { user, profile }
    })

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        status: result.user.status
      }
    })

  } catch (error) {
    console.error('Error creating user:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}