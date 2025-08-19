import { NextRequest, NextResponse } from 'next/server'
import { availabilityCheckSchema } from '@/lib/schemas/booking'
import { bookingRepository } from '@/lib/repositories/bookingRepository'
import { getDatabase } from '@/lib/db'

export const runtime = 'nodejs'

interface RouteParams {
  params: Promise<{
    slug: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const serviceId = searchParams.get('serviceId')
    const packageId = searchParams.get('packageId')

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    // First, get the vendor ID from the slug
    const db = getDatabase()
    const vendorStmt = db.prepare(`
      SELECT v.id FROM vendors v
      JOIN vendor_profiles vp ON v.id = vp.vendorId
      WHERE vp.slug = ?
    `)
    
    const vendor = vendorStmt.get(slug) as { id: number } | undefined
    
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    const availabilityCheck = {
      vendorId: vendor.id,
      date,
      serviceId: serviceId ? parseInt(serviceId) : undefined,
      packageId: packageId ? parseInt(packageId) : undefined,
    }

    // Validate the input
    const result = availabilityCheckSchema.safeParse(availabilityCheck)
    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input', 
          issues: result.error.flatten() 
        },
        { status: 400 }
      )
    }

    const availability = bookingRepository.checkVendorAvailability(result.data)

    return NextResponse.json({
      message: 'Availability checked successfully',
      availability,
    })
  } catch (error) {
    console.error('Error checking vendor availability:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}