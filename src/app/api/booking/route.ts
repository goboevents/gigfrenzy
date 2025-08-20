import { NextRequest, NextResponse } from 'next/server'
import { customerBookingCreateSchema } from '@/lib/schemas/booking'
import { bookingRepository } from '@/lib/repositories/bookingRepository'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received booking request body:', body)
    
    const result = customerBookingCreateSchema.safeParse(body)

    if (!result.success) {
      console.log('Validation failed:', result.error.flatten())
      return NextResponse.json(
        { 
          error: 'Invalid input', 
          issues: result.error.flatten() 
        },
        { status: 400 }
      )
    }

    console.log('Validated booking data:', result.data)
    const booking = await bookingRepository.createCustomerBooking(result.data)

    return NextResponse.json(
      {
        message: 'Booking created successfully',
        booking,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const vendorId = searchParams.get('vendorId')
    const customerEmail = searchParams.get('customerEmail')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const query = {
      vendorId: vendorId ? parseInt(vendorId) : undefined,
      customerEmail: customerEmail || undefined,
      status: status as 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled' | undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      limit,
      offset,
    }

    const bookings = bookingRepository.getCustomerBookings(query)

    return NextResponse.json({
      message: 'Bookings retrieved successfully',
      bookings,
      pagination: {
        limit,
        offset,
        total: bookings.length, // Note: This is just the current page count
      }
    })
  } catch (error) {
    console.error('Error retrieving bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}