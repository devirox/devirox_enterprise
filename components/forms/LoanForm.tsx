"use client"

import React from 'react'

export default function LoanForm() {
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget) as any)
    await fetch('/api/finance/loans', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
    window.location.reload()
  }

  return (
    <form className="space-y-2" onSubmit={onSubmit}>
      <div>
        <label>Amount</label>
        <input name="amount" type="number" className="block w-full" />
      </div>
      <div>
        <label>Interest Rate</label>
        <input name="interestRate" type="number" className="block w-full" />
      </div>
      <button className="px-4 py-2 bg-sky-600 text-white rounded">Request Loan</button>
    </form>
  )
}
