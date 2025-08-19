'use client'

import { Builder } from '@builder.io/react'
import { useState } from 'react'
import { EnvelopeIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

interface EmailFirstLandingProps {
  title?: string
  subtitle?: string
  emailPlaceholder?: string
  submitButtonText?: string
  successMessage?: string
  backgroundColor?: string
  textColor?: string
  accentColor?: string
  onEmailSubmit?: (email: string) => void
}

export default function EmailFirstLanding({
  title = 'Start Getting Gigs Today',
  subtitle = 'Join thousands of vendors who are already booking events and growing their business',
  emailPlaceholder = 'Enter your email address',
  submitButtonText = 'Get Gigs',
  successMessage = 'Check your email for verification!',
  backgroundColor = '#ffffff',
  textColor = '#1f2937',
  accentColor = '#3b82f6',
  onEmailSubmit
}: EmailFirstLandingProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call for account creation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you would:
      // 1. Create the account with just the email
      // 2. Send verification email
      // 3. Store the email in session/localStorage for next step
      
      console.log('Creating account with email:', email)
      
      // Store email for next step
      if (typeof window !== 'undefined') {
        localStorage.setItem('vendor_signup_email', email)
      }
      
      setIsSubmitted(true)
      
      // Call the callback if provided
      if (onEmailSubmit) {
        onEmailSubmit(email)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-8"
        style={{ backgroundColor, color: textColor }}
      >
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Check Your Email!</h2>
          <p className="text-lg mb-6">{successMessage}</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              We've sent a verification link to <strong>{email}</strong>
            </p>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">
            Click the link in your email to verify your account and continue with the setup.
          </p>
          
          <button
            onClick={() => window.location.href = '/vendor-onboarding'}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Continue to Setup
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-lg opacity-80">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError(null)
                }}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={emailPlaceholder}
                autoComplete="email"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            style={{ backgroundColor: accentColor }}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>{submitButtonText}</span>
                <ArrowRightIcon className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 space-y-4">
          <h3 className="text-lg font-semibold text-center mb-4">Why Choose Our Platform?</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">Get booked for events in your area</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">Manage bookings and payments easily</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">Grow your business with our tools</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Register the component with Builder.io
Builder.registerComponent(EmailFirstLanding, {
  name: 'Email First Landing',
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'Start Getting Gigs Today'
    },
    {
      name: 'subtitle',
      type: 'string',
      defaultValue: 'Join thousands of vendors who are already booking events and growing their business'
    },
    {
      name: 'emailPlaceholder',
      type: 'string',
      defaultValue: 'Enter your email address'
    },
    {
      name: 'submitButtonText',
      type: 'string',
      defaultValue: 'Get Gigs'
    },
    {
      name: 'successMessage',
      type: 'string',
      defaultValue: 'Check your email for verification!'
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
      name: 'accentColor',
      type: 'color',
      defaultValue: '#3b82f6'
    }
  ],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/mail.png',
  defaultStyles: {
    padding: '20px',
    margin: '20px 0'
  }
})