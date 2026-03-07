import { useState, useEffect } from 'react'
import { Trash2, Search, User, Ban, CheckCircle } from 'lucide-react'

const ManageUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/users`)
            if (!response.ok) throw new Error('Failed to fetch users')
            const data = await response.json()
            setUsers(data)
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/users/${id}`, {
                method: 'DELETE'
            })
            if (!response.ok) throw new Error('Failed to delete user')

            alert('User deleted successfully')
            fetchUsers()
        } catch (error) {
            console.error("Delete error:", error)
            alert("Failed to delete user.")
        }
    }

    const handleToggleBan = async (id, currentlyBanned) => {
        const action = currentlyBanned ? 'unban' : 'ban';
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/users/${id}/ban`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ banned: !currentlyBanned })
            })
            if (!response.ok) throw new Error(`Failed to ${action} user`)

            alert(`User ${action}ned successfully`)
            fetchUsers()
        } catch (error) {
            console.error(`${action} error:`, error)
            alert(`Failed to ${action} user.`)
        }
    }

    const filteredUsers = users.filter(u =>
        (u.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-primary)] flex items-center gap-2">
                        <User className="w-6 h-6" /> Manage Users
                    </h1>
                    <p className="text-[var(--color-text-light)] text-sm mt-1">View and manage all registered users on the platform.</p>
                </div>
            </div>

            <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-secondary)]/20 overflow-hidden">
                <div className="p-6 border-b border-[var(--color-secondary)]/20 flex justify-between items-center bg-[var(--color-surface)]">
                    <div className="relative w-96">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-light)]" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-[var(--color-secondary)]/20 rounded-lg text-sm bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto bg-[var(--color-surface)]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-background)] py-4 text-xs font-semibold text-[var(--color-text-light)] uppercase tracking-wider">
                                <th className="p-4 border-b border-[var(--color-secondary)]/10">User</th>
                                <th className="p-4 border-b border-[var(--color-secondary)]/10">Role</th>
                                <th className="p-4 border-b border-[var(--color-secondary)]/10">Joined Date</th>
                                <th className="p-4 border-b border-[var(--color-secondary)]/10 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-secondary)]/5">
                            {loading ? (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading users...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-500">No users found.</td></tr>
                            ) : filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-[var(--color-background)]/50 transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-[var(--color-text-main)] text-sm">{u.full_name || 'Anonymous'}</p>
                                        <p className="text-xs text-[var(--color-text-light)]">{u.email}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase
                                            ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                u.role === 'seller' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                            {u.role || 'user'}
                                        </span>
                                        {u.banned_until && new Date(u.banned_until) > new Date() && (
                                            <span className="ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-red-100 text-red-700">
                                                Banned
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-[var(--color-text-light)]">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        {u.role !== 'admin' && (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        const isBanned = u.banned_until && new Date(u.banned_until) > new Date();
                                                        handleToggleBan(u.id, isBanned);
                                                    }}
                                                    className={`p-2 rounded-lg transition-colors ${u.banned_until && new Date(u.banned_until) > new Date()
                                                            ? 'text-green-500 hover:bg-green-50'
                                                            : 'text-orange-500 hover:bg-orange-50'
                                                        }`}
                                                    title={u.banned_until && new Date(u.banned_until) > new Date() ? "Unban User" : "Ban User"}
                                                >
                                                    {u.banned_until && new Date(u.banned_until) > new Date() ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ManageUsers
