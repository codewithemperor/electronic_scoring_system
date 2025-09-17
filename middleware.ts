import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(req: NextRequest) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl
    
    // If user is authenticated, prevent access to login/register pages and redirect to appropriate dashboard
    if (token) {
      // Define protected login routes that authenticated users shouldn't access
      const loginRoutes = ['/admin/login', '/staff/login', '/examiner/login', '/candidate/login']
      const registerRoutes = ['/candidate/register']
      
      // Check if current path is a login or register route
      const isLoginRoute = loginRoutes.some(route => pathname === route)
      const isRegisterRoute = registerRoutes.some(route => pathname === route)
      
      if (isLoginRoute || isRegisterRoute) {
        // Redirect to role-based dashboard
        let dashboardUrl = "/dashboard"
        switch (token.role) {
          case 'SUPER_ADMIN':
          case 'ADMIN':
            dashboardUrl = "/admin/dashboard"
            break
          case 'STAFF':
            dashboardUrl = "/staff/dashboard"
            break
          case 'EXAMINER':
            dashboardUrl = "/examiner/dashboard"
            break
          case 'CANDIDATE':
            dashboardUrl = "/candidate/dashboard"
            break
        }
        return NextResponse.redirect(new URL(dashboardUrl, req.url))
      }
    }
    
    // If user is trying to access root and is authenticated, redirect to appropriate dashboard
    if (pathname === "/" && token) {
      let dashboardUrl = "/dashboard"
      switch (token.role) {
        case 'SUPER_ADMIN':
        case 'ADMIN':
          dashboardUrl = "/admin/dashboard"
          break
        case 'STAFF':
          dashboardUrl = "/staff/dashboard"
          break
        case 'EXAMINER':
          dashboardUrl = "/examiner/dashboard"
          break
        case 'CANDIDATE':
          dashboardUrl = "/candidate/dashboard"
          break
      }
      return NextResponse.redirect(new URL(dashboardUrl, req.url))
    }
    
    // Role-based route protection - only apply if user is authenticated
    if (token) {
      // Admin routes - only ADMIN and SUPER_ADMIN can access
      if (pathname.startsWith('/admin') && token.role !== 'ADMIN' && token.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }
      
      // Staff routes - STAFF, ADMIN, and SUPER_ADMIN can access
      if (pathname.startsWith('/staff') && !['STAFF', 'ADMIN', 'SUPER_ADMIN'].includes(token.role as string)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }
      
      // Examiner routes - EXAMINER, ADMIN, and SUPER_ADMIN can access
      if (pathname.startsWith('/examiner') && !['EXAMINER', 'ADMIN', 'SUPER_ADMIN'].includes(token.role as string)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }

      // Candidate routes - only CANDIDATE can access candidate-specific pages
      if (pathname.startsWith('/candidate/dashboard') && token.role !== 'CANDIDATE') {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }
      
      // Protect candidate-specific routes
      if (pathname.startsWith('/candidate/take-test') && token.role !== 'CANDIDATE') {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Public routes that don't require authentication
        const publicRoutes = [
          '/', 
          '/candidate/register', 
          '/candidate/success', 
          '/candidate/test-success',
          '/candidate/check-result',
          '/admin/login',
          '/staff/login',
          '/examiner/login',
          '/candidate/login',
          '/unauthorized',
          '/api/auth/error', // NextAuth error page
          '/api/auth/signin', // NextAuth sign-in page
          '/api/auth/callback' // NextAuth callback
        ]
        
        // Dynamic routes that should be public
        const dynamicPublicRoutes = [
          '/candidate/take-test/[id]', // Allow access to take-test page without auth (will be protected by middleware)
        ]
        
        // Check if current path is a public route
        const isPublicRoute = publicRoutes.some(route => pathname === route)
        
        // Check if current path matches a dynamic public route
        const isDynamicPublicRoute = dynamicPublicRoutes.some(route => {
          const [base, dynamicPart] = route.split('/[')
          if (dynamicPart && pathname.startsWith(base)) {
            return true
          }
          return false
        })
        
        if (isPublicRoute || isDynamicPublicRoute) {
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