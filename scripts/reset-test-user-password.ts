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

async function resetTestUserPassword() {
  try {
    console.log('🔑 Resetting test user password...')
    
    // Step 1: Find the test user
    console.log('\n📊 Finding test user...')
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
    
    // Step 2: Update the user's password
    console.log('\n🔑 Updating user password...')
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      testUser.id,
      {
        password: 'password123'
      }
    )
    
    if (updateError) {
      console.error('❌ Error updating password:', updateError.message)
      return
    }
    
    console.log('✅ Password updated successfully!')
    console.log(`   User ID: ${updatedUser.user.id}`)
    console.log(`   Email: ${updatedUser.user.email}`)
    
    // Step 3: Test the login
    console.log('\n🧪 Testing login with new password...')
    await testLogin()
    
  } catch (error) {
    console.error('❌ Error during password reset:', error)
    process.exit(1)
  }
}

async function testLogin() {
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
resetTestUserPassword()
  .then(() => {
    console.log('✅ Password reset completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Password reset failed:', error)
    process.exit(1)
  })
