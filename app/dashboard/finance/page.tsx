import React from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import DashboardLayout from '@/components/layout/DashboardLayout'
import FinanceCard from '@/components/dashboard/FinanceCard'

export default async function Page() {
  const session = await getServerSession(authOptions as any)
  if (!session) return <div>Unauthorized</div>

  const userId = (session as any).user?.id
  const savings = await prisma.savings.findMany({ where: { userId } })
  const loans = await prisma.loan.findMany({ where: { userId } })

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Finance Overview</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <FinanceCard title="Savings" value={savings.reduce((s, a) => s + Number(a.balance), 0)} />
        <FinanceCard title="Open Loans" value={loans.length} />
      </div>
    </DashboardLayout>
  )
}
