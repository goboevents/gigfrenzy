// Check database state
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

async function checkState() {
  const email = 'test@gigfrenzy.com'
  
  console.log('📊 Database state for test@gigfrenzy.com:')
  
  // Check all vendors with this email
  const { data: vendors } = await supabase
    .from('vendors')
    .select('*')
    .eq('email', email)
  
  console.log('Vendors:', vendors)
  
  // Check all auth users with this email
  const { data: users } = await supabase.auth.admin.listUsers()
  const testUsers = users.users.filter(u => u.email === email)
  console.log('Auth users:', testUsers.map(u => ({ id: u.id, email: u.email })))
  
  // Check all vendor links
  if (testUsers.length > 0) {
    for (const user of testUsers) {
      const { data: links } = await supabase
        .from('vendor_user_vendors')
        .select('*')
        .eq('user_id', user.id)
      
      console.log(`Links for user ${user.id}:`, links)
    }
  }
}

checkState().catch(console.error)