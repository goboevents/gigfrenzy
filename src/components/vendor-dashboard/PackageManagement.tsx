'use client'

import { Builder } from '@builder.io/react'
import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  EyeIcon,
  EyeSlashIcon,
  CubeIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline'

interface VendorService {
  id: number
  title: string
  description: string
  priceCents: number
  isActive: boolean
  type: string
  duration: string
  features: string[]
  isPopular: boolean
  pricingModel: string
  hourlyRate: number
  depositRequired: boolean
  depositPercentage: number
  cancellationPolicy: string
  createdAt?: string
  updatedAt?: string
}

export default function PackageManagement() {
  const [services, setServices] = useState<VendorService[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingService, setEditingService] = useState<VendorService | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceCents: 0,
    isActive: true,
    type: 'package',
    duration: 'per event',
    features: [] as string[],
    isPopular: false,
    pricingModel: 'fixed',
    hourlyRate: 0,
    depositRequired: false,
    depositPercentage: 25,
    cancellationPolicy: ''
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/vendor/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data.services || [])
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/vendor/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setServices([...services, data.service])
        setShowCreateForm(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error creating service:', error)
    }
  }

  const handleUpdate = async () => {
    if (!editingService) return

    try {
      const response = await fetch('/api/vendor/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingService.id,
          ...formData,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setServices(services.map(svc => 
          svc.id === editingService.id ? data.service : svc
        ))
        setEditingService(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error updating service:', error)
    }
  }

  const handleDelete = async (serviceId: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await fetch('/api/vendor/services', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: serviceId }),
      })

      if (response.ok) {
        setServices(services.filter(svc => svc.id !== serviceId))
      }
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const handleEdit = (svc: VendorService) => {
    setEditingService(svc)
    setFormData({
      title: svc.title,
      description: svc.description,
      priceCents: svc.priceCents,
      isActive: svc.isActive,
      type: svc.type,
      duration: svc.duration,
      features: svc.features,
      isPopular: svc.isPopular,
      pricingModel: svc.pricingModel,
      hourlyRate: svc.hourlyRate,
      depositRequired: svc.depositRequired,
      depositPercentage: svc.depositPercentage,
      cancellationPolicy: svc.cancellationPolicy
    })
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priceCents: 0,
      isActive: true,
      type: 'package',
      duration: 'per event',
      features: [],
      isPopular: false,
      pricingModel: 'fixed',
      hourlyRate: 0,
      depositRequired: false,
      depositPercentage: 25,
      cancellationPolicy: ''
    })
  }

  const addFeature = () => {
    const newFeature = prompt('Enter feature description:')
    if (newFeature && newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Services & Packages</h2>
          <p className="text-gray-600">Manage your service packages and pricing structure</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Service
        </button>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingService) && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingService ? 'Edit Service' : 'Create New Service'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Basic Package, Premium Service"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="service">Service</option>
                <option value="package">Package</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={formData.priceCents / 100}
                  onChange={(e) => setFormData({ ...formData, priceCents: Math.round(parseFloat(e.target.value) * 100) })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., per event, per hour"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what's included in this service..."
              />
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Features
                </label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...formData.features]
                        newFeatures[index] = e.target.value
                        setFormData({ ...formData, features: newFeatures })
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Feature description"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active (visible to customers)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Mark as popular</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => {
                setShowCreateForm(false)
                setEditingService(null)
                resetForm()
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <XMarkIcon className="h-4 w-4 inline mr-2" />
              Cancel
            </button>
            <button
              onClick={editingService ? handleUpdate : handleCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              {editingService ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="text-center py-12">
            <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No services yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first service or package.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Service
              </button>
            </div>
          </div>
        ) : (
          services.map((svc) => (
            <div key={svc.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{svc.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      svc.type === 'package' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {svc.type === 'package' ? 'Package' : 'Service'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      svc.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {svc.isActive ? (
                        <>
                          <EyeIcon className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeSlashIcon className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                    {svc.isPopular && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <TagIcon className="h-3 w-3 mr-1" />
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{svc.description || 'No description provided'}</p>
                  
                  {/* Features */}
                  {svc.features && Array.isArray(svc.features) && svc.features.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        {svc.features.map((feature, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                            <CheckIcon className="h-3 w-3 mr-1 text-green-500" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      {formatPrice(svc.priceCents)}
                    </span>
                    <span className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {svc.duration}
                    </span>
                    <span>ID: {svc.id}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(svc)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(svc.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Register the component with Builder.io
Builder.registerComponent(PackageManagement, {
  name: 'Vendor Service Management',
  inputs: [],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/package.png',
  defaultStyles: {
    padding: '20px',
    margin: '20px 0'
  }
})