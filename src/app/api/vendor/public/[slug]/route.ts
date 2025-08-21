import { NextRequest, NextResponse } from 'next/server'
// import { getVendorProfileBySlug } from '@/lib/repositories/vendorProfileRepository'
// import { getVendorById } from '@/lib/repositories/vendorRepository'
// import { getActiveVendorServices, parseFeatures } from '@/lib/repositories/vendorServiceRepository'
// import { getVendorServiceAreas } from '@/lib/repositories/vendorServiceAreaRepository'
// import { getVendorAvailability } from '@/lib/repositories/vendorAvailabilityRepository'

export const runtime = 'nodejs'

interface RouteParams {
  params: Promise<{
    slug: string
  }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Temporarily disabled to test database initialization fix
    return NextResponse.json({ 
      message: 'Vendor profile temporarily disabled for testing',
      slug,
      mock: true
    })
  } catch (error) {
    console.error('Error getting vendor public data:', error)
    return NextResponse.json({ error: 'Failed to get vendor data' }, { status: 500 })
  }
}