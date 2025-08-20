import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

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

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create vendor user
    const { data: userData, error: userError } = await supabase
      .from('vendor_users')
      .insert({
        email,
        password_hash: passwordHash,
        name,
        role: 'vendor'
      })
      .select()
      .single()

    if (userError) {
      console.error('Error creating user:', userError)
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Create vendor record
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
      // Clean up user if vendor creation fails
      await supabase.from('vendor_users').delete().eq('id', userData.id)
      return NextResponse.json(
        { error: 'Failed to create vendor profile' },
        { status: 500 }
      )
    }

    // Link user to vendor
    const { error: linkError } = await supabase
      .from('vendor_user_vendors')
      .insert({
        user_id: userData.id,
        vendor_id: vendorData.id
      })

    if (linkError) {
      console.error('Error linking user to vendor:', linkError)
      // Clean up if linking fails
      await supabase.from('vendor_users').delete().eq('id', userData.id)
      await supabase.from('vendors').delete().eq('id', vendorData.id)
      return NextResponse.json(
        { error: 'Failed to link user account' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role
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