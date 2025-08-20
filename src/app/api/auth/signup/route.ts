import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, businessName, businessType, contactName, phone, website, description } = await request.json()

    // Validate input
    if (!email || !password || !name || !businessName || !businessType || !contactName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    const supabase = createServiceRoleClient()

    // Create vendor record first
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .insert({
        business_name: businessName,
        contact_name: contactName,
        email,
        phone: phone || null,
        business_type: businessType,
        website: website || null,
        description: description || null
      })
      .select()
      .single()

    if (vendorError) {
      console.error('Error creating vendor:', vendorError)
      return NextResponse.json(
        { error: 'Failed to create vendor profile' },
        { status: 500 }
      )
    }

    // Create user account using Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for development
      user_metadata: {
        name,
        business_name: businessName,
        business_type: businessType,
        contact_name: contactName,
        phone: phone || null,
        website: website || null,
        description: description || null
      }
    })

    if (authError) {
      console.error('Error creating user:', authError)
      // Clean up vendor if user creation fails
      await supabase.from('vendors').delete().eq('id', vendorData.id)
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Link user to vendor
    const { error: linkError } = await supabase
      .from('vendor_user_vendors')
      .insert({
        user_id: authData.user.id,
        vendor_id: vendorData.id
      })

    if (linkError) {
      console.error('Error linking user to vendor:', linkError)
      // Clean up if linking fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      await supabase.from('vendors').delete().eq('id', vendorData.id)
      return NextResponse.json(
        { error: 'Failed to link user account' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: name
      },
      vendor: {
        id: vendorData.id,
        businessName: vendorData.business_name,
        contactName: vendorData.contact_name,
        email: vendorData.email
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}