import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'
import { requireSession, requireRole, isOwner } from '@/lib/guards'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any)
  const maybe = requireSession(session)
  if (maybe) return maybe

  const id = params.id
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // only seller or SUPER_ADMIN can update
  const role = (session as any).user?.role
  const owner = isOwner(session, product.sellerId)
  if (!owner && role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const updated = await prisma.product.update({ where: { id }, data: body })

  try {
    const user = await prisma.user.findUnique({ where: { id: updated.sellerId } })
    if (user) await sendMail({ to: user.email, subject: 'Product updated', html: `<p>Your product "${updated.title}" was updated.</p>` })
  } catch (err) {
    console.error('mail error', err)
  }

  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any)
  const maybe = requireSession(session)
  if (maybe) return maybe

  const id = params.id
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const role = (session as any).user?.role
  const owner = isOwner(session, product.sellerId)
  if (!owner && role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
