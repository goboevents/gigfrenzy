import { NextRequest, NextResponse } from 'next/server'
import { bookingMessageSchema } from '@/lib/schemas/booking'
import { bookingRepository } from '@/lib/repositories/bookingRepository'

export const runtime = 'nodejs'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
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
    const result = bookingMessageSchema.safeParse({
      ...body,
      bookingId,
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

    // Verify the booking exists
    const booking = bookingRepository.getCustomerBookingById(bookingId)
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    const message = await bookingRepository.createBookingMessage(result.data)

    return NextResponse.json(
      {
        message: 'Message sent successfully',
        messageData: message,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating booking message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
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

    // Verify the booking exists
    const booking = bookingRepository.getCustomerBookingById(bookingId)
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    const messages = bookingRepository.getBookingMessages(bookingId)

    return NextResponse.json({
      message: 'Messages retrieved successfully',
      messages,
      bookingId,
    })
  } catch (error) {
    console.error('Error retrieving booking messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}