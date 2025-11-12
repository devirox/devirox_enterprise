import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'

export async function GET() {
  // list public products (limit)
  const products = await prisma.product.findMany({ take: 100, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const data = {
    title: body.title,
    description: body.description || '',
    price: body.price ? Number(body.price) : 0,
    sellerId: (session as any).user?.id!
  }

  const product = await prisma.product.create({ data })

  try {
    await sendMail({ to: (session as any).user?.email!, subject: 'Product created', html: `<p>Your product "${product.title}" was created.</p>` })
  } catch (err) {
    console.error('mail error', err)
  }

  return NextResponse.json(product, { status: 201 })
}
