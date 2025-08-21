import { NextRequest, NextResponse } from 'next/server'
import { availabilityCheckSchema } from '@/lib/schemas/booking'
import { createClient } from '@supabase/supabase-js'

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

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // First, get the vendor ID from the slug
    const { data: vendor, error: vendorError } = await supabase
      .from('vendor_profiles')
      .select('vendor_id')
      .eq('slug', slug)
      .single()
    
    if (vendorError || !vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    const availabilityCheck = {
      vendorId: vendor.vendor_id,
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

    // For now, return a basic availability response
    // TODO: Implement proper availability checking with Supabase
    const availability = {
      isAvailable: true,
      message: 'Availability checking not yet implemented with Supabase'
    }

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