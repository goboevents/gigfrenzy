import { NextRequest, NextResponse } from 'next/server'
import { getVendorProfileBySlug } from '@/lib/repositories/vendorProfileRepository'
import { getVendorById } from '@/lib/repositories/vendorRepository'
import { getActiveVendorServices } from '@/lib/repositories/vendorServiceRepository'
import { getVendorServiceAreas } from '@/lib/repositories/vendorServiceAreaRepository'
import { parseFeatures } from '@/lib/repositories/vendorServiceRepository'
import { getDatabase } from '@/lib/db'

// Database row types
interface ServiceRow {
  id: number
  title: string
  description: string
  priceCents: number
  type: string
  duration: string
  features: string
  isPopular: number
  pricingModel: string
  hourlyRate: number
  depositRequired: number
  depositPercentage: number
  cancellationPolicy: string
}

interface AvailabilityRow {
  id: number
  vendorId: number
  monday: number
  tuesday: number
  wednesday: number
  thursday: number
  friday: number
  saturday: number
  sunday: number
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const { searchParams } = new URL(request.url)
    const isBookingOptions = searchParams.get('type') === 'booking-options'
    
    // Get vendor profile by slug
    const vendorProfile = getVendorProfileBySlug(slug)
    if (!vendorProfile) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Get vendor details
    const vendor = getVendorById(vendorProfile.vendorId)
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Get active services
    const services = getActiveVendorServices(vendorProfile.vendorId)
    const parsedServices = services.map(service => ({
      id: service.id.toString(),
      title: service.title,
      description: service.description,
      priceCents: service.priceCents,
      type: service.type,
      duration: service.duration,
      features: parseFeatures(service.features),
      isPopular: Boolean(service.isPopular),
      pricingModel: service.pricingModel,
      hourlyRate: service.hourlyRate,
      depositRequired: Boolean(service.depositRequired),
      depositPercentage: service.depositPercentage,
      cancellationPolicy: service.cancellationPolicy
    }))

    // Get service areas
    const serviceAreas = getVendorServiceAreas(vendorProfile.vendorId)

    // If this is a booking-options request, return the data in the expected format
    if (isBookingOptions) {
      // Get active services and packages separately for booking flow
      const db = getDatabase()
      
      const servicesStmt = db.prepare(`
        SELECT 
          id, title, description, priceCents, type, duration, features,
          isPopular, pricingModel, hourlyRate, depositRequired, 
          depositPercentage, cancellationPolicy
        FROM vendor_services 
        WHERE vendorId = ? AND isActive = 1 AND type = 'service'
        ORDER BY isPopular DESC, priceCents ASC
      `)
      
      const servicesData = servicesStmt.all(vendorProfile.vendorId) as ServiceRow[]

      const packagesStmt = db.prepare(`
        SELECT 
          id, title, description, priceCents, type, duration, features,
          isPopular, pricingModel, hourlyRate, depositRequired, 
          depositPercentage, cancellationPolicy
        FROM vendor_services 
        WHERE vendorId = ? AND isActive = 1 AND type = 'package'
        ORDER BY isPopular DESC, priceCents ASC
      `)
      
      const packagesData = packagesStmt.all(vendorProfile.vendorId) as ServiceRow[]

      // Get vendor availability
      const availabilityStmt = db.prepare(`
        SELECT * FROM vendor_availability WHERE vendorId = ?
      `)
      
      const availability = availabilityStmt.get(vendorProfile.vendorId) as AvailabilityRow | undefined

      const formattedServices = servicesData.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description,
        priceCents: service.priceCents,
        type: service.type,
        duration: service.duration,
        features: service.features ? JSON.parse(service.features) : [],
        isPopular: Boolean(service.isPopular),
        pricingModel: service.pricingModel,
        hourlyRate: service.hourlyRate,
        depositRequired: Boolean(service.depositRequired),
        depositPercentage: service.depositPercentage,
        cancellationPolicy: service.cancellationPolicy,
        formattedPrice: `$${(service.priceCents / 100).toFixed(2)}`,
      }))

      const formattedPackages = packagesData.map(pkg => ({
        id: pkg.id,
        title: pkg.title,
        description: pkg.description,
        priceCents: pkg.priceCents,
        type: pkg.type,
        duration: pkg.duration,
        features: pkg.features ? JSON.parse(pkg.features) : [],
        isPopular: Boolean(pkg.isPopular),
        pricingModel: pkg.pricingModel,
        hourlyRate: pkg.hourlyRate,
        depositRequired: Boolean(pkg.depositRequired),
        depositPercentage: pkg.depositPercentage,
        cancellationPolicy: pkg.cancellationPolicy,
        formattedPrice: `$${(pkg.priceCents / 100).toFixed(2)}`,
      }))

      const formattedAvailability = availability ? {
        monday: Boolean(availability.monday),
        tuesday: Boolean(availability.tuesday),
        wednesday: Boolean(availability.wednesday),
        thursday: Boolean(availability.thursday),
        friday: Boolean(availability.friday),
        saturday: Boolean(availability.saturday),
        sunday: Boolean(availability.sunday),
        startTime: availability.startTime,
        endTime: availability.endTime,
      } : null

      const formattedServiceAreas = serviceAreas.map(area => ({
        city: area.city,
        state: area.state,
        zipCode: area.zipCode,
        radius: area.radius,
        displayName: `${area.city}, ${area.state} ${area.zipCode}`,
      }))

      return NextResponse.json({
        message: 'Booking options retrieved successfully',
        vendor: {
          id: vendor.id,
          businessName: vendor.businessName,
          displayName: vendorProfile.displayName,
          headline: vendorProfile.headline,
          bio: vendorProfile.bio,
          slug: slug,
        },
        services: formattedServices,
        packages: formattedPackages,
        availability: formattedAvailability,
        serviceAreas: formattedServiceAreas,
        bookingInfo: {
          depositRequired: formattedPackages.some(p => p.depositRequired) || formattedServices.some(s => s.depositRequired),
          cancellationPolicy: formattedPackages[0]?.cancellationPolicy || formattedServices[0]?.cancellationPolicy || 'Contact vendor for cancellation policy',
          minAdvanceNotice: '24 hours',
          maxAdvanceBooking: '12 months',
        }
      })
    }

    // Build the vendor data object for regular profile requests
    const vendorData = {
      id: vendor.id.toString(),
      slug: vendorProfile.slug,
      displayName: vendorProfile.displayName,
      headline: vendorProfile.headline,
      bio: vendorProfile.bio,
      location: vendorProfile.location,
      website: vendorProfile.website,
      phone: vendor.phone,
      avatarUrl: vendorProfile.avatarUrl,
      coverImageUrl: vendorProfile.coverImageUrl,
      rating: 4.8, // TODO: Implement real rating system
      reviewCount: 0, // TODO: Implement real review system
      services: parsedServices,
      serviceAreas: serviceAreas.map(area => ({
        id: area.id.toString(),
        city: area.city,
        state: area.state,
        zipCode: area.zipCode,
        radius: area.radius
      })),
      offers: [], // TODO: Implement offers system
      reviews: [] // TODO: Implement review system
    }

    return NextResponse.json({ vendor: vendorData })
  } catch (error) {
    console.error('Error fetching vendor profile:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}