'use client'

import { Builder } from '@builder.io/react'
import { useState, useEffect } from 'react'
import { 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon,
  PhotoIcon,
  GlobeAltIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

interface VendorProfile {
  slug: string
  displayName: string
  headline: string
  bio: string
  location: string
  website: string
  avatarUrl: string
  coverImageUrl: string
  visibility: 'public' | 'private'
}

export default function ProfileManagement() {
  const [profile, setProfile] = useState<VendorProfile>({
    slug: '',
    displayName: '',
    headline: '',
    bio: '',
    location: '',
    website: '',
    avatarUrl: '',
    coverImageUrl: '',
    visibility: 'public'
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState<VendorProfile>(profile)
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/vendor/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile || profile)
        setEditForm(data.profile || profile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/vendor/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setIsEditing(false)
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditForm(profile)
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
          <h2 className="text-2xl font-bold text-gray-900">Business Profile</h2>
          <p className="text-gray-600">Manage your business information and visibility</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Public Profile Link */}
      {profile.slug ? (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">Public Profile</h3>
              <p className="text-sm text-blue-700 mt-1">
                Customers can view your profile at this URL
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={`/vendor/${profile.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <GlobeAltIcon className="h-4 w-4 mr-2" />
                View Profile
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/vendor/${profile.slug}`);
                  setShowCopiedMessage(true);
                  setTimeout(() => setShowCopiedMessage(false), 2000);
                }}
                className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Copy profile URL"
              >
                {showCopiedMessage ? (
                  <>
                    <CheckIcon className="h-4 w-4 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy URL
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="mt-3 p-2 bg-white rounded border border-blue-200">
            <code className="text-sm text-blue-800 font-mono">
              {window.location.origin}/vendor/{profile.slug}
            </code>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Profile Not Public Yet</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Set up your profile slug to create a public-facing profile that customers can view and book from.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cover Image */}
      <div className="mb-8">
        <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
          {profile.coverImageUrl ? (
            <img
              src={profile.coverImageUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <PhotoIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
          {isEditing && (
            <button className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-md hover:bg-opacity-100">
              <PhotoIcon className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.displayName}
                onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your business name"
              />
            ) : (
              <p className="text-lg font-medium text-gray-900">{profile.displayName || 'Not set'}</p>
            )}
          </div>

          {/* Headline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Headline
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.headline}
                onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of your business"
              />
            ) : (
              <p className="text-gray-700">{profile.headline || 'Not set'}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell customers about your business"
              />
            ) : (
              <p className="text-gray-700">{profile.bio || 'Not set'}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPinIcon className="h-4 w-4 inline mr-1" />
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, State or Service area"
              />
            ) : (
              <p className="text-gray-700">{profile.location || 'Not set'}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <GlobeAltIcon className="h-4 w-4 inline mr-1" />
              Website
            </label>
            {isEditing ? (
              <input
                type="url"
                value={editForm.website}
                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourwebsite.com"
              />
            ) : (
              <p className="text-gray-700">
                {profile.website ? (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {profile.website}
                  </a>
                ) : (
                  'Not set'
                )}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700">
                  <PhotoIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2">Profile Picture</p>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Visibility
            </label>
            {isEditing ? (
              <select
                value={editForm.visibility}
                onChange={(e) => setEditForm({ ...editForm, visibility: e.target.value as 'public' | 'private' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            ) : (
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                profile.visibility === 'public' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {profile.visibility === 'public' ? 'Public' : 'Private'}
              </span>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile URL
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.slug}
                onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your-business-name"
              />
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  /vendor/{profile.slug || 'not-set'}
                </p>
                {profile.slug && (
                  <a
                    href={`/vendor/${profile.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <GlobeAltIcon className="h-3 w-3 mr-1" />
                    Open in new tab
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <XMarkIcon className="h-4 w-4 inline mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <CheckIcon className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  )
}

// Register the component with Builder.io
Builder.registerComponent(ProfileManagement, {
  name: 'Vendor Profile Management',
  inputs: [],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/user.png',
  defaultStyles: {
    padding: '20px',
    margin: '20px 0'
  }
})