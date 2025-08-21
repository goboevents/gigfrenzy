import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '@/lib/supabase-auth'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest()
    
    if (!authUser) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      userId: authUser.userId,
      role: authUser.role,
      name: authUser.name,
      email: authUser.email
    })
  } catch (e) {
    console.error('Auth check error', e)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}

