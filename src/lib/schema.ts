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

// Unified service/package schema for consistent data across components
export const vendorServiceCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(''),
  priceCents: z.number().int().min(0),
  isActive: z.boolean().default(true),
  type: z.enum(['service', 'package']).default('service'),
  duration: z.string().optional().default('per event'),
  features: z.array(z.string()).optional().default([]),
  isPopular: z.boolean().optional().default(false),
  pricingModel: z.enum(['fixed', 'hourly', 'package']).optional().default('fixed'),
  hourlyRate: z.number().optional().default(0),
  depositRequired: z.boolean().optional().default(false),
  depositPercentage: z.number().optional().default(25),
  cancellationPolicy: z.string().optional().default(''),
})

export const vendorServiceUpdateSchema = vendorServiceCreateSchema.extend({ 
  id: z.number().int().positive() 
})

export type VendorServiceCreateInput = z.infer<typeof vendorServiceCreateSchema>
export type VendorServiceUpdateInput = z.infer<typeof vendorServiceUpdateSchema>

// Legacy schemas for backward compatibility
export const serviceCreateSchema = vendorServiceCreateSchema.pick({
  title: true,
  description: true,
  priceCents: true,
  isActive: true
})
export const serviceUpdateSchema = serviceCreateSchema.extend({ id: z.number().int().positive() })
export type ServiceCreateInput = z.infer<typeof serviceCreateSchema>
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>

export const packageCreateSchema = vendorServiceCreateSchema.pick({
  title: true,
  description: true,
  priceCents: true,
  isActive: true
})
export const packageUpdateSchema = packageCreateSchema.extend({ id: z.number().int().positive() })
export type PackageCreateInput = z.infer<typeof packageCreateSchema>
export type PackageUpdateInput = z.infer<typeof packageUpdateSchema>

// Onboarding data schema
export const onboardingDataSchema = z.object({
  accountCreation: z.object({
    businessName: z.string(),
    contactName: z.string(),
    email: z.string(),
    phone: z.string().optional(),
    businessType: z.string(),
    website: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
  accountSetup: z.object({
    username: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  }).optional(),
  businessProfile: z.object({
    displayName: z.string(),
    headline: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    website: z.string().optional(),
    avatarUrl: z.string().optional(),
    coverImageUrl: z.string().optional(),
  }).optional(),
  documentation: z.object({
    businessLicense: z.string().optional(),
    insuranceCertificate: z.string().optional(),
    taxDocuments: z.string().optional(),
    otherDocuments: z.array(z.string()).optional(),
  }).optional(),
  locationAvailability: z.object({
    serviceAreas: z.array(z.object({
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      radius: z.number().optional(),
    })),
    availability: z.object({
      monday: z.boolean(),
      tuesday: z.boolean(),
      wednesday: z.boolean(),
      thursday: z.boolean(),
      friday: z.boolean(),
      saturday: z.boolean(),
      sunday: z.boolean(),
      startTime: z.string(),
      endTime: z.string(),
    }),
  }).optional(),
  pricingPackages: z.object({
    packages: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      price: z.number(),
      currency: z.string(),
      duration: z.string(),
      features: z.array(z.string()),
      isPopular: z.boolean(),
    })),
    pricingModel: z.enum(['package', 'hourly']),
    hourlyRate: z.number().optional(),
    depositRequired: z.boolean(),
    depositPercentage: z.number(),
    cancellationPolicy: z.string(),
  }).optional(),
  serviceCategories: z.object({
    categories: z.array(z.string()),
    specialties: z.array(z.string()),
    certifications: z.array(z.string()),
  }).optional(),
})

export type OnboardingData = z.infer<typeof onboardingDataSchema>

// Re-export booking schemas for convenience
export * from './schemas/booking'

