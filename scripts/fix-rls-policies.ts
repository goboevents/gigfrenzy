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

async function fixRLSPolicies() {
  try {
    console.log('🔒 Fixing RLS policies for vendor_user_vendors table...')
    
    // Step 1: Create RLS policy to allow users to read their own vendor links
    console.log('\n📖 Creating read policy...')
    const { error: readPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Users can view their own vendor links" ON vendor_user_vendors
        FOR SELECT USING (auth.uid() = user_id);
      `
    })
    
    if (readPolicyError) {
      if (readPolicyError.message.includes('already exists')) {
        console.log('✅ Read policy already exists')
      } else {
        console.error('❌ Error creating read policy:', readPolicyError.message)
        return
      }
    } else {
      console.log('✅ Read policy created successfully')
    }
    
    // Step 2: Create RLS policy to allow users to insert their own vendor links
    console.log('\n➕ Creating insert policy...')
    const { error: insertPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Users can insert their own vendor links" ON vendor_user_vendors
        FOR INSERT WITH CHECK (auth.uid() = user_id);
      `
    })
    
    if (insertPolicyError) {
      if (insertPolicyError.message.includes('already exists')) {
        console.log('✅ Insert policy already exists')
      } else {
        console.error('❌ Error creating insert policy:', insertPolicyError.message)
        return
      }
    } else {
      console.log('✅ Insert policy created successfully')
    }
    
    // Step 3: Create RLS policy to allow users to update their own vendor links
    console.log('\n✏️  Creating update policy...')
    const { error: updatePolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Users can update their own vendor links" ON vendor_user_vendors
        FOR UPDATE USING (auth.uid() = user_id);
      `
    })
    
    if (updatePolicyError) {
      if (updatePolicyError.message.includes('already exists')) {
        console.log('✅ Update policy already exists')
      } else {
        console.error('❌ Error creating update policy:', updatePolicyError.message)
        return
      }
    } else {
      console.log('✅ Update policy created successfully')
    }
    
    // Step 4: Create RLS policy to allow users to delete their own vendor links
    console.log('\n🗑️  Creating delete policy...')
    const { error: deletePolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Users can delete their own vendor links" ON vendor_user_vendors
        FOR DELETE USING (auth.uid() = user_id);
      `
    })
    
    if (deletePolicyError) {
      if (deletePolicyError.message.includes('already exists')) {
        console.log('✅ Delete policy already exists')
      } else {
        console.error('❌ Error creating delete policy:', deletePolicyError.message)
        return
      }
    } else {
      console.log('✅ Delete policy created successfully')
    }
    
    console.log('\n🎉 RLS policies created successfully!')
    
    // Step 5: Test if the user can now see their vendor link
    console.log('\n🧪 Testing if user can now access vendor link...')
    await testUserAccess()
    
  } catch (error) {
    console.error('❌ Error during RLS policy creation:', error)
    process.exit(1)
  }
}

async function testUserAccess() {
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
    
    // Sign in as the test user
    const { data: { user }, error: signInError } = await anonSupabase.auth.signInWithPassword({
      email: 'dj@mixmasterpro.com',
      password: 'password123'
    })
    
    if (signInError || !user) {
      console.error('❌ Sign in failed:', signInError?.message || 'Unknown error')
      return
    }
    
    console.log(`✅ Signed in as: ${user.email}`)
    
    // Try to read the vendor link
    const { data: vendorLink, error: linkError } = await anonSupabase
      .from('vendor_user_vendors')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (linkError) {
      console.error('❌ Still cannot read vendor link:', linkError.message)
      return
    }
    
    if (vendorLink) {
      console.log('✅ Successfully read vendor link!')
      console.log(`   User ID: ${vendorLink.user_id}`)
      console.log(`   Vendor ID: ${vendorLink.vendor_id}`)
      
      console.log('\n🎉 Login system is now fully functional!')
      console.log('\n📋 Final Test Account Details:')
      console.log(`   Email: dj@mixmasterpro.com`)
      console.log(`   Password: password123`)
      console.log(`   User ID: ${user.id}`)
      console.log(`   Vendor ID: ${vendorLink.vendor_id}`)
    }
    
    // Sign out
    await anonSupabase.auth.signOut()
    
  } catch (error) {
    console.error('❌ Error during user access test:', error)
  }
}

// Run the setup
fixRLSPolicies()
  .then(() => {
    console.log('✅ RLS policy fix completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ RLS policy fix failed:', error)
    process.exit(1)
  })
