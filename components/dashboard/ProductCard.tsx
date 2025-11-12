import React from 'react'

export default function ProductCard({ title, price }: { title: string; price: number }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="font-semibold">{title}</div>
      <div className="text-slate-500">${price}</div>
    </div>
  )
}
