import React from 'react'
import { verifyToken } from '@/lib/auth/verify'

export default async function VerifyPage({ searchParams }: { searchParams: { token?: string; email?: string } }) {
  const { token, email } = searchParams || {}
  if (!token || !email) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Verification failed</h1>
        <p className="mt-2">Missing token or email.</p>
      </main>
    )
  }

  try {
    await verifyToken({ token, email })
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Verified</h1>
        <p className="mt-2">Your email has been verified. You can now <a href="/login">sign in</a>.</p>
      </main>
    )
  } catch (err: any) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Verification failed</h1>
        <p className="mt-2">{err?.message || 'Invalid or expired token.'}</p>
      </main>
    )
  }
}
