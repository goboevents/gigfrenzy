'use client'

import { useState } from 'react'
import { 
  ChevronLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import type { BookingData } from './index'

interface ReviewBookingStepProps {
  vendorData?: any
  data: Partial<BookingData>
  onUpdate: (data: Partial<BookingData>) => void
  onSubmit: () => void
  onPrevious: () => void
  loading: boolean
  error: string | null
}

export default function ReviewBookingStep({
  vendorData,
  data,
  onUpdate,
  onSubmit,
  onPrevious,
  loading,
  error
}: ReviewBookingStepProps) {
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false)



  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Format time for display (12-hour AM/PM format)
  const formatTimeForDisplay = (timeString: string) => {
    if (!timeString) return ''
    const [hour, minute] = timeString.split(':')
    const hourNum = parseInt(hour)
    const ampm = hourNum >= 12 ? 'PM' : 'AM'
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum
    return `${displayHour}:${minute} ${ampm}`
  }

  const getEventTypeDisplay = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Review your booking
          </h1>
          <p className="text-gray-600">
            Please review all details before confirming your booking
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Vendor Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Service Provider
              </h2>
              <div className="flex items-start space-x-4">
                {vendorData?.vendor?.avatarUrl && (
                  <img
                    src={vendorData.vendor.avatarUrl}
                    alt={vendorData.vendor.displayName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">
                    {vendorData?.vendor?.displayName || vendorData?.vendor?.businessName}
                  </h3>
                  {vendorData?.vendor?.headline && (
                    <p className="text-gray-600 text-sm">{vendorData.vendor.headline}</p>
                  )}
                  <div className="mt-2 text-sm text-gray-500">
                    {vendorData?.vendor?.location && (
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {vendorData.vendor.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Event Details
                </h2>
                <button
                  onClick={() => {/* Go back to step 1 */}}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                >
                  <PencilIcon className="w-4 h-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Event Type</div>
                  <div className="font-medium text-gray-900">
                    {getEventTypeDisplay(data.eventType || '')}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-1">Guest Count</div>
                  <div className="font-medium text-gray-900">
                    {data.guestCount} guests
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <div className="text-sm text-gray-600 mb-1">Venue Address</div>
                  <div className="font-medium text-gray-900">
                    {data.venueAddress}
                  </div>
                </div>
                
                {data.specialRequirements && (
                  <div className="sm:col-span-2">
                    <div className="text-sm text-gray-600 mb-1">Special Requirements</div>
                    <div className="font-medium text-gray-900">
                      {data.specialRequirements}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Service & DateTime */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Service & Schedule
                </h2>
                <button
                  onClick={() => {/* Go back to service selection */}}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                >
                  <PencilIcon className="w-4 h-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Selected Service</div>
                  <div className="font-medium text-gray-900">
                    {data.selectedService?.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {data.selectedService?.type === 'package' ? 'Package' : 'Service'} • {data.selectedService?.duration}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <CalendarDaysIcon className="w-4 h-4 mr-1" />
                      Date
                    </div>
                    <div className="font-medium text-gray-900">
                      {data.eventDate && formatDate(data.eventDate)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      Time
                    </div>
                    <div className="font-medium text-gray-900">
                      {data.startTime && data.endTime 
                        ? `${formatTimeForDisplay(data.startTime)} - ${formatTimeForDisplay(data.endTime)}`
                        : 'Not specified'
                      }
                    </div>
                  </div>
                </div>

                {data.eventDuration && data.eventDuration > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Event Duration</div>
                    <div className="font-medium text-gray-900">
                      {data.eventDuration} hour{data.eventDuration !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Contact Information
                </h2>
                <button
                  onClick={() => {/* Go back to customer info */}}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                >
                  <PencilIcon className="w-4 h-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="font-medium text-gray-900">{data.customerName}</span>
                </div>
                
                <div className="flex items-center">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-700">{data.customerEmail}</span>
                </div>
                
                <div className="flex items-center">
                  <PhoneIcon className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-700">{data.customerPhone}</span>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Price Breakdown */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Price Summary
                </h3>
                
                <div className="space-y-3">
                  {/* Service/Package Details */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="text-sm text-gray-600 mb-1">
                      {data.selectedService?.type === 'package' ? 'Package' : 'Service'}
                    </div>
                    <div className="font-medium text-gray-900 mb-1">
                      {data.selectedService?.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {data.selectedService?.pricingModel === 'hourly' && data.eventDuration
                        ? `${data.eventDuration} hour${data.eventDuration !== 1 ? 's' : ''} @ ${formatPrice(data.selectedService?.hourlyRate || 0)}/hr`
                        : data.selectedService?.duration || 'Fixed price'
                      }
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price</span>
                    <span className="font-medium">
                      {data.selectedService?.pricingModel === 'hourly' && data.eventDuration && data.selectedService?.hourlyRate
                        ? formatPrice((data.selectedService.hourlyRate * data.eventDuration))
                        : formatPrice(data.selectedService?.priceCents || 0)
                      }
                    </span>
                  </div>
                  
                  {/* Add any additional fees here */}
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(data.totalPriceCents || 0)}
                      </span>
                    </div>
                  </div>
                  
                  {data.depositAmountCents && data.depositAmountCents > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-blue-700">Due now (deposit):</span>
                          <span className="font-semibold text-blue-900">
                            {formatPrice(data.depositAmountCents)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Due later:</span>
                          <span className="font-semibold text-blue-900">
                            {formatPrice((data.totalPriceCents || 0) - data.depositAmountCents)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Policies */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Booking Policies</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Final payment due 24 hours before event</p>
                  <p>• Cancellation policy applies</p>
                  <p>• Changes subject to availability</p>
                </div>
              </div>

              {/* Confirmation Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">What happens next?</p>
                    <ul className="space-y-1">
                      <li>• You&apos;ll receive an email confirmation</li>
                      <li>• The vendor will contact you within 24 hours</li>
                      <li>• Final details will be confirmed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onPrevious}
            disabled={loading}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Back
          </button>

          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex items-center bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                Confirm Booking
                <CurrencyDollarIcon className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>

        {/* Legal Text */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By confirming this booking, you agree to our Terms of Service and Privacy Policy.
            You will only be charged after the vendor confirms availability.
          </p>
        </div>
      </div>
    </div>
  )
}