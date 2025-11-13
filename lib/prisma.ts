import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'
import type { PrismaClient as PrismaClientType } from '@prisma/client'

type PrismaClientConstructor = new () => PrismaClientType

type ModelName = keyof typeof DEFAULT_STORE

type Store = Record<ModelName, any[]>

const DATA_DIR = path.join(process.cwd(), '.data')
const STORE_PATH = path.join(DATA_DIR, 'prisma-store.json')
const DATE_FIELD_REGEX = /(At|Date|expires|Verified)$/i
const DEFAULT_STORE = {
  user: [],
  product: [],
  listing: [],
  savings: [],
  loan: [],
  ad: [],
  account: [],
  session: [],
  verificationToken: [],
  imageAsset: []
} as const

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientType | undefined
  // eslint-disable-next-line no-var
  var __PRISMA_STORE__: Store | undefined
}

function readStore(): Store {
  try {
    const contents = fs.readFileSync(STORE_PATH, 'utf8')
    const parsed = JSON.parse(contents)
    return ensureStoreShape(parsed)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.warn('Unable to read Prisma stub store, starting fresh:', error)
    }
    return ensureStoreShape({})
  }
}

function ensureStoreShape(store: Partial<Store>): Store {
  return Object.keys(DEFAULT_STORE).reduce((acc, key) => {
    acc[key as ModelName] = Array.isArray(store[key as ModelName]) ? [...(store[key as ModelName] as any[])] : []
    return acc
  }, {} as Store)
}

function persistStore(store: Store) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2))
}

function getStore(): Store {
  if (!globalThis.__PRISMA_STORE__) {
    const store = readStore()
    seedAdminUser(store)
    persistStore(store)
    globalThis.__PRISMA_STORE__ = store
  }
  return globalThis.__PRISMA_STORE__
}

function seedAdminUser(store: Store) {
  const email = process.env.ADMIN_EMAIL || 'admin@localhost'
  if (store.user.some((user) => user.email === email)) return
  const password = process.env.ADMIN_PASSWORD || 'Passw0rd!'
  const name = process.env.ADMIN_NAME || 'Root Admin'
  const now = new Date().toISOString()
  const hashedPassword = bcrypt.hashSync(password, 10)
  store.user.push({
    id: randomUUID(),
    name,
    email,
    emailVerified: now,
    role: 'SUPER_ADMIN',
    isApproved: true,
    hashedPassword,
    createdAt: now,
    updatedAt: now
  })
  console.info(`Seeded fallback admin user (${email}) for Prisma stub.`)
}

function serializeValue(value: any): any {
  if (value === null || value === undefined) return value
  if (value instanceof Date) return value.toISOString()
  if (Array.isArray(value)) return value.map((item) => serializeValue(item))
  if (typeof value === 'object') {
    if ('set' in value) return serializeValue(value.set)
    return Object.entries(value).reduce((acc, [key, val]) => {
      acc[key] = serializeValue(val)
      return acc
    }, {} as Record<string, any>)
  }
  return value
}

function hydrateRecord(record: any): any {
  return Object.entries(record).reduce((acc, [key, val]) => {
    if (typeof val === 'string' && DATE_FIELD_REGEX.test(key)) {
      const date = new Date(val)
      acc[key] = Number.isNaN(date.valueOf()) ? val : date
      return acc
    }
    acc[key] = val
    return acc
  }, {} as Record<string, any>)
}

function matchWhere(record: any, where: any): boolean {
  if (!where || Object.keys(where).length === 0) return true
  return Object.entries(where).every(([key, value]) => {
    if (key === 'OR' && Array.isArray(value)) {
      return value.some((clause) => matchWhere(record, clause))
    }
    if (key === 'AND' && Array.isArray(value)) {
      return value.every((clause) => matchWhere(record, clause))
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if ('equals' in value) return record[key] === value.equals
      if (key.includes('_')) {
        return Object.entries(value).every(([nestedKey, nestedVal]) => record[nestedKey] === nestedVal)
      }
      return Object.entries(value).every(([nestedKey, nestedVal]) => {
        if (nestedKey === 'equals') return record[key] === nestedVal
        return record[key]?.[nestedKey] === nestedVal
      })
    }
    return record[key] === value
  })
}

function applyOrder(records: any[], orderBy: any): any[] {
  if (!orderBy) return records
  const orderClauses = Array.isArray(orderBy) ? orderBy : [orderBy]
  return [...records].sort((a, b) => {
    for (const clause of orderClauses) {
      for (const [field, direction] of Object.entries(clause)) {
        if (a[field] === b[field]) continue
        const multiplier = direction === 'desc' ? -1 : 1
        return a[field] > b[field] ? multiplier : -multiplier
      }
    }
    return 0
  })
}

