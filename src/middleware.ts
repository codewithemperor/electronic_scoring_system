import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/admin', '/staff', '/candidate']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Login routes that should be protected from authenticated users
  const loginRoutes = ['/login/super-admin', '/login/admin', '/login/staff', '/login/candidate']
  const isLoginRoute = loginRoutes.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Register route
  const isRegisterRoute = request.nextUrl.pathname.startsWith('/register')

  // Role-specific paths
  const rolePaths = {
    '/dashboard/super-admin': UserRole.SUPER_ADMIN,
    '/dashboard/admin': UserRole.ADMIN,
    '/dashboard/staff': UserRole.STAFF,
    '/dashboard/candidate': UserRole.CANDIDATE
  }

  // If accessing login/register route with valid token, redirect to dashboard
  if ((isLoginRoute || isRegisterRoute) && token) {
    const payload = verifyToken(token)
    if (payload) {
      const redirectPath = `/dashboard/${payload.role.toLowerCase().replace('_', '-')}`
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
  }

  // If accessing protected route without token, redirect to appropriate role-specific login
  if (isProtectedPath && !token) {
    // Determine the appropriate login page based on the requested path
    let loginPath = '/login'
    
    if (request.nextUrl.pathname.startsWith('/dashboard/super-admin')) {
      loginPath = '/login/super-admin'
    } else if (request.nextUrl.pathname.startsWith('/dashboard/admin')) {
      loginPath = '/login/admin'
    } else if (request.nextUrl.pathname.startsWith('/dashboard/staff')) {
      loginPath = '/login/staff'
    } else if (request.nextUrl.pathname.startsWith('/dashboard/candidate')) {
      loginPath = '/login/candidate'
    }
    
    const loginUrl = new URL(loginPath, request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If token exists, verify it
  if (token) {
    const payload = verifyToken(token)
    
    if (!payload) {
      // Token is invalid, clear it and redirect to login
      const response = NextResponse.redirect(new URL('/login/super-admin', request.url))
      response.cookies.delete('auth-token')
      return response
    }

    // Check role-specific access
    for (const [path, requiredRole] of Object.entries(rolePaths)) {
      if (request.nextUrl.pathname.startsWith(path) && payload.role !== requiredRole) {
        // User doesn't have required role, redirect to appropriate dashboard
        const redirectPath = `/dashboard/${payload.role.toLowerCase().replace('_', '-')}`
        return NextResponse.redirect(new URL(redirectPath, request.url))
      }
    }

    // Add user info to request headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.userId)
    requestHeaders.set('x-user-email', payload.email)
    requestHeaders.set('x-user-role', payload.role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/staff/:path*',
    '/candidate/:path*',
    '/login/super-admin/:path*',
    '/login/admin/:path*',
    '/login/staff/:path*',
    '/login/candidate/:path*',
    '/register/:path*',
    '/api/((?!auth|health|departments).*)'
  ]
}