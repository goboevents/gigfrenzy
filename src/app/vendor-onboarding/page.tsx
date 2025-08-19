'use client'

import { Builder } from '@builder.io/react'
import OnboardingContainer from '../../components/onboarding/OnboardingContainer'
import AccountCreationStep from '../../components/onboarding/steps/AccountCreationStep'
import BusinessProfileStep from '../../components/onboarding/steps/BusinessProfileStep'
import ServiceCategoriesStep from '../../components/onboarding/steps/ServiceCategoriesStep'
import LocationAvailabilityStep from '../../components/onboarding/steps/LocationAvailabilityStep'
import DocumentationStep from '../../components/onboarding/steps/DocumentationStep'
import PricingPackagesStep from '../../components/onboarding/steps/PricingPackagesStep'
import ReviewSubmitStep from '../../components/onboarding/steps/ReviewSubmitStep'

// Define the onboarding steps
const onboardingSteps = [
  {
    id: 'account-creation',
    title: 'Account Creation',
    description: 'Create your vendor account',
    component: AccountCreationStep,
    isComplete: false
  },
  {
    id: 'business-profile',
    title: 'Business Profile',
    description: 'Tell us about your business',
    component: BusinessProfileStep,
    isComplete: false
  },
  {
    id: 'service-categories',
    title: 'Service Categories',
    description: 'Select your services',
    component: ServiceCategoriesStep,
    isComplete: false
  },
  {
    id: 'location-availability',
    title: 'Location & Availability',
    description: 'Set service areas and schedule',
    component: LocationAvailabilityStep,
    isComplete: false
  },
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'Upload required documents',
    component: DocumentationStep,
    isComplete: false
  },
  {
    id: 'pricing-packages',
    title: 'Pricing & Packages',
    description: 'Set your pricing structure',
    component: PricingPackagesStep,
    isComplete: false
  },
  {
    id: 'review-submit',
    title: 'Review & Submit',
    description: 'Review and submit application',
    component: ReviewSubmitStep,
    isComplete: false
  }
]

export default function VendorOnboarding() {
  return (
    <div className="min-h-screen bg-gray-50">
      <OnboardingContainer
        title="Complete Your Vendor Profile"
        subtitle="Join our platform and start offering your services to customers"
        steps={onboardingSteps}
        showProgressBar={true}
        allowStepNavigation={true}
        backgroundColor="#f9fafb"
        textColor="#1f2937"
        accentColor="#3b82f6"
      />
    </div>
  )
}

// Register the page with Builder.io
Builder.register('page', {
  name: 'Vendor Onboarding',
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'Complete Your Vendor Profile'
    },
    {
      name: 'subtitle',
      type: 'string',
      defaultValue: 'Join our platform and start offering your services to customers'
    }
  ]
})