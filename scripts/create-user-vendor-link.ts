#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
})

async function createUserVendorLink() {
  try {
    console.log('🔗 Creating user-vendor link...')
    
    // Step 1: Sign in as the user we just created
    console.log('\n👤 Signing in as test user...')
    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'dj@mixmasterpro.com',
      password: 'password123'
    })
    
    if (signInError || !user) {
      console.error('❌ Sign in failed:', signInError?.message || 'Unknown error')
      return
    }
    
    console.log(`✅ Signed in as: ${user.email} (ID: ${user.id})`)
    
    // Step 2: Try to create the link while authenticated as the user
    console.log('\n🔗 Creating user-vendor link...')
    const { error: linkError } = await supabase
      .from('vendor_user_vendors')
      .insert({
        user_id: user.id,
        vendor_id: 1  // We know the vendor ID from the previous script
      })
    
    if (linkError) {
      console.error('❌ Error creating link:', linkError.message)
      
      // Check if the link already exists
      if (linkError.message.includes('duplicate key')) {
        console.log('ℹ️  Link already exists, checking current status...')
        
        const { data: existingLink, error: checkError } = await supabase
          .from('vendor_user_vendors')
          .select('*')
          .eq('user_id', user.id)
          .eq('vendor_id', 1)
          .single()
        
        if (existingLink && !checkError) {
          console.log('✅ Link already exists!')
          console.log(`   User ID: ${existingLink.user_id}`)
          console.log(`   Vendor ID: ${existingLink.vendor_id}`)
          
          // Test if login works now
          console.log('\n🧪 Testing login functionality...')
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
          console.log('\n🎉 Test user is now fully functional!')
          console.log('\n📋 Test Account Details:')
          console.log(`   Email: dj@mixmasterpro.com`)
          console.log(`   Password: password123`)
          console.log(`   User ID: ${testUser.id}`)
          console.log(`   Vendor ID: 1`)
          return
        }
      }
      
      return
    }
    
    console.log('✅ User-vendor link created successfully!')
    
    // Step 3: Test if login works now
    console.log('\n🧪 Testing login functionality...')
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
    console.log('\n🎉 Test user is now fully functional!')
    console.log('\n📋 Test Account Details:')
    console.log(`   Email: dj@mixmasterpro.com`)
    console.log(`   Password: password123`)
    console.log(`   User ID: ${testUser.id}`)
    console.log(`   Vendor ID: 1`)
    
  } catch (error) {
    console.error('❌ Error during setup:', error)
    process.exit(1)
  }
}

// Run the setup
createUserVendorLink()
  .then(() => {
    console.log('✅ Setup completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  })
