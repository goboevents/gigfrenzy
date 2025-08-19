'use client'

import { useState } from 'react'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import type { BookingData } from './index'

interface CustomerInfoStepProps {
  data: Partial<BookingData>
  onUpdate: (data: Partial<BookingData>) => void
  onNext: () => void
  onPrevious: () => void
}

export default function CustomerInfoStep({
  data,
  onUpdate,
  onNext,
  onPrevious
}: CustomerInfoStepProps) {
  const [formData, setFormData] = useState({
    customerName: data.customerName || '',
    customerEmail: data.customerEmail || '',
    customerPhone: data.customerPhone || '',
    agreeToTerms: false,
    allowMarketing: false,
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

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Please enter your full name'
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters'
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Please enter your email address'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address'
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Please enter your phone number'
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.customerPhone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.customerPhone = 'Please enter a valid phone number'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onUpdate({
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: formData.customerPhone.trim(),
      })
      onNext()
    }
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '')
    
    // Format as (XXX) XXX-XXXX for US numbers
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    handleInputChange('customerPhone', formatted)
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your contact information
          </h1>
          <p className="text-gray-600">
            We&apos;ll use this information to confirm your booking and send you updates
          </p>
        </div>

        {/* Event Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="text-sm text-blue-800">
            <strong>Event Summary:</strong> {data.eventType} • {' '}
            {data.eventDate && new Date(data.eventDate).toLocaleDateString()} at {data.eventTime} • {' '}
            {data.guestCount} guests
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {/* Full Name */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="w-4 h-4 mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.customerName ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="Enter your full name"
            />
            {errors.customerName && (
              <p className="text-red-600 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <EnvelopeIcon className="w-4 h-4 mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.customerEmail ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="your.email@example.com"
            />
            {errors.customerEmail && (
              <p className="text-red-600 text-sm mt-1">{errors.customerEmail}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              We&apos;ll send your booking confirmation to this email
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <PhoneIcon className="w-4 h-4 mr-2" />
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={handlePhoneChange}
              className={`
                w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.customerPhone ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="(555) 123-4567"
            />
            {errors.customerPhone && (
              <p className="text-red-600 text-sm mt-1">{errors.customerPhone}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              For important updates about your event
            </p>
          </div>

          {/* Terms and Conditions */}
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                    Privacy Policy
                  </a>
                  *
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-600 text-sm ml-7">{errors.agreeToTerms}</p>
              )}

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="allowMarketing"
                  checked={formData.allowMarketing}
                  onChange={(e) => handleInputChange('allowMarketing', e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="allowMarketing" className="ml-3 text-sm text-gray-700">
                  I&apos;d like to receive emails about special offers and promotions (optional)
                </label>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <InformationCircleIcon className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Your information is secure</p>
                <p>
                  We use industry-standard encryption to protect your personal information.
                  Your data will only be shared with the vendor to fulfill your booking.
                </p>
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
            className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Almost done! Next, you&apos;ll review your booking details before confirming
          </p>
        </div>
      </div>
    </div>
  )
}