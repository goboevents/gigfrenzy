import { NextRequest, NextResponse } from 'next/server'
import { signInVendorUser } from '@/lib/supabase-auth'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const { user, error } = await signInVendorUser(email, password)
    
    if (error) {
      return NextResponse.json({ error: error.message || 'Invalid credentials' }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    // Return user data (Supabase handles the session cookies automatically)
    return NextResponse.json({ 
      id: user.id, 
      email: user.email, 
      name: user.user_metadata?.full_name || user.email,
      role: 'vendor' 
    })
  } catch (e) {
    console.error('Login error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

