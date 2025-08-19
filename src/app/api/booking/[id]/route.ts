import { NextRequest, NextResponse } from 'next/server'
import { customerBookingUpdateSchema } from '@/lib/schemas/booking'
import { bookingRepository } from '@/lib/repositories/bookingRepository'

export const runtime = 'nodejs'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const bookingId = parseInt(id)
    
    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      )
    }

    const booking = bookingRepository.getCustomerBookingById(bookingId)
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Booking retrieved successfully',
      booking,
    })
  } catch (error) {
    console.error('Error retrieving booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const bookingId = parseInt(id)
    
    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const result = customerBookingUpdateSchema.safeParse({
      ...body,
      id: bookingId,
    })

    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input', 
          issues: result.error.flatten() 
        },
        { status: 400 }
      )
    }

    const updatedBooking = await bookingRepository.updateCustomerBooking(result.data)
    
    if (!updatedBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Booking updated successfully',
      booking: updatedBooking,
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const bookingId = parseInt(id)
    
    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      )
    }

    const success = await bookingRepository.deleteCustomerBooking(bookingId)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Booking cancelled successfully',
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}