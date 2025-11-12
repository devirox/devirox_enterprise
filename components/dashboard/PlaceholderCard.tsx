import React from 'react'

export default function PlaceholderCard({ title }: { title: string }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="font-semibold">{title}</div>
    </div>
  )
}
