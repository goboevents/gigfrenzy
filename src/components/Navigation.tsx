'use client'

import { Builder } from '@builder.io/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline'

interface NavigationProps {
  title?: string
}

export default function Navigation({ title = 'GigFrenzy' }: NavigationProps) {
  const pathname = usePathname()

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Vendor Onboarding', href: '/vendor-onboarding', icon: UserGroupIcon },
    { name: 'Vendor Dashboard', href: '/vendor-dashboard', icon: ChartBarIcon },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">G</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{title}</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="md:hidden">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Register the component with Builder.io
Builder.registerComponent(Navigation, {
  name: 'Navigation',
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'GigFrenzy'
    }
  ],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/navigation.png',
  defaultStyles: {
    padding: '0',
    margin: '0'
  }
})