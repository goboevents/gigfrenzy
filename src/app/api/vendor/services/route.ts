import { NextRequest, NextResponse } from 'next/server'
import { requireAuthUser, getVendorIdForUser } from '@/lib/auth'
import { createVendorService, deleteVendorService, listVendorServices, updateVendorService, parseFeatures } from '@/lib/repositories/vendorServiceRepository'
import { vendorServiceCreateSchema, vendorServiceUpdateSchema } from '@/lib/schema'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const auth = await requireAuthUser()
    const vendorId = getVendorIdForUser(auth.userId)
    if (!vendorId) return NextResponse.json({ services: [] })
    
    const services = listVendorServices(vendorId)
    
    // Parse features from JSON string to array for each service
    const parsedServices = services.map(service => ({
      ...service,
      features: parseFeatures(service.features),
      isActive: Boolean(service.isActive),
      isPopular: Boolean(service.isPopular),
      depositRequired: Boolean(service.depositRequired)
    }))
    
    return NextResponse.json({ services: parsedServices })
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
    const parsed = vendorServiceCreateSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input', issues: parsed.error.flatten() }, { status: 400 })
    const record = createVendorService(vendorId, parsed.data)
    
    // Parse the returned record to match frontend expectations
    const parsedRecord = {
      ...record,
      features: parseFeatures(record.features),
      isActive: Boolean(record.isActive),
      isPopular: Boolean(record.isPopular),
      depositRequired: Boolean(record.depositRequired)
    }
    
    return NextResponse.json({ service: parsedRecord }, { status: 201 })
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
    const parsed = vendorServiceUpdateSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input', issues: parsed.error.flatten() }, { status: 400 })
    const record = updateVendorService(vendorId, parsed.data)
    if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    
    // Parse the returned record to match frontend expectations
    const parsedRecord = {
      ...record,
      features: parseFeatures(record.features),
      isActive: Boolean(record.isActive),
      isPopular: Boolean(record.isPopular),
      depositRequired: Boolean(record.depositRequired)
    }
    
    return NextResponse.json({ service: parsedRecord })
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
    const ok = deleteVendorService(vendorId, Number(id))
    return NextResponse.json({ ok })
  } catch (e) {
    if ((e as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

