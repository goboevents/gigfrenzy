'use client'

import { Builder } from '@builder.io/react'

// Import all your custom components here
import VendorSignupForm from './VendorSignupForm'
import Navigation from './Navigation'
import VendorDashboard from './vendor-dashboard/VendorDashboard'
import ProfileManagement from './vendor-dashboard/ProfileManagement'
import PackageManagement from './vendor-dashboard/PackageManagement'
import BookingManagement from './vendor-dashboard/BookingManagement'
import Analytics from './vendor-dashboard/Analytics'
import Settings from './vendor-dashboard/Settings'
// import CustomHero from './CustomHero'
// import CustomEventCard from './CustomEventCard'

export function registerBuilderComponents() {
  // Register all custom components here
  
  // Vendor Signup Form Component
  Builder.registerComponent(VendorSignupForm, {
    name: 'Vendor Signup Form',
    inputs: [
      {
        name: 'title',
        type: 'string',
        defaultValue: 'Become a Vendor'
      },
      {
        name: 'subtitle',
        type: 'string',
        defaultValue: 'Join our platform and start offering your services'
      },
      {
        name: 'submitButtonText',
        type: 'string',
        defaultValue: 'Submit Application'
      },
      {
        name: 'successMessage',
        type: 'string',
        defaultValue: 'Thank you! Your application has been submitted successfully.'
      },
      {
        name: 'backgroundColor',
        type: 'color',
        defaultValue: '#ffffff'
      },
      {
        name: 'textColor',
        type: 'color',
        defaultValue: '#1f2937'
      },
      {
        name: 'buttonColor',
        type: 'color',
        defaultValue: '#3b82f6'
      },
      {
        name: 'formFields',
        type: 'object',
        defaultValue: {
          businessName: true,
          contactName: true,
          email: true,
          phone: true,
          businessType: true,
          website: false,
          description: false
        },
        subFields: [
          { name: 'businessName', type: 'boolean' },
          { name: 'contactName', type: 'boolean' },
          { name: 'email', type: 'boolean' },
          { name: 'phone', type: 'boolean' },
          { name: 'businessType', type: 'boolean' },
          { name: 'website', type: 'boolean' },
          { name: 'description', type: 'boolean' }
        ]
      },
      {
        name: 'businessTypeOptions',
        type: 'list',
        defaultValue: [
          'Catering',
          'Photography',
          'Music & Entertainment',
          'Decoration & Flowers',
          'Transportation',
          'Venue',
          'Other'
        ],
        subFields: [
          { name: 'value', type: 'string' }
        ]
      }
    ],
    image: 'https://tabler-icons.io/static/tabler-icons/icons-png/forms.png',
    defaultStyles: {
      padding: '20px',
      margin: '20px 0'
    }
  })

  // Vendor Dashboard Component
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

  // Vendor Profile Management Component
  Builder.registerComponent(ProfileManagement, {
    name: 'Vendor Profile Management',
    inputs: [],
    image: 'https://tabler-icons.io/static/tabler-icons/icons-png/user.png',
    defaultStyles: {
      padding: '20px',
      margin: '20px 0'
    }
  })

  // Vendor Package Management Component
  Builder.registerComponent(PackageManagement, {
    name: 'Vendor Package Management',
    inputs: [],
    image: 'https://tabler-icons.io/static/tabler-icons/icons-png/package.png',
    defaultStyles: {
      padding: '20px',
      margin: '20px 0'
    }
  })

  // Vendor Booking Management Component
  Builder.registerComponent(BookingManagement, {
    name: 'Vendor Booking Management',
    inputs: [],
    image: 'https://tabler-icons.io/static/tabler-icons/icons-png/calendar.png',
    defaultStyles: {
      padding: '20px',
      margin: '20px 0'
    }
  })

  // Vendor Analytics Component
  Builder.registerComponent(Analytics, {
    name: 'Vendor Analytics',
    inputs: [],
    image: 'https://tabler-icons.io/static/tabler-icons/icons-png/chart-bar.png',
    defaultStyles: {
      padding: '20px',
      margin: '20px 0'
    }
  })

  // Vendor Settings Component
  Builder.registerComponent(Settings, {
    name: 'Vendor Settings',
    inputs: [],
    image: 'https://tabler-icons.io/static/tabler-icons/icons-png/settings.png',
    defaultStyles: {
      padding: '20px',
      margin: '20px 0'
    }
  })

  // Navigation Component
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
  
  // Example: Custom Hero Component
  // Builder.registerComponent(CustomHero, {
  //   name: 'Custom Hero',
  //   inputs: [
  //     {
  //       name: 'title',
  //       type: 'string',
  //       defaultValue: 'Welcome to GigFrenzy'
  //     },
  //     {
  //       name: 'subtitle',
  //       type: 'string',
  //       defaultValue: 'Your ultimate event management platform'
  //     }
  //   ]
  // })

  // Example: Event Card Component
  // Builder.registerComponent(CustomEventCard, {
  //   name: 'Event Card',
  //   inputs: [
  //     {
  //       name: 'event',
  //       type: 'object',
  //       subFields: [
  //         { name: 'title', type: 'string' },
  //         { name: 'date', type: 'string' },
  //         { name: 'location', type: 'string' }
  //       ]
  //     }
  //   ]
  // })

  console.log('Builder.io components registered successfully')
}
