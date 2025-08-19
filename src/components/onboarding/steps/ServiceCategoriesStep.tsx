'use client'

import { Builder } from '@builder.io/react'
import { useState } from 'react'

interface ServiceCategoriesStepProps {
  stepData?: any
  onComplete: (data: any) => void
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
  allData: any
}

interface ServiceCategory {
  id: string
  name: string
  description: string
  icon: string
  selected: boolean
}

export default function ServiceCategoriesStep({
  stepData = {},
  onComplete,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  allData
}: ServiceCategoriesStepProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    stepData.selectedCategories || []
  )
  const [customServices, setCustomServices] = useState<string[]>(
    stepData.customServices || []
  )
  const [newCustomService, setNewCustomService] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const serviceCategories: ServiceCategory[] = [
    {
      id: 'catering',
      name: 'Catering & Food Services',
      description: 'Wedding cakes, full-service catering, food trucks',
      icon: '🍽️',
      selected: false
    },
    {
      id: 'photography',
      name: 'Photography & Videography',
      description: 'Wedding photography, engagement shoots, videography',
      icon: '📸',
      selected: false
    },
    {
      id: 'music',
      name: 'Music & Entertainment',
      description: 'Live bands, DJs, solo musicians, string quartets',
      icon: '🎵',
      selected: false
    },
    {
      id: 'decoration',
      name: 'Decoration & Flowers',
      description: 'Floral arrangements, centerpieces, venue decoration',
      icon: '🌸',
      selected: false
    },
    {
      id: 'transportation',
      name: 'Transportation & Limousine',
      description: 'Limo services, shuttle buses, vintage cars',
      icon: '🚗',
      selected: false
    },
    {
      id: 'venue',
      name: 'Venue & Event Space',
      description: 'Wedding venues, reception halls, outdoor spaces',
      icon: '🏛️',
      selected: false
    },
    {
      id: 'planning',
      name: 'Wedding Planning & Coordination',
      description: 'Full-service planning, day-of coordination',
      icon: '📋',
      selected: false
    },
    {
      id: 'beauty',
      name: 'Beauty & Hair Services',
      description: 'Hair styling, makeup, nail services',
      icon: '💄',
      selected: false
    },
    {
      id: 'dj',
      name: 'DJ & Audio Services',
      description: 'Wedding DJs, sound systems, lighting',
      icon: '🎧',
      selected: false
    },
    {
      id: 'lighting',
      name: 'Lighting & Sound',
      description: 'Professional lighting, sound systems, special effects',
      icon: '💡',
      selected: false
    }
  ]

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const addCustomService = () => {
    if (newCustomService.trim() && !customServices.includes(newCustomService.trim())) {
      setCustomServices(prev => [...prev, newCustomService.trim()])
      setNewCustomService('')
    }
  }

  const removeCustomService = (service: string) => {
    setCustomServices(prev => prev.filter(s => s !== service))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (selectedCategories.length === 0 && customServices.length === 0) {
      newErrors.categories = 'Please select at least one service category or add a custom service'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onComplete({
        selectedCategories,
        customServices
      })
      onNext()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Service Categories</h2>
        <p className="text-gray-600">Select the services you offer and add any custom ones</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Service Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Your Service Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceCategories.map((category) => (
              <div
                key={category.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedCategories.includes(category.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleCategoryToggle(category.id)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    selectedCategories.includes(category.id)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedCategories.includes(category.id) && (
                      <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.categories && (
            <p className="text-red-500 text-sm mt-2">{errors.categories}</p>
          )}
        </div>

        {/* Custom Services */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Add Custom Services</h3>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newCustomService}
              onChange={(e) => setNewCustomService(e.target.value)}
              placeholder="Enter a custom service (e.g., Photo Booth, Live Painting)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomService())}
            />
            <button
              type="button"
              onClick={addCustomService}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Add
            </button>
          </div>

          {customServices.length > 0 && (
            <div className="space-y-2">
              {customServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{service}</span>
                  <button
                    type="button"
                    onClick={() => removeCustomService(service)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {(selectedCategories.length > 0 || customServices.length > 0) && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Selected Services:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(categoryId => {
                const category = serviceCategories.find(c => c.id === categoryId)
                return (
                  <span key={categoryId} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {category?.icon} {category?.name}
                  </span>
                )
              })}
              {customServices.map((service, index) => (
                <span key={`custom-${index}`} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  ✨ {service}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Continue to Location & Availability
          </button>
        </div>
      </form>
    </div>
  )
}

// Register the component with Builder.io
Builder.registerComponent(ServiceCategoriesStep, {
  name: 'Service Categories Step',
  inputs: [],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/category.png',
  defaultStyles: {
    padding: '20px',
    margin: '20px 0'
  }
})