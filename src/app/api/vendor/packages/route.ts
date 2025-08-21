import { NextRequest, NextResponse } from 'next/server'
import { requireAuthUser, getVendorIdForUser } from '@/lib/supabase-auth'
// import { createPackage, deletePackage, listPackages, updatePackage } from '@/lib/repositories/packageRepository'
import { packageCreateSchema, packageUpdateSchema } from '@/lib/schema'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const auth = await requireAuthUser()
    const vendorId = getVendorIdForUser(auth.userId)
    if (!vendorId) return NextResponse.json({ packages: [] })
    // Temporarily disabled to test database initialization fix
    return NextResponse.json({ 
      message: 'Packages temporarily disabled for testing',
      packages: []
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
    const vendorId = getVendorIdForUser(auth.userId)
    if (!vendorId) return NextResponse.json({ error: 'No vendor linked' }, { status: 404 })
    const body = await request.json()
    const parsed = packageCreateSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input', issues: parsed.error.flatten() }, { status: 400 })
    // Temporarily disabled to test database initialization fix
    return NextResponse.json({ 
      message: 'Package creation temporarily disabled for testing',
      success: true
    }, { status: 201 })
  } catch (e) {
    if ((e as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuthUser()
    const vendorId = getVendorIdForUser(auth.userId)
    if (!vendorId) return NextResponse.json({ error: 'No vendor linked' }, { status: 404 })
    const body = await request.json()
    const parsed = packageUpdateSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input', issues: parsed.error.flatten() }, { status: 400 })
    // Temporarily disabled to test database initialization fix
    return NextResponse.json({ 
      message: 'Package update temporarily disabled for testing',
      success: true
    })
  } catch (e) {
    if ((e as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAuthUser()
    const vendorId = getVendorIdForUser(auth.userId)
    if (!vendorId) return NextResponse.json({ error: 'No vendor linked' }, { status: 404 })
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    // Temporarily disabled to test database initialization fix
    return NextResponse.json({ 
      message: 'Package deletion temporarily disabled for testing',
      success: true
    })
  } catch (e) {
    if ((e as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

