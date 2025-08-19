import { NextRequest, NextResponse } from 'next/server'
import { vendorCreateInputSchema } from '@/lib/schema'
import { createVendor } from '@/lib/repositories/vendorRepository'
import { requireAuthUser } from '@/lib/auth'
import { getDatabase } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuthUser()
    const body = await request.json()
    const parsed = vendorCreateInputSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', issues: parsed.error.flatten() }, { status: 400 })
    }

    // Create vendor record
    const vendor = createVendor(parsed.data)

    // Link user to vendor (one-to-one)
    const db = getDatabase()
    db.prepare('INSERT OR REPLACE INTO vendor_user_vendors (userId, vendorId) VALUES (?, ?)').run(auth.userId, vendor.id)

    return NextResponse.json({ vendorId: vendor.id }, { status: 201 })
  } catch (e) {
    if ((e as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Onboarding error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

