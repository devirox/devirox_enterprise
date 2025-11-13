'use client'

import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

interface LoginOptionsProps {
  callbackUrl: string
}

export default function LoginOptions({ callbackUrl }: LoginOptionsProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [oauthPending, setOauthPending] = useState<string | null>(null)

  const handleCredentials = async (event: FormEvent) => {
    event.preventDefault()
    setPending(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        callbackUrl,
        email,
        password
      })

      if (!result) {
        setError('Unable to sign in with those credentials.')
        setPending(false)
        return
      }

      if (result.error) {
        setError(result.error)
        setPending(false)
        return
      }

      router.replace(result.url ?? callbackUrl)
    } catch (err) {
      console.error('Credentials sign-in failed', err)
      setError('Unexpected error while signing in. Please try again.')
      setPending(false)
    }
  }

  const handleOAuth = (provider: 'github' | 'google') => {
    setOauthPending(provider)
    setError(null)
    signIn(provider, { callbackUrl }).catch((err) => {
      console.error('OAuth sign-in failed', err)
      setError('Unable to redirect to provider.')
      setOauthPending(null)
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center"
          onClick={() => handleOAuth('github')}
          disabled={oauthPending === 'github'}
        >
          {oauthPending === 'github' ? 'Redirecting to GitHub…' : 'Sign in with GitHub'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center"
          onClick={() => handleOAuth('google')}
          disabled={oauthPending === 'google'}
        >
          {oauthPending === 'google' ? 'Redirecting to Google…' : 'Sign in with Google'}
        </Button>
      </div>

      <form onSubmit={handleCredentials} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            className="mt-1 w-full rounded border border-slate-200 px-3 py-2"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            className="mt-1 w-full rounded border border-slate-200 px-3 py-2"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full justify-center" disabled={pending}>
          {pending ? 'Signing in…' : 'Sign in with credentials'}
        </Button>
      </form>
    </div>
  )
}
