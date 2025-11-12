import prisma from '@/lib/prisma'

export async function verifyToken({ token, email }: { token: string; email: string }) {
  const record = await prisma.verificationToken.findUnique({ where: { token } as any })
  if (!record || record.identifier !== email) {
    throw new Error('Invalid or missing token')
  }

  const now = new Date()
  if (record.expires < now) {
    // delete expired token
    await prisma.verificationToken.deleteMany({ where: { token } })
    throw new Error('Token expired')
  }

  // mark user as approved and emailVerified
  await prisma.user.update({ where: { email }, data: { isApproved: true, emailVerified: new Date() } })

  // delete the token (single-use)
  await prisma.verificationToken.deleteMany({ where: { token } })
  return true
}
