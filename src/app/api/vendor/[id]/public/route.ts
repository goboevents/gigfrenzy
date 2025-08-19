import { NextRequest, NextResponse } from 'next/server'
import { getVendorById } from '@/lib/repositories/vendorRepository'
import { getVendorProfileByVendorId } from '@/lib/repositories/vendorProfileRepository'
import { getActiveVendorServices } from '@/lib/repositories/vendorServiceRepository'
import { getVendorServiceAreas } from '@/lib/repositories/vendorServiceAreaRepository'
import { parseFeatures } from '@/lib/repositories/vendorServiceRepository'

export const runtime = 'nodejs'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const vendorId = parseInt(id)
    
    if (isNaN(vendorId)) {
      return NextResponse.json(
        { error: 'Invalid vendor ID' },
        { status: 400 }
      )
    }

    // Get vendor details
    const vendor = getVendorById(vendorId)
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Get vendor profile
    const vendorProfile = getVendorProfileByVendorId(vendorId)
    if (!vendorProfile) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      )
    }

    // Get active services
    const services = getActiveVendorServices(vendorId)
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
    const serviceAreas = getVendorServiceAreas(vendorId)

    // Build the vendor data object
    const vendorData = {
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
    console.error('Error fetching vendor data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
