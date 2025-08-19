'use client'

import { useState, useEffect } from 'react'
import BookingProgressBar from '../shared/BookingProgressBar'
import EventDetailsStep from './EventDetailsStep'
import ServiceSelectionStep from './ServiceSelectionStep'
import DateTimeSelectionStep from './DateTimeSelectionStep'
import CustomerInfoStep from './CustomerInfoStep'
import ReviewBookingStep from './ReviewBookingStep'
import BookingConfirmation from './BookingConfirmation'

// Booking data types
export interface BookingData {
  // Event details
  eventType: string
  eventDate: string
  startTime: string
  endTime: string
  eventDuration: number
  guestCount: number
  venueAddress: string
  specialRequirements: string
  
  // Service selection
  serviceId?: number
  packageId?: number
  selectedService?: any
  
  // Customer info
  customerName: string
  customerEmail: string
  customerPhone: string
  
  // Pricing
  totalPriceCents: number
  depositAmountCents: number
}

interface BookingFlowProps {
  vendorSlug: string
  vendorData?: any
  onComplete?: (bookingData: BookingData) => void
  onCancel?: () => void
}

const STEPS = [
  'Event Details',
  'Choose Date & Time',
  'Select Service',
  'Your Information',
  'Review & Confirm'
]

export default function BookingFlow({ 
  vendorSlug, 
  vendorData, 
  onComplete, 
  onCancel 
}: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingId, setBookingId] = useState<number | null>(null)
  const [localVendorData, setLocalVendorData] = useState(vendorData)

  // Load vendor data if not provided
  useEffect(() => {
    if (!vendorData) {
      loadVendorData()
    } else {
      setLocalVendorData(vendorData)
    }
  }, [vendorSlug, vendorData])



  const loadVendorData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/vendor/public/${vendorSlug}?type=booking-options`)
      if (!response.ok) throw new Error('Failed to load vendor data')
      const data = await response.json()
      setLocalVendorData(data)
    } catch (err) {
      setError('Failed to load vendor information')
      console.error('Error loading vendor data:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingData = (stepData: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...stepData }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmitBooking = async () => {
    try {
      setLoading(true)
      setError(null)

      // Prepare booking data
      const bookingPayload = {
        vendorId: localVendorData?.vendor?.id,
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        customerPhone: bookingData.customerPhone,
        eventDate: bookingData.eventDate,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        eventDuration: bookingData.eventDuration,
        eventType: bookingData.eventType,
        guestCount: bookingData.guestCount,
        venueAddress: bookingData.venueAddress,
        specialRequirements: bookingData.specialRequirements,
        serviceId: bookingData.serviceId,
        packageId: bookingData.packageId,
        totalPriceCents: bookingData.totalPriceCents,
        depositAmountCents: bookingData.depositAmountCents,
      }

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create booking')
      }

      const result = await response.json()
      setBookingId(result.booking.id)
      
      // Navigate to the confirmation page
      window.location.href = `/booking/confirm/${result.booking.id}`
      
      if (onComplete) {
        onComplete(bookingData as BookingData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking')
      console.error('Error creating booking:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EventDetailsStep
            data={bookingData}
            onUpdate={updateBookingData}
            onNext={handleNext}
            onCancel={onCancel}
          />
        )
      case 2:
        return (
          <DateTimeSelectionStep
            vendorSlug={vendorSlug}
            data={bookingData}
            onUpdate={updateBookingData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 3:
        return (
          <ServiceSelectionStep
            vendorSlug={vendorSlug}
            vendorData={localVendorData}
            data={bookingData}
            onUpdate={updateBookingData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 4:
        return (
          <CustomerInfoStep
            data={bookingData}
            onUpdate={updateBookingData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 5:
        return (
          <ReviewBookingStep
            vendorData={localVendorData}
            data={bookingData}
            onUpdate={updateBookingData}
            onSubmit={handleSubmitBooking}
            onPrevious={handlePrevious}
            loading={loading}
            error={error}
          />
        )
      case 6:
        return (
          <BookingConfirmation
            bookingId={bookingId}
            vendorData={localVendorData}
            bookingData={bookingData}
          />
        )
      default:
        return null
    }
  }

  if (loading && currentStep === 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading booking information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      {currentStep <= 5 && (
        <BookingProgressBar
          currentStep={currentStep}
          totalSteps={STEPS.length}
          steps={STEPS}
        />
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {renderCurrentStep()}
      </div>
    </div>
  )
}