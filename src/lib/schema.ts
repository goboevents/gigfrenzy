import { z } from 'zod'

export const vendorCreateInputSchema = z.object({
  businessName: z.string().min(1, 'businessName is required'),
  contactName: z.string().min(1, 'contactName is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().nullable().transform(v => v ?? ''),
  businessType: z.string().min(1, 'businessType is required'),
  website: z.string().url('Invalid URL').optional().nullable().transform(v => v ?? ''),
  description: z.string().optional().nullable().transform(v => v ?? ''),
})

export type VendorCreateInput = z.infer<typeof vendorCreateInputSchema>

export type VendorRecord = {
  id: number
  businessName: string
  contactName: string
  email: string
  phone: string
  businessType: string
  website: string
  description: string
  createdAt: string
}

export const vendorUserCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(['vendor', 'admin']).default('vendor'),
})

export type VendorUserCreateInput = z.infer<typeof vendorUserCreateSchema>

export const vendorProfileUpsertSchema = z.object({
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  displayName: z.string().min(1),
  headline: z.string().optional().default(''),
  bio: z.string().optional().default(''),
  location: z.string().optional().default(''),
  website: z.string().url().optional().nullable().transform(v => v ?? ''),
  avatarUrl: z.string().url().optional().nullable().transform(v => v ?? ''),
  coverImageUrl: z.string().url().optional().nullable().transform(v => v ?? ''),
  visibility: z.enum(['public', 'private']).default('public'),
})

export type VendorProfileUpsertInput = z.infer<typeof vendorProfileUpsertSchema>

export const serviceCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(''),
  priceCents: z.number().int().min(0),
  isActive: z.boolean().default(true),
})
export const serviceUpdateSchema = serviceCreateSchema.extend({ id: z.number().int().positive() })
export type ServiceCreateInput = z.infer<typeof serviceCreateSchema>
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>

export const packageCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(''),
  priceCents: z.number().int().min(0),
  isActive: z.boolean().default(true),
})
export const packageUpdateSchema = packageCreateSchema.extend({ id: z.number().int().positive() })
export type PackageCreateInput = z.infer<typeof packageCreateSchema>
export type PackageUpdateInput = z.infer<typeof packageUpdateSchema>

