import { NextRequest, NextResponse } from 'next/server'
import { getVendorProfileBySlug } from '@/lib/repositories/vendorProfileRepository'
import { getVendorById } from '@/lib/repositories/vendorRepository'
import { getActiveVendorServices, parseFeatures } from '@/lib/repositories/vendorServiceRepository'
import { getVendorServiceAreas } from '@/lib/repositories/vendorServiceAreaRepository'
import { getVendorAvailability } from '@/lib/repositories/vendorAvailabilityRepository'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const vendorProfile = await getVendorProfileBySlug(slug)
    
    if (!vendorProfile) {
      return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 })
    }

    const vendor = await getVendorById(vendorProfile.vendorId)
    
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    const services = await getActiveVendorServices(vendorProfile.vendorId)
    const parsedServices = services.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      priceCents: service.priceCents,
      type: service.type,
      duration: service.duration,
      features: parseFeatures(service.features),
      isActive: Boolean(service.isActive),
      isPopular: Boolean(service.isPopular),
      pricingModel: service.pricingModel,
      hourlyRate: service.hourlyRate,
      depositRequired: Boolean(service.depositRequired),
      depositPercentage: service.depositPercentage,
      cancellationPolicy: service.cancellationPolicy
    }))

    const serviceAreas = await getVendorServiceAreas(vendorProfile.vendorId)
    const availability = await getVendorAvailability(vendorProfile.vendorId)

    // Transform data for public display
    const publicData = {
      id: vendor.id.toString(),
      slug: vendorProfile.slug,
      displayName: vendorProfile.displayName,
      headline: vendorProfile.headline,
      bio: vendorProfile.bio,
      location: vendorProfile.location,
      website: vendorProfile.website,
      phone: vendor.phone,
      email: vendor.email,
      avatarUrl: vendorProfile.avatarUrl,
      coverImageUrl: vendorProfile.coverImageUrl,
      services: parsedServices,
      serviceAreas: serviceAreas.map(area => ({
        city: area.city,
        state: area.state,
        zipCode: area.zipCode,
        radius: area.radius
      })),
      availability: availability ? {
        monday: availability.monday,
        tuesday: availability.tuesday,
        wednesday: availability.wednesday,
        thursday: availability.thursday,
        friday: availability.friday,
        saturday: availability.saturday,
        sunday: availability.sunday,
        startTime: availability.startTime,
        endTime: availability.endTime
      } : null
    }

    return NextResponse.json(publicData)
  } catch (error) {
    console.error('Error getting vendor public data:', error)
    return NextResponse.json({ error: 'Failed to get vendor data' }, { status: 500 })
  }
}