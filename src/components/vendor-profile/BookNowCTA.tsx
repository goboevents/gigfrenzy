'use client'

import { useState } from 'react'
import { CalendarIcon, PhoneIcon, GlobeAltIcon, StarIcon } from '@heroicons/react/24/outline'

interface Vendor {
  id: string
  displayName: string
  phone: string
  website: string
  rating: number
  reviewCount: number
}

interface BookNowCTAProps {
  vendor: Vendor
}

export default function BookNowCTA({ vendor }: BookNowCTAProps) {
  const [showBookingModal, setShowBookingModal] = useState(false)

  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceCents / 100)
  }

  return (
    <>
      {/* Sticky Book Now Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Vendor Quick Info */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-medium text-gray-900">
                  {vendor.rating.toFixed(1)} ({vendor.reviewCount} reviews)
                </span>
              </div>
              
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                {vendor.phone && (
                  <div className="flex items-center space-x-1">
                    <PhoneIcon className="h-4 w-4" />
                    <span>{vendor.phone}</span>
                  </div>
                )}
                {vendor.website && (
                  <div className="flex items-center space-x-1">
                    <GlobeAltIcon className="h-4 w-4" />
                    <a 
                      href={vendor.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Book Now Button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowBookingModal(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowBookingModal(false)}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Book with {vendor.displayName}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Choose how you'd like to get in touch with {vendor.displayName} to book their services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <div className="space-y-3 w-full">
                  {/* Phone Booking */}
                  {vendor.phone && (
                    <a
                      href={`tel:${vendor.phone}`}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      Call to Book
                    </a>
                  )}
                  
                  {/* Website Booking */}
                  {vendor.website && (
                    <a
                      href={vendor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <GlobeAltIcon className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  )}
                  
                  {/* In-App Booking (placeholder for future implementation) */}
                  <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Book Online (Coming Soon)
                  </button>
                </div>
                
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowBookingModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}