function findIndex(records: any[], where: any): number {
  return records.findIndex((record) => matchWhere(record, where))
}

function prepareRecord(model: ModelName, data: any): any {
  const serialized = serializeValue(data)
  const record = { ...serialized }
  const now = new Date().toISOString()
  if (model !== 'verificationToken') {
    record.id = record.id || randomUUID()
  }
  if ('createdAt' in record && !record.createdAt) {
    record.createdAt = now
  }
  if ('updatedAt' in record) {
    record.updatedAt = record.updatedAt || now
  }
  if (model === 'user') {
    record.role = record.role || 'CUSTOMER'
    record.isApproved = record.isApproved ?? false
    record.createdAt = record.createdAt || now
    record.updatedAt = now
  }
  return record
}

function applyUpdate(model: ModelName, existing: any, data: any): any {
  const serialized = serializeValue(data)
  const next = { ...existing, ...serialized }
  if ('updatedAt' in next) {
    next.updatedAt = new Date().toISOString()
  }
  if (model === 'user') {
    next.updatedAt = new Date().toISOString()
  }
  return next
}

function createModelHandler(model: ModelName, store: Store) {
  const handler: Record<string, any> = {}

  handler.findMany = async (args: any = {}) => {
    const { where, take, orderBy } = args || {}
    let results = store[model].filter((record) => matchWhere(record, where))
    results = applyOrder(results, orderBy)
    if (typeof take === 'number') {
      results = take >= 0 ? results.slice(0, take) : results.slice(take)
    }
    return results.map((record) => hydrateRecord({ ...record }))
  }

  handler.findUnique = async ({ where }: any) => {
    const index = findIndex(store[model], where)
    return index >= 0 ? hydrateRecord({ ...store[model][index] }) : null
  }

  handler.findFirst = async (args: any = {}) => {
    const results = await handler.findMany({ ...args, take: 1 })
    return results[0] ?? null
  }

  handler.create = async ({ data }: any) => {
    const record = prepareRecord(model, data)
    store[model].push(record)
    persistStore(store)
    return hydrateRecord({ ...record })
  }

  handler.update = async ({ where, data }: any) => {
    const index = findIndex(store[model], where)
    if (index < 0) throw new Error(`${model}.update: record not found`)
    const updated = applyUpdate(model, store[model][index], data)
    store[model][index] = updated
    persistStore(store)
    return hydrateRecord({ ...updated })
  }

  handler.delete = async ({ where }: any) => {
    const index = findIndex(store[model], where)
    if (index < 0) throw new Error(`${model}.delete: record not found`)
    const [removed] = store[model].splice(index, 1)
    persistStore(store)
    return hydrateRecord({ ...removed })
  }

  handler.deleteMany = async ({ where }: any = {}) => {
    const before = store[model].length
    store[model] = store[model].filter((record) => !matchWhere(record, where))
    const count = before - store[model].length
    if (count > 0) persistStore(store)
    return { count }
  }

  handler.upsert = async ({ where, create, update }: any) => {
    const existing = await handler.findUnique({ where })
    if (existing) {
      return handler.update({ where, data: update })
    }
    return handler.create({ data: create })
  }

  handler.count = async ({ where }: any = {}) => {
    return store[model].filter((record) => matchWhere(record, where)).length
  }

  return handler
}

function createStubClientConstructor(): PrismaClientConstructor {
  const store = getStore()
  class PrismaClientStub {
    constructor() {
      const models = Object.keys(DEFAULT_STORE).reduce((acc, key) => {
        acc[key] = createModelHandler(key as ModelName, store)
        return acc
      }, {} as Record<string, any>)

      return {
        ...models,
        $connect: async () => undefined,
        $disconnect: async () => {
          persistStore(store)
        }
      } as PrismaClientType
    }
  }

  return PrismaClientStub as unknown as PrismaClientConstructor
}

let PrismaClientCtor: PrismaClientConstructor | null = null

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  PrismaClientCtor = require('@prisma/client').PrismaClient as PrismaClientConstructor
} catch (error) {
  console.warn('Falling back to PrismaClient stub. Original error:', error)
}

const PrismaCtorToUse = PrismaClientCtor ?? createStubClientConstructor()

export const prisma: PrismaClientType = globalThis.prisma ?? new PrismaCtorToUse()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export const usingPrismaStub = !PrismaClientCtor

export default prisma
