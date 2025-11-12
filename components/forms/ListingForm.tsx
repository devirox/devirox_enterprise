"use client"

import React from 'react'

export default function ListingForm() {
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget) as any)
    await fetch('/api/real-estate/listings', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
    window.location.reload()
  }

  return (
    <form className="space-y-2" onSubmit={onSubmit}>
      <div>
        <label>Title</label>
        <input name="title" className="block w-full" />
      </div>
      <div>
        <label>Price</label>
        <input name="price" type="number" className="block w-full" />
      </div>
      <button className="px-4 py-2 bg-sky-600 text-white rounded">Post Listing</button>
    </form>
  )
}
