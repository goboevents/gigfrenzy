import { NextRequest, NextResponse } from 'next/server'
import { requireAuthUser, getVendorIdForUser } from '@/lib/supabase-auth'
// import { saveOnboardingStep, getAllOnboardingData, getOnboardingStep } from '@/lib/repositories/vendorOnboardingRepository'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthUser()
    const vendorId = await getVendorIdForUser(auth.userId)
    if (!vendorId) return NextResponse.json({ error: 'No vendor linked' }, { status: 404 })
    
    const { searchParams } = new URL(request.url)
    const step = searchParams.get('step')
    
    // Temporarily disabled to test database initialization fix
    return NextResponse.json({ 
      message: 'Onboarding temporarily disabled for testing',
      stepData: step ? { step, mock: true } : null,
      onboardingData: { mock: true }
    })
  } catch (e) {
    if ((e as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuthUser()
    const vendorId = await getVendorIdForUser(auth.userId)
    if (!vendorId) return NextResponse.json({ error: 'No vendor linked' }, { status: 404 })
    
    const body = await request.json()
    const { step, data } = body
    
    if (!step || !data) {
      return NextResponse.json({ error: 'Step and data are required' }, { status: 400 })
    }
    
    // Temporarily disabled to test database initialization fix
    return NextResponse.json({ 
      success: true, 
      message: 'Onboarding temporarily disabled for testing',
      record: { step, data, mock: true }
    })
  } catch (e) {
    if ((e as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

