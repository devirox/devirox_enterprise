jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn()
    },
    verificationToken: {
      create: jest.fn()
    }
  }
}))

jest.mock('@/lib/mailer', () => ({
  __esModule: true,
  sendVerificationEmail: jest.fn(),
  sendAdminNotification: jest.fn()
}))

jest.mock('bcrypt', () => ({
  __esModule: true,
  default: { hash: jest.fn().mockResolvedValue('hashed') }
}))

const mockedPrisma = require('@/lib/prisma').default
const mailer = require('@/lib/mailer')

const { registerUser } = require('@/lib/auth/register')

describe('registerUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates a new user and sends emails', async () => {
  mockedPrisma.user.findUnique.mockResolvedValue(null)
  mockedPrisma.user.create.mockResolvedValue({ id: 'u1', email: 'a@b.com', name: 'A' })
  mockedPrisma.verificationToken.create.mockResolvedValue({})

    const user = await registerUser({ name: 'A', email: 'a@b.com', password: 'pass' })
    expect(user).toBeDefined()
  expect(mockedPrisma.user.create).toHaveBeenCalled()
  expect(mockedPrisma.verificationToken.create).toHaveBeenCalled()
    expect(mailer.sendVerificationEmail).toHaveBeenCalled()
    expect(mailer.sendAdminNotification).toHaveBeenCalled()
  })

  it('throws if user exists', async () => {
  mockedPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com' })
    await expect(registerUser({ email: 'a@b.com', password: 'x' } as any)).rejects.toThrow()
  })
})
