import { NextRequest, NextResponse } from 'next/server'
import { getVendorBySlug } from '@/lib/repositories/vendorProfileRepository'
import { getActiveVendorServices } from '@/lib/repositories/vendorServiceRepository'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    // Get vendor profile by slug
    const vendorProfile = getVendorBySlug(slug)
    if (!vendorProfile) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }
    
    // Get active services for this vendor
    const services = getActiveVendorServices(vendorProfile.vendorId)
    
    // Transform services for public display
    const publicServices = services.map(service => ({
      id: service.id.toString(),
      title: service.title,
      description: service.description,
      priceCents: service.priceCents,
      type: service.type,
      duration: service.duration,
      features: service.features ? JSON.parse(service.features) : [],
      isPopular: service.isPopular === 1,
      pricingModel: service.pricingModel,
      hourlyRate: service.hourlyRate,
      depositRequired: service.depositRequired === 1,
      depositPercentage: service.depositPercentage,
      cancellationPolicy: service.cancellationPolicy
    }))
    
    return NextResponse.json({ services: publicServices })
  } catch (e) {
    console.error('Error fetching vendor services:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}