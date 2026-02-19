import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Store, FileText, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const SellerRegister = () => {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [storeName, setStoreName] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { register } = useAuth() // Reusing the main auth register for now
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            // In a real app, we would pass store metadata to a separate table or metadata field
            await register(email, password, fullName, 'seller')
            // Ideally, we'd then create a 'store' record in the database linked to this user

            alert("Seller account created! Please login.")
            navigate('/seller/login')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-orange-50/30">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row border border-orange-200">
                {/* Illustration Side */}
                <div className="hidden md:block w-1/2 relative bg-orange-50">
                    <img
                        src="https://5.imimg.com/data5/SELLER/Default/2024/7/437930030/NH/RN/KU/133223132/weekly-shonen-jpg-500x500.jpg"
                        alt="Seller Register Visual"
                        className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 to-transparent flex flex-col justify-end p-12 text-white">
                        <h3 className="text-2xl font-bold mb-2">Start Your Journey</h3>
                        <p className="opacity-90">Turn your passion for writing into a business with Bookit.</p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Register as Seller</h2>
                    <p className="text-gray-500 mb-8">Create your store and start selling.</p>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                        placeholder="Your Name"
                                    />
                                    <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Store Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                    placeholder="My Awesome Book Store"
                                />
                                <Store className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                    placeholder="seller@bookit.com"
                                />
                                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                disabled={loading}
                                className="w-full py-3.5 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Account...' : 'Register Store'}
                            </button>
                        </div>
                    </form>

                    <p className="text-center mt-8 text-sm text-gray-500">
                        Already have a seller account? <Link to="/seller/login" className="text-orange-600 font-bold hover:underline">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
export default SellerRegister
