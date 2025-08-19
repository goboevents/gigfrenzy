import { NextRequest, NextResponse } from 'next/server'
import { vendorCreateInputSchema } from '@/lib/schema'
import { createVendor } from '@/lib/repositories/vendorRepository'

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

export async function GET() {
  return NextResponse.json({
    message: 'Vendor signup endpoint',
    method: 'POST',
    requiredFields: ['businessName', 'contactName', 'email', 'businessType']
  })
}
