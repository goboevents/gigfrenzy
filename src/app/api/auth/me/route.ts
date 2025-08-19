import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export const runtime = 'nodejs'

function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || 'dev-insecure-secret-change-me'
  return new TextEncoder().encode(secret)
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) return NextResponse.json({ authenticated: false }, { status: 200 })

    const { payload } = await jwtVerify(token, getJwtSecret())
    const userId = Number(payload.sub)
    if (!Number.isFinite(userId)) return NextResponse.json({ authenticated: false }, { status: 200 })

    // Minimal response; use a real user fetch if needed later
    return NextResponse.json({ authenticated: true, userId, role: payload.role })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }
}

