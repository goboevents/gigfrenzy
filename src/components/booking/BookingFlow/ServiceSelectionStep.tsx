'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import ServiceCard from '../shared/ServiceCard'
import PriceCalculator from '../shared/PriceCalculator'
import type { BookingData } from './index'

interface Service {
  id: number
  title: string
  description: string
  priceCents: number
  type: 'service' | 'package'
  duration: string
  features: string[]
  isPopular: boolean
  pricingModel: 'fixed' | 'hourly' | 'package'
  hourlyRate?: number
  depositRequired: boolean
  depositPercentage: number
  cancellationPolicy: string
}

interface ServiceSelectionStepProps {
  vendorSlug: string
  vendorData?: any
  data: Partial<BookingData>
  onUpdate: (data: Partial<BookingData>) => void
  onNext: () => void
  onPrevious: () => void
}

export default function ServiceSelectionStep({
  vendorSlug,
  vendorData,
  data,
  onUpdate,
  onNext,
  onPrevious
}: ServiceSelectionStepProps) {
  const [services, setServices] = useState<Service[]>([])
  const [packages, setPackages] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    data.serviceId || data.packageId || null
  )
  const [activeTab, setActiveTab] = useState<'services' | 'packages'>('packages')
  const [searchTerm, setSearchTerm] = useState('')

  const loadBookingOptions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/vendor/public/${vendorSlug}?type=booking-options`)
      if (!response.ok) {
        throw new Error('Failed to load booking options')
      }
      
      const result = await response.json()
      setServices(result.services || [])
      setPackages(result.packages || [])
    } catch (err) {
      setError('Failed to load services and packages')
      console.error('Error loading booking options:', err)
    } finally {
      setLoading(false)
    }
  }, [vendorSlug])

  useEffect(() => {
    if (!vendorData) {
      loadBookingOptions()
    } else {
      setServices(vendorData.services || [])
      setPackages(vendorData.packages || [])
    }
  }, [vendorSlug, vendorData, loadBookingOptions])

  const getCurrentItems = () => {
    const items = activeTab === 'services' ? services : packages
    if (!searchTerm) return items
    
    return items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const getSelectedService = () => {
    if (!selectedServiceId) return null
    
    const allItems = [...services, ...packages]
    return allItems.find(item => item.id === selectedServiceId) || null
  }

  const handleServiceSelect = (serviceId: number) => {
    setSelectedServiceId(serviceId)
    
    const selectedService = getSelectedService()
    if (selectedService) {
      const isPackage = selectedService.type === 'package'
      const depositAmount = selectedService.depositRequired 
        ? Math.round(selectedService.priceCents * selectedService.depositPercentage / 100)
        : 0

      onUpdate({
        serviceId: isPackage ? undefined : serviceId,
        packageId: isPackage ? serviceId : undefined,
        selectedService,
        totalPriceCents: selectedService.priceCents,
        depositAmountCents: depositAmount,
      })
    }
  }

  const handleNext = () => {
    if (selectedServiceId) {
      onNext()
    }
  }

  const selectedService = getSelectedService()
  const currentItems = getCurrentItems()

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading services and packages...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadBookingOptions}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose your service
          </h1>
          <p className="text-gray-600">
            Select the perfect service or package for your {data.eventType} event
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services/Packages Selection */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
              <button
                onClick={() => setActiveTab('services')}
                className={`
                  flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
                  ${activeTab === 'services'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                Individual Services ({services.length})
              </button>
              <button
                onClick={() => setActiveTab('packages')}
                className={`
                  flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
                  ${activeTab === 'packages'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                Package Deals ({packages.length})
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services and packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Services/Packages Grid */}
            <div className="space-y-4">
              {currentItems.length > 0 ? (
                currentItems.map(item => (
                  <ServiceCard
                    key={item.id}
                    service={item}
                    isSelected={selectedServiceId === item.id}
                    onSelect={handleServiceSelect}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    {searchTerm 
                      ? `No ${activeTab} found matching "${searchTerm}"`
                      : `No ${activeTab} available`
                    }
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-blue-600 hover:text-blue-700 mt-2"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Price Calculator */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {selectedService ? (
                <PriceCalculator
                  basePrice={selectedService.priceCents}
                  depositPercentage={selectedService.depositPercentage}
                  depositRequired={selectedService.depositRequired}
                  guestCount={data.guestCount}
                  pricingModel={selectedService.pricingModel}
                  hourlyRate={selectedService.hourlyRate}
                />
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-gray-500 mb-2">Select a service to see pricing</p>
                  <p className="text-sm text-gray-400">
                    Choose from the {activeTab} on the left to get started
                  </p>
                </div>
              )}
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
            disabled={!selectedServiceId}
            className={`
              flex items-center px-6 py-3 rounded-lg font-medium transition-colors
              ${selectedServiceId
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Continue
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Help Text */}
        {!selectedServiceId && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Please select a service or package to continue
            </p>
          </div>
        )}
      </div>
    </div>
  )
}