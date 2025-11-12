import React from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default async function LoansPage() {
  const session = await getServerSession(authOptions as any)
  if (!session) return <div>Unauthorized</div>

  const userId = (session as any).user?.id
  const loans = await prisma.loan.findMany({ where: { userId } })

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold">Your Loans</h2>
      <ul className="mt-4 space-y-2">
        {loans.map(l => (
          <li key={l.id} className="p-3 bg-white rounded shadow">Amount: {String(l.amount)} — Status: {l.status}</li>
        ))}
      </ul>
    </DashboardLayout>
  )
}
