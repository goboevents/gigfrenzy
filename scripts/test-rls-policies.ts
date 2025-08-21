#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

// Create clients
const anonClient = createClient(supabaseUrl, supabaseAnonKey)
const serviceClient = createClient(supabaseUrl, supabaseServiceKey)

async function testRLSPolicies() {
  console.log('🔒 Testing RLS Policies on vendor_user_vendors table...\n')
  
  try {
    // Step 1: Check current RLS policies
    console.log('1️⃣ Current RLS Policies:')
    const { data: policies, error: policiesError } = await serviceClient
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'vendor_user_vendors')
    
    if (policiesError) {
      console.error('❌ Error checking policies:', policiesError.message)
    } else if (!policies || policies.length === 0) {
      console.error('❌ No RLS policies found!')
    } else {
      console.log('✅ Found policies:')
      policies.forEach(policy => {
        console.log(`   - ${policy.policyname}: ${policy.cmd} ${policy.permissive ? 'PERMISSIVE' : 'RESTRICTIVE'}`)
        console.log(`     Condition: ${policy.qual}`)
      })
    }
    console.log()
    
    // Step 2: Check if RLS is enabled
    console.log('2️⃣ RLS Status:')
    const { data: rlsStatus, error: rlsError } = await serviceClient
      .from('pg_tables')
      .select('relname, relrowsecurity')
      .eq('relname', 'vendor_user_vendors')
    
    if (rlsError) {
      console.error('❌ Error checking RLS status:', rlsError.message)
    } else if (rlsStatus && rlsStatus.length > 0) {
      const table = rlsStatus[0]
      console.log(`   Table: ${table.relname}`)
      console.log(`   RLS Enabled: ${table.relrowsecurity ? 'Yes' : 'No'}`)
    }
    console.log()
    
    // Step 3: Test authentication
    console.log('3️⃣ Testing Authentication:')
    const { data: { user }, error: authError } = await anonClient.auth.signInWithPassword({
      email: 'dj@mixmasterpro.com',
      password: 'password123'
    })
    
    if (authError) {
      console.error('❌ Authentication failed:', authError.message)
      return
    }
    
    if (!user) {
      console.error('❌ No user returned')
      return
    }
    
    console.log('✅ Authentication successful')
    console.log(`   User ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log()
    
    // Step 4: Test access to vendor_user_vendors with authenticated user
    console.log('4️⃣ Testing Access to vendor_user_vendors:')
    const { data: vendorLinks, error: accessError } = await anonClient
      .from('vendor_user_vendors')
      .select('*')
      .eq('user_id', user.id)
    
    if (accessError) {
      console.error('❌ Access denied:', accessError.message)
      console.error('   Error code:', accessError.code)
      console.error('   Error details:', accessError.details)
      console.error('   Hint:', accessError.hint)
      
      // This is likely the RLS policy issue
      console.log('\n🔍 RLS Policy Issue Detected!')
      console.log('   The user is authenticated but cannot access their vendor link.')
      console.log('   This suggests the RLS policy condition is not working correctly.')
    } else {
      console.log('✅ Access successful')
      console.log(`   Links found: ${vendorLinks?.length || 0}`)
      if (vendorLinks && vendorLinks.length > 0) {
        console.log(`   Vendor ID: ${vendorLinks[0].vendor_id}`)
      }
    }
    
    // Step 5: Check what the user can actually see
    console.log('\n5️⃣ Testing Different Queries:')
    
    // Try to see all records (should fail due to RLS)
    const { data: allRecords, error: allError } = await anonClient
      .from('vendor_user_vendors')
      .select('*')
    
    if (allError) {
      console.log('   ❌ Cannot see all records (expected due to RLS):', allError.message)
    } else {
      console.log('   ⚠️  Can see all records (RLS not working properly)')
    }
    
    // Try to see specific user record
    const { data: userRecord, error: userError } = await anonClient
      .from('vendor_user_vendors')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (userError) {
      console.log('   ❌ Cannot see own record:', userError.message)
    } else {
      console.log('   ✅ Can see own record:', userRecord)
    }
    
    // Sign out
    await anonClient.auth.signOut()
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

testRLSPolicies()
  .then(() => {
    console.log('\n🔍 RLS Policy testing completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ RLS Policy testing failed:', error)
    process.exit(1)
  })
