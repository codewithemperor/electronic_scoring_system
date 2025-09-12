import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole, UserStatus } from '@prisma/client'

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
      include: {
        superAdminProfile: true,
        adminProfile: {
          include: {
            department: {
              select: {
                name: true,
                code: true
              }
            }
          }
        },
        staffProfile: {
          include: {
            department: {
              select: {
                name: true,
                code: true
              }
            }
          }
        },
        candidateProfile: true
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

    const { email, password, firstName, lastName, phone, role, departmentId } = await request.json()

    // Validate input
    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Validate role
    if (!Object.values(UserRole).includes(role as UserRole)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Don't allow creating super admin users through this endpoint
    if (role === UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Cannot create Super Admin users through this endpoint' },
        { status: 400 }
      )
    }

    const { hashPassword } = await import('@/lib/auth')
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
          status: UserStatus.ACTIVE,
          emailVerified: true
        }
      })

      // Create role-specific profile
      switch (role) {
        case UserRole.ADMIN:
          if (!departmentId) {
            throw new Error('Department ID is required for admin users')
          }
          await prisma.admin.create({
            data: {
              userId: user.id,
              departmentId
            }
          })
          break

        case UserRole.STAFF:
          if (!departmentId) {
            throw new Error('Department ID is required for staff users')
          }
          // Generate employee ID
          const employeeCount = await prisma.staff.count()
          const employeeId = `EMP${String(employeeCount + 1).padStart(3, '0')}`
          
          await prisma.staff.create({
            data: {
              userId: user.id,
              departmentId,
              employeeId
            }
          })
          break

        case UserRole.CANDIDATE:
          // This should not be created by super admin, candidates self-register
          throw new Error('Candidates should self-register through the registration process')
      }

      return { user }
    })

    // Log the user creation action
    await db.auditLog.create({
      data: {
        userId,
        action: 'CREATE_USER',
        entityType: 'User',
        entityId: result.user.id,
        newValues: { 
          email, 
          firstName, 
          lastName, 
          role,
          createdAt: new Date().toISOString()
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
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