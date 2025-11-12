import React from 'react'
import prisma from '@/lib/prisma'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { uploadImageAction } from './actions'

export default async function UploadsPage() {
  const images: any[] = await (prisma as any).imageAsset.findMany({ take: 50, orderBy: { createdAt: 'desc' } })

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold">Admin Uploads</h2>
      <p className="mt-2">Upload images for AI processing / assets. You can upload a file or provide an external image URL.</p>

      <form action={uploadImageAction} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
        <label className="flex flex-col">
          <span className="text-sm">Title</span>
          <input name="title" placeholder="Optional title" className="p-2 border rounded" />
        </label>
        <label className="flex flex-col">
          <span className="text-sm">Folder</span>
          <input name="folder" placeholder="Optional folder" className="p-2 border rounded" />
        </label>
        <label className="flex flex-col">
          <span className="text-sm">File upload</span>
          <input name="file" type="file" accept="image/*" className="p-2" />
        </label>
        <label className="flex flex-col">
          <span className="text-sm">Or image URL</span>
          <input name="imageUrl" placeholder="https://..." className="p-2 border rounded" />
        </label>
        <div>
          <button type="submit" className="px-4 py-2 rounded bg-sky-600 text-white">Upload</button>
        </div>
      </form>

      <section className="mt-8">
        <h3 className="text-lg font-semibold">Recent uploads</h3>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img: any) => (
            <div key={img.id} className="p-2 bg-white rounded shadow">
              <img src={img.url} alt={img.title || 'Image asset'} className="w-full h-32 object-cover rounded" />
              <div className="mt-2 text-sm">{img.title || '—'}</div>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  )
}

