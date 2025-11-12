// use global fetch available in Node 18+/Next.js runtime

type UploadResult = { publicId: string; url: string }

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET

function cloudinaryBase() {
  if (CLOUD_NAME) return `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
  return null
}

export async function uploadToCloudinary(input: File | Buffer | string, filename?: string, folder?: string): Promise<UploadResult> {
  const url = cloudinaryBase()
  if (!url) throw new Error('Cloudinary not configured (CLOUDINARY_CLOUD_NAME missing)')

  const form = new (global as any).FormData()

  if (typeof input === 'string') {
    // Cloudinary can fetch remote URL
    form.append('file', input)
  } else {
    // File or Buffer
    form.append('file', input as any, filename || 'upload')
  }

  if (UPLOAD_PRESET) form.append('upload_preset', UPLOAD_PRESET)
  if (folder) form.append('folder', folder)

  // If API key/secret provided, use basic auth via query (not secure for client-side)
  const uploadUrl = url

  const res = await fetch(uploadUrl, {
    method: 'POST',
    body: form as any
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Cloud upload failed: ${res.status} ${text}`)
  }

  const obj = await res.json()
  return { publicId: obj.public_id || obj.publicId || obj.asset_id || '', url: obj.secure_url || obj.url }
}

export default { uploadToCloudinary }
