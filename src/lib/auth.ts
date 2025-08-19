import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { getDatabase } from '@/lib/db'

export type AuthUser = { userId: number; role: 'vendor' | 'admin' }

function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || 'dev-insecure-secret-change-me'
  return new TextEncoder().encode(secret)
}

export async function getAuthUserFromRequest(): Promise<AuthUser | null> {
  const token = (await cookies()).get('auth_token')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    const userId = Number(payload.sub)
    const role = (payload.role as string) === 'admin' ? 'admin' : 'vendor'
    if (!Number.isFinite(userId)) return null
    return { userId, role }
  } catch {
    return null
  }
}

export async function requireAuthUser(): Promise<AuthUser> {
  const auth = await getAuthUserFromRequest()
  if (!auth) {
    throw new Error('UNAUTHORIZED')
  }
  return auth
}

export function getVendorIdForUser(userId: number): number | null {
  const db = getDatabase()
  const row = db.prepare('SELECT vendorId FROM vendor_user_vendors WHERE userId = ?').get(userId) as { vendorId: number } | undefined
  return row?.vendorId ?? null
}

