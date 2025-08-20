import { NextRequest, NextResponse } from 'next/server'
import { createClientComponentClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('Simple signin starting...')
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    console.log('Attempting signin for:', email)
    const supabase = createClientComponentClient()

    // Simple signin attempt
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    console.log('Signin result:', error ? `ERROR: ${error.message}` : 'SUCCESS')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email
      }
    })

  } catch (error) {
    console.error('Simple signin error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}