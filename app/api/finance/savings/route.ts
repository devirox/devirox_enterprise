import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'

export async function GET() {
  // Public-ish listing: limit for admin/staff, otherwise no-op — real protection done in middleware
  const savings = await prisma.savings.findMany({ take: 50 })
  return NextResponse.json(savings)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const data = { userId: (session as any).user?.id!, balance: body.balance ? Number(body.balance) : 0 }
  const account = await prisma.savings.create({ data })

  // Notify user
  try {
  await sendMail({ to: (session as any).user?.email!, subject: 'Savings account created', html: `<p>Your savings account was created with balance ${account.balance}.</p>` })
  } catch (err) {
    console.error('mail error', err)
  }

  return NextResponse.json(account, { status: 201 })
}
