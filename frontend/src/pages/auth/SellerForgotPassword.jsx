import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, AlertCircle, CheckCircle, Store } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const SellerForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { resetPassword } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')
        setLoading(true)
        try {
            await resetPassword(email, '/seller/update-password')
            setMessage('Check your inbox for further instructions')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-orange-50/30">
            <div className="bg-[var(--color-surface)] rounded-3xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row border border-[var(--color-secondary)]/20 relative">
                
                {/* Form Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12 relative flex flex-col justify-center">
                    <Link to="/seller/login" className="absolute top-6 left-6 text-[var(--color-text-light)] hover:text-orange-600 transition-colors flex items-center gap-2 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Login</span>
                    </Link>

                    <div className="mt-8">
                        <div className="flex items-center gap-2 mb-6 text-orange-600">
                            <Store className="w-6 h-6" />
                            <span className="font-bold uppercase tracking-wider text-sm">Seller Portal</span>
                        </div>

                        <h2 className="text-3xl font-bold text-[var(--color-text-main)] mb-2">Forgot Password?</h2>
                        <p className="text-[var(--color-text-light)] mb-8">Enter your registered seller email and we'll send you a link to reset your password.</p>

                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--color-text-main)]">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--color-secondary)]/30 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                        placeholder="seller@bookit.com"
                                    />
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-[var(--color-text-light)]" />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full py-3.5 bg-orange-600 text-[var(--color-text-inverse)] rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending Request...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Illustration Side */}
                <div className="hidden md:block w-1/2 relative bg-orange-50">
                    <img
                        src="https://c4.wallpaperflare.com/wallpaper/141/438/514/anime-manga-jojo-s-bizarre-adventure-stardust-crusaders-naruto-shippuuden-wallpaper-preview.jpg"
                        alt="Seller Forgot Password"
                        className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 to-transparent flex flex-col justify-end p-12 text-[var(--color-text-inverse)]">
                        <h3 className="text-2xl font-bold mb-2">Secure Your Account</h3>
                        <p className="opacity-90">Store security is our top priority. Reset your password safely.</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SellerForgotPassword
