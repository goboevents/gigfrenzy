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

async function fixVendorProfileVisibility() {
  try {
    console.log('🔧 Fixing vendor profile visibility...')
    
    // Check current vendor profiles
    console.log('\n📊 Checking current vendor profiles...')
    const { data: profiles, error: profilesError } = await supabase
      .from('vendor_profiles')
      .select('*')
    
    if (profilesError) {
      console.error('❌ Error fetching vendor profiles:', profilesError.message)
      return
    }
    
    console.log(`Found ${profiles?.length || 0} vendor profiles:`)
    profiles?.forEach(profile => {
      console.log(`   - ID: ${profile.id}, Display Name: ${profile.display_name}, Visibility: ${profile.visibility || 'NULL'}`)
    })
    
    // Update all vendor profiles to have 'public' visibility
    console.log('\n🔧 Updating vendor profile visibility to "public"...')
    
    for (const profile of profiles || []) {
      const { error } = await supabase
        .from('vendor_profiles')
        .update({ visibility: 'public' })
        .eq('id', profile.id)
      
      if (error) {
        console.error(`❌ Error updating profile ${profile.id}:`, error.message)
      } else {
        console.log(`✅ Updated profile ${profile.id} visibility to 'public'`)
      }
    }
    
    // Verify the changes
    console.log('\n📊 Verifying changes...')
    const { data: updatedProfiles, error: verifyError } = await supabase
      .from('vendor_profiles')
      .select('*')
    
    if (verifyError) {
      console.error('❌ Error verifying changes:', verifyError.message)
    } else {
      console.log('Updated vendor profiles:')
      updatedProfiles?.forEach(profile => {
        console.log(`   - ID: ${profile.id}, Display Name: ${profile.display_name}, Visibility: ${profile.visibility}`)
      })
    }
    
    console.log('\n🎉 Vendor profile visibility fix completed!')
    console.log('All profiles now have "public" visibility and should be accessible via the API.')
    
  } catch (error) {
    console.error('❌ Error fixing vendor profile visibility:', error)
    process.exit(1)
  }
}

fixVendorProfileVisibility()
