const { PrismaClient } = require('@prisma/client')
const { seedAdmin } = require('../scripts/seed-admin')

const prisma = new PrismaClient()

async function main() {
  const { user, password } = await seedAdmin(prisma)
  console.log(`[prisma seed] ensured ${user.email} (${user.role}) with password ${password}`)
}

main()
  .catch((error) => {
    console.error('[prisma seed] failed', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
