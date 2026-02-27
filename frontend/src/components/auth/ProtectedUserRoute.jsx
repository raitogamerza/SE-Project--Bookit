import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedUserRoute = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    // If a seller tries to access user routes, bounce them to their dashboard
    if (user && user.user_metadata?.role === 'seller') {
        return <Navigate to="/seller/dashboard" replace />
    }

    // Otherwise, allow access (guests and standard users are allowed on public user routes)
    return <Outlet />
}

export default ProtectedUserRoute
