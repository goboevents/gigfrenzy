#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('URL:', supabaseUrl)
  console.error('Key:', supabaseAnonKey ? 'Present' : 'Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
})

async function fixTestUser() {
  try {
    console.log('🔧 Fixing test user for DJ MixMaster Pro...')
    
    // Step 1: Check if vendor exists
    console.log('\n📊 Checking existing vendor...')
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
    
    // Step 2: Check if user already exists
    console.log('\n👤 Checking if user already exists...')
    try {
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'dj@mixmasterpro.com',
        password: 'password123'
      })
      
      if (user && !signInError) {
        console.log('✅ User already exists and can sign in!')
        console.log(`   User ID: ${user.id}`)
        
        // Check if user is linked to vendor
        const { data: userLink, error: linkError } = await supabase
          .from('vendor_user_vendors')
          .select('*')
          .eq('user_id', user.id)
          .eq('vendor_id', vendors.id)
          .single()
        
        if (userLink && !linkError) {
          console.log('✅ User is already linked to vendor!')
          console.log('\n🎉 Test user is ready to use!')
          console.log('   Email: dj@mixmasterpro.com')
          console.log('   Password: password123')
          return
        } else {
          console.log('⚠️  User exists but not linked to vendor. Linking now...')
          await supabase.auth.signOut()
        }
      } else {
        console.log('❌ User does not exist or cannot sign in')
        await supabase.auth.signOut()
      }
    } catch (error) {
      console.log('❌ User does not exist')
    }
    
    // Step 3: Create new user
    console.log('\n👤 Creating new user...')
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: 'dj@mixmasterpro.com',
      password: 'password123',
      options: {
        data: {
          full_name: 'John Smith',
          role: 'vendor'
        }
      }
    })
    
    if (signUpError) {
      console.error('❌ Error creating user:', signUpError.message)
      return
    }
    
    if (!user) {
      console.error('❌ User creation failed')
      return
    }
    
    console.log(`✅ User created: ${user.id}`)
    
    // Step 4: Link user to existing vendor
    console.log('\n🔗 Linking user to vendor...')
    const { error: linkError } = await supabase
      .from('vendor_user_vendors')
      .insert({
        user_id: user.id,
        vendor_id: vendors.id
      })
    
    if (linkError) {
      console.error('❌ Error linking user to vendor:', linkError.message)
      return
    }
    
    console.log('✅ User linked to vendor successfully!')
    
    // Step 5: Test the login
    console.log('\n🧪 Testing login...')
    await supabase.auth.signOut()
    
    const { data: { user: testUser }, error: testError } = await supabase.auth.signInWithPassword({
      email: 'dj@mixmasterpro.com',
      password: 'password123'
    })
    
    if (testError || !testUser) {
      console.error('❌ Login test failed:', testError?.message || 'Unknown error')
      return
    }
    
    console.log('✅ Login test successful!')
    
    console.log('\n🎉 Test user setup completed successfully!')
    console.log('\n📋 Test Account Details:')
    console.log(`   Email: dj@mixmasterpro.com`)
    console.log(`   Password: password123`)
    console.log(`   User ID: ${user.id}`)
    console.log(`   Vendor ID: ${vendors.id}`)
    console.log('\n🔗 Test URLs:')
    console.log(`   Login: /login`)
    console.log(`   Vendor Dashboard: /vendor-dashboard`)
    
  } catch (error) {
    console.error('❌ Error during setup:', error)
    process.exit(1)
  }
}

// Run the setup
fixTestUser()
  .then(() => {
    console.log('✅ Setup completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  })
