jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    loan: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn()
    },
    user: {
      findUnique: jest.fn()
    }
  }
}))

jest.mock('@/lib/mailer', () => ({
  __esModule: true,
  sendMail: jest.fn()
}))

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn()
}))

jest.mock('bcrypt', () => ({
  __esModule: true,
  default: { compare: jest.fn().mockResolvedValue(true), hash: jest.fn().mockResolvedValue('hashed') }
}))

jest.mock('next/server', () => ({
  NextResponse: { json: (p: any) => p }
}))

const mockedPrisma = require('@/lib/prisma').default
const mailerMock = require('@/lib/mailer')
const { POST, PATCH } = require('@/app/api/finance/loans/route')
const { getServerSession } = require('next-auth/next')

describe('loans API', () => {
  beforeEach(() => jest.clearAllMocks())

  it('creates a loan for authenticated user and sends mail', async () => {
    getServerSession.mockResolvedValue({ user: { id: 'u1', email: 'a@b.com' } })
  mockedPrisma.loan.create.mockResolvedValue({ id: 'l1', amount: 100 })

    const req = { json: async () => ({ amount: 100, interestRate: 5 }) }
    const res = await POST(req)

  expect(mockedPrisma.loan.create).toHaveBeenCalled()
  expect(mailerMock.sendMail).toHaveBeenCalled()
  })

  it('allows staff to PATCH and notifies user', async () => {
    getServerSession.mockResolvedValue({ user: { id: 'staff', role: 'FINANCE_STAFF' } })
  mockedPrisma.loan.update.mockResolvedValue({ id: 'l1', userId: 'u1', status: 'APPROVED' })
  mockedPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com' })

    const req = { json: async () => ({ id: 'l1', status: 'APPROVED' }) }
    const res = await PATCH(req)

  expect(mockedPrisma.loan.update).toHaveBeenCalled()
  expect(mailerMock.sendMail).toHaveBeenCalled()
  })
})
