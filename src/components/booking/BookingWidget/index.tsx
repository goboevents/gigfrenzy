'use client'

import { useState, useEffect } from 'react'
import { 
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChevronRightIcon,
  StarIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface BookingWidgetProps {
  vendorSlug: string
  variant?: 'compact' | 'full' | 'inline'
  showPricing?: boolean
  showAvailability?: boolean
  className?: string
}

interface Service {
  id: number
  title: string
  priceCents: number
  isPopular: boolean
  pricingModel: string
}

export default function BookingWidget({
  vendorSlug,
  variant = 'compact',
  showPricing = true,
  showAvailability = false,
  className = ''
}: BookingWidgetProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [nextAvailableDate, setNextAvailableDate] = useState<string | null>(null)

  useEffect(() => {
    if (showPricing || showAvailability) {
      loadBookingData()
    }
  }, [vendorSlug, showPricing, showAvailability])

  const loadBookingData = async () => {
    try {
      setLoading(true)
      
      // Load services and pricing
      const response = await fetch(`/api/vendor/public/${vendorSlug}/booking-options`)
      if (response.ok) {
        const data = await response.json()
        setServices([...data.services, ...data.packages])
      }

      // Load next available date if requested
      if (showAvailability) {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        
        for (let i = 0; i < 14; i++) {
          const checkDate = new Date(tomorrow)
          checkDate.setDate(checkDate.getDate() + i)
          const dateStr = checkDate.toISOString().split('T')[0]
          
          const availResponse = await fetch(
            `/api/vendor/public/${vendorSlug}/availability?date=${dateStr}`
          )
          
          if (availResponse.ok) {
            const availData = await availResponse.json()
            if (availData.availability?.available) {
              setNextAvailableDate(dateStr)
              break
            }
          }
        }
      }
    } catch (err) {
      console.error('Error loading booking data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStartingPrice = () => {
    if (services.length === 0) return null
    const minPrice = Math.min(...services.map(s => s.priceCents))
    return `$${(minPrice / 100).toFixed(0)}`
  }

  const getMostPopularService = () => {
    return services.find(s => s.isPopular) || services[0]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
        <div className="space-y-3">
          {/* Quick Info */}
          <div className="flex items-center justify-between">
            <div>
              {showPricing && getStartingPrice() && (
                <div className="flex items-center text-sm text-gray-600">
                  <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                  Starting at <span className="font-semibold ml-1">{getStartingPrice()}</span>
                </div>
              )}
              
              {showAvailability && nextAvailableDate && (
                <div className="flex items-center text-sm text-green-600">
                  <CalendarDaysIcon className="w-4 h-4 mr-1" />
                  Next available: {formatDate(nextAvailableDate)}
                </div>
              )}
            </div>
            
            <div className="flex items-center text-yellow-500">
              <StarIcon className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium ml-1">4.9</span>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href={`/booking/${vendorSlug}`}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center flex items-center justify-center"
          >
            Book Now
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </Link>

          {/* Quick Action */}
          <button className="w-full text-gray-600 py-1 text-sm hover:text-gray-800 transition-colors">
            Get Quick Quote
          </button>
        </div>
      </div>
    )
  }

  if (variant === 'full') {
    const popularService = getMostPopularService()
    
    return (
      <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 ${className}`}>
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to book?
            </h3>
            <p className="text-gray-600 text-sm">
              Get started with your event planning today
            </p>
          </div>

          {/* Popular Service Highlight */}
          {popularService && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Most Popular
                </span>
                <span className="text-lg font-bold text-blue-900">
                  ${(popularService.priceCents / 100).toFixed(0)}
                </span>
              </div>
              <h4 className="font-medium text-blue-900">{popularService.title}</h4>
            </div>
          )}

          {/* Pricing Range */}
          {showPricing && services.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Price range:</span>
              <span className="font-medium">
                ${Math.min(...services.map(s => s.priceCents / 100)).toFixed(0)} - 
                ${Math.max(...services.map(s => s.priceCents / 100)).toFixed(0)}
              </span>
            </div>
          )}

          {/* Availability */}
          {showAvailability && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Next available:</span>
              <span className="font-medium text-green-600">
                {nextAvailableDate ? formatDate(nextAvailableDate) : 'Loading...'}
              </span>
            </div>
          )}

          {/* Main CTA */}
          <Link
            href={`/booking/${vendorSlug}`}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center flex items-center justify-center"
          >
            Start Booking Process
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </Link>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button className="text-gray-600 py-2 text-sm hover:text-gray-800 transition-colors border border-gray-300 rounded-lg">
              Quick Quote
            </button>
            <button className="text-gray-600 py-2 text-sm hover:text-gray-800 transition-colors border border-gray-300 rounded-lg">
              View Packages
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 pt-2 border-t border-gray-200">
            <div className="flex items-center">
              <StarIcon className="w-3 h-3 text-yellow-500 mr-1" />
              4.9 rating
            </div>
            <div className="flex items-center">
              <UsersIcon className="w-3 h-3 mr-1" />
              150+ events
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-3 h-3 mr-1" />
              Quick response
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Inline variant
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-blue-900 mb-1">Ready to book?</h4>
          <div className="flex items-center space-x-4 text-sm text-blue-700">
            {showPricing && getStartingPrice() && (
              <span>From {getStartingPrice()}</span>
            )}
            {showAvailability && nextAvailableDate && (
              <span>Available {formatDate(nextAvailableDate)}</span>
            )}
          </div>
        </div>
        
        <Link
          href={`/booking/${vendorSlug}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center"
        >
          Book Now
          <ChevronRightIcon className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  )
}