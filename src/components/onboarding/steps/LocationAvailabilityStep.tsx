'use client'

import { Builder } from '@builder.io/react'
import { useState } from 'react'

interface LocationAvailabilityStepProps {
  stepData?: any
  onComplete: (data: any) => void
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
  allData: any
}

interface ServiceArea {
  city: string
  state: string
  radius: number
}

export default function LocationAvailabilityStep({
  stepData = {},
  onComplete,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  allData
}: LocationAvailabilityStepProps) {
  const [formData, setFormData] = useState({
    primaryLocation: stepData.primaryLocation || '',
    serviceAreas: stepData.serviceAreas || [],
    travelRadius: stepData.travelRadius || 50,
    availability: stepData.availability || {
      monday: { available: false, hours: { start: '09:00', end: '17:00' } },
      tuesday: { available: false, hours: { start: '09:00', end: '17:00' } },
      wednesday: { available: false, hours: { start: '09:00', end: '17:00' } },
      thursday: { available: false, hours: { start: '09:00', end: '17:00' } },
      friday: { available: false, hours: { start: '09:00', end: '17:00' } },
      saturday: { available: false, hours: { start: '09:00', end: '17:00' } },
      sunday: { available: false, hours: { start: '09:00', end: '17:00' } }
    },
    advanceBooking: stepData.advanceBooking || 30,
    maxEventsPerDay: stepData.maxEventsPerDay || 1,
    emergencyAvailability: stepData.emergencyAvailability || false
  })
  const [newServiceArea, setNewServiceArea] = useState({ city: '', state: '', radius: 25 })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  const handleServiceAreaAdd = () => {
    if (newServiceArea.city && newServiceArea.state) {
      const areaExists = formData.serviceAreas.some(
        area => area.city === newServiceArea.city && area.state === newServiceArea.state
      )
      
      if (!areaExists) {
        setFormData(prev => ({
          ...prev,
          serviceAreas: [...prev.serviceAreas, { ...newServiceArea }]
        }))
        setNewServiceArea({ city: '', state: '', radius: 25 })
      }
    }
  }

  const handleServiceAreaRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((_, i) => i !== index)
    }))
  }

  const handleAvailabilityToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          available: !prev.availability[day].available
        }
      }
    }))
  }

  const handleHoursChange = (day: string, field: 'start' | 'end', value: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          hours: {
            ...prev.availability[day].hours,
            [field]: value
          }
        }
      }
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.primaryLocation) {
      newErrors.primaryLocation = 'Primary location is required'
    }

    if (formData.serviceAreas.length === 0) {
      newErrors.serviceAreas = 'At least one service area is required'
    }

    const hasAvailableDays = Object.values(formData.availability).some(day => day.available)
    if (!hasAvailableDays) {
      newErrors.availability = 'At least one day must be available'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onComplete(formData)
      onNext()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Location & Availability</h2>
        <p className="text-gray-600">Set your service areas and availability schedule</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Primary Location */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Primary Business Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.primaryLocation}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryLocation: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.primaryLocation ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your primary city"
              />
              {errors.primaryLocation && (
                <p className="text-red-500 text-sm mt-1">{errors.primaryLocation}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Radius (miles)
              </label>
              <input
                type="number"
                min="0"
                max="500"
                value={formData.travelRadius}
                onChange={(e) => setFormData(prev => ({ ...prev, travelRadius: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Service Areas */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Service Areas</h3>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={newServiceArea.city}
                  onChange={(e) => setNewServiceArea(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  value={newServiceArea.state}
                  onChange={(e) => setNewServiceArea(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select state</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Radius (miles)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newServiceArea.radius}
                  onChange={(e) => setNewServiceArea(prev => ({ ...prev, radius: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleServiceAreaAdd}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Area
                </button>
              </div>
            </div>
          </div>

          {formData.serviceAreas.length > 0 && (
            <div className="space-y-2">
              {formData.serviceAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <span className="text-gray-700">
                    {area.city}, {area.state} (within {area.radius} miles)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleServiceAreaRemove(index)}
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
          {errors.serviceAreas && (
            <p className="text-red-500 text-sm mt-2">{errors.serviceAreas}</p>
          )}
        </div>

        {/* Availability Schedule */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Weekly Availability Schedule</h3>
          <div className="space-y-4">
            {Object.entries(formData.availability).map(([day, schedule]) => (
              <div key={day} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={schedule.available}
                    onChange={() => handleAvailabilityToggle(day)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700 capitalize min-w-[80px]">
                    {day}
                  </span>
                </div>
                
                {schedule.available && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Hours:</span>
                    <input
                      type="time"
                      value={schedule.hours.start}
                      onChange={(e) => handleHoursChange(day, 'start', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-gray-600">to</span>
                    <input
                      type="time"
                      value={schedule.hours.end}
                      onChange={(e) => handleHoursChange(day, 'end', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          {errors.availability && (
            <p className="text-red-500 text-sm mt-2">{errors.availability}</p>
          )}
        </div>

        {/* Additional Settings */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Additional Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advance Booking Required (days)
              </label>
              <input
                type="number"
                min="0"
                max="365"
                value={formData.advanceBooking}
                onChange={(e) => setFormData(prev => ({ ...prev, advanceBooking: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Events Per Day
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.maxEventsPerDay}
                onChange={(e) => setFormData(prev => ({ ...prev, maxEventsPerDay: parseInt(e.target.value) || 1 }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.emergencyAvailability}
                onChange={(e) => setFormData(prev => ({ ...prev, emergencyAvailability: e.target.checked }))}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Available for emergency/last-minute bookings
              </span>
            </label>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Continue to Documentation
          </button>
        </div>
      </form>
    </div>
  )
}

// Register the component with Builder.io
Builder.registerComponent(LocationAvailabilityStep, {
  name: 'Location & Availability Step',
  inputs: [],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/map-pin.png',
  defaultStyles: {
    padding: '20px',
    margin: '20px 0'
  }
})