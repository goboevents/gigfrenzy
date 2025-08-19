'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon } from '@heroicons/react/24/outline'

interface DateTimePickerProps {
  selectedDate?: string
  startTime?: string
  endTime?: string
  onDateChange: (date: string) => void
  onStartTimeChange: (time: string) => void
  onEndTimeChange: (time: string) => void
  minDate?: string
  maxDate?: string
}

export default function DateTimePicker({
  selectedDate,
  startTime,
  endTime,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  minDate,
  maxDate
}: DateTimePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

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
    onDateChange(dateStr)
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

  // Generate time options for the time picker
  const generateTimeOptions = () => {
    const times = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const displayTime = formatTimeForDisplay(timeString)
        times.push({ value: timeString, display: displayTime })
      }
    }
    return times
  }

  // Format time for display (12-hour AM/PM format)
  const formatTimeForDisplay = (timeString: string) => {
    const [hour, minute] = timeString.split(':')
    const hourNum = parseInt(hour)
    const ampm = hourNum >= 12 ? 'PM' : 'AM'
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum
    return `${displayHour}:${minute} ${ampm}`
  }

  const timeOptions = generateTimeOptions()

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

      {/* Time Selection */}
      {selectedDate && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <ClockIcon className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Event Time for {new Date(selectedDate).toLocaleDateString()}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Time */}
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <select
                id="startTime"
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select start time</option>
                {timeOptions.map(time => (
                  <option key={time.value} value={time.value}>
                    {time.display}
                  </option>
                ))}
              </select>
            </div>

            {/* End Time */}
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <select
                id="endTime"
                value={endTime}
                onChange={(e) => onEndTimeChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!startTime}
              >
                <option value="">Select end time</option>
                {timeOptions
                  .filter(time => !startTime || time.value > startTime)
                  .map(time => (
                    <option key={time.value} value={time.value}>
                      {time.display}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>

          {/* Duration Display */}
          {startTime && endTime && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <span className="font-medium">Event Duration:</span> 
                {(() => {
                  const start = new Date(`2000-01-01T${startTime}`)
                  const end = new Date(`2000-01-01T${endTime}`)
                  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                  return ` ${durationHours} hour${durationHours !== 1 ? 's' : ''}`
                })()}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {formatTimeForDisplay(startTime)} - {formatTimeForDisplay(endTime)}
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-4 text-sm text-gray-600">
            <p>Select your preferred start and end times for the event. The duration will be calculated automatically and used for pricing.</p>
          </div>
        </div>
      )}
    </div>
  )
}