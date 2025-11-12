import React from 'react'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <header className="py-4">Public Header</header>
        <main>{children}</main>
      </div>
    </div>
  )
}
