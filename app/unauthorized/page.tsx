import React from 'react'
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Unauthorized</h1>
      <p className="mt-2">You do not have permission to access this page.</p>
      <div className="mt-4">
        <Link href="/">Return to home</Link>
      </div>
    </main>
  )
}
