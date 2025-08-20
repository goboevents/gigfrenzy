'use client'

import { Builder } from '@builder.io/react'
import { useState } from 'react'

interface VendorSignupFormProps {
  title?: string
  subtitle?: string
  submitButtonText?: string
  successMessage?: string
  formFields?: {
    businessName: boolean
    contactName: boolean
    email: boolean
    phone: boolean
    businessType: boolean
    website: boolean
    description: boolean
  }
  businessTypeOptions?: string[]
  backgroundColor?: string
  textColor?: string
  buttonColor?: string
}

export default function VendorSignupForm({
  title = 'Become a Vendor',
  subtitle = 'Join our platform and start offering your services',
  submitButtonText = 'Submit Application',
  successMessage = 'Thank you! Your application has been submitted successfully.',
  formFields = {
    businessName: true,
    contactName: true,
    email: true,
    phone: true,
    businessType: true,
    website: false,
    description: false
  },
  businessTypeOptions = [
    'Catering',
    'Photography',
    'Music & Entertainment',
    'Decoration & Flowers',
    'Transportation',
    'Venue',
    'Other'
  ],
  backgroundColor = '#ffffff',
  textColor = '#1f2937',
  buttonColor = '#3b82f6'
}: VendorSignupFormProps) {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    website: '',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({
          businessName: '',
          contactName: '',
          email: '',
          phone: '',
          businessType: '',
          website: '',
          description: ''
        })
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div 
        className="min-h-[400px] flex items-center justify-center p-8 rounded-2xl shadow-lg"
        style={{ backgroundColor, color: textColor }}
      >
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce">✅</div>
          <h2 className="text-3xl font-bold mb-4 text-green-600">Application Submitted!</h2>
          <p className="text-lg mb-8 opacity-80">{successMessage}</p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
            style={{ backgroundColor: buttonColor, color: '#ffffff' }}
          >
            Submit Another Application
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-[400px] p-8 rounded-2xl shadow-lg border border-gray-100"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-xl opacity-80 leading-relaxed">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formFields.businessName && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Business Name *
              </label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="Enter your business name"
              />
            </div>
          )}

          {formFields.contactName && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Contact Person *
              </label>
              <input
                type="text"
                required
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="Enter contact person's name"
              />
            </div>
          )}

          {formFields.email && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="Enter your email address"
              />
            </div>
          )}

          {formFields.phone && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="Enter your phone number"
              />
            </div>
          )}

          {formFields.businessType && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Business Type *
              </label>
              <select
                required
                value={formData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
              >
                <option value="">Select business type</option>
                {businessTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formFields.website && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="https://yourwebsite.com"
              />
            </div>
          )}

          {formFields.description && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Business Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none"
                placeholder="Tell us about your business and services..."
              />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-1 disabled:transform-none"
            style={{ backgroundColor: buttonColor }}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              submitButtonText
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

// Register the component with Builder.io
Builder.registerComponent(VendorSignupForm, {
  name: 'Vendor Signup Form',
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'Become a Vendor'
    },
    {
      name: 'subtitle',
      type: 'string',
      defaultValue: 'Join our platform and start offering your services'
    },
    {
      name: 'submitButtonText',
      type: 'string',
      defaultValue: 'Submit Application'
    },
    {
      name: 'successMessage',
      type: 'string',
      defaultValue: 'Thank you! Your application has been submitted successfully.'
    },
    {
      name: 'backgroundColor',
      type: 'color',
      defaultValue: '#ffffff'
    },
    {
      name: 'textColor',
      type: 'color',
      defaultValue: '#1f2937'
    },
    {
      name: 'buttonColor',
      type: 'color',
      defaultValue: '#3b82f6'
    },
    {
      name: 'formFields',
      type: 'object',
      defaultValue: {
        businessName: true,
        contactName: true,
        email: true,
        phone: true,
        businessType: true,
        website: false,
        description: false
      },
      subFields: [
        { name: 'businessName', type: 'boolean' },
        { name: 'contactName', type: 'boolean' },
        { name: 'email', type: 'boolean' },
        { name: 'phone', type: 'boolean' },
        { name: 'businessType', type: 'boolean' },
        { name: 'website', type: 'boolean' },
        { name: 'description', type: 'boolean' }
      ]
    },
    {
      name: 'businessTypeOptions',
      type: 'list',
      defaultValue: [
        'Catering',
        'Photography',
        'Music & Entertainment',
        'Decoration & Flowers',
        'Transportation',
        'Venue',
        'Other'
      ],
      subFields: [
        { name: 'value', type: 'string' }
      ]
    }
  ],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/forms.png',
  defaultStyles: {
    padding: '20px',
    margin: '20px 0'
  }
})
