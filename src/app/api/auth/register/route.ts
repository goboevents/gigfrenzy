import { NextRequest, NextResponse } from 'next/server'
import { vendorUserCreateSchema } from '@/lib/schema'
import { createVendorUser, findVendorUserByEmail } from '@/lib/repositories/vendorUserRepository'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = vendorUserCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', issues: parsed.error.flatten() }, { status: 400 })
    }

    const exists = findVendorUserByEmail(parsed.data.email)
    if (exists) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    const user = await createVendorUser(parsed.data)

    return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role }, { status: 201 })
  } catch (e) {
    console.error('Register error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

