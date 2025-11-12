import React from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        <header className="py-4 border-b mb-6">Dashboard Header</header>
        <main>{children}</main>
      </div>
    </div>
  )
}
