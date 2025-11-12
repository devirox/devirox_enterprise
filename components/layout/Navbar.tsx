import React from 'react'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="p-4 bg-white shadow flex gap-4">
      <Link href="/">Home</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/dashboard/admin">Admin</Link>
    </nav>
  )
}
