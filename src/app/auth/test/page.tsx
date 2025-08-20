import { AuthForm } from '@/components/auth/AuthForm'

export default function AuthTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            GigFrenzy Authentication Test
          </h1>
          <p className="mt-2 text-gray-600">
            Test the Supabase authentication system
          </p>
        </div>
        
        <AuthForm />
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This page tests the complete authentication flow:</p>
          <ul className="mt-2 space-y-1">
            <li>• User registration with vendor details</li>
            <li>• User login and session management</li>
            <li>• Supabase integration</li>
            <li>• Database record creation</li>
          </ul>
        </div>
      </div>
    </div>
  )
}