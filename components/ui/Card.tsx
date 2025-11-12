import React from 'react'

export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg shadow-sm bg-white p-4">
      {children}
    </div>
  )
}
