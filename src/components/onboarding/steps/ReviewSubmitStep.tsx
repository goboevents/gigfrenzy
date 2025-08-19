'use client'

import { Builder } from '@builder.io/react'
import { useState } from 'react'

interface ReviewSubmitStepProps {
  stepData?: any
  onComplete: (data: any) => void
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
  allData: any
}

export default function ReviewSubmitStep({
  stepData = {},
  onComplete,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  allData
}: ReviewSubmitStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would send the data to your API
      console.log('Submitting vendor application:', allData)
      
      setIsSubmitted(true)
      onComplete({ submitted: true, timestamp: new Date().toISOString() })
    } catch (err) {
      setError('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderSection = (title: string, data: any, icon: string) => {
    if (!data || Object.keys(data).length === 0) return null

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => {
            if (value === null || value === undefined || value === '') return null
            
            let displayValue = value
            if (typeof value === 'boolean') {
              displayValue = value ? 'Yes' : 'No'
            } else if (Array.isArray(value)) {
              if (value.length === 0) return null
              displayValue = value.join(', ')
            } else if (typeof value === 'object') {
              // Handle nested objects like availability
              if (key === 'availability') {
                const availableDays = Object.entries(value as any)
                  .filter(([_, schedule]: [string, any]) => schedule.available)
                  .map(([day, _]) => day.charAt(0).toUpperCase() + day.slice(1))
                displayValue = availableDays.length > 0 ? availableDays.join(', ') : 'None'
              } else {
                return null // Skip complex nested objects for now
              }
            }

            return (
              <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <span className="text-gray-900">{displayValue}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
        <p className="text-lg text-gray-600 mb-6">
          Thank you for submitting your vendor application. Our team will review your information and get back to you within 2-3 business days.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
          <div className="text-left space-y-2 text-sm text-blue-800">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>We'll review your application and documents</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>You may receive a call for additional verification</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Upon approval, you'll receive access to your vendor dashboard</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>You can then start receiving and managing bookings</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Return to Homepage
          </button>
          <button
            onClick={() => window.location.href = '/vendor-dashboard'}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
          >
            Go to Vendor Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Review & Submit</h2>
        <p className="text-gray-600">Review your information before submitting your application</p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Account Information */}
        {renderSection('Account Information', allData.accountSetup, '👤')}
        
        {/* Business Profile */}
        {renderSection('Business Profile', allData.businessProfile, '🏢')}
        
        {/* Service Categories */}
        {renderSection('Service Categories', allData.serviceCategories, '🎯')}
        
        {/* Location & Availability */}
        {renderSection('Location & Availability', allData.locationAvailability, '📍')}
        
        {/* Documentation */}
        {renderSection('Documentation', allData.documentation, '📄')}
        
        {/* Pricing & Packages */}
        {renderSection('Pricing & Packages', allData.pricingPackages, '💰')}
      </div>

      {/* Terms and Conditions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Terms and Conditions</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </label>
          </div>
          
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="accurate"
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
            />
            <label htmlFor="accurate" className="text-sm text-gray-700">
              I certify that all information provided is accurate and complete to the best of my knowledge
            </label>
          </div>
          
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="updates"
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
            />
            <label htmlFor="updates" className="text-sm text-gray-700">
              I agree to keep my information updated and notify of any changes
            </label>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onPrevious}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
        >
          Back to Previous Step
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Submitting...</span>
            </div>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>

      {/* Final Note */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          By submitting this application, you agree to our review process and verification requirements.
        </p>
      </div>
    </div>
  )
}

// Register the component with Builder.io
Builder.registerComponent(ReviewSubmitStep, {
  name: 'Review & Submit Step',
  inputs: [],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/clipboard-check.png',
  defaultStyles: {
    padding: '20px',
    margin: '20px 0'
  }
})