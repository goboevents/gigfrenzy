import { NextRequest, NextResponse } from 'next/server'
import { getVendorProfileBySlug } from '@/lib/repositories/vendorProfileRepository'
import { getActiveVendorServices, parseFeatures } from '@/lib/repositories/vendorServiceRepository'

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

    return NextResponse.json(parsedServices)
  } catch (error) {
    console.error('Error getting vendor public services:', error)
    return NextResponse.json({ error: 'Failed to get vendor services' }, { status: 500 })
  }
}