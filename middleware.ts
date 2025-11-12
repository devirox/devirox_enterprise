import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

/**
 * Centralized middleware using next-auth's withAuth helper.
 * Protects /admin/* and /dashboard/* and redirects unauthorized users to /unauthorized.
 */
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
  const role = String(req.nextauth?.token?.role || '')

    // Admin area
    try {
      const { hasRole } = require('@/lib/guards')
      if (pathname.startsWith('/dashboard/admin') && !hasRole(role, ['SUPER_ADMIN'])) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }

      // Finance staff area
      if (pathname.startsWith('/dashboard/staff/finance') && !hasRole(role, ['SUPER_ADMIN', 'FINANCE_STAFF'])) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }

      // Marketplace staff area
      if (pathname.startsWith('/dashboard/staff/marketplace') && !hasRole(role, ['SUPER_ADMIN', 'MARKETPLACE_SELLER'])) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }

      // Real-estate staff area
      if (pathname.startsWith('/dashboard/staff/real-estate') && !hasRole(role, ['SUPER_ADMIN', 'REALTOR'])) {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    } catch (err) {
      console.error('guards import error', err)
    }

    // Additional checks (customer-only sections, etc.) can be added here
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = { matcher: ['/admin/:path*', '/dashboard/:path*'] }
