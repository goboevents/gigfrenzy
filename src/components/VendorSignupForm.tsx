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
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div 
        className="min-h-[400px] flex items-center justify-center p-8 rounded-lg"
        style={{ backgroundColor, color: textColor }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-4">Application Submitted!</h2>
          <p className="text-lg mb-6">{successMessage}</p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-6 py-3 rounded-lg font-semibold transition-colors"
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
      className="min-h-[400px] p-8 rounded-lg"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg opacity-80">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formFields.businessName && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Business Name *
              </label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your business name"
              />
            </div>
          )}

          {formFields.contactName && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                required
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter contact person's name"
              />
            </div>
          )}

          {formFields.email && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>
          )}

          {formFields.phone && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>
          )}

          {formFields.businessType && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Business Type *
              </label>
              <select
                required
                value={formData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <div>
              <label className="block text-sm font-medium mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourwebsite.com"
              />
            </div>
          )}

          {formFields.description && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Business Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about your business and services..."
              />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: buttonColor }}
          >
            {isSubmitting ? 'Submitting...' : submitButtonText}
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
