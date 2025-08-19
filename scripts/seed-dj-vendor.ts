#!/usr/bin/env tsx

import { getDatabase } from '../src/lib/db'
import { createVendor } from '../src/lib/repositories/vendorRepository'
import { createVendorUser, linkVendorToUser } from '../src/lib/repositories/vendorUserRepository'
import { upsertVendorProfile } from '../src/lib/repositories/vendorProfileRepository'
import { createVendorService } from '../src/lib/repositories/vendorServiceRepository'
import { createVendorServiceArea } from '../src/lib/repositories/vendorServiceAreaRepository'
import { createVendorAvailability } from '../src/lib/repositories/vendorAvailabilityRepository'

async function seedDJVendor() {
  console.log('🎧 Starting DJ vendor seeding...')
  
  const db = getDatabase()
  
  try {
    // Start transaction
    db.exec('BEGIN TRANSACTION')
    
    // 1. Create the vendor
    console.log('🏢 Creating vendor...')
    const vendor = createVendor({
      businessName: 'DJ MixMaster Pro',
      contactName: 'John Smith',
      email: 'dj@mixmasterpro.com',
      phone: '+1-555-0123',
      businessType: 'DJ Services',
      website: 'https://mixmasterpro.com',
      description: 'Professional DJ services for all events - weddings, corporate events, parties, and more. 10+ years of experience creating amazing atmospheres with the latest music and professional equipment.'
    })
    console.log(`✅ Vendor created with ID: ${vendor.id}`)
    
    // 2. Create vendor user account
    console.log('👤 Creating vendor user account...')
    const vendorUser = await createVendorUser({
      email: 'dj@mixmasterpro.com',
      password: 'password123',
      name: 'John Smith',
      role: 'vendor'
    })
    console.log(`✅ Vendor user created with ID: ${vendorUser.id}`)
    
    // 3. Link vendor to user
    console.log('🔗 Linking vendor to user...')
    const linked = linkVendorToUser(vendor.id, vendorUser.id)
    if (!linked) {
      throw new Error('Failed to link vendor to user')
    }
    console.log('✅ Vendor linked to user')
    
    // 4. Create vendor profile
    console.log('📋 Creating vendor profile...')
    const profile = upsertVendorProfile(vendor.id, {
      slug: 'dj-mixmaster-pro',
      displayName: 'DJ MixMaster Pro',
      headline: 'Professional DJ Services for Unforgettable Events',
      bio: 'With over 10 years of experience in the entertainment industry, DJ MixMaster Pro delivers exceptional music experiences for all types of events. From intimate weddings to large corporate functions, we ensure your event has the perfect soundtrack. We use professional-grade equipment and stay current with the latest music trends to keep your guests dancing all night long.',
      location: 'Los Angeles, CA',
      website: 'https://mixmasterpro.com',
      avatarUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face',
      coverImageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=400&fit=crop',
      visibility: 'public'
    })
    console.log(`✅ Vendor profile created with slug: ${profile.slug}`)
    
    // 5. Create services and packages
    console.log('🎵 Creating services and packages...')
    
    const basicPackage = createVendorService(vendor.id, {
      title: 'Basic DJ Package',
      description: 'Perfect for small events and parties. Includes professional sound system, 4 hours of DJ service, and basic lighting.',
      priceCents: 50000, // $500
      type: 'package',
      duration: '4 hours',
      features: [
        'Professional sound system',
        '4 hours of DJ service',
        'Basic lighting setup',
        'Music consultation',
        'Setup and teardown'
      ],
      isActive: true,
      isPopular: false,
      pricingModel: 'fixed',
      hourlyRate: 0,
      depositRequired: true,
      depositPercentage: 25,
      cancellationPolicy: 'Full refund if cancelled 7+ days before event. 50% refund if cancelled 3-6 days before event.'
    })
    console.log(`✅ Basic package created: ${basicPackage.title}`)
    
    const premiumPackage = createVendorService(vendor.id, {
      title: 'Premium DJ Package',
      description: 'Our most popular package for medium-sized events. Includes enhanced sound system, 6 hours of service, professional lighting, and MC services.',
      priceCents: 80000, // $800
      type: 'package',
      duration: '6 hours',
      features: [
        'Enhanced sound system',
        '6 hours of DJ service',
        'Professional lighting setup',
        'MC services',
        'Music consultation',
        'Setup and teardown',
        'Wireless microphone'
      ],
      isActive: true,
      isPopular: true,
      pricingModel: 'fixed',
      hourlyRate: 0,
      depositRequired: true,
      depositPercentage: 25,
      cancellationPolicy: 'Full refund if cancelled 7+ days before event. 50% refund if cancelled 3-6 days before event.'
    })
    console.log(`✅ Premium package created: ${premiumPackage.title}`)
    
    const weddingPackage = createVendorService(vendor.id, {
      title: 'Wedding DJ Package',
      description: 'Complete wedding entertainment solution. Includes ceremony music, cocktail hour, reception, and all-day coordination.',
      priceCents: 120000, // $1200
      type: 'package',
      duration: 'Full day',
      features: [
        'Ceremony music coordination',
        'Cocktail hour music',
        'Reception entertainment',
        'Professional sound system',
        'Professional lighting',
        'MC services',
        'Music consultation',
        'Setup and teardown',
        'Wireless microphones',
        'Day-of coordination'
      ],
      isActive: true,
      isPopular: false,
      pricingModel: 'fixed',
      hourlyRate: 0,
      depositRequired: true,
      depositPercentage: 30,
      cancellationPolicy: 'Full refund if cancelled 14+ days before event. 75% refund if cancelled 7-13 days before event.'
    })
    console.log(`✅ Wedding package created: ${weddingPackage.title}`)
    
    const hourlyService = createVendorService(vendor.id, {
      title: 'Hourly DJ Service',
      description: 'Flexible hourly rate for custom event needs. Perfect for events that don\'t fit standard packages.',
      priceCents: 15000, // $150
      type: 'service',
      duration: 'per hour',
      features: [
        'Professional sound system',
        'Professional lighting',
        'Music consultation',
        'Setup and teardown'
      ],
      isActive: true,
      isPopular: false,
      pricingModel: 'hourly',
      hourlyRate: 15000,
      depositRequired: true,
      depositPercentage: 25,
      cancellationPolicy: 'Full refund if cancelled 7+ days before event. 50% refund if cancelled 3-6 days before event.'
    })
    console.log(`✅ Hourly service created: ${hourlyService.title}`)
    
    // 6. Create service areas
    console.log('📍 Creating service areas...')
    
    const laArea = createVendorServiceArea(
      vendor.id,
      'Los Angeles',
      'CA',
      '90210',
      25
    )
    console.log(`✅ Service area created: ${laArea.city}, ${laArea.state}`)
    
    const ocArea = createVendorServiceArea(
      vendor.id,
      'Orange County',
      'CA',
      '92614',
      25
    )
    console.log(`✅ Service area created: ${ocArea.city}, ${ocArea.state}`)
    
    // 7. Create availability
    console.log('⏰ Setting up availability...')
    
    const availability = createVendorAvailability(vendor.id, {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
      startTime: '09:00',
      endTime: '02:00' // Note: Saturday/Sunday can go until 2 AM
    })
    console.log(`✅ Availability set up for vendor`)
    
    // Commit transaction
    db.exec('COMMIT')
    
    console.log('\n🎉 DJ vendor seeding completed successfully!')
    console.log('\n📋 Test Account Details:')
    console.log(`   Email: dj@mixmasterpro.com`)
    console.log(`   Password: password123`)
    console.log(`   Vendor ID: ${vendor.id}`)
    console.log(`   User ID: ${vendorUser.id}`)
    console.log(`   Profile Slug: ${profile.slug}`)
    console.log('\n🔗 Test URLs:')
    console.log(`   Vendor Dashboard: /vendor-dashboard`)
    console.log(`   Public Profile: /vendor/dj-mixmaster-pro`)
    console.log(`   Login: /signup (use the credentials above)`)
    
  } catch (error) {
    // Rollback transaction on error
    db.exec('ROLLBACK')
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

// Run the seeding function
seedDJVendor()
  .then(() => {
    console.log('✅ Seeding completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
