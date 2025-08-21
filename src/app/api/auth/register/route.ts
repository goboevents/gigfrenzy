import { NextRequest, NextResponse } from 'next/server'
import { signUpVendorUser } from '@/lib/supabase-auth'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, businessName, contactName, businessType, phone, website, description } = await request.json()
    
    if (!email || !password || !name || !businessName || !contactName || !businessType) {
      return NextResponse.json({ 
        error: 'Missing required fields: email, password, name, businessName, contactName, businessType' 
      }, { status: 400 })
    }

    const userData = {
      name,
      businessName,
      contactName,
      businessType,
      phone: phone || '',
      website: website || '',
      description: description || ''
    }

    const { user, error } = await signUpVendorUser(email, password, userData)
    
    if (error) {
      return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 400 })
    }

    if (!user) {
      return NextResponse.json({ error: 'User creation failed' }, { status: 500 })
    }

    // Return success response
    return NextResponse.json({ 
      message: 'Registration successful. Please check your email to confirm your account.',
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
        role: 'vendor'
      }
    })
  } catch (e) {
    console.error('Registration error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

