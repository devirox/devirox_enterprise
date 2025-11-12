import prisma from '@/lib/prisma'
// use our bcryptjs wrapper to avoid native bindings during build
import { hashPassword } from '@/lib/hash'
import { randomBytes } from 'crypto'
import { sendVerificationEmail, sendAdminNotification } from '@/lib/mailer'

export async function registerUser({ name, email, password }: { name?: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('User already exists')

  const hashed = await hashPassword(password, 10)
  const user = await prisma.user.create({ data: { name, email, hashedPassword: hashed, isApproved: false } })

  // Create single-use verification token
  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24h
  await prisma.verificationToken.create({ data: { identifier: email, token, expires } })

  // Notify admins (best effort)
  try {
    await sendAdminNotification(user)
  } catch (err) {
    console.error('Failed to send admin notification', err)
  }

  // Send verification email
  try {
    await sendVerificationEmail(email, token)
  } catch (err) {
    console.error('Failed to send verification email', err)
  }

  return user
}
