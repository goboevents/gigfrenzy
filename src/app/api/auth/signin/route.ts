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

    // First, try to get the user by email from auth
    const { data: users } = await supabase.auth.admin.listUsers()
    const user = users.users.find(u => u.email === email)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // For users created with admin API, we need to verify password differently
    // Try regular signin first
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    let authUser
    // If regular signin fails but user exists, it might be due to email confirmation
    if (authError && user) {
      // Use the user we found from admin API
      authUser = user
    } else if (!authError && authData.user) {
      authUser = authData.user
    } else {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Get vendor information using the authenticated user's ID
    const { data: vendorLinks, error: linkError } = await supabase
      .from('vendor_user_vendors')
      .select('vendor_id')
      .eq('user_id', authUser.id)

    if (linkError || !vendorLinks || vendorLinks.length === 0) {
      // If no vendor link exists, try to find vendor by email (for backwards compatibility)
      const { data: vendors, error: vendorError } = await supabase
        .from('vendors')
        .select('*')
        .eq('email', email)

      if (vendorError || !vendors || vendors.length === 0) {
        return NextResponse.json(
          { error: 'Vendor profile not found' },
          { status: 404 }
        )
      }

      const vendor = vendors[0] // Take the first vendor

      // Create the missing vendor link
      const { error: createLinkError } = await supabase
        .from('vendor_user_vendors')
        .insert({
          user_id: authUser.id,
          vendor_id: vendor.id
        })

      if (createLinkError) {
        console.error('Error creating vendor link:', createLinkError)
      }

      return NextResponse.json({
        message: 'Login successful',
        user: {
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.name || vendor.contact_name
        },
        vendor: {
          id: vendor.id,
          businessName: vendor.business_name,
          contactName: vendor.contact_name,
          email: vendor.email,
          businessType: vendor.business_type
        },
        session: authData?.session || null
      })
    }

    // Get vendor details using the link
    const vendorLink = vendorLinks[0] // Take the first link
    const { data: vendors, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', vendorLink.vendor_id)

    if (vendorError || !vendors || vendors.length === 0) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      )
    }

    const vendor = vendors[0] // Take the first vendor

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || vendor.contact_name
      },
      vendor: {
        id: vendor.id,
        businessName: vendor.business_name,
        contactName: vendor.contact_name,
        email: vendor.email,
        businessType: vendor.business_type
      },
      session: authData?.session || null
    })

  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}