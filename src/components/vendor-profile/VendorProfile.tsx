'use client'

import { useState, useEffect } from 'react'
import { 
  UserIcon, 
  MapPinIcon, 
  BriefcaseIcon, 
  GiftIcon, 
  StarIcon,
  CalendarIcon,
  PhoneIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import BookNowCTA from './BookNowCTA'
import BookingWidget from '@/components/booking/BookingWidget'
import AboutSection from './sections/AboutSection'
import ServicesSection from './sections/ServicesSection'
import ServiceAreasSection from './sections/ServiceAreasSection'
import OffersSection from './sections/OffersSection'
import ReviewsSection from './sections/ReviewsSection'
import type { VendorServiceRecord } from '@/lib/repositories/vendorServiceRepository'

interface Vendor {
  id: string
  slug: string
  displayName: string
  headline: string
  bio: string
  location: string
  website: string
  phone: string
  avatarUrl: string | null
  coverImageUrl: string | null
  rating: number
  reviewCount: number
  services: Array<{
    id: string | number
    title: string
    description: string
    priceCents: number
    type: string
    duration: string
    features: string[]
    isPopular: boolean
    pricingModel: string
    hourlyRate: number | null
    depositRequired: boolean
    depositPercentage: number
    cancellationPolicy: string
  }>
  serviceAreas: Array<{
    id: string
    city: string
    state: string
    zipCode: string
  }>
  offers: Array<{
    id: string
    title: string
    description: string
    discountPercent: number
    validUntil: string
  }>
  reviews: Array<{
    id: string
    customerName: string
    rating: number
    comment: string
    createdAt: string
  }>
}

interface VendorProfileProps {
  vendor: Vendor
}

const tabs = [
  { id: 'about', name: 'About', icon: UserIcon },
  { id: 'services', name: 'Services', icon: BriefcaseIcon },
  { id: 'areas', name: 'Service Areas', icon: MapPinIcon },
  { id: 'offers', name: 'Offers', icon: GiftIcon },
  { id: 'reviews', name: 'Reviews', icon: StarIcon },
]

export default function VendorProfile({ vendor }: VendorProfileProps) {
  const [activeTab, setActiveTab] = useState('about')
  const [services, setServices] = useState(vendor.services || [])
  const [isLoadingServices, setIsLoadingServices] = useState(false)

  // Fetch services from the API if not provided
  useEffect(() => {
    if (!vendor.services || vendor.services.length === 0) {
      fetchServices()
    }
  }, [vendor.slug])

  const fetchServices = async () => {
    setIsLoadingServices(true)
    try {
      const response = await fetch(`/api/vendor/public/${vendor.slug}/services`)
      if (response.ok) {
        const data = await response.json()
        setServices(data.services || [])
      }
    } catch (error) {
      console.error('Error fetching vendor services:', error)
    } finally {
      setIsLoadingServices(false)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutSection vendor={vendor} />
      case 'services':
        return <ServicesSection services={services} />
      case 'areas':
        return <ServiceAreasSection serviceAreas={vendor.serviceAreas} />
      case 'offers':
        return <OffersSection offers={vendor.offers} />
      case 'reviews':
        return <ReviewsSection reviews={vendor.reviews} rating={vendor.rating} reviewCount={vendor.reviewCount} />
      default:
        return <AboutSection vendor={vendor} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Cover Image */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-600">
        {vendor.coverImageUrl && (
          <img
            src={vendor.coverImageUrl}
            alt={`${vendor.displayName} cover`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Vendor Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {vendor.avatarUrl ? (
                    <img
                      src={vendor.avatarUrl}
                      alt={vendor.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-300">
                      <UserIcon className="h-12 w-12 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Vendor Details */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{vendor.displayName}</h1>
                <p className="text-lg md:text-xl mb-3 opacity-90">{vendor.headline}</p>
                
                {/* Rating and Location */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(vendor.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm">
                      {vendor.rating.toFixed(1)} ({vendor.reviewCount} reviews)
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-5 w-5" />
                    <span>{vendor.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Book Now CTA */}
      <BookNowCTA vendor={vendor} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-96">
              {isLoadingServices && activeTab === 'services' ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading services...</span>
                </div>
              ) : (
                renderTabContent()
              )}
            </div>
          </div>

          {/* Sidebar with Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <BookingWidget
                vendorSlug={vendor.slug}
                variant="full"
                showPricing={true}
                showAvailability={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}