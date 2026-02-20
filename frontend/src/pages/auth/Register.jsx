import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Chrome, Facebook, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await register(email, password, fullName, 'user')
            // Supabase default is confirm email, but if disabled it logs in.
            // Check if user is logged in or needs confirmation
            alert("Registration successful! Please check your email for confirmation if required, or login.")
            navigate('/login')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="bg-[var(--color-surface)] rounded-3xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row border border-[var(--color-secondary)]/20">
                {/* Illustration Side */}
                <div className="hidden md:block w-1/2 relative bg-[var(--color-primary)]/5">
                    <img
                        src="https://i.pinimg.com/564x/a6/61/c0/a661c0a731ec1b477c54ade98a706a49.jpg"
                        alt="Register Visual"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)]/80 to-transparent flex flex-col justify-end p-12 text-[var(--color-text-inverse)]">
                        <h3 className="text-2xl font-bold mb-2">Join Our Community</h3>
                        <p className="opacity-90">Create an account to start your collection, follow your favorite authors, and get personalized recommendations.</p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-[var(--color-primary-dark)] mb-2">Create Account</h2>
                    <p className="text-[var(--color-text-light)] mb-8">Join Bookit today for free.</p>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-[var(--color-text-main)]">Full Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-secondary)]/50 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all"
                                    placeholder="Your Name"
                                />
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-[var(--color-text-light)]" />
                            </div>
                        </div>

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

                        <div className="pt-2">
                            <button
                                disabled={loading}
                                className="w-full py-3.5 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-xl font-bold hover:bg-[var(--color-primary-dark)] transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </div>
                    </form>

                    <div className="relative my-8 text-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--color-secondary)]/20"></div></div>
                        <span className="relative bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text-light)]">Or sign up with</span>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex-1 py-2.5 border border-[var(--color-secondary)]/20 rounded-xl hover:bg-[var(--color-background)] transition-colors flex items-center justify-center gap-2 font-medium text-[var(--color-text-main)]">
                            <Chrome className="w-5 h-5 text-[var(--color-text-light)]" /> Google
                        </button>
                        <button className="flex-1 py-2.5 border border-[var(--color-secondary)]/20 rounded-xl hover:bg-[var(--color-background)] transition-colors flex items-center justify-center gap-2 font-medium text-[var(--color-text-main)]">
                            <Facebook className="w-5 h-5 text-blue-600" /> Facebook
                        </button>
                    </div>

                    <p className="text-center mt-8 text-sm text-[var(--color-text-light)]">
                        Already have an account? <Link to="/login" className="text-[var(--color-primary)] font-bold hover:underline">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
export default Register
