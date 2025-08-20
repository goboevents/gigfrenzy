import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = createServiceRoleClient()

    // Authenticate user using Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Get vendor information
    const { data: vendorLink, error: linkError } = await supabase
      .from('vendor_user_vendors')
      .select('vendor_id')
      .eq('user_id', authData.user.id)
      .single()

    if (linkError || !vendorLink) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      )
    }

    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', vendorLink.vendor_id)
      .single()

    if (vendorError || !vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name || 'Unknown'
      },
      vendor: {
        id: vendor.id,
        businessName: vendor.business_name,
        contactName: vendor.contact_name,
        email: vendor.email,
        businessType: vendor.business_type
      },
      session: authData.session
    })

  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}