'use client'

import { Builder } from '@builder.io/react'
import VendorDashboard from '../../components/vendor-dashboard/VendorDashboard'

export default function VendorDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <VendorDashboard />
    </div>
  )
}

// Register the page with Builder.io
Builder.register('page', {
  name: 'Vendor Dashboard',
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'Vendor Dashboard'
    },
    {
      name: 'subtitle',
      type: 'string',
      defaultValue: 'Manage your business profile, packages, and bookings'
    }
  ]
})