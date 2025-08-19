'use client'

import { Builder } from '@builder.io/react'
import { useState } from 'react'

interface BusinessProfileStepProps {
  stepData?: any
  onComplete: (data: any) => void
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
  allData: any
}

export default function BusinessProfileStep({
  stepData = {},
  onComplete,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  allData
}: BusinessProfileStepProps) {
  const [formData, setFormData] = useState({
    businessType: stepData.businessType || '',
    description: stepData.description || '',
    foundedYear: stepData.foundedYear || '',
    employeeCount: stepData.employeeCount || '',
    businessLicense: stepData.businessLicense || '',
    taxId: stepData.taxId || ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const businessTypes = [
    'Catering & Food Services',
    'Photography & Videography',
    'Music & Entertainment',
    'Decoration & Flowers',
    'Transportation & Limousine',
    'Venue & Event Space',
    'Wedding Planning & Coordination',
    'Beauty & Hair Services',
    'DJ & Audio Services',
    'Lighting & Sound',
    'Other'
  ]

  const employeeCounts = [
    '1 (Sole Proprietor)',
    '2-5',
    '6-10',
    '11-25',
    '26-50',
    '50+'
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.businessType) {
      newErrors.businessType = 'Business type is required'
    }

    if (!formData.description) {
      newErrors.description = 'Business description is required'
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters long'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onComplete(formData)
      onNext()
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Business Profile</h2>
        <p className="text-gray-600">Tell us about your business</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Type *
          </label>
          <select
            value={formData.businessType}
            onChange={(e) => handleInputChange('businessType', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.businessType ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select business type</option>
            {businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.businessType && (
            <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Describe your business, services, and what makes you unique..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
          <p className="text-gray-500 text-sm mt-1">
            {formData.description.length}/500 characters
          </p>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year Founded
            </label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.foundedYear}
              onChange={(e) => handleInputChange('foundedYear', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 2020"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Employees
            </label>
            <select
              value={formData.employeeCount}
              onChange={(e) => handleInputChange('employeeCount', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select employee count</option>
              {employeeCounts.map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business License Number
            </label>
            <input
              type="text"
              value={formData.businessLicense}
              onChange={(e) => handleInputChange('businessLicense', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter license number if applicable"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax ID / EIN
            </label>
            <input
              type="text"
              value={formData.taxId}
              onChange={(e) => handleInputChange('taxId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter Tax ID if applicable"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Continue to Services
          </button>
        </div>
      </form>
    </div>
  )
}

// Register the component with Builder.io
Builder.registerComponent(BusinessProfileStep, {
  name: 'Business Profile Step',
  inputs: [],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/building-store.png',
  defaultStyles: {
    padding: '20px',
    margin: '20px 0'
  }
})