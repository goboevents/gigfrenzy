import { z } from 'zod'

// Event types that vendors can support
export const eventTypeSchema = z.enum([
  'wedding',
  'corporate',
  'birthday',
  'anniversary',
  'graduation',
  'holiday',
  'other'
])

// Booking status options
export const bookingStatusSchema = z.enum([
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'rescheduled'
])

// Payment status options
export const paymentStatusSchema = z.enum([
  'pending',
  'partial',
  'paid',
  'refunded'
])

// Customer booking creation schema
export const customerBookingCreateSchema = z.object({
  vendorId: z.number().int().positive('Vendor ID is required'),
  customerName: z.string().min(1, 'Customer name is required').max(100, 'Name too long'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().optional(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Start time must be in HH:MM format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'End time must be in HH:MM format'),
  eventDuration: z.number().positive('Event duration must be positive'),
  eventType: eventTypeSchema,
  guestCount: z.number().int().min(1, 'Guest count must be at least 1'),
  venueAddress: z.string().optional(),
  specialRequirements: z.string().max(1000, 'Requirements too long').optional(),
  serviceId: z.number().int().positive().optional(),
  packageId: z.number().int().positive().optional(),
  totalPriceCents: z.number().int().min(0, 'Total price must be non-negative'),
  depositAmountCents: z.number().int().min(0, 'Deposit must be non-negative'),
})

// Customer booking update schema
export const customerBookingUpdateSchema = customerBookingCreateSchema.partial().extend({
  id: z.number().int().positive('Booking ID is required'),
  status: bookingStatusSchema.optional(),
  paymentStatus: paymentStatusSchema.optional(),
})

// Customer booking response schema
export const customerBookingResponseSchema = customerBookingCreateSchema.extend({
  id: z.number().int().positive(),
  status: bookingStatusSchema,
  paymentStatus: paymentStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Booking message schema
export const bookingMessageSchema = z.object({
  bookingId: z.number().int().positive('Booking ID is required'),
  senderType: z.enum(['customer', 'vendor']),
  message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
})

// Booking message response schema
export const bookingMessageResponseSchema = bookingMessageSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.string(),
})

// Booking query/filter schema
export const bookingQuerySchema = z.object({
  vendorId: z.number().int().positive().optional(),
  customerEmail: z.string().email().optional(),
  status: bookingStatusSchema.optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

// Availability check schema
export const availabilityCheckSchema = z.object({
  vendorId: z.number().int().positive('Vendor ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  serviceId: z.number().int().positive().optional(),
  packageId: z.number().int().positive().optional(),
})

// Availability response schema
export const availabilityResponseSchema = z.object({
  vendorId: z.number().int().positive(),
  date: z.string(),
  available: z.boolean(),
  availableSlots: z.array(z.string()).optional(),
  conflictingBookings: z.array(z.object({
    id: z.number(),
    startTime: z.string(),
    duration: z.string().optional(),
  })).optional(),
})

// Export types
export type EventType = z.infer<typeof eventTypeSchema>
export type BookingStatus = z.infer<typeof bookingStatusSchema>
export type PaymentStatus = z.infer<typeof paymentStatusSchema>
export type CustomerBookingCreateInput = z.infer<typeof customerBookingCreateSchema>
export type CustomerBookingUpdateInput = z.infer<typeof customerBookingUpdateSchema>
export type CustomerBookingResponse = z.infer<typeof customerBookingResponseSchema>
export type BookingMessageInput = z.infer<typeof bookingMessageSchema>
export type BookingMessageResponse = z.infer<typeof bookingMessageResponseSchema>
export type BookingQuery = z.infer<typeof bookingQuerySchema>
export type AvailabilityCheck = z.infer<typeof availabilityCheckSchema>
export type AvailabilityResponse = z.infer<typeof availabilityResponseSchema>