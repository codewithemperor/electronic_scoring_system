import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

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

    // Get total users count by role
    const userCounts = await db.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      },
      where: {
        status: 'ACTIVE'
      }
    })

    // Get total departments count
    const totalDepartments = await db.department.count()

    // Get total programs count
    const totalPrograms = await db.program.count()

    // Get total applications count
    const totalApplications = await db.application.count()

    // Get recent audit logs
    const recentActivities = await db.auditLog.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    })

    // Format user counts
    const totalUsers = userCounts.reduce((sum, group) => sum + group._count.id, 0)

    // Calculate monthly changes (mock data for now, in real app this would compare with previous month)
    const stats = [
      {
        title: 'Total Users',
        value: totalUsers.toString(),
        change: '+12%',
        trend: 'up',
        icon: 'Users',
        description: 'Active users in the system'
      },
      {
        title: 'Departments',
        value: totalDepartments.toString(),
        change: '+2',
        trend: 'up',
        icon: 'Building2',
        description: 'Academic departments'
      },
      {
        title: 'Programs',
        value: totalPrograms.toString(),
        change: '+5',
        trend: 'up',
        icon: 'BookOpen',
        description: 'Academic programs'
      },
      {
        title: 'Applications',
        value: totalApplications.toString(),
        change: '+23%',
        trend: 'up',
        icon: 'FileText',
        description: 'Total applications received'
      }
    ]

    // Format recent activities
    const formattedActivities = recentActivities.map(log => ({
      id: log.id,
      action: log.action,
      user: log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System',
      role: log.user ? log.user.role : 'Automated',
      time: formatTimeAgo(log.createdAt),
      status: log.action.includes('failed') || log.action.includes('error') ? 'error' : 'success'
    }))

    return NextResponse.json({
      stats,
      recentActivities: formattedActivities,
      systemStatus: [
        {
          name: 'Database',
          status: 'healthy',
          uptime: '99.9%'
        },
        {
          name: 'API Server',
          status: 'healthy',
          uptime: '99.8%'
        },
        {
          name: 'Authentication',
          status: 'healthy',
          uptime: '100%'
        },
        {
          name: 'File Storage',
          status: 'warning',
          uptime: '95.2%'
        }
      ]
    })

  } catch (error) {
    console.error('Error fetching super admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString()
}