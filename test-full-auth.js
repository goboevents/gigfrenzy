// Complete authentication test
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testFullAuth() {
  console.log('🧹 Cleaning up any existing test data...')
  
  // Clean up existing test data
  await supabase.from('vendor_user_vendors').delete().match({ user_id: { ilike: '%test%' } })
  await supabase.from('vendors').delete().match({ email: 'test@gigfrenzy.com' })
  
  // Delete user from auth if exists
  try {
    const { data: users } = await supabase.auth.admin.listUsers()
    const testUser = users.users.find(u => u.email === 'test@gigfrenzy.com')
    if (testUser) {
      await supabase.auth.admin.deleteUser(testUser.id)
      console.log('✅ Cleaned up existing test user')
    }
  } catch (e) {
    console.log('No existing user to clean up')
  }

  console.log('\n🔨 Testing signup flow...')
  
  // Test signup
  const signupResponse = await fetch('http://localhost:3000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@gigfrenzy.com',
      password: 'testpassword123',
      name: 'Test User',
      businessName: 'Test Photography Studio',
      businessType: 'Photography',
      contactName: 'John Doe'
    })
  })
  
  const signupData = await signupResponse.json()
  console.log('Signup response:', signupData)
  
  if (signupData.error) {
    console.error('❌ Signup failed:', signupData.error)
    return
  }
  
  console.log('✅ Signup successful!')
  
  // Wait a moment for data to propagate
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log('\n🔐 Testing signin flow...')
  
  // Test signin
  const signinResponse = await fetch('http://localhost:3000/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@gigfrenzy.com',
      password: 'testpassword123'
    })
  })
  
  const signinData = await signinResponse.json()
  console.log('Signin response:', signinData)
  
  if (signinData.error) {
    console.error('❌ Signin failed:', signinData.error)
    
    // Debug: Check what's in the database
    console.log('\n🔍 Debugging database state...')
    
    const { data: vendors } = await supabase.from('vendors').select('*').eq('email', 'test@gigfrenzy.com')
    console.log('Vendors:', vendors)
    
    const { data: users } = await supabase.auth.admin.listUsers()
    const testUser = users.users.find(u => u.email === 'test@gigfrenzy.com')
    console.log('Auth user:', testUser ? { id: testUser.id, email: testUser.email } : 'Not found')
    
    if (testUser) {
      const { data: links } = await supabase.from('vendor_user_vendors').select('*').eq('user_id', testUser.id)
      console.log('Vendor links:', links)
    }
    
    return
  }
  
  console.log('✅ Signin successful!')
  
  console.log('\n🎉 All authentication tests passed!')
}

testFullAuth().catch(console.error)