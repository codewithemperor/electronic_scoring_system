import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    // Get user info from headers (set by middleware)
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId || userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get admin profile with department
    const admin = await db.admin.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        department: {
          select: {
            name: true,
            id: true
          }
        }
      }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin profile not found' },
        { status: 404 }
      )
    }

    const departmentId = admin.departmentId

    // Get candidate count for the department
    const departmentCandidates = await db.application.findMany({
      where: {
        program: {
          departmentId
        }
      },
      distinct: ['candidateId']
    })

    const totalCandidates = departmentCandidates.length

    // Get staff count for the department
    const staffCount = await db.staff.count({
      where: { departmentId }
    })

    // Get programs count for the department
    const programsCount = await db.program.count({
      where: { departmentId }
    })

    // Get applications count for the department
    const applicationsCount = await db.application.count({
      where: {
        program: {
          departmentId
        }
      }
    })

    // Get screening progress by program
    const programs = await db.program.findMany({
      where: { departmentId },
      include: {
        applications: {
          include: {
            candidate: {
              select: {
                screeningStatus: true
              }
            }
          }
        }
      }
    })

    const screeningProgress = programs.map(program => {
      const total = program.applications.length
      const completed = program.applications.filter(app => 
        app.candidate.screeningStatus === 'COMPLETED' || 
        app.candidate.screeningStatus === 'PASSED'
      ).length
      const pending = total - completed
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

      return {
        program: program.name,
        total,
        completed,
        pending,
        percentage
      }
    })

    // Get recent applications for the department
    const recentApplications = await db.application.findMany({
      where: {
        program: {
          departmentId
        }
      },
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        candidate: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        program: {
          select: {
            name: true
          }
        }
      }
    })

    const formattedApplications = recentApplications.map(app => ({
      id: `APP${app.id.slice(-6).toUpperCase()}`,
      candidate: `${app.candidate.user.firstName} ${app.candidate.user.lastName}`,
      program: app.program.name,
      status: app.status.replace('_', ' '),
      date: app.createdAt.toLocaleDateString(),
      score: app.totalScore
    }))

    // Format stats
    const stats = [
      {
        title: 'Total Candidates',
        value: totalCandidates.toString(),
        change: '+15%',
        icon: 'Users',
        description: 'Registered candidates'
      },
      {
        title: 'Staff Members',
        value: staffCount.toString(),
        change: '+2',
        icon: 'UserCheck',
        description: 'Active staff'
      },
      {
        title: 'Programs',
        value: programsCount.toString(),
        change: '0',
        icon: 'BookOpen',
        description: 'Department programs'
      },
      {
        title: 'Applications',
        value: applicationsCount.toString(),
        change: '+28%',
        icon: 'FileText',
        description: 'This academic year'
      }
    ]

    return NextResponse.json({
      stats,
      screeningProgress,
      recentApplications: formattedApplications,
      department: admin.department.name
    })

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}