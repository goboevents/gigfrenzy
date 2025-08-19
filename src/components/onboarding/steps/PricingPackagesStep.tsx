'use client'

import { Builder } from '@builder.io/react'
import { useState } from 'react'

interface PricingPackagesStepProps {
  stepData?: any
  onComplete: (data: any) => void
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
  allData: any
}

interface PricingPackage {
  id: string
  name: string
  description: string
  price: number
  currency: string
  duration: string
  features: string[]
  isPopular: boolean
}

export default function PricingPackagesStep({
  stepData = {},
  onComplete,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  allData
}: PricingPackagesStepProps) {
  const [packages, setPackages] = useState<PricingPackage[]>(
    stepData.packages || [
      {
        id: 'basic',
        name: 'Basic Package',
        description: 'Essential services for small events',
        price: 0,
        currency: 'USD',
        duration: 'per event',
        features: ['Basic service coverage', 'Standard equipment', '4-hour minimum'],
        isPopular: false
      },
      {
        id: 'standard',
        name: 'Standard Package',
        description: 'Most popular choice for medium events',
        price: 0,
        currency: 'USD',
        duration: 'per event',
        features: ['Full service coverage', 'Premium equipment', '6-hour minimum', 'Setup & teardown'],
        isPopular: true
      },
      {
        id: 'premium',
        name: 'Premium Package',
        description: 'Comprehensive service for large events',
        price: 0,
        currency: 'USD',
        duration: 'per event',
        features: ['Full service coverage', 'Premium equipment', '8-hour minimum', 'Setup & teardown', 'On-site coordinator'],
        isPopular: false
      }
    ]
  )

  const [pricingModel, setPricingModel] = useState(stepData.pricingModel || 'package')
  const [hourlyRate, setHourlyRate] = useState(stepData.hourlyRate || 0)
  const [depositRequired, setDepositRequired] = useState(stepData.depositRequired || false)
  const [depositPercentage, setDepositPercentage] = useState(stepData.depositPercentage || 25)
  const [cancellationPolicy, setCancellationPolicy] = useState(stepData.cancellationPolicy || '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handlePackageChange = (packageId: string, field: keyof PricingPackage, value: any) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === packageId ? { ...pkg, [field]: value } : pkg
    ))
  }

  const addFeature = (packageId: string) => {
    const newFeature = prompt('Enter feature description:')
    if (newFeature && newFeature.trim()) {
      setPackages(prev => prev.map(pkg => 
        pkg.id === packageId 
          ? { ...pkg, features: [...pkg.features, newFeature.trim()] }
          : pkg
      ))
    }
  }

  const removeFeature = (packageId: string, featureIndex: number) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === packageId 
        ? { ...pkg, features: pkg.features.filter((_, index) => index !== featureIndex) }
        : pkg
    ))
  }

  const togglePopular = (packageId: string) => {
    setPackages(prev => prev.map(pkg => ({
      ...pkg,
      isPopular: pkg.id === packageId
    })))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (pricingModel === 'package') {
      const hasValidPackages = packages.some(pkg => pkg.name && pkg.price > 0)
      if (!hasValidPackages) {
        newErrors.packages = 'Please set up at least one package with a valid price'
      }
    } else if (pricingModel === 'hourly' && hourlyRate <= 0) {
      newErrors.hourlyRate = 'Please enter a valid hourly rate'
    }

    if (depositRequired && (depositPercentage <= 0 || depositPercentage > 100)) {
      newErrors.depositPercentage = 'Please enter a valid deposit percentage (1-100)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Convert to unified format
      const unifiedData = {
        packages: packages.map(pkg => ({
          ...pkg,
          priceCents: Math.round(pkg.price * 100), // Convert to cents for database
          type: 'package' as const
        })),
        pricingModel,
        hourlyRate: pricingModel === 'hourly' ? hourlyRate : 0,
        depositRequired,
        depositPercentage,
        cancellationPolicy
      }

      onComplete(unifiedData)
      onNext()
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Pricing & Packages</h2>
        <p className="text-gray-600">Set up your pricing structure and service packages</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Pricing Model Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Pricing Model</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-blue-300 transition-colors duration-200">
              <input
                type="radio"
                name="pricingModel"
                value="package"
                checked={pricingModel === 'package'}
                onChange={(e) => setPricingModel(e.target.value)}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-900">Package-Based Pricing</div>
                <div className="text-sm text-gray-600">Set fixed prices for different service levels</div>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-blue-300 transition-colors duration-200">
              <input
                type="radio"
                name="pricingModel"
                value="hourly"
                checked={pricingModel === 'hourly'}
                onChange={(e) => setPricingModel(e.target.value)}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-900">Hourly Rate</div>
                <div className="text-sm text-gray-600">Charge by the hour for your services</div>
              </div>
            </label>
          </div>
        </div>

        {/* Hourly Rate Section */}
        {pricingModel === 'hourly' && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Hourly Rate</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate (USD) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                    className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.hourlyRate ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.hourlyRate && (
                  <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Package-Based Pricing Section */}
        {pricingModel === 'package' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Packages</h3>
            <div className="space-y-6">
              {packages.map((pkg, index) => (
                <div key={pkg.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <input
                          type="text"
                          value={pkg.name}
                          onChange={(e) => handlePackageChange(pkg.id, 'name', e.target.value)}
                          className="text-xl font-bold border-none bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                          placeholder="Package Name"
                        />
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={pkg.isPopular}
                            onChange={() => togglePopular(pkg.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">Popular</span>
                        </label>
                      </div>
                      
                      <input
                        type="text"
                        value={pkg.description}
                        onChange={(e) => handlePackageChange(pkg.id, 'description', e.target.value)}
                        className="w-full text-gray-600 border-none bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                        placeholder="Package description"
                      />
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={pkg.price}
                          onChange={(e) => handlePackageChange(pkg.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-24 text-2xl font-bold border-none bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 text-right"
                          placeholder="0.00"
                        />
                      </div>
                      <input
                        type="text"
                        value={pkg.duration}
                        onChange={(e) => handlePackageChange(pkg.id, 'duration', e.target.value)}
                        className="text-sm text-gray-500 border-none bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 text-right"
                        placeholder="per event"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-700">Features</h5>
                      <button
                        type="button"
                        onClick={() => addFeature(pkg.id)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        + Add Feature
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {pkg.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = [...pkg.features]
                              newFeatures[featureIndex] = e.target.value
                              handlePackageChange(pkg.id, 'features', newFeatures)
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Feature description"
                          />
                          <button
                            type="button"
                            onClick={() => removeFeature(pkg.id, featureIndex)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.packages && (
              <p className="text-red-500 text-sm mt-2">{errors.packages}</p>
            )}
          </div>
        )}

        {/* Payment Terms */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Payment Terms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={depositRequired}
                  onChange={(e) => setDepositRequired(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Require deposit to secure booking
                </span>
              </label>
              
              {depositRequired && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deposit Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={depositPercentage}
                      onChange={(e) => setDepositPercentage(parseInt(e.target.value) || 0)}
                      className={`w-full pr-8 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.depositPercentage ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                  {errors.depositPercentage && (
                    <p className="text-red-500 text-sm mt-1">{errors.depositPercentage}</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Policy
              </label>
              <textarea
                value={cancellationPolicy}
                onChange={(e) => setCancellationPolicy(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your cancellation policy..."
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Continue to Review & Submit
          </button>
        </div>
      </form>
    </div>
  )
}

// Register the component with Builder.io
Builder.registerComponent(PricingPackagesStep, {
  name: 'Pricing & Packages Step',
  inputs: [],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/currency-dollar.png',
  defaultStyles: {
    padding: '20px',
    margin: '20px 0'
  }
})