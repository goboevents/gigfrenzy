// Main onboarding container
export { default as OnboardingContainer } from './OnboardingContainer'

// Individual step components
export { default as AccountCreationStep } from './steps/AccountCreationStep'
export { default as BusinessProfileStep } from './steps/BusinessProfileStep'
export { default as ServiceCategoriesStep } from './steps/ServiceCategoriesStep'
export { default as LocationAvailabilityStep } from './steps/LocationAvailabilityStep'
export { default as DocumentationStep } from './steps/DocumentationStep'
export { default as PricingPackagesStep } from './steps/PricingPackagesStep'
export { default as ReviewSubmitStep } from './steps/ReviewSubmitStep'

// Types
export interface OnboardingStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<any>
  isComplete: boolean
}

export interface OnboardingContainerProps {
  title?: string
  subtitle?: string
  steps?: OnboardingStep[]
  showProgressBar?: boolean
  allowStepNavigation?: boolean
  backgroundColor?: string
  textColor?: string
  accentColor?: string
}