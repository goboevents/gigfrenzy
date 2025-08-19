import { NextRequest, NextResponse } from 'next/server'
import { getVendorProfileBySlug } from '@/lib/repositories/vendorProfileRepository'

export const runtime = 'nodejs'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const profile = getVendorProfileBySlug(slug)
  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ profile })
}

