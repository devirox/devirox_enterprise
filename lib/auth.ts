import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from './prisma'
// use bcryptjs wrapper for hashing/compare to avoid native bindings
import { comparePassword } from '@/lib/hash'

export const authOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    GoogleProvider({ clientId: process.env.GOOGLE_ID!, clientSecret: process.env.GOOGLE_SECRET! }),
    GitHubProvider({ clientId: process.env.GITHUB_ID!, clientSecret: process.env.GITHUB_SECRET! }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user || !user.hashedPassword) return null
    const isValid = await comparePassword(credentials.password, user.hashedPassword)
        if (!isValid) return null
        // NextAuth expects an object with id and email at minimum
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    // When a user signs in, ensure they're approved (admin flow) and attach role
  async signIn({ user, account, profile }: any) {
      // look up user from prisma to get isApproved flag and role
      try {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
        if (!dbUser) return true

        // Auto-approve OAuth users
        if (account && account.provider && account.provider !== 'credentials') {
          if (!dbUser.isApproved) {
            await prisma.user.update({ where: { email: user.email! }, data: { isApproved: true } })
            return true
          }
        }

        if (dbUser.isApproved === false) {
          return '/unauthorized'
        }

        return true
      } catch (err) {
        console.error('signIn callback error', err)
        return false
      }
    },

    async jwt({ token, user }: any) {
      // When user is first created or signed in, fetch role and isApproved
      if (user) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
        if (dbUser) {
          token.role = dbUser.role
          token.isApproved = dbUser.isApproved
        }
      }
      return token
    },

    async session({ session, token }: any) {
      // Expose role and approval status to the client session
      session.user = session.user || {}
      session.user.role = token.role
      session.user.isApproved = token.isApproved
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions as any)
