import React from 'react'
import prisma from '@/lib/prisma'
import { createSavingAction } from './actions'

export default async function StaffFinance() {
  return (
    <section className="p-6">
      <h3 className="text-xl font-semibold">Staff Finance</h3>
      <p className="mt-2">Staff interface to manage finance operations</p>
    </section>
  )
}
