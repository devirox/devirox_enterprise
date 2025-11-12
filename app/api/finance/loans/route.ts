import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'
import { requireSession, requireRole } from '@/lib/guards'

// GET: list loans — staff/admin see all, customers see their own
export async function GET() {
  const loans = await prisma.loan.findMany({ take: 200, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(loans)
}

// POST: create a loan request for the authenticated user
export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const userId = (session as any).user?.id!
  const loan = await prisma.loan.create({ data: { userId, amount: body.amount, interestRate: body.interestRate || 5.0, status: 'PENDING' } })

  try {
    await sendMail({ to: (session as any).user?.email!, subject: 'Loan request submitted', html: `<p>Your loan request for ${loan.amount} has been submitted and is pending review.</p>` })
  } catch (err) {
    console.error('mail error', err)
  }

  return NextResponse.json(loan, { status: 201 })
}

// PATCH: approve/reject/disburse (requires FINANCE_STAFF or SUPER_ADMIN)
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions as any)
  const maybe = requireSession(session)
  if (maybe) return maybe

  const forbidden = requireRole(session, ['FINANCE_STAFF', 'SUPER_ADMIN'])
  if (forbidden) return forbidden

  const body = await req.json()
  const { id, status } = body
  const updated = await prisma.loan.update({ where: { id }, data: { status } })

  try {
    const user = await prisma.user.findUnique({ where: { id: updated.userId } })
    if (user) await sendMail({ to: user.email, subject: 'Loan status updated', html: `<p>Your loan status is now ${updated.status}</p>` })
  } catch (err) {
    console.error('mail error', err)
  }

  return NextResponse.json(updated)
}
