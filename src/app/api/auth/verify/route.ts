import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Check if session exists and is active
    const session = await db.session.findFirst({
      where: { token, isActive: true }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found or inactive' },
        { status: 401 }
      )
    }

    // Get user data
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      include: {
        superAdminProfile: true,
        adminProfile: {
          include: { department: true }
        },
        staffProfile: {
          include: { department: true }
        },
        candidateProfile: true
      }
    })

    if (!user || user.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      )
    }

    // Prepare response data based on user role
    let userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      lastLogin: user.lastLogin
    }

    // Add role-specific data
    switch (user.role) {
      case 'SUPER_ADMIN':
        userData = { ...userData, profile: user.superAdminProfile }
        break
      case 'ADMIN':
        userData = { ...userData, profile: user.adminProfile }
        break
      case 'STAFF':
        userData = { ...userData, profile: user.staffProfile }
        break
      case 'CANDIDATE':
        userData = { ...userData, profile: user.candidateProfile }
        break
    }

    return NextResponse.json({
      user: userData
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}