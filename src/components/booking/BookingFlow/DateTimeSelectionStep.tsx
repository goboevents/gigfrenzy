'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import DateTimePicker from '../shared/DateTimePicker'
import type { BookingData } from './index'

interface DateTimeSelectionStepProps {
  vendorSlug: string
  data: Partial<BookingData>
  onUpdate: (data: Partial<BookingData>) => void
  onNext: () => void
  onPrevious: () => void
}

export default function DateTimeSelectionStep({
  vendorSlug,
  data,
  onUpdate,
  onNext,
  onPrevious
}: DateTimeSelectionStepProps) {
  const [selectedDate, setSelectedDate] = useState(data.eventDate || '')
  const [selectedTime, setSelectedTime] = useState(data.eventTime || '')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check availability when date changes
  useEffect(() => {
    if (selectedDate) {
      checkAvailability(selectedDate)
    }
  }, [selectedDate, vendorSlug])

  const checkAvailability = async (date: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        date,
      })
      
      if (data.serviceId) {
        params.append('serviceId', data.serviceId.toString())
      }
      if (data.packageId) {
        params.append('packageId', data.packageId.toString())
      }

      const response = await fetch(`/api/vendor/public/${vendorSlug}/availability?${params}`)
      if (!response.ok) {
        throw new Error('Failed to check availability')
      }

      const result = await response.json()
      setAvailableSlots(result.availability.availableSlots || [])
      
      // Clear selected time if it's no longer available
      if (selectedTime && !result.availability.availableSlots.includes(selectedTime)) {
        setSelectedTime('')
      }
    } catch (err) {
      setError('Failed to check availability')
      console.error('Error checking availability:', err)
      setAvailableSlots([])
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setSelectedTime('') // Reset time when date changes
    onUpdate({
      eventDate: date,
      eventTime: '',
    })
  }

  const handleTimeChange = (time: string) => {
    setSelectedTime(time)
    onUpdate({
      eventDate: selectedDate,
      eventTime: time,
    })
  }

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      onNext()
    }
  }

  // Generate date constraints
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() + 1)
    return maxDate.toISOString().split('T')[0]
  }

  const canProceed = selectedDate && selectedTime

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            When would you like your event?
          </h1>
          <p className="text-gray-600">
            Choose a date and time that works best for your {data.eventType} event
          </p>
        </div>

        {/* Event Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <CalendarDaysIcon className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-900 font-medium">
                {data.eventType?.charAt(0).toUpperCase() + data.eventType?.slice(1)} Event
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-800">
                {data.guestCount} guests • {data.selectedService?.title}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Date/Time Picker */}
          <div className="lg:col-span-2">
            <DateTimePicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateChange={handleDateChange}
              onTimeChange={handleTimeChange}
              availableSlots={availableSlots}
              minDate={getMinDate()}
              maxDate={getMaxDate()}
            />

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-800">{error}</p>
                </div>
                <button
                  onClick={() => selectedDate && checkAvailability(selectedDate)}
                  className="mt-2 text-red-600 hover:text-red-700 text-sm underline"
                >
                  Try again
                </button>
              </div>
            )}
          </div>

          {/* Selection Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Selection
                </h3>

                <div className="space-y-4">
                  {/* Date Selection */}
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <CalendarDaysIcon className="w-4 h-4 mr-1" />
                      Date
                    </div>
                    <div className="text-gray-900 font-medium">
                      {selectedDate 
                        ? new Date(selectedDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Not selected'
                      }
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      Time
                    </div>
                    <div className="text-gray-900 font-medium">
                      {selectedTime || 'Not selected'}
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Service</div>
                    <div className="text-gray-900 font-medium">
                      {data.selectedService?.title}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Duration: {data.selectedService?.duration}
                    </div>
                  </div>

                  {/* Pricing Preview */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Total</div>
                    <div className="text-xl font-bold text-gray-900">
                      ${((data.totalPriceCents || 0) / 100).toFixed(2)}
                    </div>
                    {data.depositAmountCents && data.depositAmountCents > 0 && (
                      <div className="text-sm text-gray-500">
                        ${(data.depositAmountCents / 100).toFixed(2)} deposit required
                      </div>
                    )}
                  </div>
                </div>

                {/* Availability Info */}
                {selectedDate && (
                  <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                          Checking availability...
                        </div>
                      ) : availableSlots.length > 0 ? (
                        `${availableSlots.length} time slots available`
                      ) : (
                        'No available slots for this date'
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onPrevious}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`
              flex items-center px-6 py-3 rounded-lg font-medium transition-colors
              ${canProceed
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Continue
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Help Text */}
        {!canProceed && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              {!selectedDate 
                ? 'Please select a date to see available times'
                : !selectedTime 
                  ? 'Please select a time to continue'
                  : ''
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}