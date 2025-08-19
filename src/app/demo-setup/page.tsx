'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  TrashIcon, 
  EyeIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface DemoVendorData {
  vendor: any
  profile: any
  services: any[]
  serviceAreas: any[]
  availability: any
}

export default function DemoSetupPage() {
  const [demoData, setDemoData] = useState<DemoVendorData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    checkDemoStatus()
  }, [])

  const checkDemoStatus = async () => {
    try {
      const response = await fetch('/api/demo/setup')
      if (response.ok) {
        const data = await response.json()
        setDemoData(data.data)
      }
    } catch (error) {
      console.error('Error checking demo status:', error)
    }
  }

  const createDemoVendor = async () => {
    setIsLoading(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/demo/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'create' }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessage({ type: 'success', text: data.message })
        await checkDemoStatus()
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to create demo vendor' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const clearDemoData = async () => {
    if (!confirm('Are you sure you want to clear all demo data? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/demo/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'clear' }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessage({ type: 'success', text: data.message })
        setDemoData(null)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to clear demo data' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshDemoStatus = async () => {
    await checkDemoStatus()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Demo Vendor Setup</h1>
          <p className="text-lg text-gray-600">
            Set up a demo vendor account with comprehensive data for testing the application
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Demo Vendor Status</h2>
            <button
              onClick={refreshDemoStatus}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh status"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            {demoData ? (
              <>
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                <span className="text-green-700 font-medium">Demo vendor exists</span>
              </>
            ) : (
              <>
                <XCircleIcon className="h-6 w-6 text-gray-400" />
                <span className="text-gray-600">No demo vendor found</span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={createDemoVendor}
              disabled={isLoading || !!demoData}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              {isLoading ? 'Creating...' : 'Create Demo Vendor'}
            </button>

            <button
              onClick={clearDemoData}
              disabled={isLoading || !demoData}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {isLoading ? 'Clearing...' : 'Clear Demo Data'}
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`rounded-lg p-4 mb-6 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Demo Vendor Details */}
        {demoData && (
          <div className="space-y-6">
            {/* Vendor Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Vendor Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <p className="text-gray-900">{demoData.vendor.businessName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                  <p className="text-gray-900">{demoData.vendor.contactName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{demoData.vendor.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{demoData.vendor.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Type</label>
                  <p className="text-gray-900">{demoData.vendor.businessType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <a href={demoData.vendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    {demoData.vendor.website}
                  </a>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Display Name</label>
                  <p className="text-gray-900">{demoData.profile.displayName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Headline</label>
                  <p className="text-gray-900">{demoData.profile.headline}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <p className="text-gray-900">{demoData.profile.bio}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-gray-900">{demoData.profile.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Slug</label>
                  <p className="text-gray-900 font-mono">{demoData.profile.slug}</p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Services & Packages</h2>
              <div className="space-y-4">
                {demoData.services.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{service.title}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {service.type}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Price:</span>
                        <p className="text-gray-900">${(service.priceCents / 100).toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <p className="text-gray-900">{service.duration}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Features:</span>
                        <p className="text-gray-900">{service.features ? JSON.parse(service.features).length : 0}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Popular:</span>
                        <p className="text-gray-900">{service.isPopular ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Areas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Areas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {demoData.serviceAreas.map((area, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">{area.city}, {area.state}</h3>
                    <p className="text-sm text-gray-600">ZIP: {area.zipCode}</p>
                    <p className="text-sm text-gray-600">Radius: {area.radius} miles</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Hours</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hours</label>
                  <p className="text-gray-900">{demoData.availability.startTime} - {demoData.availability.endTime}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Days Open</label>
                  <p className="text-gray-900">Monday - Sunday</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Quick Links</h2>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`/vendor/${demoData.profile.slug}`}
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View Public Profile
                </a>
                <a
                  href="/vendor-dashboard"
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  View Dashboard
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}