import { NextResponse } from 'next/server'

export function requireSession(session: any) {
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}
export function hasRole(role: string | undefined | null, allowed: string[] = []) {
  if (!role) return false
  return allowed.includes(role)
}

export function requireRole(session: any, roles: string[]) {
  const role = (session as any).user?.role
  if (!hasRole(role, roles)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return null
}

export function isOwner(session: any, ownerId?: string) {
  return (session as any).user?.id === ownerId
}
