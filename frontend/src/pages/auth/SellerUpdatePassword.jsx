import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, AlertCircle, CheckCircle, Store } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const SellerUpdatePassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { updatePassword } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')

        if (password !== confirmPassword) {
            return setError('Passwords do not match')
        }

        setLoading(true)
        try {
            await updatePassword(password)
            setMessage('Password has been updated')
            setTimeout(() => {
                navigate('/seller/login')
            }, 2000)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-orange-50/30">
            <div className="bg-[var(--color-surface)] rounded-3xl shadow-xl w-full max-w-md overflow-hidden p-8 border border-[var(--color-secondary)]/20 relative">
                
                <div className="flex items-center gap-2 mb-6 text-orange-600 justify-center">
                    <Store className="w-6 h-6" />
                    <span className="font-bold uppercase tracking-wider text-sm">Seller Portal</span>
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">Update Password</h2>
                    <p className="text-[var(--color-text-light)] mb-6">Enter your new secure password below.</p>
                </div>

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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1 text-left">
                        <label className="text-sm font-medium text-[var(--color-text-main)]">New Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-secondary)]/30 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-[var(--color-background)]"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[var(--color-text-light)]" />
                        </div>
                    </div>
                    <div className="space-y-1 text-left">
                        <label className="text-sm font-medium text-[var(--color-text-main)]">Confirm Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-secondary)]/30 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-[var(--color-background)]"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[var(--color-text-light)]" />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-3.5 bg-orange-600 text-[var(--color-text-inverse)] rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                    
                    <div className="text-center mt-6">
                         <Link to="/seller/login" className="text-sm font-medium text-orange-600 hover:underline">
                            Cancel and back to login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SellerUpdatePassword
