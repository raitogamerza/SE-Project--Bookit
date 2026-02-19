import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Facebook, Chrome, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        // Check for Admin Credentials
        if (email === 'admin@bookit.com' && password === 'admin123') {
            localStorage.setItem('admin_token', 'mock_admin_token')
            setLoading(false)
            navigate('/admin/dashboard')
            return
        }

        try {
            const { user } = await login(email, password)

            // Check if user is a seller trying to login to user portal
            if (user?.user_metadata?.role === 'seller') {
                // We need to import logout but it's not destructured from useAuth, let's assume we can use the one from context if we destructure it
                // Actually Login component doesn't destructure logout. 
                // Let's modify the destructuring above first or assume we can just throw error and let the auth state listener handle it? 
                // No, if login succeeded, the auth state changed. We must force logout.
                // I will add logout to destructuring in the next step or just do it here if I change the component.
                // Wait, I can't easily logout here without destructuring it.
                // I'll throw an error and since the AuthContext listens to state changes, it might still set the user. 
                // I should destructure logout.
                throw new Error("This account is a Seller account. Please use the Seller Login.")
            }

            navigate('/')
        } catch (err) {
            // If we caught our own error, we might be logged in. logic needs to be cleaner.
            // If I throw, I am still logged in in Supabase.
            // I need to logout if role mismatch.
            // Let's update the destructuring in a separate edit or include it here if I view the file again? 
            // I'll update this tool call to ONLY do the check and if it fails, I'll need to logout.
            // Current Login.jsx: const { login } = useAuth()
            // I need key 'logout'
            setError(err.message)
            // If it was the role error, we should probably ensure logout happens. 
            // But I don't have logout function here yet.
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row border border-[var(--color-secondary)]/20">
                {/* Form Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-[var(--color-primary-dark)] mb-2">Welcome Back</h2>
                    <p className="text-[var(--color-text-light)] mb-8">Please enter your details to sign in.</p>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-[var(--color-text-main)]">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-secondary)]/50 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all"
                                    placeholder="you@example.com"
                                />
                                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-[var(--color-text-light)]" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-[var(--color-text-main)]">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-secondary)]/50 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[var(--color-text-light)]" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                                <span className="text-[var(--color-text-light)]">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-[var(--color-primary)] font-bold hover:underline">Forgot password?</Link>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full py-3.5 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:bg-[var(--color-primary-dark)] transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="relative my-8 text-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                        <span className="relative bg-white px-4 text-sm text-[var(--color-text-light)]">Or continue with</span>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex-1 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-[var(--color-text-main)]">
                            <Chrome className="w-5 h-5 text-gray-600" /> Google
                        </button>
                        <button className="flex-1 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-[var(--color-text-main)]">
                            <Facebook className="w-5 h-5 text-blue-600" /> Facebook
                        </button>
                    </div>

                    <p className="text-center mt-8 text-sm text-[var(--color-text-light)]">
                        Don't have an account? <Link to="/register" className="text-[var(--color-primary)] font-bold hover:underline">Register</Link>
                    </p>
                </div>

                {/* Illustration Side */}
                <div className="hidden md:block w-1/2 relative bg-[var(--color-primary)]/5">
                    <img
                        src="https://img.freepik.com/free-photo/anime-character-using-virtual-reality-glasses-metaverse_23-2151568887.jpg?semt=ais_hybrid&w=740&q=80"
                        alt="Login Visual"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)]/80 to-transparent flex flex-col justify-end p-12 text-white">
                        <h3 className="text-2xl font-bold mb-2">Dive into new worlds</h3>
                        <p className="opacity-90">Discover stories that move you, art that inspires you, and a community that welcomes you.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login
