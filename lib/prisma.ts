import type { PrismaClient as PrismaClientType } from '@prisma/client'

type PrismaClientConstructor = new () => PrismaClientType

function createStubClientConstructor(): PrismaClientConstructor {
  const createModelProxy = (model: string) =>
    new Proxy(
      {},
      {
        get(_target, property: string | symbol) {
          if (typeof property === 'string') {
            if (property === 'findMany') return async () => []
            if (property === 'findUnique') return async () => null
            if (property === 'deleteMany') return async () => ({ count: 0 })
            return async () => {
              throw new Error(`Prisma Client is not available in this environment. Attempted to call ${model}.${property}.`)
            }
          }
          return undefined
        }
      }
    )

  const clientProxy = new Proxy(
    {},
    {
      get(_target, property: string | symbol) {
        if (typeof property === 'string') {
          if (property === '$connect' || property === '$disconnect') {
            return async () => undefined
          }
          if (property.startsWith('$')) {
            return async () => {
              throw new Error(`Prisma Client is not available in this environment. Attempted to call ${property}.`)
            }
          }
          return createModelProxy(property)
        }
        return undefined
      }
    }
  )

  class PrismaClientStub {
    constructor() {
      return clientProxy as unknown as PrismaClientType
    }
  }

  return PrismaClientStub as unknown as PrismaClientConstructor
}

let PrismaClientCtor: PrismaClientConstructor

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  PrismaClientCtor = require('@prisma/client').PrismaClient as PrismaClientConstructor
} catch (error) {
  console.warn('Falling back to PrismaClient stub. Original error:', error)
  PrismaClientCtor = createStubClientConstructor()
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientType | undefined
}

export const prisma: PrismaClientType = globalThis.prisma ?? new PrismaClientCtor()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export default prisma
