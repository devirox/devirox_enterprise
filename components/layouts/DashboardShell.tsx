import React from 'react'

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-white shadow-sm">Dashboard header</header>
      <div className="p-6">{children}</div>
    </div>
  )
}
