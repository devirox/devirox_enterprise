import LoginOptions from '@/components/auth/LoginOptions'

type SearchParams = Record<string, string | string[]>

type LoginPageProps = {
  searchParams?: SearchParams | Promise<SearchParams>
}

function isPromise<T>(value: unknown): value is Promise<T> {
  return typeof value === 'object' && value !== null && 'then' in value
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedParams: SearchParams | undefined = searchParams
    ? isPromise<SearchParams>(searchParams)
      ? await searchParams
      : searchParams
    : undefined
  const rawCallback = resolvedParams?.callbackUrl
  const callbackUrlValue = Array.isArray(rawCallback) ? rawCallback[0] : rawCallback
  const callbackUrl = typeof callbackUrlValue === 'string' && callbackUrlValue.length > 0 ? callbackUrlValue : '/dashboard'
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Passw0rd!'

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Sign in</h1>
        <p className="mt-2 text-slate-600">Use GitHub, Google, or the credentials provider. Redirects honor the callbackUrl query string, defaulting to your dashboard.</p>
      </div>

      <LoginOptions callbackUrl={callbackUrl} />

      <div className="rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Default admin credentials</p>
        <p className="mt-1">Email: <span className="font-mono">{adminEmail}</span></p>
        <p>Password: <span className="font-mono">{adminPassword}</span></p>
        <p className="mt-2">Update the <code>.env</code> values to change the seeded SUPER_ADMIN account.</p>
      </div>
    </main>
  )
}
