import { NextRequest, NextResponse } from 'next/server'
import { listVendors, createVendor } from '@/lib/repositories/vendorRepository'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const vendors = await listVendors(limit, offset)
    return NextResponse.json(vendors)
  } catch (error) {
    console.error('Error listing vendors:', error)
    return NextResponse.json({ error: 'Failed to list vendors' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const vendor = await createVendor(body)
    return NextResponse.json(vendor, { status: 201 })
  } catch (error) {
    console.error('Error creating vendor:', error)
    return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 })
  }
}
