"use client"

import React from 'react'

export default function ProductForm() {
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form) as any)
    await fetch('/api/marketplace/products', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
    // simple UX: reload
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
      <button className="px-4 py-2 bg-sky-600 text-white rounded">Add Product</button>
    </form>
  )
}
