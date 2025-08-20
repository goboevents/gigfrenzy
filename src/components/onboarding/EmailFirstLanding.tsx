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
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8"
        style={{ backgroundColor, color: textColor }}
      >
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-green-600">Check Your Email!</h2>
          <p className="text-xl mb-6 opacity-80">{successMessage}</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <p className="text-sm text-blue-800">
              We've sent a verification link to <strong className="font-semibold">{email}</strong>
            </p>
          </div>
          
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Click the link in your email to verify your account and continue with the setup.
          </p>
          
          <button
            onClick={() => window.location.href = '/vendor-onboarding'}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Continue to Setup
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-lg mx-auto w-full">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-xl opacity-80 leading-relaxed">{subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
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
                  className={`w-full pl-10 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    error ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder={emailPlaceholder}
                  autoComplete="email"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
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
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline font-medium">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-xl font-semibold text-center mb-6 text-gray-800">Why Choose Our Platform?</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Get booked for events in your area</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Manage bookings and payments easily</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Grow your business with our tools</span>
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