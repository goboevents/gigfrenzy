import { getDatabase } from '@/lib/db'
import type {
  CustomerBookingCreateInput,
  CustomerBookingUpdateInput,
  CustomerBookingResponse,
  BookingMessageInput,
  BookingMessageResponse,
  BookingQuery,
  AvailabilityCheck,
  AvailabilityResponse,
  BookingStatus,
  PaymentStatus,
  EventType
} from '@/lib/schemas/booking'

// Database row types
interface CustomerBookingRow {
  id: number
  vendorId: number
  customerName: string
  customerEmail: string
  customerPhone: string | null
  eventDate: string
  startTime: string
  endTime: string
  eventDuration: number
  eventType: string
  guestCount: number | null
  venueAddress: string | null
  specialRequirements: string | null
  serviceId: number | null
  packageId: number | null
  totalPriceCents: number
  depositAmountCents: number
  status: string
  paymentStatus: string
  createdAt: string
  updatedAt: string
}

interface AvailabilityRow {
  id: number
  vendorId: number
  monday: number
  tuesday: number
  wednesday: number
  thursday: number
  friday: number
  saturday: number
  sunday: number
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
}

interface ConflictingBookingRow {
  id: number
  startTime: string
}

interface MessageRow {
  id: number
  bookingId: number
  senderType: string
  message: string
  createdAt: string
}

interface StatsRow {
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  completedBookings: number
  cancelledBookings: number
  totalRevenueCents: number
  totalDepositsCents: number
}

export class BookingRepository {
  private db = getDatabase()

