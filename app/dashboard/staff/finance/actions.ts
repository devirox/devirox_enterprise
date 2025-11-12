export async function createSavingAction(userId: string) {
  'use server'
  const prisma = (await import('@/lib/prisma')).default
  return await prisma.savings.create({ data: { userId, balance: 0 } })
}
