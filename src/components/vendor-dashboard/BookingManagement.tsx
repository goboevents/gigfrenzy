'use client'

import { Builder } from '@builder.io/react'
import { useState, useEffect } from 'react'
import { 
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface Booking {
  id: number
  customerName: string
  customerEmail: string
  customerPhone: string | null
  eventDate: string
  startTime: string
  eventType: string
  guestCount: number | null
  venueAddress: string | null
  totalPriceCents: number
  status: string
  paymentStatus: string
  createdAt: string
  notes?: string
  packageTitle?: string
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/vendor/bookings')
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      // This would need a new API endpoint for updating booking status
      const response = await fetch(`/api/vendor/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setBookings(bookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus as Booking['status'] }
            : booking
        ))
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckIcon className="h-4 w-4" />
      case 'pending':
        return <ClockIcon className="h-4 w-4" />
      case 'completed':
        return <CheckIcon className="h-4 w-4" />
      case 'cancelled':
        return <XMarkIcon className="h-4 w-4" />
      default:
        return <ClockIcon className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return ''
    const [hour, minute] = timeString.split(':')
    const hourNum = parseInt(hour)
    const ampm = hourNum >= 12 ? 'PM' : 'AM'
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum
    return `${displayHour}:${minute} ${ampm}`
  }

  const formatPrice = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    const matchesDate = !dateFilter || booking.eventDate.includes(dateFilter)
    return matchesStatus && matchesDate
  })

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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Bookings & Events</h2>
        <p className="text-gray-600">Manage your upcoming and past event bookings</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {bookings.length === 0 
                ? "You don't have any bookings yet." 
                : "No bookings match your current filters."}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-medium text-gray-900">{booking.eventType}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1 capitalize">{booking.status}</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{formatDate(booking.eventDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4" />
                      <span>{formatTime(booking.startTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{booking.venueAddress || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="font-medium">{formatPrice(booking.totalPriceCents)}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <UserIcon className="h-4 w-4" />
                      <span className="font-medium">{booking.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        {booking.customerEmail}
                      </span>
                      {booking.customerPhone && (
                        <span className="flex items-center">
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          {booking.customerPhone}
                        </span>
                      )}
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Notes:</span> {booking.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                    title="View Details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  
                  {booking.status === 'pending' && (
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                      className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedBooking.eventType}</h4>
                  <p className="text-sm text-gray-600">{selectedBooking.packageTitle}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <p>{formatDate(selectedBooking.eventDate)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Time:</span>
                    <p>{formatTime(selectedBooking.startTime)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <p>{selectedBooking.venueAddress || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Total:</span>
                    <p>{formatPrice(selectedBooking.totalPriceCents)}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-2">Customer Information</h5>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedBooking.customerName}</p>
                    <p><span className="font-medium">Email:</span> {selectedBooking.customerEmail}</p>
                    {selectedBooking.customerPhone && (
                      <p><span className="font-medium">Phone:</span> {selectedBooking.customerPhone}</p>
                    )}
                  </div>
                </div>
                
                {selectedBooking.notes && (
                  <div className="border-t pt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
                    <p className="text-sm text-gray-600">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Register the component with Builder.io
Builder.registerComponent(BookingManagement, {
  name: 'Vendor Booking Management',
  inputs: [],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/calendar.png',
  defaultStyles: {
    padding: '20px',
    margin: '20px 0'
  }
})