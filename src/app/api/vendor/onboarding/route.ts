import { NextRequest, NextResponse } from 'next/server'
import { requireAuthUser, getVendorIdForUser } from '@/lib/auth'
import { saveOnboardingStep, getAllOnboardingData, getOnboardingStep } from '@/lib/repositories/vendorOnboardingRepository'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthUser()
    const vendorId = getVendorIdForUser(auth.userId)
    if (!vendorId) return NextResponse.json({ error: 'No vendor linked' }, { status: 404 })
    
    const { searchParams } = new URL(request.url)
    const step = searchParams.get('step')
    
    if (step) {
      const stepData = getOnboardingStep(vendorId, step)
      return NextResponse.json({ stepData })
    } else {
      const onboardingData = getAllOnboardingData(vendorId)
      return NextResponse.json({ onboardingData })
    }
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
    const vendorId = getVendorIdForUser(auth.userId)
    if (!vendorId) return NextResponse.json({ error: 'No vendor linked' }, { status: 404 })
    
    const body = await request.json()
    const { step, data } = body
    
    if (!step || !data) {
      return NextResponse.json({ error: 'Step and data are required' }, { status: 400 })
    }
    
    const record = saveOnboardingStep(vendorId, step, data)
    return NextResponse.json({ success: true, record })
  } catch (e) {
    if ((e as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

