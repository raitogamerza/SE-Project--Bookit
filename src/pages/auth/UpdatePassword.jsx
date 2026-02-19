import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const UpdatePassword = () => {
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
                navigate('/login')
            }, 2000)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden p-8 border border-[var(--color-secondary)]/20 relative">
                <Link to="/login" className="absolute top-6 left-6 text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>

                <div className="mt-8 text-center">
                    <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-2">Update Password</h2>
                    <p className="text-[var(--color-text-light)] mb-6">Enter your new password below.</p>
                </div>

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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1 text-left">
                        <label className="text-sm font-medium text-[var(--color-text-main)]">New Password</label>
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
                    <div className="space-y-1 text-left">
                        <label className="text-sm font-medium text-[var(--color-text-main)]">Confirm Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-secondary)]/50 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[var(--color-text-light)]" />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-3.5 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:bg-[var(--color-primary-dark)] transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}
export default UpdatePassword
