jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    verificationToken: {
      findUnique: jest.fn(),
      deleteMany: jest.fn()
    },
    user: {
      update: jest.fn()
    }
  }
}))
const mockedPrisma = require('@/lib/prisma').default

const { verifyToken } = require('@/lib/auth/verify')

describe('verifyToken', () => {
  beforeEach(() => jest.clearAllMocks())

  it('verifies valid token', async () => {
    const future = new Date(Date.now() + 1000 * 60 * 60)
    mockedPrisma.verificationToken.findUnique.mockResolvedValue({ token: 't', identifier: 'a@b.com', expires: future })
    mockedPrisma.user.update.mockResolvedValue({})
    mockedPrisma.verificationToken.deleteMany.mockResolvedValue({})

    await expect(verifyToken({ token: 't', email: 'a@b.com' })).resolves.toBeTruthy()
    expect(mockedPrisma.user.update).toHaveBeenCalled()
  })

  it('throws on expired token', async () => {
    const past = new Date(Date.now() - 1000 * 60 * 60)
    mockedPrisma.verificationToken.findUnique.mockResolvedValue({ token: 't', identifier: 'a@b.com', expires: past })
    mockedPrisma.verificationToken.deleteMany.mockResolvedValue({})
    await expect(verifyToken({ token: 't', email: 'a@b.com' })).rejects.toThrow('Token expired')
  })
})
