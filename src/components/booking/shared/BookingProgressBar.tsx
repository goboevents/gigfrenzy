'use client'

import { CheckIcon } from '@heroicons/react/24/solid'

interface BookingProgressBarProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export default function BookingProgressBar({ currentStep, totalSteps, steps }: BookingProgressBarProps) {
  return (
    <div className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep
            const isUpcoming = stepNumber > currentStep

            return (
              <div key={step} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex items-center">
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                      ${isCompleted 
                        ? 'bg-green-600 border-green-600 text-white' 
                        : isCurrent 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-500'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{stepNumber}</span>
                    )}
                  </div>
                  
                  {/* Step Label */}
                  <div className="ml-3 hidden sm:block">
                    <p
                      className={`
                        text-sm font-medium transition-colors duration-200
                        ${isCompleted 
                          ? 'text-green-600' 
                          : isCurrent 
                            ? 'text-blue-600' 
                            : 'text-gray-500'
                        }
                      `}
                    >
                      {step}
                    </p>
                  </div>
                </div>

                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 mx-4 transition-colors duration-200
                      ${stepNumber < currentStep ? 'bg-green-600' : 'bg-gray-300'}
                    `}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Mobile Step Counter */}
        <div className="sm:hidden mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {steps[currentStep - 1]}
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}