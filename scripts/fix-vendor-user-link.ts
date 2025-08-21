#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixVendorUserLink() {
  try {
    console.log('🔧 Fixing vendor user link with service role key...')
    
    // Step 1: Check current state
    console.log('\n📊 Checking current state...')
    
    // Check if user exists
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    if (usersError) {
      console.error('❌ Error listing users:', usersError.message)
      return
    }
    
    const testUser = users.find(u => u.email === 'dj@mixmasterpro.com')
    if (!testUser) {
      console.error('❌ Test user not found')
      return
    }
    
    console.log(`✅ Found test user: ${testUser.email} (ID: ${testUser.id})`)
    console.log(`   Email confirmed: ${testUser.email_confirmed_at ? 'Yes' : 'No'}`)
    
    // Check if vendor exists
    const { data: vendors, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('email', 'dj@mixmasterpro.com')
      .single()
    
    if (vendorError || !vendors) {
      console.error('❌ Vendor not found:', vendorError?.message || 'No vendor found')
      return
    }
    
    console.log(`✅ Found vendor: ${vendors.business_name} (ID: ${vendors.id})`)
    
    // Check if link already exists
    const { data: existingLink, error: linkCheckError } = await supabase
      .from('vendor_user_vendors')
      .select('*')
      .eq('user_id', testUser.id)
      .eq('vendor_id', vendors.id)
      .single()
    
    if (existingLink && !linkCheckError) {
      console.log('✅ Link already exists!')
      console.log(`   User ID: ${existingLink.user_id}`)
      console.log(`   Vendor ID: ${existingLink.vendor_id}`)
      
      // Test if login works now
      await testLogin()
      return
    }
    
    // Step 2: Create the link using service role key
    console.log('\n🔗 Creating user-vendor link...')
    const { error: insertError } = await supabase
      .from('vendor_user_vendors')
      .insert({
        user_id: testUser.id,
        vendor_id: vendors.id
      })
    
    if (insertError) {
      console.error('❌ Error creating link:', insertError.message)
      
      // If it's a duplicate key error, the link might already exist
      if (insertError.message.includes('duplicate key')) {
        console.log('ℹ️  Link might already exist, checking again...')
        
        const { data: recheckLink, error: recheckError } = await supabase
          .from('vendor_user_vendors')
          .select('*')
          .eq('user_id', testUser.id)
          .eq('vendor_id', vendors.id)
          .single()
        
        if (recheckLink && !recheckError) {
          console.log('✅ Link exists after recheck!')
          await testLogin()
          return
        }
      }
      
      return
    }
    
    console.log('✅ User-vendor link created successfully!')
    
    // Step 3: Test if login works now
    await testLogin()
    
  } catch (error) {
    console.error('❌ Error during setup:', error)
    process.exit(1)
  }
}

async function testLogin() {
  console.log('\n🧪 Testing login functionality...')
  
  try {
    // Create a new client with anon key for testing
    const anonSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true
        }
      }
    )
    
    const { data: { user }, error: signInError } = await anonSupabase.auth.signInWithPassword({
      email: 'dj@mixmasterpro.com',
      password: 'password123'
    })
    
    if (signInError || !user) {
      console.error('❌ Login test failed:', signInError?.message || 'Unknown error')
      return
    }
    
    console.log('✅ Login test successful!')
    console.log(`   User ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    
    // Check if user is properly linked to vendor
    const { data: vendorLink, error: linkError } = await anonSupabase
      .from('vendor_user_vendors')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (vendorLink && !linkError) {
      console.log('✅ User is properly linked to vendor!')
      console.log(`   Vendor ID: ${vendorLink.vendor_id}`)
    } else {
      console.log('⚠️  User-vendor link not found after login')
    }
    
    console.log('\n🎉 Test user is now fully functional!')
    console.log('\n📋 Test Account Details:')
    console.log(`   Email: dj@mixmasterpro.com`)
    console.log(`   Password: password123`)
    console.log(`   User ID: ${user.id}`)
    console.log(`   Vendor ID: ${vendorLink?.vendor_id || 'Unknown'}`)
    
    // Sign out
    await anonSupabase.auth.signOut()
    
  } catch (error) {
    console.error('❌ Error during login test:', error)
  }
}

// Run the setup
fixVendorUserLink()
  .then(() => {
    console.log('✅ Setup completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  })
