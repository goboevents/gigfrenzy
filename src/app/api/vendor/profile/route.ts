import { NextRequest, NextResponse } from 'next/server'
import { vendorProfileUpsertSchema } from '@/lib/schema'
import { getVendorIdForUser, requireAuthUser } from '@/lib/auth'
import { getVendorProfileByVendorId, upsertVendorProfile } from '@/lib/repositories/vendorProfileRepository'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const auth = await requireAuthUser()
    const vendorId = getVendorIdForUser(auth.userId)
    if (!vendorId) return NextResponse.json({ error: 'No vendor linked' }, { status: 404 })
    const profile = getVendorProfileByVendorId(vendorId)
    return NextResponse.json({ profile })
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
    const parsed = vendorProfileUpsertSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', issues: parsed.error.flatten() }, { status: 400 })
    }

    const profile = upsertVendorProfile(vendorId, parsed.data)
    return NextResponse.json({ profile })
  } catch (e) {
    if ((e as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

