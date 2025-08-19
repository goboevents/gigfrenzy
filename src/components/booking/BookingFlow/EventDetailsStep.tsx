'use client'

import { useState } from 'react'
import { 
  CalendarDaysIcon, 
  UserGroupIcon, 
  MapPinIcon, 
  DocumentTextIcon,
  XMarkIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import type { BookingData } from './index'

interface EventDetailsStepProps {
  data: Partial<BookingData>
  onUpdate: (data: Partial<BookingData>) => void
  onNext: () => void
  onCancel?: () => void
}

const EVENT_TYPES = [
  { value: 'wedding', label: 'Wedding', icon: '💒' },
  { value: 'corporate', label: 'Corporate Event', icon: '🏢' },
  { value: 'birthday', label: 'Birthday Party', icon: '🎂' },
  { value: 'anniversary', label: 'Anniversary', icon: '💕' },
  { value: 'graduation', label: 'Graduation', icon: '🎓' },
  { value: 'holiday', label: 'Holiday Party', icon: '🎄' },
  { value: 'other', label: 'Other', icon: '🎉' },
]

export default function EventDetailsStep({ 
  data, 
  onUpdate, 
  onNext, 
  onCancel 
}: EventDetailsStepProps) {
  const [formData, setFormData] = useState({
    eventType: data.eventType || '',
    guestCount: data.guestCount || '',
    venueAddress: data.venueAddress || '',
    specialRequirements: data.specialRequirements || '',
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.eventType) {
      newErrors.eventType = 'Please select an event type'
    }

    if (!formData.guestCount || Number(formData.guestCount) < 1) {
      newErrors.guestCount = 'Please enter a valid guest count'
    }

    if (!formData.venueAddress.trim()) {
      newErrors.venueAddress = 'Please enter the venue address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onUpdate({
        eventType: formData.eventType,
        guestCount: Number(formData.guestCount),
        venueAddress: formData.venueAddress,
        specialRequirements: formData.specialRequirements,
      })
      onNext()
    }
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tell us about your event
          </h1>
          <p className="text-gray-600">
            Help us understand your needs so we can provide the best service
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What type of event are you planning?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {EVENT_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => handleInputChange('eventType', type.value)}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 text-left
                    ${formData.eventType === type.value
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }
                  `}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
            {errors.eventType && (
              <p className="text-red-600 text-sm mt-1">{errors.eventType}</p>
            )}
          </div>

          {/* Guest Count */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <UserGroupIcon className="w-4 h-4 mr-2" />
              How many guests will attend?
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={formData.guestCount}
              onChange={(e) => handleInputChange('guestCount', e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.guestCount ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="e.g., 50"
            />
            {errors.guestCount && (
              <p className="text-red-600 text-sm mt-1">{errors.guestCount}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              This helps us recommend the right services for your event size
            </p>
          </div>

          {/* Venue Address */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPinIcon className="w-4 h-4 mr-2" />
              Where will the event take place?
            </label>
            <textarea
              value={formData.venueAddress}
              onChange={(e) => handleInputChange('venueAddress', e.target.value)}
              rows={3}
              className={`
                w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
                ${errors.venueAddress ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="Enter the full venue address, including any special instructions for accessing the location"
            />
            {errors.venueAddress && (
              <p className="text-red-600 text-sm mt-1">{errors.venueAddress}</p>
            )}
          </div>

          {/* Special Requirements */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              Any special requirements or requests? (Optional)
            </label>
            <textarea
              value={formData.specialRequirements}
              onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell us about any specific dietary restrictions, accessibility needs, theme preferences, or other special requests..."
            />
            <p className="text-gray-500 text-xs mt-1">
              The more details you provide, the better we can customize our service
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            {onCancel ? (
              <button
                onClick={onCancel}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <XMarkIcon className="w-4 h-4 mr-2" />
                Cancel
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Continue
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Don&apos;t worry, you can always make changes to these details later
          </p>
        </div>
      </div>
    </div>
  )
}