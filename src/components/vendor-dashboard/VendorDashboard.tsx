'use client'

import { Builder } from '@builder.io/react'
import { useState } from 'react'
import { 
  UserIcon, 
  CubeIcon, 
  CalendarIcon, 
  ChartBarIcon,
  CogIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import ProfileManagement from './ProfileManagement'
import PackageManagement from './PackageManagement'
import BookingManagement from './BookingManagement'
import Analytics from './Analytics'
import Settings from './Settings'

type DashboardTab = 'profile' | 'packages' | 'bookings' | 'analytics' | 'settings'

interface VendorDashboardProps {
  title?: string
  subtitle?: string
}

export default function VendorDashboard({
  title = 'Vendor Dashboard',
  subtitle = 'Manage your business profile, packages, and bookings'
}: VendorDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('profile')

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon, component: ProfileManagement },
    { id: 'packages', name: 'Packages & Pricing', icon: CubeIcon, component: PackageManagement },
    { id: 'bookings', name: 'Bookings', icon: CalendarIcon, component: BookingManagement },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon, component: Analytics },
    { id: 'settings', name: 'Settings', icon: CogIcon, component: Settings }
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <BellIcon className="h-6 w-6" />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">V</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DashboardTab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
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
        <div className="bg-white rounded-lg shadow">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  )
}

// Register the component with Builder.io
Builder.registerComponent(VendorDashboard, {
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
  ],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/dashboard.png',
  defaultStyles: {
    padding: '20px',
    margin: '20px 0'
  }
})