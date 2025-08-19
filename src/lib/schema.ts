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

