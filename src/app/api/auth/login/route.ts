import { NextRequest, NextResponse } from 'next/server'
import { findVendorUserByEmail } from '@/lib/repositories/vendorUserRepository'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

export const runtime = 'nodejs'

const JWT_ALG = 'HS256'
function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || 'dev-insecure-secret-change-me'
  return new TextEncoder().encode(secret)
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = findVendorUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await new SignJWT({ sub: String(user.id), role: user.role })
      .setProtectedHeader({ alg: JWT_ALG })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(getJwtSecret())

    const res = NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role })
    res.cookies.set('auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return res
  } catch (e) {
    console.error('Login error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

