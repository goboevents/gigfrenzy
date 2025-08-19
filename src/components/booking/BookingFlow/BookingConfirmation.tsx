'use client'

import { useEffect, useState } from 'react'
import { 
  CheckCircleIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import type { BookingData } from './index'

interface BookingConfirmationProps {
  bookingId: number | null
  vendorData?: any
  bookingData: Partial<BookingData>
}

export default function BookingConfirmation({
  bookingId,
  vendorData,
  bookingData
}: BookingConfirmationProps) {
  const [copied, setCopied] = useState(false)

  // Format time for display (12-hour AM/PM format)
  const formatTimeForDisplay = (timeString: string) => {
    if (!timeString) return ''
    const [hour, minute] = timeString.split(':')
    const hourNum = parseInt(hour)
    const ampm = hourNum >= 12 ? 'PM' : 'AM'
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum
    return `${displayHour}:${minute} ${ampm}`
  }

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

  const copyBookingId = () => {
    if (bookingId) {
      navigator.clipboard.writeText(bookingId.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareBooking = () => {
    if (navigator.share && bookingId) {
      navigator.share({
        title: 'Booking Confirmation',
        text: `My booking #${bookingId} is confirmed!`,
        url: window.location.href
      })
    }
  }

  const printBooking = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircleIcon className="w-16 h-16 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Great news! Your booking has been successfully submitted. 
            We&apos;ve sent you a confirmation email with all the details.
          </p>
        </div>

        {/* Booking Reference */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Booking Reference</div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                #{bookingId}
              </span>
              <button
                onClick={copyBookingId}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy booking ID"
              >
                <DocumentDuplicateIcon className="w-5 h-5" />
              </button>
            </div>
            {copied && (
              <p className="text-green-600 text-sm mt-1">Copied to clipboard!</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* What Happens Next */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">
                What happens next?
              </h2>
              <div className="space-y-3 text-blue-800">
                <div className="flex items-start">
                  <div className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Vendor will review your request</p>
                    <p className="text-sm text-blue-700">
                      {vendorData?.vendor?.displayName} will contact you within 24 hours to confirm availability and discuss any details.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Finalize the details</p>
                    <p className="text-sm text-blue-700">
                      Work together to confirm the final service details, timeline, and any special requirements.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Complete payment</p>
                    <p className="text-sm text-blue-700">
                      {bookingData.depositAmountCents && bookingData.depositAmountCents > 0
                        ? `Pay the remaining ${formatPrice((bookingData.totalPriceCents || 0) - bookingData.depositAmountCents)} before your event.`
                        : 'Complete payment as agreed with the vendor.'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Enjoy your event!</p>
                    <p className="text-sm text-blue-700">
                      Relax and enjoy your special day knowing everything is taken care of.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your Service Provider
              </h2>
              <div className="flex items-start space-x-4">
                {vendorData?.vendor?.avatarUrl && (
                  <img
                    src={vendorData.vendor.avatarUrl}
                    alt={vendorData.vendor.displayName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {vendorData?.vendor?.displayName || vendorData?.vendor?.businessName}
                  </h3>
                  {vendorData?.vendor?.headline && (
                    <p className="text-gray-600 text-sm">{vendorData.vendor.headline}</p>
                  )}
                  
                  <div className="mt-3 space-y-2">
                    {vendorData?.vendor?.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <PhoneIcon className="w-4 h-4 mr-2" />
                        <a 
                          href={`tel:${vendorData.vendor.phone}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {vendorData.vendor.phone}
                        </a>
                      </div>
                    )}
                    
                    {vendorData?.vendor?.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <EnvelopeIcon className="w-4 h-4 mr-2" />
                        <a 
                          href={`mailto:${vendorData.vendor.email}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {vendorData.vendor.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Event Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Event Type</div>
                    <div className="font-medium text-gray-900">
                      {bookingData.eventType ? (bookingData.eventType.charAt(0).toUpperCase() + bookingData.eventType.slice(1)) : 'Unknown'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <CalendarDaysIcon className="w-4 h-4 mr-1" />
                      Date
                    </div>
                    <div className="font-medium text-gray-900">
                      {bookingData.eventDate && formatDate(bookingData.eventDate)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      Time
                    </div>
                    <div className="font-medium text-gray-900">
                      {bookingData.startTime && bookingData.endTime 
                        ? `${formatTimeForDisplay(bookingData.startTime)} - ${formatTimeForDisplay(bookingData.endTime)}`
                        : 'Not specified'
                      }
                    </div>
                  </div>

                  {bookingData.eventDuration && bookingData.eventDuration > 0 && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Event Duration</div>
                      <div className="font-medium text-gray-900">
                        {bookingData.eventDuration} hour{bookingData.eventDuration !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Guest Count</div>
                    <div className="font-medium text-gray-900">
                      {bookingData.guestCount} guests
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      Venue
                    </div>
                    <div className="font-medium text-gray-900">
                      {bookingData.venueAddress}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Service</div>
                    <div className="font-medium text-gray-900">
                      {bookingData.selectedService?.title}
                    </div>
                  </div>
                </div>
              </div>
              
              {bookingData.specialRequirements && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Special Requirements</div>
                  <div className="text-gray-900">
                    {bookingData.specialRequirements}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="font-medium text-gray-900">{bookingData.customerName}</span>
                </div>
                
                <div className="flex items-center">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-700">{bookingData.customerEmail}</span>
                </div>
                
                <div className="flex items-center">
                  <PhoneIcon className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-700">{bookingData.customerPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions & Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              
              {/* Price Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Price Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(bookingData.totalPriceCents || 0)}
                    </span>
                  </div>
                  
                  {bookingData.depositAmountCents && bookingData.depositAmountCents > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-green-700">Paid (deposit):</span>
                          <span className="font-semibold text-green-900">
                            {formatPrice(bookingData.depositAmountCents)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Remaining:</span>
                          <span className="font-semibold text-green-900">
                            {formatPrice((bookingData.totalPriceCents || 0) - bookingData.depositAmountCents)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                
                <div className="space-y-3">
                  <button
                    onClick={printBooking}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <PrinterIcon className="w-4 h-4 mr-2" />
                    Print Confirmation
                  </button>
                  
                  <button
                    onClick={shareBooking}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ShareIcon className="w-4 h-4 mr-2" />
                    Share Booking
                  </button>
                  
                  {bookingId && (
                    <Link
                      href={`/booking/${bookingId}/messages`}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                      Message Vendor
                    </Link>
                  )}
                </div>
              </div>

              {/* Support */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    <Link href="/support" className="text-blue-600 hover:text-blue-700">
                      Contact Support
                    </Link>
                  </p>
                  <p>
                    <Link href="/booking-help" className="text-blue-600 hover:text-blue-700">
                      Booking FAQ
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Home Link */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}