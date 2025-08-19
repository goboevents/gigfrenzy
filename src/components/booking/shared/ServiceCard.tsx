'use client'

import { CheckIcon, StarIcon } from '@heroicons/react/24/solid'
import { ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

interface ServiceCardProps {
  service: {
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
  }
  isSelected: boolean
  onSelect: (serviceId: number) => void
}

export default function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const getPriceDisplay = () => {
    if (service.pricingModel === 'hourly') {
      return `${formatPrice(service.hourlyRate || 0)}/hr`
    }
    return formatPrice(service.priceCents)
  }

  return (
    <div
      className={`
        relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg
        ${isSelected 
          ? 'border-blue-600 bg-blue-50 shadow-md' 
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
      onClick={() => onSelect(service.id)}
    >
      {/* Popular Badge */}
      {service.isPopular && (
        <div className="absolute -top-3 left-6">
          <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <StarIcon className="w-3 h-3 mr-1" />
            Most Popular
          </div>
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className="bg-blue-600 text-white rounded-full p-1">
            <CheckIcon className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Service Type Badge */}
      <div className="mb-3">
        <span className={`
          inline-block px-2 py-1 rounded-full text-xs font-medium
          ${service.type === 'package' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-green-100 text-green-800'
          }
        `}>
          {service.type === 'package' ? 'Package' : 'Service'}
        </span>
      </div>

      {/* Title and Description */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {service.title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {service.description}
      </p>

      {/* Pricing */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-gray-600">
          <CurrencyDollarIcon className="w-4 h-4 mr-1" />
          <span className="text-2xl font-bold text-gray-900">
            {getPriceDisplay()}
          </span>
          {service.pricingModel === 'fixed' && (
            <span className="text-sm ml-1">per event</span>
          )}
        </div>
        
        <div className="flex items-center text-gray-500 text-sm">
          <ClockIcon className="w-4 h-4 mr-1" />
          {service.duration}
        </div>
      </div>

      {/* Features */}
      {service.features.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            What&apos;s included:
          </h4>
          <ul className="space-y-1">
            {service.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <CheckIcon className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
            {service.features.length > 3 && (
              <li className="text-sm text-gray-500">
                +{service.features.length - 3} more features
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Deposit Info */}
      {service.depositRequired && (
        <div className="border-t border-gray-200 pt-3">
          <p className="text-xs text-gray-500">
            Requires {service.depositPercentage}% deposit to book
          </p>
        </div>
      )}
    </div>
  )
}