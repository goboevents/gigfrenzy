import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

// Database row types
interface VendorRow {
  id: number
  businessName: string
  displayName: string
  headline: string
  bio: string
}

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

interface ServiceAreaRow {
  city: string
  state: string
  zipCode: string
  radius: number
}

export const runtime = 'nodejs'

interface RouteParams {
  params: Promise<{
    slug: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    // Get the vendor ID from the slug
    const db = getDatabase()
    const vendorStmt = db.prepare(`
      SELECT v.id, v.businessName, vp.displayName, vp.headline, vp.bio
      FROM vendors v
      JOIN vendor_profiles vp ON v.id = vp.vendorId
      WHERE vp.slug = ?
    `)
    
    const vendor = vendorStmt.get(slug) as VendorRow | undefined
    
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Get active services
    const servicesStmt = db.prepare(`
      SELECT 
        id, title, description, priceCents, type, duration, features,
        isPopular, pricingModel, hourlyRate, depositRequired, 
        depositPercentage, cancellationPolicy
      FROM vendor_services 
      WHERE vendorId = ? AND isActive = 1 AND type = 'service'
      ORDER BY isPopular DESC, priceCents ASC
    `)
    
    const services = servicesStmt.all(vendor.id) as ServiceRow[]

    // Get active packages
    const packagesStmt = db.prepare(`
      SELECT 
        id, title, description, priceCents, type, duration, features,
        isPopular, pricingModel, hourlyRate, depositRequired, 
        depositPercentage, cancellationPolicy
      FROM vendor_services 
      WHERE vendorId = ? AND isActive = 1 AND type = 'package'
      ORDER BY isPopular DESC, priceCents ASC
    `)
    
    const packages = packagesStmt.all(vendor.id) as ServiceRow[]

    // Get vendor availability
    const availabilityStmt = db.prepare(`
      SELECT * FROM vendor_availability WHERE vendorId = ?
    `)
    
    const availability = availabilityStmt.get(vendor.id) as AvailabilityRow | undefined

    // Get service areas
    const serviceAreasStmt = db.prepare(`
      SELECT city, state, zipCode, radius 
      FROM vendor_service_areas 
      WHERE vendorId = ?
    `)
    
    const serviceAreas = serviceAreasStmt.all(vendor.id) as ServiceAreaRow[]

    // Format the response
    const formattedServices = services.map(service => ({
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

    const formattedPackages = packages.map(pkg => ({
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
        displayName: vendor.displayName,
        headline: vendor.headline,
        bio: vendor.bio,
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
  } catch (error) {
    console.error('Error retrieving booking options:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}