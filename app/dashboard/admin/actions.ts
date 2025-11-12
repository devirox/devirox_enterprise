export async function approveUserAction(formData: FormData) {
  'use server'
  const userId = String(formData.get('userId'))
  const prisma = (await import('@/lib/prisma')).default
  await prisma.user.update({ where: { id: userId }, data: { isApproved: true } })
  const { redirect } = await import('next/navigation')
  redirect('/dashboard/admin/approvals')
}
