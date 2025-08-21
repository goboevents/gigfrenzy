import { createClient } from '@supabase/supabase-js'

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

// Test with anon key (same as frontend)
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection with anon key...')
    
    // Test vendors table
    console.log('\n📊 Testing vendors table access...')
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendors')
      .select('*')
    
    if (vendorsError) {
      console.error('❌ Error accessing vendors:', vendorsError.message)
      console.error('   This might be an RLS policy issue')
    } else {
      console.log(`✅ Successfully accessed vendors: ${vendors?.length || 0} records`)
      if (vendors && vendors.length > 0) {
        console.log(`   First vendor: ${vendors[0].business_name}`)
      }
    }

    // Test vendor profiles table
    console.log('\n📊 Testing vendor_profiles table access...')
    const { data: profiles, error: profilesError } = await supabase
      .from('vendor_profiles')
      .select('*')
    
    if (profilesError) {
      console.error('❌ Error accessing vendor_profiles:', profilesError.message)
    } else {
      console.log(`✅ Successfully accessed vendor_profiles: ${profiles?.length || 0} records`)
    }

    // Test vendor services table
    console.log('\n📊 Testing vendor_services table access...')
    const { data: services, error: servicesError } = await supabase
      .from('vendor_services')
      .select('*')
    
    if (servicesError) {
      console.error('❌ Error accessing vendor_services:', servicesError.message)
    } else {
      console.log(`✅ Successfully accessed vendor_services: ${services?.length || 0} records`)
    }
    
  } catch (error) {
    console.error('❌ Error testing connection:', error)
    process.exit(1)
  }
}

testConnection()
