import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, AlertCircle, Store } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const SellerLogin = () => {
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
        try {
            const { user } = await login(email, password)

            if (user?.user_metadata?.role !== 'seller') {
                throw new Error("This account is not authorized as a Seller. Please use the main login.")
            }

            navigate('/seller')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-orange-50/30">
            <div className="bg-[var(--color-surface)] rounded-3xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row border border-[var(--color-secondary)]/20">
                {/* Form Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <div className="flex items-center gap-2 mb-6 text-orange-600">
                        <Store className="w-6 h-6" />
                        <span className="font-bold uppercase tracking-wider text-sm">Seller Portal</span>
                    </div>

                    <h2 className="text-3xl font-bold text-[var(--color-text-main)] mb-2">Welcome Back, Partner</h2>
                    <p className="text-[var(--color-text-light)] mb-8">Manage your books and earnings.</p>

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
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-secondary)]/20 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                    placeholder="seller@bookit.com"
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
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-secondary)]/20 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[var(--color-text-light)]" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500" />
                                <span className="text-[var(--color-text-light)]">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-orange-600 font-bold hover:underline">Forgot password?</Link>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full py-3.5 bg-orange-600 text-[var(--color-text-inverse)] rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Accessing Dashboard...' : 'Access Dashboard'}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm text-[var(--color-text-light)]">
                        Want to become a seller? <Link to="/seller/guide" className="text-orange-600 font-bold hover:underline">Apply Here</Link>
                    </p>
                </div>

                {/* Illustration Side */}
                <div className="hidden md:block w-1/2 relative bg-orange-50">
                    <img
                        src="https://c4.wallpaperflare.com/wallpaper/141/438/514/anime-manga-jojo-s-bizarre-adventure-stardust-crusaders-naruto-shippuuden-wallpaper-preview.jpg"
                        alt="Seller Visual"
                        className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 to-transparent flex flex-col justify-end p-12 text-[var(--color-text-inverse)]">
                        <h3 className="text-2xl font-bold mb-2">Grow Your Readership</h3>
                        <p className="opacity-90">Join thousands of authors sharing their stories with the world.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SellerLogin
