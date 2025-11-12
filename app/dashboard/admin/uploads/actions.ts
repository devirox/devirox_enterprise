import prisma from '@/lib/prisma'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function uploadImageAction(formData: FormData) {
  'use server'
  const title = String(formData.get('title') || '')
  const folder = String(formData.get('folder') || '')
  const imageUrl = formData.get('imageUrl') as unknown as string | null
  const file = formData.get('file') as unknown as File | null

  let uploadResult
  if (file) {
    uploadResult = await uploadToCloudinary(file, (file as any).name, folder || undefined)
  } else if (imageUrl) {
    uploadResult = await uploadToCloudinary(imageUrl, undefined, folder || undefined)
  } else {
    throw new Error('No file or imageUrl provided')
  }

  const record = await (prisma as any).imageAsset.create({ data: { title: title || null, publicId: uploadResult.publicId, url: uploadResult.url, folder: folder || null, isActive: true } })

  const { redirect } = await import('next/navigation')
  redirect('/dashboard/admin/uploads')
}

export default uploadImageAction
