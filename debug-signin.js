// Debug signin process
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

async function debugSignin() {
  const email = 'test@gigfrenzy.com'
  const password = 'testpassword123'
  
  console.log('🔍 Debugging signin process...')
  
  // 1. Check if user exists in auth
  const { data: users } = await supabase.auth.admin.listUsers()
  const user = users.users.find(u => u.email === email)
  console.log('1. User in auth:', user ? { id: user.id, email: user.email } : 'NOT FOUND')
  
  if (!user) return
  
  // 2. Try signin
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  console.log('2. Signin attempt:', authError ? `ERROR: ${authError.message}` : 'SUCCESS')
  
  // 3. Check vendor link
  const { data: vendorLink, error: linkError } = await supabase
    .from('vendor_user_vendors')
    .select('vendor_id')
    .eq('user_id', user.id)
    .single()
  
  console.log('3. Vendor link query:', linkError ? `ERROR: ${linkError.message}` : `SUCCESS: ${JSON.stringify(vendorLink)}`)
  
  if (vendorLink) {
    // 4. Check vendor details
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', vendorLink.vendor_id)
      .single()
    
    console.log('4. Vendor query:', vendorError ? `ERROR: ${vendorError.message}` : `SUCCESS: ${vendor.business_name}`)
  }
  
  // 5. Check vendor by email (fallback)
  const { data: vendorByEmail, error: vendorEmailError } = await supabase
    .from('vendors')
    .select('*')
    .eq('email', email)
    .single()
  
  console.log('5. Vendor by email query:', vendorEmailError ? `ERROR: ${vendorEmailError.message}` : `SUCCESS: ${vendorByEmail.business_name}`)
}

debugSignin().catch(console.error)