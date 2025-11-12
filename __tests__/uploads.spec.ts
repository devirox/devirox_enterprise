jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    imageAsset: { create: jest.fn(), findMany: jest.fn() }
  }
}))

jest.mock('@/lib/cloudinary', () => ({
  __esModule: true,
  uploadToCloudinary: jest.fn().mockResolvedValue({ publicId: 'p1', url: 'https://cdn.example.com/p1.jpg' })
}))

jest.mock('next/navigation', () => ({ redirect: jest.fn() }))

const { uploadImageAction } = require('@/app/dashboard/admin/uploads/actions')
const prismaMockUploads = require('@/lib/prisma').default
const cloud = require('@/lib/cloudinary')

describe('upload image action', () => {
  beforeEach(() => jest.clearAllMocks())

  it('uploads image by URL and creates record', async () => {
    const fd = new (global as any).FormData()
    fd.append('imageUrl', 'https://example.com/test.jpg')
    fd.append('title', 'Test Image')

    await uploadImageAction(fd)

    expect(cloud.uploadToCloudinary).toHaveBeenCalled()
    expect(prismaMockUploads.imageAsset.create).toHaveBeenCalled()
  })
})
