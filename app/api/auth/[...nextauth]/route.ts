import NextAuth from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// NextAuth route handler for App Router
const handler = NextAuth(authOptions as any)

export { handler as GET, handler as POST }
