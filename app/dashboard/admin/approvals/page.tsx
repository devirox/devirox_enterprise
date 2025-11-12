import React from 'react'
import prisma from '@/lib/prisma'
import { approveUserAction } from '../actions'

export default async function ApprovalsPage() {
  const pending = await prisma.user.findMany({ where: { isApproved: false }, take: 50 })
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">User Approvals</h1>
      <p className="mt-2">Approve newly registered users. You can also contact users at the email listed below.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pending.map(u => (
          <div key={u.id} className="p-4 bg-white rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{u.name || '—'}</div>
                <div className="text-sm text-slate-600">{u.email}</div>
                <div className="text-xs text-slate-400">Registered: {u.createdAt?.toISOString?.()}</div>
              </div>
              <form action={approveUserAction}>
                <input type="hidden" name="userId" value={u.id} />
                <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
              </form>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-slate-600">Need to contact users? Email them from your admin mail client or click to copy their address.</div>
    </main>
  )
}
