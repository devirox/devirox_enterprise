import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'

export async function GET() {
  const listings = await prisma.listing.findMany({ take: 100, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(listings)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const data = {
    title: body.title,
    description: body.description || '',
    price: body.price ? Number(body.price) : 0,
    realtorId: (session as any).user?.id!,
    type: body.type || 'SALE'
  }

  const listing = await prisma.listing.create({ data })

  try {
    await sendMail({ to: (session as any).user?.email!, subject: 'Listing created', html: `<p>Your listing "${listing.title}" has been posted.</p>` })
  } catch (err) {
    console.error('mail error', err)
  }

  return NextResponse.json(listing, { status: 201 })
}
