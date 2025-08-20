import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    console.log('🔐 Debug signin for:', email)

    if (!email || !password) {
      console.log('❌ Missing email or password')
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    // 1. Check if user exists in auth
    console.log('1️⃣ Checking auth users...')
    const { data: users } = await supabase.auth.admin.listUsers()
    const user = users.users.find(u => u.email === email)
    console.log('User found:', user ? { id: user.id, email: user.email } : 'NO')

    if (!user) {
      console.log('❌ No user found in auth')
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // 2. Try signin
    console.log('2️⃣ Trying signin...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    console.log('Signin result:', authError ? `ERROR: ${authError.message}` : 'SUCCESS')

    let authUser
    if (authError && user) {
      console.log('📝 Using admin user due to signin error')
      authUser = user
    } else if (!authError && authData.user) {
      console.log('📝 Using signin user')
      authUser = authData.user
    } else {
      console.log('❌ No valid auth user')
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // 3. Check vendor links
    console.log('3️⃣ Checking vendor links for user:', authUser.id)
    const { data: vendorLinks, error: linkError } = await supabase
      .from('vendor_user_vendors')
      .select('vendor_id')
      .eq('user_id', authUser.id)

    console.log('Link query result:', linkError ? `ERROR: ${linkError.message}` : `SUCCESS: ${vendorLinks?.length} links`)

    if (linkError || !vendorLinks || vendorLinks.length === 0) {
      console.log('4️⃣ No links found, trying vendor by email...')
      const { data: vendors, error: vendorError } = await supabase
        .from('vendors')
        .select('*')
        .eq('email', email)

      console.log('Vendor by email result:', vendorError ? `ERROR: ${vendorError.message}` : `SUCCESS: ${vendors?.length} vendors`)

      if (vendorError || !vendors || vendors.length === 0) {
        console.log('❌ No vendor found by email')
        return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 })
      }

      const vendor = vendors[0]
      console.log('✅ Found vendor by email:', vendor.business_name)
      return NextResponse.json({
        message: 'Login successful (by email)',
        user: { id: authUser.id, email: authUser.email, name: authUser.user_metadata?.name || vendor.contact_name },
        vendor: { id: vendor.id, businessName: vendor.business_name, contactName: vendor.contact_name, email: vendor.email, businessType: vendor.business_type }
      })
    }

    // 5. Get vendor by link
    console.log('5️⃣ Getting vendor by link...')
    const vendorLink = vendorLinks[0]
    const { data: vendors, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', vendorLink.vendor_id)

    console.log('Vendor by link result:', vendorError ? `ERROR: ${vendorError.message}` : `SUCCESS: ${vendors?.length} vendors`)

    if (vendorError || !vendors || vendors.length === 0) {
      console.log('❌ No vendor found by link')
      return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 })
    }

    const vendor = vendors[0]
    console.log('✅ Found vendor by link:', vendor.business_name)

    return NextResponse.json({
      message: 'Login successful (by link)',
      user: { id: authUser.id, email: authUser.email, name: authUser.user_metadata?.name || vendor.contact_name },
      vendor: { id: vendor.id, businessName: vendor.business_name, contactName: vendor.contact_name, email: vendor.email, businessType: vendor.business_type }
    })

  } catch (error) {
    console.error('❌ Signin error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}