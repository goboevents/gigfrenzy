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

async function clearData() {
  try {
    console.log('🧹 Clearing existing data from Supabase...')
    
    // Clear data in reverse dependency order
    const tables = [
      'vendor_user_vendors',
      'vendor_availability',
      'vendor_service_areas', 
      'vendor_services',
      'vendor_profiles',
      'vendors'
    ]
    
    for (const table of tables) {
      console.log(`🗑️  Clearing ${table}...`)
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', 0) // Delete all records
      
      if (error) {
        console.error(`❌ Error clearing ${table}:`, error.message)
      } else {
        console.log(`✅ Cleared ${table}`)
      }
    }
    
    console.log('\n🎉 Data clearing completed successfully!')
    console.log('⚠️  Note: This only cleared data, not the table structure')
    
  } catch (error) {
    console.error('❌ Error during data clearing:', error)
    process.exit(1)
  }
}

clearData()
