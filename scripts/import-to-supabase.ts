import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

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

const exportDir = path.join(process.cwd(), 'data', 'export')

async function importData() {
  try {
    console.log('🚀 Starting data import to Supabase...')
    
    // Check if export directory exists
    if (!fs.existsSync(exportDir)) {
      console.error('❌ Export directory not found. Run export-sqlite-data.ts first.')
      process.exit(1)
    }

    // Import vendors first (they have no dependencies)
    console.log('\n📊 Importing vendors...')
    const vendorsData = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'vendors.json'), 'utf8')
    )
    
    for (const vendor of vendorsData) {
      const { error } = await supabase
        .from('vendors')
        .insert({
          id: vendor.id,
          business_name: vendor.businessName,
          contact_name: vendor.contactName,
          email: vendor.email,
          phone: vendor.phone || '',
          business_type: vendor.businessType,
          website: vendor.website || '',
          description: vendor.description || '',
          created_at: vendor.createdAt || new Date().toISOString()
        })
      
      if (error) {
        console.error(`❌ Error importing vendor ${vendor.id}:`, error.message)
      } else {
        console.log(`✅ Imported vendor: ${vendor.businessName}`)
      }
    }

    // Import vendor profiles
    console.log('\n📊 Importing vendor profiles...')
    const vendorProfilesData = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'vendor_profiles.json'), 'utf8')
    )
    
    for (const profile of vendorProfilesData) {
      const { error } = await supabase
        .from('vendor_profiles')
        .insert({
          id: profile.id,
          vendor_id: profile.vendorId,
          slug: profile.slug,
          display_name: profile.displayName,
          headline: profile.headline || null,
          bio: profile.bio || null,
          location: profile.location || null,
          website: profile.website || null,
          avatar_url: profile.avatarUrl || null,
          cover_image_url: profile.coverImageUrl || null,
          visibility: profile.visibility || 'public',
          created_at: profile.createdAt || new Date().toISOString(),
          updated_at: profile.updatedAt || new Date().toISOString()
        })
      
      if (error) {
        console.error(`❌ Error importing vendor profile ${profile.id}:`, error.message)
      } else {
        console.log(`✅ Imported vendor profile: ${profile.displayName}`)
      }
    }

    // Import vendor services
    console.log('\n📊 Importing vendor services...')
    const vendorServicesData = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'vendor_services.json'), 'utf8')
    )
    
    for (const service of vendorServicesData) {
      // Parse features array properly
      let features = null
      if (service.features && service.features !== '[]') {
        try {
          if (typeof service.features === 'string') {
            features = JSON.parse(service.features)
          } else {
            features = service.features
          }
        } catch (e) {
          console.warn(`⚠️  Could not parse features for service ${service.id}, setting to null`)
          features = null
        }
      }
      
      const { error } = await supabase
        .from('vendor_services')
        .insert({
          id: service.id,
          vendor_id: service.vendorId,
          title: service.title,
          description: service.description || null,
          price_cents: service.priceCents,
          is_active: Boolean(service.isActive),
          type: service.type,
          duration: service.duration || null,
          features: features,
          is_popular: Boolean(service.isPopular),
          pricing_model: service.pricingModel || null,
          hourly_rate: service.hourlyRate || null,
          deposit_required: Boolean(service.depositRequired),
          deposit_percentage: service.depositPercentage || null,
          cancellation_policy: service.cancellationPolicy || null,
          created_at: service.createdAt || new Date().toISOString(),
          updated_at: service.updatedAt || new Date().toISOString()
        })
      
      if (error) {
        console.error(`❌ Error importing vendor service ${service.id}:`, error.message)
      } else {
        console.log(`✅ Imported vendor service: ${service.title}`)
      }
    }

    // Import vendor service areas
    console.log('\n📊 Importing vendor service areas...')
    const vendorServiceAreasData = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'vendor_service_areas.json'), 'utf8')
    )
    
    for (const area of vendorServiceAreasData) {
      const { error } = await supabase
        .from('vendor_service_areas')
        .insert({
          id: area.id,
          vendor_id: area.vendorId,
          city: area.city,
          state: area.state,
          zip_code: area.zipCode,
          radius: area.radius || 25,
          created_at: area.createdAt || new Date().toISOString()
        })
      
      if (error) {
        console.error(`❌ Error importing service area ${area.id}:`, error.message)
      } else {
        console.log(`✅ Imported service area: ${area.city}, ${area.state}`)
      }
    }

    // Import vendor availability
    console.log('\n📊 Importing vendor availability...')
    const vendorAvailabilityData = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'vendor_availability.json'), 'utf8')
    )
    
    for (const availability of vendorAvailabilityData) {
      const { error } = await supabase
        .from('vendor_availability')
        .insert({
          id: availability.id,
          vendor_id: availability.vendorId,
          monday: Boolean(availability.monday),
          tuesday: Boolean(availability.tuesday),
          wednesday: Boolean(availability.wednesday),
          thursday: Boolean(availability.thursday),
          friday: Boolean(availability.friday),
          saturday: Boolean(availability.saturday),
          sunday: Boolean(availability.sunday),
          start_time: availability.startTime || null,
          end_time: availability.endTime || null,
          created_at: availability.createdAt || new Date().toISOString(),
          updated_at: availability.updatedAt || new Date().toISOString()
        })
      
      if (error) {
        console.error(`❌ Error importing availability ${availability.id}:`, error.message)
      } else {
        console.log(`✅ Imported availability for vendor ${availability.vendorId}`)
      }
    }

    // Import vendor users (create auth users and link them)
    console.log('\n📊 Importing vendor users...')
    const vendorUsersData = JSON.parse(
      fs.readFileSync(path.join(exportDir, 'vendor_users.json'), 'utf8')
    )
    
    for (const vendorUser of vendorUsersData) {
      try {
        // Create auth user
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: vendorUser.email,
          password: 'tempPassword123!', // They'll need to reset this
          email_confirm: true,
          user_metadata: {
            full_name: vendorUser.name,
            role: 'vendor'
          }
        })

        if (authError) {
          console.error(`❌ Error creating auth user for ${vendorUser.email}:`, authError.message)
          continue
        }

        // Link user to vendor - use the correct vendor ID
        const vendorId = vendorUser.vendorId || vendorUser.vendor_id
        if (!vendorId) {
          console.error(`❌ No vendor ID found for user ${vendorUser.email}`)
          continue
        }

        const { error: linkError } = await supabase
          .from('vendor_user_vendors')
          .insert({
            user_id: authUser.user.id,
            vendor_id: vendorId
          })

        if (linkError) {
          console.error(`❌ Error linking user ${authUser.user.id} to vendor ${vendorId}:`, linkError.message)
        } else {
          console.log(`✅ Imported vendor user: ${vendorUser.email} -> vendor ${vendorId}`)
        }
      } catch (error) {
        console.error(`❌ Error processing vendor user ${vendorUser.email}:`, error)
      }
    }

    console.log('\n🎉 Data import completed successfully!')
    console.log('\n📋 Import Summary:')
    console.log(`   Vendors: ${vendorsData.length}`)
    console.log(`   Vendor Profiles: ${vendorProfilesData.length}`)
    console.log(`   Vendor Services: ${vendorServicesData.length}`)
    console.log(`   Service Areas: ${vendorServiceAreasData.length}`)
    console.log(`   Availability: ${vendorAvailabilityData.length}`)
    console.log(`   Vendor Users: ${vendorUsersData.length}`)
    
    console.log('\n⚠️  Important Notes:')
    console.log('   - Vendor users were created with temporary passwords')
    console.log('   - They will need to reset their passwords on first login')
    console.log('   - Check the logs above for any import errors')
    
  } catch (error) {
    console.error('❌ Error during data import:', error)
    process.exit(1)
  }
}

importData()
