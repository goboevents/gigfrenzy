#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!supabaseAnonKey)
  console.log('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

// Create clients
const anonClient = createClient(supabaseUrl, supabaseAnonKey)
const serviceClient = createClient(supabaseUrl, supabaseServiceKey)

async function debugLoginIssue() {
  console.log('🔍 Debugging Login Issue...\n')
  
  try {
    // Test 1: Check environment variables
    console.log('1️⃣ Testing Environment Variables...')
    console.log('✅ Supabase URL:', supabaseUrl)
    console.log('✅ Anon Key:', supabaseAnonKey.substring(0, 20) + '...')
    console.log('✅ Service Key:', supabaseServiceKey.substring(0, 20) + '...\n')
    
    // Test 2: Test basic connection
    console.log('2️⃣ Testing Basic Connection...')
    const { data: { user }, error: connectionError } = await anonClient.auth.getUser()
    if (connectionError) {
      console.log('ℹ️  No authenticated user (expected):', connectionError.message)
    } else {
      console.log('ℹ️  Found authenticated user:', user?.email)
    }
    console.log('✅ Connection successful\n')
    
    // Test 3: Check if test user exists
    console.log('3️⃣ Checking Test User Existence...')
    const { data: { user: testUser }, error: userError } = await serviceClient.auth.admin.getUserByEmail('dj@mixmasterpro.com')
    
    if (userError) {
      console.error('❌ Error getting test user:', userError.message)
    } else if (!testUser) {
      console.error('❌ Test user not found')
    } else {
      console.log('✅ Test user found:', testUser.email)
      console.log('   User ID:', testUser.id)
      console.log('   Created:', testUser.created_at)
      console.log('   Email confirmed:', testUser.email_confirmed_at ? 'Yes' : 'No')
    }
    console.log()
    
    // Test 4: Check vendor_user_vendors table
    console.log('4️⃣ Checking Vendor User Links...')
    const { data: vendorLinks, error: linksError } = await serviceClient
      .from('vendor_user_vendors')
      .select('*')
    
    if (linksError) {
      console.error('❌ Error accessing vendor_user_vendors:', linksError.message)
    } else {
      console.log('✅ Successfully accessed vendor_user_vendors table')
      console.log('   Total links:', vendorLinks?.length || 0)
      if (vendorLinks && vendorLinks.length > 0) {
        console.log('   Sample link:', vendorLinks[0])
      }
    }
    console.log()
    
    // Test 5: Check RLS policies
    console.log('5️⃣ Checking RLS Policies...')
    const { data: policies, error: policiesError } = await serviceClient
      .from('information_schema.policies')
      .select('*')
      .eq('table_name', 'vendor_user_vendors')
    
    if (policiesError) {
      console.error('❌ Error checking RLS policies:', policiesError.message)
    } else {
      console.log('✅ RLS policies found:', policies?.length || 0)
      policies?.forEach(policy => {
        console.log(`   - ${policy.policy_name}: ${policy.action} ${policy.permissive ? 'PERMISSIVE' : 'RESTRICTIVE'}`)
      })
    }
    console.log()
    
    // Test 6: Try to authenticate with test credentials
    console.log('6️⃣ Testing Authentication...')
    const { data: { user: authUser }, error: authError } = await anonClient.auth.signInWithPassword({
      email: 'dj@mixmasterpro.com',
      password: 'password123'
    })
    
    if (authError) {
      console.error('❌ Authentication failed:', authError.message)
      console.error('   Error details:', authError)
    } else if (!authUser) {
      console.error('❌ No user returned from authentication')
    } else {
      console.log('✅ Authentication successful!')
      console.log('   User ID:', authUser.id)
      console.log('   Email:', authUser.email)
      
      // Test 7: Check if authenticated user can access vendor links
      console.log('\n7️⃣ Testing Authenticated Access to Vendor Links...')
      const { data: userVendorLinks, error: userLinksError } = await anonClient
        .from('vendor_user_vendors')
        .select('*')
        .eq('user_id', authUser.id)
      
      if (userLinksError) {
        console.error('❌ Authenticated user cannot access vendor links:', userLinksError.message)
        console.error('   This confirms the RLS policy issue!')
      } else {
        console.log('✅ Authenticated user can access vendor links')
        console.log('   Links found:', userVendorLinks?.length || 0)
        if (userVendorLinks && userVendorLinks.length > 0) {
          console.log('   Vendor ID:', userVendorLinks[0].vendor_id)
        }
      }
      
      // Sign out
      await anonClient.auth.signOut()
    }
    
  } catch (error) {
    console.error('❌ Unexpected error during debugging:', error)
  }
}

debugLoginIssue()
  .then(() => {
    console.log('\n🔍 Debugging completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Debugging failed:', error)
    process.exit(1)
  })
