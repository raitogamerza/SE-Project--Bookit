import { useState, useEffect } from 'react'
import { User, Mail, Lock, Camera, Save, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'

const SellerSettings = () => {
    const { user } = useAuth()

    // Profile fields
    const [fullName, setFullName] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [uploading, setUploading] = useState(false)

    // Password fields
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Feedback
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    // Load current user data
    useEffect(() => {
        if (user) {
            setFullName(user.user_metadata?.full_name || '')
            setAvatarUrl(user.user_metadata?.avatar_url || '')
        }
    }, [user])

    // Handle avatar upload
    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        const maxSize = 2 * 1024 * 1024 // 2MB
        if (file.size > maxSize) {
            setError('Image must be smaller than 2MB')
            return
        }

        setUploading(true)
        setError('')
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}/avatar.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('books')
                .upload(fileName, file, { upsert: true })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('books')
                .getPublicUrl(fileName)

            setAvatarUrl(publicUrl)

            // Also update user metadata immediately
            await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            })

            setSuccess('Avatar updated!')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            console.error('Avatar upload error:', err)
            setError('Failed to upload avatar: ' + err.message)
        } finally {
            setUploading(false)
        }
    }

    // Save profile changes
    const handleSaveProfile = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setSuccess('')

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    avatar_url: avatarUrl
                }
            })
            if (updateError) throw updateError
            setSuccess('Profile updated successfully!')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            setError('Failed to update profile: ' + err.message)
        } finally {
            setSaving(false)
        }
    }

    // Change password
    const handleChangePassword = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setSaving(true)
        try {
            const { error: pwError } = await supabase.auth.updateUser({
                password: newPassword
            })
            if (pwError) throw pwError
            setNewPassword('')
            setConfirmPassword('')
            setSuccess('Password changed successfully!')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            setError('Failed to change password: ' + err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="p-8 max-w-3xl mx-auto max-h-screen overflow-y-auto">
            <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">Settings</h1>
            <p className="text-[var(--color-text-light)] mb-8">Manage your seller profile and account settings.</p>

            {/* Feedback Messages */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2 text-sm border border-red-100">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 flex items-center gap-2 text-sm border border-green-100">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    {success}
                </div>
            )}

            {/* Profile Section */}
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-secondary)]/20 p-6 mb-6">
                <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-orange-500" />
                    Profile Information
                </h2>

                {/* Avatar */}
                <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--color-secondary)]/30 bg-[var(--color-secondary)]/10 flex items-center justify-center">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold text-[var(--color-primary)]">
                                    {fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                            )}
                        </div>
                        <label className="absolute -bottom-1 -right-1 p-1.5 bg-orange-500 text-white rounded-full cursor-pointer hover:bg-orange-600 transition-colors shadow-md">
                            <Camera className="w-4 h-4" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <div>
                        <p className="font-semibold text-[var(--color-text-main)]">{fullName || 'No name set'}</p>
                        <p className="text-sm text-[var(--color-text-light)]">{user?.email}</p>
                        {uploading && <p className="text-xs text-orange-500 mt-1">Uploading...</p>}
                    </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-[var(--color-text-main)]">Full Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-secondary)]/20 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-[var(--color-background)]"
                                placeholder="Your full name"
                            />
                            <User className="absolute left-3 top-3.5 w-5 h-5 text-[var(--color-text-light)]" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-[var(--color-text-main)]">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-secondary)]/20 bg-[var(--color-secondary)]/5 text-[var(--color-text-light)] cursor-not-allowed"
                            />
                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-[var(--color-text-light)]" />
                        </div>
                        <p className="text-xs text-[var(--color-text-light)]">Email cannot be changed here.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            {/* Password Section */}
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-secondary)]/20 p-6">
                <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-orange-500" />
                    Change Password
                </h2>

                <form onSubmit={handleChangePassword} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-[var(--color-text-main)]">New Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-secondary)]/20 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-[var(--color-background)]"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[var(--color-text-light)]" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-[var(--color-text-main)]">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--color-secondary)]/20 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-[var(--color-background)]"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[var(--color-text-light)]" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving || !newPassword}
                        className="flex items-center gap-2 px-6 py-3 bg-[var(--color-secondary)]/20 text-[var(--color-text-main)] rounded-xl font-bold hover:bg-[var(--color-secondary)]/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Lock className="w-4 h-4" />
                        {saving ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SellerSettings
