import { NextRequest, NextResponse } from 'next/server'
import { requireAuthUser, getVendorIdForUser } from '@/lib/supabase-auth'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthUser()
    const vendorId = getVendorIdForUser(auth.userId)
    if (!vendorId) {
      return NextResponse.json({ error: 'No vendor linked' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30'

    // This would need to be implemented in the analytics repository
    // For now, return mock data
    const analytics = {
      totalBookings: 24,
      totalRevenue: 480000,
      averageRating: 4.8,
      totalCustomers: 18,
      monthlyBookings: [
        { month: 'Jan', count: 2 },
        { month: 'Feb', count: 3 },
        { month: 'Mar', count: 4 },
        { month: 'Apr', count: 5 },
        { month: 'May', count: 6 },
        { month: 'Jun', count: 4 }
      ],
      monthlyRevenue: [
        { month: 'Jan', amount: 40000 },
        { month: 'Feb', amount: 60000 },
        { month: 'Mar', amount: 80000 },
        { month: 'Apr', amount: 100000 },
        { month: 'May', amount: 120000 },
        { month: 'Jun', amount: 80000 }
      ],
      topPackages: [
        { name: 'Premium Wedding Package', bookings: 8, revenue: 240000 },
        { name: 'Basic Event Package', bookings: 12, revenue: 180000 },
        { name: 'Corporate Event Package', bookings: 4, revenue: 60000 }
      ],
      recentActivity: [
        { type: 'booking', description: 'New booking for Premium Wedding Package', date: '2024-06-15' },
        { type: 'review', description: '5-star review received from Sarah M.', date: '2024-06-14' },
        { type: 'payment', description: 'Payment received for Corporate Event', date: '2024-06-13' },
        { type: 'booking', description: 'Booking confirmed for Basic Event Package', date: '2024-06-12' }
      ]
    }

    return NextResponse.json(analytics)
  } catch (e) {
    if ((e as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}