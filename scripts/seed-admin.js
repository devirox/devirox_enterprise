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

async function main() {
  const prisma = new PrismaClient()
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

  console.log('Seeded admin user:')
  console.log('  email:', user.email)
  console.log('  password:', password)
  console.log('  role:', user.role)
  console.log('Run `npm run dev` and sign in using credentials above (use credentials provider).')

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error('Seed failed:', e)
  process.exit(1)
})
