import { NextRequest, NextResponse } from 'next/server'
import { requireAuthUser, getVendorIdForUser } from '@/lib/supabase-auth'
import { listVendorServices, createVendorService, updateVendorService, deleteVendorService, parseFeatures } from '@/lib/repositories/vendorServiceRepository'
import { vendorServiceCreateSchema, vendorServiceUpdateSchema } from '@/lib/schema'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuthUser()
    const vendorId = await getVendorIdForUser(authUser.userId)
    
    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    const services = await listVendorServices(vendorId)
    const parsedServices = services.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      priceCents: service.priceCents,
      type: service.type,
      duration: service.duration,
      features: parseFeatures(service.features),
      isActive: Boolean(service.isActive),
      isPopular: Boolean(service.isPopular),
      pricingModel: service.pricingModel,
      hourlyRate: service.hourlyRate,
      depositRequired: Boolean(service.depositRequired),
      depositPercentage: service.depositPercentage,
      cancellationPolicy: service.cancellationPolicy
    }))

    return NextResponse.json(parsedServices)
  } catch (error) {
    console.error('Error getting vendor services:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to get vendor services' }, { status: 500 })
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
    const parsed = vendorServiceCreateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const record = await createVendorService(parsed.data, vendorId)
    
    return NextResponse.json({
      id: record.id,
      title: record.title,
      description: record.description,
      priceCents: record.priceCents,
      type: record.type,
      duration: record.duration,
      features: parseFeatures(record.features),
      isActive: Boolean(record.isActive),
      isPopular: Boolean(record.isPopular),
      pricingModel: record.pricingModel,
      hourlyRate: record.hourlyRate,
      depositRequired: Boolean(record.depositRequired),
      depositPercentage: record.depositPercentage,
      cancellationPolicy: record.cancellationPolicy
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating vendor service:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create vendor service' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authUser = await requireAuthUser()
    const vendorId = await getVendorIdForUser(authUser.userId)
    
    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    const body = await request.json()
    const parsed = vendorServiceUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const record = await updateVendorService(parsed.data.id, parsed.data)
    
    return NextResponse.json({
      id: record.id,
      title: record.title,
      description: record.description,
      priceCents: record.priceCents,
      type: record.type,
      duration: record.duration,
      features: parseFeatures(record.features),
      isActive: Boolean(record.isActive),
      isPopular: Boolean(record.isPopular),
      pricingModel: record.pricingModel,
      hourlyRate: record.hourlyRate,
      depositRequired: Boolean(record.depositRequired),
      depositPercentage: record.depositPercentage,
      cancellationPolicy: record.cancellationPolicy
    })
  } catch (error) {
    console.error('Error updating vendor service:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update vendor service' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authUser = await requireAuthUser()
    const vendorId = await getVendorIdForUser(authUser.userId)
    
    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 })
    }

    await deleteVendorService(Number(id))
    return NextResponse.json({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Error deleting vendor service:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to delete vendor service' }, { status: 500 })
  }
}

