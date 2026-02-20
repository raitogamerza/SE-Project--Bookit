import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!user) {
        // Redirect to appropriate login page based on the attempted route
        const isSellerRoute = location.pathname.startsWith('/seller')
        const isAdminRoute = location.pathname.startsWith('/admin')

        if (isSellerRoute) return <Navigate to="/seller/login" replace />
        if (isAdminRoute) return <Navigate to="/login" replace /> // Admin login is merged or separate? Assuming main login for now based on previous context, or sticking to /admin/login if it existed. Actually user said Admin uses main login? Let's check. 
        // Re-reading: Admin login was merged into Main login.

        return <Navigate to="/login" replace />
    }

    if (allowedRoles.length > 0) {
        const userRole = user.user_metadata?.role || 'user'
        if (!allowedRoles.includes(userRole)) {
            // Role mismatch redirect
            if (userRole === 'seller') return <Navigate to="/seller" replace />
            if (userRole === 'user') return <Navigate to="/" replace />
            // if admin, allow access
        }
    }

    return children
}

export default ProtectedRoute
