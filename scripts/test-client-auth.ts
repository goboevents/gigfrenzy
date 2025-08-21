#!/usr/bin/env tsx

import { createBrowserSupabaseClient, signInClient } from '@/lib/supabase-client'

async function testClientAuth() {
  try {
    console.log('🧪 Testing client-side authentication...')
    
    // Test 1: Create client
    console.log('\n📱 Creating Supabase client...')
    const supabase = createBrowserSupabaseClient()
    console.log('✅ Client created successfully')
    
    // Test 2: Check environment variables
    console.log('\n🔑 Checking environment variables...')
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    console.log('   URL:', url ? 'Present' : 'Missing')
    console.log('   Key:', key ? 'Present' : 'Missing')
    
    if (!url || !key) {
      console.error('❌ Missing environment variables')
      return
    }
    
    // Test 3: Test sign in
    console.log('\n🔐 Testing sign in...')
    const { data, error } = await signInClient('dj@mixmasterpro.com', 'password123')
    
    if (error) {
      console.error('❌ Sign in failed:', error.message)
      return
    }
    
    if (data?.user) {
      console.log('✅ Sign in successful!')
      console.log('   User ID:', data.user.id)
      console.log('   Email:', data.user.email)
      console.log('   Session:', data.session ? 'Present' : 'Missing')
      
      // Test 4: Check if user can access vendor data
      console.log('\n📊 Testing vendor data access...')
      const { data: vendorLink, error: linkError } = await supabase
        .from('vendor_user_vendors')
        .select('*')
        .eq('user_id', data.user.id)
        .single()
      
      if (linkError) {
        console.error('❌ Cannot access vendor link:', linkError.message)
      } else if (vendorLink) {
        console.log('✅ Successfully accessed vendor link!')
        console.log('   Vendor ID:', vendorLink.vendor_id)
      } else {
        console.log('⚠️  No vendor link found')
      }
      
      // Test 5: Sign out
      console.log('\n🚪 Testing sign out...')
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) {
        console.error('❌ Sign out failed:', signOutError.message)
      } else {
        console.log('✅ Sign out successful')
      }
      
    } else {
      console.error('❌ No user data returned')
    }
    
  } catch (error) {
    console.error('❌ Error during client auth test:', error)
  }
}

// Run the test
testClientAuth()
  .then(() => {
    console.log('\n✅ Client auth test completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Client auth test failed:', error)
    process.exit(1)
  })
