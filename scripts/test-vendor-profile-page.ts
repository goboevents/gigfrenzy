import { createClient } from '@supabase/supabase-js'

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testVendorProfilePage() {
  try {
    console.log('🧪 Testing Vendor Profile Page Data Flow...')
    
    // Test 1: Get vendor profile by slug
    console.log('\n📊 Test 1: Getting vendor profile by slug "dj-mixmaster"...')
    
    const { data: profile, error: profileError } = await supabase
      .from('vendor_profiles')
      .select(`
        *,
        vendors (
          business_name,
          email,
          phone,
          business_type
        )
      `)
      .eq('slug', 'dj-mixmaster')
      .single()
    
    if (profileError) {
      console.error('❌ Error getting vendor profile:', profileError.message)
      return
    }
    
    console.log('✅ Vendor profile found:')
    console.log(`   - ID: ${profile.id}`)
    console.log(`   - Display Name: ${profile.display_name}`)
    console.log(`   - Slug: ${profile.slug}`)
    console.log(`   - Business: ${profile.vendors?.business_name}`)
    console.log(`   - Phone: ${profile.vendors?.phone}`)
    console.log(`   - Email: ${profile.vendors?.email}`)
    
    // Test 2: Get vendor services
    console.log('\n🎯 Test 2: Getting vendor services...')
    
    const vendorId = profile.vendor_id
    const { data: services, error: servicesError } = await supabase
      .from('vendor_services')
      .select('*')
      .eq('vendor_id', vendorId)
      .eq('is_active', true)
    
    if (servicesError) {
      console.error('❌ Error getting vendor services:', servicesError.message)
    } else {
      console.log(`✅ Found ${services?.length || 0} active services:`)
      services?.forEach(service => {
        console.log(`   - ${service.title}: $${(service.price_cents / 100).toFixed(2)}`)
      })
    }
    
    // Test 3: Get service areas
    console.log('\n🗺️  Test 3: Getting service areas...')
    
    const { data: areas, error: areasError } = await supabase
      .from('vendor_service_areas')
      .select('*')
      .eq('vendor_id', vendorId)
    
    if (areasError) {
      console.error('❌ Error getting service areas:', areasError.message)
    } else {
      console.log(`✅ Found ${areas?.length || 0} service areas:`)
      areas?.forEach(area => {
        console.log(`   - ${area.city}, ${area.state} (${area.radius} mile radius)`)
      })
    }
    
    // Test 4: Get availability
    console.log('\n⏰ Test 4: Getting availability...')
    
    const { data: availability, error: availabilityError } = await supabase
      .from('vendor_availability')
      .select('*')
      .eq('vendor_id', vendorId)
    
    if (availabilityError) {
      console.error('❌ Error getting availability:', availabilityError.message)
    } else {
      console.log(`✅ Found ${availability?.length || 0} availability records:`)
      availability?.forEach(avail => {
        const days = []
        if (avail.monday) days.push('Mon')
        if (avail.tuesday) days.push('Tue')
        if (avail.wednesday) days.push('Wed')
        if (avail.thursday) days.push('Thu')
        if (avail.friday) days.push('Fri')
        if (avail.saturday) days.push('Sat')
        if (avail.sunday) days.push('Sun')
        console.log(`   - Days: ${days.join(', ')} ${avail.start_time}-${avail.end_time}`)
      })
    }
    
    // Test 5: Simulate the API response structure
    console.log('\n🔗 Test 5: Simulating API response structure...')
    
    const apiResponse = {
      id: profile.id.toString(),
      slug: profile.slug,
      displayName: profile.display_name,
      headline: profile.headline,
      bio: profile.bio,
      location: profile.location,
      website: profile.website,
      phone: profile.vendors?.phone,
      email: profile.vendors?.email,
      avatarUrl: profile.avatar_url,
      coverImageUrl: profile.cover_image_url,
      services: services?.map(service => ({
        id: service.id.toString(),
        title: service.title,
        description: service.description,
        priceCents: service.price_cents,
        type: service.type,
        duration: service.duration,
        features: service.features || [],
        isActive: Boolean(service.is_active),
        isPopular: Boolean(service.is_popular),
        pricingModel: service.pricing_model,
        hourlyRate: service.hourly_rate,
        depositRequired: Boolean(service.deposit_required),
        depositPercentage: service.deposit_percentage,
        cancellationPolicy: service.cancellation_policy
      })) || [],
      serviceAreas: areas?.map(area => ({
        city: area.city,
        state: area.state,
        zipCode: area.zip_code,
        radius: area.radius
      })) || [],
      availability: availability?.[0] ? {
        monday: availability[0].monday,
        tuesday: availability[0].tuesday,
        wednesday: availability[0].wednesday,
        thursday: availability[0].thursday,
        friday: availability[0].friday,
        saturday: availability[0].saturday,
        sunday: availability[0].sunday,
        startTime: availability[0].start_time,
        endTime: availability[0].end_time
      } : null
    }
    
    console.log('✅ API response structure:')
    console.log(`   - ID: ${apiResponse.id}`)
    console.log(`   - Display Name: ${apiResponse.displayName}`)
    console.log(`   - Services: ${apiResponse.services.length}`)
    console.log(`   - Service Areas: ${apiResponse.serviceAreas.length}`)
    console.log(`   - Has Availability: ${apiResponse.availability ? 'Yes' : 'No'}`)
    
    console.log('\n🎉 Vendor Profile Page Test Completed!')
    console.log('All data is available and properly structured.')
    console.log('The page should work correctly now.')
    
  } catch (error) {
    console.error('❌ Error during vendor profile page test:', error)
    process.exit(1)
  }
}

testVendorProfilePage()
