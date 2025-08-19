'use client'

import { Builder } from '@builder.io/react'
import { useState, useEffect } from 'react'
import { 
  TrendingUpIcon,
  TrendingDownIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
  StarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  totalBookings: number
  totalRevenue: number
  averageRating: number
  totalCustomers: number
  monthlyBookings: { month: string; count: number }[]
  monthlyRevenue: { month: string; amount: number }[]
  topPackages: { name: string; bookings: number; revenue: number }[]
  recentActivity: { type: string; description: string; date: string }[]
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalCustomers: 0,
    monthlyBookings: [],
    monthlyRevenue: [],
    topPackages: [],
    recentActivity: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      // This would need a new API endpoint for analytics
      const response = await fetch(`/api/vendor/analytics?timeRange=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        // Mock data for demonstration
        setAnalytics({
          totalBookings: 24,
          totalRevenue: 480000,
          averageRating: 4.8,
          totalCustomers: 18,
          monthlyBookings: [
            { month: 'Jan', count: 2 },
            { month: 'Feb', count: 3 },
            { month: 'Mar', count: 4 },
            { month: 'Apr', count: 5 },
            { month: 'May', count: 6 },
            { month: 'Jun', count: 4 }
          ],
          monthlyRevenue: [
            { month: 'Jan', amount: 40000 },
            { month: 'Feb', amount: 60000 },
            { month: 'Mar', count: 80000 },
            { month: 'Apr', amount: 100000 },
            { month: 'May', amount: 120000 },
            { month: 'Jun', amount: 80000 }
          ],
          topPackages: [
            { name: 'Premium Wedding Package', bookings: 8, revenue: 240000 },
            { name: 'Basic Event Package', bookings: 12, revenue: 180000 },
            { name: 'Corporate Event Package', bookings: 4, revenue: 60000 }
          ],
          recentActivity: [
            { type: 'booking', description: 'New booking for Premium Wedding Package', date: '2024-06-15' },
            { type: 'review', description: '5-star review received from Sarah M.', date: '2024-06-14' },
            { type: 'payment', description: 'Payment received for Corporate Event', date: '2024-06-13' },
            { type: 'booking', description: 'Booking confirmed for Basic Event Package', date: '2024-06-12' }
          ]
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <CalendarIcon className="h-4 w-4 text-blue-500" />
      case 'review':
        return <StarIcon className="h-4 w-4 text-yellow-500" />
      case 'payment':
        return <CurrencyDollarIcon className="h-4 w-4 text-green-500" />
      default:
        return <ChartBarIcon className="h-4 w-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
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
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
          <p className="text-gray-600">Track your business performance and growth</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <StarIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.averageRating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalCustomers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Bookings Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Bookings</h3>
          <div className="space-y-3">
            {analytics.monthlyBookings.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(item.count / Math.max(...analytics.monthlyBookings.map(b => b.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Packages */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Packages</h3>
          <div className="space-y-4">
            {analytics.topPackages.map((pkg, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{pkg.name}</p>
                  <p className="text-sm text-gray-600">{pkg.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(pkg.revenue)}</p>
                  <p className="text-sm text-gray-600">
                    {((pkg.revenue / analytics.totalRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {analytics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {analytics.totalBookings > 0 ? Math.round((analytics.totalBookings / 30) * 100) / 100 : 0}
            </div>
            <p className="text-sm text-gray-600">Average bookings per day</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {analytics.totalBookings > 0 ? formatCurrency(analytics.totalRevenue / analytics.totalBookings) : '$0.00'}
            </div>
            <p className="text-sm text-gray-600">Average revenue per booking</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {analytics.totalCustomers > 0 ? Math.round((analytics.totalBookings / analytics.totalCustomers) * 100) / 100 : 0}
            </div>
            <p className="text-sm text-gray-600">Bookings per customer</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Register the component with Builder.io
Builder.registerComponent(Analytics, {
  name: 'Vendor Analytics',
  inputs: [],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/chart-bar.png',
  defaultStyles: {
    padding: '20px',
    margin: '20px 0'
  }
})