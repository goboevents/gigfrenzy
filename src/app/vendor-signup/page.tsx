import VendorSignupForm from '../../components/VendorSignupForm'
import ProtectedRoute from '../../components/auth/ProtectedRoute'

export default function VendorSignup() {
  return (
    <ProtectedRoute requiredRole="vendor">
      <div className="min-h-screen bg-gray-50 py-12">
        <VendorSignupForm />
      </div>
    </ProtectedRoute>
  )
}
