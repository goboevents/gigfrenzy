'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
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
  const [startTime, setStartTime] = useState(data.startTime || '')
  const [endTime, setEndTime] = useState(data.endTime || '')
  const [eventDuration, setEventDuration] = useState<number>(0)

  // Format time for display (12-hour AM/PM format)
  const formatTimeForDisplay = (timeString: string) => {
    if (!timeString) return ''
    const [hour, minute] = timeString.split(':')
    const hourNum = parseInt(hour)
    const ampm = hourNum >= 12 ? 'PM' : 'AM'
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum
    return `${displayHour}:${minute} ${ampm}`
  }

  // Calculate event duration when start and end times change
  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`)
      const end = new Date(`2000-01-01T${endTime}`)
      
      if (end > start) {
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        setEventDuration(durationHours)
        
        // Update booking data with duration for pricing calculations
        onUpdate({
          eventDate: selectedDate,
          startTime,
          endTime,
          eventDuration: durationHours,
        })
      } else {
        setEventDuration(0)
      }
    }
  }, [startTime, endTime, selectedDate, onUpdate])

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    onUpdate({
      eventDate: date,
      startTime,
      endTime,
      eventDuration,
    })
  }

  const handleStartTimeChange = (time: string) => {
    setStartTime(time)
    // Reset end time if it's before start time
    if (endTime && time >= endTime) {
      setEndTime('')
    }
  }

  const handleEndTimeChange = (time: string) => {
    setEndTime(time)
  }

  const handleNext = () => {
    if (selectedDate && startTime && endTime && eventDuration > 0) {
      // Ensure all data is properly set before proceeding
      onUpdate({
        eventDate: selectedDate,
        startTime,
        endTime,
        eventDuration,
      })
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

  const canProceed = selectedDate && startTime && endTime && eventDuration > 0

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
                {data.eventType ? (data.eventType.charAt(0).toUpperCase() + data.eventType.slice(1)) : 'Your'} Event
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-800">
                {data.guestCount} guests
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Date/Time Picker */}
          <div className="lg:col-span-2">
            <DateTimePicker
              selectedDate={selectedDate}
              startTime={startTime}
              endTime={endTime}
              onDateChange={handleDateChange}
              onStartTimeChange={handleStartTimeChange}
              onEndTimeChange={handleEndTimeChange}
              minDate={getMinDate()}
              maxDate={getMaxDate()}
            />
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
                      {startTime && endTime 
                        ? `${formatTimeForDisplay(startTime)} - ${formatTimeForDisplay(endTime)}`
                        : 'Not selected'
                      }
                    </div>
                  </div>

                  {/* Duration Info */}
                  {eventDuration > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600 mb-1">Event Duration</div>
                      <div className="text-gray-900 font-medium">
                        {eventDuration} hour{eventDuration !== 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        This will be used to calculate pricing
                      </div>
                    </div>
                  )}
                </div>

                {/* Help Text */}
                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">Select your preferred date and time for the event.</p>
                    <p>The event duration will be calculated automatically and used to determine pricing for services and packages.</p>
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
                ? 'Please select a date'
                : !startTime 
                  ? 'Please select a start time'
                  : !endTime 
                    ? 'Please select an end time'
                    : eventDuration <= 0
                      ? 'End time must be after start time'
                      : ''
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}