import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { User, Mail, Camera, Save, AlertCircle, CheckCircle, BookOpen, Heart, Clock, Settings, LayoutGrid, Award, Star } from 'lucide-react'
import { supabase } from '../../services/supabase'

const Profile = () => {
    const { user } = useAuth()
    const [fullName, setFullName] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        if (user) {
            setFullName(user.user_metadata?.full_name || '')
            setAvatarUrl(user.user_metadata?.avatar_url || '')
        }
    }, [user])

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')
        setError('')

        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    avatar_url: avatarUrl
                }
            })

            if (error) throw error
            setMessage('Profile updated successfully!')
            setTimeout(() => setMessage(''), 3000)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#FAF7F2] pb-12 relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[var(--color-primary)]/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-[var(--color-secondary)]/10 rounded-full blur-3xl -z-0 pointer-events-none"></div>

            {/* Header / Cover */}
            <div className="h-80 relative group z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=2000"
                    alt="Cover"
                    className="w-full h-full object-cover"
                />

                <div className="absolute bottom-0 left-0 w-full p-8 z-20 container mx-auto flex items-end gap-6">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-44 h-44 rounded-full border-4 border-[#FAF7F2] bg-white shadow-2xl overflow-hidden relative z-10 group-avatar">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform duration-500 group-avatar-hover:scale-110" />
                            ) : (
                                <div className="w-full h-full bg-[var(--color-secondary)]/20 flex items-center justify-center text-[var(--color-primary)]">
                                    <User className="w-20 h-20" />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className="absolute bottom-4 right-2 z-20 p-2.5 bg-white text-[var(--color-primary-dark)] rounded-full shadow-lg hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 transform hover:scale-110 hover:rotate-12 border-2 border-[var(--color-primary)]/10"
                            title="Update Avatar"
                        >
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="mb-4 text-white flex-1 drop-shadow-lg">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">{fullName || 'Reader'}</h1>
                            <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                                Level 5
                            </span>
                        </div>
                        <p className="text-lg opacity-90 font-medium flex items-center gap-2">
                            <Mail className="w-4 h-4" /> {user?.email}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Navigation */}
                        <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-secondary)]/20 p-4 space-y-2">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all duration-300 ${activeTab === 'overview' ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20 translate-x-1' : 'text-gray-500 hover:bg-[var(--color-secondary)]/10 hover:text-[var(--color-primary-dark)]'}`}
                            >
                                <LayoutGrid className="w-5 h-5" /> Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all duration-300 ${activeTab === 'settings' ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20 translate-x-1' : 'text-gray-500 hover:bg-[var(--color-secondary)]/10 hover:text-[var(--color-primary-dark)]'}`}
                            >
                                <Settings className="w-5 h-5" /> Settings
                            </button>
                        </div>

                        {/* Achievements Card covering */}
                        <div className="bg-gradient-to-br from-[#FFF8E7] to-white rounded-3xl shadow-sm border border-[var(--color-secondary)]/20 p-6">
                            <h3 className="font-bold text-[var(--color-primary-dark)] mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-[var(--color-primary)]" />
                                Achievements
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="aspect-square rounded-2xl bg-white border border-[var(--color-secondary)]/20 flex flex-col items-center justify-center gap-1 group cursor-help transition-all hover:border-[var(--color-primary)] hover:shadow-md">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                                            <Star className="w-4 h-4 fill-current" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-fade-in-up">
                                {/* Stats Row */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Books Read', value: '12', icon: BookOpen, color: 'blue' },
                                        { label: 'Favorites', value: '45', icon: Heart, color: 'red' },
                                        { label: 'Reading Hours', value: '128', icon: Clock, color: 'amber' },
                                        { label: 'Reviews', value: '8', icon: Star, color: 'purple' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white p-6 rounded-3xl border border-[var(--color-secondary)]/20 shadow-sm flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-300">
                                            <div className={`w-12 h-12 rounded-2xl mb-3 flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                            <h4 className="text-3xl font-black text-[var(--color-primary-dark)]">{stat.value}</h4>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Reading Progress */}
                                <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-secondary)]/20 p-8">
                                    <h2 className="text-xl font-bold text-[var(--color-primary-dark)] mb-6">Currently Reading</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[1, 2].map((i) => (
                                            <div key={i} className="flex gap-5 p-4 rounded-3xl bg-[#FAF7F2] border border-transparent hover:border-[var(--color-secondary)] transition-all group">
                                                <div className="w-20 h-28 bg-gray-200 rounded-xl shadow-md shrink-0 overflow-hidden">
                                                    <img
                                                        src={`https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300&random=${i}`}
                                                        alt="Book Cover"
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex-1 py-1">
                                                    <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">The Wind Rises</h3>
                                                    <p className="text-sm text-gray-500 mb-4">by Hayao Miyazaki</p>

                                                    <div className="flex items-center gap-3 text-sm font-bold text-[var(--color-primary)] mb-2">
                                                        <span>75%</span>
                                                        <span className="text-gray-300 text-xs font-normal">updated 2h ago</span>
                                                    </div>
                                                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[var(--color-primary)] w-3/4 rounded-full"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-3xl shadow-lg shadow-[var(--color-primary)]/5 border border-[var(--color-secondary)]/20 overflow-hidden animate-fade-in-up">
                                <div className="p-8 md:p-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-2xl font-bold text-[var(--color-primary-dark)]">Edit Profile</h2>
                                            <p className="text-gray-400 mt-1">Update your personal information</p>
                                        </div>
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[var(--color-primary)]">
                                            <Settings className="w-6 h-6 animate-spin-slow" />
                                        </div>
                                    </div>

                                    {message && (
                                        <div className="bg-green-50 text-green-600 p-4 rounded-2xl mb-8 flex items-center gap-3 border border-green-100">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                                <CheckCircle className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium">{message}</span>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 flex items-center gap-3 border border-red-100">
                                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                                <AlertCircle className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium">{error}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Display Name</label>
                                                <div className="relative group">
                                                    <input
                                                        type="text"
                                                        value={fullName}
                                                        onChange={(e) => setFullName(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all font-medium text-lg text-gray-800"
                                                        placeholder="Your Name"
                                                    />
                                                    <div className="absolute left-4 top-4 w-6 h-6 flex items-center justify-center bg-gray-200 rounded-lg text-gray-500 group-focus-within:bg-[var(--color-primary)] group-focus-within:text-white transition-colors">
                                                        <User className="w-3.5 h-3.5" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Avatar URL</label>
                                                <div className="relative group">
                                                    <input
                                                        type="url"
                                                        value={avatarUrl}
                                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                                        placeholder="https://..."
                                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all font-medium text-gray-800"
                                                    />
                                                    <div className="absolute left-4 top-4 w-6 h-6 flex items-center justify-center bg-gray-200 rounded-lg text-gray-500 group-focus-within:bg-[var(--color-primary)] group-focus-within:text-white transition-colors">
                                                        <Camera className="w-3.5 h-3.5" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 opacity-60 pointer-events-none">
                                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email</label>
                                                <div className="relative group">
                                                    <input
                                                        type="email"
                                                        value={user?.email || ''}
                                                        disabled
                                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-100 font-medium text-gray-500"
                                                    />
                                                    <div className="absolute left-4 top-4 w-6 h-6 flex items-center justify-center bg-gray-200 rounded-lg text-gray-400">
                                                        <Mail className="w-3.5 h-3.5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                                            <button
                                                disabled={loading}
                                                className="px-8 py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold hover:bg-[var(--color-primary-dark)] transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 flex items-center gap-3 text-lg"
                                            >
                                                <Save className="w-5 h-5" />
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
