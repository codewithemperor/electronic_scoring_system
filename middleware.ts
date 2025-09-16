import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(req: NextRequest) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl
    
    // If user is trying to access root and is authenticated, redirect to dashboard
    if (pathname === "/" && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    
    // Role-based route protection
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN' && token?.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
    
    if (pathname.startsWith('/staff') && !['STAFF', 'ADMIN', 'SUPER_ADMIN'].includes(token?.role as string)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
    
    if (pathname.startsWith('/examiner') && !['EXAMINER', 'ADMIN', 'SUPER_ADMIN'].includes(token?.role as string)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Public routes that don't require authentication
        const publicRoutes = ['/', '/candidate/register', '/candidate/take-test', '/candidate/success', '/candidate/test-success']
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true
        }
        
        // All other routes require authentication
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}