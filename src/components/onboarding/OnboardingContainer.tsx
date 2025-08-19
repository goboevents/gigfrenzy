'use client'

import { Builder } from '@builder.io/react'
import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface OnboardingStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<any>
  isComplete: boolean
}

interface OnboardingContainerProps {
  title?: string
  subtitle?: string
  steps?: OnboardingStep[]
  showProgressBar?: boolean
  allowStepNavigation?: boolean
  backgroundColor?: string
  textColor?: string
  accentColor?: string
}

export default function OnboardingContainer({
  title = 'Complete Your Vendor Profile',
  subtitle = 'Let\'s get you set up to start offering your services',
  steps = [],
  showProgressBar = true,
  allowStepNavigation = true,
  backgroundColor = '#ffffff',
  textColor = '#1f2937',
  accentColor = '#3b82f6'
}: OnboardingContainerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState({})

  const handleStepComplete = (stepId: string, data: any) => {
    setOnboardingData(prev => ({ ...prev, [stepId]: data }))
    
    // Mark step as complete
    const updatedSteps = steps.map(step => 
      step.id === stepId ? { ...step, isComplete: true } : step
    )
    
    // Move to next step if not the last
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    if (allowStepNavigation) {
      setCurrentStep(stepIndex)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const getProgressPercentage = () => {
    return ((currentStep + 1) / steps.length) * 100
  }

  const CurrentStepComponent = steps[currentStep]?.component

  return (
    <div 
      className="min-h-screen p-6"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-lg opacity-80">{subtitle}</p>
        </div>

        {/* Progress Bar */}
        {showProgressBar && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(getProgressPercentage())}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: accentColor 
                }}
              />
            </div>
          </div>
        )}

        {/* Step Navigation */}
        {allowStepNavigation && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    index === currentStep
                      ? 'text-white'
                      : step.isComplete
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: index === currentStep ? accentColor : undefined
                  }}
                >
                  {step.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {CurrentStepComponent && (
            <CurrentStepComponent
              stepData={onboardingData[steps[currentStep]?.id] || {}}
              onComplete={(data: any) => handleStepComplete(steps[currentStep].id, data)}
              onNext={goToNextStep}
              onPrevious={goToPreviousStep}
              isFirstStep={currentStep === 0}
              isLastStep={currentStep === steps.length - 1}
              allData={onboardingData}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
            className="flex items-center px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ 
              backgroundColor: currentStep === 0 ? '#9ca3af' : accentColor,
              color: '#ffffff'
            }}
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Previous
          </button>

          <button
            onClick={goToNextStep}
            disabled={currentStep === steps.length - 1}
            className="flex items-center px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ 
              backgroundColor: currentStep === steps.length - 1 ? '#9ca3af' : accentColor,
              color: '#ffffff'
            }}
          >
            Next
            <ChevronRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Register the component with Builder.io
Builder.registerComponent(OnboardingContainer, {
  name: 'Onboarding Container',
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'Complete Your Vendor Profile'
    },
    {
      name: 'subtitle',
      type: 'string',
      defaultValue: 'Let\'s get you set up to start offering your services'
    },
    {
      name: 'showProgressBar',
      type: 'boolean',
      defaultValue: true
    },
    {
      name: 'allowStepNavigation',
      type: 'boolean',
      defaultValue: true
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
      name: 'accentColor',
      type: 'color',
      defaultValue: '#3b82f6'
    }
  ],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/layout-list.png',
  defaultStyles: {
    padding: '20px',
    margin: '20px 0'
  }
})