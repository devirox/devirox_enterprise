import React from 'react'

export default function CheckEmailPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Check your email</h1>
      <p className="mt-2">We've sent a verification link to your email. Please check your inbox and click the link to verify your account.</p>
      <p className="mt-4 text-sm text-slate-600">If you don't see the email, check your spam folder or contact <a href="mailto:support@example.com">support@example.com</a>.</p>
    </main>
  )
}
