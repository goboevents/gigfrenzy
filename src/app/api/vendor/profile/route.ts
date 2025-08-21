import { NextRequest, NextResponse } from 'next/server'
import { requireAuthUser, getVendorIdForUser } from '@/lib/supabase-auth'
import { getVendorProfileByVendorId, createVendorProfile, updateVendorProfile } from '@/lib/repositories/vendorProfileRepository'
import { vendorProfileUpsertSchema } from '@/lib/schema'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuthUser()
    const vendorId = await getVendorIdForUser(authUser.userId)
    
    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    const profile = await getVendorProfileByVendorId(vendorId)
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error getting vendor profile:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to get vendor profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuthUser()
    const vendorId = await getVendorIdForUser(authUser.userId)
    
    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    const body = await request.json()
    const result = vendorProfileUpsertSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: result.error.flatten() },
        { status: 400 }
      )
    }

    // Check if profile already exists
    const existingProfile = await getVendorProfileByVendorId(vendorId)
    
    let profile
    if (existingProfile) {
      // Update existing profile
      profile = await updateVendorProfile(existingProfile.id, result.data)
    } else {
      // Create new profile
      profile = await createVendorProfile(result.data, vendorId)
    }

    return NextResponse.json(profile, { status: existingProfile ? 200 : 201 })
  } catch (error) {
    console.error('Error upserting vendor profile:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to upsert vendor profile' }, { status: 500 })
  }
}

