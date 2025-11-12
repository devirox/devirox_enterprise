import React from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ListingCard from '@/components/dashboard/ListingCard'

export default async function RealEstateDashboard() {
  const session = await getServerSession(authOptions as any)
  if (!session) return <div>Unauthorized</div>

  const userId = (session as any).user?.id
  const listings = await prisma.listing.findMany({ where: { realtorId: userId } })

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Real Estate</h1>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {listings.map(l => (
          <ListingCard key={l.id} title={l.title} price={Number(l.price)} />
        ))}
      </div>
    </DashboardLayout>
  )
}
