import React from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProductCard from '@/components/dashboard/ProductCard'

export default async function MarketplaceDashboard() {
  const session = await getServerSession(authOptions as any)
  if (!session) return <div>Unauthorized</div>

  const userId = (session as any).user?.id
  const products = await prisma.product.findMany({ where: { sellerId: userId } })

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">Marketplace</h1>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {products.map(p => (
          <ProductCard key={p.id} title={p.title} price={Number(p.price)} />
        ))}
      </div>
    </DashboardLayout>
  )
}
