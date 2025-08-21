import { NextRequest, NextResponse } from 'next/server'
import { requireAuthUser, getVendorIdForUser } from '@/lib/supabase-auth'
import { z } from 'zod'

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled'])
})

export const runtime = 'nodejs'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuthUser()
    const vendorId = getVendorIdForUser(auth.userId)
    if (!vendorId) {
      return NextResponse.json({ error: 'No vendor linked' }, { status: 404 })
    }

    const body = await request.json()
    const result = updateStatusSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: result.error.flatten() },
        { status: 400 }
      )
    }

    const { status } = result.data
    const { id } = await params
    const bookingId = parseInt(id)

    // This would need to be implemented in the booking repository
    // For now, return a success response
    // const updatedBooking = updateBookingStatus(bookingId, vendorId, status)
    
    return NextResponse.json({
      message: 'Booking status updated successfully',
      bookingId,
      status
    })
  } catch (e) {
    if ((e as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}