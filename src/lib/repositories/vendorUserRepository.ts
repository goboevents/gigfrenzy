import { getDatabase } from '@/lib/db'
import type { VendorUserCreateInput } from '@/lib/schema'
import bcrypt from 'bcryptjs'

export type VendorUserRecord = {
  id: number
  email: string
  passwordHash: string
  name: string
  role: 'vendor' | 'admin'
  createdAt: string
}

export async function createVendorUser(input: VendorUserCreateInput): Promise<VendorUserRecord> {
  const db = getDatabase()
  const createdAt = new Date().toISOString()
  const passwordHash = await bcrypt.hash(input.password, 10)

  const stmt = db.prepare(
    `INSERT INTO vendor_users (email, passwordHash, name, role, createdAt) VALUES (?, ?, ?, ?, ?)`
  )
  const result = stmt.run(input.email, passwordHash, input.name, input.role, createdAt)

  return {
    id: Number(result.lastInsertRowid),
    email: input.email,
    passwordHash,
    name: input.name,
    role: input.role,
    createdAt,
  }
}

export function findVendorUserByEmail(email: string): VendorUserRecord | null {
  const db = getDatabase()
  const row = db.prepare('SELECT * FROM vendor_users WHERE email = ?').get(email) as VendorUserRecord | undefined
  return row ?? null
}

export function linkVendorToUser(vendorId: number, userId: number): boolean {
  const db = getDatabase()
  try {
    const stmt = db.prepare(
      `INSERT INTO vendor_user_vendors (userId, vendorId) VALUES (?, ?)`
    )
    const result = stmt.run(userId, vendorId)
    return result.changes > 0
  } catch (error) {
    console.error('Error linking vendor to user:', error)
    return false
  }
}

export function getVendorUserById(id: number): VendorUserRecord | null {
  const db = getDatabase()
  const row = db.prepare('SELECT * FROM vendor_users WHERE id = ?').get(id) as VendorUserRecord | undefined
  return row ?? null
}

