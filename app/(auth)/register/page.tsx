import React from 'react'
import { createUser } from './actions'

export default function RegisterPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Register</h1>
      <form action={createUser} className="mt-4 flex flex-col gap-2 max-w-md">
        <label>
          <span className="sr-only">Name</span>
          <input name="name" placeholder="Full name" className="w-full p-2 border rounded" />
        </label>
        <label>
          <span className="sr-only">Email</span>
          <input name="email" type="email" placeholder="you@example.com" className="w-full p-2 border rounded" />
        </label>
        <label>
          <span className="sr-only">Password</span>
          <input name="password" type="password" placeholder="Password" className="w-full p-2 border rounded" />
        </label>
        <button type="submit" className="px-4 py-2 rounded bg-sky-600 text-white">Create account</button>
      </form>
    </main>
  )
}
