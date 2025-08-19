import { NextRequest, NextResponse } from 'next/server'
import { vendorCreateInputSchema } from '@/lib/schema'
import { createVendor, listVendors } from '@/lib/repositories/vendorRepository'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = vendorCreateInputSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: result.error.flatten() },
        { status: 400 }
      )
    }

    const vendor = createVendor(result.data)

    return NextResponse.json(
      {
        message: 'Vendor application submitted successfully',
        vendor,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing vendor signup:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit') ?? '20')
  const offset = Number(searchParams.get('offset') ?? '0')
  const safeLimit = Number.isFinite(limit) && limit > 0 && limit <= 100 ? limit : 20
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0

  const vendors = listVendors(safeLimit, safeOffset)
  return NextResponse.json({ vendors, limit: safeLimit, offset: safeOffset })
}
