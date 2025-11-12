import React from 'react'

export default function FinanceCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}
