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

async function checkData() {
  try {
    console.log('🔍 Checking data in Supabase...')
    
    // Check vendors
    console.log('\n📊 Checking vendors table...')
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendors')
      .select('*')
    
    if (vendorsError) {
      console.error('❌ Error fetching vendors:', vendorsError.message)
    } else {
      console.log(`✅ Found ${vendors?.length || 0} vendors:`)
      vendors?.forEach(vendor => {
        console.log(`   - ID: ${vendor.id}, Name: ${vendor.business_name}, Email: ${vendor.email}`)
      })
    }

    // Check vendor profiles
    console.log('\n📊 Checking vendor_profiles table...')
    const { data: profiles, error: profilesError } = await supabase
      .from('vendor_profiles')
      .select('*')
    
    if (profilesError) {
      console.error('❌ Error fetching vendor profiles:', profilesError.message)
    } else {
      console.log(`✅ Found ${profiles?.length || 0} vendor profiles:`)
      profiles?.forEach(profile => {
        console.log(`   - ID: ${profile.id}, Vendor ID: ${profile.vendor_id}, Display Name: ${profile.display_name}`)
      })
    }

    // Check vendor services
    console.log('\n📊 Checking vendor_services table...')
    const { data: services, error: servicesError } = await supabase
      .from('vendor_services')
      .select('*')
    
    if (servicesError) {
      console.error('❌ Error fetching vendor services:', servicesError.message)
    } else {
      console.log(`✅ Found ${services?.length || 0} vendor services:`)
      services?.forEach(service => {
        console.log(`   - ID: ${service.id}, Vendor ID: ${service.vendor_id}, Title: ${service.title}`)
      })
    }

    // Check vendor service areas
    console.log('\n📊 Checking vendor_service_areas table...')
    const { data: areas, error: areasError } = await supabase
      .from('vendor_service_areas')
      .select('*')
    
    if (areasError) {
      console.error('❌ Error fetching vendor service areas:', areasError.message)
    } else {
      console.log(`✅ Found ${areas?.length || 0} vendor service areas:`)
      areas?.forEach(area => {
        console.log(`   - ID: ${area.id}, Vendor ID: ${area.vendor_id}, City: ${area.city}, State: ${area.state}`)
      })
    }

    // Check vendor availability
    console.log('\n📊 Checking vendor_availability table...')
    const { data: availability, error: availabilityError } = await supabase
      .from('vendor_availability')
      .select('*')
    
    if (availabilityError) {
      console.error('❌ Error fetching vendor availability:', availabilityError.message)
    } else {
      console.log(`✅ Found ${availability?.length || 0} vendor availability records:`)
      availability?.forEach(avail => {
        console.log(`   - ID: ${avail.id}, Vendor ID: ${avail.vendor_id}`)
      })
    }

    // Check vendor user links
    console.log('\n📊 Checking vendor_user_vendors table...')
    const { data: userLinks, error: userLinksError } = await supabase
      .from('vendor_user_vendors')
      .select('*')
    
    if (userLinksError) {
      console.error('❌ Error fetching vendor user links:', userLinksError.message)
    } else {
      console.log(`✅ Found ${userLinks?.length || 0} vendor user links:`)
      userLinks?.forEach(link => {
        console.log(`   - User ID: ${link.user_id}, Vendor ID: ${link.vendor_id}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error checking data:', error)
    process.exit(1)
  }
}

checkData()
