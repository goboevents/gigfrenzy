'use client'

import { Builder } from '@builder.io/react'
import { useState } from 'react'
import { 
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  KeyIcon,
  GlobeAltIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('notifications')
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newBookings: true,
    bookingUpdates: true,
    customerReviews: true,
    paymentConfirmations: true,
    marketingEmails: false
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showContactInfo: true,
    showPricing: true,
    allowDirectContact: true,
    showAvailability: true
  })

  const [billingSettings, setBillingSettings] = useState({
    autoRenewal: true,
    paymentMethod: 'credit_card',
    billingCycle: 'monthly',
    taxExempt: false
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handlePrivacyChange = (key: string, value: string | boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleBillingChange = (key: string, value: string | boolean) => {
    setBillingSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const tabs = [
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy & Security', icon: ShieldCheckIcon },
    { id: 'billing', name: 'Billing & Payments', icon: CreditCardIcon },
    { id: 'integrations', name: 'Integrations', icon: GlobeAltIcon }
  ]

  const ActiveTabIcon = tabs.find(tab => tab.id === activeTab)?.icon

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      <div className="flex space-x-8">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                <p className="text-sm text-gray-600">Choose how you want to be notified about important updates</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Notification Channels */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Notification Channels</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Email notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.smsNotifications}
                        onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">SMS notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.pushNotifications}
                        onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Push notifications</span>
                    </label>
                  </div>
                </div>

                {/* Notification Types */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">What to Notify Me About</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.newBookings}
                        onChange={(e) => handleNotificationChange('newBookings', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">New bookings</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.bookingUpdates}
                        onChange={(e) => handleNotificationChange('bookingUpdates', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Booking updates and changes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.customerReviews}
                        onChange={(e) => handleNotificationChange('customerReviews', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">New customer reviews</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.paymentConfirmations}
                        onChange={(e) => handleNotificationChange('paymentConfirmations', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Payment confirmations</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.marketingEmails}
                        onChange={(e) => handleNotificationChange('marketingEmails', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Marketing and promotional emails</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Security Tab */}
          {activeTab === 'privacy' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Privacy & Security</h3>
                <p className="text-sm text-gray-600">Control your profile visibility and security settings</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Profile Visibility */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Profile Visibility</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="public"
                        checked={privacySettings.profileVisibility === 'public'}
                        onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700">Public - Anyone can view your profile</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="private"
                        checked={privacySettings.profileVisibility === 'private'}
                        onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700">Private - Only invited customers can view</span>
                    </label>
                  </div>
                </div>

                {/* Information Display */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Information Display</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={privacySettings.showContactInfo}
                        onChange={(e) => handlePrivacyChange('showContactInfo', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Show contact information to customers</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={privacySettings.showPricing}
                        onChange={(e) => handlePrivacyChange('showPricing', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Show pricing information publicly</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={privacySettings.allowDirectContact}
                        onChange={(e) => handlePrivacyChange('allowDirectContact', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Allow customers to contact you directly</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={privacySettings.showAvailability}
                        onChange={(e) => handlePrivacyChange('showAvailability', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Show real-time availability</span>
                    </label>
                  </div>
                </div>

                {/* Security */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Security</h4>
                  <div className="space-y-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <KeyIcon className="h-4 w-4 mr-2" />
                      Change Password
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <ShieldCheckIcon className="h-4 w-4 mr-2" />
                      Two-Factor Authentication
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing & Payments Tab */}
          {activeTab === 'billing' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Billing & Payments</h3>
                <p className="text-sm text-gray-600">Manage your billing preferences and payment methods</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Billing Preferences */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Billing Preferences</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={billingSettings.autoRenewal}
                        onChange={(e) => handleBillingChange('autoRenewal', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Auto-renewal enabled</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={billingSettings.taxExempt}
                        onChange={(e) => handleBillingChange('taxExempt', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">Tax exempt status</span>
                    </label>
                  </div>
                </div>

                {/* Billing Cycle */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Billing Cycle</h4>
                  <select
                    value={billingSettings.billingCycle}
                    onChange={(e) => handleBillingChange('billingCycle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>

                {/* Payment Methods */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Payment Methods</h4>
                  <div className="space-y-3">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <CreditCardIcon className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      Download Invoices
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Integrations</h3>
                <p className="text-sm text-gray-600">Connect your account with other services</p>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <GlobeAltIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No integrations yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Connect your account with calendar, payment, and other services.</p>
                  <div className="mt-6">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <GlobeAltIcon className="h-4 w-4 mr-2" />
                      Browse Integrations
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Register the component with Builder.io
Builder.registerComponent(Settings, {
  name: 'Vendor Settings',
  inputs: [],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/settings.png',
  defaultStyles: {
    padding: '20px',
    margin: '20px 0'
  }
})