  // Create a new customer booking
  async createCustomerBooking(input: CustomerBookingCreateInput): Promise<CustomerBookingResponse> {
    const now = new Date().toISOString()
    
    console.log('Creating booking with input:', input)
    
    const stmt = this.db.prepare(`
      INSERT INTO customer_bookings (
        vendorId, customerName, customerEmail, customerPhone, eventDate, startTime, endTime, eventDuration,
        eventType, guestCount, venueAddress, specialRequirements, serviceId, packageId,
        totalPriceCents, depositAmountCents, status, paymentStatus, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const insertResult = stmt.run(
      input.vendorId,
      input.customerName,
      input.customerEmail,
      input.customerPhone || null,
      input.eventDate,
      input.startTime,
      input.endTime,
      input.eventDuration,
      input.eventType,
      input.guestCount || null,
      input.venueAddress || null,
      input.specialRequirements || null,
      input.serviceId || null,
      input.packageId || null,
      input.totalPriceCents,
      input.depositAmountCents,
      'pending', // default status
      'pending', // default payment status
      now,
      now
    )
    
    console.log('Insert result:', insertResult)

    const bookingId = insertResult.lastInsertRowid as number
    
    const createdBooking = this.getCustomerBookingById(bookingId)
    if (!createdBooking) {
      throw new Error('Failed to create booking')
    }
    return createdBooking
  }

  // Get a customer booking by ID
  getCustomerBookingById(id: number): CustomerBookingResponse | null {
    const stmt = this.db.prepare(`
      SELECT * FROM customer_bookings WHERE id = ?
    `)
    
    const row = stmt.get(id) as CustomerBookingRow | undefined
    
    if (!row) return null
    
    return {
      id: row.id,
      vendorId: row.vendorId,
      customerName: row.customerName,
      customerEmail: row.customerEmail,
      customerPhone: row.customerPhone || undefined,
      eventDate: row.eventDate,
      startTime: row.startTime,
      endTime: row.endTime,
      eventDuration: row.eventDuration,
      eventType: row.eventType as any,
      guestCount: row.guestCount || 1,
      venueAddress: row.venueAddress || undefined,
      specialRequirements: row.specialRequirements || undefined,
      serviceId: row.serviceId || undefined,
      packageId: row.packageId || undefined,
      totalPriceCents: row.totalPriceCents,
      depositAmountCents: row.depositAmountCents,
      status: row.status as any,
      paymentStatus: row.paymentStatus as any,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }

  // Update a customer booking
  async updateCustomerBooking(input: CustomerBookingUpdateInput): Promise<CustomerBookingResponse | null> {
    const now = new Date().toISOString()
    
    // Build dynamic update query based on provided fields
    const updateFields: string[] = []
    const values: any[] = []
    
    if (input.customerName !== undefined) {
      updateFields.push('customerName = ?')
      values.push(input.customerName)
    }
    if (input.customerEmail !== undefined) {
      updateFields.push('customerEmail = ?')
      values.push(input.customerEmail)
    }
    if (input.customerPhone !== undefined) {
      updateFields.push('customerPhone = ?')
      values.push(input.customerPhone)
    }
    if (input.eventDate !== undefined) {
      updateFields.push('eventDate = ?')
      values.push(input.eventDate)
    }
    if (input.startTime !== undefined) {
      updateFields.push('startTime = ?')
      values.push(input.startTime)
    }
    if (input.endTime !== undefined) {
      updateFields.push('endTime = ?')
      values.push(input.endTime)
    }
    if (input.eventDuration !== undefined) {
      updateFields.push('eventDuration = ?')
      values.push(input.eventDuration)
    }
    if (input.eventType !== undefined) {
      updateFields.push('eventType = ?')
      values.push(input.eventType)
    }
    if (input.guestCount !== undefined) {
      updateFields.push('guestCount = ?')
      values.push(input.guestCount)
    }
    if (input.venueAddress !== undefined) {
      updateFields.push('venueAddress = ?')
      values.push(input.venueAddress)
    }
    if (input.specialRequirements !== undefined) {
      updateFields.push('specialRequirements = ?')
      values.push(input.specialRequirements)
    }
    if (input.serviceId !== undefined) {
      updateFields.push('serviceId = ?')
      values.push(input.serviceId)
    }
    if (input.packageId !== undefined) {
      updateFields.push('packageId = ?')
      values.push(input.packageId)
    }
    if (input.totalPriceCents !== undefined) {
      updateFields.push('totalPriceCents = ?')
      values.push(input.totalPriceCents)
    }
    if (input.depositAmountCents !== undefined) {
      updateFields.push('depositAmountCents = ?')
      values.push(input.depositAmountCents)
    }
    if (input.status !== undefined) {
      updateFields.push('status = ?')
      values.push(input.status)
    }
    if (input.paymentStatus !== undefined) {
      updateFields.push('paymentStatus = ?')
      values.push(input.paymentStatus)
    }
    
    if (updateFields.length === 0) {
      return this.getCustomerBookingById(input.id)
    }
    
    updateFields.push('updatedAt = ?')
    values.push(now)
    values.push(input.id)
    
    const stmt = this.db.prepare(`
      UPDATE customer_bookings 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `)
    
    const result = stmt.run(...values)
    
    if (result.changes === 0) {
      return null
    }
    
    return this.getCustomerBookingById(input.id)
  }

  // Get bookings with filtering and pagination
  getCustomerBookings(query: BookingQuery): CustomerBookingResponse[] {
    const conditions: string[] = []
    const values: (string | number | boolean)[] = []
    
    if (query.vendorId) {
      conditions.push('vendorId = ?')
      values.push(query.vendorId)
    }
    
    if (query.customerEmail) {
      conditions.push('customerEmail = ?')
      values.push(query.customerEmail)
    }
    
    if (query.status) {
      conditions.push('status = ?')
      values.push(query.status)
    }
    
    if (query.startDate) {
      conditions.push('eventDate >= ?')
      values.push(query.startDate)
    }
    
    if (query.endDate) {
      conditions.push('eventDate <= ?')
      values.push(query.endDate)
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    
    const stmt = this.db.prepare(`
      SELECT * FROM customer_bookings 
      ${whereClause}
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `)
    
    const allValues = [...values, query.limit, query.offset]
    const rows = stmt.all(...allValues) as CustomerBookingRow[]
    
    return rows.map((row: CustomerBookingRow) => ({
      id: row.id,
      vendorId: row.vendorId,
      customerName: row.customerName,
      customerEmail: row.customerEmail,
      customerPhone: row.customerPhone || undefined,
      eventDate: row.eventDate,
      startTime: row.startTime,
      endTime: row.endTime,
      eventDuration: row.eventDuration,
      eventType: row.eventType as EventType,
      guestCount: row.guestCount || 1,
      venueAddress: row.venueAddress || undefined,
      specialRequirements: row.specialRequirements || undefined,
      serviceId: row.serviceId || undefined,
      packageId: row.packageId || undefined,
      totalPriceCents: row.totalPriceCents,
      depositAmountCents: row.depositAmountCents,
      status: row.status as BookingStatus,
      paymentStatus: row.paymentStatus as PaymentStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }))
  }

  // Check vendor availability for a specific date
  checkVendorAvailability(input: AvailabilityCheck): AvailabilityResponse {
    const { vendorId, date } = input
    
    // Get vendor's general availability
    const availabilityStmt = this.db.prepare(`
      SELECT * FROM vendor_availability WHERE vendorId = ?
    `)
    const availability = availabilityStmt.get(vendorId) as AvailabilityRow | undefined
    
    if (!availability) {
      return {
        vendorId,
        date,
        available: false,
        availableSlots: [],
        conflictingBookings: []
      }
    }
    
    // Check for conflicting bookings on the same date
    const conflictingBookingsStmt = this.db.prepare(`
      SELECT id, startTime FROM customer_bookings 
      WHERE vendorId = ? AND eventDate = ? AND status NOT IN ('cancelled', 'completed')
    `)
    const conflictingBookings = conflictingBookingsStmt.all(vendorId, date) as ConflictingBookingRow[]
    
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = new Date(date).getDay()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
    const dayName = dayNames[dayOfWeek]
    
    // Check if vendor is available on this day
    const isDayAvailable = availability[dayName as keyof AvailabilityRow] === 1
    
    if (!isDayAvailable) {
      return {
        vendorId,
        date,
        available: false,
        availableSlots: [],
        conflictingBookings: conflictingBookings.map(b => ({
          id: b.id,
          startTime: b.startTime,
        }))
      }
    }
    
    // Generate available time slots (simplified - every hour)
    const startTime = availability.startTime || '09:00'
    const endTime = availability.endTime || '17:00'
    const availableSlots: string[] = []
    
    const currentTime = new Date(`2000-01-01T${startTime}`)
    const endTimeObj = new Date(`2000-01-01T${endTime}`)
    
    while (currentTime < endTimeObj) {
      const timeString = currentTime.toTimeString().slice(0, 5)
      const hasConflict = conflictingBookings.some(booking => 
        booking.startTime === timeString
      )
      
      if (!hasConflict) {
        availableSlots.push(timeString)
      }
      
      currentTime.setHours(currentTime.getHours() + 1)
    }
    
    return {
      vendorId,
      date,
      available: availableSlots.length > 0,
      availableSlots,
      conflictingBookings: conflictingBookings.map(b => ({
        id: b.id,
        startTime: b.startTime,
      }))
    }
  }

  // Create a booking message
  async createBookingMessage(input: BookingMessageInput): Promise<BookingMessageResponse> {
    const now = new Date().toISOString()
    
    const stmt = this.db.prepare(`
      INSERT INTO booking_messages (bookingId, senderType, message, createdAt)
      VALUES (?, ?, ?, ?)
    `)
    
    const result = stmt.run(
      input.bookingId,
      input.senderType,
      input.message,
      now
    )
    
    const messageId = result.lastInsertRowid as number
    
    return {
      id: messageId,
      bookingId: input.bookingId,
      senderType: input.senderType,
      message: input.message,
      createdAt: now,
    }
  }

  // Get messages for a specific booking
  getBookingMessages(bookingId: number): BookingMessageResponse[] {
    const stmt = this.db.prepare(`
      SELECT * FROM booking_messages 
      WHERE bookingId = ? 
      ORDER BY createdAt ASC
    `)
    
    const rows = stmt.all(bookingId) as MessageRow[]
    
    return rows.map(row => ({
      id: row.id,
      bookingId: row.bookingId,
      senderType: row.senderType as 'customer' | 'vendor',
      message: row.message,
      createdAt: row.createdAt,
    }))
  }

  // Delete a customer booking (soft delete by setting status to cancelled)
  async deleteCustomerBooking(id: number): Promise<boolean> {
    const stmt = this.db.prepare(`
      UPDATE customer_bookings 
      SET status = 'cancelled', updatedAt = ? 
      WHERE id = ?
    `)
    
    const result = stmt.run(new Date().toISOString(), id)
    return result.changes > 0
  }

  // Get booking statistics for a vendor
  getVendorBookingStats(vendorId: number) {
    const stmt = this.db.prepare(`
      SELECT 
        COUNT(*) as totalBookings,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingBookings,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmedBookings,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedBookings,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelledBookings,
        SUM(totalPriceCents) as totalRevenueCents,
        SUM(depositAmountCents) as totalDepositsCents
      FROM customer_bookings 
      WHERE vendorId = ?
    `)
    
    const stats = stmt.get(vendorId) as StatsRow
    
    return {
      totalBookings: stats.totalBookings || 0,
      pendingBookings: stats.pendingBookings || 0,
      confirmedBookings: stats.confirmedBookings || 0,
      completedBookings: stats.completedBookings || 0,
      cancelledBookings: stats.cancelledBookings || 0,
      totalRevenueCents: stats.totalRevenueCents || 0,
      totalDepositsCents: stats.totalDepositsCents || 0,
    }
  }
}

// Export singleton instance
export const bookingRepository = new BookingRepository()

