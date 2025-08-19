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
  CubeIcon
} from '@heroicons/react/24/outline'

interface Package {
  id: number
  title: string
  description: string
  priceCents: number
  isActive: boolean
}

export default function PackageManagement() {
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceCents: 0,
    isActive: true
  })

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/vendor/packages')
      if (response.ok) {
        const data = await response.json()
        setPackages(data.packages || [])
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/vendor/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setPackages([...packages, data.package])
        setShowCreateForm(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error creating package:', error)
    }
  }

  const handleUpdate = async () => {
    if (!editingPackage) return

    try {
      const response = await fetch('/api/vendor/packages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingPackage.id,
          ...formData,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPackages(packages.map(pkg => 
          pkg.id === editingPackage.id ? data.package : pkg
        ))
        setEditingPackage(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error updating package:', error)
    }
  }

  const handleDelete = async (packageId: number) => {
    if (!confirm('Are you sure you want to delete this package?')) return

    try {
      const response = await fetch('/api/vendor/packages', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: packageId }),
      })

      if (response.ok) {
        setPackages(packages.filter(pkg => pkg.id !== packageId))
      }
    } catch (error) {
      console.error('Error deleting package:', error)
    }
  }

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg)
    setFormData({
      title: pkg.title,
      description: pkg.description,
      priceCents: pkg.priceCents,
      isActive: pkg.isActive
    })
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priceCents: 0,
      isActive: true
    })
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
          <h2 className="text-2xl font-bold text-gray-900">Packages & Pricing</h2>
          <p className="text-gray-600">Manage your service packages and pricing structure</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Package
        </button>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingPackage) && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingPackage ? 'Edit Package' : 'Create New Package'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Name
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what's included in this package..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Active (visible to customers)</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => {
                setShowCreateForm(false)
                setEditingPackage(null)
                resetForm()
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <XMarkIcon className="h-4 w-4 inline mr-2" />
              Cancel
            </button>
            <button
              onClick={editingPackage ? handleUpdate : handleCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              {editingPackage ? 'Update Package' : 'Create Package'}
            </button>
          </div>
        </div>
      )}

      {/* Packages List */}
      <div className="space-y-4">
        {packages.length === 0 ? (
          <div className="text-center py-12">
            <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No packages yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first service package.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Package
              </button>
            </div>
          </div>
        ) : (
          packages.map((pkg) => (
            <div key={pkg.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{pkg.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      pkg.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {pkg.isActive ? (
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
                  </div>
                  <p className="text-gray-600 mb-3">{pkg.description || 'No description provided'}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      {formatPrice(pkg.priceCents)}
                    </span>
                    <span>Package ID: {pkg.id}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
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
  name: 'Vendor Package Management',
  inputs: [],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/package.png',
  defaultStyles: {
    padding: '20px',
    margin: '20px 0'
  }
})