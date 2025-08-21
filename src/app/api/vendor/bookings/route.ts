import { NextResponse } from 'next/server'
import { requireAuthUser, getVendorIdForUser } from '@/lib/supabase-auth'
// import { bookingRepository } from '@/lib/repositories/bookingRepository'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const auth = await requireAuthUser()
    const vendorId = getVendorIdForUser(auth.userId)
    if (!vendorId) return NextResponse.json({ bookings: [] })
    
    const bookings = bookingRepository.getCustomerBookings({ 
      vendorId,
      limit: 20,
      offset: 0
    })
    return NextResponse.json({ bookings })
  } catch (e) {
    if ((e as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

