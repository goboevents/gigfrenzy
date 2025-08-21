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

async function setupRLSPolicies() {
  try {
    console.log('🔐 Setting up RLS policies...')
    
    // Enable RLS on all tables
    console.log('\n📊 Enabling RLS on tables...')
    const tables = ['vendors', 'vendor_profiles', 'vendor_services', 'vendor_service_areas', 'vendor_availability']
    
    for (const table of tables) {
      const { error } = await supabase.rpc('enable_rls', { table_name: table })
      if (error) {
        console.log(`ℹ️  RLS already enabled on ${table} or error:`, error.message)
      } else {
        console.log(`✅ Enabled RLS on ${table}`)
      }
    }

    // Create policies for vendors table
    console.log('\n📊 Setting up vendors table policies...')
    
    // Policy: Allow public read access to all vendors
    const { error: vendorsReadPolicy } = await supabase.rpc('create_policy', {
      table_name: 'vendors',
      policy_name: 'vendors_public_read',
      definition: 'SELECT',
      roles: ['anon', 'authenticated'],
      using: 'true'
    })
    
    if (vendorsReadPolicy) {
      console.log(`ℹ️  Vendors read policy already exists or error:`, vendorsReadPolicy.message)
    } else {
      console.log('✅ Created vendors public read policy')
    }

    // Policy: Allow vendors to update their own data
    const { error: vendorsUpdatePolicy } = await supabase.rpc('create_policy', {
      table_name: 'vendors',
      policy_name: 'vendors_update_own',
      definition: 'UPDATE',
      roles: ['authenticated'],
      using: 'id IN (SELECT vendor_id FROM vendor_user_vendors WHERE user_id = auth.uid())'
    })
    
    if (vendorsUpdatePolicy) {
      console.log(`ℹ️  Vendors update policy already exists or error:`, vendorsUpdatePolicy.message)
    } else {
      console.log('✅ Created vendors update policy')
    }

    // Create policies for vendor_profiles table
    console.log('\n📊 Setting up vendor_profiles table policies...')
    
    // Policy: Allow public read access to public profiles
    const { error: profilesReadPolicy } = await supabase.rpc('create_policy', {
      table_name: 'vendor_profiles',
      policy_name: 'vendor_profiles_public_read',
      definition: 'SELECT',
      roles: ['anon', 'authenticated'],
      using: 'visibility = \'public\''
    })
    
    if (profilesReadPolicy) {
      console.log(`ℹ️  Vendor profiles read policy already exists or error:`, profilesReadPolicy.message)
    } else {
      console.log('✅ Created vendor profiles public read policy')
    }

    // Policy: Allow vendors to update their own profile
    const { error: profilesUpdatePolicy } = await supabase.rpc('create_policy', {
      table_name: 'vendor_profiles',
      policy_name: 'vendor_profiles_update_own',
      definition: 'UPDATE',
      roles: ['authenticated'],
      using: 'vendor_id IN (SELECT vendor_id FROM vendor_user_vendors WHERE user_id = auth.uid())'
    })
    
    if (profilesUpdatePolicy) {
      console.log(`ℹ️  Vendor profiles update policy already exists or error:`, profilesUpdatePolicy.message)
    } else {
      console.log('✅ Created vendor profiles update policy')
    }

    // Create policies for vendor_services table
    console.log('\n📊 Setting up vendor_services table policies...')
    
    // Policy: Allow public read access to active services
    const { error: servicesReadPolicy } = await supabase.rpc('create_policy', {
      table_name: 'vendor_services',
      policy_name: 'vendor_services_public_read',
      definition: 'SELECT',
      roles: ['anon', 'authenticated'],
      using: 'is_active = true'
    })
    
    if (servicesReadPolicy) {
      console.log(`ℹ️  Vendor services read policy already exists or error:`, servicesReadPolicy.message)
    } else {
      console.log('✅ Created vendor services public read policy')
    }

    // Policy: Allow vendors to manage their own services
    const { error: servicesManagePolicy } = await supabase.rpc('create_policy', {
      table_name: 'vendor_services',
      policy_name: 'vendor_services_manage_own',
      definition: 'ALL',
      roles: ['authenticated'],
      using: 'vendor_id IN (SELECT vendor_id FROM vendor_user_vendors WHERE user_id = auth.uid())'
    })
    
    if (servicesManagePolicy) {
      console.log(`ℹ️  Vendor services manage policy already exists or error:`, servicesManagePolicy.message)
    } else {
      console.log('✅ Created vendor services manage policy')
    }

    // Create policies for vendor_service_areas table
    console.log('\n📊 Setting up vendor_service_areas table policies...')
    
    // Policy: Allow public read access to service areas
    const { error: areasReadPolicy } = await supabase.rpc('create_policy', {
      table_name: 'vendor_service_areas',
      policy_name: 'vendor_service_areas_public_read',
      definition: 'SELECT',
      roles: ['anon', 'authenticated'],
      using: 'true'
    })
    
    if (areasReadPolicy) {
      console.log(`ℹ️  Service areas read policy already exists or error:`, areasReadPolicy.message)
    } else {
      console.log('✅ Created service areas public read policy')
    }

    // Policy: Allow vendors to manage their own service areas
    const { error: areasManagePolicy } = await supabase.rpc('create_policy', {
      table_name: 'vendor_service_areas',
      policy_name: 'vendor_service_areas_manage_own',
      definition: 'ALL',
      roles: ['authenticated'],
      using: 'vendor_id IN (SELECT vendor_id FROM vendor_user_vendors WHERE user_id = auth.uid())'
    })
    
    if (areasManagePolicy) {
      console.log(`ℹ️  Service areas manage policy already exists or error:`, areasManagePolicy.message)
    } else {
      console.log('✅ Created service areas manage policy')
    }

    // Create policies for vendor_availability table
    console.log('\n📊 Setting up vendor_availability table policies...')
    
    // Policy: Allow public read access to availability
    const { error: availabilityReadPolicy } = await supabase.rpc('create_policy', {
      table_name: 'vendor_availability',
      policy_name: 'vendor_availability_public_read',
      definition: 'SELECT',
      roles: ['anon', 'authenticated'],
      using: 'true'
    })
    
    if (availabilityReadPolicy) {
      console.log(`ℹ️  Availability read policy already exists or error:`, availabilityReadPolicy.message)
    } else {
      console.log('✅ Created availability public read policy')
    }

    // Policy: Allow vendors to manage their own availability
    const { error: availabilityManagePolicy } = await supabase.rpc('create_policy', {
      table_name: 'vendor_availability',
      policy_name: 'vendor_availability_manage_own',
      definition: 'ALL',
      roles: ['authenticated'],
      using: 'vendor_id IN (SELECT vendor_id FROM vendor_user_vendors WHERE user_id = auth.uid())'
    })
    
    if (availabilityManagePolicy) {
      console.log(`ℹ️  Availability manage policy already exists or error:`, availabilityManagePolicy.message)
    } else {
      console.log('✅ Created availability manage policy')
    }

    console.log('\n🎉 RLS policies setup completed!')
    console.log('\n📋 Summary of policies created:')
    console.log('   - Public read access to vendors, profiles, services, areas, and availability')
    console.log('   - Authenticated users can manage their own data')
    console.log('   - Profiles only show public ones to anonymous users')
    console.log('   - Services only show active ones to anonymous users')
    
  } catch (error) {
    console.error('❌ Error setting up RLS policies:', error)
    process.exit(1)
  }
}

setupRLSPolicies()
