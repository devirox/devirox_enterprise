import React from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default async function SavingsPage() {
  const session = await getServerSession(authOptions as any)
  if (!session) return <div>Unauthorized</div>

  const userId = (session as any).user?.id
  const savings = await prisma.savings.findMany({ where: { userId } })

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold">Your Savings</h2>
      <ul className="mt-4 space-y-2">
        {savings.map(s => (
          <li key={s.id} className="p-3 bg-white rounded shadow">Account — {String(s.balance)}</li>
        ))}
      </ul>
    </DashboardLayout>
  )
}
