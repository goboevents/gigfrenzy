'use client'

import { Builder } from '@builder.io/react'
import VendorDashboard from '../../components/vendor-dashboard/VendorDashboard'
import ProtectedRoute from '../../components/auth/ProtectedRoute'

export default function VendorDashboardPage() {
  return (
    <ProtectedRoute requiredRole="vendor">
      <div className="min-h-screen bg-gray-50">
        <VendorDashboard />
      </div>
    </ProtectedRoute>
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