import React from 'react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="mt-2">Third-party providers and credentials login will be available.</p>
      <div className="mt-4">
        <Link href="/api/auth/signin">Sign in</Link>
      </div>
    </main>
  )
}
