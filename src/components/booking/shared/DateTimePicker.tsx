'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon } from '@heroicons/react/24/outline'

interface DateTimePickerProps {
  selectedDate?: string
  selectedTime?: string
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
  availableSlots: string[]
  minDate?: string
  maxDate?: string
}

export default function DateTimePicker({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  availableSlots,
  minDate,
  maxDate
}: DateTimePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(false)

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const isDateAvailable = (date: Date) => {
    const dateStr = formatDate(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Check if date is in the past
    if (date < today) return false
    
    // Check min/max date constraints
    if (minDate && dateStr < minDate) return false
    if (maxDate && dateStr > maxDate) return false
    
    return true
  }

  const isDateSelected = (date: Date) => {
    return selectedDate === formatDate(date)
  }

  const handleDateClick = (date: Date) => {
    if (!isDateAvailable(date)) return
    
    const dateStr = formatDate(date)
    setLoading(true)
    onDateChange(dateStr)
    
    // Simulate loading time for availability check
    setTimeout(() => setLoading(false), 500)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const days = getDaysInMonth(currentMonth)

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <h3 className="text-lg font-semibold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="p-2" />
            }

            const isAvailable = isDateAvailable(day)
            const isSelected = isDateSelected(day)

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                disabled={!isAvailable}
                className={`
                  p-2 text-sm rounded-lg transition-all duration-200
                  ${isSelected 
                    ? 'bg-blue-600 text-white' 
                    : isAvailable 
                      ? 'hover:bg-blue-50 text-gray-900' 
                      : 'text-gray-300 cursor-not-allowed'
                  }
                `}
              >
                {day.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <ClockIcon className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Available Times for {new Date(selectedDate).toLocaleDateString()}
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 mt-2">Checking availability...</p>
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => onTimeChange(slot)}
                  className={`
                    p-3 text-sm rounded-lg border transition-all duration-200
                    ${selectedTime === slot
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-900 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                >
                  {slot}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No available time slots for this date</p>
              <p className="text-sm text-gray-400 mt-1">
                Please select a different date
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}