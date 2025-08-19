'use client'

import { Builder } from '@builder.io/react'
import { useState } from 'react'

interface DocumentationStepProps {
  stepData?: any
  onComplete: (data: any) => void
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
  allData: any
}

interface Document {
  id: string
  name: string
  description: string
  required: boolean
  uploaded: boolean
  file?: File
  fileName?: string
}

export default function DocumentationStep({
  stepData = {},
  onComplete,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  allData
}: DocumentationStepProps) {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'business-license',
      name: 'Business License',
      description: 'Valid business license or permit',
      required: true,
      uploaded: false
    },
    {
      id: 'insurance',
      name: 'Liability Insurance',
      description: 'Certificate of liability insurance',
      required: true,
      uploaded: false
    },
    {
      id: 'tax-id',
      name: 'Tax ID / EIN',
      description: 'Federal tax identification number',
      required: true,
      uploaded: false
    },
    {
      id: 'health-permit',
      name: 'Health Permit (if applicable)',
      description: 'Health department permit for food services',
      required: false,
      uploaded: false
    },
    {
      id: 'certifications',
      name: 'Professional Certifications',
      description: 'Relevant professional certifications',
      required: false,
      uploaded: false
    },
    {
      id: 'portfolio',
      name: 'Portfolio/Work Samples',
      description: 'Examples of your previous work',
      required: false,
      uploaded: false
    }
  ])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleFileUpload = (documentId: string, file: File) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, uploaded: true, file, fileName: file.name }
        : doc
    ))
  }

  const handleFileRemove = (documentId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, uploaded: false, file: undefined, fileName: undefined }
        : doc
    ))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    const requiredDocs = documents.filter(doc => doc.required)
    const missingRequired = requiredDocs.filter(doc => !doc.uploaded)
    
    if (missingRequired.length > 0) {
      newErrors.documents = `Please upload required documents: ${missingRequired.map(doc => doc.name).join(', ')}`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const uploadedDocs = documents.filter(doc => doc.uploaded).map(doc => ({
        id: doc.id,
        name: doc.name,
        fileName: doc.fileName
      }))
      
      onComplete({
        documents: uploadedDocs,
        allDocuments: documents
      })
      onNext()
    }
  }

  const renderFileInput = (document: Document) => {
    if (document.uploaded && document.fileName) {
      return (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-800 font-medium">{document.fileName}</span>
          </div>
          <button
            type="button"
            onClick={() => handleFileRemove(document.id)}
            className="text-red-500 hover:text-red-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )
    }

    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200">
        <input
          type="file"
          id={`file-${document.id}`}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              handleFileUpload(document.id, file)
            }
          }}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        <label htmlFor={`file-${document.id}`} className="cursor-pointer">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Click to upload
            </span>{' '}
            or drag and drop
          </p>
          <p className="text-xs text-gray-500">PDF, DOC, JPG, PNG up to 10MB</p>
        </label>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Documentation & Verification</h2>
        <p className="text-gray-600">Upload required documents to verify your business</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Document Upload Section */}
        <div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-medium text-blue-900">Document Requirements</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Please upload the required documents to complete your vendor verification. 
                  All documents are securely stored and only used for verification purposes.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((document) => (
              <div key={document.id} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">{document.name}</h4>
                  {document.required && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{document.description}</p>
                {renderFileInput(document)}
              </div>
            ))}
          </div>
          
          {errors.documents && (
            <p className="text-red-500 text-sm mt-4">{errors.documents}</p>
          )}
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I certify that all uploaded documents are current and valid
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I agree to maintain current documentation and update as needed
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I understand that incomplete documentation may delay approval
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-green-900">Upload Progress</h4>
              <p className="text-sm text-green-700">
                {documents.filter(doc => doc.uploaded).length} of {documents.length} documents uploaded
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((documents.filter(doc => doc.uploaded).length / documents.length) * 100)}%
              </div>
              <div className="text-sm text-green-600">Complete</div>
            </div>
          </div>
          <div className="mt-3 w-full bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(documents.filter(doc => doc.uploaded).length / documents.length) * 100}%` 
              }}
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Continue to Pricing & Packages
          </button>
        </div>
      </form>
    </div>
  )
}

// Register the component with Builder.io
Builder.registerComponent(DocumentationStep, {
  name: 'Documentation Step',
  inputs: [],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/file-text.png',
  defaultStyles: {
    padding: '20px',
    margin: '20px 0'
  }
})