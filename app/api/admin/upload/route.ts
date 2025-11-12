import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import cloudinary from '@/lib/cloudinary'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  // authOptions has complex types coming from NextAuth; cast to any here
  // to avoid a type incompatibility with getServerSession's overloads in this
  // App Route handler. This is a minimal change to unblock the build.
  const session = await getServerSession(authOptions as any)
  if (!session || (session as any).user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.formData()
  const file = data.get('file') as File
  const title = data.get('title') as string

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Use our helper which uploads Buffer/File/string to Cloudinary-compatible API
  const result = await cloudinary.uploadToCloudinary(buffer, (file as any)?.name || 'upload', 'devirox_landing')

  const uploaded = await (prisma as any).imageAsset.create({
    data: {
      title: title || 'Untitled',
      publicId: result.publicId,
      url: result.url,
      folder: 'devirox_landing',
      isActive: true,
    },
  })

  return NextResponse.json(uploaded)
}
