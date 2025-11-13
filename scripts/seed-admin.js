#!/usr/bin/env node
/**
 * Seed a development SUPER_ADMIN user into the database.
 *
 * Usage (recommended):
 *  ADMIN_EMAIL=admin@localhost ADMIN_PASSWORD=Passw0rd! node scripts/seed-admin.js
 *
 * If DATABASE_URL is not set this will fail — set your development database URL first.
 */
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function seedAdmin(prisma) {
  const email = process.env.ADMIN_EMAIL || 'admin@localhost'
  const password = process.env.ADMIN_PASSWORD || 'Passw0rd!'
  const name = process.env.ADMIN_NAME || 'Root Admin'
  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      hashedPassword: hashed,
      role: 'SUPER_ADMIN',
      isApproved: true,
      emailVerified: new Date()
    },
    create: {
      name,
      email,
      hashedPassword: hashed,
      role: 'SUPER_ADMIN',
      isApproved: true,
      emailVerified: new Date()
    }
  })

  return { user, password }
}

async function runFromCLI() {
  const prisma = new PrismaClient()
  try {
    const { user, password } = await seedAdmin(prisma)
    console.log('Seeded admin user:')
    console.log('  email:', user.email)
    console.log('  password:', password)
    console.log('  role:', user.role)
    console.log('Run `pnpm dev` and sign in using credentials above (use the credentials provider).')
  } catch (error) {
    console.error('Seed failed:', error)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  runFromCLI()
}

module.exports = { seedAdmin }
