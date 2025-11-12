export async function createUser(formData: FormData) {
  'use server'
  const name = String(formData.get('name') || '')
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')
  if (!email || !password) throw new Error('Email and password required')

  const { registerUser } = await import('@/lib/auth/register')
  await registerUser({ name, email, password })
  const { redirect } = await import('next/navigation')
  redirect('/auth/check-email')
}
