import { createClient } from '@supabase/supabase-js'

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function disableRLS() {
  try {
    console.log('🔓 Temporarily disabling RLS on tables...')
    
    const tables = ['vendors', 'vendor_profiles', 'vendor_services', 'vendor_service_areas', 'vendor_availability']
    
    for (const table of tables) {
      console.log(`🔓 Disabling RLS on ${table}...`)
      const { error } = await supabase.rpc('disable_rls', { table_name: table })
      if (error) {
        console.log(`ℹ️  Could not disable RLS on ${table}:`, error.message)
      } else {
        console.log(`✅ Disabled RLS on ${table}`)
      }
    }
    
    console.log('\n🎉 RLS disabled on all tables!')
    console.log('⚠️  Note: This is temporary for testing. Re-enable RLS in production.')
    
  } catch (error) {
    console.error('❌ Error disabling RLS:', error)
    process.exit(1)
  }
}

disableRLS()
