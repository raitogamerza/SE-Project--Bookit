import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const ForgotPassword = () => {
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
            await resetPassword(email)
            setMessage('Check your inbox for further instructions')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row border border-[var(--color-secondary)]/20">
                {/* Illustration Side */}
                <div className="w-full md:w-1/2 bg-[var(--color-secondary)]/10 p-12 flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <img
                        src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&q=80&w=800"
                        alt="Forgot Password"
                        className="w-3/4 rounded-full aspect-square object-cover mb-6 border-4 border-white shadow-lg z-10"
                    />
                    <h2 className="text-2xl font-bold text-[var(--color-text-main)] z-10">Don't Worry!</h2>
                    <p className="text-[var(--color-text-light)] mt-2 z-10">It happens to the best of us.</p>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12 relative">
                    <Link to="/login" className="absolute top-6 left-6 text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>

                    <div className="mt-8">
                        <h2 className="text-3xl font-bold text-[var(--color-primary-dark)] mb-2">Forgot Password?</h2>
                        <p className="text-[var(--color-text-light)] mb-8">Enter your email and we'll send you a link to reset your password.</p>

                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="bg-green-50 text-green-500 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
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
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--color-secondary)]/30 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all"
                                        placeholder="you@example.com"
                                    />
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-[var(--color-text-light)]" />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full py-3.5 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:bg-[var(--color-primary-dark)] transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
