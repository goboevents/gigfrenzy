'use client'

import { CurrencyDollarIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface PriceCalculatorProps {
  basePrice: number
  depositPercentage: number
  depositRequired: boolean
  guestCount?: number
  pricingModel: 'fixed' | 'hourly' | 'package'
  hourlyRate?: number
  duration?: number // hours for hourly pricing
  additionalFees?: Array<{
    name: string
    amount: number
    type: 'fixed' | 'percentage'
  }>
  discounts?: Array<{
    name: string
    amount: number
    type: 'fixed' | 'percentage'
  }>
}

export default function PriceCalculator({
  basePrice,
  depositPercentage,
  depositRequired,
  guestCount,
  pricingModel,
  hourlyRate,
  duration = 4,
  additionalFees = [],
  discounts = []
}: PriceCalculatorProps) {
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  // Calculate base amount
  const getBaseAmount = () => {
    if (pricingModel === 'hourly' && hourlyRate) {
      return hourlyRate * duration
    }
    return basePrice
  }

  const baseAmount = getBaseAmount()

  // Calculate additional fees
  const totalAdditionalFees = additionalFees.reduce((total, fee) => {
    if (fee.type === 'percentage') {
      return total + (baseAmount * fee.amount / 100)
    }
    return total + fee.amount
  }, 0)

  // Calculate discounts
  const totalDiscounts = discounts.reduce((total, discount) => {
    if (discount.type === 'percentage') {
      return total + (baseAmount * discount.amount / 100)
    }
    return total + discount.amount
  }, 0)

  // Calculate totals
  const subtotal = baseAmount + totalAdditionalFees - totalDiscounts
  const depositAmount = depositRequired ? Math.round(subtotal * depositPercentage / 100) : 0
  const remainingAmount = subtotal - depositAmount

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center">
        <CurrencyDollarIcon className="w-5 h-5 text-gray-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Price Breakdown</h3>
      </div>

      <div className="space-y-3">
        {/* Base Price */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            {pricingModel === 'hourly' 
              ? `Base rate (${duration} hours @ ${formatPrice(hourlyRate || 0)}/hr)`
              : 'Base price'
            }
          </span>
          <span className="font-medium">{formatPrice(baseAmount)}</span>
        </div>

        {/* Guest Count Info */}
        {guestCount && (
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>For {guestCount} guests</span>
          </div>
        )}

        {/* Additional Fees */}
        {additionalFees.map((fee, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-600">{fee.name}</span>
            <span className="font-medium">
              {fee.type === 'percentage' 
                ? `+${formatPrice(baseAmount * fee.amount / 100)}`
                : `+${formatPrice(fee.amount)}`
              }
            </span>
          </div>
        ))}

        {/* Discounts */}
        {discounts.map((discount, index) => (
          <div key={index} className="flex justify-between items-center text-green-600">
            <span>{discount.name}</span>
            <span className="font-medium">
              {discount.type === 'percentage' 
                ? `-${formatPrice(baseAmount * discount.amount / 100)}`
                : `-${formatPrice(discount.amount)}`
              }
            </span>
          </div>
        ))}

        {/* Subtotal */}
        <div className="border-t border-gray-300 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(subtotal)}
            </span>
          </div>
        </div>

        {/* Deposit Information */}
        {depositRequired && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
            <div className="flex items-start">
              <InformationCircleIcon className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-800 font-medium">Deposit Required</p>
                <p className="text-blue-700 mt-1">
                  A {depositPercentage}% deposit is required to secure your booking.
                </p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Due now (deposit):</span>
                <span className="font-semibold text-blue-900">
                  {formatPrice(depositAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Due later:</span>
                <span className="font-semibold text-blue-900">
                  {formatPrice(remainingAmount)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Schedule */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Prices include all applicable taxes</p>
          <p>• Final payment due 24 hours before event</p>
          <p>• Cancellation policy applies</p>
        </div>
      </div>
    </div>
  )
}