import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractTokenFromHeader } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    // Find and deactivate the session
    const session = await db.session.findFirst({
      where: { token, isActive: true }
    })

    if (session) {
      // Deactivate session
      await db.session.update({
        where: { id: session.id },
        data: { isActive: false }
      })

      // Log the logout action
      await db.auditLog.create({
        data: {
          userId: session.userId,
          action: 'LOGOUT',
          entityType: 'Session',
          entityId: session.id,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      })
    }

    return NextResponse.json({
      message: 'Logout successful'
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}