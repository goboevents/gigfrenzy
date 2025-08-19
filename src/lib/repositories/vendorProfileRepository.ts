import { getDatabase } from '@/lib/db'
import type { VendorProfileUpsertInput } from '@/lib/schema'

export type VendorProfileRecord = {
  id: number
  vendorId: number
  slug: string
  displayName: string
  headline: string
  bio: string
  location: string
  website: string
  avatarUrl: string
  coverImageUrl: string
  visibility: 'public' | 'private'
  createdAt: string
  updatedAt: string
}

export function upsertVendorProfile(vendorId: number, input: VendorProfileUpsertInput): VendorProfileRecord {
  const db = getDatabase()
  const now = new Date().toISOString()
  // Try update first
  const existing = db.prepare('SELECT * FROM vendor_profiles WHERE vendorId = ?').get(vendorId) as VendorProfileRecord | undefined
  if (existing) {
    db.prepare(`UPDATE vendor_profiles SET slug = ?, displayName = ?, headline = ?, bio = ?, location = ?, website = ?, avatarUrl = ?, coverImageUrl = ?, visibility = ?, updatedAt = ? WHERE vendorId = ?`).run(
      input.slug, input.displayName, input.headline ?? '', input.bio ?? '', input.location ?? '', input.website ?? '', input.avatarUrl ?? '', input.coverImageUrl ?? '', input.visibility ?? 'public', now, vendorId
    )
    const updated = db.prepare('SELECT * FROM vendor_profiles WHERE vendorId = ?').get(vendorId) as VendorProfileRecord
    return updated
  }
  const info = db.prepare(`INSERT INTO vendor_profiles (vendorId, slug, displayName, headline, bio, location, website, avatarUrl, coverImageUrl, visibility, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    vendorId, input.slug, input.displayName, input.headline ?? '', input.bio ?? '', input.location ?? '', input.website ?? '', input.avatarUrl ?? '', input.coverImageUrl ?? '', input.visibility ?? 'public', now, now
  )
  const record = db.prepare('SELECT * FROM vendor_profiles WHERE id = ?').get(Number(info.lastInsertRowid)) as VendorProfileRecord
  return record
}

export function getVendorProfileByVendorId(vendorId: number): VendorProfileRecord | null {
  const db = getDatabase()
  const row = db.prepare('SELECT * FROM vendor_profiles WHERE vendorId = ?').get(vendorId) as VendorProfileRecord | undefined
  return row ?? null
}

export function getVendorProfileBySlug(slug: string): VendorProfileRecord | null {
  const db = getDatabase()
  const row = db.prepare('SELECT * FROM vendor_profiles WHERE slug = ? AND visibility = "public"').get(slug) as VendorProfileRecord | undefined
  return row ?? null
}

